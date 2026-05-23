/* =====================================================
   PANEL ADMIN — Abogados & Propiedad Raíz
   Backend: Supabase
   ===================================================== */

let sb;
let modoEdicion        = null;
let imagenesExistentes = [];
let imagenesNuevas     = [];
let imagenesEliminadas = [];

/* Propiedades hardcodeadas del sitio — para migración a Supabase */
const PROPIEDADES_LOCALES = [
  {
    titulo:       'Apartamento en Venta · Robledo',
    tipo:         'apartamento',
    operacion:    'venta',
    precio:       165000000,
    ciudad:       'medellin',
    sector:       'Robledo, Medellín',
    area:         44.5,
    habitaciones: 2,
    banos:        1,
    parqueadero:  'Común',
    piso:         5,
    ascensor:     false,
    admin:        60000,
    descripcion:  'Apartamento con salón comedor, zonas sociales, parqueadero común en unidad cerrada. Recibe vehículo de menor valor.',
    imagen:       'images/propiedad Robledo/Robledo-1.webp',
    imagenes:     Array.from({ length: 9 }, (_, i) => `images/propiedad Robledo/Robledo-${i + 1}.webp`),
  },
  {
    titulo:       'Apartamento tercer piso en Coveñas',
    tipo:         'apartamento',
    operacion:    'venta',
    precio:       300000000,
    ciudad:       'covenas',
    sector:       'Coveñas, Sucre – Barrio Sagoc',
    area:         60,
    habitaciones: 3,
    banos:        2,
    parqueadero:  'No incluye',
    piso:         3,
    ascensor:     true,
    admin:        0,
    descripcion:  'Unidad residencial campestre con ascensor, piscina semiolímpica, zonas verdes, juegos infantiles, vigilancia 24 horas y unidad cerrada. A 10 minutos del mar.',
    imagen:       'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.29 PM.webp',
    imagenes: [
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.29 PM.webp',
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.29 PM (1).webp',
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.29 PM (2).webp',
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.29 PM (3).webp',
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM.webp',
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (1).webp',
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (2).webp',
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (3).webp',
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (4).webp',
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (5).webp',
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (6).webp',
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (7).webp',
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.30 PM (8).webp',
      'images/apartamento-covenas-sagoc/WhatsApp Image 2026-05-12 at 6.06.31 PM.webp',
    ],
  },
];

/* ===== INICIALIZACIÓN ===== */
document.addEventListener('DOMContentLoaded', async () => {
  if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL === 'https://TU-PROYECTO.supabase.co') {
    document.getElementById('loginScreen').innerHTML = `
      <div style="text-align:center;padding:40px;max-width:480px;margin:auto">
        <p style="font-size:2rem;margin-bottom:16px">⚙️</p>
        <h2 style="color:#C9A84C;font-family:serif;margin-bottom:12px">Supabase no configurado</h2>
        <p style="color:#888;line-height:1.7">Abre <code style="color:#C9A84C">supabase-config.js</code>
        y pega la URL y la anon key de tu proyecto.</p>
      </div>`;
    return;
  }

  sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const tieneParamLogin = new URLSearchParams(window.location.search).has('login');
  const { data: { session } } = await sb.auth.getSession();

  if (session) {
    mostrarDashboard(session.user);
  } else if (tieneParamLogin) {
    mostrarLogin();
  } else {
    /* Sin sesión y sin ?login → redirigir al sitio principal */
    window.location.replace('../index.html');
    return;
  }

  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session)  mostrarDashboard(session.user);
    if (event === 'SIGNED_OUT') {
      window.location.replace('../index.html');
    }
  });

  initLoginForm();
  initLogout();
  initModal();
  initPropForm();
  initImageUpload();
  initTogglePass();
});

/* =====================================================
   AUTH
   ===================================================== */
function initLoginForm() {
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass  = document.getElementById('loginPass').value;
    const errEl = document.getElementById('loginError');
    const btn   = document.getElementById('btnLogin');

    errEl.textContent = '';
    btn.disabled = true;
    btn.textContent = 'Ingresando...';

    const { error } = await sb.auth.signInWithPassword({ email, password: pass });
    if (error) {
      errEl.textContent = traducirError(error.message);
      btn.disabled = false;
      btn.textContent = 'Ingresar';
    }
  });
}

function initLogout() {
  document.getElementById('logoutBtn').addEventListener('click', () => sb.auth.signOut());
}

