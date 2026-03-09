// WebUSB ESC/POS thermal printer driver for 80mm receipt printers

const THERMAL_PRINTER_FILTERS = [
  { vendorId: 0x04b8 }, // Epson
  { vendorId: 0x0519 }, // Star Micronics
  { vendorId: 0x1d90 }, // Citizen
  { vendorId: 0x1504 }, // Bixolon
  { vendorId: 0x0483 }, // Generic Chinese (POS-58/80)
  { vendorId: 0x0fe6 }, // SNBC
  { vendorId: 0x0416 }, // Zjiang / Cashino
  { vendorId: 0x0dd4 }, // Custom SPA
];

const ESC = 0x1b;
const GS = 0x1d;
const LF = 0x0a;

const CMD = {
  INIT:         [ESC, 0x40],
  LF:           [LF],
  FEED:         (n) => [ESC, 0x64, n],
  ALIGN_LEFT:   [ESC, 0x61, 0x00],
  ALIGN_CENTER: [ESC, 0x61, 0x01],
  ALIGN_RIGHT:  [ESC, 0x61, 0x02],
  BOLD_ON:      [ESC, 0x45, 0x01],
  BOLD_OFF:     [ESC, 0x45, 0x00],
  UNDERLINE_ON: [ESC, 0x2d, 0x01],
  UNDERLINE_OFF:[ESC, 0x2d, 0x00],
  SIZE:         (w, h) => [GS, 0x21, ((Math.min(w, 8) - 1) << 4) | (Math.min(h, 8) - 1)],
  CUT:          (n = 3) => [GS, 0x56, 0x42, n],
};

const encoder = new TextEncoder();

const funMessages = [
  "Lettuce celebrate your order! 🌿",
  "You're one in a melon! 🍈",
  "Don't kale my vibe! 🥬",
  "Peas, love & good food 🌱",
  "You did a grape thing today! 🍇",
  "This meal saved ~1,100L of water 💧",
  "Plants powered. Future approved. 🌍",
  "Herb your enthusiasm! 🌿",
  "Sow good, so tasty! 🌻",
  "A beet-iful choice! 🫀",
];

export class ThermalPrinter {
  constructor() {
    this.device = null;
    this.interfaceNumber = null;
    this.endpointOut = null;
    this._buffer = [];
  }

  static isSupported() {
    return 'usb' in navigator;
  }

  async getPairedDevices() {
    if (!ThermalPrinter.isSupported()) return [];
    const devices = await navigator.usb.getDevices();
    return devices.filter(d =>
      THERMAL_PRINTER_FILTERS.some(f => f.vendorId === d.vendorId)
    );
  }

  // Must be called from a user gesture (click)
  async requestDevice() {
    if (!ThermalPrinter.isSupported()) throw new Error('WebUSB not supported');
    try {
      this.device = await navigator.usb.requestDevice({ filters: THERMAL_PRINTER_FILTERS });
      return true;
    } catch (err) {
      if (err.name === 'NotFoundError') return false;
      throw err;
    }
  }

  async connect(device = null) {
    if (device) this.device = device;
    if (!this.device) throw new Error('No device selected');

    await this.device.open();
    if (this.device.configuration === null) {
      await this.device.selectConfiguration(1);
    }

    const iface = this.device.configuration.interfaces.find(i =>
      i.alternates.some(alt =>
        alt.endpoints.some(ep => ep.direction === 'out' && ep.type === 'bulk')
      )
    );
    if (!iface) throw new Error('No bulk OUT endpoint found on printer');

    this.interfaceNumber = iface.interfaceNumber;
    await this.device.claimInterface(this.interfaceNumber);

    const alt = iface.alternates.find(a =>
      a.endpoints.some(ep => ep.direction === 'out' && ep.type === 'bulk')
    );
    this.endpointOut = alt.endpoints.find(
      ep => ep.direction === 'out' && ep.type === 'bulk'
    ).endpointNumber;
  }

  async disconnect() {
    if (!this.device) return;
    try {
      await this.device.releaseInterface(this.interfaceNumber);
      await this.device.close();
    } catch {}
    this.device = null;
    this.interfaceNumber = null;
    this.endpointOut = null;
  }

