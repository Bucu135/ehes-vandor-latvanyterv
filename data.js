/* Éhes Vándor · közös adatok — a napi menü és a programok EGY helyen.
   Élesben ezt a konyha tölti ki a telefonjáról; az oldal, a főoldali ízelítő
   és a Facebook-plakát mind ebből készül. */
window.EV = {
  tel: '0747 369 320',
  telHref: 'tel:+40747369320',
  fb: 'https://www.facebook.com/ehesvandor',
  /* 0 = vasárnap · Visit Harghita szerint */
  hours: [[10, 22], [7, 23], [7, 23], [7, 23], [7, 23], [7, 24], [7, 24]],

  /* Minta: a 2026. október 15-i Facebook-menü */
  menu: {
    sample: '2026-10-15',
    soups: [
      { hu: 'Lucskos káposzta', ro: 'Varză călită cu afumătură' },
      { hu: 'Babgulyás', ro: 'Gulaș de fasole' },
      { hu: 'Zöldségleves', ro: 'Supă de legume' },
      { hu: 'Parasztcsorba', ro: 'Ciorbă țărănească' }
    ],
    mains: [
      { hu: 'Baconnel és sajttal töltött karaj', ro: 'Cotlet umplut cu bacon și cașcaval' },
      { hu: 'Sült csirkeszárny', ro: 'Aripioare de pui la cuptor' },
      { hu: 'Magyaros szelet', ro: 'Șnițel unguresc' },
      { hu: 'Fasírt', ro: 'Chiftele' }
    ],
    sides: [
      { hu: 'Hasábburgonya', ro: 'Cartofi prăjiți' },
      { hu: 'Krumplipüré', ro: 'Piure de cartofi' },
      { hu: 'Vajas tarhonya', ro: 'Tarhană cu unt' },
      { hu: 'Édesburgonya', ro: 'Cartofi dulci' }
    ]
  },

  /* Programok — a lejárt alkalmak maguktól eltűnnek */
  events: [
    {
      id: 'halloween', start: '2026-10-23T19:00', img: null,
      hu: { t: 'Halloween Buli', k: 'Buli · élőzene', d: 'Halloween-buli élőzenével, 19 órától. Zenél: Major Szilárd és Ambrus Balázs.' },
      ro: { t: 'Petrecere de Halloween', k: 'Petrecere · muzică live', d: 'Petrecere de Halloween cu muzică live, de la ora 19. Cântă: Major Szilárd și Ambrus Balázs.' }
    },
    {
      id: 'sorsolas', start: '2026-11-11T12:00', img: null, allday: true,
      hu: { t: 'Márton-napi nyereményjáték — sorsolás', k: 'Nyereményjáték', d: 'A Márton-napi vacsoraest nyereményjátékának sorsolása. Részletek a Vándor Facebook-oldalán.' },
      ro: { t: 'Concurs de Sf. Martin — extragere', k: 'Concurs', d: 'Extragerea concursului cinei de Sf. Martin. Detalii pe pagina de Facebook Vándor.' }
    },
    {
      id: 'marton', start: '2026-11-13T18:00', end: '2026-11-15', img: null, book: true,
      hu: { t: 'Márton-napi Eszem-Iszom Zenés Vacsoraest', k: 'Libavacsora · 3 este', d: 'Háromfogásos libafinomságok, a ház ajándéka egy pohár bor vagy egy kis erősebb ital. November 13-án élőzene: Tarkó Nimród és Ambrus Balázs. Asztalfoglalás kötelező — a libamenü házhoz is rendelhető.' },
      ro: { t: 'Cina cu muzică de Sf. Martin', k: 'Cină cu gâscă · 3 seri', d: 'Trei feluri din gâscă, iar casa vă oferă un pahar de vin sau ceva mai tare. Pe 13 noiembrie muzică live: Tarkó Nimród și Ambrus Balázs. Rezervarea mesei e obligatorie — meniul cu gâscă se livrează și acasă.' }
    }
  ]
};
