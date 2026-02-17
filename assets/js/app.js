/* =====================================================
   SAFE ACCESS
===================================================== */

function safeGet(obj, path, fallback = "") {
  try {
    return path.split(".").reduce((o, p) => o[p], obj) ?? fallback;
  } catch {
    return fallback;
  }
}

/* =====================================================
   CTA INTELIGENTE UNIFICADO
===================================================== */

function buildCTA(cta, contact) {

  if (!cta?.enabled || !cta.url) return "";

  let url = cta.url.trim();

  // Número puro → WhatsApp
  if (/^\d+$/.test(url)) {
    return `
      <a href="https://wa.me/${url}"
         class="btn section-cta"
         target="_blank"
         rel="noopener">
         ${cta.text || "Contactar"}
      </a>
    `;
  }

  // URL normal
  return `
    <a href="${url}"
       class="btn section-cta"
       target="_blank"
       rel="noopener">
       ${cta.text || "Más información"}
    </a>
  `;
}

/* =====================================================
   HERO RENDER
===================================================== */

function renderHero(hero, contact) {

  if (!hero?.enabled) return;

  const heroSection = document.getElementById("heroSection");
  if (!heroSection) return;

  heroSection.style.backgroundImage =
  `url('${safeGet(hero, "background")}')`;


  let ctaHTML = "";

  if (hero.cta?.enabled) {

    let finalUrl = "#";

    if (hero.cta.type === "whatsapp") {
      finalUrl = `https://wa.me/${safeGet(contact,"whatsapp")}?text=${encodeURIComponent(hero.cta.message || "")}`;
    }

    if (hero.cta.type === "url") {
      finalUrl = hero.cta.url;
    }

    ctaHTML = `
      <a href="${finalUrl}" class="btn" target="_blank" rel="noopener">
        ${hero.cta.text || "Contactar"}
      </a>
    `;
  }

  heroSection.innerHTML = `
    <div class="hero-content container">
      <img src="${safeGet(hero,"logo")}"
           class="hero-logo"
           alt="Pulido Asesores"
           fetchpriority="high">
      <h1>${safeGet(hero,"title")}</h1>
      <p>${safeGet(hero,"subtitle")}</p>
      ${ctaHTML}
    </div>
  `;
}

/* =====================================================
   RENDER SECTIONS
===================================================== */

function renderSections(sections, contact) {

  const container = document.getElementById("dynamicContent");
  if (!container) return;

  container.innerHTML = "";

  sections.forEach(section => {

    if (!section.enabled) return;

    const sectionEl = document.createElement("section");
    sectionEl.className = "container card";
    sectionEl.id = safeGet(section, "id");

    let contentHTML = "";

    // 🔹 Soporte texto como lista o párrafo
    if (Array.isArray(section.text)) {
      contentHTML = `
        <ul class="service-list">
          ${section.text.map(item => `<li>${item}</li>`).join("")}
        </ul>
      `;
    } else {
      contentHTML = `<p>${safeGet(section,"text")}</p>`;
    }

    // 🔹 Imágenes / Carrusel
    let imagesHTML = "";

    if (section.images?.enabled && section.images.items?.length) {

      imagesHTML = `
        <div class="carousel">
          <div class="carousel-track">
            ${section.images.items.map(img => `
              <div class="carousel-slide">
                <img src="${img}" loading="lazy" alt="">
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    // 🔹 Lotties
let lottiesHTML = "";

if (section.lotties?.enabled && section.lotties.items?.length) {

  lottiesHTML = `
    <div class="lottie-grid">
      ${section.lotties.items.map(item => `
        <div class="lottie-item">
          <div class="lottie-icon"
               data-path="${item.path}"
               data-loop="${section.lotties.loop}"
               data-autoplay="${section.lotties.autoplay}">
          </div>
          <div class="lottie-label">
            ${item.label}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}



    // 🔹 Quote
    let quoteHTML = "";

    if (section.quote?.enabled) {
      quoteHTML = `
        <div class="quote">
          ${section.quote.text}
        </div>
      `;
    }

    // 🔹 Mapa
    let mapHTML = "";

    if (section.map?.enabled && contact?.mapEmbed) {
      mapHTML = `
        <div class="map-container">
          <iframe src="${contact.mapEmbed}"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  allowfullscreen="">
          </iframe>
        </div>
      `;
    }


    sectionEl.innerHTML = `
      <h2>${safeGet(section,"title")}</h2>
      ${contentHTML}
      ${imagesHTML}
      ${lottiesHTML}
      ${quoteHTML}
      ${mapHTML}
      ${buildCTA(section.cta, contact)}
    `;

    container.appendChild(sectionEl);

  });

  // 🔹 Inicializar componentes dinámicos
  if (typeof initCarousel === "function") initCarousel();
  if (typeof initLotties === "function") initLotties();

  activateReveal();
}



/* =====================================================
   FOOTER + PRIVACY MODAL
===================================================== */

function renderFooter(meta){

  const footer = document.getElementById("footerSection");
  if(!footer) return;

  const year = new Date().getFullYear();

  footer.innerHTML = `
    <div class="footer-container">
      <p>© ${year} Pulido Asesores. Todos los derechos reservados.</p>
      <a href="#" class="privacy-link" id="openPrivacy">Aviso de Privacidad</a>
    </div>

    <!-- Modal -->
    <div class="privacy-modal" id="privacyModal">
      <div class="privacy-content">
        <button class="close-modal" id="closePrivacy">×</button>
        <h2>Aviso de Privacidad</h2>
        <p>
        En Pulido Asesores protegemos la información de nuestros clientes conforme
        a la legislación mexicana vigente. Los datos personales proporcionados
        serán utilizados únicamente para fines de contacto, prestación de servicios
        profesionales y cumplimiento de obligaciones legales.
        </p>
        <p>
        Usted podrá ejercer en cualquier momento sus derechos de acceso,
        rectificación, cancelación u oposición (ARCO) enviando solicitud al correo:
        contacto@pulidoasesores.com
        </p>
      </div>
    </div>
  `;

  // Eventos
  const modal = document.getElementById("privacyModal");
  const openBtn = document.getElementById("openPrivacy");
  const closeBtn = document.getElementById("closePrivacy");

  openBtn.addEventListener("click", e => {
    e.preventDefault();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  });

  modal.addEventListener("click", (e) => {
    if(e.target === modal){
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}



/* =====================================================
   SCROLL REVEAL
===================================================== */

function activateReveal() {

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
      }
    });
  }, { threshold: .15 });

  document.querySelectorAll(".card, .lottie-icon").forEach(el=>{
  observer.observe(el);
});

}

/* =====================================================
   FETCH CMS
===================================================== */

fetch("data/content.json")
  .then(res => {
    if (!res.ok) throw new Error("JSON no encontrado");
    return res.json();
  })
  .then(data => {
    renderHero(data.hero, data.contact);
    renderSections(data.sections, data.contact);
    renderFooter(data.meta);
  })


  .catch(err => {
    console.error("Error cargando JSON:", err);
  });

  function initLotties(){

  if(typeof lottie === "undefined"){
    console.warn("Lottie library not loaded");
    return;
  }

  document.querySelectorAll(".lottie-icon").forEach(container => {

    const path = container.dataset.path;
    const loop = container.dataset.loop === "true";
    const autoplay = container.dataset.autoplay === "true";

    if(!path) return;

    lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: loop,
      autoplay: autoplay,
      path: path
    });

  });

}

// Cinematic Parallax
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  if(!hero) return;

  const scrollY = window.scrollY;
  hero.style.backgroundPosition = `center ${scrollY * 0.15}px`;
});
