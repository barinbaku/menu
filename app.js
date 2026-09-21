(function () {
  "use strict";

  function slug(str, idx) {
    return "cat-" + idx;
  }

  function esc(s) {
    if (!s) return "";
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderDish(item) {
    var priceHtml = item.price
      ? esc(item.price) + ' <span class="man">\u20BC</span>'
      : "\u2014";

    var newBadge = item.new ? '<span class="new-badge">NEW</span>' : "";

    var noteHtml = item.note_ru
      ? '<div class="dish-note">' + esc(item.note_ru) + "</div>"
      : "";

    var sub = "";
    if (item.desc_ru) {
      sub += '<div class="dish-desc">' + esc(item.desc_ru) + "</div>";
      var az = item.desc_az || "";
      var en = item.desc_en || "";
      if (az || en) {
        sub += '<div class="dish-intl">' + esc(az) + " / " + esc(en) + "</div>";
      }
    } else if (item.az || item.en) {
      sub =
        '<div class="dish-intl">' +
        esc(item.az || "") +
        " / " +
        esc(item.en || "") +
        "</div>";
    }

    return (
      '<div class="dish">' +
      '<div class="dish-row">' +
      '<span class="dish-name">' + esc(item.ru) + newBadge + "</span>" +
      '<span class="dish-leader"></span>' +
      '<span class="dish-price">' + priceHtml + "</span>" +
      "</div>" +
      noteHtml +
      sub +
      "</div>"
    );
  }

  function renderCategory(cat, idx) {
    var dishes = cat.items.map(renderDish).join("");
    return (
      '<section class="category" id="' + slug(cat.cat_ru, idx) + '">' +
      '<div class="cat-heading">' +
      "<h2>" + esc(cat.cat_ru) + "</h2>" +
      '<span class="intl">' + esc(cat.cat_az) + " / " + esc(cat.cat_en) + "</span>" +
      "</div>" +
      dishes +
      "</section>"
    );
  }

  function renderNav(data) {
    var track = document.getElementById("catnavTrack");
    track.innerHTML = data
      .map(function (cat, idx) {
        return (
          '<button data-target="' +
          slug(cat.cat_ru, idx) +
          '">' +
          esc(cat.cat_ru) +
          "</button>"
        );
      })
      .join("");
  }

  function initScrollSpy(data) {
    var buttons = Array.prototype.slice.call(
      document.querySelectorAll(".catnav-track button")
    );
    var sections = data.map(function (cat, idx) {
      return document.getElementById(slug(cat.cat_ru, idx));
    });

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = document.getElementById(btn.getAttribute("data-target"));
        if (target) {
          var y = target.getBoundingClientRect().top + window.scrollY - 56;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
    });

    function setActive(id) {
      buttons.forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-target") === id);
      });
      var activeBtn = document.querySelector(".catnav-track button.active");
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      if (s) observer.observe(s);
    });

    if (buttons.length) setActive(buttons[0].getAttribute("data-target"));
  }

  function initNavArrows() {
    var track = document.getElementById("catnavTrack");
    var left = document.getElementById("navLeft");
    var right = document.getElementById("navRight");
    left.addEventListener("click", function () {
      track.scrollBy({ left: -160, behavior: "smooth" });
    });
    right.addEventListener("click", function () {
      track.scrollBy({ left: 160, behavior: "smooth" });
    });
  }

  function initToTop() {
    var btn = document.getElementById("toTop");
    window.addEventListener("scroll", function () {
      btn.classList.toggle("visible", window.scrollY > 500);
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function init() {
    var data = window.MENU_DATA || [];
    var main = document.getElementById("menu");
    main.innerHTML = data.map(renderCategory).join("");
    renderNav(data);
    initScrollSpy(data);
    initNavArrows();
    initToTop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