function initTogglePass() {
  const btn   = document.getElementById('togglePass');
  const input = document.getElementById('loginPass');
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const visible = input.type === 'text';
    input.type = visible ? 'password' : 'text';
  });
}

function traducirError(msg) {
  if (msg.includes('Invalid login') || msg.includes('invalid_credentials'))
    return 'Correo o contraseña incorrectos.';
  if (msg.includes('Email not confirmed')) return 'Confirma tu correo primero.';
  if (msg.includes('rate limit'))          return 'Demasiados intentos. Espera unos minutos.';
  return 'Error al iniciar sesión. Intenta de nuevo.';
}

function mostrarLogin() {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
}

function mostrarDashboard(user) {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('adminEmail').textContent = user.email;
  cargarPropiedades();
}

/* =====================================================
   PROPIEDADES — LISTAR
   ===================================================== */
async function cargarPropiedades() {
  const loading = document.getElementById('loadingProps');
  const lista   = document.getElementById('propiedadesList');

  loading.classList.remove('hidden');
  lista.innerHTML = '';

  const { data, error } = await sb
    .from('propiedades')
    .select('*')
    .order('created_at', { ascending: false });

  loading.classList.add('hidden');

  if (error) {
    lista.innerHTML = `<p class="error-msg">❌ Error al cargar: ${error.message}</p>`;
    return;
  }

  document.getElementById('propCount').textContent = data.length;

  if (data.length === 0) {
    lista.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🏠</div>
        <h3>Supabase está vacío</h3>
        <p>Tienes <strong>${PROPIEDADES_LOCALES.length} propiedades</strong> en el sitio que aún no están en Supabase.</p>
        <p style="margin-top:6px;color:var(--gray-lt);font-size:0.82rem">Migralas para administrarlas desde aquí, o crea una nueva manualmente.</p>
        <div class="empty-actions">
          <button id="btnMigrar" class="btn-migrar" onclick="migrarPropiedadesLocales()">
            ⬆️ Migrar propiedades actuales del sitio
          </button>
        </div>
      </div>`;
    return;
  }

  data.forEach(row => lista.appendChild(crearTarjetaAdmin(row)));
}

function crearTarjetaAdmin(row) {
  const card = document.createElement('div');
  card.className  = 'admin-prop-card';
  card.dataset.id = row.id;

  const precio = row.precio
    ? `$${Number(row.precio).toLocaleString('es-CO')} COP`
    : 'Sin precio';
  const op   = row.operacion === 'venta' ? 'En Venta' : 'En Arriendo';
  const imgs = Array.isArray(row.imagenes) ? row.imagenes.length : 0;
  const tipo = row.tipo ? row.tipo.charAt(0).toUpperCase() + row.tipo.slice(1) : '—';

  card.innerHTML = `
    <div class="admin-prop-img">
      <img src="${resolverUrl(row.imagen)}" alt="${row.titulo || ''}"
           onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\'prop-img-placeholder\'>🏠</div>'">
    </div>
    <div class="admin-prop-info">
      <div class="admin-prop-badges">
        <span class="badge badge-tipo">${tipo}</span>
        <span class="badge badge-op badge-${row.operacion}">${op}</span>
      </div>
      <h3>${row.titulo || 'Sin título'}</h3>
      <p class="admin-prop-precio">${precio}</p>
      <p class="admin-prop-sector">📍 ${row.sector || '—'}</p>
      <p class="admin-prop-meta">
        📸 ${imgs} foto${imgs !== 1 ? 's' : ''}
        · 🛏 ${row.habitaciones || 0} hab.
        · 📐 ${row.area || 0} m²
        · Piso ${row.piso || 0}
      </p>
    </div>
    <div class="admin-prop-actions">
      <button class="btn-editar" onclick="editarPropiedad('${row.id}')">✏️ Editar</button>
      <button class="btn-eliminar" onclick="confirmarEliminar('${row.id}')">🗑 Eliminar</button>
    </div>`;

  return card;
}

/* =====================================================
   EDITAR PROPIEDAD
   ===================================================== */
async function editarPropiedad(id) {
  mostrarToast('Cargando propiedad...', 'info');

  const { data, error } = await sb
    .from('propiedades')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    mostrarToast('Error al cargar la propiedad.', 'error');
    return;
  }

  abrirModal(data);
}

/* =====================================================
   ELIMINAR PROPIEDAD
   ===================================================== */
async function confirmarEliminar(id) {
  if (!confirm('¿Eliminar esta propiedad?\n\nSe borrarán también todas sus imágenes. Esta acción no se puede deshacer.')) return;

  const card = document.querySelector(`.admin-prop-card[data-id="${id}"]`);
  if (card) card.style.opacity = '0.4';

  try {
    const { data: archivos } = await sb.storage.from('propiedades').list(id);
    if (archivos && archivos.length > 0) {
      const rutas = archivos.map(f => `${id}/${f.name}`);
      await sb.storage.from('propiedades').remove(rutas);
    }

    const { error } = await sb.from('propiedades').delete().eq('id', id);
    if (error) throw error;

    await cargarPropiedades();
    mostrarToast('Propiedad eliminada correctamente.', 'success');
  } catch (err) {
    if (card) card.style.opacity = '1';
    mostrarToast('Error al eliminar: ' + err.message, 'error');
  }
}

/* =====================================================
   MODAL
   ===================================================== */
function initModal() {
  document.getElementById('btnNuevaPropiedad').addEventListener('click', () => abrirModal(null));
  document.getElementById('modalClose').addEventListener('click', cerrarModal);
  document.getElementById('btnCancelar').addEventListener('click', cerrarModal);
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target.id === 'modal') cerrarModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarModal();
  });
}

function abrirModal(prop = null) {
  modoEdicion        = prop ? prop.id : null;
  imagenesExistentes = prop ? (Array.isArray(prop.imagenes) ? [...prop.imagenes] : []) : [];
  imagenesNuevas     = [];
  imagenesEliminadas = [];

  /* Título y botón según modo */
  document.getElementById('modalTitle').textContent =
    prop ? 'Editar Propiedad' : 'Nueva Propiedad';

  actualizarBotonGuardar();

  /* Poblar o resetear formulario */
  if (prop) poblarFormulario(prop);
  else      document.getElementById('propForm').reset();

  renderAllPreviews();

  document.getElementById('modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('fTitulo').focus(), 100);
}

function actualizarBotonGuardar() {
  const btn = document.getElementById('btnGuardar');
  const texto = modoEdicion ? 'Actualizar Propiedad' : 'Guardar Propiedad';
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
    ${texto}`;
}

function poblarFormulario(prop) {
  document.getElementById('fTitulo').value       = prop.titulo       || '';
  document.getElementById('fTipo').value         = prop.tipo         || '';
  document.getElementById('fOperacion').value    = prop.operacion    || '';
  document.getElementById('fPrecio').value       = prop.precio       || '';
  document.getElementById('fCiudad').value       = prop.ciudad       || '';
  document.getElementById('fSector').value       = prop.sector       || '';
  document.getElementById('fArea').value         = prop.area         || '';
  document.getElementById('fHabitaciones').value = prop.habitaciones || '';
  document.getElementById('fBanos').value        = prop.banos        || '';
  document.getElementById('fParqueadero').value  = prop.parqueadero  || '';
  document.getElementById('fPiso').value         = prop.piso         || '';
  document.getElementById('fAscensor').checked   = prop.ascensor     || false;
  document.getElementById('fAdmin').value        = prop.admin        || 0;
  document.getElementById('fDescripcion').value  = prop.descripcion  || '';
}

function cerrarModal() {
  if (document.getElementById('btnGuardar').disabled) return;
  document.getElementById('modal').classList.add('hidden');
  document.body.style.overflow = '';
  document.getElementById('propForm').reset();
  modoEdicion        = null;
  imagenesExistentes = [];
  imagenesNuevas     = [];
  imagenesEliminadas = [];
  document.getElementById('imagenesPreview').innerHTML = '';
  ocultarProgreso();
}

/* =====================================================
   FORMULARIO
   ===================================================== */
function initPropForm() {
  document.getElementById('propForm').addEventListener('submit', async e => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const totalImagenes = imagenesExistentes.length + imagenesNuevas.length;
    if (totalImagenes === 0) {
      mostrarToast('La propiedad debe tener al menos una imagen.', 'error');
      document.getElementById('dropZone').style.borderColor = '#E05050';
      setTimeout(() => document.getElementById('dropZone').style.borderColor = '', 2000);
      return;
    }

    const btn = document.getElementById('btnGuardar');
    btn.disabled = true;
    btn.innerHTML = `<span style="display:inline-flex;align-items:center;gap:8px">
      <span style="width:14px;height:14px;border:2px solid rgba(0,0,0,0.3);border-top-color:#000;border-radius:50%;animation:spin .7s linear infinite;display:inline-block"></span>
      ${modoEdicion ? 'Actualizando...' : 'Guardando...'}
    </span>`;

    let filaIdNueva = null;
    try {
      const datos = leerDatosFormulario();

      if (modoEdicion) {
        /* ---- MODO EDICIÓN ---- */
        if (imagenesEliminadas.length > 0) {
          await sb.storage.from('propiedades').remove(imagenesEliminadas);
        }

        let nuevasUrls = [];
        if (imagenesNuevas.length > 0) {
          mostrarProgreso();
          nuevasUrls = await subirImagenes(imagenesNuevas, modoEdicion);
        }

        const todasLasUrls = [...imagenesExistentes, ...nuevasUrls];

        const { error } = await sb.from('propiedades')
          .update({ ...datos, imagen: todasLasUrls[0] || '', imagenes: todasLasUrls })
          .eq('id', modoEdicion);

        if (error) throw error;

        cerrarModal();
        await cargarPropiedades();
        mostrarToast('¡Propiedad actualizada correctamente!', 'success');

      } else {
        /* ---- MODO NUEVA ---- */
        const { data: fila, error: insertErr } = await sb
          .from('propiedades')
          .insert({ ...datos, imagen: '', imagenes: [] })
          .select()
          .single();

        if (insertErr) throw insertErr;
        filaIdNueva = fila.id;

        mostrarProgreso();
        const urls = await subirImagenes(imagenesNuevas, fila.id);

        const { error: updateErr } = await sb.from('propiedades')
          .update({ imagen: urls[0] || '', imagenes: urls })
          .eq('id', fila.id);

        if (updateErr) throw updateErr;
        filaIdNueva = null;

        cerrarModal();
        await cargarPropiedades();
        mostrarToast('¡Propiedad agregada correctamente!', 'success');
      }

    } catch (err) {
      if (filaIdNueva) {
        await sb.from('propiedades').delete().eq('id', filaIdNueva).catch(() => {});
        filaIdNueva = null;
      }
      mostrarToast('Error: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      actualizarBotonGuardar();
      ocultarProgreso();
    }
  });
}

function leerDatosFormulario() {
  return {
    titulo:       document.getElementById('fTitulo').value.trim(),
    tipo:         document.getElementById('fTipo').value,
    operacion:    document.getElementById('fOperacion').value,
    precio:       Number(document.getElementById('fPrecio').value) || 0,
    ciudad:       normalizarCiudad(document.getElementById('fCiudad').value),
    sector:       document.getElementById('fSector').value.trim(),
    area:         parseFloat(document.getElementById('fArea').value) || 0,
    habitaciones: parseInt(document.getElementById('fHabitaciones').value) || 0,
    banos:        parseInt(document.getElementById('fBanos').value) || 0,
    parqueadero:  document.getElementById('fParqueadero').value,
    piso:         parseInt(document.getElementById('fPiso').value) || 0,
    ascensor:     document.getElementById('fAscensor').checked,
    admin:        Number(document.getElementById('fAdmin').value) || 0,
    descripcion:  document.getElementById('fDescripcion').value.trim(),
  };
}

function normalizarCiudad(str) {
  return str.trim().toLowerCase()
    .replace(/[áà]/g,'a').replace(/[éè]/g,'e')
    .replace(/[íì]/g,'i').replace(/[óò]/g,'o')
    .replace(/[úù]/g,'u').replace(/ñ/g,'n');
}

function validarFormulario() {
  const ids = ['fTitulo','fTipo','fOperacion','fCiudad','fSector','fPrecio','fArea','fHabitaciones','fBanos','fPiso','fParqueadero','fDescripcion'];
  let ok = true;
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) {
      el.style.borderColor = '#E05050';
      setTimeout(() => el.style.borderColor = '', 2500);
      ok = false;
    }
  });
  if (!ok) mostrarToast('Completa todos los campos obligatorios (*).', 'error');
  return ok;
}

