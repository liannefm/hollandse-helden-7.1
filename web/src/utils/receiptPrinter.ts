// ESC/POS Receipt Printer Utility
// Generates nicely formatted receipts for thermal printers

// WebUSB type declarations (not included in standard TS lib)
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
        selectConfiguration(configurationValue: number): Promise<void>;
        claimInterface(interfaceNumber: number): Promise<void>;
        transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
    }

    interface USBConfiguration {
        interfaces: USBInterface[];
    }

    interface USBInterface {
        alternates: USBAlternateInterface[];
    }

    interface USBAlternateInterface {
        endpoints: USBEndpoint[];
    }

    interface USBEndpoint {
        direction: 'in' | 'out';
        endpointNumber: number;
    }

    interface USBOutTransferResult {
        bytesWritten: number;
        status: string;
    }
}

// ESC/POS Commands
const ESC = '\x1B';
const GS = '\x1D';
const INIT = ESC + '\x40';            // Initialize printer
const CENTER = ESC + '\x61\x01';      // Center align
const LEFT = ESC + '\x61\x00';        // Left align
const _RIGHT = ESC + '\x61\x02';      // Right align (available for future use)
const BOLD_ON = ESC + '\x45\x01';     // Bold on
const BOLD_OFF = ESC + '\x45\x00';    // Bold off
const DOUBLE_HEIGHT = ESC + '\x21\x10';   // Double height
const _DOUBLE_WIDTH = ESC + '\x21\x20';   // Double width (available for future use)
const DOUBLE_SIZE = ESC + '\x21\x30';     // Double width + height
const NORMAL_SIZE = ESC + '\x21\x00';     // Normal size
const CUT = GS + '\x56\x00';         // Full cut
const FEED = '\n';

// Printer paper width (48 characters for 80mm paper, 32 for 58mm)
const LINE_WIDTH = 48;

// ---- Helper functions ----

function line(char = '-'): string {
    return char.repeat(LINE_WIDTH) + FEED;
}

function doubleLine(): string {
    return '='.repeat(LINE_WIDTH) + FEED;
}

function emptyLine(): string {
    return FEED;
}

function padRight(text: string, width: number): string {
    return text.length >= width ? text.substring(0, width) : text + ' '.repeat(width - text.length);
}

function padLeft(text: string, width: number): string {
    return text.length >= width ? text.substring(0, width) : ' '.repeat(width - text.length) + text;
}

/**
 * Create a line with text on the left and right side
 */
function leftRight(leftText: string, rightText: string): string {
    const space = LINE_WIDTH - leftText.length - rightText.length;
    if (space < 1) {
        return leftText.substring(0, LINE_WIDTH - rightText.length - 1) + ' ' + rightText + FEED;
    }
    return leftText + ' '.repeat(space) + rightText + FEED;
}

// ---- Receipt item types ----

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

// ---- Translations ----

const translations: Record<string, Record<string, string>> = {
    nl: {
        order_number: 'BESTELNUMMER',
        eat_here: 'HIER ETEN',
        take_away: 'MEENEMEN',
        item: 'Artikel',
        qty: 'Aantal',
        price: 'Prijs',
        subtotal: 'Subtotaal',
        total: 'TOTAAL',
        thank_you: 'Bedankt voor uw bestelling!',
        enjoy: 'Eet smakelijk!',
        keep_receipt: 'Bewaar dit bonnetje als bewijs',
    },
    en: {
        order_number: 'ORDER NUMBER',
        eat_here: 'EAT HERE',
        take_away: 'TAKE AWAY',
        item: 'Item',
        qty: 'Qty',
        price: 'Price',
        subtotal: 'Subtotal',
        total: 'TOTAL',
        thank_you: 'Thank you for your order!',
        enjoy: 'Enjoy your meal!',
        keep_receipt: 'Keep this receipt as proof',
    },
    de: {
        order_number: 'BESTELLNUMMER',
        eat_here: 'HIER ESSEN',
        take_away: 'ZUM MITNEHMEN',
        item: 'Artikel',
        qty: 'Menge',
        price: 'Preis',
        subtotal: 'Zwischensumme',
        total: 'GESAMT',
        thank_you: 'Vielen Dank für Ihre Bestellung!',
        enjoy: 'Guten Appetit!',
        keep_receipt: 'Bewahren Sie diesen Beleg auf',
    },
};

