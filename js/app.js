/* ============================================================
   APP — Guía SPEN·OPLE 2026
   Router por hash + render de contenido + quiz "hoja óptica" + progreso
   ============================================================ */

const state = {
  modules: null,
  user: null,
  progress: {},        // { [temaId]: { leccionVista: bool, mejorPuntaje: {aciertos,total}, fecha } }
  firebaseReady: false,
  db: null,
};

const $app = document.getElementById('app');
const $sidebar = document.getElementById('sidebar');
const $authBox = document.getElementById('auth-box');

/* ---------------- Carga de datos ---------------- */
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`No se pudo cargar ${path}`);
  return res.json();
}

function findTema(temaId) {
  for (const mod of state.modules.modulos) {
    const t = mod.temas.find(t => t.id === temaId);
    if (t) return { mod, tema: t };
  }
  return null;
}

/* ---------------- Progreso (Firestore si hay sesión, si no localStorage) ---------------- */
const LOCAL_KEY = 'ople2026_progreso';

function loadLocalProgress() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {}; }
  catch { return {}; }
}
function saveLocalProgress() {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state.progress));
}

async function persistProgress() {
  saveLocalProgress();
  if (state.user && state.db) {
    try {
      await state.db.collection('usuarios').doc(state.user.uid)
        .set({ progreso: state.progress, actualizado: Date.now() }, { merge: true });
    } catch (e) { console.warn('No se pudo guardar en Firestore:', e); }
  }
}

async function loadProgressForUser() {
  if (state.user && state.db) {
    try {
      const doc = await state.db.collection('usuarios').doc(state.user.uid).get();
      if (doc.exists && doc.data().progreso) {
        state.progress = doc.data().progreso;
        return;
      }
    } catch (e) { console.warn('No se pudo leer Firestore:', e); }
  }
  state.progress = loadLocalProgress();
}

function markLessonSeen(temaId) {
  state.progress[temaId] = state.progress[temaId] || {};
  state.progress[temaId].leccionVista = true;
  persistProgress();
}

function saveQuizScore(temaId, aciertos, total) {
  state.progress[temaId] = state.progress[temaId] || {};
  const prev = state.progress[temaId].mejorPuntaje;
  if (!prev || aciertos > prev.aciertos) {
    state.progress[temaId].mejorPuntaje = { aciertos, total, fecha: Date.now() };
  }
  persistProgress();
}

/* ---------------- Firebase (opcional — la app funciona sin configurar) ---------------- */
function initFirebase() {
  try {
    if (typeof firebaseConfig === 'undefined' || firebaseConfig.apiKey === 'TU_API_KEY') {
      console.info('Firebase no configurado todavía — el progreso se guarda solo en este navegador.');
      renderAuthBox();
      return;
    }
    firebase.initializeApp(firebaseConfig);
    state.db = firebase.firestore();
    state.firebaseReady = true;
    renderAuthBox(); // pinta el botón de inmediato, sin esperar a onAuthStateChanged
    firebase.auth().onAuthStateChanged(
      async (user) => {
        state.user = user;
        await loadProgressForUser();
        renderAuthBox();
        renderRoute();
      },
      (error) => {
        console.error('Error del listener de autenticación:', error);
        renderAuthBox();
      }
    );
  } catch (e) {
    console.error('Firebase no disponible:', e);
    state.firebaseReady = false;
    renderAuthBox();
  }
}

function renderAuthBox() {
  if (!$authBox) return;
  if (!state.firebaseReady) {
    $authBox.innerHTML = `<span class="folio-chip" title="Configura js/firebase-config.js para sincronizar tu progreso">Progreso guardado en este navegador</span>`;
    return;
  }
  if (state.user) {
    $authBox.innerHTML = `
      <span class="folio-chip">${state.user.displayName || state.user.email}</span>
      <button class="btn btn-ghost" id="btn-signout">Cerrar sesión</button>`;
    document.getElementById('btn-signout').onclick = () => firebase.auth().signOut();
  } else {
    $authBox.innerHTML = `<button class="btn btn-google" id="btn-signin">Iniciar sesión con Google</button>`;
    document.getElementById('btn-signin').onclick = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).catch(e => alert('No se pudo iniciar sesión: ' + e.message));
    };
  }
}

