/* Prototype seulement : menu mobile en panneau. Dans Webflow, la Navbar native le fait sans code. */
(function () {
  var burger = document.querySelector('.navbar-burger');
  var menu = document.querySelector('.navbar-menu');
  var fond = document.querySelector('.navbar-overlay');
  var fermer = document.querySelector('.navbar-close');
  if (!burger || !menu) return;
  function etat(ouvert) {
    menu.classList.toggle('is-open', ouvert);
    if (fond) fond.classList.toggle('is-open', ouvert);
    burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    if (ouvert && fermer) fermer.focus();
  }
  burger.addEventListener('click', function () { etat(true); });
  if (fermer) fermer.addEventListener('click', function () { etat(false); burger.focus(); });
  if (fond) fond.addEventListener('click', function () { etat(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { etat(false); burger.focus(); } });
})();
