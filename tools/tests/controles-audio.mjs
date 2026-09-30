import { openCourse, report, requireUrl } from './_shared.mjs';
const url = requireUrl();
const failures = [];
const { browser, page, errors } = await openCourse(url);

// 1. Volumen: abrir el panel, mover el slider, verificar % + persistencia.
await page.click('#d-sound');
await page.waitForTimeout(200);
const popVisible1 = await page.evaluate(() => {
  const pop = document.querySelector('[data-audio-ctl="sonido"] .d-audio-pop');
  return getComputedStyle(pop).opacity;
});
if (popVisible1 !== '1') failures.push(`el panel de volumen debería quedar visible tras el clic, opacity=${popVisible1}`);

await page.evaluate(() => {
  const r = document.getElementById('d-vol-range');
  r.value = '40';
  r.dispatchEvent(new Event('input', { bubbles: true }));
});
await page.waitForTimeout(150);
const volState = await page.evaluate(() => ({
  pct: document.getElementById('d-vol-pct').textContent,
  stored: localStorage.getItem('coto-diapos-volume')
}));
if (volState.pct !== '40%') failures.push(`esperaba 40% en el label, dio ${volState.pct}`);
if (Math.abs(parseFloat(volState.stored) - 0.4) > 0.01) failures.push(`esperaba volumen 0.4 persistido, dio ${volState.stored}`);

// 2. Mute button dentro del panel sincroniza con el botón principal.
await page.click('#d-vol-mute-btn');
await page.waitForTimeout(150);
const muteState = await page.evaluate(() => ({
  headerMuted: document.getElementById('d-sound').classList.contains('is-muted'),
  popMuted: document.getElementById('d-vol-mute-btn').classList.contains('is-muted')
}));
if (!muteState.headerMuted || !muteState.popMuted) failures.push(`mutear desde el panel debería reflejarse en ambos botones: ${JSON.stringify(muteState)}`);
await page.click('#d-vol-mute-btn'); // des-mutea
await page.waitForTimeout(150);

// 3. Secuencia de eventos narracionprogreso: sin backend de audio real
//    en este sandbox, speechSynthesis puede resolver los fragmentos casi
//    instantáneo — en vez de "esperar y sacar una foto", se capturan
//    TODOS los eventos que dispara una narración completa y se valida
//    la secuencia entera (0, 1, 2, terminado), que es lo que de verdad
//    importa: el orden y el conteo, no el timing real.
const secuencia = await page.evaluate(() => {
  return new Promise((resolve) => {
    var eventos = [];
    function onProg(e) {
      eventos.push(e.detail ? { index: e.detail.index, total: e.detail.total, terminado: e.detail.terminado } : null);
      if (e.detail && e.detail.terminado) {
        document.removeEventListener('narracionprogreso', onProg);
        resolve(eventos);
      }
    }
    document.addEventListener('narracionprogreso', onProg);
    window.Narrador.setNarrating(true);
    var s1 = 'Primera frase de prueba, bastante larga para asegurarnos de que ocupe una buena parte del límite de caracteres por fragmento que usa el narrador.';
    var s2 = 'Segunda frase de prueba, también larga, para que el fragmentado la separe de la primera y de la tercera en un trozo aparte.';
    var s3 = 'Tercera y última frase de prueba, para completar el ejemplo con un total de tres fragmentos distintos.';
    window.Narrador.speak(s1 + ' ' + s2 + ' ' + s3, 'other');
    setTimeout(function () { resolve(eventos); }, 3000); // red de seguridad
  });
});
const indices = secuencia.filter(e => e).map(e => e.index + (e.terminado ? ':fin' : ''));
if (secuencia.length < 4 || secuencia[0].total !== 3) {
  failures.push(`esperaba una secuencia de progreso con total=3, dio: ${JSON.stringify(secuencia)}`);
}
if (!secuencia.some(e => e && e.index === 0 && !e.terminado)) failures.push(`nunca se vio el índice 0 (primera frase) en la secuencia: ${JSON.stringify(indices)}`);
if (!secuencia[secuencia.length - 1] || !secuencia[secuencia.length - 1].terminado) {
  failures.push(`la secuencia debería terminar con terminado:true, dio: ${JSON.stringify(indices)}`);
}

// 4. seek(0) sobre la narración YA terminada: "Repetir" tiene que poder
//    volver a arrancarla igual (esto SÍ se puede comprobar sin carrera:
//    el estado post-fin es estable, no una foto de un instante fugaz).
await page.waitForTimeout(200);
const antesDeRepetir = await page.evaluate(() => window.Narrador.progreso());
if (!antesDeRepetir || !antesDeRepetir.terminado) failures.push(`esperaba la narración ya terminada antes de repetir: ${JSON.stringify(antesDeRepetir)}`);
const replayDisabled = await page.evaluate(() => document.getElementById('d-narr-replay').disabled);
if (replayDisabled) failures.push('el botón "Repetir" debería estar habilitado después de que la narración terminó');

