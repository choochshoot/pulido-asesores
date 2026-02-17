/* ==========================================
   PREMIUM CAROUSEL ENGINE (HEADLESS READY)
   - Autoplay SOLO desktop
   - Mobile = swipe manual
   - No conflicto entre múltiples carruseles
   - Se ejecuta desde app.js después del render
========================================== */

function initCarousel() {

  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach(carousel => {

    const track = carousel.querySelector(".carousel-track");
    const slides = carousel.querySelectorAll(".carousel-slide");

    if (!track || slides.length <= 1) return;

    /* ===============================
       CREAR DOTS SI NO EXISTEN
    =============================== */

    let dotsContainer = carousel.querySelector(".carousel-dots");

    if (!dotsContainer) {
      dotsContainer = document.createElement("div");
      dotsContainer.className = "carousel-dots";
      carousel.appendChild(dotsContainer);
    }

    dotsContainer.innerHTML = "";

    let index = 0;
    const total = slides.length;
    let interval = null;

    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "carousel-dot";
      if (i === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        index = i;
        update();
      });

      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".carousel-dot");

    /* ===============================
       UPDATE FUNCTION
    =============================== */

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach(d => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

    /* ===============================
       DESKTOP AUTOPLAY ONLY
    =============================== */

    function isDesktop() {
      return window.matchMedia("(min-width: 769px)").matches;
    }

    function startAutoplay() {
      if (!isDesktop()) return;
      if (interval) return;

      interval = setInterval(() => {
        index = (index + 1) % total;
        update();
      }, 4000);
    }

    function stopAutoplay() {
      clearInterval(interval);
      interval = null;
    }

    /* ===============================
       INTERSECTION OBSERVER
       (detiene autoplay si no está visible)
    =============================== */

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoplay();
        } else {
          stopAutoplay();
        }
      });
    }, { threshold: 0.4 });

    observer.observe(carousel);

    /* ===============================
       MOBILE SWIPE
    =============================== */

    let startX = 0;

    carousel.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener("touchend", e => {

      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          index = (index + 1) % total;
        } else {
          index = (index - 1 + total) % total;
        }
        update();
      }

    }, { passive: true });

    /* ===============================
       INIT
    =============================== */

    update();
    startAutoplay();

  });

}