  async sendRaw(data) {
    if (!this.device || this.endpointOut === null) throw new Error('Not connected');
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    await this.device.transferOut(this.endpointOut, bytes);
  }

  // ─── Chainable command builder ───

  _push(bytes) { this._buffer.push(...bytes); return this; }

  init()    { return this._push(CMD.INIT); }
  left()    { return this._push(CMD.ALIGN_LEFT); }
  center()  { return this._push(CMD.ALIGN_CENTER); }
  right()   { return this._push(CMD.ALIGN_RIGHT); }
  bold(on = true) { return this._push(on ? CMD.BOLD_ON : CMD.BOLD_OFF); }
  underline(on = true) { return this._push(on ? CMD.UNDERLINE_ON : CMD.UNDERLINE_OFF); }
  size(w = 1, h = 1) { return this._push(CMD.SIZE(w, h)); }
  feed(n = 1) { return this._push(CMD.FEED(n)); }
  cut() { return this._push(CMD.CUT(3)); }

  text(str) {
    this._push([...encoder.encode(str)]);
    return this._push(CMD.LF);
  }

  line(char = '-', cols = 48) { return this.text(char.repeat(cols)); }
  doubleLine(cols = 48) { return this.text('='.repeat(cols)); }

  // Two-column row: left-aligned text + right-aligned text
  row(left, right, cols = 48) {
    const gap = cols - left.length - right.length;
    return this.text(left + ' '.repeat(Math.max(gap, 1)) + right);
  }

  // ESC/POS QR code (Epson TM-T88V+, TM-T20II+, most modern printers)
  qrCode(data, moduleSize = 6, ecLevel = 'M') {
    const ecMap = { L: 48, M: 49, Q: 50, H: 51 };
    const ec = ecMap[ecLevel] || 49;
    const dataBytes = encoder.encode(data);
    const storeLen = dataBytes.length + 3;

    this._push([GS, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 50, 0x00]);
    this._push([GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, moduleSize]);
    this._push([GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, ec]);
    this._push([GS, 0x28, 0x6b, storeLen & 0xff, (storeLen >> 8) & 0xff, 0x31, 0x50, 0x30, ...dataBytes]);
    this._push([GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30]);
    return this;
  }

  async print() {
    if (this._buffer.length === 0) return;
    const data = new Uint8Array(this._buffer);
    this._buffer = [];
    await this.sendRaw(data);
  }

  // ─── Receipt builder ───

  static getRandomFunMessage() {
    return funMessages[Math.floor(Math.random() * funMessages.length)];
  }

  // ─── Ticket system ───

  printTicket(type, pickupNum) {
    this.line();
    this.center();
    switch (type) {
      case 'animals':     this._ticketAnimals(); break;
      case 'maze':        this._ticketMaze(); break;
      case 'certificate': this._ticketCertificate(pickupNum); break;
      case 'dare':        this._ticketDare(); break;
      case 'fortune':     this._ticketFortune(); break;
      case 'mystery':     this._ticketMystery(pickupNum); break;
      case 'agent':       this._ticketAgent(pickupNum); break;
      case 'loveletter':  this._ticketLoveLetter(); break;
      case 'trivia':      this._ticketTrivia(); break;
      default:            this.text(ThermalPrinter.getRandomFunMessage());
    }
    return this;
  }

  _ticketAnimals() {
    const animals = [
      {
        art: [
          '        \\   ^__^',
          '         \\  (oo)\\_______',
          '            (__)\\       )\\/\\',
          '                ||----w |',
          '                ||     ||',
        ],
        name: 'BESSIE THE COW',
        msg: 'Mooo! Thanks for not eating me!',
      },
      {
        art: [
          '           \\/',
          '       \\  (o>',
          '        \\\\/|',
          '         \\/ |',
          '         |  |_',
          '         |  | )',
          '        _|__|_/',
          '       (______)/',
        ],
        name: 'CLUCKY THE CHICKEN',
        msg: 'Bawk! You are egg-cellent!',
      },
      {
        art: [
          '         ^  ^',
          '        (o  o)',
          '       /  ||  \\',
          '      *  _||_  *',
          '         """"',
        ],
        name: 'HAMLET THE PIG',
        msg: 'Oink! You just saved my bacon!',
      },
    ];
    const a = animals[Math.floor(Math.random() * animals.length)];
    this.bold(true).size(1, 2).text('ANIMAL FRIENDS').size(1, 1).bold(false);
    this.feed(1);
    this.left();
    for (const line of a.art) this.text(line);
    this.center();
    this.feed(1);
    this.bold(true).text(a.name).bold(false);
    this.text(a.msg);
    this.feed(1);
    this.text('"Every plant meal saves a friend"');
    return this;
  }