/* =====================================================
   IMÁGENES
   ===================================================== */
function initImageUpload() {
  const zona  = document.getElementById('dropZone');
  const input = document.getElementById('fImagenes');

  zona.addEventListener('dragover', e => { e.preventDefault(); zona.classList.add('drag-over'); });
  zona.addEventListener('dragleave', () => zona.classList.remove('drag-over'));
  zona.addEventListener('drop', e => {
    e.preventDefault();
    zona.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) agregarImagenes(files);
  });

  input.addEventListener('change', () => {
    if (input.files.length) {
      agregarImagenes(Array.from(input.files));
      input.value = '';
    }
  });
}

function agregarImagenes(nuevas) {
  imagenesNuevas = [...imagenesNuevas, ...nuevas];
  renderAllPreviews();
}

function renderAllPreviews() {
  const preview = document.getElementById('imagenesPreview');
  preview.innerHTML = '';

  /* Imágenes existentes (URLs de Supabase) */
  imagenesExistentes.forEach((url, i) => {
    const div = document.createElement('div');
    div.className = 'preview-item';
    div.innerHTML = `
      <img src="${resolverUrl(url)}" alt="Imagen ${i + 1}">
      ${i === 0 && imagenesNuevas.length === 0 ? '<span class="preview-label">Portada</span>' : ''}
      <button class="preview-remove" type="button" aria-label="Eliminar">×</button>`;
    div.querySelector('.preview-remove').addEventListener('click', () => {
      const ruta = extraerRutaStorage(url);
      if (ruta) imagenesEliminadas.push(ruta);
      imagenesExistentes.splice(i, 1);
      renderAllPreviews();
    });
    preview.appendChild(div);
  });

  /* Imágenes nuevas (File objects) */
  imagenesNuevas.forEach((file, i) => {
    const url        = URL.createObjectURL(file);
    const isPortada  = imagenesExistentes.length === 0 && i === 0;
    const div        = document.createElement('div');
    div.className    = 'preview-item';
    div.innerHTML = `
      <img src="${url}" alt="${file.name}">
      ${isPortada ? '<span class="preview-label">Portada</span>' : ''}
      <span class="preview-new-badge">Nueva</span>
      <button class="preview-remove" type="button" aria-label="Eliminar">×</button>`;
    div.querySelector('.preview-remove').addEventListener('click', () => {
      imagenesNuevas.splice(i, 1);
      renderAllPreviews();
    });
    preview.appendChild(div);
  });
}