function t(key: string, lang: string = 'nl'): string {
    return translations[lang]?.[key] || translations['nl'][key] || key;
}

// ---- Format date/time ----

function formatDateTime(): string {
    const now = new Date();
    const date = now.toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    const time = now.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${date}  ${time}`;
}

// ---- Build the receipt ----

export function buildReceipt(data: ReceiptData): string {
    const lang = data.language || 'nl';
    const pickupStr = String(data.pickupNumber).padStart(2, '0');

    let receipt = '';

    // Initialize printer
    receipt += INIT;

    // ---- Header ----
    receipt += emptyLine();
    receipt += CENTER;
    receipt += BOLD_ON;
    receipt += DOUBLE_SIZE;
    receipt += 'HOLLANDSE' + FEED;
    receipt += 'HELDEN' + FEED;
    receipt += NORMAL_SIZE;
    receipt += BOLD_OFF;
    receipt += emptyLine();

    // ---- Order number (BIG) ----
    receipt += CENTER;
    receipt += doubleLine();
    receipt += BOLD_ON;
    receipt += t('order_number', lang) + FEED;
    receipt += DOUBLE_SIZE;
    receipt += `# ${pickupStr}` + FEED;
    receipt += NORMAL_SIZE;
    receipt += BOLD_OFF;

    // ---- Order type ----
    if (data.orderType) {
        receipt += emptyLine();
        receipt += BOLD_ON;
        const orderTypeText = data.orderType === 'here'
            ? t('eat_here', lang)
            : t('take_away', lang);
        receipt += `[ ${orderTypeText} ]` + FEED;
        receipt += BOLD_OFF;
    }

    receipt += doubleLine();
    receipt += emptyLine();

    // ---- Items ----
    receipt += LEFT;
    receipt += BOLD_ON;
    receipt += leftRight(t('item', lang), t('price', lang));
    receipt += BOLD_OFF;
    receipt += line();

    for (const item of data.items) {
        const qtyPrefix = `${item.quantity}x `;
        const priceStr = `EUR ${(item.price * item.quantity).toFixed(2)}`;
        const nameMaxWidth = LINE_WIDTH - priceStr.length - qtyPrefix.length - 1;

        // If name is too long, wrap it
        if (item.name.length > nameMaxWidth) {
            receipt += qtyPrefix + item.name.substring(0, nameMaxWidth) + FEED;
            receipt += padLeft(priceStr, LINE_WIDTH) + FEED;
        } else {
            receipt += leftRight(qtyPrefix + item.name, priceStr);
        }

        // Show unit price if quantity > 1
        if (item.quantity > 1) {
            receipt += padRight('', qtyPrefix.length) + `@ EUR ${item.price.toFixed(2)}` + FEED;
        }
    }

    // ---- Total ----
    receipt += line();
    receipt += emptyLine();
    receipt += BOLD_ON;
    receipt += DOUBLE_HEIGHT;
    receipt += leftRight(t('total', lang), `EUR ${data.totalPrice.toFixed(2)}`);
    receipt += NORMAL_SIZE;
    receipt += BOLD_OFF;
    receipt += emptyLine();
    receipt += line();

    // ---- Date/time ----
    receipt += LEFT;
    receipt += formatDateTime() + FEED;
    receipt += emptyLine();

    // ---- Footer ----
    receipt += CENTER;
    receipt += BOLD_ON;
    receipt += t('thank_you', lang) + FEED;
    receipt += t('enjoy', lang) + FEED;
    receipt += BOLD_OFF;
    receipt += emptyLine();
    receipt += t('keep_receipt', lang) + FEED;

    // ---- Feed and cut ----
    receipt += emptyLine();
    receipt += emptyLine();
    receipt += emptyLine();
    receipt += CUT;

    return receipt;
}

