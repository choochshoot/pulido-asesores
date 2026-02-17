/* ===================================
   CAROUSEL ENGINE (MULTI INSTANCE SAFE)
=================================== */

function initCarousel() {

  document.querySelectorAll(".carousel").forEach(carousel => {

    // Evita inicializar dos veces el mismo carrusel
    if (carousel.dataset.initialized === "true") return;
    carousel.dataset.initialized = "true";

    const track = carousel.querySelector(".carousel-track");
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

      track.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach(d => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

    /* ==============================
       AUTOPLAY
    ============================== */

    let interval = setInterval(() => {
      index = (index + 1) % total;
      update();
    }, 4000);

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
