(function () {
  var root = document.documentElement;

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  var sidebar = document.querySelector(".sidebar");
  var menu = document.querySelector(".menu-toggle");
  if (sidebar && menu) {
    menu.addEventListener("click", function () {
      var open = sidebar.classList.toggle("open");
      menu.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
})();
