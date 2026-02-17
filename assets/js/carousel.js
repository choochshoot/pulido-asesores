function initCarousel() {

  const carousels = document.querySelectorAll(".carousel");

  if (!carousels.length) return;

  carousels.forEach(carousel => {

    const track = carousel.querySelector(".carousel-track");
    const slides = carousel.querySelectorAll(".carousel-slide");

    // 🔒 Protección absoluta
    if (!track || !slides.length) return;

    let index = 0;
    const total = slides.length;
    let interval = null;

    /* ==============================
       CREAR DOTS
    ============================== */

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

    /* ==============================
       UPDATE
    ============================== */

    function update() {

      if (index >= total) index = 0;
      if (index < 0) index = total - 1;

      track.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach(d => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

    /* ==============================
       AUTOPLAY DESKTOP ONLY
    ============================== */

    function startAuto() {
      if (window.innerWidth <= 768) return;

      interval = setInterval(() => {
        index = (index + 1) % total;
        update();
      }, 4000);
    }

    function stopAuto() {
      if (interval) clearInterval(interval);
    }

    /* ==============================
       INTERSECTION OBSERVER
       (NO MÁS SALTO EN MOBILE)
    ============================== */

    const observer = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) {
          stopAuto();
        } else {
          stopAuto();
          startAuto();
        }

      });

    }, { threshold: .4 });

    observer.observe(carousel);

    /* ==============================
       SWIPE MOBILE
    ============================== */

    let startX = 0;

    carousel.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
      stopAuto();
    });

    carousel.addEventListener("touchend", e => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) index++;
        else index--;
        update();
      }

      startAuto();
    });

  });

}
