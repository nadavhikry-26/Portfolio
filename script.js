// ============ THEME TOGGLE ============
// Initial theme is already set pre-paint by the inline script in <head>.
// This just wires the manual override switch.
(function () {
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");

  toggle.addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();

// ============ AUTOPLAY VIDEO MOTION PREFERENCE ============
// Any [data-autoplay-video] is marked autoplay/loop in HTML for visitors
// who are fine with motion; visitors who've asked for reduced motion get
// a paused first frame with native controls instead, so they can choose
// to play it rather than have it move on its own.
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) return;

  document.querySelectorAll("[data-autoplay-video]").forEach(function (video) {
    video.removeAttribute("autoplay");
    video.loop = false;
    video.controls = true;
    video.pause();
  });
})();

// ============ NAV BACKGROUND ON SCROLL ============
// Transparent over the hero, gains a background once the visitor scrolls
// past it so the nav stays readable over whatever content follows.
(function () {
  var nav = document.querySelector(".site-nav");
  var threshold = 40;

  function updateNav() {
    if (window.scrollY > threshold) {
      nav.classList.add("site-nav--scrolled");
    } else {
      nav.classList.remove("site-nav--scrolled");
    }
  }

  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });
})();

// ============ SCROLL REVEAL ============
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in-view"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach(function (el) { observer.observe(el); });
})();

// ============ GALLERY CAROUSEL ============
// Filmstrip carousel used by "A closer look" sections — every item is the
// same size and individually scroll-snapped, paged two at a time on
// desktop (one at a time once they stack to full width on mobile, per the
// 700px breakpoint in styles.css). Items-per-page and the dot count are
// both computed from actual layout rather than hardcoded, so any item
// count works without the two staying in sync by hand. The track itself
// is a native scroll-snap container — drag, touch swipe, and trackpad
// scroll all move it directly; the arrows/dots just call scrollTo and
// read the current page back off the scroll position. Supports multiple
// instances per page via [data-carousel].
(function () {
  var carousels = document.querySelectorAll("[data-carousel]");

  carousels.forEach(function (carousel) {
    var track = carousel.querySelector("[data-carousel-track]");
    var items = Array.prototype.slice.call(carousel.querySelectorAll("[data-carousel-item]"));
    var prevBtn = carousel.querySelector("[data-carousel-prev]");
    var nextBtn = carousel.querySelector("[data-carousel-next]");
    var dotsWrap = carousel.querySelector("[data-carousel-dots]");
    var dots = [];
    var perPage = 1;
    var page = 0;
    var scrollTimer = null;

    if (!items.length) return;

    function getPerPage() {
      var itemWidth = items[0].getBoundingClientRect().width;
      if (!itemWidth) return 1;
      return Math.max(1, Math.round(track.getBoundingClientRect().width / itemWidth));
    }

    function pageCount() {
      return Math.max(1, Math.ceil(items.length / perPage));
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      dots = [];
      for (var i = 0; i < pageCount(); i++) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "gallery-carousel__dot";
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        (function (i) {
          dot.addEventListener("click", function () { goTo(i); });
        })(i);
        dotsWrap.appendChild(dot);
        dots.push(dot);
      }
    }

    function setActive(p) {
      page = Math.max(0, Math.min(pageCount() - 1, p));
      dots.forEach(function (dot, di) {
        dot.classList.toggle("gallery-carousel__dot--active", di === page);
      });
      if (prevBtn) prevBtn.disabled = page === 0;
      if (nextBtn) nextBtn.disabled = page === pageCount() - 1;
    }

    function goTo(p) {
      p = Math.max(0, Math.min(pageCount() - 1, p));
      var item = items[p * perPage];
      var target = track.scrollLeft + (item.getBoundingClientRect().left - track.getBoundingClientRect().left);
      track.scrollTo({ left: target, behavior: "smooth" });
    }

    function refreshLayout() {
      perPage = getPerPage();
      buildDots();
      setActive(page);
      goTo(page);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(page - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(page + 1); });

    // Reflect whichever item the user scrolled/dragged/swiped to.
    track.addEventListener("scroll", function () {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var nearest = 0;
        var minDist = Infinity;
        items.forEach(function (item, i) {
          var dist = Math.abs(item.getBoundingClientRect().left - track.getBoundingClientRect().left);
          if (dist < minDist) { minDist = dist; nearest = i; }
        });
        setActive(Math.round(nearest / perPage));
      }, 80);
    }, { passive: true });

    window.addEventListener("resize", function () {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(refreshLayout, 120);
    });

    // Click-and-drag for mouse/trackpad users (touch scrolling already
    // works natively; this adds the same for a plain mouse). Capturing the
    // pointer immediately on pointerdown would swallow ordinary clicks on
    // the gallery's lightbox-trigger buttons, so dragging only actually
    // engages once the pointer has moved past a small threshold — a real
    // click never crosses it.
    var isPressed = false;
    var isDragging = false;
    var dragPointerId = null;
    var dragStartX = 0;
    var dragStartScroll = 0;
    var DRAG_THRESHOLD = 6;

    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      isPressed = true;
      isDragging = false;
      dragPointerId = e.pointerId;
      dragStartX = e.clientX;
      dragStartScroll = track.scrollLeft;
    });
    track.addEventListener("pointermove", function (e) {
      if (!isPressed) return;
      var delta = e.clientX - dragStartX;
      if (!isDragging) {
        if (Math.abs(delta) < DRAG_THRESHOLD) return;
        isDragging = true;
        track.classList.add("gallery-carousel__track--dragging");
        track.setPointerCapture(dragPointerId);
      }
      track.scrollLeft = dragStartScroll - delta;
    });
    function endDrag() {
      isPressed = false;
      isDragging = false;
      track.classList.remove("gallery-carousel__track--dragging");
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    perPage = getPerPage();
    buildDots();
    setActive(0);
  });
})();

