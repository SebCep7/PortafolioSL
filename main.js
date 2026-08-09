/* =====================================================
   MAIN.JS — Sebastián Loitegui | Portafolio Final
   1. Menú hamburguesa
   2. Modo claro / oscuro
   3. Reveal al hacer scroll
   4. Contador animado en stats
   5. Validación del formulario
   6. Botón volver arriba
   7. Header scroll effect
   8. Lightbox — click en imágenes de diplomas y certificaciones
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* =====================================================
       1. MENÚ HAMBURGUESA
       ===================================================== */
  const menuBtn = document.getElementById("menuHamburguesa");
  const navMenu = document.getElementById("navPrincipal");
  const overlay = document.getElementById("overlayMenu");
  const navLinks = navMenu ? navMenu.querySelectorAll("a") : [];

  function toggleMenu(forzar) {
    const abrir =
      typeof forzar === "boolean"
        ? forzar
        : !navMenu.classList.contains("activo");
    navMenu?.classList.toggle("activo", abrir);
    overlay?.classList.toggle("activo", abrir);
    menuBtn?.classList.toggle("activo", abrir);
    menuBtn?.setAttribute("aria-expanded", String(abrir));
    body.style.overflow = abrir ? "hidden" : "";
  }

  menuBtn?.addEventListener("click", () => toggleMenu());
  overlay?.addEventListener("click", () => toggleMenu(false));
  navLinks.forEach((link) =>
    link.addEventListener("click", () => toggleMenu(false)),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleMenu(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) toggleMenu(false);
  });

  /* =====================================================
       2. MODO CLARO / OSCURO
       Base oscura. Botón sol = ir a claro. Botón luna = volver a oscuro.
       ===================================================== */
  const modoBtn = document.getElementById("modoOscuroBtn");
  const modoIcono = modoBtn?.querySelector("i");

  function aplicarModo(claro) {
    body.classList.toggle("modo-claro", claro);
    if (modoIcono) {
      modoIcono.className = claro ? "fa-solid fa-moon" : "fa-solid fa-sun";
    }
    modoBtn?.setAttribute(
      "aria-label",
      claro ? "Activar modo oscuro" : "Activar modo claro",
    );
  }

  const modoGuardado = sessionStorage.getItem("modo");
  if (modoGuardado === "claro") aplicarModo(true);

  modoBtn?.addEventListener("click", () => {
    const esClaro = !body.classList.contains("modo-claro");
    aplicarModo(esClaro);
    sessionStorage.setItem("modo", esClaro ? "claro" : "oscuro");
  });

  /* =====================================================
       3. REVEAL AL HACER SCROLL
       No aplicamos a 'section' completa (evita bloquear clics).
       ===================================================== */
  const revealEls = document.querySelectorAll(
    ".tl-card, .skill-card, .edu-card, .cert-card, " +
      ".idioma-item, .proy-card, .sec-header, " +
      ".est-bloque, .idiomas-bloque, .form-contacto, .contacto-panel",
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("reveal-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" },
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* =====================================================
       4. CONTADOR ANIMADO EN STATS
       ===================================================== */
  const statsContainer = document.getElementById("statsContainer");
  const numeros = document.querySelectorAll(".stat-num[data-target]");
  let contado = false;

  function animarContador(el) {
    const target = Number(el.dataset.target) || 0;
    const duracion = 1600;
    const inicio = performance.now();
    function tick(ahora) {
      const p = Math.min((ahora - inicio) / duracion, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  if (statsContainer && numeros.length) {
    const obsStats = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !contado) {
            contado = true;
            numeros.forEach(animarContador);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    obsStats.observe(statsContainer);
  }


  /* =====================================================
    5. BOTÓN VOLVER ARRIBA
       ===================================================== */
  const btnTop = document.getElementById("btnVolverArriba");
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          btnTop?.classList.toggle("visible", window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
  btnTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  /* =====================================================
       7. HEADER SCROLL EFFECT
       ===================================================== */
  const header = document.getElementById("header");
  window.addEventListener(
    "scroll",
    () => {
      header?.classList.toggle("scrolled", window.scrollY > 30);
    },
    { passive: true },
  );

  /* =====================================================
       8. LIGHTBOX — diplomas y certificaciones
       Detecta clics en .edu-card img  y  .cert-img-wrap img
       ===================================================== */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCerrar = document.getElementById("lightboxCerrar");

  function abrirLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("activo");
    body.style.overflow = "hidden";
    lightboxCerrar?.focus();
  }

  function cerrarLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("activo");
    body.style.overflow = "";
    // Limpia el src después de que termina la transición
    setTimeout(() => {
      if (lightboxImg) lightboxImg.src = "";
    }, 300);
  }

  // Delegación de eventos — funciona aunque el DOM cambie
  document.addEventListener("click", (e) => {
    // Imagen de edu-card
    const eduImg = e.target.closest(".edu-card img");
    if (eduImg) {
      e.preventDefault();
      abrirLightbox(eduImg.src, eduImg.alt);
      return;
    }

    // Imagen dentro del wrapper de certificaciones
    const certImg = e.target.closest(".cert-img-wrap img");
    if (certImg) {
      e.preventDefault();
      abrirLightbox(certImg.src, certImg.alt);
      return;
    }

    // Click en el wrapper entero de cert también abre lightbox
    const certWrap = e.target.closest(".cert-img-wrap");
    if (certWrap) {
      const img = certWrap.querySelector("img");
      if (img) {
        e.preventDefault();
        abrirLightbox(img.src, img.alt);
      }
    }
  });

  lightboxCerrar?.addEventListener("click", cerrarLightbox);

  // Cierra al hacer click en el fondo oscuro
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === lightboxImg) {
      // Click en la imagen misma no cierra (solo el fondo)
      if (e.target !== lightboxImg) cerrarLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox?.classList.contains("activo"))
      cerrarLightbox();
  });
});
