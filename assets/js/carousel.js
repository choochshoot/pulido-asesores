/* ===================================
   PREMIUM MULTI CAROUSEL ENGINE
   - Desktop: autoplay
   - Mobile: swipe only
   - Multiple instances safe
=================================== */

document.addEventListener("DOMContentLoaded", () => {

  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach((carousel) => {

    const track = carousel.querySelector(".carousel-track");
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dotsContainer = carousel.querySelector(".carousel-dots");

    if (!track || slides.length === 0 || !dotsContainer) return;

    let index = 0;
    let interval = null;
    const total = slides.length;

    /* ==============================
       DEVICE DETECTION
    ============================== */

    function isDesktop() {
      return window.matchMedia("(min-width: 769px)").matches;
    }

    /* ==============================
       CREATE DOTS
    ============================== */

    dotsContainer.innerHTML = "";

    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.classList.add("carousel-dot");
      if (i === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        index = i;
        update();
      });

      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".carousel-dot");

    /* ==============================
       UPDATE FUNCTION
    ============================== */

    function update() {
      if (index >= total) index = 0;
      if (index < 0) index = total - 1;

      track.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach(d => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

    /* ==============================
       AUTOPLAY CONTROL
    ============================== */

    function stopAuto() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }

    function startAuto() {
      if (!isDesktop()) return;

      stopAuto();

      interval = setInterval(() => {
        index = (index + 1) % total;
        update();
      }, 4000);
    }

    /* ==============================
       INTERSECTION OBSERVER
       (prevents scroll jump)
    ============================== */

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stopAuto();
        } else {
          if (isDesktop()) startAuto();
        }
      });
    }, { threshold: 0.4 });

    observer.observe(carousel);

    /* ==============================
       SWIPE SUPPORT (Mobile)
    ============================== */

    let startX = 0;
    let isDragging = false;

    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      stopAuto();
    });

    track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
    });

    track.addEventListener("touchend", (e) => {
      if (!isDragging) return;

      const diff = e.changedTouches[0].clientX - startX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          index--;
        } else {
          index++;
        }
      }

      update();
      isDragging = false;

      if (isDesktop()) startAuto();
    });

    /* ==============================
       RESIZE LISTENER
    ============================== */

    window.addEventListener("resize", () => {
      if (!isDesktop()) {
        stopAuto();
      } else {
        startAuto();
      }
    });

    /* ==============================
       INITIAL STATE
    ============================== */

    update();
    if (isDesktop()) startAuto();

  });

});