  _ticketMaze() {
    const mazes = [
      {
        art: [
          '    IN',
          '    v',
          '  +--+--+--+--+--+',
          '  |        |     |',
          '  +--+--+  +  +  +',
          '  |     |     |  |',
          '  +  +  +--+--+  +',
          '  |  |     |     |',
          '  +  +--+  +  +--+',
          '  |        |      ',
          '  +--+--+--+--+--+',
          '               OUT>',
        ],
      },
      {
        art: [
          '    IN',
          '    v',
          '  +--+--+--+--+--+',
          '  |     |     |  |',
          '  +  +  +  +--+  +',
          '  |  |  |  |     |',
          '  +  +--+  +  +--+',
          '  |     |  |  |  |',
          '  +--+  +  +--+  +',
          '  |              |',
          '  +--+--+--+--+--+',
          '               OUT>',
        ],
      },
      {
        art: [
          '    IN',
          '    v',
          '  +--+--+--+--+--+',
          '  |  |     |     |',
          '  +  +  +--+  +  +',
          '  |     |     |  |',
          '  +--+--+  +--+  +',
          '  |        |     |',
          '  +  +--+--+  +--+',
          '  |           |   ',
          '  +--+--+--+--+--+',
          '               OUT>',
        ],
      },
    ];
    const m = mazes[Math.floor(Math.random() * mazes.length)];
    this.bold(true).size(1, 2).text('MAZE RUNNER').size(1, 1).bold(false);
    this.text('Find your way to the salad bar!');
    this.feed(1);
    this.left();
    for (const line of m.art) this.text(line);
    this.center();
    this.feed(1);
    this.text('(tip: use a pen to trace it!)');
    return this;
  }

  _ticketCertificate(pickupNum) {
    this.bold(true).size(1, 2).text('=============================').size(1, 1).bold(false);
    this.feed(0);
    this.bold(true).text('CERTIFICATE OF ACHIEVEMENT');
    this.size(1, 2).text('PLANT HERO AWARD').size(1, 1).bold(false);
    this.feed(0);
    this.text('This officially certifies that');
    this.feed(0);
    this.bold(true).size(2, 2).text('#' + pickupNum).size(1, 1).bold(false);
    this.feed(0);
    this.text('is hereby recognized as a');
    this.bold(true).text('CERTIFIED PLANT HERO').bold(false);
    this.feed(1);
    this.text('On this day, you have saved:');
    this.left();
    this.text('  * 1 animal friend');
    this.text('  * 1,100 liters of water');
    this.text('  * 4.5 kg of CO2 emissions');
    this.text('  * 4.5 sqm of forest');
    this.center();
    this.feed(1);
    this.text('___________________________');
    this.text('Chief Herbivore');
    this.text('Happy Herbivore HQ');
    this.bold(true).text('=============================').bold(false);
    return this;
  }

  _ticketDare() {
    const dares = [
      'Do your best cow impression\nRIGHT NOW. Moooooo!',
      'High-five the next person\nyou see and say "plants rule!"',
      'Take a selfie with your food\nand caption it "future of food"',
      'Challenge a friend to go\nvegan for 24 hours',
      'Tell someone "my burger is\n100% guilt-free" with a\nstraight face',
      'Count how many green things\nyou can see right now.\nPost the number online.',
      'Walk up to someone and\nwhisper: "the plants are winning"',
      'Give your food a name\nbefore you eat it.\nThen say goodbye.',
    ];
    const dare = dares[Math.floor(Math.random() * dares.length)];
    this.bold(true).size(1, 2).text('DARE CARD').size(1, 1).bold(false);
    this.text('You have been chosen.');
    this.feed(1);
    this.bold(true).text('YOUR DARE:').bold(false);
    this.feed(0);
    for (const line of dare.split('\n')) {
      this.text(line);
    }
    this.feed(1);
    this.text('Complete this dare for');
    this.bold(true).text('+100 PLANT KARMA').bold(false);
    this.feed(1);
    this.text('(no refunds on karma)');
    return this;
  }

