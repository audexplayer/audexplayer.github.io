(function () {
  "use strict";

  // ---- header scroll shadow ----
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---- mobile nav toggle ----
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- reveal-on-scroll: only mark elements not already in the viewport,
  // so content is fully visible with JS disabled or before hydration ----
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length && "IntersectionObserver" in window) {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var alreadyVisible = rect.top < vh * 0.92;
      if (!alreadyVisible) {
        el.classList.add("reveal-pending");
        observer.observe(el);
      }
    });
  }

  // ---- click-to-load YouTube player: the iframe (and with it any request to YouTube) is only
  // created once the reader presses play, on the privacy-enhanced youtube-nocookie.com domain ----
  document.querySelectorAll(".video-facade[data-video-id]").forEach(function (box) {
    var button = box.querySelector("button");
    if (!button) return;
    button.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      var start = box.getAttribute("data-start");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(box.getAttribute("data-video-id")) +
        "?autoplay=1&rel=0" + (start ? "&start=" + encodeURIComponent(start) : "");
      iframe.title = box.getAttribute("data-title") || "YouTube video";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allowFullscreen = true;
      box.replaceChildren(iframe);
      iframe.focus();
    });
  });
})();