/* ---------------- Sidebar ---------------- */
function renderSidebar(activeTemaId) {
  const blocks = state.modules.modulos.map(mod => {
    const items = mod.temas.map(t => {
      const done = state.progress[t.id]?.leccionVista;
      const active = t.id === activeTemaId ? 'active' : '';
      const doneClass = done ? 'done' : '';
      const disabled = t.leccion ? '' : 'style="opacity:.45;pointer-events:none;"';
      return `<a class="lesson-link ${active} ${doneClass}" href="#/leccion/${t.id}" ${disabled}>
        <span class="check" aria-hidden="true"></span>${t.nombre}
      </a>`;
    }).join('');
    return `<div class="module-block">
      <div class="module-tag"><span class="dot"></span>Módulo ${mod.letra} · ${mod.reactivos} reactivos</div>
      ${items}
    </div>`;
  }).join('');

  $sidebar.innerHTML = `<h2>Contenido</h2>${blocks}`;
}

/* ---------------- Vista: inicio ---------------- */
function renderHome() {
  const totalTemas = state.modules.modulos.reduce((a, m) => a + m.temas.length, 0);
  const temasVistos = Object.values(state.progress).filter(p => p.leccionVista).length;

  const cards = state.modules.modulos.map(mod => {
    const disponibles = mod.temas.filter(t => t.leccion).length;
    const pct = Math.round((disponibles ? mod.temas.filter(t => state.progress[t.id]?.leccionVista).length / mod.temas.length : 0) * 100);
    return `<a class="module-card" href="#/modulo/${mod.id}">
      <span class="k">Módulo ${mod.letra} · ${mod.reactivos} reactivos</span>
      <h3 style="margin:0;font-size:var(--fs-lg);">${mod.nombre}</h3>
      <p style="margin:0;color:var(--ink-soft);font-size:var(--fs-sm);">${mod.subtitulo}</p>
      <div class="progress-bar"><i style="width:${pct}%"></i></div>
    </a>`;
  }).join('');

  $app.innerHTML = `
    <section class="hero diamond-field">
      <div class="eyebrow">Concurso Público 2026 · Ingreso OPLE</div>
      <h1>Guía de estudio SPEN · OPLE</h1>
      <p>Repasa los tres módulos del Examen de Conocimientos del SPEN y practica con reactivos en el mismo formato del examen real: cuestionamiento directo, completamiento, ordenamiento y relación de elementos.</p>
      <div class="stat-row">
        <div class="stat"><b>${state.modules.exam.totalReactivos}</b><span>Reactivos totales</span></div>
        <div class="stat"><b>${state.modules.exam.duracion}</b><span>Duración del examen</span></div>
        <div class="stat"><b>${temasVistos}/${totalTemas}</b><span>Temas repasados</span></div>
      </div>
    </section>
    <div class="module-grid">${cards}</div>
    <div style="margin-top:var(--sp-7);text-align:center;">
      <a class="btn btn-primary" href="#/simulacro/final">Simulacro completo · 130 reactivos · 3h30</a>
    </div>
  `;
  renderSidebar(null);
}