  _ticketFortune() {
    const fortunes = [
      'A broccoli in hand is worth\ntwo in the bush.',
      'You will meet a tall, dark,\nand leafy stranger.',
      'Good things come to those\nwho eat their greens.',
      'Your future is as bright as\na field of sunflowers.',
      'A great avocado is already\non its way to you.',
      'The universe says:\nhave another smoothie.',
      'You will find happiness at\nthe bottom of a bowl.',
      'A wise sage once said:\nalways order the fries.',
      'The stars say: that second\nportion was a good idea.',
      'Your plant-powered aura\nis glowing today.',
    ];
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    const lucky = [];
    while (lucky.length < 6) {
      const n = Math.floor(Math.random() * 42) + 1;
      if (!lucky.includes(n)) lucky.push(n);
    }
    this.bold(true).size(1, 2).text('FORTUNE COOKIE').size(1, 1).bold(false);
    this.feed(1);
    this.text('*  *  *  *  *  *  *  *');
    this.feed(0);
    for (const line of fortune.split('\n')) {
      this.text(line);
    }
    this.feed(0);
    this.text('*  *  *  *  *  *  *  *');
    this.feed(1);
    this.text('Lucky numbers:');
    this.bold(true).text(lucky.sort((a, b) => a - b).join('  ')).bold(false);
    this.feed(1);
    this.text('Lucky food: Avocado');
    return this;
  }

  _ticketMystery(pickupNum) {
    const variant = Math.floor(Math.random() * 3);
    if (variant === 0) {
      // "Invisible" receipt
      this.bold(true).size(2, 2).text('INVISIBLE').text('RECEIPT').size(1, 1).bold(false);
      this.feed(1);
      this.text('This receipt has gone on a');
      this.text('plant-based diet and shed');
      this.text('90% of its content.');
      this.feed(2);
      this.text('.');
      this.feed(3);
      this.text('(are you still looking?)');
      this.feed(3);
      this.text('...');
      this.feed(2);
      this.text('OK fine. Your order is real.');
      this.bold(true).text('Pickup #' + pickupNum).bold(false);
    } else if (variant === 1) {
      // Fake prize
      this.bold(true).size(1, 2).text('!!!  YOU HAVE WON  !!!').size(1, 1).bold(false);
      this.feed(1);
      this.text('You are our 1,000,000th');
      this.text('customer! (approximately)');
      this.feed(1);
      this.bold(true).text('YOUR PRIZE:').bold(false);
      this.text('* 1x imaginary golden burger');
      this.text('* Unlimited bragging rights');
      this.text('* The satisfaction of knowing');
      this.text('  no animals were harmed');
      this.text('* A really long receipt');
      this.text('* Free air (while stocks last)');
      this.feed(1);
      this.text('Sincerely, The Management');
      this.text('(not legally binding)');
    } else {
      // Absurd terms & conditions
      this.bold(true).size(1, 2).text('TERMS & CONDITIONS').size(1, 1).bold(false);
      this.feed(1);
      this.text('By accepting this receipt');
      this.text('you hereby agree that:');
      this.feed(0);
      this.left();
      this.text(' 1. Plants are delicious');
      this.text(' 2. You will tell 3 friends');
      this.text('    about us');
      this.text(' 3. You accept broccoli as');
      this.text('    your personal savior');
      this.text(' 4. Any disputes settled by');
      this.text('    tofu eating contest');
      this.text(' 5. Side effects may include:');
      this.text('    happiness, good health,');
      this.text('    and an urge to hug a tree');
      this.text(' 6. This receipt will self-');
      this.text('    destruct in 30 seconds');
      this.text('    (not really)');
      this.center();
      this.feed(1);
      this.text('Signed: Chief Legal Lettuce');
    }
    return this;
  }

