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

  /* SelfCheck Settings catalog for the backend console. `theme` row is the one
   * interactive setting; the rest are display-only, seated for realism.
   * NEW flags the per-station display config that does not exist today. */
  settings: {
    sections: [
      {
        id: 'attract', title: 'Attract Screen', isNew: true, functional: true,
        blurb: 'Selects the attract-screen look. Scoped like every SelfCheck display setting; a station can override.',
        rows: [
          { key: 'attractTheme', label: 'Attract screen theme', type: 'theme', help: 'Named visual asset applied to the attract screen when the station is idle.' },
        ],
      },
      {
        id: 'receipt', title: 'Receipt Content', rows: [
          { key: 'receiptHeader', label: 'Receipt header text', value: 'Pioneer Library System', type: 'text' },
          { key: 'receiptFooter', label: 'Receipt footer text', value: 'Thank you for visiting!', type: 'text' },
          { key: 'showDueDates', label: 'Show due dates on receipt', value: 'On', type: 'toggle' },
          { key: 'showBalance', label: 'Show account balance', value: 'On', type: 'toggle' },
        ],
      },
      {
        id: 'alertimg', title: 'Image Path for Alert Type', rows: [
          { key: 'imgSecurity', label: 'Security alert image', value: '/assets/alerts/security.png', type: 'path' },
          { key: 'imgHold', label: 'Hold alert image', value: '/assets/alerts/hold.png', type: 'path' },
          { key: 'imgDamaged', label: 'Damaged item image', value: '/assets/alerts/damaged.png', type: 'path' },
        ],
      },
      {
        id: 'sounds', title: 'Sounds', rows: [
          { key: 'soundSuccess', label: 'Success sound', value: 'Chime', type: 'select' },
          { key: 'soundError', label: 'Error sound', value: 'Buzz', type: 'select' },
          { key: 'soundVolume', label: 'Volume', value: '70%', type: 'select' },
        ],
      },
      {
        id: 'rfid', title: 'RFID Options', rows: [
          { key: 'rfidSecurity', label: 'Security mode', value: 'AFI', type: 'select' },
          { key: 'rfidRetry', label: 'Read retry count', value: '2', type: 'number' },
          { key: 'rfidTagTypes', label: 'Supported tag types', value: 'ISO 15693', type: 'select' },
        ],
      },
      {
        id: 'history', title: 'History Retention', rows: [
          { key: 'histDays', label: 'Transaction history (days)', value: '30', type: 'number' },
          { key: 'histClear', label: 'Clear session on logout', value: 'On', type: 'toggle' },
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
