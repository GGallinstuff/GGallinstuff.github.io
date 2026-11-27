// Impostazioni del sito Ano da Giardino.
// checkoutEndpoint: indirizzo del Worker Cloudflare (finisce in .workers.dev), senza "/" finale.
// Finche' e' vuoto il carrello funziona ma "Vai al pagamento" mostra un avviso.
window.SITE_CONFIG = {
  shopName: "Ano da Giardino",
  email: "ggallinstuff@gmail.com",
  checkoutEndpoint: "https://pagamenti.ggallinstuff2.workers.dev"
};
