// Retrobottega - scheda "Contabilita'": export Excel delle vendite per il commercialista.
// - sceglie un giorno (o un mese), chiede al worker le vendite con commissioni Stripe e netto
// - crea un vero file .xlsx (senza programmi esterni) con 3 fogli: Riepilogo, Vendite, Righe prodotti
// - "Allega a Mail": apre il menu Condividi del Mac (scegli Mail) con il file gia' attaccato
// - archivio degli export fatti, salvato nel worker (chiave KV "exports")
(function () {
  'use strict';

  // ================= XLSX minimo (zip senza compressione + XML) =================
  var CRC = (function () { var t = [], c, n, k; for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(u) { var c = 0xFFFFFFFF; for (var i = 0; i < u.length; i++) c = CRC[(c ^ u[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function zip(files) {   // files: [{name, data(Uint8Array)}]
    var enc = new TextEncoder(), parts = [], central = [], off = 0, d = new Date();
    var dt = ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xFFFF;
    var dd = (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF;
    function hdr(size) { var b = new DataView(new ArrayBuffer(size)); return b; }
    files.forEach(function (f) {
      var nm = enc.encode(f.name), crc = crc32(f.data), len = f.data.length;
      var h = hdr(30);
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint16(10, dt, true); h.setUint16(12, dd, true); h.setUint32(14, crc, true); h.setUint32(18, len, true); h.setUint32(22, len, true);
      h.setUint16(26, nm.length, true); h.setUint16(28, 0, true);
      parts.push(new Uint8Array(h.buffer), nm, f.data);
      var c = hdr(46);
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
      c.setUint16(12, dt, true); c.setUint16(14, dd, true); c.setUint32(16, crc, true); c.setUint32(20, len, true); c.setUint32(24, len, true);
      c.setUint16(28, nm.length, true); c.setUint32(42, off, true);
      central.push(new Uint8Array(c.buffer), nm);
      off += 30 + nm.length + len;
    });
    var csize = central.reduce(function (s, a) { return s + a.length; }, 0);
    var e = hdr(22);
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
    e.setUint32(12, csize, true); e.setUint32(16, off, true);
    return new Blob(parts.concat(central, [new Uint8Array(e.buffer)]), { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  function x(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ''); }
  function col(n) { var s = ''; n++; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
  // Stili (indici di cellXfs nello styles.xml qui sotto)
  var S = { txt: 0, head: 1, eur: 2, date: 3, time: 4, totl: 5, tote: 6, toti: 7, title: 8, note: 9, warn: 10, bold: 11, int: 12, beur: 13, wrap: 14 };
  var STYLES = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<numFmts count="3"><numFmt numFmtId="164" formatCode="#,##0.00\\ &quot;€&quot;;[Red]\\-#,##0.00\\ &quot;€&quot;"/><numFmt numFmtId="165" formatCode="dd/mm/yyyy"/><numFmt numFmtId="166" formatCode="hh:mm"/></numFmts>' +
    '<fonts count="6"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>' +
    '<font><b/><sz val="15"/><name val="Calibri"/></font><font><i/><sz val="10"/><color rgb="FF66665F"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFC00000"/><name val="Calibri"/></font></fonts>' +
    '<fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0B0B0B"/></patternFill></fill>' +
    '<fill><patternFill patternType="solid"><fgColor rgb="FFEFEFEA"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFE0E0"/></patternFill></fill></fills>' +
    '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left/><right/><top style="medium"><color rgb="FF0B0B0B"/></top><bottom/><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="15">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="2" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>' +
    '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="164" fontId="1" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="1" fontId="1" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
    '<xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
    '<xf numFmtId="0" fontId="5" fillId="4" borderId="0" xfId="0" applyFont="1" applyFill="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
    '<xf numFmtId="1" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="164" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf>' +
    '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';

  // cella: stringa | numero | {f:'SUM(..)'} | {v, s} | null
  function cellXml(ref, c) {
    if (c == null || c === '') return '';
    if (typeof c !== 'object') c = { v: c };
    var s = c.s != null ? ' s="' + c.s + '"' : '';
    if (c.f) return '<c r="' + ref + '"' + s + '><f>' + x(c.f) + '</f></c>';
    if (c.v == null || c.v === '') return c.s != null ? '<c r="' + ref + '"' + s + '/>' : '';
    if (typeof c.v === 'number' && isFinite(c.v)) return '<c r="' + ref + '"' + s + '><v>' + c.v + '</v></c>';
    return '<c r="' + ref + '"' + s + ' t="inlineStr"><is><t xml:space="preserve">' + x(c.v) + '</t></is></c>';
  }
  // sh: {rows:[[cell]], widths:[n], freeze: righe bloccate, filter:'A4:P20', merges:['A1:F1'], protect:bool, selected:bool}
  function sheetXml(sh) {
    var h = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      '<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView workbookViewId="0"' + (sh.selected ? ' tabSelected="1"' : '') + '>' +
      (sh.freeze ? '<pane ySplit="' + sh.freeze + '" topLeftCell="A' + (sh.freeze + 1) + '" activePane="bottomLeft" state="frozen"/>' : '') +
      '</sheetView></sheetViews><sheetFormatPr defaultRowHeight="15"/>';
    if (sh.widths) h += '<cols>' + sh.widths.map(function (w, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'; }).join('') + '</cols>';
    h += '<sheetData>' + sh.rows.map(function (r, ri) {
      var cells = (r || []).map(function (c, ci) { return cellXml(col(ci) + (ri + 1), c); }).join('');
      return '<row r="' + (ri + 1) + '"' + (sh.heights && sh.heights[ri] ? ' ht="' + sh.heights[ri] + '" customHeight="1"' : '') + '>' + cells + '</row>';
    }).join('') + '</sheetData>';
    if (sh.protect) h += '<sheetProtection sheet="1" objects="1" scenarios="1" selectLockedCells="0" selectUnlockedCells="0"/>';
    if (sh.filter) h += '<autoFilter ref="' + sh.filter + '"/>';
    if (sh.merges && sh.merges.length) h += '<mergeCells count="' + sh.merges.length + '">' + sh.merges.map(function (m) { return '<mergeCell ref="' + m + '"/>'; }).join('') + '</mergeCells>';
    h += '<pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>';
    return h;
  }
  function workbook(sheets, meta) {
    var enc = new TextEncoder(), files = [];
    function add(n, s) { files.push({ name: n, data: enc.encode(s) }); }
    add('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      sheets.map(function (s, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('') +
      '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>');
    add('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>');
    var iso = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    add('docProps/core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
      '<dc:title>' + x(meta.title) + '</dc:title><dc:creator>' + x(meta.creator) + '</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">' + iso + '</dcterms:created></cp:coreProperties>');
    var names = '';
    sheets.forEach(function (s, i) { if (s.filter) names += '<definedName name="_xlnm._FilterDatabase" localSheetId="' + i + '" hidden="1">' + qs(s.name) + '!' + s.filter.replace(/([A-Z]+)(\d+)/g, '$$$1$$$2') + '</definedName>'; });
    add('xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      '<bookViews><workbookView activeTab="0"/></bookViews><sheets>' + sheets.map(function (s, i) { return '<sheet name="' + x(s.name) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join('') + '</sheets>' +
      (names ? '<definedNames>' + names + '</definedNames>' : '') + '<calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>');
    add('xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      sheets.map(function (s, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join('') +
      '<Relationship Id="rId' + (sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
    add('xl/styles.xml', STYLES);
    sheets.forEach(function (s, i) { add('xl/worksheets/sheet' + (i + 1) + '.xml', sheetXml(s)); });
    return zip(files);
  }
  function qs(n) { return /^[A-Za-z0-9_]+$/.test(n) ? n : "'" + n.replace(/'/g, "''") + "'"; }

  // ================= dal periodo di vendite al file Excel =================
  var METHODS = { inpost: 'InPost locker', brt: 'BRT Express', abroad: 'Pacco estero', letter: 'Lettera Italia', letterworld: 'Lettera estero' };
  function serial(d) { return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()) / 86400000 + 25569; }
  function dayOnly(d) { return Math.floor(serial(d)); }
  function money(c) { return c == null ? null : Math.round(c) / 100; }
  function two(n) { return ('0' + n).slice(-2); }
  function fmtDay(d) { return two(d.getDate()) + '/' + two(d.getMonth() + 1) + '/' + d.getFullYear(); }

  // orders: risposta del worker; opt: {shop, label, kind, full (indirizzi), live}
  function buildXlsx(orders, opt) {
    orders = orders.slice().sort(function (a, b) { return a.t - b.t; });
    var anyTest = orders.some(function (o) { return !o.live; }), n = orders.length;
    var now = new Date();
    // --- foglio Vendite ---
    var head = ['Data', 'Ora', 'Ordine', 'Cliente', 'Città', 'Paese', 'Spedizione', 'Pagamento', 'Pezzi', 'Prodotti €', 'Sconto €', 'Spedizione €', 'Totale incassato €', 'Commissione Stripe €', 'Netto Stripe €', 'Rimborsato €'];
    if (opt.full) head = head.concat(['Indirizzo', 'CAP', 'Email', 'Telefono']);
    var V = [
      [{ v: opt.shop + ' — Vendite ' + opt.label, s: S.title }],
      [anyTest ? { v: 'ATTENZIONE: contiene ordini di PROVA (modalità test di Stripe). Non sono vendite vere.', s: S.warn } : { v: 'Dati letti da Stripe il ' + fmtDay(now) + ' alle ' + two(now.getHours()) + ':' + two(now.getMinutes()) + '. Importi in euro, IVA non separata.', s: S.note }],
      [],
      head.map(function (t) { return { v: t, s: S.head }; })
    ];
    var F = 5, L = F + n - 1;   // prima e ultima riga dati
    orders.forEach(function (o) {
      var d = new Date(o.t * 1000), pcs = o.items.reduce(function (s, i) { return s + (i.q || 0); }, 0), a = o.addr || {};
      var r = [{ v: dayOnly(d), s: S.date }, { v: serial(d) - dayOnly(d), s: S.time }, '#' + o.id.slice(-6).toUpperCase(), o.name || '', a.city || '', a.cc || '',
        METHODS[o.method] || o.method || '', o.pay || '', { v: pcs, s: S.int },
        { v: money(o.sub), s: S.eur }, { v: money(o.disc), s: S.eur }, { v: money(o.ship), s: S.eur }, { v: money(o.total), s: S.eur },
        { v: money(o.fee), s: S.eur }, { v: money(o.net), s: S.eur }, { v: money(o.refunded), s: S.eur }];
      if (opt.full) r = r.concat([[a.l1, a.l2].filter(Boolean).join(', '), a.zip || '', o.email || '', o.phone || '']);
      V.push(r);
    });
    var tot = [{ v: n ? 'TOTALE' : 'Nessuna vendita in questo periodo', s: S.totl }, { v: '', s: S.totl }, { v: '', s: S.totl }, { v: '', s: S.totl }, { v: '', s: S.totl }, { v: '', s: S.totl }, { v: '', s: S.totl }, { v: '', s: S.totl }];
    tot.push(n ? { f: 'SUM(I' + F + ':I' + L + ')', s: S.toti } : { v: 0, s: S.toti });
    ['J', 'K', 'L', 'M', 'N', 'O', 'P'].forEach(function (c) { tot.push(n ? { f: 'SUM(' + c + F + ':' + c + L + ')', s: S.tote } : { v: 0, s: S.tote }); });
    V.push(tot);
    var TR = V.length;   // riga dei totali
    V.push([]);
    V.push([{ v: 'Totale incassato = prodotti − sconto + spedizione. Netto Stripe = totale − commissione (quello che arriva sul conto). I rimborsi fatti dopo non sono tolti dal netto.', s: S.note }]);
    var lastCol = col(head.length - 1);
    var sheetV = { name: 'Vendite', rows: V, freeze: 4, filter: 'A4:' + lastCol + Math.max(4, L), merges: ['A1:' + lastCol + '1', 'A2:' + lastCol + '2', 'A' + (TR + 2) + ':' + lastCol + (TR + 2)],
      widths: [11, 7, 10, 22, 16, 6, 15, 14, 7, 12, 10, 12, 15, 15, 13, 12].concat(opt.full ? [30, 8, 26, 15] : []), heights: { 3: 32, 0: 24 } };

    // --- foglio Righe prodotti ---
    var R = [['Data', 'Ordine', 'Prodotto', 'Quantità', 'Importo €'].map(function (t) { return { v: t, s: S.head }; })], prods = {};
    orders.forEach(function (o) {
      var d = new Date(o.t * 1000);
      o.items.forEach(function (i) {
        R.push([{ v: dayOnly(d), s: S.date }, '#' + o.id.slice(-6).toUpperCase(), i.n, { v: i.q, s: S.int }, { v: money(i.a), s: S.eur }]);
        var p = prods[i.n] || (prods[i.n] = { q: 0, a: 0 }); p.q += i.q; p.a += i.a;
      });
    });
    var RL = R.length;
    R.push([{ v: 'TOTALE', s: S.totl }, { v: '', s: S.totl }, { v: '', s: S.totl }, RL > 1 ? { f: 'SUM(D2:D' + RL + ')', s: S.toti } : { v: 0, s: S.toti }, RL > 1 ? { f: 'SUM(E2:E' + RL + ')', s: S.tote } : { v: 0, s: S.tote }]);
    var sheetR = { name: 'Righe prodotti', rows: R, freeze: 1, filter: 'A1:E' + Math.max(1, RL), widths: [11, 10, 46, 10, 12], heights: { 0: 22 } };

    // --- foglio Riepilogo (tutto con formule, protetto contro le modifiche per sbaglio) ---
    var v = qs('Vendite') + '!', rr = qs('Righe prodotti') + '!';
    function rng(c) { return v + c + F + ':' + c + L; }
    var P = [
      [{ v: opt.shop + ' — Riepilogo ' + opt.label, s: S.title }],
      [anyTest ? { v: 'ATTENZIONE: contiene ordini di PROVA (modalità test). Non sono vendite vere.', s: S.warn } : { v: 'Foglio calcolato con formule dai fogli Vendite e Righe prodotti: è protetto per non cancellare le formule per sbaglio.', s: S.note }],
      [],
      [{ v: 'Periodo', s: S.bold }, opt.label],
      [{ v: 'Numero ordini', s: S.bold }, n ? { f: 'COUNTA(' + rng('C') + ')', s: S.int } : { v: 0, s: S.int }],
      [{ v: 'Pezzi venduti', s: S.bold }, { f: v + 'I' + TR, s: S.int }],
      [{ v: 'Prodotti', s: S.bold }, { f: v + 'J' + TR, s: S.eur }],
      [{ v: 'Sconti', s: S.bold }, { f: v + 'K' + TR, s: S.eur }],
      [{ v: 'Spedizioni pagate dai clienti', s: S.bold }, { f: v + 'L' + TR, s: S.eur }],
      [{ v: 'TOTALE INCASSATO', s: S.bold }, { f: v + 'M' + TR, s: S.beur }],
      [{ v: 'Commissioni Stripe', s: S.bold }, { f: v + 'N' + TR, s: S.eur }],
      [{ v: 'NETTO STRIPE', s: S.bold }, { f: v + 'O' + TR, s: S.beur }],
      [{ v: 'Rimborsi', s: S.bold }, { f: v + 'P' + TR, s: S.eur }],
      [{ v: 'Netto dopo i rimborsi', s: S.bold }, { f: 'B12-B13', s: S.beur }],
      [{ v: 'Scontrino medio', s: S.bold }, { f: 'IF(B5>0,B10/B5,0)', s: S.eur }],
      [],
      ['Per spedizione', 'Ordini', 'Incassato spedizione €'].map(function (t) { return { v: t, s: S.head }; })
    ];
    Object.keys(METHODS).forEach(function (k) {
      var lab = METHODS[k];
      P.push([lab, n ? { f: 'COUNTIF(' + rng('G') + ',"' + lab + '")', s: S.int } : { v: 0, s: S.int }, n ? { f: 'SUMIF(' + rng('G') + ',"' + lab + '",' + rng('L') + ')', s: S.eur } : { v: 0, s: S.eur }]);
    });
    P.push([]);
    P.push(['Per prodotto', 'Pezzi', 'Importo €'].map(function (t) { return { v: t, s: S.head }; }));
    var names = Object.keys(prods).sort(function (a, b) { return prods[b].a - prods[a].a; });
    if (!names.length) P.push(['Nessun prodotto venduto']);
    names.forEach(function (nm) {
      var q = '"' + nm.replace(/"/g, '""') + '"';
      // SUMIF con testo lungo (>255) o con caratteri jolly non e' affidabile: in quel caso scrivo il numero
      var safe = nm.length < 250 && !/[*?~]/.test(nm);
      P.push([nm, safe ? { f: 'SUMIF(' + rr + 'C2:C' + RL + ',' + q + ',' + rr + 'D2:D' + RL + ')', s: S.int } : { v: prods[nm].q, s: S.int },
        safe ? { f: 'SUMIF(' + rr + 'C2:C' + RL + ',' + q + ',' + rr + 'E2:E' + RL + ')', s: S.eur } : { v: money(prods[nm].a), s: S.eur }]);
    });
    var sheetP = { name: 'Riepilogo', rows: P, widths: [44, 16, 22], protect: true, selected: true, merges: ['A1:C1', 'A2:C2'], heights: { 0: 24, 1: 30 } };
    P[1][0].s = anyTest ? S.warn : S.wrap;

    return workbook([sheetP, sheetV, sheetR], { title: opt.shop + ' vendite ' + opt.label, creator: opt.shop });
  }

  // ================= interfaccia della scheda =================
  var api = null, root = null, data = { list: [], settings: {} }, last = null, busy = false, aq = '';
  function $(s) { return root.querySelector(s); }
  function esc(s) { return x(s); }
  function nOrd(n) { return n + (n === 1 ? ' ordine' : ' ordini'); }
  function eur(c) { return c == null ? '—' : (c / 100).toFixed(2).replace('.', ',') + ' €'; }
  function shopName() { var c = window.SITE_CONFIG || {}; return c.shopName || (window.CATALOG && window.CATALOG.config && window.CATALOG.config.shopName) || 'Negozio'; }
  function slug(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'negozio'; }
  function todayStr() { var d = new Date(); return d.getFullYear() + '-' + two(d.getMonth() + 1) + '-' + two(d.getDate()); }
  function period() {
    var kind = $('#cx-kind-m').classList.contains('sel') ? 'month' : 'day', from, to, label, key;
    if (kind === 'day') {
      var p = ($('#cx-day').value || todayStr()).split('-').map(Number);
      from = new Date(p[0], p[1] - 1, p[2]); to = new Date(p[0], p[1] - 1, p[2] + 1);
      label = 'del ' + fmtDay(from); key = p[0] + '-' + two(p[1]) + '-' + two(p[2]);
    } else {
      var m = ($('#cx-month').value || todayStr().slice(0, 7)).split('-').map(Number);
      from = new Date(m[0], m[1] - 1, 1); to = new Date(m[0], m[1], 1);
      label = 'di ' + from.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }); key = m[0] + '-' + two(m[1]);
    }
    return { kind: kind, from: Math.floor(from / 1000), to: Math.floor(to / 1000), label: label, key: key, future: from > new Date() };
  }
  function status(t, bad) { var e = $('#cx-msg'); e.textContent = t; e.style.color = bad ? '#ff7b7b' : '#cfcfc9'; }

  function fetchAll(p) {
    var all = [];
    function page(after) {
      return api('GET', '/admin/sales?from=' + p.from + '&to=' + p.to + (after ? '&after=' + encodeURIComponent(after) : '')).then(function (j) {
        all = all.concat(j.orders || []); status('Leggo le vendite da Stripe… ' + all.length + ' ordini');
        return j.more && j.last ? page(j.last) : all;
      });
    }
    return page('');
  }
  function download(blob, name) {
    var u = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
  }
  function doExport() {
    if (busy) return;
    var p = period();
    if (p.future) return status('Quel periodo è nel futuro: non ci sono vendite.', true);
    busy = true; $('#cx-go').disabled = true; status('Leggo le vendite da Stripe…');
    fetchAll(p).then(function (orders) {
      var full = $('#cx-full').checked, shop = shopName();
      var blob = buildXlsx(orders, { shop: shop, label: p.label, full: full });
      var name = slug(shop) + '-vendite-' + p.key + '.xlsx';
      var sum = function (k) { return orders.reduce(function (s, o) { return s + (o[k] || 0); }, 0); };
      var anyTest = orders.some(function (o) { return !o.live; });
      last = { blob: blob, name: name, p: p, orders: orders.length, total: sum('total'), id: '' };
      download(blob, name);
      renderLast();
      var miss = orders.filter(function (o) { return o.paid && o.fee == null; }).length;
      status('Excel scaricato: ' + name + ' · ' + nOrd(orders.length) + ' · ' + eur(last.total) + (miss ? ' · ' + miss + ' senza commissione (Stripe non l’ha ancora calcolata: riesporta più tardi)' : ''), !!miss);
      return api('POST', '/admin/exports', { add: { period: p.label.replace(/^(del|di) /, ''), kind: p.kind, file: name, folder: data.settings.folder || '', orders: orders.length, total: last.total, fee: sum('fee'), net: sum('net'), live: !anyTest } })
        .then(function (j) { data = j; last.id = (j.list[0] || {}).id; renderList(); });
    }).catch(function (e) { status('Export NON riuscito: ' + e.message, true); })
      .then(function () { busy = false; $('#cx-go').disabled = false; });
  }
  function canShareFiles(f) { try { return !!(navigator.canShare && navigator.share && navigator.canShare({ files: [f] })); } catch (e) { return false; } }
  function doMail() {
    if (!last) return status('Prima premi “Esporta Excel”: poi questo bottone lo allega.', true);
    var f = new File([last.blob], last.name, { type: last.blob.type }), shop = shopName();
    var subject = shop + ' — vendite ' + last.p.label.replace(/^(del|di) /, ''), body = 'Buongiorno,\nin allegato il file delle vendite ' + last.p.label + ' (' + nOrd(last.orders) + ', ' + eur(last.total) + ').\n\nGrazie,\n' + shop;
    if (canShareFiles(f)) {
      // Mac (Safari): si apre il menu Condividi, scegli "Mail" e il file e' gia' attaccato
      navigator.share({ files: [f], title: subject, text: body }).then(function () { markMailed(); status('Fatto: completa e invia la mail in Mail.'); })
        .catch(function (e) { if (e && e.name !== 'AbortError') status('Condivisione non riuscita: ' + e.message, true); });
      return;
    }
    // Browser senza condivisione file: apre Mail con oggetto e testo, il file va trascinato dalla cartella
    location.href = 'mailto:' + encodeURIComponent(data.settings.accountant || '') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    markMailed();
    status('Questo browser non sa allegare da solo: in Mail trascina il file ' + last.name + ' dalla cartella ' + (data.settings.folder || 'Download') + '. Con Safari si allega in automatico.', true);
  }
  function markMailed() { if (last && last.id) api('POST', '/admin/exports', { mailed: last.id }).then(function (j) { data = j; renderList(); }).catch(function () {}); }
  function renderLast() {
    $('#cx-last').innerHTML = last ? '<div class="okbox" style="margin:10px 0">Pronto da allegare: <b>' + esc(last.name) + '</b><br><small>' + nOrd(last.orders) + ' · ' + eur(last.total) + '</small></div>' : '';
    $('#cx-mail').disabled = !last;
  }
  function renderList() {
    var s = data.settings || {};
    if (document.activeElement !== $('#cx-folder')) $('#cx-folder').value = s.folder || '';
    if (document.activeElement !== $('#cx-acc')) $('#cx-acc').value = s.accountant || '';
    var l = (data.list || []).filter(function (e) { return !aq || (e.period + ' ' + e.file + ' ' + e.folder).toLowerCase().indexOf(aq.toLowerCase()) > -1; });
    $('#cx-list').innerHTML = l.length ? l.map(function (e) {
      var d = new Date(e.at);
      return '<div class="ord" style="padding:10px"><div class="oh"><b>' + esc(e.period) + '</b><span>' + (e.live ? '' : 'TEST · ') + fmtDay(d) + ' ' + two(d.getHours()) + ':' + two(d.getMinutes()) + '</span></div>' +
        '<div class="om" style="margin:4px 0">' + nOrd(e.orders) + ' · incassato <b>' + eur(e.total) + '</b> · netto ' + eur(e.net) + '</div>' +
        '<div class="om">File: <b>' + esc(e.file) + '</b><br>Cartella: ' + esc(e.folder || '(non indicata)') + '<br>' + (e.mailed ? 'Inviato con Mail il ' + fmtDay(new Date(e.mailed)) : 'Non ancora inviato') + '</div>' +
        '<button type="button" class="small" data-cxre="' + esc(e.id) + '">Riesporta questo periodo</button><button type="button" class="small" data-cxdel="' + esc(e.id) + '">Togli dall’archivio</button></div>';
    }).join('') : '<p class="sub">Nessun export ancora.</p>';
    remind();
  }
  function remind() {
    var d = new Date(), key = todayStr(), done = (data.list || []).some(function (e) { return e.kind === 'day' && e.file.indexOf('-vendite-' + key + '.xlsx') > -1; });
    $('#cx-remind').innerHTML = d.getHours() >= 18 && !done ? '<div class="testbar" style="background:#fb941b">Sono le 18 passate: esporta la giornata di oggi.</div>' : '';
  }
  function saveSettings() {
    api('POST', '/admin/exports', { settings: { folder: $('#cx-folder').value, accountant: $('#cx-acc').value } })
      .then(function (j) { data = j; renderList(); status('Impostazioni salvate.'); }).catch(function (e) { status('Non salvato: ' + e.message, true); });
  }
  function setKind(k) {
    $('#cx-kind-d').classList.toggle('sel', k === 'day'); $('#cx-kind-m').classList.toggle('sel', k === 'month');
    $('#cx-day').hidden = k !== 'day'; $('#cx-month').hidden = k !== 'month';
  }
  function build() {
    root.innerHTML =
      '<div id="cx-remind"></div>' +
      '<div class="lbl" style="margin-bottom:6px">Periodo</div>' +
      '<div class="chips" style="margin:0 0 8px"><button type="button" class="chip sel" id="cx-kind-d">Giorno</button><button type="button" class="chip" id="cx-kind-m">Mese intero</button>' +
      '<button type="button" class="chip" id="cx-today">Oggi</button><button type="button" class="chip" id="cx-yest">Ieri</button></div>' +
      '<input id="cx-day" class="fld" type="date" style="margin-bottom:12px"><input id="cx-month" class="fld" type="month" style="margin-bottom:12px" hidden>' +
      '<label class="rem"><input type="checkbox" id="cx-full"> Includi indirizzo, email e telefono dei clienti (di solito al commercialista non servono)</label>' +
      '<div style="display:flex;gap:8px"><button type="button" class="btn lime" id="cx-go" style="flex:1;height:auto;min-height:56px;padding:6px 8px">Esporta Excel per il commercialista</button>' +
      '<button type="button" class="btn" id="cx-mail" style="flex:1;height:auto;min-height:56px;padding:6px 8px" disabled>Allega a Mail</button></div>' +
      '<div class="errbox" id="cx-msg" role="status"></div><div id="cx-last"></div>' +
      '<div class="lbl" style="margin:18px 0 6px">Dove salvi i file</div>' +
      '<input id="cx-folder" class="fld" placeholder="es. Documenti / Commercialista / 2026" maxlength="200" style="margin-bottom:6px">' +
      '<p class="sub" style="margin:0 0 10px">Il file va nella cartella dei download del browser. In Safari: Safari &gt; Impostazioni &gt; Generali &gt; “Posizione dei file scaricati” &gt; Altro… e scegli questa cartella.</p>' +
      '<div class="lbl" style="margin-bottom:6px">Email del commercialista (facoltativa)</div>' +
      '<input id="cx-acc" class="fld" type="email" placeholder="nome@studio.it" maxlength="120" style="margin-bottom:8px">' +
      '<button type="button" class="small" id="cx-save">Salva impostazioni</button>' +
      '<div class="lbl" style="margin:22px 0 6px">Archivio export</div>' +
      '<input id="cx-q" class="fld" type="search" placeholder="Cerca per periodo o nome file…" style="margin-bottom:10px">' +
      '<div id="cx-list"><p class="sub">Carico l’archivio…</p></div>';
    $('#cx-day').value = todayStr(); $('#cx-month').value = todayStr().slice(0, 7);
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.id === 'cx-kind-d') return setKind('day');
      if (b.id === 'cx-kind-m') return setKind('month');
      if (b.id === 'cx-today') { setKind('day'); $('#cx-day').value = todayStr(); return; }
      if (b.id === 'cx-yest') { var d = new Date(); d.setDate(d.getDate() - 1); setKind('day'); $('#cx-day').value = d.getFullYear() + '-' + two(d.getMonth() + 1) + '-' + two(d.getDate()); return; }
      if (b.id === 'cx-go') return doExport();
      if (b.id === 'cx-mail') return doMail();
      if (b.id === 'cx-save') return saveSettings();
      if (b.hasAttribute('data-cxre')) {
        var en = (data.list || []).filter(function (i) { return i.id === b.getAttribute('data-cxre'); })[0]; if (!en) return;
        var m = /-vendite-(\d{4})-(\d{2})(?:-(\d{2}))?\.xlsx$/.exec(en.file); if (!m) return status('Nome file non riconosciuto.', true);
        if (m[3]) { setKind('day'); $('#cx-day').value = m[1] + '-' + m[2] + '-' + m[3]; } else { setKind('month'); $('#cx-month').value = m[1] + '-' + m[2]; }
        root.scrollIntoView({ behavior: 'smooth' }); return doExport();
      }
      if (b.hasAttribute('data-cxdel')) {
        if (!confirm('Togliere questo export dall’archivio? Il file sul Mac resta dov’è.')) return;
        api('POST', '/admin/exports', { remove: b.getAttribute('data-cxdel') }).then(function (j) { data = j; renderList(); }).catch(function (er) { status(er.message, true); });
      }
    });
    root.addEventListener('input', function (e) { if (e.target.id === 'cx-q') { aq = e.target.value; renderList(); } });
  }
  window.Conti = {
    show: function (apiFn) {
      api = apiFn; root = document.getElementById('conti');
      if (!root.firstChild) build();
      renderLast();
      api('GET', '/admin/exports').then(function (j) { data = j; renderList(); }).catch(function (e) { $('#cx-list').innerHTML = '<p class="sub" style="color:#ff7b7b">Archivio non disponibile: ' + esc(e.message) + ' (serve il worker v6)</p>'; });
    },
    _build: buildXlsx   // per i test
  };
})();