  _ticketAgent(pickupNum) {
    this.bold(true).size(1, 2).text('** CLASSIFIED **').size(1, 1).bold(false);
    this.feed(1);
    this.text('MISSION BRIEFING');
    this.text('Clearance Level: EXTRA CRISPY');
    this.feed(1);
    this.bold(true).text('AGENT #' + pickupNum).bold(false);
    this.text('Codename: THE HERBIVORE');
    this.feed(1);
    this.left();
    this.text('YOUR MISSION:');
    this.text('  1. Collect food at pickup zone');
    this.text('  2. Consume before it gets cold');
    this.text('  3. Leave no crumbs behind');
    this.text('  4. Tell NO ONE how good it was');
    this.text('     (just kidding, tell everyone)');
    this.center();
    this.feed(1);
    this.text('This receipt will self-destruct');
    this.text('in... just kidding. Keep it.');
    this.feed(1);
    this.bold(true).text('** END TRANSMISSION **').bold(false);
    return this;
  }

  _ticketLoveLetter() {
    const foods = [
      { name: 'Your Falafel Bowl', trait: 'crispy on the outside, warm on the inside' },
      { name: 'Your Smoothie', trait: 'blended to perfection just for you' },
      { name: 'Your Wrap', trait: 'holding it all together, just like you' },
      { name: 'Your Tofu Bowl', trait: 'pressed, seasoned, and ready to impress' },
      { name: 'Your Acai Bowl', trait: 'looking like art, tasting like heaven' },
    ];
    const food = foods[Math.floor(Math.random() * foods.length)];
    this.bold(true).size(1, 2).text('LOVE LETTER').size(1, 1).bold(false);
    this.text('from your food');
    this.feed(1);
    this.left();
    this.text('Dear Human,');
    this.feed(0);
    this.text('It\'s me, ' + food.name + '.');
    this.text('I just wanted to say...');
    this.feed(0);
    this.text('I was ' + food.trait + '.');
    this.feed(0);
    this.text('I\'ve been waiting in the');
    this.text('kitchen all day, hoping YOU');
    this.text('would pick me. And you did.');
    this.feed(0);
    this.text('I promise to be the best');
    this.text('meal you\'ve ever had.');
    this.text('Or at least top 5.');
    this.feed(1);
    this.text('With all my flavor,');
    this.bold(true).text(food.name).bold(false);
    this.feed(0);
    this.center();
    this.text('P.S. Please don\'t ghost me.');
    this.text('Eat me while I\'m hot.');
    return this;
  }

  _ticketTrivia() {
    const trivia = [
      {
        q: 'How many liters of water does it\ntake to produce 1 beef burger?',
        a: '2,500 liters! A plant burger\nuses about 200 liters.',
      },
      {
        q: 'What percentage of the world\'s\nfarmland is used for livestock?',
        a: '77%! But it only produces\n18% of the world\'s calories.',
      },
      {
        q: 'How many animals does the\naverage vegan save per year?',
        a: 'About 200 animals per year!\nThat\'s you!',
      },
      {
        q: 'Which country has the highest\npercentage of vegetarians?',
        a: 'India! About 30-40% of the\npopulation is vegetarian.',
      },
      {
        q: 'What is the oldest known\nvegan cookbook?',
        a: 'Rupert Wheldon published\n"No Animal Food" in 1910!',
      },
      {
        q: 'How much greenhouse gas does\nthe meat industry produce?',
        a: '14.5% of ALL global emissions.\nMore than all transport combined!',
      },
    ];
    const t = trivia[Math.floor(Math.random() * trivia.length)];
    this.bold(true).size(1, 2).text('TRIVIA TIME!').size(1, 1).bold(false);
    this.feed(1);
    this.bold(true).text('QUESTION:').bold(false);
    this.feed(0);
    for (const line of t.q.split('\n')) this.text(line);
    this.feed(1);
    this.text('(think about it while');
    this.text('you wait for your food!)');
    this.feed(2);
    this.text('- - - ANSWER BELOW - - -');
    this.feed(2);
    this.bold(true).text('ANSWER:').bold(false);
    for (const line of t.a.split('\n')) this.text(line);
    return this;
  }
}
