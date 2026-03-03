(function () {
  var toggle = document.querySelector('.menuToggle');
  var menu = document.querySelector('.mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function (event) {
      event.stopPropagation();
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target) && event.target !== toggle) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
