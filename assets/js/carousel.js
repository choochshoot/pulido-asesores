/* ===================================
   CAROUSEL ENGINE (MULTI INSTANCE SAFE)
=================================== */

function initCarousel() {

  document.querySelectorAll(".carousel").forEach(carousel => {

    // Evita inicializar dos veces el mismo carrusel
    if (carousel.dataset.initialized === "true") return;
    carousel.dataset.initialized = "true";

    const track = carousel.querySelector(".carousel-track");
    let startX = 0;
    let endX = 0;

    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener("touchmove", (e) => {
      endX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", () => {
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          index = (index + 1) % total; // swipe left
        } else {
          index = (index - 1 + total) % total; // swipe right
        }
        update();
      }
    });

    const slides = carousel.querySelectorAll(".carousel-slide");

    if (!track || slides.length <= 1) return;

    let index = 0;
    const total = slides.length;

    /* ==============================
       CREAR DOTS
    ============================== */

    const dotsContainer = document.createElement("div");
    dotsContainer.className = "carousel-dots";

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

    carousel.appendChild(dotsContainer);
    const dots = dotsContainer.querySelectorAll(".carousel-dot");

    /* ==============================
       UPDATE
    ============================== */

    function update() {
      // Protección extra
      if (index >= total) index = 0;
      if (index < 0) index = total - 1;

      requestAnimationFrame(() => {
        track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
      });


      dots.forEach(d => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

    /* ==============================
       AUTOPLAY
    ============================== */

    let interval = null;

    // Solo autoplay en desktop
    if (window.innerWidth > 768) {
      interval = setInterval(() => {
        index = (index + 1) % total;
        update();
      }, 4000);
    }

    

    /* ==============================
       PAUSE ON HOVER (desktop premium UX)
    ============================== */

    carousel.addEventListener("mouseenter", () => {
      clearInterval(interval);
    });

    carousel.addEventListener("mouseleave", () => {
      interval = setInterval(() => {
        index = (index + 1) % total;
        update();
      }, 4000);
    });

  });

}