const repetido = await page.evaluate(() => {
  window.Narrador.repeat();
  return window.Narrador.progreso();
});
if (!repetido || repetido.index !== 0 || repetido.terminado) {
  failures.push(`"Repetir" debería volver a arrancar desde el índice 0, dio: ${JSON.stringify(repetido)}`);
}

// 4b. seek(1) a un índice intermedio (no 0, no el último) — el índice
//    se fija SINCRÓNICAMENTE antes de llamar a synth.speak(), así que
//    se puede leer en el mismo evaluate() sin carrera de timing.
const seekMedio = await page.evaluate(() => {
  window.Narrador.seek(1);
  return window.Narrador.progreso();
});
if (!seekMedio || seekMedio.index !== 1 || seekMedio.terminado) {
  failures.push(`seek(1) debería dejar el índice en 1, sin terminar, dio: ${JSON.stringify(seekMedio)}`);
}

/* 5. El panel sigue a si HAY algo que escuchar.
   ⚠️ Este paso decía "recién cargada la página el panel arranca
   deshabilitado" y dejó de ser cierto en kit-base v1.9.81: desde
   entonces el kit repara la locución de la PRIMERA diapositiva al
   primer gesto real del alumno (§7.29 K3), y `openCourse()` empieza
   con un Escape — que es un gesto. Medido en un curso recién
   generado: antes de tocar nada `progreso()` da null y el panel está
   deshabilitado; después del Escape hay narración y se habilita.

   O sea que el estado absoluto ya no dice nada. Lo que el panel
   promete —y lo que hay que cuidar— es la RELACIÓN: deshabilitado si
   y solo si no hay nada que escuchar. Se mide en los dos estados
   (kit-base v1.9.86). */
await browser.close();
const { browser: b2, page: p2 } = await openCourse(url);
const rel = await p2.evaluate(() => {
  const range = document.getElementById('d-narr-range');
  const replay = document.getElementById('d-narr-replay');
  const lee = () => {
    const p = window.Narrador.progreso();
    return { hay: !!(p && p.total), dis: range.disabled, disR: replay.disabled };
  };
  const conNarracion = lee();
  window.Narrador.cancel();
  window.Narrador.setNarrating(false);
  return new Promise((r) => setTimeout(() => r({ conNarracion, sinNarracion: lee() }), 350));
});
[['conNarracion', rel.conNarracion], ['sinNarracion', rel.sinNarracion]].forEach(([q, e]) => {
  if (e.dis === e.hay || e.disR === e.hay) {
    failures.push(`${q}: hay ${e.hay ? 'narración' : 'nada que escuchar'} pero el panel quedó ` +
      `${e.dis ? 'deshabilitado' : 'habilitado'} (replay: ${e.disR ? 'off' : 'on'}) — ` +
      'el panel tiene que estar deshabilitado si y solo si no hay nada que escuchar');
  }
});
await b2.close();

/* ---- Un clic hace UNA cosa ----  kit-base v1.9.91
   ⚠️ Esto existe por una REGRESIÓN REAL, y por eso vale la pena el
   test: al pasar los popovers a "solo por clic" (v1.9.89), los botones
   de Sonido y Locución quedaron haciendo dos cosas con el mismo gesto —
   abrir su panel y, de paso, apagar el audio. Reporte del cliente:
   *"para abrirlo tengo que hacer clic pero al abrirlo también lo
   desactiva"*.

   Nadie lo vio venir porque antes el panel abría al pasar el mouse, así
   que el clic era solo del toggle: el cambio de apertura destapó un
   conflicto que ya estaba latente.

   Se mide sobre Locución porque arranca ENCENDIDA, así que apagarla por
   error se nota; el de Sonido arranca apagado y el mismo bug pasaría
   desapercibido. */
const b3 = await openCourse(url);
{
  const p3 = b3.page;
  const estado = () => p3.evaluate(() => ({
    panel: document.querySelector('[data-audio-ctl="locucion"]').classList.contains('is-open'),
    narrando: window.Narrador.isNarrating(),
    guardado: localStorage.getItem('coto-diapos-narrate-v2')
  }));
  const inicial = await estado();
  if (!inicial.narrando) {
    failures.push('la locución debería arrancar encendida para poder medir este caso');
  } else {
    await p3.click('#d-narrate');
    await p3.waitForTimeout(250);
    const uno = await estado();
    if (!uno.panel) failures.push('el primer clic en Locución debería ABRIR su panel');
    if (!uno.narrando) {
      failures.push('el primer clic en Locución la APAGÓ además de abrir el panel: ' +
        'un clic tiene que hacer una sola cosa');
    }
    if (uno.guardado !== null) {
      failures.push(`el primer clic ya persistió una preferencia (${uno.guardado}): ` +
        'el alumno se queda con el curso mudo guardado en el dispositivo');
    }
    await p3.click('#d-narrate');
    await p3.waitForTimeout(250);
    const dos = await estado();
    if (dos.narrando) failures.push('el segundo clic en Locución debería apagarla');
  }
  await b3.browser.close();
}

if (errors.length) failures.push('errores de consola: ' + errors.join(' | '));
report('controles-audio', failures);