function extraerRutaStorage(url) {
  const marker = '/storage/v1/object/public/propiedades/';
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.substring(idx + marker.length));
}

/* Corrige rutas relativas locales para que funcionen desde la carpeta admin/ */
function resolverUrl(url) {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('../')) return url;
  return `../${url}`;
}

async function subirImagenes(files, propId) {
  const urls  = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    const ext  = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const ruta = `${propId}/imagen-${Date.now()}-${i}.${ext}`;

    actualizarProgreso(Math.round((i / total) * 100), i + 1, total);

    const { error } = await sb.storage
      .from('propiedades')
      .upload(ruta, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = sb.storage
      .from('propiedades')
      .getPublicUrl(ruta);

    urls.push(publicUrl);
    actualizarProgreso(Math.round(((i + 1) / total) * 100), i + 1, total);
  }

  return urls;
}

function actualizarProgreso(pct, actual, total) {
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent =
    `Subiendo imagen ${actual} de ${total}… ${pct}%`;
}

function mostrarProgreso() {
  document.getElementById('progressBar').classList.remove('hidden');
  actualizarProgreso(0, 1, imagenesNuevas.length || 1);
}

function ocultarProgreso() {
  document.getElementById('progressBar').classList.add('hidden');
}

/* =====================================================
   TOAST
   ===================================================== */
