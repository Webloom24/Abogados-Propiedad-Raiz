/* =====================================================
   ABOGADOS & PROPIEDAD RAÍZ — Lógica principal
   ===================================================== */

/* ===== DATOS DE PROPIEDADES ===== */
const propiedades = [
  {
    id: 1,
    titulo: 'Apartamento en Venta · Robledo',
    tipo: 'apartamento',
    operacion: 'venta',
    precio: 165000000,
    ciudad: 'medellin',
    sector: 'Robledo, Medellín',
    area: 44.5,
    habitaciones: 2,
    banos: 1,
    parqueadero: 'Común',
    piso: 5,
    ascensor: false,
    admin: 60000,
    descripcion: 'Apartamento con salón comedor, zonas sociales, parqueadero común en unidad cerrada. Recibe vehículo de menor valor.',
    imagen: 'images/propiedad Robledo/Robledo-1.webp',
    galeriaId: 'galeria',
  },
  {
    id: 2,
    titulo: 'Apartamento tercer piso en Coveñas',
    tipo: 'apartamento',
    operacion: 'venta',
    precio: 300000000,
    ciudad: 'covenas',
    sector: 'Coveñas, Sucre – Barrio Sagoc',
    area: 60,
    habitaciones: 3,
    banos: 2,
    parqueadero: 'No incluye',
    piso: 3,
    ascensor: true,
    admin: 0,
    descripcion: 'Unidad residencial campestre con ascensor, piscina semiolímpica, zonas verdes, juegos infantiles, vigilancia 24 horas y unidad cerrada. A 10 minutos del mar.',
    imagen: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.29 PM.webp',
    galeriaId: 'galeria-covenas',
  },
];

/* ===== GALERÍA ===== */
const galeriaRobledo = Array.from({ length: 9 }, (_, i) => ({
  src: `images/propiedad Robledo/Robledo-${i + 1}.webp`,
  alt: `Apartamento Robledo — Foto ${i + 1}`,
}));

const galeriaCovenas = [
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.29 PM.webp',     alt: 'Apartamento Coveñas — Foto 1' },
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.29 PM (1).webp', alt: 'Apartamento Coveñas — Foto 2' },
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.29 PM (2).webp', alt: 'Apartamento Coveñas — Foto 3' },
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.29 PM (3).webp', alt: 'Apartamento Coveñas — Foto 4' },
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM.webp',     alt: 'Apartamento Coveñas — Foto 5' },
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (1).webp', alt: 'Apartamento Coveñas — Foto 6' },
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (2).webp', alt: 'Apartamento Coveñas — Foto 7' },
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (3).webp', alt: 'Apartamento Coveñas — Foto 8' },
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (4).webp', alt: 'Apartamento Coveñas — Foto 9' },
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (5).webp', alt: 'Apartamento Coveñas — Foto 10' },
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (6).webp', alt: 'Apartamento Coveñas — Foto 11' },
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (7).webp', alt: 'Apartamento Coveñas — Foto 12' },
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (8).webp', alt: 'Apartamento Coveñas — Foto 13' },
  { src: 'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.31 PM.webp',     alt: 'Apartamento Coveñas — Foto 14' },
];

