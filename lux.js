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
  var path = window.location.pathname;
  document.querySelectorAll('.desktopNav a, .mobileMenu a').forEach(function (link) {
    var route = (link.getAttribute('href') || '').split('#')[0];
    if ((route === '/about.html' && path === '/about.html') || (route === '/services.html' && path === '/services.html') || (route === '/insights/index.html' && path.indexOf('/insights/') === 0)) {
      link.setAttribute('aria-current', 'page');
    }
  });
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
