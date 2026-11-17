/* Sélecteur « À l'identique | Refonte » : garde l'ancre si la page d'arrivée a la même partie,
   et signale les pages de la refonte qui ne sont pas encore faites. Outil de présentation seulement. */
(function () {
  var message = document.querySelector('.cmp-message');
  var minuterie;
  function afficher(contenu) {
    if (!message) return;
    message.innerHTML = contenu;
    message.hidden = false;
    clearTimeout(minuterie);
    minuterie = setTimeout(function () { message.hidden = true; }, 6000);
  }
  // Même partie de page dans l'autre version, quand elle existe (ex. #litige, #fondatrice)
  document.querySelectorAll('a.cmp-segment').forEach(function (lien) {
    lien.addEventListener('click', function () {
      var h = location.hash.slice(1);
      if (h && (' ' + lien.getAttribute('data-cmp-ancres') + ' ').indexOf(' ' + h + ' ') !== -1) lien.href = lien.href.split('#')[0] + '#' + h;
    });
  });
  document.querySelectorAll('.cmp-segment.is-absent').forEach(function (s) {
    s.addEventListener('click', function () { afficher('Cette page n’est pas encore faite dans la refonte.'); });
  });
  // Liens de la refonte vers une page de service pas encore produite
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-cmp-absente]');
    if (!a) return;
    e.preventDefault();
    var vers = a.getAttribute('data-cmp-absente');
    afficher('Cette page n’est pas encore faite dans la refonte.' + (vers ? ' <a href="' + vers + '">La voir à l’identique</a>' : ''));
  });
})();
