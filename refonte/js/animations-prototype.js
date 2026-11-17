/* =========================================================
   Animations du prototype — À NE PAS reprendre dans Webflow.
   Chaque bloc imite une Interaction Webflow native, décrite
   dans ANIMATIONS-WEBFLOW.md (déclencheur, cible, valeurs).
   Le contenu reste visible si ce script ne se charge pas.
   ========================================================= */
(function () {
  if (!('animate' in Element.prototype)) return;
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'; // Webflow : « outExpo »

  // Mouvement réduit : on garde le fondu, sans déplacement ni zoom.
  function entree(el, delai, duree, dy, de) {
    if (!el) return;
    var depart = reduit ? { opacity: 0 } : { opacity: 0, transform: 'translateY(' + dy + 'px)' };
    var arrivee = reduit ? { opacity: 1 } : { opacity: 1, transform: 'translateY(0)' };
    el.animate([depart, arrivee], { duration: reduit ? 300 : duree, delay: delai, easing: EASE, fill: 'backwards' });
  }

  // 1. Chargement de la page (Webflow : « Page Load ») — le moment signature.
  //    La photo se pose lentement pendant que le titre monte : « en mouvement ».
  var photo = document.querySelector('.hero-image');
  if (photo && !reduit) {
    photo.animate([{ transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 1800, easing: EASE, fill: 'backwards' });
  }
  entree(document.querySelector('.hero-title'), 150, 800, 32);
  entree(document.querySelector('.hero-subtitle'), 400, 700, 20);
  entree(document.querySelector('.hero-actions'), 550, 700, 20);
  entree(document.querySelector('.hero-monogram'), 900, 700, 0);

  // Pages intérieures (Webflow : « Page Load », la même interaction reprise sur chaque page).
  //    Même moment que l'accueil, à l'échelle de l'en-tête : la photo se pose dans son cadre
  //    pendant que le titre monte. Le fil d'Ariane ne bouge pas : il sert à se repérer tout de suite.
  var photoPage = document.querySelector('.page-hero-image');
  if (photoPage && !reduit) {
    photoPage.animate([{ transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 1800, easing: EASE, fill: 'backwards' });
  }
  entree(document.querySelector('.page-hero-title'), 150, 800, 32);
  entree(document.querySelector('.page-hero-lead'), 400, 700, 20);
  entree(document.querySelector('.page-hero-actions'), 550, 700, 20);

  // 2. Apparition au défilement (Webflow : « Scroll into view », une seule fois).
  //    Chaque bloc portant la classe se déclenche pour lui-même, comme dans Webflow.
  function auDefilement(conteneur, enfants, pas, dy) {
    if (!('IntersectionObserver' in window)) return;
    document.querySelectorAll(conteneur).forEach(function (bloc) {
      var items = bloc.querySelectorAll(enfants);
      // État initial (Webflow : « Initial state ») posé seulement si le script tourne.
      items.forEach(function (it) { it.style.opacity = '0'; });
      var obs = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (e) {
          if (!e.isIntersecting) return;
          items.forEach(function (it, i) { entree(it, Math.min(i * pas, 450), 650, dy); it.style.opacity = ''; });
          obs.disconnect();
        });
      }, { threshold: 0.15 });
      obs.observe(bloc);
    });
  }
  auDefilement('.needs-grid', '.needs-card', 90, 24);      // accueil : les 6 étapes, comme une liste
  auDefilement('.approach-list', '.approach-item', 80, 14); // accueil : la méthode, dans l'ordre
  auDefilement('.values-list', '.value-item', 120, 24);     // cabinet : les 4 valeurs, une à une
  auDefilement('.method-list', '.method-step', 80, 14);     // cabinet : la méthode en 6 temps, dans l'ordre
  auDefilement('.stage', '.needs-link', 80, 14);            // besoins : les pages de chaque étape

  // Menu des parties (Webflow : état « Current » natif des liens vers une section de la page).
  //    La partie qui passe sous le menu collant est surlignée.
  var liensParties = document.querySelectorAll('.stage-nav-link');
  var premiere = liensParties.length && document.getElementById(liensParties[0].getAttribute('href').slice(1));
  if (premiere && 'IntersectionObserver' in window) {
    var parLien = {};
    liensParties.forEach(function (lien) { parLien[lien.getAttribute('href').slice(1)] = lien; });
    var surligner = function (actif) {
      liensParties.forEach(function (lien) {
        lien.classList.toggle('is-current', lien === actif);
        if (lien === actif) lien.setAttribute('aria-current', 'true'); else lien.removeAttribute('aria-current');
      });
    };
    var suivi = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) { if (e.isIntersecting) surligner(parLien[e.target.id]); });
      // Revenu au-dessus de la première partie : plus rien n'est surligné.
      if (premiere.getBoundingClientRect().top > window.innerHeight * 0.35) surligner(null);
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(parLien).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) suivi.observe(section);
    });
  }

  // Fond vidéo du bandeau contact (Webflow : Background Video native, avec son bouton pause).
  document.querySelectorAll('.contact-band-video-file').forEach(function (video) {
    var bouton = video.closest('.contact-band').querySelector('.contact-band-pause');
    var icone = bouton && bouton.querySelector('.contact-band-pause-icon');
    function etat(enPause) {
      if (!bouton) return;
      bouton.setAttribute('aria-pressed', enPause ? 'true' : 'false');
      bouton.setAttribute('aria-label', enPause ? 'Relancer l’animation de fond' : 'Mettre en pause l’animation de fond');
      if (icone) icone.src = enPause ? 'images/icone-lecture.svg' : 'images/icone-pause.svg';
    }
    if (reduit) { video.pause(); video.removeAttribute('autoplay'); etat(true); }
    if (bouton) bouton.addEventListener('click', function () {
      if (video.paused) { video.play(); etat(false); } else { video.pause(); etat(true); }
    });
  });

  // 3. Survol d'un lien de besoin (Webflow : « Mouse hover », enfants de classe .needs-link-arrow).
  //    Accueil et page Besoins (.needs-link), encadré des pages de service et page Contact (.aside-related-link).
  document.querySelectorAll('.needs-link, .aside-related-link').forEach(function (lien) {
    var fleche = lien.querySelector('.needs-link-arrow');
    if (!fleche || reduit) return;
    lien.addEventListener('mouseenter', function () {
      fleche.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(4px)' }], { duration: 200, easing: EASE, fill: 'forwards' });
    });
    lien.addEventListener('mouseleave', function () {
      fleche.animate([{ transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 150, easing: EASE, fill: 'forwards' });
    });
  });
})();
