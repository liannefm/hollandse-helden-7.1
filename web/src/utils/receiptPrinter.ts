// WebUSB ESC/POS Thermal Printer Driver
// Hollandse Helden - Bonnetjeprinter

// --- WebUSB type declarations ---
declare global {
    interface Navigator {
        usb?: {
            getDevices(): Promise<USBDevice[]>;
            requestDevice(options: { filters: Array<{ vendorId: number }> }): Promise<USBDevice>;
        };
    }
    interface USBDevice {
        vendorId: number;
        productName?: string;
        manufacturerName?: string;
        configuration: USBConfiguration | null;
        open(): Promise<void>;
        close(): Promise<void>;
        selectConfiguration(value: number): Promise<void>;
        claimInterface(interfaceNumber: number): Promise<void>;
        releaseInterface(interfaceNumber: number): Promise<void>;
        transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
    }
    interface USBConfiguration {
        interfaces: USBInterface[];
    }
    interface USBInterface {
        interfaceNumber: number;
        alternates: USBAlternateInterface[];
    }
    interface USBAlternateInterface {
        endpoints: USBEndpoint[];
    }
    interface USBEndpoint {
        direction: 'in' | 'out';
        endpointNumber: number;
        type: 'bulk' | 'interrupt' | 'isochronous' | 'control';
    }
    interface USBOutTransferResult {
        bytesWritten: number;
        status: string;
    }
}

// --- Printer vendor filters ---
const THERMAL_PRINTER_FILTERS = [
    { vendorId: 0x04b8 }, // Epson
    { vendorId: 0x0519 }, // Star Micronics
    { vendorId: 0x1d90 }, // Citizen
    { vendorId: 0x1504 }, // Bixolon
    { vendorId: 0x0483 }, // Generic Chinese / Xprinter POS-58/80
    { vendorId: 0x0fe6 }, // SNBC
    { vendorId: 0x0416 }, // Zjiang / Cashino
    { vendorId: 0x0dd4 }, // Custom SPA
    { vendorId: 0x28E9 }, // GD32 (Xprinter XP-58/80)
    { vendorId: 0x067b }, // Prolific
];

// --- ESC/POS byte constants ---
const ESC = 0x1b;
const GS  = 0x1d;
const LF  = 0x0a;

const CMD = {
    INIT:          [ESC, 0x40],
    LF:            [LF],
    FEED:          (n: number) => [ESC, 0x64, n],
    ALIGN_LEFT:    [ESC, 0x61, 0x00],
    ALIGN_CENTER:  [ESC, 0x61, 0x01],
    ALIGN_RIGHT:   [ESC, 0x61, 0x02],
    BOLD_ON:       [ESC, 0x45, 0x01],
    BOLD_OFF:      [ESC, 0x45, 0x00],
    SIZE:          (w: number, h: number) => [GS, 0x21, ((Math.min(w, 8) - 1) << 4) | (Math.min(h, 8) - 1)],
    CUT:           (n = 3) => [GS, 0x56, 0x42, n],
    UPSIDE_DOWN_ON:  [ESC, 0x7B, 0x01], // Rotate all characters 180° (for inverted printer)
    UPSIDE_DOWN_OFF: [ESC, 0x7B, 0x00],
    SET_LEFT_MARGIN: (dots: number) => [GS, 0x4c, dots & 0xff, (dots >> 8) & 0xff],
};

const encoder = new TextEncoder();

// --- Interfaces ---

export interface ReceiptItem {
    name: string;
    quantity: number;
    price: number;
}

export interface ReceiptData {
    pickupNumber: number;
    orderType: 'here' | 'take_away' | null;
    items: ReceiptItem[];
    totalPrice: number;
    language?: string;
}

// --- ThermalPrinter class ---

export class ThermalPrinter {
    private device: USBDevice | null = null;
    private interfaceNumber: number | null = null;
    private endpointOut: number | null = null;
    private _buffer: number[] = [];

    /** Printer is physically mounted upside-down — always enabled */
    invertMode = true;

    static isSupported(): boolean {
        return 'usb' in navigator;
    }

    async getPairedDevices(): Promise<USBDevice[]> {
        if (!ThermalPrinter.isSupported() || !navigator.usb) return [];
        const devices = await navigator.usb.getDevices();
        return devices.filter(d =>
            THERMAL_PRINTER_FILTERS.some(f => f.vendorId === d.vendorId)
        );
    }

    // Must be called from a user gesture (click)
    async requestDevice(): Promise<boolean> {
        if (!ThermalPrinter.isSupported() || !navigator.usb) {
            throw new Error('WebUSB niet ondersteund');
        }
        try {
            this.device = await navigator.usb.requestDevice({ filters: THERMAL_PRINTER_FILTERS });
            return true;
        } catch (err: unknown) {
            if ((err as { name: string }).name === 'NotFoundError') return false;
            throw err;
        }
    }

    async connect(device?: USBDevice): Promise<void> {
        if (device) this.device = device;
        if (!this.device) throw new Error('Geen printer geselecteerd');

        await this.device.open();
        if (this.device.configuration === null) {
            await this.device.selectConfiguration(1);
        }

        const iface = this.device.configuration!.interfaces.find(i =>
            i.alternates.some(alt =>
                alt.endpoints.some(ep => ep.direction === 'out' && ep.type === 'bulk')
            )
        );
        if (!iface) throw new Error('Geen bulk OUT endpoint gevonden op printer');

        this.interfaceNumber = iface.interfaceNumber;
        await this.device.claimInterface(this.interfaceNumber);

        const alt = iface.alternates.find(a =>
            a.endpoints.some(ep => ep.direction === 'out' && ep.type === 'bulk')
        )!;
        this.endpointOut = alt.endpoints.find(
            ep => ep.direction === 'out' && ep.type === 'bulk'
        )!.endpointNumber;
    }