// ---- Printer connection & printing ----

const PRINTER_VENDORS = [
    0x0483, // STM Microelectronics (Xprinter)
    0x04b8, // Seiko Epson
    0x0456, // Microtek
    0x067b, // Prolific Technology
];

let selectedDevice: USBDevice | null = null;

/**
 * Auto-detect a USB thermal printer
 */
export async function autoDetectPrinter(): Promise<boolean> {
    try {
        if (!navigator.usb) {
            console.warn('WebUSB niet ondersteund');
            return false;
        }

        // Try to get already authorized devices
        const devices = await navigator.usb.getDevices();
        const printer = devices.find((device: USBDevice) =>
            PRINTER_VENDORS.includes(device.vendorId)
        );

        if (printer) {
            selectedDevice = printer;
            console.log(`Printer gevonden: ${printer.productName || printer.manufacturerName}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error('Auto-detect Error:', error);
        return false;
    }
}

/**
 * Request user to manually select a USB printer
 */
export async function selectPrinter(): Promise<boolean> {
    try {
        if (!navigator.usb) {
            throw new Error('WebUSB niet ondersteund');
        }

        const filters = PRINTER_VENDORS.map(vendorId => ({ vendorId }));
        selectedDevice = await navigator.usb.requestDevice({ filters });
        console.log(`Printer geselecteerd: ${selectedDevice.productName || selectedDevice.manufacturerName}`);
        return true;
    } catch (error) {
        console.error('Printer selectie fout:', error);
        return false;
    }
}

/**
 * Print a receipt via USB
 */
export async function printReceiptUSB(receiptData: ReceiptData): Promise<boolean> {
    try {
        // If no device selected, try auto-detect first
        if (!selectedDevice) {
            const found = await autoDetectPrinter();
            if (!found) {
                console.warn('Geen printer gevonden. Probeer handmatig te selecteren.');
                return false;
            }
        }

        if (!selectedDevice) return false;

        await selectedDevice.open();

        if (selectedDevice.configuration === null) {
            await selectedDevice.selectConfiguration(1);
        }

        try {
            await selectedDevice.claimInterface(0);
        } catch {
            console.log('Interface al geclaimd, doorgaan...');
        }

        const encoder = new TextEncoder();
        const receipt = buildReceipt(receiptData);

        // Find the output endpoint
        const intf = selectedDevice.configuration!.interfaces[0].alternates[0];
        const endpoint = intf.endpoints.find((e: USBEndpoint) => e.direction === 'out');

        if (!endpoint) {
            throw new Error('Output endpoint niet gevonden');
        }

        await selectedDevice.transferOut(endpoint.endpointNumber, encoder.encode(receipt));

        console.log('Bon succesvol geprint!');

        setTimeout(() => {
            selectedDevice?.close();
        }, 1000);

        return true;
    } catch (error) {
        console.error('USB Print Error:', error);
        return false;
    }
}

/**
 * Print a receipt via network (xprint.php)
 */
export async function printReceiptNetwork(receiptData: ReceiptData): Promise<boolean> {
    try {
        const receipt = buildReceipt(receiptData);

        const response = await fetch('xprint.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'print',
                receipt,
            }),
        });

        const data = await response.json();

        if (data.success) {
            console.log('Bon succesvol geprint via netwerk!');
            return true;
        } else {
            console.error('Printerfout:', data.error);
            return false;
        }
    } catch (error) {
        console.error('Network Print Error:', error);
        return false;
    }
}

/**
 * Try to print receipt - first try USB, then fall back to network
 */
export async function printReceipt(receiptData: ReceiptData): Promise<boolean> {
    // Try USB first
    if (navigator.usb as unknown) {
        const usbSuccess = await printReceiptUSB(receiptData);
        if (usbSuccess) return true;
    }

    // Fall back to network
    const networkSuccess = await printReceiptNetwork(receiptData);
    return networkSuccess;
}