/* ---------------- Vista: módulo ---------------- */
function renderModulo(modId) {
  const mod = state.modules.modulos.find(m => m.id === modId);
  if (!mod) return renderNotFound();

  const rows = mod.temas.map(t => {
    const done = state.progress[t.id]?.leccionVista;
    const score = state.progress[t.id]?.mejorPuntaje;
    const disponible = !!t.leccion;
    return `<tr>
      <td>${t.nombre}</td>
      <td>${t.reactivos}</td>
      <td>${done ? '✅ Vista' : disponible ? 'Pendiente' : '<span style="color:var(--ink-soft)">Próximamente</span>'}</td>
      <td>${score ? `${score.aciertos}/${score.total}` : '—'}</td>
      <td>${disponible ? `<a class="btn btn-ghost" href="#/leccion/${t.id}">Estudiar</a>` : ''}</td>
    </tr>`;
  }).join('');

  $app.innerHTML = `
    <div class="breadcrumb"><a href="#/">Inicio</a> / Módulo ${mod.letra}</div>
    <h1>${mod.nombre}</h1>
    <p style="color:var(--ink-soft)">${mod.subtitulo} · ${mod.reactivos} reactivos en el examen real</p>
    <div class="table-wrap">
      <table class="study">
        <thead><tr><th>Tema</th><th>Reactivos</th><th>Estado</th><th>Mejor puntaje</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div style="margin-top:var(--sp-6)">
      <a class="btn btn-primary" href="#/simulacro-modulo/${mod.id}">Simulacro parcial del módulo ${mod.letra}</a>
    </div>
  `;
  renderSidebar(null);
}

function renderNotFound() {
  $app.innerHTML = `<h1>Aún no está listo 🚧</h1><p>Este contenido está en construcción — vamos avanzando módulo por módulo. <a href="#/">Volver al inicio</a>.</p>`;
}