function mostrarToast(mensaje, tipo = 'success') {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

/* =====================================================
   MIGRACIÓN — propiedades locales → Supabase
   ===================================================== */
async function migrarPropiedadesLocales() {
  if (!confirm(`¿Migrar las ${PROPIEDADES_LOCALES.length} propiedades actuales del sitio a Supabase?\n\nQuedarán administrables desde este panel.`)) return;

  const btn = document.getElementById('btnMigrar');
  if (btn) { btn.disabled = true; btn.textContent = 'Migrando…'; }

  try {
    for (const prop of PROPIEDADES_LOCALES) {
      const { error } = await sb.from('propiedades').insert(prop);
      if (error) throw error;
    }
    await cargarPropiedades();
    mostrarToast(`¡${PROPIEDADES_LOCALES.length} propiedades migradas correctamente!`, 'success');
  } catch (err) {
    mostrarToast('Error al migrar: ' + err.message, 'error');
    if (btn) { btn.disabled = false; btn.textContent = '⬆️ Migrar propiedades actuales del sitio'; }
  }
}

/* Exponer al HTML (onclick inline) */
window.editarPropiedad          = editarPropiedad;
window.confirmarEliminar        = confirmarEliminar;
window.migrarPropiedadesLocales = migrarPropiedadesLocales;
