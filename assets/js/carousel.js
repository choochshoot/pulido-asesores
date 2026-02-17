/* ===================================
   CAROUSEL ENGINE PREMIUM
=================================== */

function initCarousel(carousel) {

  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(track.children);

  let index = 0;
  const total = slides.length;

  if (total <= 1) return;

  /* ===================================
     CREATE DOTS
  ==================================== */

  const dotsContainer = document.createElement("div");
  dotsContainer.className = "carousel-dots";

  let dots = [];

  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "carousel-dot";
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      index = i;
      update();
    });

    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  carousel.appendChild(dotsContainer);

  /* ===================================
     UPDATE FUNCTION (GPU OPTIMIZED)
  ==================================== */

  function update() {
    if (index >= total) index = 0;
    if (index < 0) index = total - 1;

    requestAnimationFrame(() => {
      track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
    });

    dots.forEach(d => d.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  }

  /* ===================================
     SWIPE SUPPORT (MOBILE PREMIUM)
  ==================================== */

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
        index = (index + 1) % total;
      } else {
        index = (index - 1 + total) % total;
      }
      update();
    }
  });

  /* ===================================
     AUTOPLAY WITH VISIBILITY CONTROL
  ==================================== */

  let interval = null;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {

      // Stop if not visible
      if (!entry.isIntersecting) {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }

      // Start if visible and desktop
      else if (window.innerWidth > 768 && !interval) {
        interval = setInterval(() => {
          index = (index + 1) % total;
          update();
        }, 4000);
      }

    });
  }, { threshold: 0.3 });

  observer.observe(carousel);
}


/* ===================================
   INIT ALL CAROUSELS
=================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".carousel").forEach(carousel => {
    initCarousel(carousel);
  });
});
