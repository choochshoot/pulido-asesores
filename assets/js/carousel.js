/* ==========================================
   PREMIUM CAROUSEL ENGINE
   - Autoplay SOLO desktop
   - Mobile = SOLO swipe manual
   - No conflictos entre múltiples carruseles
   - No salto de scroll
========================================== */

function initCarousel() {

  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach(carousel => {

    const track = carousel.querySelector(".carousel-track");
    const slides = carousel.querySelectorAll(".carousel-slide");

    if (!track || slides.length <= 1) return;

    /* =====================
       CREAR DOTS
    ===================== */

    let dotsContainer = carousel.querySelector(".carousel-dots");

    if (!dotsContainer) {
      dotsContainer = document.createElement("div");
      dotsContainer.className = "carousel-dots";
      carousel.appendChild(dotsContainer);
    }

    dotsContainer.innerHTML = "";

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

    /* =====================
       STATE
    ===================== */

    let index = 0;
    let interval = null;
    const total = slides.length;

    const isDesktop = window.innerWidth > 768;

    /* =====================
       UPDATE
    ===================== */

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach(d => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

    /* =====================
       AUTOPLAY SOLO DESKTOP
    ===================== */

    if (isDesktop) {

      function startAutoplay() {
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
    }

    /* =====================
       SWIPE MOBILE
    ===================== */

    let startX = 0;
    let endX = 0;

    carousel.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener("touchend", e => {

      endX = e.changedTouches[0].clientX;
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

  });

}
