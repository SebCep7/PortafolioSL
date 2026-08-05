/* =====================================================
   SCRIPT.JS — Sebastián Loitegui | Portafolio Final
   1. Menú hamburguesa
   2. Modo claro / oscuro
   3. Reveal al hacer scroll
   4. Contador animado en stats
   5. Validación del formulario
   6. Botón volver arriba
   7. Carousel de certificaciones
   8. Header scroll effect
   9. Lightbox de imágenes (certificaciones / diplomas)
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =====================================================
       1. MENÚ HAMBURGUESA
       ===================================================== */

    const menuBtn  = document.getElementById('menuHamburguesa');
    const navMenu  = document.getElementById('navPrincipal');
    const overlay  = document.getElementById('overlayMenu');
    const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

    function toggleMenu(forzar) {
        const abrir = typeof forzar === 'boolean'
            ? forzar
            : !navMenu.classList.contains('activo');

        navMenu?.classList.toggle('activo', abrir);
        overlay?.classList.toggle('activo', abrir);
        menuBtn?.classList.toggle('activo', abrir);
        menuBtn?.setAttribute('aria-expanded', String(abrir));
        body.style.overflow = abrir ? 'hidden' : '';
    }

    menuBtn?.addEventListener('click', () => toggleMenu());
    overlay?.addEventListener('click', () => toggleMenu(false));
    navLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') toggleMenu(false);
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) toggleMenu(false);
    });


    /* =====================================================
       2. MODO CLARO / OSCURO
       El diseño BASE es oscuro. El botón activa modo claro.
       FIX: el botón ahora es visible tanto en desktop como en
       mobile (antes estaba oculto en desktop por CSS), por lo
       que el clic ya cambia el tema en ambos casos.
       ===================================================== */

    const modoBtn   = document.getElementById('modoOscuroBtn');
    const modoIcono = modoBtn?.querySelector('i');

    function aplicarModo(claro) {
        body.classList.toggle('modo-claro', claro);
        if (modoIcono) {
            modoIcono.className = claro ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        }
        modoBtn?.setAttribute('aria-label', claro ? 'Activar modo oscuro' : 'Activar modo claro');
    }

    // Recupera preferencia de sesión
    const modoGuardado = sessionStorage.getItem('modo');
    if (modoGuardado === 'claro') aplicarModo(true);

    modoBtn?.addEventListener('click', () => {
        const esClaro = !body.classList.contains('modo-claro');
        aplicarModo(esClaro);
        sessionStorage.setItem('modo', esClaro ? 'claro' : 'oscuro');
    });


    /* =====================================================
       3. REVEAL AL HACER SCROLL
       ===================================================== */

    const elementos = document.querySelectorAll(
        'section, .tl-card, .skill-card, .edu-card, .cert-card, .idioma-item, .proy-card'
    );
    elementos.forEach(el => el.classList.add('reveal'));

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        elementos.forEach(el => el.classList.add('reveal-visible'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        elementos.forEach(el => observer.observe(el));
    }


    /* =====================================================
       4. CONTADOR ANIMADO EN STATS
       ===================================================== */

    const statsContainer = document.getElementById('statsContainer');
    const numeros = document.querySelectorAll('.stat-num[data-target]');
    let contado = false;

    function animarContador(el) {
        const target   = Number(el.dataset.target) || 0;
        const duracion = 1600;
        const inicio   = performance.now();

        function tick(ahora) {
            const p = Math.min((ahora - inicio) / duracion, 1);
            el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }
        requestAnimationFrame(tick);
    }

    if (statsContainer && numeros.length) {
        const obsStats = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !contado) {
                    contado = true;
                    numeros.forEach(animarContador);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        obsStats.observe(statsContainer);
    }


    /* =====================================================
       5. VALIDACIÓN DEL FORMULARIO
       ===================================================== */

    const form       = document.getElementById('formularioContacto');
    const fNombre    = document.getElementById('nombre');
    const fEmail     = document.getElementById('email');
    const fMensaje   = document.getElementById('mensaje');
    const eNombre    = document.getElementById('errorNombre');
    const eEmail     = document.getElementById('errorEmail');
    const eMensaje   = document.getElementById('errorMensaje');
    const formStatus = document.getElementById('formStatus');
    const regex      = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(input, span, msg) {
        input.classList.add('input-error');
        input.setAttribute('aria-invalid', 'true');
        if (span) span.textContent = msg;
    }
    function clearError(input, span) {
        input.classList.remove('input-error');
        input.setAttribute('aria-invalid', 'false');
        if (span) span.textContent = '';
    }

    function validarNombre() {
        if (!fNombre) return true;
        if (fNombre.value.trim().length < 3) {
            setError(fNombre, eNombre, 'Ingresá al menos 3 caracteres.');
            return false;
        }
        clearError(fNombre, eNombre);
        return true;
    }
    function validarEmail() {
        if (!fEmail) return true;
        if (!regex.test(fEmail.value.trim())) {
            setError(fEmail, eEmail, 'Ingresá un email válido.');
            return false;
        }
        clearError(fEmail, eEmail);
        return true;
    }
    function validarMensaje() {
        if (!fMensaje) return true;
        if (fMensaje.value.trim().length < 10) {
            setError(fMensaje, eMensaje, 'El mensaje debe tener al menos 10 caracteres.');
            return false;
        }
        clearError(fMensaje, eMensaje);
        return true;
    }

    fNombre?.addEventListener('blur', validarNombre);
    fEmail?.addEventListener('blur', validarEmail);
    fMensaje?.addEventListener('blur', validarMensaje);

    form?.addEventListener('submit', e => {
        e.preventDefault();
        const ok = validarNombre() & validarEmail() & validarMensaje();

        if (ok) {
            formStatus.textContent = '¡Gracias! Tu mensaje fue enviado correctamente.';
            formStatus.className = 'form-status form-status-exito';
            form.reset();
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        } else {
            formStatus.textContent = 'Revisá los campos marcados antes de enviar.';
            formStatus.className = 'form-status form-status-error';
        }
    });


    /* =====================================================
       6. BOTÓN VOLVER ARRIBA
       ===================================================== */

    const btnTop = document.getElementById('btnVolverArriba');
    let ticking  = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                btnTop?.classList.toggle('visible', window.scrollY > 400);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    btnTop?.addEventListener('click', () =>
        window.scrollTo({ top: 0, behavior: 'smooth' })
    );


    /* =====================================================
       7. CAROUSEL DE CERTIFICACIONES
       ===================================================== */

    const track = document.getElementById('carouselTrack');

    if (track) {
        const dots    = document.querySelectorAll('.carousel-dot');
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');
        const total   = dots.length;
        let current   = 0;
        let autoTimer;

        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => {
                const activo = i === current;
                d.classList.toggle('active', activo);
                d.setAttribute('aria-selected', String(activo));
            });
        }

        function resetAuto() {
            clearInterval(autoTimer);
            autoTimer = setInterval(() => goTo(current + 1), 4500);
        }

        btnPrev?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
        btnNext?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
        dots.forEach(d => d.addEventListener('click', () => {
            goTo(Number(d.dataset.index));
            resetAuto();
        }));

        goTo(0);
        resetAuto();
    }


    /* =====================================================
       8. HEADER SCROLL EFFECT (sombra al bajar)
       ===================================================== */

    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });


    /* =====================================================
       9. LIGHTBOX DE IMÁGENES (certificaciones y diplomas)
       Al hacer click en una imagen del carrusel de certificados
       o de las tarjetas de educación, se abre en un modal a
       pantalla completa dentro de la misma página.
       ===================================================== */

    const lightbox        = document.getElementById('lightbox');
    const lightboxImg      = document.getElementById('lightboxImg');
    const lightboxCerrar   = document.getElementById('lightboxCerrar');
    const imgsClickeables  = document.querySelectorAll('.cert-card img, .edu-card img');

    function abrirLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.classList.add('activo');
        body.style.overflow = 'hidden';
    }

    function cerrarLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('activo');
        body.style.overflow = '';
    }

    imgsClickeables.forEach(img => {
        img.addEventListener('click', () => abrirLightbox(img.src, img.alt));
    });

    lightboxCerrar?.addEventListener('click', cerrarLightbox);

    // Cierra al hacer click fuera de la imagen (en el fondo oscuro)
    lightbox?.addEventListener('click', e => {
        if (e.target === lightbox) cerrarLightbox();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') cerrarLightbox();
    });

});