/* ===== HELPERS ===== */
function formatPrecio(num) {
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toLocaleString('es-CO', { minimumFractionDigits: 0 })}B`;
  }
  const millones = num / 1000000;
  return `$${millones.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}.000.000`;
}

function formatAdmin(num) {
  return `$${num.toLocaleString('es-CO')}/mes administración`;
}

function iconoWa() {
  return `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.527 5.845L0 24l6.334-1.502A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.99 0-3.842-.544-5.433-1.487l-.39-.228-4.036.957.977-3.935-.249-.404A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>`;
}

/* ===== RENDERIZAR TARJETAS ===== */
function renderPropiedades(lista) {
  const grid = document.getElementById('propiedadesGrid');
  if (!grid) return;

  grid.innerHTML = '';

  if (lista.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <p>No encontramos propiedades con esos filtros.</p>
        <p>Intenta cambiar los criterios de búsqueda.</p>
      </div>`;
    return;
  }

  lista.forEach(p => {
    const waMsg = encodeURIComponent(`Hola, me interesa la propiedad: ${p.titulo} — ${p.sector}`);
    const card = document.createElement('article');
    card.className = 'property-card fade-in-up';
    card.innerHTML = `
      <div class="property-img-wrapper" onclick="irAGaleria('${p.galeriaId || 'galeria'}')" style="cursor:pointer">
        <img src="${p.imagen}" alt="${p.titulo}" class="property-img" loading="lazy">
        <span class="property-badge badge-${p.operacion}">
          ${p.operacion === 'venta' ? 'En Venta' : 'En Arriendo'}
        </span>
        <button class="property-wishlist" aria-label="Guardar propiedad en favoritos" onclick="event.stopPropagation()">♡</button>
      </div>
      <div class="property-body">
        <div class="property-price">${formatPrecio(p.precio)} COP</div>
        <h3 class="property-title">${p.titulo}</h3>
        <p class="property-location">📍 ${p.sector}</p>
        <div class="property-meta">
          <span class="meta-item">📐 ${p.area} m²</span>
          <span class="meta-item">🛏 ${p.habitaciones} hab.</span>
          <span class="meta-item">🚿 ${p.banos} baño</span>
          <span class="meta-item">🅿 ${p.parqueadero}</span>
          <span class="meta-item">🏢 Piso ${p.piso}</span>
          ${!p.ascensor ? '<span class="meta-item">🚶 Sin ascensor</span>' : ''}
        </div>
        <p class="property-desc">${p.descripcion}</p>
        ${p.admin ? `<p class="property-admin">💰 ${formatAdmin(p.admin)}</p>` : ''}
        <div class="property-footer">
          <button class="btn-card" onclick="irAGaleria('${p.galeriaId || 'galeria'}')">Ver galería</button>
          <a href="https://wa.me/573005981958?text=${waMsg}"
             class="btn-card-wa"
             target="_blank"
             rel="noopener"
             aria-label="Consultar por WhatsApp">
            ${iconoWa()} WhatsApp
          </a>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  /* Placeholders para completar la fila de 3 columnas en desktop */
  const maxPlaceholders = 2;
  const faltantes = Math.max(0, 3 - lista.length);
  for (let i = 0; i < Math.min(faltantes, maxPlaceholders); i++) {
    const ph = document.createElement('div');
    ph.className = 'property-card-placeholder fade-in-up';
    ph.innerHTML = `
      <div class="placeholder-img">🏠</div>
      <div class="placeholder-body">
        <div style="height:18px;background:var(--dark-4);border-radius:4px;margin-bottom:12px;width:65%"></div>
        <div style="height:13px;background:var(--dark-4);border-radius:4px;margin-bottom:8px;width:88%"></div>
        <div style="height:13px;background:var(--dark-4);border-radius:4px;width:55%"></div>
      </div>
      <div class="placeholder-overlay">
        <span class="placeholder-tag">Próximamente</span>
        <p class="placeholder-desc">Nueva propiedad en catálogo</p>
      </div>`;
    grid.appendChild(ph);
  }

  observarElementos();
}

function irAGaleria(galeriaId) {
  const galeria = galerias[galeriaId] || galeriaRobledo;
  abrirLightbox(0, galeria);
}

/* ===== FILTROS ===== */
function filtrarPropiedades() {
  const tipo      = document.getElementById('filtroTipo').value;
  const operacion = document.getElementById('filtroOperacion').value;
  const ciudad    = document.getElementById('filtroCiudad').value;
  const minP      = parseInt(document.getElementById('rangeMin').value) * 1000000;
  const maxP      = parseInt(document.getElementById('rangeMax').value) * 1000000;

  const filtradas = propiedades.filter(p => {
    if (tipo      && p.tipo      !== tipo)      return false;
    if (operacion && p.operacion !== operacion) return false;
    if (ciudad    && p.ciudad    !== ciudad)    return false;
    if (p.precio < minP || p.precio > maxP)    return false;
    return true;
  });

  renderPropiedades(filtradas);

  setTimeout(() => {
    const sec = document.getElementById('propiedades');
    if (!sec) return;
    const navH = 74;
    const top = sec.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  }, 80);
}

/* ===== RANGO DE PRECIOS ===== */
function initRangoPrecios() {
  const rMin    = document.getElementById('rangeMin');
  const rMax    = document.getElementById('rangeMax');
  const lblMin  = document.getElementById('precioMin');
  const lblMax  = document.getElementById('precioMax');
  const track   = document.getElementById('rangeTrack');

  if (!rMin || !rMax) return;

  function etiqueta(val) {
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}B`;
    return `$${val}M`;
  }

  function actualizar() {
    let min = parseInt(rMin.value);
    let max = parseInt(rMax.value);

    /* Evitar que se crucen */
    if (min > max - 50) {
      if (document.activeElement === rMin) {
        rMin.value = max - 50;
        min = max - 50;
      } else {
        rMax.value = min + 50;
        max = min + 50;
      }
    }

    lblMin.textContent = etiqueta(min);
    lblMax.textContent = etiqueta(max);

    /* Colorear el segmento seleccionado */
    const total = 1000 - 50;
    const p1 = ((min - 50) / total) * 100;
    const p2 = ((max - 50) / total) * 100;
    if (track) {
      track.style.background =
        `linear-gradient(to right,
          var(--dark-4) ${p1}%,
          var(--gold) ${p1}%,
          var(--gold) ${p2}%,
          var(--dark-4) ${p2}%)`;
    }
  }

  rMin.addEventListener('input', actualizar);
  rMax.addEventListener('input', actualizar);
  actualizar();
}

