/* Éhes Vándor · látványterv — nyelv, élő nyitvatartás, napszak-tónus, napi menü,
   rendelés, konyha-demó + FB-plakát, programok, foglalás, motion */
(() => {
  document.documentElement.classList.remove('no-js');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const EV = window.EV;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } },
                  set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = n => String(n).padStart(2, '0');

  /* ---------- dinamikus szövegek ---------- */
  const T = {
    hu: {
      loc: 'hu-HU',
      openUntil: h => `Most nyitva · ${h % 24 === 0 ? 'éjfélig' : h + ':00-ig'}`,
      opensToday: h => `Zárva · ma ${h}:00-kor nyitunk`,
      opensTomorrow: h => `Zárva · holnap ${h}:00-kor nyitunk`,
      soups: 'Levesek', mains: 'Főételek', sides: 'Köretek',
      single: 'Ma csak egyféle menü',
      sampleNote: d => `Demó-tartalom: a ${d}-i Facebook-menü alapján.`,
      today: 'Mai menü',
      allday: 'egész nap', from: t => `${t}-tól`, days: (a, b) => `${a}–${b}.`,
      book: 'Asztalt foglalok', noEvents: 'Most nincs meghirdetett program — péntek este viszont mindig van zene.',
      modes: { here: 'helyben', take: 'elvitelre', deliv: 'házhozszállítással' },
      portion: n => `${n} adag`,
      orderSms: (n, q, m, tm) => `Kedves ${n}! Megkaptuk a rendelését (${q}, ${m}), ${tm}-ra készül. Ha kérdés van, visszahívjuk. — Éhes Vándor, ${EV.tel}`,
      bookSms: (n, d, tm, p) => `Kedves ${n}! Asztalát rögzítettük: ${d}, ${tm}, ${p} fő. Várjuk szeretettel! — Éhes Vándor, ${EV.tel}`,
      msgOk: n => `Köszönjük, ${n}! Az üzenete élesben egyenesen a Vándor e-mailjébe érkezne.`,
      need: 'Kérjük, töltse ki a csillagos mezőket.',
      pickAll: 'Válasszon levest, főételt és köretet.',
      writeWhat: 'Írja le, mit kér az étlapról.',
      platter: n => `${n} tál`,
      sheet: { t: 'Mit rendelne?', p: 'Házhoz vagy elvitelre — válasszon, a többi pár koppintás.', call: 'Inkább hívna?', close: 'Bezárás' },
      persons: 'fő', asap: 'amint kész',
      cd: ['nap', 'óra', 'perc', 'mp'],
      friday: 'Péntek este a Vándorban', fridayNow: 'Ma este élőzene!',
      posterFoot: ['Rendelés és házhozszállítás', 'Szabadság tér 8. · Székelykeresztúr']
    },
    ro: {
      loc: 'ro-RO',
      openUntil: h => `Deschis acum · până la ${h % 24 === 0 ? 'miezul nopții' : h + ':00'}`,
      opensToday: h => `Închis · deschidem azi la ${h}:00`,
      opensTomorrow: h => `Închis · deschidem mâine la ${h}:00`,
      soups: 'Supe și ciorbe', mains: 'Feluri principale', sides: 'Garnituri',
      single: 'Azi un singur meniu',
      sampleNote: d => `Conținut demo: după meniul de pe Facebook din ${d}.`,
      today: 'Meniul zilei',
      allday: 'toată ziua', from: t => `de la ${t}`, days: (a, b) => `${a}–${b}`,
      book: 'Rezerv o masă', noEvents: 'Acum nu e niciun program anunțat — dar vineri seara e mereu muzică.',
      modes: { here: 'pe loc', take: 'la pachet', deliv: 'cu livrare' },
      portion: n => `${n} ${n > 1 ? 'porții' : 'porție'}`,
      orderSms: (n, q, m, tm) => `Dragă ${n}! Am primit comanda (${q}, ${m}), e gata la ${tm}. Dacă avem întrebări, vă sunăm. — Éhes Vándor, ${EV.tel}`,
      bookSms: (n, d, tm, p) => `Dragă ${n}! Masa e rezervată: ${d}, ${tm}, ${p} persoane. Vă așteptăm cu drag! — Éhes Vándor, ${EV.tel}`,
      msgOk: n => `Mulțumim, ${n}! În varianta live, mesajul ajunge direct pe e-mailul restaurantului.`,
      need: 'Vă rugăm completați câmpurile marcate cu steluță.',
      pickAll: 'Alegeți o supă, un fel principal și o garnitură.',
      writeWhat: 'Scrieți ce doriți din meniu.',
      platter: n => `${n} ${n > 1 ? 'platouri' : 'platou'}`,
      sheet: { t: 'Ce doriți să comandați?', p: 'La domiciliu sau la pachet — alegeți, restul e din câteva atingeri.', call: 'Preferați să sunați?', close: 'Închide' },
      persons: 'pers.', asap: 'cât mai curând',
      cd: ['zile', 'ore', 'min', 'sec'],
      friday: 'Vineri seara la Vándor', fridayNow: 'Diseară muzică live!',
      posterFoot: ['Comenzi și livrare la domiciliu', 'Piața Libertății 8 · Cristuru Secuiesc']
    }
  };
  let lang = 'hu';
  const t = () => T[lang];
  const L = o => o[lang] || o.hu;

  /* ---------- idő: mindig keresztúri ---------- */
  function localNow() {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Bucharest', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date()).map(x => [x.type, x.value]));
    return new Date(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  }
  const fmtDate = (d, o) => d.toLocaleDateString(t().loc, o);

  function status() {
    const now = localNow(), dow = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
    const today = EV.hours[dow], yest = EV.hours[(dow + 6) % 7];
    if (yest[1] > 24 && h < yest[1] - 24) return { open: true, text: t().openUntil(yest[1] - 24) };
    if (h >= today[0] && h < today[1]) return { open: true, text: t().openUntil(today[1]) };
    if (h < today[0]) return { open: false, text: t().opensToday(today[0]) };
    return { open: false, text: t().opensTomorrow(EV.hours[(dow + 1) % 7][0]) };
  }
  function renderStatus() {
    const st = status();
    $$('[data-live]').forEach(el => { el.classList.toggle('open', st.open); el.classList.toggle('closed', !st.open); el.textContent = st.text; });
    const idx = (localNow().getDay() + 6) % 7;   // a táblázat hétfővel kezdődik
    $$('.hours dt').forEach((dt, i) => { dt.classList.toggle('today', i === idx); dt.nextElementSibling.classList.toggle('today', i === idx); });
  }

  /* ---------- nyelv: a magyar alap a HTML-ben él ---------- */
  const HU = {};
  $$('[data-i18n]').forEach(el => { HU[el.dataset.i18n] = el.innerHTML; });
  const HUattr = {};
  $$('[data-i18n-ph]').forEach(el => { HUattr[el.dataset.i18nPh] = el.placeholder; });
  function setLang(l, save = true) {
    lang = l === 'ro' ? 'ro' : 'hu';
    const dict = lang === 'ro' ? (window.LOCALE_RO || {}) : HU;
    $$('[data-i18n]').forEach(el => { const v = dict[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    $$('[data-i18n-ph]').forEach(el => { const k = el.dataset.i18nPh; const v = lang === 'ro' ? (window.LOCALE_RO || {})['ph.' + k] : HUattr[k]; if (v != null) el.placeholder = v; });
    document.documentElement.lang = lang;
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    if (save) store.set('ev-lang', lang);
    renderAll();
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ---------- oldalváltás: tábla-függöny + lágy görgetés a horgonyokhoz ---------- */
  const root = document.documentElement;
  const PT_OUT = 300, PT_IN = 420;
  function glideTo(to, ms) {
    const from = scrollY, d = to - from;
    if (reduced || Math.abs(d) < 4) { scrollTo(0, to); return; }
    ms = ms || Math.min(1100, 520 + Math.abs(d) * .12);
    const t0 = performance.now(), ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    (function step(now) { const k = Math.min(1, (now - t0) / ms); scrollTo(0, from + d * ease(k)); if (k < 1) requestAnimationFrame(step); })(t0);
  }
  const anchorY = el => el.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(root).scrollPaddingTop) || 96);
  // fejléc-menü: csúszó kijelölés — az előző oldal pontjáról csúszik a mostanira
  const hnav = $('.hdr .nav');
  const hlinks = hnav ? $$('a', hnav) : [];
  const hind = document.createElement('span');
  const pageOf = p => (p.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
  const linkFor = page => hlinks.find(a => pageOf(new URL(a.href).pathname) === page);
  function navPlace(a, instant) {
    if (!hnav) return;
    if (instant) hind.style.transition = 'none';
    if (a) { hind.style.width = a.offsetWidth + 'px'; hind.style.transform = `translateX(${a.offsetLeft}px)`; hind.classList.add('on'); }
    else hind.classList.remove('on');
    hlinks.forEach(x => x.classList.toggle('is-on', x === a));
    if (instant) { hind.offsetWidth; hind.style.transition = ''; }
  }
  function navGoTo(path) {
    if (!hnav) return;
    const cur = hlinks.find(x => x.getAttribute('aria-current')), target = linkFor(pageOf(path));
    // ha a cél menüpont, a kapszula MOST csúszik át (a függöny alatt) — az új oldalon már a helyén áll;
    // ha nem menüpont a cél (pl. főoldali link), az új oldalon csúszik be az előző pont helyéről
    try { if (target) sessionStorage.removeItem('ev-nav-from'); else sessionStorage.setItem('ev-nav-from', cur ? pageOf(new URL(cur.href).pathname) : 'none'); } catch {}
    navPlace(target || null);
  }
  if (hnav) {
    hind.className = 'nav-ind'; hind.setAttribute('aria-hidden', 'true');
    hnav.prepend(hind); hnav.classList.add('has-ind');
    const cur = hlinks.find(x => x.getAttribute('aria-current'));
    let from = null; try { from = sessionStorage.getItem('ev-nav-from'); sessionStorage.removeItem('ev-nav-from'); } catch {}
    const prev = from && from !== 'none' ? linkFor(from) : null;
    if (prev && prev !== cur && !reduced) {
      navPlace(prev, true);
      requestAnimationFrame(() => requestAnimationFrame(() => navPlace(cur || null)));
    } else navPlace(cur || null, true);
    const t0 = performance.now();
    const realignNav = () => { if (performance.now() - t0 < 700) return setTimeout(realignNav, 700); navPlace(hlinks.find(x => x.classList.contains('is-on')) || null, true); };
    addEventListener('resize', realignNav);
    if (document.fonts) document.fonts.ready.then(realignNav);
    addEventListener('pageshow', e => { if (e.persisted) navPlace(cur || null, true); });
  }

  // érkezés: a függöny felhúzódik
  if (root.classList.contains('pt-in')) {
    try { sessionStorage.removeItem('ev-pt'); } catch {}
    requestAnimationFrame(() => requestAnimationFrame(() => {
      root.classList.add('pt-reveal');
      setTimeout(() => root.classList.remove('pt-in', 'pt-reveal'), PT_IN + 80);
    }));
  }
  // vissza-gomb (bfcache): ne maradjon lent a függöny
  addEventListener('pageshow', e => { if (e.persisted) root.classList.remove('pt-leave', 'pt-in', 'pt-reveal'); });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank' || a.hasAttribute('download')) return;
    if (a.closest('.menu-nav')) return;                           // az étlap-sávnak saját görgetése van
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    const samePage = url.pathname === location.pathname;
    if (samePage) {                                               // ugyanazon az oldalon: lágy görgetés
      const el = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el && url.hash) return;
      e.preventDefault();
      glideTo(el ? anchorY(el) : 0);
      if (url.hash) history.replaceState(null, '', url.hash);
      return;
    }
    navGoTo(url.pathname);                                        // a menü-kijelölés már indul az új pont felé
    if (reduced) return;                                          // másik oldal: függöny le, aztán navigálás
    e.preventDefault();
    try { sessionStorage.setItem('ev-pt', '1'); } catch {}
    root.classList.add('pt-leave');
    setTimeout(() => { location.href = url.href; }, PT_OUT);
  });

  /* ---------- fejléc, menü, dokk ---------- */
  const hdr = $('.hdr'), dock = $('.dock');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY, down = y > lastY + 4, up = y < lastY - 4;
    if (!document.body.classList.contains('menu-open')) {
      if (down && y > 300) hdr.classList.add('hide');
      if (up || y < 120) hdr.classList.remove('hide');
    }
    if (dock) {
      const nearEnd = innerHeight + y > document.documentElement.scrollHeight - 340;
      dock.classList.toggle('away', y < 200 || nearEnd);
    }
    lastY = y;
  }, { passive: true });
  const burger = $('.burger'), drawer = $('.drawer');
  if (burger) {
    const toggle = open => {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
      drawer.inert = !open;
    };
    drawer.inert = true;
    burger.addEventListener('click', () => toggle(!document.body.classList.contains('menu-open')));
    addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
    $$('a', drawer).forEach(a => a.addEventListener('click', () => toggle(false)));
  }

  /* ---------- napszak-tónus: a látható szekció színezi a body-t ---------- */
  const toned = $$('[data-tone-sec]');
  if (toned.length) {
    const vis = new Map();
    const io = new IntersectionObserver(es => {
      es.forEach(e => vis.set(e.target, e.intersectionRatio));
      let best = null, r = 0;
      vis.forEach((v, el) => { if (v > r) { r = v; best = el; } });
      if (best) document.body.dataset.tone = best.dataset.toneSec;
    }, { threshold: [0, .15, .3, .45, .6, .75, .9], rootMargin: '-35% 0px -35% 0px' });
    toned.forEach(s => io.observe(s));
  }

  /* ---------- napóra: a vándor végigsétál a napon ---------- */
  /* oldalsó sáv, három változat: A ösvény · B napív · C óraszalag (?v=a|b|c) */
  const chapters = $('.chapters'), rail = $('.dayrail');
  const RAILS = ['a', 'b', 'c'];
  const qv = new URLSearchParams(location.search).get('v');
  const railV = RAILS.includes(qv) ? qv : (RAILS.includes(store.get('ev-rail')) ? store.get('ev-rail') : 'a');
  document.documentElement.dataset.rail = railV;
  if (qv && rail) {
    const pk = document.createElement('div');
    pk.className = 'rail-pick on';
    pk.innerHTML = 'Csúszka:' + RAILS.map(v => `<button type="button" data-v="${v}" aria-pressed="${v === railV}">${v.toUpperCase()}</button>`).join('');
    document.body.append(pk);
    pk.addEventListener('click', e => {
      const v = e.target.dataset.v; if (!v) return;
      document.documentElement.dataset.rail = v; store.set('ev-rail', v);
      $$('button', pk).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
      history.replaceState(null, '', '?v=' + v); trailTick();
    });
  }
  const tape = rail && $('.rc-tape', rail), HOUR = 110;   // C: ennyi px egy óra a szalagon
  if (tape) {
    let h = '';
    for (let H = 7; H <= 22; H++) {
      h += `<div class="rc-h" data-h="${H}" style="top:${(H - 7) * HOUR}px"><b>${pad(H)}</b></div>`;
      if (H < 22) for (let q = 1; q < 4; q++) h += `<span class="rc-q" style="top:${(H - 7) * HOUR + q * HOUR / 4}px"></span>`;
    }
    tape.innerHTML = h;
  }
  const PHASE = { hu: ['reggel', 'délben', 'délután', 'este'], ro: ['dimineața', 'la prânz', 'după-amiaza', 'seara'] };
  let lastHour = -1;
  function trailTick() {
    if (!chapters || !rail) return;
    const r = chapters.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * .5 - r.top) / r.height));
    rail.style.setProperty('--p', p.toFixed(4));
    const raw = 7 * 60 + p * 15 * 60;                                  // 07:00 → 22:00
    const mins = Math.round(raw / 15) * 15;
    const txt = `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
    $$('.clock', rail).forEach(c => { c.textContent = txt; });
    // B: nap az ellipszis-íven (viewBox 140×400, középpont 120;200, rx 100, ry 190)
    const arc = $('.rb-track', rail);   // ívhossz szerint, hogy a nap a kihúzott vonal végén álljon
    const pt = arc.getPointAtLength(p * arc.getTotalLength());
    rail.style.setProperty('--sx', (pt.x / 140 * 100).toFixed(2) + '%');
    rail.style.setProperty('--sy', (pt.y / 400 * 100).toFixed(2) + '%');
    const hr = Math.floor(mins / 60);
    const rb = $('.rail-b', rail); rb.classList.toggle('night', hr >= 19);
    $('.rb-label', rail).textContent = PHASE[lang][hr < 11 ? 0 : hr < 15 ? 1 : hr < 18 ? 2 : 3];
    // C: a szalag úgy csúszik, hogy az aktuális idő a jelölőre essen
    if (tape) {
      tape.style.transform = `translate3d(0, ${(-(raw - 420) / 60 * HOUR).toFixed(1)}px, 0)`;
      if (hr !== lastHour) { $$('.rc-h', tape).forEach(el => el.classList.toggle('on', +el.dataset.h === hr)); lastHour = hr; }
    }
  }

  /* ---------- parallax a nyitóképen ---------- */
  const heroImg = $('.hero-photo .hp-img');
  function parallax() {
    if (!heroImg || reduced) return;
    const r = heroImg.parentElement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    heroImg.style.transform = `translate3d(0, ${(-r.top * .12 - r.height * .08).toFixed(1)}px, 0)`;
  }
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { trailTick(); parallax(); ticking = false; });
  }, { passive: true });

  /* ---------- reveal két irányba ---------- */
  const rvIO = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('shown', e.isIntersecting)),
    { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  function watchReveal(root = document) { $$('.rv, .rv-img, .h-line', root).forEach(el => rvIO.observe(el)); }

  /* ================= NAPI MENÜ ================= */
  const M = JSON.parse(JSON.stringify(EV.menu));   // a konyha-demó ezt írja át
  M.single = false;
  const CATS = ['soups', 'mains', 'sides'];
  const sampleDate = () => fmtDate(new Date(M.sample + 'T12:00'), { month: 'long', day: 'numeric' });
  const todayLabel = () => {
    const s = fmtDate(localNow(), { weekday: 'long', month: 'long', day: 'numeric' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const items = c => M.single ? M[c].slice(0, 1) : M[c];

  function renderBoards() {
    $$('[data-board]').forEach(b => {
      $('.date', b).textContent = todayLabel();
      $('.board-cols', b).innerHTML = CATS.map(c => `<div><h4>${t()[c]}</h4><ul>${items(c).map(i => `<li>${esc(L(i))}</li>`).join('')}</ul></div>`).join('');
      const n = $('.demo-note', b); if (n) n.textContent = t().sampleNote(sampleDate());
    });
  }

  /* választó */
  const pick = $('#pick');
  function renderPick() {
    if (!pick) return;
    pick.classList.toggle('is-single', M.single);
    CATS.forEach(c => {
      const box = $(`[data-opts="${c}"]`, pick), prev = (box.querySelector('input:checked') || {}).value;
      box.innerHTML = items(c).map((i, k) => `<label class="opt"><input type="radio" name="${c}" value="${k}"${(prev == k || (M.single && k === 0)) ? ' checked' : ''}><span>${esc(L(i))}</span></label>`).join('');
    });
    $('#pickDate').textContent = todayLabel();
    $('#pickNote').textContent = t().sampleNote(sampleDate());
    renderOrderSummary();
  }

  /* rendelés */
  const of = $('#orderForm');
  let qty = 1;
  function slots() {
    const now = localNow(), out = [], st = 11 * 60 + 30;
    const from = Math.max(st, Math.ceil((now.getHours() * 60 + now.getMinutes() + 40) / 15) * 15);
    for (let m = from; m <= 16 * 60; m += 15) out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
    return out.length ? out : ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00'];
  }
  function chosen() {
    return CATS.map(c => { const i = pick && pick.querySelector(`input[name="${c}"]:checked`); return i ? M[c][+i.value] : null; });
  }
  /* mit rendel: napi menü · Vándor-tál · libamenü · étlapról */
  const kindOf = () => (pick && pick.dataset.kind) || 'napi';
  const orderable = id => EV.orderables.find(o => o.id === id);
  const available = o => !o.until || localNow() <= new Date(o.until + 'T23:59');
  function orderLabel() {
    const k = kindOf();
    if (k === 'napi') { const ch = chosen(); return ch.every(Boolean) ? ch.map(L).join(' · ') : '—'; }
    if (k === 'etlap') { const v = pick.elements.etlapText.value.trim(); return v ? v.slice(0, 60) + (v.length > 60 ? '…' : '') : '—'; }
    return L(orderable(k)).t;
  }
  function fillTimes() {
    if (!of) return;
    const sel = of.elements.time, prev = sel.value, k = kindOf();
    let opts;
    if (k === 'liba') {
      const days = ['2026-11-13', '2026-11-14', '2026-11-15'].filter(d => new Date(d + 'T20:00') > localNow());
      opts = days.flatMap(d => ['17:00', '18:00', '19:00'].map(h => `${fmtDate(new Date(d + 'T12:00'), { month: 'short', day: 'numeric' })}, ${h}`));
    } else if (k === 'napi') opts = slots();
    else {   // tál és étlap: egész nap, záróráig
      const now = localNow(), close = EV.hours[now.getDay()][1] - 1, out = [];
      const from = Math.max(11 * 60 + 30, Math.ceil((now.getHours() * 60 + now.getMinutes() + 45) / 30) * 30);
      for (let m = from; m <= close * 60; m += 30) out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
      opts = out.length ? out : ['12:00', '13:00', '18:00', '19:00'];
    }
    sel.innerHTML = opts.map(s => `<option${s === prev ? ' selected' : ''}>${s}</option>`).join('');
  }
  function setKind(k, focus) {
    if (!pick) return;
    if (!orderable(k) || !available(orderable(k))) k = 'napi';
    pick.dataset.kind = k;
    const r = pick.querySelector(`input[name="kind"][value="${k}"]`); if (r) r.checked = true;
    fillTimes(); renderOrderSummary();
    if (focus) { const el = pick.querySelector(`.mode-${k} textarea`); if (el) setTimeout(() => el.focus({ preventScroll: true }), 400); }
  }
  function renderOrderSummary() {
    if (!of) return;
    const mode = of.elements.mode.value;
    of.classList.toggle('is-delivery', mode === 'deliv');
    $('#qtyOut').textContent = qty;
    $('#sumMenu').textContent = orderLabel();
    $('#sumQty').textContent = kindOf() === 'tal' ? t().platter(qty) : t().portion(qty);
    $('#sumMode').textContent = t().modes[mode];
    $('#sumTime').textContent = of.elements.time.value || '—';
  }
  if (of) {
    fillTimes();
    of.addEventListener('input', renderOrderSummary);
    pick.addEventListener('change', e => { if (e.target.name === 'kind') setKind(e.target.value, true); else renderOrderSummary(); });
    pick.addEventListener('input', renderOrderSummary);
    $$('.kind [data-until]', pick).forEach(l => { if (localNow() > new Date(l.dataset.until + 'T23:59')) l.remove(); });
    $('#qtyMinus').addEventListener('click', () => { qty = Math.max(1, qty - 1); renderOrderSummary(); });
    $('#qtyPlus').addEventListener('click', () => { qty = Math.min(20, qty + 1); renderOrderSummary(); });
    of.addEventListener('submit', e => {
      e.preventDefault();
      const err = $('.err', of), name = of.elements.name.value.trim(), tel = of.elements.tel.value.trim(), k = kindOf();
      if (k === 'napi' && !chosen().every(Boolean)) { err.textContent = t().pickAll; pick.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); return; }
      if (k === 'etlap' && !pick.elements.etlapText.value.trim()) { err.textContent = t().writeWhat; pick.elements.etlapText.focus(); return; }
      if (!name || !tel || (of.elements.mode.value === 'deliv' && !of.elements.addr.value.trim())) { err.textContent = t().need; return; }
      err.textContent = '';
      $('#orderSms').textContent = t().orderSms(name.split(' ').pop(), `${orderLabel()}, ${k === 'tal' ? t().platter(qty) : t().portion(qty)}`, t().modes[of.elements.mode.value], of.elements.time.value);
      of.closest('.panel').classList.add('sent');
    });
    $('#orderAgain').addEventListener('click', () => { of.closest('.panel').classList.remove('sent'); });
  }

  /* konyha-demó: beírja a menüt → frissül a tábla, a választó és a plakát */
  const kitchen = $('#kitchen');
  function renderPoster() {
    const p = $('.poster'); if (!p) return;
    $('.p-kick', p).textContent = t().today;
    $('.p-title', p).textContent = M.single ? t().single : (lang === 'ro' ? 'Meniul zilei' : 'Választható napi menü');
    $('.p-date', p).textContent = todayLabel();
    $('.p-cols', p).innerHTML = CATS.map(c => `<div><h5>${t()[c]}</h5><div class="p-items">${items(c).map(i => esc(L(i))).join(' · ')}</div></div>`).join('');
    $('.p-foot', p).innerHTML = `<span>${t().posterFoot[0]}: ${EV.tel}</span><span>${t().posterFoot[1]}</span>`;
  }
  if (kitchen) {
    const fill = () => CATS.forEach(c => { kitchen.elements[c].value = M[c].map(L).join('\n'); });
    kitchen.addEventListener('input', e => {
      if (e.target.name === 'single') M.single = e.target.checked;
      else if (CATS.includes(e.target.name)) {
        M[e.target.name] = e.target.value.split('\n').map(s => s.trim()).filter(Boolean).map(s => ({ hu: s, ro: s }));
      }
      renderBoards(); renderPick(); renderPoster();
    });
    kitchen.fill = fill;
  }

  /* ================= PROGRAMOK ================= */
  function upcoming() {
    const now = localNow();
    return EV.events.filter(e => new Date((e.end || e.start.slice(0, 10)) + 'T23:59') >= now)
      .sort((a, b) => a.start.localeCompare(b.start));
  }
  function evDate(e) {
    const s = new Date(e.start);
    const day = e.end ? t().days(s.getDate(), new Date(e.end + 'T12:00').getDate()) : s.getDate() + (lang === 'hu' ? '.' : '');
    const mon = fmtDate(s, { month: 'short' }).replace('.', '');
    const wd = e.end ? '' : fmtDate(s, { weekday: 'short' }).replace('.', '');
    const tm = e.allday ? t().allday : t().from(`${pad(s.getHours())}:${pad(s.getMinutes())}`);
    return { day, mon, wd, tm };
  }
  const IMG = { tal: 'img/tal-700.webp' };
  function renderEvents() {
    $$('[data-events]').forEach(box => {
      const big = box.dataset.events === 'full', list = upcoming().slice(0, big ? 99 : 3);
      if (!list.length) { box.innerHTML = `<p class="ev-empty">${t().noEvents}</p>`; return; }
      box.innerHTML = list.map(e => {
        const d = evDate(e), x = L(e);
        const tag = big ? 'article' : 'a';
        return `<${tag} class="ev${big ? ' big' : ''} rv" ${big ? `id="ev-${e.id}"` : `href="programok.html#ev-${e.id}"`}>
          <div class="ev-date"><b${e.end ? ' class="range"' : ''}>${d.day}</b><span>${d.mon}${d.wd ? ' · ' + d.wd : ''}</span></div>
          <div class="ev-body"><span class="k">${esc(x.k)} · ${d.tm}</span><h3>${esc(x.t)}</h3>${big ? `<p>${esc(x.d)}</p>` : ''}
            ${big && e.book ? `<a class="btn bordo" href="#foglalas" data-book="${e.id}">${t().book}</a>` : ''}</div>
          ${big ? (e.img ? `<div class="ev-img"><img src="${IMG[e.img]}" alt="" loading="lazy"></div>` : '') : '<span class="go" aria-hidden="true">→</span>'}
        </${tag}>`;
      }).join('');
      watchReveal(box);
      $$('[data-book]', box).forEach(a => a.addEventListener('click', () => {
        const f = $('#bookForm'); if (!f) return;
        const ev = EV.events.find(x => x.id === a.dataset.book);
        f.elements.occ.value = 'marton'; f.elements.date.value = ev.start.slice(0, 10); f.elements.time.value = '18:00';
      }));
    });
  }

  /* péntek esti visszaszámláló */
  const cd = $('#countdown');
  function nextFriday() {
    const now = localNow(), d = new Date(now);
    const add = (5 - now.getDay() + 7) % 7;
    d.setDate(now.getDate() + add); d.setHours(19, 0, 0, 0);
    if (d <= now && now.getHours() < 24 && add === 0) return { live: true, d };
    if (d <= now) d.setDate(d.getDate() + 7);
    return { live: false, d };
  }
  function renderCountdown() {
    if (!cd) return;
    const { live, d } = nextFriday();
    if (live) { cd.innerHTML = `<div><b>${t().fridayNow}</b></div>`; return; }
    let s = Math.max(0, Math.floor((d - localNow()) / 1000));
    const parts = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
    cd.innerHTML = parts.map((v, i) => `<div><b>${pad(v)}</b><span>${t().cd[i]}</span></div>`).join('');
    $('#fridayDate').textContent = fmtDate(d, { month: 'long', day: 'numeric', weekday: 'long' });
  }

  /* asztalfoglalás */
  const bf = $('#bookForm');
  if (bf) {
    const now = localNow();
    bf.elements.date.min = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    bf.elements.date.value = bf.elements.date.min;
    bf.addEventListener('submit', e => {
      e.preventDefault();
      const err = $('.err', bf), name = bf.elements.name.value.trim(), tel = bf.elements.tel.value.trim();
      if (!name || !tel || !bf.elements.date.value) { err.textContent = t().need; return; }
      err.textContent = '';
      const d = fmtDate(new Date(bf.elements.date.value + 'T12:00'), { month: 'long', day: 'numeric' });
      $('#bookSms').textContent = t().bookSms(name.split(' ').pop(), d, bf.elements.time.value, bf.elements.people.value);
      bf.closest('.panel').classList.add('sent');
    });
    $('#bookAgain').addEventListener('click', () => bf.closest('.panel').classList.remove('sent'));
  }

  /* kapcsolat-űrlap */
  const mf = $('#msgForm');
  if (mf) {
    mf.addEventListener('submit', e => {
      e.preventDefault();
      const err = $('.err', mf), name = mf.elements.name.value.trim();
      if (!name || !mf.elements.contact.value.trim() || !mf.elements.msg.value.trim()) { err.textContent = t().need; return; }
      err.textContent = '';
      $('#msgOk').textContent = t().msgOk(name.split(' ').pop());
      mf.closest('.panel').classList.add('sent');
    });
    $('#msgAgain').addEventListener('click', () => mf.closest('.panel').classList.remove('sent'));
  }

  /* étlap: aktív kategória a ragadós sávban */
  const mnav = $('.menu-nav');
  if (mnav) {
    const links = $$('a', mnav);
    const ind = document.createElement('span');          // csúszó kijelölés
    ind.className = 'mn-ind'; ind.setAttribute('aria-hidden', 'true');
    mnav.prepend(ind);
    let lockUntil = 0;
    function setActive(id, instant) {
      links.forEach(a => {
        const on = a.getAttribute('href') === '#' + id;
        a.classList.toggle('on', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        if (!on) return;
        if (instant) ind.style.transition = 'none';
        ind.style.width = a.offsetWidth + 'px';
        ind.style.transform = `translateX(${a.offsetLeft}px)`;
        ind.classList.add('on');
        if (instant) { ind.offsetWidth; ind.style.transition = ''; }
        mnav.scrollTo({ left: a.offsetLeft - mnav.clientWidth / 2 + a.offsetWidth / 2, behavior: reduced ? 'auto' : 'smooth' });
      });
    }
    // görgetés: saját, lágy animáció — a ragadós sáv alá érkezik, nem mögé
    function glide(to, ms = 750) {
      const from = scrollY, d = to - from, t0 = performance.now();
      if (reduced || Math.abs(d) < 4) { scrollTo(0, to); return; }
      const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      (function step(now) {
        const k = Math.min(1, (now - t0) / ms);
        scrollTo(0, from + d * ease(k));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }
    links.forEach(a => a.addEventListener('click', e => {
      const sec = document.getElementById(a.getAttribute('href').slice(1));
      if (!sec) return;
      e.preventDefault();
      const stick = parseFloat(getComputedStyle(mnav).top) || 84;
      const y = sec.getBoundingClientRect().top + scrollY - stick - mnav.offsetHeight - 12;
      const dist = Math.abs(y - scrollY);
      const ms = Math.min(1100, 520 + dist * .12);
      lockUntil = performance.now() + ms + 120;
      setActive(sec.id);
      glide(y, ms);
      history.replaceState(null, '', '#' + sec.id);
      sec.classList.remove('arrive'); void sec.offsetWidth;
      setTimeout(() => sec.classList.add('arrive'), reduced ? 0 : ms - 160);
    }));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting || performance.now() < lockUntil) return;
      setActive(e.target.id);
    }), { rootMargin: '-30% 0px -60% 0px' });
    $$('.carte-sec').forEach(s => io.observe(s));
    const first = $$('.carte-sec')[0].id, h = location.hash.slice(1);
    setActive(h && document.getElementById(h) ? h : first, true);
    const realign = () => { const a = $('a.on', mnav); if (a) setActive(a.getAttribute('href').slice(1), true); };
    addEventListener('resize', realign);
    if (document.fonts) document.fonts.ready.then(realign);
  }

  /* ---------- „Rendelés” lap: alulról felcsúszó választó (mobil), középre nyíló ablak (asztali) ---------- */
  const sheet = document.createElement('div');
  sheet.className = 'osheet'; sheet.hidden = true;
  sheet.innerHTML = `<div class="os-back" data-os-close></div>
    <div class="os-panel" role="dialog" aria-modal="true" aria-labelledby="osTitle">
      <span class="os-grip" aria-hidden="true"></span>
      <button type="button" class="os-x" data-os-close><span class="vh"></span>×</button>
      <h3 id="osTitle"></h3><p class="os-sub"></p>
      <ul class="os-list"></ul>
      <a class="os-call" href="${EV.telHref}"><span></span> <b>${EV.tel}</b></a>
    </div>`;
  document.body.append(sheet);
  let osLast = null;
  function renderSheet() {
    const S = t().sheet;
    $('#osTitle', sheet).textContent = S.t; $('.os-sub', sheet).textContent = S.p;
    $('.os-call span', sheet).textContent = S.call; $('.os-x .vh', sheet).textContent = S.close;
    $('.os-list', sheet).innerHTML = EV.orderables.filter(available).map(o => {
      const x = L(o);
      return `<li><a href="napi-menu.html?r=${o.id}#rendeles" data-kind="${o.id}">
        ${o.img ? `<img src="${o.img}" alt="" loading="lazy">` : `<span class="os-ico" aria-hidden="true"></span>`}
        <span class="os-txt"><b>${esc(x.t)}</b><small>${esc(x.d)}</small></span>
        ${x.p ? `<em class="num">${esc(x.p)}</em>` : ''}<i aria-hidden="true">→</i></a></li>`;
    }).join('');
  }
  function openSheet(from) {
    osLast = from || document.activeElement;
    sheet.hidden = false; root.classList.add('os-lock');
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('open')));
    setTimeout(() => { const a = $('.os-list a', sheet); if (a) a.focus({ preventScroll: true }); }, 60);
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.classList.remove('open'); root.classList.remove('os-lock');
    setTimeout(() => { sheet.hidden = true; }, reduced ? 0 : 320);
    if (osLast && osLast.focus) osLast.focus({ preventScroll: true });
  }
  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-order-open]');
    if (opener) { e.preventDefault(); openSheet(opener); return; }
    if (e.target.closest('[data-os-close]')) { closeSheet(); return; }
    const a = e.target.closest('.os-list a');
    if (a && pick) {                       // már a rendelő oldalon vagyunk: nincs újratöltés
      e.preventDefault(); closeSheet(); setKind(a.dataset.kind, true);
      history.replaceState(null, '', '?r=' + a.dataset.kind + '#rendeles');
      const sec = document.getElementById('rendeles');
      setTimeout(() => glideTo(anchorY(sec)), reduced ? 0 : 200);
    } else if (a) { closeSheet(); }
  }, true);
  addEventListener('keydown', e => {
    if (sheet.hidden) return;
    if (e.key === 'Escape') closeSheet();
    if (e.key === 'Tab') {                 // fókusz a lapon belül marad
      const f = $$('a, button', $('.os-panel', sheet)), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- mindent újrarajzol (nyelvváltáskor is) ---------- */
  function renderAll() {
    renderStatus(); renderBoards(); renderPick(); renderPoster(); renderEvents(); renderCountdown(); renderOrderSummary(); trailTick(); renderSheet(); if (of) fillTimes();
    if (kitchen && kitchen.fill) kitchen.fill();
  }

  const saved = store.get('ev-lang');
  setLang(saved === 'ro' ? 'ro' : 'hu', false);
  { const k = new URLSearchParams(location.search).get('r'); if (k && pick) setKind(k); }
  watchReveal();
  trailTick(); parallax();
  setInterval(renderStatus, 60000);
  if (cd) setInterval(renderCountdown, 1000);
  $$('[data-year]').forEach(el => { el.textContent = localNow().getFullYear(); });
})();