    async disconnect(): Promise<void> {
        if (!this.device) return;
        try {
            if (this.interfaceNumber !== null) {
                await this.device.releaseInterface(this.interfaceNumber);
            }
            await this.device.close();
        } catch { /* negeer */ }
        this.device = null;
        this.interfaceNumber = null;
        this.endpointOut = null;
    }

    get deviceName(): string | null {
        return this.device?.productName || this.device?.manufacturerName || null;
    }

    async sendRaw(data: Uint8Array): Promise<void> {
        if (!this.device || this.endpointOut === null) throw new Error('Niet verbonden met printer');
        // Cast to ArrayBuffer to satisfy TypeScript's strict BufferSource typing
        await this.device.transferOut(this.endpointOut, data.buffer as ArrayBuffer);
    }

    // --- Chainable command builder ---

    private _push(bytes: number[]): this { this._buffer.push(...bytes); return this; }

    init():   this { return this._push(CMD.INIT); }
    left():   this { return this._push(CMD.ALIGN_LEFT); }
    center(): this { return this._push(CMD.ALIGN_CENTER); }
    right():  this { return this._push(CMD.ALIGN_RIGHT); }
    bold(on = true): this { return this._push(on ? CMD.BOLD_ON : CMD.BOLD_OFF); }
    size(w = 1, h = 1): this { return this._push(CMD.SIZE(w, h)); }
    feed(n = 1): this { return this._push(CMD.FEED(n)); }
    cut(): this { return this._push(CMD.CUT(3)); }

    text(str: string): this {
        this._push([...encoder.encode(str)]);
        return this._push(CMD.LF);
    }

    // 42 cols = veilige breedte voor 80mm thermische printers (Font A)
    line(char = '-', cols = 42): this { return this.text(char.repeat(cols)); }
    doubleLine(cols = 42): this { return this.text('='.repeat(cols)); }

    // Two-column row: left-aligned + right-aligned
    row(left: string, right: string, cols = 42): this {
        const gap = cols - left.length - right.length;
        return this.text(left + ' '.repeat(Math.max(gap, 1)) + right);
    }

    async print(): Promise<void> {
        if (this._buffer.length === 0) return;
        const data = new Uint8Array(this._buffer);
        this._buffer = [];
        await this.sendRaw(data);
    }

    // --- Hollandse Helden receipt builder ---

    async printReceipt(data: ReceiptData): Promise<void> {
        const pickupStr = String(data.pickupNumber).padStart(2, '0');
        const vatRate   = 0.09;
        const totalNum  = Number(data.totalPrice);
        const vatAmount = totalNum - (totalNum / (1 + vatRate));
        const subtotal  = totalNum - vatAmount;
        const itemCount = data.items.reduce((s, i) => s + i.quantity, 0);

        const now  = new Date();
        const date = now.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const time = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

        const orderTypeText = data.orderType === 'here' ? 'HIER ETEN' : 'MEENEMEN';

        this.init();
        // Apply upside-down mode after INIT (INIT resets all printer settings)
        if (this.invertMode) this._push(CMD.UPSIDE_DOWN_ON);
        // Left margin ~3mm (24 dots @ 203 DPI) so text doesn't clip against the paper edge
        this._push(CMD.SET_LEFT_MARGIN(24));

        this
            // ─── Header ───
            .center()
            .bold(true).size(2, 2).text('HOLLANDSE')
            .text('HELDEN')
            .size(1, 1).bold(false)
            .text('Het Haagse Straatvoedsel')
            .text('hollandsehelden.nl')
            .doubleLine()
            // ─── Bestelinfo ───
            .left()
            .row(`Datum: ${date}`, `Tijd: ${time}`)
            .row(`Bon: #${pickupStr}`, `Art.: ${itemCount}`)
            .row('Terminal: KIOSK-01', orderTypeText)
            .line()
            // ─── Items ───
            .bold(true).text('BESTELLING').bold(false)
            .feed(1);

        for (const item of data.items) {
            this
                .bold(true).text(`${item.quantity}x ${item.name}`).bold(false)
                .row(`  @ EUR ${item.price.toFixed(2)}`, `EUR ${(item.price * item.quantity).toFixed(2)}`);
        }

        this
            .line()
            .row('Subtotaal excl. BTW', `EUR ${subtotal.toFixed(2)}`)
            .row('BTW 9%', `EUR ${vatAmount.toFixed(2)}`)
            .doubleLine()
            .bold(true).size(1, 2)
            .row('TOTAAL', `EUR ${totalNum.toFixed(2)}`)
            .size(1, 1).bold(false)
            .doubleLine()
            // ─── Bestelnummer ───
            .center()
            .bold(true).text('UW BESTELNUMMER')
            .size(4, 4).text(pickupStr).size(1, 1)
            .bold(false)
            .text('Wacht tot uw nummer wordt geroepen')
            .line()
            // ─── Footer ───
            .center()
            .text('Bedankt voor uw bestelling!')
            .bold(true).text('Eet smakelijk!').bold(false)
            .feed(1)
            .text('KVK 12345678 | BTW NL123456789B01')
            .feed(3)
            .cut();

        await this.print();
    }
}