/* ---------------- Vista: lección ---------------- */
function renderBlock(b) {
  switch (b.tipo) {
    case 'p': return `<p>${b.texto}</p>`;
    case 'lista': return `<ul>${b.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    case 'tabla': return `<div class="table-wrap"><table class="study">
        <thead><tr>${b.encabezados.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${b.filas.map(f => `<tr>${f.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>`;
    case 'callout': return `<div class="callout ${b.clase}"><span class="label">${b.etiqueta}</span>${b.texto}</div>`;
    case 'lectura': return `<div class="callout legal" style="border-left:4px solid var(--ink);">
        <span class="label" style="color:var(--ink)">${b.etiqueta || 'Texto de práctica'}</span>
        ${b.texto.split('\n\n').map(p => `<p style="margin-bottom:10px;">${p}</p>`).join('')}
      </div>`;
    case 'diagrama': {
      const d = DIAGRAMS[b.id];
      if (!d) return '';
      return `<figure class="diagram">${d.svg}<figcaption>${d.caption}</figcaption></figure>`;
    }
    default: return '';
  }
}

async function renderLeccion(temaId) {
  const found = findTema(temaId);
  if (!found || !found.tema.leccion) return renderNotFound();
  const { mod, tema } = found;

  $app.innerHTML = `<p>Cargando lección…</p>`;
  const data = await loadJSON(tema.leccion);

  const subareas = data.subareas.map(s => `
    <h2>${s.titulo} <span style="font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--ink-soft);font-weight:400;">· ${s.reactivos} reactivos</span></h2>
    ${s.bloques.map(renderBlock).join('')}
  `).join('');

  $app.innerHTML = `
    <div class="lesson-head">
      <div class="breadcrumb"><a href="#/">Inicio</a> / <a href="#/modulo/${mod.id}">Módulo ${mod.letra}</a> / ${data.nombre}</div>
      <h1>${data.nombre}</h1>
      <p style="color:var(--ink-soft)">${data.intro}</p>
    </div>
    <div class="lesson-body">${subareas}</div>
    <div style="margin-top:var(--sp-7);display:flex;gap:var(--sp-3);flex-wrap:wrap;">
      <a class="btn btn-primary" href="#/quiz/${tema.id}">Practicar este tema (${data.subareas.reduce((a,s)=>a+s.reactivos,0)} reactivos)</a>
      <a class="btn btn-ghost" href="#/modulo/${mod.id}">Volver al módulo</a>
    </div>
  `;
  renderSidebar(temaId);
  markLessonSeen(temaId);
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleReactivo(r) {
  const idx = shuffleArray(r.opciones.map((_, i) => i));
  return { ...r, opciones: idx.map(i => r.opciones[i]), correcta: idx.indexOf(r.correcta) };
}

function shuffleQuizSet(reactivos) {
  return shuffleArray(reactivos).map(shuffleReactivo);
}

/* ---------------- Vista: quiz ---------------- */
let quizState = null;

async function renderQuiz(temaId, modo = 'parcial') {
  const found = findTema(temaId);
  if (!found || !found.tema.quiz) return renderNotFound();
  const { mod, tema } = found;

  $app.innerHTML = `<p>Cargando reactivos…</p>`;
  const data = await loadJSON(tema.quiz);

  quizState = {
    temaId, modId: mod.id, nombre: data.nombre, reactivos: shuffleQuizSet(data.reactivos),
    idx: 0, respuestas: new Array(data.reactivos.length).fill(null),
    aciertos: 0, modo,
    timerInterval: null, segundosRestantes: modo === 'parcial' ? null : data.reactivos.length * 75,
  };

  renderSidebar(temaId);
  paintQuiz();
  if (quizState.segundosRestantes != null) startTimer();
}

function startTimer() {
  const tick = () => {
    quizState.segundosRestantes--;
    const el = document.getElementById('quiz-timer');
    if (el) {
      const m = Math.floor(quizState.segundosRestantes / 60);
      const s = quizState.segundosRestantes % 60;
      el.textContent = `${m}:${String(s).padStart(2, '0')}`;
      el.classList.toggle('low', quizState.segundosRestantes < 60);
    }
    if (quizState.segundosRestantes <= 0) {
      clearInterval(quizState.timerInterval);
      finishQuiz();
    }
  };
  quizState.timerInterval = setInterval(tick, 1000);
}

function letterOf(i) { return String.fromCharCode(65 + i); }

function paintQuiz() {
  const { reactivos, idx } = quizState;
  const r = reactivos[idx];
  const yaRespondida = quizState.respuestas[idx] != null;
  const seleccion = quizState.respuestas[idx];

  const lecturaHtml = r.lectura ? `
    <div class="callout" style="border-left:4px solid var(--ink);background:var(--bg-alt);margin-bottom:var(--sp-5);">
      <span class="label" style="color:var(--ink)">${r.lecturaTitulo || 'Lectura'}</span>
      ${r.lectura.split('\n\n').map(p => `<p style="margin-bottom:10px;">${p}</p>`).join('')}
    </div>` : '';

  const tablaRelacion = (r.tabla && r.tabla.derecha && r.tabla.derecha.length) ? `
    <div class="table-wrap" style="margin-bottom:var(--sp-4)">
      <table class="study"><tbody>
        <tr>${r.tabla.izquierda.map(x => `<td>${x}</td>`).join('')}</tr>
        <tr>${r.tabla.derecha.map(x => `<td>${x}</td>`).join('')}</tr>
      </tbody></table>
    </div>` : (r.tabla ? `<ol style="margin-bottom:var(--sp-4)">${r.tabla.izquierda.map(x => `<li>${x.replace(/^\d+\.\s*/, '')}</li>`).join('')}</ol>` : '');

  const opciones = r.opciones.map((op, i) => {
    let cls = '';
    if (yaRespondida) {
      if (i === r.correcta) cls = 'correct';
      else if (i === seleccion) cls = 'incorrect';
    }
    return `<button class="bubble-option ${cls}" aria-pressed="${seleccion === i}" data-i="${i}" ${yaRespondida ? 'disabled' : ''}>
      <span class="bubble-letter">${letterOf(i)}</span>
      <span class="bubble"></span>
      <span>${op}</span>
    </button>`;
  }).join('');

  const timerHtml = quizState.segundosRestantes != null
    ? `<span class="timer" id="quiz-timer">${Math.floor(quizState.segundosRestantes/60)}:${String(quizState.segundosRestantes%60).padStart(2,'0')}</span>` : '';

  const breadcrumbHref = quizState.modo === 'simulacro-modulo' ? `#/modulo/${quizState.modId}`
    : quizState.modo === 'simulacro-final' ? '#/'
    : `#/leccion/${quizState.temaId}`;

  $app.innerHTML = `
    <div class="quiz-shell">
      <div class="breadcrumb"><a href="${breadcrumbHref}">${quizState.nombre}</a></div>
      <div class="quiz-progress">
        <div class="track"><i style="width:${(idx/reactivos.length)*100}%"></i></div>
        ${timerHtml}
      </div>
      <div class="q-card">
        <div class="q-meta">Reactivo ${idx + 1} de ${reactivos.length} · Formato: ${r.formato}</div>
        ${lecturaHtml}
        <div class="q-stem">${r.base}</div>
        ${tablaRelacion}
        <div class="options">${opciones}</div>
        <div class="q-explain ${yaRespondida ? 'show' : ''}"><b>${yaRespondida ? (seleccion === r.correcta ? '✅ Correcto. ' : '❌ Incorrecto. ') : ''}</b>${yaRespondida ? r.explicacion : ''}</div>
      </div>
      <div class="quiz-nav">
        <button class="btn btn-ghost" id="btn-salir">Salir</button>
        <button class="btn btn-primary" id="btn-siguiente" ${yaRespondida ? '' : 'disabled'}>${idx === reactivos.length - 1 ? 'Ver resultados' : 'Siguiente'}</button>
      </div>
    </div>
  `;

  document.querySelectorAll('.bubble-option').forEach(btn => {
    btn.onclick = () => selectAnswer(parseInt(btn.dataset.i, 10));
  });
  document.getElementById('btn-siguiente').onclick = nextQuestion;
  document.getElementById('btn-salir').onclick = () => {
    if (quizState.timerInterval) clearInterval(quizState.timerInterval);
    location.hash = quizState.modo === 'simulacro-modulo' ? `#/modulo/${quizState.modId}`
      : quizState.modo === 'simulacro-final' ? '#/'
      : `#/leccion/${quizState.temaId}`;
  };
}

function selectAnswer(i) {
  const { idx, reactivos } = quizState;
  if (quizState.respuestas[idx] != null) return;
  quizState.respuestas[idx] = i;
  if (i === reactivos[idx].correcta) quizState.aciertos++;
  paintQuiz();
}

function nextQuestion() {
  if (quizState.idx < quizState.reactivos.length - 1) {
    quizState.idx++;
    paintQuiz();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  if (quizState.timerInterval) clearInterval(quizState.timerInterval);
  const { aciertos, reactivos, temaId } = quizState;
  const total = reactivos.length;
  const pct = Math.round((aciertos / total) * 100);
  saveQuizScore(temaId, aciertos, total);

  const revision = reactivos.map((r, i) => {
    const sel = quizState.respuestas[i];
    const ok = sel === r.correcta;
    return `<li style="margin-bottom:8px;">
      <strong>${ok ? '✅' : '❌'} Reactivo ${i + 1}</strong> — ${r.base}
      ${ok ? '' : `<br><span style="color:var(--err-600)">Tu respuesta: ${letterOf(sel)}) ${r.opciones[sel]}</span><br><span style="color:var(--ok-600)">Correcta: ${letterOf(r.correcta)}) ${r.opciones[r.correcta]}</span>`}
    </li>`;
  }).join('');

  const repetirHref = quizState.modo === 'simulacro-modulo' ? `#/simulacro-modulo/${quizState.modId}`
    : quizState.modo === 'simulacro-final' ? '#/simulacro/final'
    : `#/quiz/${temaId}`;
  const salirHref = quizState.modo === 'simulacro-modulo' ? `#/modulo/${quizState.modId}`
    : quizState.modo === 'simulacro-final' ? '#/'
    : `#/leccion/${temaId}`;

  $app.innerHTML = `
    <div class="quiz-shell" style="text-align:center;">
      <div class="result-ring">
        <div class="result-score">${pct}%</div>
      </div>
      <p>${aciertos} de ${total} reactivos correctos.</p>
      <div style="display:flex;gap:var(--sp-3);justify-content:center;margin:var(--sp-5) 0;">
        <a class="btn btn-primary" href="${repetirHref}">Repetir simulacro</a>
        <a class="btn btn-ghost" href="${salirHref}">Volver</a>
      </div>
    </div>
    <div class="quiz-shell" style="text-align:left;margin-top:var(--sp-6);">
      <h2>Revisión de reactivos</h2>
      <ol>${revision}</ol>
    </div>
  `;
}

async function renderQuizModulo(modId) {
  const mod = state.modules.modulos.find(m => m.id === modId);
  if (!mod) return renderNotFound();
  const temasConQuiz = mod.temas.filter(t => t.quiz);
  if (!temasConQuiz.length) return renderNotFound();

  $app.innerHTML = `<p>Cargando simulacro del módulo ${mod.letra}…</p>`;
  const bloques = await Promise.all(temasConQuiz.map(t => loadJSON(t.quiz)));
  const reactivos = shuffleQuizSet(bloques.flatMap(b => b.reactivos));

  quizState = {
    temaId: `modulo-${modId}`, modId: mod.id, nombre: `Simulacro parcial · Módulo ${mod.letra}`,
    reactivos, idx: 0, respuestas: new Array(reactivos.length).fill(null),
    aciertos: 0, modo: 'simulacro-modulo',
    timerInterval: null, segundosRestantes: reactivos.length * 75,
  };
  renderSidebar(null);
  paintQuiz();
  startTimer();
}

async function renderSimulacroFinal() {
  $app.innerHTML = `<p>Cargando simulacro final… esto puede tardar unos segundos.</p>`;
  const todosTemas = state.modules.modulos.flatMap(m => m.temas.filter(t => t.quiz));
  const bancos = await Promise.all(todosTemas.map(t => loadJSON(t.quiz)));

  // Se conserva el orden oficial de los temas (A · Comunicación → B · Matemáticas → C · Electoral).
  // Dentro de cada tema sí se aleatoriza qué reactivos se toman del banco, su orden y sus opciones.
  const reactivos = [];
  bancos.forEach((banco, i) => {
    const oficial = todosTemas[i].reactivos;
    const pool = shuffleArray(banco.reactivos).slice(0, Math.min(oficial, banco.reactivos.length));
    reactivos.push(...pool.map(shuffleReactivo));
  });

  quizState = {
    temaId: 'simulacro-final', modId: null, nombre: 'Simulacro final · Examen completo',
    reactivos, idx: 0, respuestas: new Array(reactivos.length).fill(null),
    aciertos: 0, modo: 'simulacro-final',
    timerInterval: null, segundosRestantes: 3 * 3600 + 30 * 60, // 3h30, la duración oficial del examen
  };
  renderSidebar(null);
  paintQuiz();
  startTimer();
}

/* ---------------- Router ---------------- */
function parseRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/').filter(Boolean);
  return parts;
}

function renderRoute() {
  const parts = parseRoute();
  if (parts.length === 0) return renderHome();
  const [view, id] = parts;
  if (view === 'modulo') return renderModulo(id);
  if (view === 'leccion') return renderLeccion(id);
  if (view === 'quiz') return renderQuiz(id, 'parcial');
  if (view === 'simulacro-modulo') return renderQuizModulo(id);
  if (view === 'simulacro' && id === 'final') return renderSimulacroFinal();
  return renderNotFound();
}

window.addEventListener('hashchange', renderRoute);

/* ---------------- Arranque ---------------- */
(async function init() {
  state.modules = await loadJSON('data/modules.json');
  state.progress = loadLocalProgress();
  initFirebase();
  renderRoute();
})();
