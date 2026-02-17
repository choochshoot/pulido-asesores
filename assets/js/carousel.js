document.addEventListener("DOMContentLoaded", () => {

  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach(carousel => {

    const track = carousel.querySelector(".carousel-track");
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dotsContainer = carousel.querySelector(".carousel-dots");

    if (!track || slides.length === 0 || !dotsContainer) return;

    let index = 0;
    const total = slides.length;
    let interval = null;
    const isDesktop = window.innerWidth > 768;

    /* =========================
       CREAR DOTS DINÁMICAMENTE
    ========================== */
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

    /* =========================
       UPDATE
    ========================== */
    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach(d => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

    /* =========================
       AUTOPLAY SOLO DESKTOP
    ========================== */
    function startAutoplay() {
      if (!isDesktop) return;
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

    /* =========================
       INTERSECTION OBSERVER
    ========================== */
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

    /* =========================
       MOBILE TOUCH SWIPE
    ========================== */
    let startX = 0;
    let endX = 0;

    track.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", e => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    });

    function handleSwipe() {
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          index = (index + 1) % total;
        } else {
          index = (index - 1 + total) % total;
        }
        update();
      }
    }

  });

});
