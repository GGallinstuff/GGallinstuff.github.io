/* Ano da Giardino - negozio (carrello, IT/EN, filtri). Base: sito Sticker Spam Society */
(function () {
  'use strict';
  var C = window.CATALOG, CFG = window.SITE_CONFIG || {};
  var LANG_KEY = 'ssc_lang', CART_KEY = 'ssc_cart_v1', SHIP_KEY = 'ssc_ship';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---------- testi ----------
  var T = {
    it: {
      announce: 'Spedizione gratis in Italia da 85€ · Ordine minimo 5€',
      nav_shop: 'Shop', nav_ship: 'Spedizioni', nav_custom: 'Rivenditori', nav_about: 'Chi siamo', nav_contact: 'Contatti',
      cart: 'Carrello', hero_sub: 'Ano_da_Giardino', slogan: '“L’oggetto inutile di cui hai bisogno”', cta_box: 'Adotta un Ano', cta_shop: 'Vai allo shop',
      ship_title: 'Spedizioni',
      ship_1: 'Italia: InPost al locker (5,50€) o BRT Express a domicilio (7,50€).',
      ship_2: 'Estero: pacco con corriere, 10€.',
      ship_3: 'Spedizione gratis in Italia sopra gli 85€.', ship_4: 'Ordine minimo 5€.',
      ship_5: 'Prepariamo l’ordine in 1-2 giorni e lo consegniamo al corriere entro 1 giorno.',
      ship_6: 'Corrieri: InPost e BRT Express.',
      ship_7: 'Ogni Ano viaggia in pacco: per ora niente spedizione in lettera.',
      ship_8: 'Ritiro a mano nella Bassa Modenese.',
      custom_title: 'Rivenditori e adozioni multiple',
      whole_h: 'Più di un Ano?', whole_p: 'Per adozioni multiple ci sono sconti, e se vuoi rivendere gli Ani possiamo parlarne. Scrivici in privato.', whole_cta: 'Scrivici',
      about_title: 'Chi siamo', about_1: 'Allevamento di Ani da Giardino e rivendita di Ani surrogati.',
      about_2: 'Nella Bassa Modenese, dal 2028.',
      contact_title: 'Contatti', contact_online: 'Solo online. Ritiro a mano nella Bassa Modenese.', terms: 'Termini',
      search: 'Cerca…', all: 'Tutti', add: 'Adotta', added: 'Aggiunto al carrello', of: 'su',
      empty: 'Il carrello è vuoto.', nothing: 'In arrivo.', remove: 'rimuovi',
      subtotal: 'Subtotale', shipping: 'Spedizione', total: 'Totale', free: 'Gratis',
      ship_h: 'Come vuoi riceverlo?',
      m_inpost: 'InPost locker', m_inpost_s: 'Solo Italia, ritiro al locker.',
      m_brt: 'BRT Express', m_brt_s: 'Solo Italia, a domicilio.',
      m_abroad: 'Pacco estero', m_abroad_s: 'Tutti i paesi tranne l’Italia, con corriere.',
      m_letter: 'Lettera Italia', m_letter_s: 'Solo Italia. No tracking, no reship, no refund.',
      m_letter_off: 'Non disponibile per questo carrello.',
      m_world: 'Lettera estero', m_world_s: 'Tutto il mondo tranne l’Italia. Senza tracking.',
      m_world_off: 'Non disponibile per questo carrello.',
      left: 'Ti mancano {x} per la spedizione gratis in Italia.', gotfree: 'Spedizione gratis in Italia!',
      min: 'Ordine minimo {x}.',
      pay: 'Vai al pagamento', wait: 'Un attimo…',
      e_terms: 'Devi accettare i termini.', e_unset: 'Il pagamento non è ancora collegato. Torna presto!', e_fail: 'Qualcosa è andato storto. Riprova o scrivici.',
      tag_nuovo: 'Nuovo', tag_riproposta: 'Riproposta'
    },
    en: {
      announce: 'Free shipping in Italy from €85 · Minimum order €5',
      nav_shop: 'Shop', nav_ship: 'Shipping', nav_custom: 'Resellers', nav_about: 'About', nav_contact: 'Contact',
      cart: 'Cart', hero_sub: 'Ano_da_Giardino', slogan: '“The useless object you need”', cta_box: 'Adopt an Ano', cta_shop: 'Go to the shop',
      ship_title: 'Shipping',
      ship_1: 'Italy: InPost to a locker (€5.50) or BRT Express home delivery (€7.50).',
      ship_2: 'Abroad: parcel by courier, €10.',
      ship_3: 'Free shipping in Italy over €85.', ship_4: 'Minimum order €5.',
      ship_5: 'We prepare your order in 1-2 days and hand it to the courier within 1 day.',
      ship_6: 'Couriers: InPost and BRT Express.',
      ship_7: 'Every Ano travels in a parcel: no letter shipping for now.',
      ship_8: 'Hand pickup in the Bassa Modenese area.',
      custom_title: 'Resellers and multiple adoptions',
      whole_h: 'More than one Ano?', whole_p: 'Multiple adoptions get a discount, and if you want to resell Ani we can talk. Write to us privately.', whole_cta: 'Write to us',
      about_title: 'About', about_1: 'Breeding Garden Ani and reselling surrogate Ani.',
      about_2: 'In the Bassa Modenese, since 2028.',
      contact_title: 'Contact', contact_online: 'Online only. Hand pickup in the Bassa Modenese area.', terms: 'Terms',
      search: 'Search…', all: 'All', add: 'Adopt', added: 'Added to cart', of: 'of',
      empty: 'Your cart is empty.', nothing: 'Coming soon.', remove: 'remove',
      subtotal: 'Subtotal', shipping: 'Shipping', total: 'Total', free: 'Free',
      ship_h: 'How do you want it?',
      m_inpost: 'InPost locker', m_inpost_s: 'Italy only, pick up at the locker.',
      m_brt: 'BRT Express', m_brt_s: 'Italy only, home delivery.',
      m_abroad: 'Parcel abroad', m_abroad_s: 'Every country except Italy, by courier.',
      m_letter: 'Letter Italy', m_letter_s: 'Italy only. No tracking, no reship, no refund.',
      m_letter_off: 'Not available for this cart.',
      m_world: 'Letter abroad', m_world_s: 'Worldwide except Italy. No tracking.',
      m_world_off: 'Not available for this cart.',
      left: 'Add {x} more for free shipping in Italy.', gotfree: 'Free shipping in Italy!',
      min: 'Minimum order {x}.',
      pay: 'Go to checkout', wait: 'One sec…',
      e_terms: 'You must accept the terms.', e_unset: 'Payment is not connected yet. Come back soon!', e_fail: 'Something went wrong. Try again or write to us.',
      tag_nuovo: 'New', tag_riproposta: 'Back again'
    }
  };

  // ---------- stato ----------
  var lang = 'it', cart = [], shipMethod = 'inpost', agreed = false, agreed2 = false;
  var TERMS_V = '2026-11-24b';
  var TC = {
    it: {
      read: 'Ho letto i <a href="termini.html" target="_blank">termini</a> di vendita.',
      und_letter: 'Ho capito che la lettera non \u00e8 tracciata, non viene rispedita se si perde e non \u00e8 rimborsabile.',
      und: 'Ho capito le condizioni di spedizione e di pagamento indicate nei termini e le accetto.',
      e1: 'Devi confermare di aver letto i termini.',
      e2: 'Devi confermare di aver capito le condizioni.'
    },
    en: {
      read: 'I have read the <a href="termini.html" target="_blank">terms</a> of sale.',
      und_letter: 'I understand that the letter is untracked, will not be reshipped if lost and is non-refundable.',
      und: 'I understand the shipping and payment conditions in the terms and I accept them.',
      e1: 'You must confirm that you have read the terms.',
      e2: 'You must confirm that you have understood the conditions.'
    }
  };
  function tc(k) { return TC[lang === 'en' ? 'en' : 'it'][k]; }
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  try { var l0 = localStorage.getItem(LANG_KEY); if (l0 === 'en' || l0 === 'it') lang = l0; else if ((navigator.language || '').slice(0, 2) !== 'it') lang = 'en'; } catch (e) {}
  cart = load(CART_KEY, []); shipMethod = load(SHIP_KEY, 'inpost');
  if (['inpost', 'brt', 'abroad', 'letter', 'letterworld'].indexOf(shipMethod) < 0) shipMethod = 'inpost';

  var BASE_N = C.products.length, EXTRA_KEY = 'sss_extra';
  function applyExtra(list) { C.products.length = BASE_N; (list || []).forEach(function (p) { if (p && p.id && p.options && !C.products.some(function (b) { return b.id === p.id; })) C.products.push(p); }); }
  applyExtra(load(EXTRA_KEY, []));
  var byId = {}; C.products.forEach(function (p) { byId[p.id] = p; });
  function reindex() { Object.keys(byId).forEach(function (k) { delete byId[k]; }); C.products.forEach(function (p) { byId[p.id] = p; }); }
  cart = cart.filter(function (l) { var p = byId[l.id]; return p && p.options[l.o] && (l.v < 0 || (p.variants && p.variants[l.v])); });

  function t(k, vars) { var s = (T[lang] && T[lang][k]) || T.it[k] || k; if (vars) for (var x in vars) s = s.replace('{' + x + '}', vars[x]); return s; }
  function money(n) { try { return new Intl.NumberFormat(lang === 'en' ? 'en-IE' : 'it-IT', { style: 'currency', currency: C.config.currency }).format(n); } catch (e) { return n.toFixed(2) + ' €'; } }
  function slug(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pname(p) { return p.name; }
  function vlabel(p, i) { return i >= 0 && p.variants ? p.variants[i][lang] || p.variants[i].it : ''; }
  function olabel(p, i) { return p.options[i].l[lang === 'en' ? 1 : 0]; }
  function pdesc(p) { return p.desc ? p.desc[lang === 'en' ? 1 : 0] : ''; }
  function cname(c) { return c[lang][0]; }

  // ---------- retrobottega: prodotti esauriti e vacanza ----------
  var SHOPST_KEY = 'sss_shopst';
  var shopSt = load(SHOPST_KEY, null) || { closed: false, mode: 'closed', msg: '', back: '', off: [] };
  var TX = {
    it: { soldout: 'Esaurito', soldout_s: 'esaurito', cart_off: 'Alcuni prodotti nel carrello sono esauriti: rimuovili per continuare.', closed_cart: 'Il negozio \u00e8 in vacanza: gli ordini sono chiusi.', vac_default: 'Siamo in vacanza! Torniamo presto.', vac_open: 'Siamo in vacanza: puoi ordinare, spediamo dal {x}.' },
    en: { soldout: 'Sold out', soldout_s: 'sold out', cart_off: 'Some items in your cart are sold out: remove them to continue.', closed_cart: 'The shop is on holiday: orders are closed.', vac_default: 'We are on holiday! Back soon.', vac_open: 'We are on holiday: you can order, we ship from {x}.' }
  };
  function tx(k, vars) { var s = (TX[lang === 'en' ? 'en' : 'it'] || TX.it)[k] || k; if (vars) for (var x in vars) s = s.replace('{' + x + '}', vars[x]); return s; }
  function isOff(p, vi) { var o = shopSt.off || []; return o.indexOf(p.id) > -1 || (vi >= 0 && p.variants && p.variants[vi] && o.indexOf(p.id + '|' + p.variants[vi].it) > -1); }
  function shopClosed() { return shopSt.closed && shopSt.mode === 'closed'; }
  function banner() {
    var el = $('.announce'); if (!el) return;
    if (shopSt.closed) { el.textContent = shopSt.msg || (shopSt.mode === 'open' ? tx('vac_open', { x: shopSt.back || '...' }) : tx('vac_default')); el.classList.add('vac'); }
    else if (el.classList.contains('vac')) { el.classList.remove('vac'); applyLang(); }
  }
  function loadStatus() {
    var ep = ((window.SITE_CONFIG || {}).checkoutEndpoint || '').replace(/\/+$/, ''); if (!ep) return;
    fetch(ep + '/status').then(function (r) { return r.json(); }).then(function (j) {
      var n = { closed: !!j.closed, mode: j.mode === 'open' ? 'open' : 'closed', msg: j.msg || '', back: j.back || '', off: Array.isArray(j.off) ? j.off : [] };
      var ex = Array.isArray(j.extra) ? j.extra : [];
      var exChanged = JSON.stringify(ex) !== JSON.stringify(load(EXTRA_KEY, []));
      if (exChanged) { save(EXTRA_KEY, ex); applyExtra(ex); reindex(); cart = cart.filter(function (l) { var p = byId[l.id]; return p && p.options[l.o] && (l.v < 0 || (p.variants && p.variants[l.v])); }); save(CART_KEY, cart); }
      var changed = exChanged || JSON.stringify(n) !== JSON.stringify(shopSt);
      shopSt = n; save(SHOPST_KEY, n);
      if (changed) { banner(); renderShop(); renderCart(); }
    }).catch(function () {});   // se non risponde: il sito resta normale
  }
  setTimeout(banner, 0); setTimeout(loadStatus, 50);

  // ---------- immagini con fallback ----------
  function sources(p, vi) {
    var s = [], base = 'img/prodotti/';
    if (vi >= 0 && p.variants) { var vs = slug(p.variants[vi].it); s.push(base + p.id + '-' + vs + '.png', base + p.id + '-' + vs + '.jpg'); }
    s.push(base + p.id + '.png', base + p.id + '.jpg');
    return s;
  }
  function setImg(img, ph, list) {
    var i = 0;
    ph.classList.remove('nofoto');
    img.onerror = function () { i++; if (i < list.length) img.src = list[i]; else ph.classList.add('nofoto'); };
    img.src = list[0];
  }
  function setThumb(img, list) {
    var i = 0;
    img.onerror = function () { i++; if (i < list.length) img.src = list[i]; else img.style.display = 'none'; };
    img.src = list[0];
  }

  // ---------- i18n statico ----------
  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    var title = $('#heroTitle');
    title.innerHTML = lang === 'en' ? 'Adopt the <em>Ano</em>' : 'Adotta l\u2019<em>Ano</em>';
    var m = $('#mailWhole'); if (m) m.setAttribute('href', 'mailto:' + (CFG.email || '') + '?subject=' + encodeURIComponent(lang === 'en' ? 'Multiple adoptions' : 'Adozioni multiple'));
  }

  // ---------- shop ----------
  var shop = $('#shop'), catbar = $('#catbar');
  var filters = {};  // per categoria: {q, tag, sub}

  function badgeFor(p) {
    if (p.tags.indexOf('riproposta') > -1 || p.tags.indexOf('riproposte') > -1) return '<span class="badge again">' + esc(t('tag_riproposta')) + '</span>';
    if (p.tags.indexOf('nuovo') > -1) return '<span class="badge">' + esc(t('tag_nuovo')) + '</span>';
    return '';
  }

  function makeCard(p) {
    var card = document.createElement('article');
    card.className = 'card rv'; card.setAttribute('data-id', p.id);
    var vi = p.variants ? 0 : -1, oi = 0;
    var opts = '';
    if (p.options.length > 1) {
      opts = '<select class="sel-o" aria-label="Opzione">' + p.options.map(function (o, i) { return '<option value="' + i + '">' + esc(olabel(p, i)) + ' – ' + money(o.price) + '</option>'; }).join('') + '</select>';
    }
    var vars = '';
    if (p.variants) vars = '<select class="sel-v" aria-label="Variante">' + p.variants.map(function (v, i) { return '<option value="' + i + '">' + esc(v[lang] || v.it) + (isOff(p, i) ? ' - ' + esc(tx('soldout_s')) : '') + '</option>'; }).join('') + '</select>';
    card.innerHTML =
      '<div class="ph">' + badgeFor(p) + '<img alt="" loading="lazy"><div class="fallback">' + esc(pname(p)) + '</div></div>' +
      '<div class="body"><h3>' + esc(pname(p)) + '</h3>' + (pdesc(p) ? '<p class="d">' + esc(pdesc(p)) + '</p>' : '') + vars + opts +
      '<div class="buy"><span class="price"></span><button type="button" class="add">' + esc(t('add')) + '</button></div></div>';
    var img = $('img', card), ph = $('.ph', card), price = $('.price', card);
    function upd() { price.textContent = money(p.options[oi].price); }
    upd(); setImg(img, ph, sources(p, vi));
    var sv = $('.sel-v', card), so = $('.sel-o', card);
    if (sv) sv.addEventListener('change', function () { vi = +sv.value; sync(); setImg(img, ph, sources(p, vi)); if (p.cat === 'tubini' && window.tubinoFx) setTimeout(function () { window.tubinoFx(img, ph); }, 60); });
    if (so) so.addEventListener('change', function () { oi = +so.value; upd(); });
    var btn = $('.add', card);
    ph.setAttribute('data-sold', tx('soldout'));
    function sync() { var off = isOff(p, vi); card.classList.toggle('soldout', off); btn.disabled = off; btn.textContent = off ? tx('soldout') : t('add'); }
    sync();
    btn.addEventListener('click', function () {
      addToCart(p.id, vi, oi, 1);
      btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
    });
    return card;
  }

  function matches(p, f) {
    if (f.sub && p.sub !== f.sub) return false;
    if (f.tag && p.tags.indexOf(f.tag) < 0) return false;
    if (f.q && norm(p.name + ' ' + (p.variants ? p.variants.map(function (v) { return v.it; }).join(' ') : '')).indexOf(norm(f.q)) < 0) return false;
    return true;
  }

  // video di categoria (muto, in loop, con bottone audio)
  function makeVideo(src) {
    var w = document.createElement('div'); w.className = 'catvideo rv';
    var v = document.createElement('video');
    v.src = src; v.muted = true; v.defaultMuted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = 'metadata';
    var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = 'AUDIO OFF';
    var on = false;
    b.addEventListener('click', function () { on = !on; v.muted = !on; b.textContent = on ? 'AUDIO ON' : 'AUDIO OFF'; if (v.paused) v.play(); });
    v.addEventListener('error', function () { w.remove(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause(); }); }, { threshold: 0.25 }).observe(v);
    var up = false, _pl = v.play.bind(v);
    v.play = function () { return up ? Promise.resolve() : _pl(); };
    var pb = document.createElement('button'); pb.type = 'button'; pb.className = 'btn'; pb.textContent = 'PAUSA'; pb.style.cssText = 'left:10px;right:auto';
    pb.addEventListener('click', function () { up = !up; if (up) { v.pause(); } else { _pl(); } pb.textContent = up ? 'PLAY' : 'PAUSA'; });
    w.appendChild(v); w.appendChild(b); w.appendChild(pb);
    return w;
  }

  function renderCategory(c) {
    var f = filters[c.id] = filters[c.id] || {};
    var sec = $('#' + c.id, shop);
    if (!sec) {
      sec = document.createElement('section'); sec.className = 'cat'; sec.id = c.id; shop.appendChild(sec);
    }
    var all = C.products.filter(function (p) { return p.cat === c.id; });
    var tagsHere = []; all.forEach(function (p) { p.tags.forEach(function (x) { if (tagsHere.indexOf(x) < 0) tagsHere.push(x); }); });
    var chips = '';
    if (c.subs) chips = '<button type="button" class="chip" data-sub="" aria-pressed="' + (!f.sub) + '">' + esc(t('all')) + '</button>' + c.subs.map(function (s) { return '<button type="button" class="chip" data-sub="' + s.id + '" aria-pressed="' + (f.sub === s.id) + '">' + esc(s[lang]) + '</button>'; }).join('');
    if (c.id === 'stickers') chips = '<button type="button" class="chip" data-tag="" aria-pressed="' + (!f.tag) + '">' + esc(t('all')) + '</button>' + tagsHere.map(function (x) { return '<button type="button" class="chip" data-tag="' + x + '" aria-pressed="' + (f.tag === x) + '">' + esc(t('tag_' + x)) + '</button>'; }).join('');
    if (c.id === 'stickers') chips = ''; var tools = '';
    if (c.id === 'stickers') tools = '<input class="search" type="search" placeholder="' + esc(t('search')) + '" value="' + esc(f.q || '') + '" aria-label="' + esc(t('search')) + '">';
    var list = all.filter(function (p) { return matches(p, f); });
    sec.innerHTML = '<div class="cat-head rv rv-out" style="--bg-img:url(img/sfondi/' + c.id + '.jpg)"><h2>' + esc(cname(c)) + '</h2><p>' + esc(c[lang][1]) + '</p></div>' +
      ((chips || tools) ? '<div class="tools-row">' + tools + chips + (c.id === 'stickers' ? '<span class="count">' + (f.q ? list.length + ' ' + esc(t('of')) + ' ' + all.length : all.length + ' stickers') + '</span>' : '') + '</div>' : '') +
      '<div class="body-' + c.id + '"></div>';
    var host = $('.body-' + c.id, sec);
    if (c.id === 'offerte') {
      list.forEach(function (p) {
        var vi = -1, oi = 0;
        var d = document.createElement('div'); d.className = 'feat rv';
        d.innerHTML = '<div class="ph"><img alt="" loading="lazy"><div class="fallback">' + esc(pname(p)) + '</div></div><div><h3>' + esc(pname(p)) + '</h3><p class="d" style="font-weight:400;color:var(--mute)">' + esc(pdesc(p)) + '</p><span class="price">' + money(p.options[0].price) + '</span><button type="button" class="btn add">' + esc(t('add')) + '</button></div>';
        setImg($('img', d), $('.ph', d), sources(p, vi));
        (function (ph) {
          var v = document.createElement('video');
          v.src = 'img/box-400.mp4'; v.muted = true; v.defaultMuted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
          v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = 'auto';
          v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1';
          ph.style.position = 'relative';
          var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = 'AUDIO OFF';
          b.style.cssText = 'position:absolute;right:10px;bottom:10px;z-index:2;padding:7px 12px;font-size:.75rem';
          var on = false;
          b.addEventListener('click', function () { on = !on; v.muted = !on; b.textContent = on ? 'AUDIO ON' : 'AUDIO OFF'; if (v.paused) v.play(); });
          v.addEventListener('error', function () { v.remove(); b.remove(); });
          v.addEventListener('loadeddata', function () { ph.appendChild(b); });
          if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause(); }); }, { threshold: 0.25 }).observe(v);
          ph.appendChild(v);
        })($('.ph', d));
        $('.add', d).addEventListener('click', function () { addToCart(p.id, vi, oi, 1); });
        if (isOff(p, -1)) { $('.add', d).disabled = true; $('.add', d).textContent = tx('soldout'); d.classList.add('soldout'); }
        host.appendChild(d);
      });
    } else {
      var g = document.createElement('div'); g.className = 'grid'; host.appendChild(g);
      if (c.id === 'tubini') host.insertBefore(makeVideo('img/tubini.mp4'), g);
      if (!list.length) host.innerHTML = '<p class="empty">' + esc(t('nothing')) + '</p>';
      list.forEach(function (p) { g.appendChild(makeCard(p)); });
    }
    // eventi filtri
    $$('.chip', sec).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.hasAttribute('data-sub')) f.sub = b.getAttribute('data-sub');
        if (b.hasAttribute('data-tag')) f.tag = b.getAttribute('data-tag');
        renderCategory(c); observe(sec);
      });
    });
    var s = $('.search', sec);
    if (s) s.addEventListener('input', function () {
      f.q = s.value; var pos = s.selectionStart;
      renderCategory(c); var ns = $('.search', sec); ns.focus(); try { ns.setSelectionRange(pos, pos); } catch (e) {} observe(sec);
    });
  }

  function hasProducts(c) { return C.products.some(function (p) { return p.cat === c.id; }); }
  function renderShop() {
    // mostra solo le categorie che hanno almeno un prodotto (le altre compaiono da sole quando ne aggiungi uno dal retrobottega)
    var live = C.categories.filter(hasProducts);
    C.categories.forEach(function (c) { if (!hasProducts(c)) { var old = $('#' + c.id, shop); if (old) old.remove(); } });
    live.forEach(renderCategory);
    live.forEach(function (c) { var s = $('#' + c.id, shop); if (s) shop.appendChild(s); });   // ordine come nel catalogo
    if (!live.length) shop.innerHTML = '<p class="empty empty-shop" style="padding:40px 0">' + esc(t('nothing')) + '</p>';
    else { var e0 = $('.empty-shop', shop); if (e0) e0.remove(); }
    var ca = $('#ctaAdopt'); if (ca) ca.setAttribute('href', live.length ? '#' + live[0].id : '#shop');
    catbar.innerHTML = live.map(function (c) { return '<a class="chip" href="#' + c.id + '">' + esc(cname(c)) + '</a>'; }).join('');
    observe(document);
  }

  // ---------- carrello ----------
  function lineKey(l) { return l.id + '|' + l.v + '|' + l.o; }
  function addToCart(id, v, o, q) {
    if (isOff(byId[id], v)) { toast(tx('soldout')); return; }
    var found = cart.filter(function (l) { return l.id === id && l.v === v && l.o === o; })[0];
    if (found) found.q = Math.min(99, found.q + q); else cart.push({ id: id, v: v, o: o, q: q });
    save(CART_KEY, cart); renderCart(); toast(t('added'));
    var tab = $('#cartTab'); tab.classList.remove('bump'); void tab.offsetWidth; tab.classList.add('bump');
  }
  function subtotal() { return cart.reduce(function (s, l) { return s + byId[l.id].options[l.o].price * l.q; }, 0); }
  function count() { return cart.reduce(function (s, l) { return s + l.q; }, 0); }

  // spedizioni: lettera Italia (3 euro) e lettera estero (7 euro) hanno limiti propri
  function letterCfg(kind) {
    var S = C.config.shipping;
    if (kind === 'letterworld') return S.letterWorld || { price: 7, maxStickers: 100, maxObjects: 2 };
    return S.letter;
  }
  function letterOk(kind) {
    if (!cart.length) return false;
    var L = letterCfg(kind), stk = 0, obj = 0;
    for (var i = 0; i < cart.length; i++) {
      var p = byId[cart[i].id], o = p.options[cart[i].o];
      if (!p.letter) return false;
      if (o.stk) stk += o.stk * cart[i].q; else obj += cart[i].q;
    }
    return stk <= L.maxStickers && obj <= L.maxObjects;
  }
  function isLetter(m) { return m === 'letter' || m === 'letterworld'; }
  function shipCost(sub) {
    var S = C.config.shipping;
    if (isLetter(shipMethod)) return letterCfg(shipMethod).price;
    if (shipMethod === 'abroad') return S.abroad ? S.abroad.price : 10;   // estero: mai gratis
    if (sub >= C.config.freeShippingFrom) return 0;
    return S[shipMethod].price;
  }

  // ---------- punto di ritiro InPost (FACOLTATIVO) ----------
  // Il cliente puo' cercare e scegliere un locker o un negozio InPost, ma non e' obbligatorio.
  // Se non sceglie, spediamo al locker piu' vicino all'indirizzo che scrive su Stripe.
  var PK_T = {
    it: {
      h: 'Scegli il punto di ritiro InPost',
      ph: 'CAP o citt\u00e0', go: 'Cerca', busy: 'Cerco i punti InPost\u2026',
      none: 'Nessun punto trovato. Prova con un altro CAP o con la citt\u00e0.',
      err: 'Il servizio InPost adesso non risponde. Riprova tra poco oppure scegli BRT / SDA.',
      found: '{n} punti trovati', many: 'ce ne sono altri: scrivi il CAP per vedere i pi\u00f9 vicini',
      pick: 'Scegli', chosen: 'Ritiro scelto', change: 'Cambia', keep: 'Tieni questo', clear: 'Togli',
      locker: 'Locker', shop: 'Negozio', h24: 'Aperto 24 ore su 24', info: 'Informazioni',
      i1: 'Scrivi il CAP o la citt\u00e0 e scegli dalla lista il locker o il negozio InPost dove vuoi ritirare il pacco.',
      i2b: 'Se c\u2019\u00e8 un problema',
      i2: 'Se un errore grave ci impedisce di spedire, ti mandiamo una email. Se entro 48 ore non rispondi, annulliamo l\u2019ordine e ti rimborsiamo.',
      e_pick: 'Scegli dalla lista il punto InPost dove ritirare il pacco.',
      filter: 'Filtra per via'
    },
    en: {
      h: 'Choose your InPost pickup point',
      ph: 'Postcode or city', go: 'Search', busy: 'Looking for InPost points\u2026',
      none: 'No points found. Try another postcode or the city.',
      err: 'The InPost service is not answering right now. Try again in a moment or choose BRT / SDA.',
      found: '{n} points found', many: 'there are more: type the postcode to see the closest ones',
      pick: 'Choose', chosen: 'Pickup chosen', change: 'Change', keep: 'Keep this one', clear: 'Remove',
      locker: 'Locker', shop: 'Shop', h24: 'Open 24/7', info: 'Info',
      i1: 'Type the postcode or the city and choose from the list the InPost locker or shop where you want to pick up your parcel.',
      i2b: 'If there is a problem',
      i2: 'If a serious error stops us from shipping, we send you an email. If you don\u2019t answer within 48 hours, we cancel the order and refund you.',
      e_pick: 'Choose from the list the InPost point where you want to pick up your parcel.',
      filter: 'Filter by street'
    }
  };
  function pk(k, vars) { var s = (PK_T[lang === 'en' ? 'en' : 'it'] || PK_T.it)[k] || k; if (vars) for (var x in vars) s = s.replace('{' + x + '}', vars[x]); return s; }
  var PICK_KEY = 'ssc_pickup', PTS_API = 'https://api-it-local-points.easypack24.net/v1/points';
  var pickup = load(PICK_KEY, null);
  if (!pickup || typeof pickup.code !== 'string' || !pickup.code) pickup = null;
  var pickQ = '', pickRes = null, pickCut = false, pickState = 'idle', pickOpen = false, pickReq = 0, pkI1 = false, pkI2 = false;

  function pkNorm(x) {
    var a = x.address_details || {}, ty = x.type || [];
    return {
      code: String(x.name || ''),
      kind: ty.indexOf('parcel_locker') > -1 ? 'locker' : 'shop',
      where: String(x.location_description || '').replace(/^at\s+/i, ''),
      street: [a.street, a.building_number].filter(Boolean).join(' '),
      zip: String(a.post_code || ''), city: String(a.city || ''), prov: String(a.province || ''),
      hours: x.location_247 ? 'h24' : String(x.opening_hours || ''), dist: +x.distance || 0
    };
  }
  function pkFetch(params) {
    return fetch(PTS_API + '?' + params + '&per_page=100&limit=100').then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (j) { return { items: Array.isArray(j.items) ? j.items : [], count: +j.count || 0 }; });
  }
  function pkKm(m) { return m < 1000 ? Math.max(10, Math.round(m / 10) * 10) + ' m' : (m / 1000).toFixed(1).replace('.', lang === 'en' ? '.' : ',') + ' km'; }
  function pkCity(q) { return q.toLowerCase().replace(/(^|[\s'\-])([a-z\u00e0-\u00fc])/g, function (a, b, c) { return b + c.toUpperCase(); }).replace(/ (Di|Del|Della|Dei|Delle|De|In|Nel|Nell|Nella|Sul|Sull|Sulla|Al|Alla|Allo|E|Ed|A|Da|Dal|Sopra|Sotto)(?=[ ']|$)/g, function (a) { return a.toLowerCase(); }); }
  // elenco dei comuni italiani (data/comuni.json, Garda Informatica, licenza MIT): caricato solo quando serve
  var PK_COM = null, pkComBusy = false, pkComCb = null, pickSug = [], pickF = '', pickNear = false;
  function pkKey(s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function pkLoadComuni(cb) {
    if (PK_COM) { if (cb) cb(); return; }
    if (cb) pkComCb = cb;
    if (pkComBusy) return; pkComBusy = true;
    fetch('data/comuni.json').then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); }).then(function (a) {
      PK_COM = a.map(function (s) { var f = s.split('|'); return { n: f[0], p: f[1], lat: +f[2], lon: +f[3], k: pkKey(f[0]), k2: pkKey(f[0].split('/')[0]) }; });
      pkComBusy = false; var f = pkComCb; pkComCb = null; if (f) f();
    }).catch(function () { pkComBusy = false; });
  }
  function pkSplit(q) { var m = /^(.*?)\s*\(([A-Za-z]{2})\)\s*$/.exec(q); return m ? { k: pkKey(m[1]), p: m[2].toUpperCase() } : { k: pkKey(q), p: '' }; }
  function pkSuggest(q) {
    var s = pkSplit(q), k = s.k;
    if (!PK_COM || k.length < 2 || /^\d+$/.test(k)) return [];
    var a = [], b = [];
    for (var i = 0; i < PK_COM.length && a.length < 8; i++) {
      var c = PK_COM[i];
      if (s.p && c.p !== s.p) continue;
      if (c.k.indexOf(k) === 0) a.push(c); else if (b.length < 8 && c.k.indexOf(' ' + k) > -1) b.push(c);
    }
    return a.concat(b).slice(0, 8);
  }
  function pkExact(q) {
    if (!PK_COM) return null; var s = pkSplit(q);
    for (var i = 0; i < PK_COM.length; i++) if ((PK_COM[i].k === s.k || PK_COM[i].k2 === s.k) && (!s.p || PK_COM[i].p === s.p)) return PK_COM[i];
    return null;
  }
  function pkSugHtml() {
    if (!pickSug.length) return '';
    return pickSug.map(function (c, i) { return '<li><button type="button" class="pk-sug-b" data-pk="sug" data-i="' + i + '">' + esc(c.n) + ' <span>(' + esc(c.p) + ')</span></button></li>'; }).join('');
  }
  function pkShowSug() { var u = $('#pksug'); if (u) u.innerHTML = pkSugHtml(); }
  function pkSearch(target) {
    var q = pickQ.replace(/\s+/g, ' ').trim();
    if (!q && !target) return;
    var zip = /^\d{5}$/.test(q), id = ++pickReq, c = target || (!zip ? (pkExact(q) || pickSug[0]) : null) || null, near = zip || !!c, base;
    if (c && !target) pickQ = c.n + ' (' + c.p + ')';
    pickSug = []; pkShowSug();
    if (zip) base = 'relative_post_code=' + q + '&max_distance=8000';
    else if (c) base = 'relative_point=' + c.lat + ',' + c.lon + '&max_distance=8000';
    else base = 'city=' + encodeURIComponent(pkCity(q.replace(/\s*\([A-Za-z]{2}\)\s*$/, '')));
    pickState = 'busy'; pickRes = null; renderPick();
    Promise.all([pkFetch(base + '&type=parcel_locker'), pkFetch(base + '&type=pop')]).then(function (r) {
      if (id !== pickReq) return;
      var seen = {}, list = [];
      r[0].items.concat(r[1].items).forEach(function (x) {
        var p = pkNorm(x);
        if (x.status !== 'Operating' || !p.code || seen[p.code]) return;
        seen[p.code] = 1; list.push(p);
      });
      if (near) list.sort(function (a, b) { return a.dist - b.dist; });
      else list.sort(function (a, b) { return a.zip < b.zip ? -1 : a.zip > b.zip ? 1 : a.street.localeCompare(b.street, 'it'); });
      pickCut = !near && (r[0].count > 100 || r[1].count > 100);
      pickRes = list; pickNear = near; pickF = ''; pickState = 'done'; renderPick();
    }).catch(function () { if (id !== pickReq) return; pickState = 'error'; renderPick(); });
  }
  function pkListHtml() {
    var f = pkKey(pickF), all = pickRes.map(function (p, i) { return { p: p, i: i }; });
    if (f) all = all.filter(function (o) { return pkKey([o.p.street, o.p.where, o.p.city, o.p.zip].join(' ')).indexOf(f) > -1; });
    else if (pickNear) all = all.slice(0, 50);
    return '<div class="pk-msg" role="status">' + esc(pk('found', { n: all.length })) + (pickCut && !f ? ' \u00b7 ' + esc(pk('many')) : '') + '</div>' +
      (all.length ? '<ul class="pk-list">' + all.map(function (o) { return pkItem(o.p, o.i); }).join('') + '</ul>' : '');
  }
  function pkZipCity(p) { return [p.zip, p.city].filter(Boolean).join(' ') + (p.prov ? ' (' + p.prov + ')' : ''); }
  function pkTag(p) { return '<span class="pk-tag">' + esc(p.kind === 'locker' ? pk('locker') : pk('shop')) + '</span>'; }
  function pkItem(p, i) {
    var hrs = p.hours === 'h24' ? pk('h24') : p.hours;
    return '<li><div class="pk-info"><div class="pk-street">' + esc(p.street || '\u2014') + '</div>' +
      '<div class="pk-meta">' + esc(pkZipCity(p)) + (p.dist ? ' \u00b7 ' + pkKm(p.dist) : '') + '</div>' +
      '<div class="pk-meta">' + pkTag(p) + esc(p.where) + '</div>' +
      (hrs ? '<div class="pk-meta">' + esc(hrs) + '</div>' : '') + '</div>' +
      '<button type="button" class="pk-pick" data-pk="pick" data-i="' + i + '">' + esc(pk('pick')) + '</button></li>';
  }
  function renderPick() {
    var el = $('#pick'); if (!el) return;
    var head = '<div class="pk-h"><span>' + esc(pk('h')) + '</span><button type="button" class="pk-i" data-pk="i1" aria-expanded="' + pkI1 + '" aria-label="' + esc(pk('info')) + '">i</button></div>' +
      (pkI1 ? '<p class="pk-note">' + esc(pk('i1')) + '</p>' : '');
    var tail = '<button type="button" class="pk-more" data-pk="i2" aria-expanded="' + pkI2 + '"><span class="pk-i">i</span>' + esc(pk('i2b')) + '</button>' +
      (pkI2 ? '<p class="pk-note">' + esc(pk('i2')) + '</p>' : '');
    if (pickup && !pickOpen) {
      el.innerHTML = head + '<div class="pk-sel"><div class="pk-info"><div class="pk-lbl">' + esc(pk('chosen')) + '</div>' +
        '<div class="pk-street">' + esc(pickup.street || '\u2014') + '</div><div class="pk-meta">' + esc(pkZipCity(pickup)) + '</div>' +
        '<div class="pk-meta">' + pkTag(pickup) + esc(pickup.where) + '</div></div>' +
        '<div class="pk-btns"><button type="button" class="pk-pick" data-pk="change">' + esc(pk('change')) + '</button>' +
        '<button type="button" class="rm" data-pk="clear">' + esc(pk('clear')) + '</button></div></div>' + tail;
      return;
    }
    var h = head +
      '<div class="pk-form"><input id="pkq" class="pk-in" type="text" inputmode="search" autocomplete="postal-code" placeholder="' + esc(pk('ph')) + '" aria-label="' + esc(pk('ph')) + '" value="' + esc(pickQ) + '">' +
      '<button type="button" class="pk-go" data-pk="go">' + esc(pk('go')) + '</button></div>' +
      '<ul class="pk-sug" id="pksug">' + pkSugHtml() + '</ul>';
    if (pickup) h += '<button type="button" class="rm" data-pk="keep">' + esc(pk('keep')) + '</button>';
    if (pickState === 'busy') h += '<div class="pk-msg" role="status">' + esc(pk('busy')) + '</div>';
    else if (pickState === 'error') h += '<div class="pk-msg bad" role="alert">' + esc(pk('err')) + '</div>';
    else if (pickState === 'done') {
      if (!pickRes.length) h += '<div class="pk-msg" role="status">' + esc(pk('none')) + '</div>';
      else h += '<input id="pkf" class="pk-in pk-f" type="text" inputmode="search" autocomplete="off" placeholder="' + esc(pk('filter')) + '" aria-label="' + esc(pk('filter')) + '" value="' + esc(pickF) + '"><div id="pkwrap">' + pkListHtml() + '</div>';
    }
    el.innerHTML = h + tail;
  }
  function pkSmack() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var old = document.querySelectorAll('.pk-smack, .pk-flash'); for (var i = 0; i < old.length; i++) old[i].remove();
    var fl = document.createElement('div'); fl.className = 'pk-flash';
    document.body.appendChild(fl);
    setTimeout(function () { fl.remove(); }, 1300);
  }
  function pickPayload() {
    if (shipMethod !== 'inpost' || !pickup) return undefined;
    function c(s) { return String(s || '').slice(0, 120); }
    return { code: c(pickup.code), kind: pickup.kind, name: c(pickup.where), street: c(pickup.street), zip: c(pickup.zip), city: c(pickup.city), prov: c(pickup.prov) };
  }
  $('#cartFoot').addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-pk]') : null; if (!b) return;
    var a = b.getAttribute('data-pk');
    if (a === 'go') { var inp = $('#pkq'); if (inp) pickQ = inp.value; pkSearch(); }
    else if (a === 'pick') {
      var p = pickRes && pickRes[+b.getAttribute('data-i')]; if (!p) return;
      pickup = { code: p.code, kind: p.kind, where: p.where, street: p.street, zip: p.zip, city: p.city, prov: p.prov, hours: p.hours };
      save(PICK_KEY, pickup); pickOpen = false; renderPick();
    }
    else if (a === 'change') { pickOpen = true; renderPick(); }
    else if (a === 'keep') { pickOpen = false; renderPick(); }
    else if (a === 'clear') { pickup = null; save(PICK_KEY, null); pickOpen = false; renderPick(); }
    else if (a === 'sug') { var s = pickSug[+b.getAttribute('data-i')]; if (!s) return; pickQ = s.n + ' (' + s.p + ')'; pkSearch(s); }
    else if (a === 'i1') { pkI1 = !pkI1; renderPick(); }
    else if (a === 'i2') { pkI2 = !pkI2; renderPick(); }
  });
  $('#cartFoot').addEventListener('input', function (e) {
    if (e.target.id === 'pkf') { pickF = e.target.value; var w = $('#pkwrap'); if (w) w.innerHTML = pkListHtml(); return; }
    if (e.target.id !== 'pkq') return;
    pickQ = e.target.value;
    var v = pickQ.trim();
    if (/^\d{5}$/.test(v)) { pkSearch(); return; }
    pkLoadComuni(function () { pickSug = pkSuggest(pickQ); pkShowSug(); });
  });
  $('#cartFoot').addEventListener('focusin', function (e) { if (e.target.id === 'pkq') pkLoadComuni(); });
  $('#cartFoot').addEventListener('keydown', function (e) { if (e.target.id === 'pkq' && e.key === 'Enter') { e.preventDefault(); pickQ = e.target.value; pkSearch(); } });

  function renderCart() {
    var n = count(), sub = subtotal();
    $('#cartCount').textContent = n; $('#tabCount').textContent = n; $('#tabTotal').textContent = money(sub);
    if (isLetter(shipMethod) && !letterOk(shipMethod)) { shipMethod = 'inpost'; agreed2 = false; save(SHIP_KEY, shipMethod); }
    var lines = $('#cartLines'), foot = $('#cartFoot');
    if (!cart.length) { lines.innerHTML = '<p class="empty">' + esc(t('empty')) + '</p>'; foot.innerHTML = ''; return; }
    lines.innerHTML = cart.map(function (l, i) {
      var p = byId[l.id], o = p.options[l.o];
      var sub2 = [vlabel(p, l.v), p.options.length > 1 ? olabel(p, l.o) : ''].filter(Boolean).join(' · ');
      return '<div class="line' + (isOff(p, l.v) ? ' soldout-line' : '') + '" data-i="' + i + '"><div class="th"><img alt=""></div>' +
        '<div><div class="nm">' + esc(pname(p)) + '</div>' + (sub2 ? '<div class="vr">' + esc(sub2) + '</div>' : '') +
        '<div class="qty"><button type="button" data-d="-1" aria-label="-">−</button><span>' + l.q + '</span><button type="button" data-d="1" aria-label="+">+</button></div></div>' +
        '<div class="pr">' + money(o.price * l.q) + '<button type="button" class="rm" data-rm="1">' + esc(t('remove')) + '</button></div></div>';
    }).join('');
    $$('.line', lines).forEach(function (row) {
      var i = +row.getAttribute('data-i');
      setThumb($('.th img', row), sources(byId[cart[i].id], cart[i].v));
      $$('[data-d]', row).forEach(function (b) { b.addEventListener('click', function () { cart[i].q += +b.getAttribute('data-d'); if (cart[i].q <= 0) cart.splice(i, 1); if (cart[i] && cart[i].q > 99) cart[i].q = 99; save(CART_KEY, cart); renderCart(); }); });
      $('[data-rm]', row).addEventListener('click', function () { cart.splice(i, 1); save(CART_KEY, cart); renderCart(); });
    });
    var S = C.config.shipping, lokIT = letterOk('letter'), lokW = letterOk('letterworld'), free = C.config.freeShippingFrom, min = C.config.minOrder;
    var cost = shipCost(sub), tot = sub + cost;
    function m(id, name, price, small, off) {
      return '<label class="' + (off ? 'off' : '') + '"><input type="radio" name="ship" value="' + id + '"' + (shipMethod === id ? ' checked' : '') + (off ? ' disabled' : '') + '><span>' + esc(name) + ' – ' + money(price) + (small ? '<small>' + esc(small) + '</small>' : '') + '</span></label>';
    }
    var inpostP = sub >= free ? 0 : S.inpost.price, brtP = sub >= free ? 0 : S.brt.price;
    var abroadP = S.abroad ? S.abroad.price : 10;
    var bar = (shipMethod === 'inpost' || shipMethod === 'brt') ? '<div class="bar"><i style="width:' + Math.min(100, sub / free * 100) + '%"></i></div><div class="hint">' + (sub >= free ? esc(t('gotfree')) : esc(t('left', { x: money(free - sub) }))) + '</div>' : '';
    foot.innerHTML =
      '<div class="hint" style="color:var(--ink)">' + esc(t('ship_h')) + '</div><div class="ship">' +
        m('inpost', t('m_inpost'), inpostP, t('m_inpost_s')) +
        m('brt', t('m_brt'), brtP, t('m_brt_s')) +
        (S.abroad ? m('abroad', t('m_abroad'), abroadP, t('m_abroad_s')) : '') +
        (lokIT ? m('letter', t('m_letter'), S.letter.price, t('m_letter_s')) : '') +      // la lettera compare solo se tutto il carrello ci sta
        (lokW ? m('letterworld', t('m_world'), letterCfg('letterworld').price, t('m_world_s')) : '') +
      '</div>' + (shipMethod === 'inpost' ? '<div class="pick" id="pick"></div>' : '') + bar +
      '<div class="sum"><span>' + esc(t('subtotal')) + '</span><span>' + money(sub) + '</span></div>' +
      '<div class="sum"><span>' + esc(t('shipping')) + '</span><span>' + (cost === 0 ? esc(t('free')) : money(cost)) + '</span></div>' +
      '<div class="sum tot"><span>' + esc(t('total')) + '</span><span>' + money(tot) + '</span></div>' +
      (sub < min ? '<div class="hint">' + esc(t('min', { x: money(min) })) + '</div>' : '') +
      '<label class="terms"><input type="checkbox" id="agree"' + (agreed ? ' checked' : '') + '><span>' + tc('read') + '</span></label>' +
      '<label class="terms"><input type="checkbox" id="agree2"' + (agreed2 ? ' checked' : '') + '><span>' + tc(isLetter(shipMethod) ? 'und_letter' : 'und') + '</span></label>' +
      '<button type="button" class="btn" id="payBtn"' + (sub < min ? ' disabled' : '') + '>' + esc(t('pay')) + '</button><div class="err" id="err" role="alert"></div>';
    $$('input[name=ship]', foot).forEach(function (r) { r.addEventListener('change', function () { shipMethod = r.value; agreed2 = false; save(SHIP_KEY, shipMethod); renderCart(); }); });
    $('#agree').addEventListener('change', function (e) { agreed = e.target.checked; });
    $('#agree2').addEventListener('change', function (e) { agreed2 = e.target.checked; });
    $('#payBtn').addEventListener('click', checkout); if (shipMethod === 'inpost') renderPick();
  }

  function checkout() {
    if (shopClosed()) { toast(tx('closed_cart')); return; }
    if (cart.some(function (l) { return isOff(byId[l.id], l.v); })) { toast(tx('cart_off')); return; }
    var err = $('#err'), btn = $('#payBtn'); err.textContent = '';
    if (shipMethod === 'inpost' && !pickup) { err.textContent = pk('e_pick'); pickOpen = true; renderPick(); pkSmack(); var pkb = $('#pick'); if (pkb && pkb.scrollIntoView) pkb.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    if (!$('#agree').checked) { err.textContent = tc('e1'); pkSmack(); return; }
    if (!$('#agree2').checked) { err.textContent = tc('e2'); pkSmack(); return; }
    if (!CFG.checkoutEndpoint) { err.textContent = t('e_unset'); return; }
    btn.disabled = true; btn.textContent = t('wait');
    fetch(CFG.checkoutEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart.map(function (l) { return { id: l.id, v: l.v, o: l.o, q: l.q }; }), shipping: shipMethod, lang: lang, consent: { read: true, understood: true, v: TERMS_V }, pickup: pickPayload() })
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok || !j.url) throw new Error(j.error || 'err'); return j; }); })
      .then(function (j) { window.location.href = j.url; })
      .catch(function (e) { err.textContent = t('e_fail') + (e && e.message && e.message !== 'err' ? ' (' + e.message + ')' : ''); btn.disabled = false; btn.textContent = t('pay'); });
  }

  // ---------- drawer / toast ----------
  function openCart() { $('#drawer').classList.add('open'); $('#veil').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); }
  function closeCart() { $('#drawer').classList.remove('open'); $('#veil').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); }
  var toastT; function toast(msg) { var el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('show'); }, 1400); }
  $('#cartTab').addEventListener('click', openCart); $('#cartBtn').addEventListener('click', openCart);
  $('#closeCart').addEventListener('click', closeCart); $('#veil').addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });
  $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { lang = b.getAttribute('data-lang'); try { localStorage.setItem(LANG_KEY, lang); } catch (e) {} applyLang(); banner(); renderShop(); renderCart(); }); });

  // ---------- comparsa / scomparsa allo scroll ----------
  var io = null;
  function observe(root) {
    var els = $$('.rv', root === document ? document : root);
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    if (!io) io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target;
        if (en.isIntersecting) { el.classList.add('in'); el.classList.remove('in-out'); }
        else if (el.classList.contains('rv-out')) el.classList.remove('in');   // titoli: svaniscono quando escono
      });
    }, { threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  // ---------- scia del cursore ----------
  function trail() {
    var cv = $('#trail');
    if (!window.matchMedia || !matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) { cv.style.display = 'none'; return; }
    var ctx = cv.getContext('2d'), pts = [], W, H;
    function size() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
    size(); window.addEventListener('resize', size);
    var last = 0;
    window.addEventListener('pointermove', function (e) { var n = performance.now(); if (n - last < 16) return; last = n; pts.push({ x: e.clientX, y: e.clientY, a: 1 }); if (pts.length > 40) pts.shift(); });
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i]; p.a -= 0.035;
        if (p.a > 0) { var s = 4 + p.a * 8; ctx.fillStyle = 'rgba(182,255,0,' + (p.a * 0.55).toFixed(3) + ')'; ctx.fillRect(Math.round(p.x - s / 2), Math.round(p.y - s / 2), s, s); }
      }
      pts = pts.filter(function (p) { return p.a > 0; });
      requestAnimationFrame(loop);
    })();
  }

  // ---------- logo / foto opzionali ----------
  function optionalImages() {
    var im = new Image();
    im.onload = function () { $('#logoText').innerHTML = ''; var i = document.createElement('img'); i.src = 'img/logo.png'; i.alt = CFG.shopName || ''; $('#logoText').appendChild(i); var al = $('#aboutLogo'); if (al) al.hidden = false; };
    im.src = 'img/logo.png';
    var ab = $('#aboutImg'), a2 = new Image();
    a2.onload = function () { ab.hidden = false; }; a2.src = 'img/chi-siamo.jpg';
  }

  // ---------- avvio ----------
  applyLang(); renderShop(); renderCart(); optionalImages(); observe(document);
})();
