/*
 * Cloud9 SelfCheck Workbench — all sample data in one object (window.C9DATA).
 * Reskin per customer by editing this file only. No external assets: covers
 * are CSS gradients, not images. MARKER: C9SC_DATA_V1
 */
window.C9DATA = {
  brand: {
    product: 'Cloud9 RFID SelfCheck',
    vendor: 'EnvisionWare',
    library: 'Pioneer Library System',
  },

  /* Org tree: ROOT > Library > Branch > Station.
   * `scopeId` is what the theme engine keys library/branch overrides on
   * (each branch is the library/branch override node). */
  tree: {
    id: 'root', label: 'ROOT', kind: 'root',
    children: [{
      id: 'pioneer', label: 'Pioneer Library System', kind: 'library',
      children: [
        {
          id: 'br-main', label: 'Main Street Branch', kind: 'branch',
          children: [
            { id: 'st-101', label: 'Front Lobby Kiosk', kind: 'station', branchId: 'br-main' },
            { id: 'st-102', label: "Children's Area Kiosk", kind: 'station', branchId: 'br-main' },
          ],
        },
        {
          id: 'br-river', label: 'Riverside Branch', kind: 'branch',
          children: [
            { id: 'st-103', label: 'Entrance Kiosk', kind: 'station', branchId: 'br-river' },
          ],
        },
      ],
    }],
  },

  stations: [
    { id: 'st-101', label: 'Front Lobby Kiosk', branchId: 'br-main', branchLabel: 'Main Street Branch',
      token: 'PLS-MAIN-01', group: 'Lobby' },
    { id: 'st-102', label: "Children's Area Kiosk", branchId: 'br-main', branchLabel: 'Main Street Branch',
      token: 'PLS-MAIN-02', group: 'Youth' },
    { id: 'st-103', label: 'Entrance Kiosk', branchId: 'br-river', branchLabel: 'Riverside Branch',
      token: 'PLS-RIV-01', group: 'Lobby' },
  ],

  /* Demo seed: what "Reset demo data" restores. Shows all three scope levels
   * active at once (ROOT default + branch override + station override). */
  seed: {
    'c9sc.theme.root': 'horizon',
    'c9sc.theme.library.br-main': 'lavender',
    'c9sc.theme.station.st-103': 'aurora',
  },

  catalog: [
    { id: '1', barcode: '31234000000011', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', format: 'Book', cover: ['#1e3a5f', '#4a90d9'] },
    { id: '2', barcode: '31234000000028', title: 'Where the Wild Things Are', author: 'Maurice Sendak', format: 'Book', cover: ['#2d6a4f', '#74c69d'] },
    { id: '3', barcode: '31234000000035', title: 'Becoming', author: 'Michelle Obama', format: 'Audiobook', cover: ['#7c3aed', '#a78bfa'] },
    { id: '4', barcode: '31234000000042', title: 'Dune', author: 'Frank Herbert', format: 'Book', cover: ['#d97706', '#fbbf24'] },
    { id: '5', barcode: '31234000000059', title: 'The Hunger Games', author: 'Suzanne Collins', format: 'Book', cover: ['#dc2626', '#f87171'] },
    { id: '6', barcode: '31234000000066', title: 'Educated', author: 'Tara Westover', format: 'Book', cover: ['#0891b2', '#67e8f9'] },
    { id: '7', barcode: '31234000000073', title: 'Dog Man: Fetch-22', author: 'Dav Pilkey', format: 'Book', cover: ['#ea580c', '#fb923c'] },
    { id: '8', barcode: '31234000000080', title: 'Atomic Habits', author: 'James Clear', format: 'Book', cover: ['#4338ca', '#818cf8'] },
    { id: '9', barcode: '31234000000097', title: "Harry Potter and the Sorcerer's Stone", author: 'J.K. Rowling', format: 'Book', cover: ['#7c3aed', '#c084fc'] },
    { id: '10', barcode: '31234000000103', title: 'The Midnight Library', author: 'Matt Haig', format: 'Book', cover: ['#0f766e', '#2dd4bf'] },
    { id: '11', barcode: '31234000000110', title: 'Project Hail Mary', author: 'Andy Weir', format: 'Book', cover: ['#1e293b', '#38bdf8'] },
    { id: '12', barcode: '31234000000127', title: 'The Very Hungry Caterpillar', author: 'Eric Carle', format: 'Book', cover: ['#65a30d', '#bef264'] },
    /* This one triggers the blocking-alert pattern on checkout (hold for another patron). */
    { id: '13', barcode: '31234000000134', title: 'Fourth Wing', author: 'Rebecca Yarros', format: 'Book', cover: ['#831843', '#f472b6'], alert: 'hold-other-patron' },
    { id: '14', barcode: '31234000000141', title: 'Klara and the Sun', author: 'Kazuo Ishiguro', format: 'Audiobook', cover: ['#b45309', '#fcd34d'] },
  ],

  patrons: [
    {
      card: '21234000000019', pin: '1234', name: 'Jamie Rivera', clean: true,
      email: 'jamie.rivera@example.org', phone: '(555) 123-4567',
      loans: [
        { id: '1', due: 'Jul 28, 2026' },
        { id: '8', due: 'Aug 04, 2026' },
      ],
      holds: [], fines: [],
    },
    {
      card: '21234000000026', pin: '1234', name: 'Alex Chen', clean: false,
      email: 'alex.chen@example.org', phone: '(555) 987-6543',
      loans: [
        { id: '6', due: 'Jul 03, 2026', overdue: true },
        { id: '3', due: 'Jul 30, 2026' },
      ],
      holds: [{ id: '5', ready: true }, { id: '4', position: 3 }],
      fines: [{ desc: 'Overdue: Educated', amount: 2.50 }],
    },
  ],

  promoSlides: [
    { title: 'Summer Reading Challenge', body: 'Read 20 books. Earn prizes!', grad: ['#0d9488', '#5eead4'] },
    { title: 'New Arrivals This Week', body: '47 new titles added to the collection', grad: ['#4338ca', '#818cf8'] },
    { title: 'Free Tech Help', body: 'Tuesdays & Thursdays, 2–4 PM', grad: ['#ea580c', '#fb923c'] },
  ],

  /* Personas — the real Cloud9 Web Console is one app used by different roles,
   * scoped by login. The backend console switches between these. */
  personas: [
    { id: 'tech', name: 'Dana Ruiz', role: 'EnvisionWare Technician', org: 'EnvisionWare Support',
      initials: 'DR', landingScope: 'root', showICTools: true, canManageStations: true,
      note: 'Professional Services / support. Works from ROOT across all consortia and libraries; sets the ROOT defaults customers inherit.' },
    { id: 'manager', name: 'Chris Johnson', role: 'Library Manager', org: 'Pioneer Library System',
      initials: 'CJ', landingScope: 'pioneer', showICTools: false, canManageStations: true,
      note: 'Library staff/admin. Scoped to their own library; overrides the ROOT defaults for their branches and stations.' },
  ],

  /* Faithful scope tree for the Web Console: ROOT > Consortia / Libraries >
   * library > branch > station. Pioneer is the functional library (its
   * branches/stations drive the live theme resolution); the sibling libraries
   * are there for realism (display-only), like the real console's long list. */
  consoleTree: {
    id: 'root', label: 'ROOT', kind: 'root', children: [
      { id: 'grp-consortia', label: 'Consortia', kind: 'group', children: [
        { id: 'metro-consortium', label: 'Metro Library Consortium', kind: 'consortium', children: [] },
      ] },
      { id: 'grp-libraries', label: 'Libraries', kind: 'group', children: [
        { id: 'pioneer', label: 'Pioneer Library System', kind: 'library', children: [
          { id: 'br-main', label: 'Main Street Branch', kind: 'branch', children: [
            { id: 'st-101', label: 'Front Lobby Kiosk', kind: 'station' },
            { id: 'st-102', label: "Children's Area Kiosk", kind: 'station' },
          ] },
          { id: 'br-river', label: 'Riverside Branch', kind: 'branch', children: [
            { id: 'st-103', label: 'Entrance Kiosk', kind: 'station' },
          ] },
        ] },
        { id: 'lib-oakdale', label: 'Oakdale County Library', kind: 'library', children: [] },
        { id: 'lib-summit', label: 'Summit Regional Library', kind: 'library', children: [] },
        { id: 'lib-harbor', label: 'Harbor City Libraries', kind: 'library', children: [] },
        { id: 'lib-test', label: 'A Library Test 789', kind: 'library', children: [] },
      ] },
    ],
  },

  /* SelfCheck Settings catalog mirroring the real Cloud9 Web Console
   * (SelfCheck > Settings). The Attract Screen theme row is the one live,
   * functional setting (drives the kiosk); every other row reproduces a real
   * setting and is interactive-looking but display-only in the demo. Each row
   * carries the scope chevron (inherit/override) like the real console. */
  settings: {
    sections: [
      {
        id: 'attract', title: 'Attract Screen', isNew: true,
        blurb: 'Selects the attract-screen look shown while the station is idle. Scoped like every SelfCheck display setting; a station can override.',
        rows: [
          { key: 'attractTheme', label: 'Attract screen theme', type: 'theme', help: 'Named visual asset applied to the attract screen when the station is idle.' },
        ],
      },
      {
        id: 'patronid', title: 'Patron ID / PIN Settings',
        rows: [
          { key: 'clearIdName', label: 'Clear ID & Name in Report Data', type: 'toggle', value: true },
        ],
      },
      {
        id: 'patroncomm', title: 'Patron Communication Settings',
        groups: [
          { title: 'Receipt Content', rows: [
            { key: 'receiptHeader', label: 'Receipt Header Lines', type: 'textarea', lang: 'English', value: '' },
            { key: 'receiptFooter', label: 'Receipt Footer Lines', type: 'textarea', lang: 'English', value: '' },
          ] },
          { title: 'Checkin Receipt', rows: [
            { key: 'ciPrint', label: 'Checkin: Print Receipt', type: 'toggle', value: true },
            { key: 'ciSms', label: 'Checkin SMS Receipt', type: 'toggle', value: true },
            { key: 'ciEmail', label: 'Checkin: Send Email Receipt', type: 'toggle', value: true },
          ] },
          { title: 'Checkin Receipt Details', rows: [
            { key: 'ciPatronName', label: 'Include Patron Name', type: 'toggle', value: false },
            { key: 'ciPatronId', label: 'Include Patron ID', type: 'toggle', value: false },
            { key: 'ciFines', label: 'Include Fines and Fees Amount', type: 'toggle', value: true },
            { key: 'ciHolds', label: 'Include Hold Items Count', type: 'toggle', value: true },
            { key: 'ciSession', label: 'Include Total Items Checked In During Session', type: 'toggle', value: true },
            { key: 'ciAccount', label: 'Include Total Items Checked Out On Account', type: 'toggle', value: true },
          ] },
          { title: 'Checkout Receipt', rows: [
            { key: 'coPrint', label: 'Checkout: Print Receipt', type: 'toggle', value: true },
            { key: 'coSms', label: 'Checkout SMS Receipt', type: 'toggle', value: true },
            { key: 'coEmail', label: 'Checkout: Send Email Receipt', type: 'toggle', value: true },
          ] },
          { title: 'Checkout Receipt Details', rows: [
            { key: 'coPatronName', label: 'Include Patron Name', type: 'toggle', value: false },
            { key: 'coPatronId', label: 'Include Patron ID', type: 'toggle', value: false },
            { key: 'coFines', label: 'Include Fines and Fees Amount', type: 'toggle', value: true },
            { key: 'coHolds', label: 'Include Hold Items Count', type: 'toggle', value: true },
            { key: 'coSession', label: 'Include Total Items Checked Out During Session', type: 'toggle', value: true },
            { key: 'coAccount', label: 'Include Total Items Checked Out On Account', type: 'toggle', value: true },
          ] },
        ],
      },
      {
        id: 'checkin', title: 'Checkin Settings',
        rows: [
          { key: 'imgAlert00', label: 'Image Path for Alert Type Unknown (SIP Value 00)', type: 'path', value: '/assets/images/returns_cart_left_gray.png', tip: 'Display name required; image file optional' },
          { key: 'imgAlert01', label: 'Image Path for Returned Items that are on Hold at this Library (SIP Alert Type 01)', type: 'path', value: '/assets/images/returns_bin_right_black.png', tip: 'Display name required; image file optional' },
          { key: 'imgAlert02', label: 'Image Path for Alert Type 02 (Hold for other branch)', type: 'path', value: '/assets/images/returns_cart_left_gray.png', tip: 'Display name required; image file optional' },
          { key: 'imgAlert03', label: 'Image Path for Alert Type 03 (Hold for ILL)', type: 'path', value: '/assets/images/returns_cart_left_gray.png', tip: 'Display name required; image file optional' },
          { key: 'imgAlert04', label: 'Image Path for Alert Type 04 (Sent to other branch)', type: 'path', value: '/assets/images/returns_cart_left_gray.png', tip: 'Display name required; image file optional' },
          { key: 'imgAlert05', label: 'Image Path for Alert Type 05 (Recall or Hold)', type: 'path', value: '/assets/images/returns_cart_left_gray.png', tip: 'Display name required; image file optional' },
          { key: 'imgAlert99', label: 'Image Path for Alert Type 99 (Other)', type: 'path', value: '/assets/images/returns_cart_left_gray.png', tip: 'Display name required; image file optional' },
          { key: 'ciIncompleteSets', label: 'Process Incomplete Sets', type: 'toggle', value: false },
        ],
      },
      {
        id: 'checkout', title: 'Checkout Settings',
        rows: [
          { key: 'forceReceiptMedia', label: 'Force Receipt for Media Types', type: 'text', value: '', placeholder: 'Force Receipt for Media Types' },
          { key: 'coIncompleteSets', label: 'Process Incomplete Sets', type: 'toggle', value: false },
        ],
      },
      {
        id: 'rfid', title: 'RFID (within SelfCheck)',
        rows: [
          { key: 'ignoreRfidSecFail', label: 'Ignore RFID Security Failure Alerts During Checkout', type: 'toggle', value: false },
        ],
      },
      {
        id: 'misc', title: 'Miscellaneous Settings',
        rows: [
          { key: 'soundSuccess', label: 'Successful Sound Enabled', type: 'toggle', value: false },
          { key: 'soundError', label: 'Error Sound Enabled', type: 'toggle', value: true },
          { key: 'historyDays', label: 'How Long to Retain Self Check History (Days)', type: 'number', value: '7' },
        ],
      },
    ],
  },

  /* Scripted walkthrough shown on the landing page. */
  walkthrough: [
    { s: 'Open the Backend console', d: 'Set the ROOT default theme to Horizon. Open the Kiosk (Front Lobby): after resetting overrides it shows Horizon.' },
    { s: 'Open the Admin console', d: 'As Pioneer / Main Street Branch, override the theme to Lavender. The Kiosk (Front Lobby & Children\'s Area) now shows Lavender.' },
    { s: 'Override a single station', d: 'In Admin, set the Entrance Kiosk (Riverside) to Aurora. It shows Aurora even though its branch has no override.' },
    { s: 'Revert the branch override', d: 'Front Lobby falls back to the ROOT default; the station-level Aurora override still wins on the Entrance Kiosk.' },
  ],
};
