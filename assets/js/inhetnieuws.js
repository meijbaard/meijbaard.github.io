/**
 * inhetnieuws.js — interactie voor de nieuwspagina.
 * Gecombineerd filteren (zoekterm + bron + jaar), "toon meer"-paginering,
 * jaarfilter opgebouwd uit de data en "Nieuw"-badges.
 * Veiligheid: er wordt nergens HTML uit data geïnjecteerd (geen innerHTML).
 */
(function () {
  "use strict";

  var initialized = false;

  document.addEventListener("DOMContentLoaded", function () {
    if (initialized) return; // voorkom dubbele initialisatie
    initialized = true;
    var newsList = document.getElementById("news-list");
    if (!newsList) return;

    var items = Array.prototype.slice.call(newsList.querySelectorAll(".news-item"));
    var counter = document.getElementById("article-counter");
    var searchInput = document.getElementById("news-search");
    var yearSelect = document.getElementById("year-filter");
    var loadMoreBtn = document.getElementById("load-more");
    var emptyMsg = document.getElementById("news-empty");
    var resetBtn = document.getElementById("reset-filters");
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));

    var PAGE_SIZE = 24;
    var visibleLimit = PAGE_SIZE;
    var activeSource = "all";
    var activeYear = "all";
    var searchTerm = "";

    /* ---- voorbereiding: datum parsen, zoektekst cachen ---- */
    items.forEach(function (item) {
      var d = new Date(item.getAttribute("data-pubdate") || "");
      item._date = isNaN(d.getTime()) ? null : d;
      item._year = item._date ? String(item._date.getFullYear()) : null;
      item._text = (item.textContent || "").toLowerCase();
    });

    /* ---- jaarfilter vullen ---- */
    if (yearSelect) {
      var years = {};
      items.forEach(function (it) { if (it._year) years[it._year] = true; });
      Object.keys(years).sort().reverse().forEach(function (y) {
        var opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        yearSelect.appendChild(opt);
      });
    }

    /* ---- "Nieuw"-badges (laatste 25 uur) ---- */
    var threshold = Date.now() - 25 * 60 * 60 * 1000;
    items.forEach(function (item) {
      if (item._date && item._date.getTime() > threshold) {
        var h3 = item.querySelector("h3");
        if (h3 && !h3.querySelector(".new-badge")) {
          var badge = document.createElement("span");
          badge.className = "new-badge";
          badge.textContent = "Nieuw";
          h3.appendChild(badge);
        }
      }
    });

    /* ---- kernfunctie: filters toepassen ---- */
    function matches(item) {
      if (activeSource !== "all" && item.getAttribute("data-source") !== activeSource) return false;
      if (activeYear !== "all" && item._year !== activeYear) return false;
      if (searchTerm && item._text.indexOf(searchTerm) === -1) return false;
      return true;
    }

    function apply() {
      var shown = 0;
      var total = 0;
      items.forEach(function (item) {
        if (matches(item)) {
          total++;
          if (shown < visibleLimit) {
            item.style.display = "";
            shown++;
          } else {
            item.style.display = "none";
          }
        } else {
          item.style.display = "none";
        }
      });

      if (counter) {
        counter.textContent =
          total === items.length && shown === total
            ? "Totaal " + total + " artikelen."
            : shown + " van " + total + " artikelen getoond.";
      }
      if (loadMoreBtn) loadMoreBtn.hidden = shown >= total;
      if (emptyMsg) emptyMsg.hidden = total !== 0;
    }

    /* ---- events ---- */
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (b) { b.classList.remove("active"); });
        this.classList.add("active");
        activeSource = this.getAttribute("data-source") || "all";
        visibleLimit = PAGE_SIZE;
        apply();
      });
    });

    if (searchInput) {
      var debounce;
      searchInput.addEventListener("input", function () {
        clearTimeout(debounce);
        var val = this.value;
        debounce = setTimeout(function () {
          searchTerm = val.toLowerCase().trim();
          visibleLimit = PAGE_SIZE;
          apply();
        }, 150);
      });
    }

    if (yearSelect) {
      yearSelect.addEventListener("change", function () {
        activeYear = this.value;
        visibleLimit = PAGE_SIZE;
        apply();
      });
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function () {
        visibleLimit += PAGE_SIZE;
        apply();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        activeSource = "all";
        activeYear = "all";
        searchTerm = "";
        visibleLimit = PAGE_SIZE;
        if (searchInput) searchInput.value = "";
        if (yearSelect) yearSelect.value = "all";
        filterButtons.forEach(function (b) {
          b.classList.toggle("active", b.getAttribute("data-source") === "all");
        });
        apply();
      });
    }

    apply();
  });
})();