/* ===== MAPA DE GALERÍAS ===== */
const galerias = {
  'galeria':         galeriaRobledo,
  'galeria-covenas': galeriaCovenas,
};

/* ===== LIGHTBOX ===== */
let galeriaActual = galeriaRobledo;
let lightboxIndex = 0;

function abrirLightbox(indice, galeria) {
  galeriaActual = galeria || galeriaRobledo;
  lightboxIndex = indice;
  const lb = document.getElementById('lightbox');
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  actualizarLightbox();
}

function cerrarLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function actualizarLightbox() {
  const img     = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  const data    = galeriaActual[lightboxIndex];
  img.src       = data.src;
  img.alt       = data.alt;
  counter.textContent = `${lightboxIndex + 1} / ${galeriaActual.length}`;
}

function imagenSiguiente() {
  lightboxIndex = (lightboxIndex + 1) % galeriaActual.length;
  actualizarLightbox();
}

function imagenAnterior() {
  lightboxIndex = (lightboxIndex - 1 + galeriaActual.length) % galeriaActual.length;
  actualizarLightbox();
}

function initLightbox() {
  document.getElementById('lightboxClose').addEventListener('click', cerrarLightbox);
  document.getElementById('lightboxNext').addEventListener('click', imagenSiguiente);
  document.getElementById('lightboxPrev').addEventListener('click', imagenAnterior);

  /* Cerrar al hacer clic fuera de la imagen */
  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target.id === 'lightbox') cerrarLightbox();
  });

  /* Navegación con teclado */
  document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('active')) return;
    if (e.key === 'Escape')      cerrarLightbox();
    if (e.key === 'ArrowRight')  imagenSiguiente();
    if (e.key === 'ArrowLeft')   imagenAnterior();
  });
}

/* ===== NAVBAR — efecto al hacer scroll ===== */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  /* Cerrar menú móvil al navegar */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ===== INTERSECTION OBSERVER — animaciones fade-in ===== */
let observer;

function observarElementos() {
  if (!observer) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  }

  document.querySelectorAll('.fade-in-up:not(.visible)').forEach(el => {
    observer.observe(el);
  });
}

/* ===== SMOOTH SCROLL para links de ancla ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href   = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navH = 74;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ===== FORMULARIO DE CONTACTO ===== */
function initFormulario() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    /* Validación básica */
    let valido = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valido = false;
      }
    });
    if (!valido) return;

    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    /* Simulación de envío */
    setTimeout(() => {
      document.getElementById('formSuccess').classList.add('visible');
      form.reset();
      btn.textContent = 'Enviar consulta';
      btn.disabled = false;
      setTimeout(() => {
        document.getElementById('formSuccess').classList.remove('visible');
      }, 5500);
    }, 1000);
  });

  /* Limpiar error al escribir */
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}

/* ===== BOTONES WISHLIST ===== */
function initWishlist() {
  document.addEventListener('click', e => {
    if (!e.target.classList.contains('property-wishlist')) return;
    const btn = e.target;
    const activo = btn.textContent.trim() === '♥';
    btn.textContent = activo ? '♡' : '♥';
    btn.style.color = activo ? '' : '#e74c3c';
  });
}

/* ===== CHIPS DE CATEGORÍA (Hero) ===== */
function initChips() {
  const mapa = {
    'Apartamentos': 'apartamento',
    'Casas':        'casa',
    'Lotes':        'lote',
    'Fincas':       'finca',
    'Locales':      'local',
  };

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const tipo = mapa[chip.textContent.trim()];
      if (!tipo) return;
      const sel = document.getElementById('filtroTipo');
      if (sel) sel.value = tipo;
      filtrarPropiedades();
    });
  });
}

/* ===== INICIALIZACIÓN ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderPropiedades(propiedades);
  initLightbox();
  initNavbar();
  initRangoPrecios();
  initFormulario();
  initSmoothScroll();
  initWishlist();
  initChips();
  observarElementos();
});