// ============ GALLERY LIGHTBOX ============
// Click any gallery screenshot to open it enlarged, with keyboard/swipe
// navigation between every image in the gallery (not just the current
// carousel page). One lightbox instance per page — id="gallery-lightbox".
(function () {
  var lightbox = document.getElementById("gallery-lightbox");
  // Triggers without a real <img> yet (placeholders waiting on real
  // screenshots) are left as plain, inert buttons — they'll join the
  // lightbox automatically once an <img> replaces the placeholder.
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox-trigger]"))
    .filter(function (trigger) { return !!trigger.querySelector("img"); });
  if (!lightbox || !triggers.length) return;

  var items = triggers.map(function (trigger) {
    var img = trigger.querySelector("img");
    var wrapper = trigger.closest("[data-carousel-item]");
    var caption = wrapper ? wrapper.querySelector(".gallery-carousel__caption") : null;
    return {
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt") || "",
      captionHTML: caption ? caption.innerHTML : ""
    };
  });

  var stage = lightbox.querySelector("[data-lightbox-stage]");
  var imageEl = lightbox.querySelector("[data-lightbox-image]");
  var captionEl = lightbox.querySelector("[data-lightbox-caption]");
  var closeBtn = lightbox.querySelector("[data-lightbox-close]");
  var prevBtn = lightbox.querySelector("[data-lightbox-prev]");
  var nextBtn = lightbox.querySelector("[data-lightbox-next]");
  var backdrop = lightbox.querySelector("[data-lightbox-backdrop]");

  var index = 0;
  var lastFocused = null;
  var isOpen = false;

  function render() {
    var item = items[index];
    imageEl.src = item.src;
    imageEl.alt = item.alt;
    captionEl.innerHTML = item.captionHTML;
  }

  function open(i) {
    index = i;
    lastFocused = document.activeElement;
    render();
    lightbox.classList.add("lightbox--open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-lock");
    isOpen = true;
    document.addEventListener("keydown", onKeydown);
    // Wait a tick so focus doesn't fight the opening transition/scroll lock.
    window.requestAnimationFrame(function () { closeBtn.focus(); });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    lightbox.classList.remove("lightbox--open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-lock");
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function showPrev() { index = (index - 1 + items.length) % items.length; render(); }
  function showNext() { index = (index + 1) % items.length; render(); }

  function onKeydown(e) {
    if (e.key === "Escape") { close(); return; }
    if (e.key === "ArrowLeft") { showPrev(); return; }
    if (e.key === "ArrowRight") { showNext(); return; }
    if (e.key === "Tab") {
      var focusable = Array.prototype.slice.call(
        lightbox.querySelectorAll('button:not([disabled])')
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  triggers.forEach(function (trigger, i) {
    trigger.addEventListener("click", function () { open(i); });
  });
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  prevBtn.addEventListener("click", showPrev);
  nextBtn.addEventListener("click", showNext);

  // Swipe: left/right to navigate, down to dismiss.
  var touchStartX = 0;
  var touchStartY = 0;
  stage.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dy) > Math.abs(dx) && dy > 60) {
      close();
      return;
    }
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) { showPrev(); } else { showNext(); }
    }
  }, { passive: true });
})();

// ============ FOOTER YEAR ============
document.getElementById("year").textContent = new Date().getFullYear();
