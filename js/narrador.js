/* ============================================================
   narrador.js · Wrapper genérico de Web Speech API (narración por voz)
   kit-base v1.7 · Área Aprendizaje (COTO) — genérico, sin contenido
   de curso. Copiar tal cual a cada curso nuevo, sin editar.
   ------------------------------------------------------------
   Extraído de curso.js del curso base ("Surtido sin venta") — ahí
   vivía mezclado con el contenido del curso por historia, pero no
   leía nada específico (ningún ID de diapositiva, ningún texto propio):
   selección de voz, velocidad, on/off persistente y el mecanismo de
   corrección fonética son 100% reutilizables. Ver CLAUDE.md §1 (regla
   de "si no lee nada del curso, va en el motor genérico") y §6.5
   (tabla fonética oficial del Manual de Contenido, ya cargada acá
   como diccionario BASE).

   Responsabilidad: hablar texto en voz alta con la voz/velocidad
   preferida, con corrección fonética de siglas/términos técnicos, y
   EXTRAER de un contenedor el texto real accesible que corresponde
   narrar (`textOf`, sumado en v1.7 — antes cada curso reescribía su
   propio `slideText()` y volvía a tropezar con los mismos 4 bugs, ver
   los comentarios de la función).
   NO decide CUÁNDO narrar ni QUÉ contenedor pasarle — eso sigue siendo
   trabajo de curso.js / coto-ui.js.

   API pública (window.Narrador):
     - speak(text, kind)      habla `text` (cancela lo anterior en curso)
     - textOf(container)      texto real accesible de una diapo/panel/pop-up
     - addTextSel(sel)        suma selectores propios del curso a textOf
     - speechify(text)        aplica solo la corrección fonética, sin hablar
     - addFixes(pairs)        suma reemplazos fonéticos propios del curso
                               (pairs: [[RegExp, 'reemplazo'], ...])
     - cancel()                corta la narración actual
     - isNarrating()           true si el narrador está activado (toggle)
     - setNarrating(bool)      prende/apaga, persiste en localStorage
     - pickVoice()             expuesto para el selector manual de voz
     - setManualVoice(v)       fija una voz elegida a mano, persiste
     - setNarrateTitles(bool)  opt-in por curso: narrar [data-slide-title]
                               (por default NO se narra, ver textOf())
     - seek(i)                 salta a la frase `i` de la narración EN
                               CURSO (mismo fragmentado de chunkText —
                               es la granularidad real posible, ver
                               CLAUDE.md §6.55: Web Speech API no da
                               precisión de palabra confiable)
     - repeat()                vuelve a narrar desde la frase 0 lo
                               último dicho (funciona aunque ya haya
                               terminado, no solo a mitad de camino)
     - progreso()              { index, total, terminado } de la
                               narración actual, o null si no hay
                               ninguna — para pintar el panel de
                               "Locución" (coto-player.js)
   Eventos: dispara `slidenarrationend` en `document` cuando termina de
   hablar un texto marcado `kind:'slide'` (lo escucha "Reproducir todo").
   Dispara `narracionprogreso` en `document` con `detail` = el mismo
   objeto de `progreso()` (o `null`) cada vez que arranca una frase
   nueva, termina, o se corta desde afuera — lo escucha el panel de
   "Locución" para pintar la línea de tiempo en vivo.
   ============================================================ */
(function (global) {
  'use strict';

  /* `-v2` a propósito, y es una migración de UNA sola vez.
     ⚠️ BUG REAL: hasta v1.9.90, un clic en el botón "Locución" abría su
     panel Y apagaba la locución con el mismo gesto (ver
     `panelYaAbierto` en coto-player.js). O sea que cualquiera que
     hubiera abierto ese panel una vez se quedó con la locución apagada
     GUARDADA EN EL DISPOSITIVO, sin haberlo pedido — y el curso le
     arranca mudo, con el micrófono tachado, en cada visita.

     Arreglar el clic no alcanza: la preferencia mal guardada sigue ahí.
     Cambiar la clave la descarta una sola vez, así que todos vuelven al
     default (locución encendida) y de ahí en más solo se apaga
     deliberadamente, con los dos clics.

     Es la ÚNICA preferencia que se descarta: voz y velocidad conservan
     su clave, porque esas nadie las guardó por accidente. */
  var LS_NARRATE = 'coto-diapos-narrate-v2';
  var LS_VOICE = 'coto-diapos-voice';
  var LS_RATE = 'coto-diapos-rate';

  /* "Sonido" pasa a gobernar también el volumen de la locución (kit-base
     v1.9.40) — mismo criterio que ya fijó §6.44 punto 9 para el mute
     ("Sonido mutea TODO, video incluido"), completado acá para el nivel.
     Una segunda barra propia de Locución sería un segundo control para
     lo mismo: se desincronizan entre sí y obligan a bajar el volumen dos
     veces. Los dos helpers son copia local del mismo patrón que ya usan
     coto-player.js/coto-media.js/coto-ui.js/fx.js — cada archivo del kit
     es copy-paste autocontenido, no un módulo compartido (criterio ya
     fijado, ver comentario de `volumeLevel()` en coto-ui.js). */
  function volumeLevel() {
    try {
      var v = parseFloat(global.localStorage.getItem('coto-diapos-volume'));
      return isNaN(v) ? 1 : Math.min(1, Math.max(0, v));
    } catch (e) { return 1; }
  }
  function muted() {
    try { return global.localStorage.getItem('coto-diapos-mute') === '1'; } catch (e) { return false; }
  }
  function volumenEfectivo() { return muted() ? 0 : volumeLevel(); }

  var narrating = true;
  try { narrating = global.localStorage.getItem(LS_NARRATE) !== '0'; } catch (e) {}
  var voiceCache = null;
  var manualVoiceKey = null;
  try { manualVoiceKey = global.localStorage.getItem(LS_VOICE) || null; } catch (e) {}
  // Velocidad de la locución, y desde v1.9.82 la ÚNICA: el alumno la
  // mueve con el control de velocidad (panel de Locución o Config).
  // Hasta v1.9.81 era un MULTIPLICADOR sobre un ajuste por voz
  // (1.22x/1.15x/1.0x según isHighQualityVoice) que se sacó — ver el
  // comentario largo en speak().
  //
  // El DEFAULT pasa de 1.0 a 1.15 (kit-base v1.9.88, pedido del
  // cliente: *"aumentar levemente la velocidad… que el cambio sea
  // sutil, sin que suene acelerada ni pierda claridad"*). 1.0 es la
  // velocidad natural de la voz, que en las voces de red en español se
  // percibe lenta para leer un texto que el alumno además está VIENDO.
  // 1.15 es el punto donde deja de arrastrar sin empezar a comerse
  // sílabas — y es el mismo valor que el kit usaba de hecho hasta
  // v1.9.81 para las voces de calidad, así que no es un número
  // inventado.
  //
  // ⚠️ Es un DEFAULT, no un piso: quien ya movió el control tiene su
  // preferencia guardada en `LS_RATE` y esto no se la pisa.
  var RATE_DEFAULT = 1.15;
  var rateFactor = RATE_DEFAULT;
  /* `rateElegido` — ¿esto lo eligió el ALUMNO o es el default?
     (kit-base v1.9.95). `getRateFactor()` devuelve un número siempre, y
     `1` significa lo mismo si el alumno movió el control hasta 1x que si
     nunca lo tocó. Un curso que quiera poner otro default —pedido real:
     *"en iPad que la locución arranque a 0.85x"*— no tenía forma de
     hacerlo sin arriesgarse a pisar una preferencia guardada.

     La única salida era leer `localStorage.getItem('coto-diapos-rate')`
     desde el curso, que es exactamente el acoplamiento a un detalle
     interno del kit que §0.1 pide evitar: si el kit renombra la clave, el
     curso se rompe en silencio. Ahora se pregunta con
     `Narrador.hayRateElegido()`. */
  var rateElegido = false;
  try {
    var savedRate = parseFloat(global.localStorage.getItem(LS_RATE));
    if (!isNaN(savedRate)) { rateFactor = Math.min(1.4, Math.max(0.75, savedRate)); rateElegido = true; }
  } catch (e) {}
  function setRateFactor(f) {
    rateFactor = Math.min(1.4, Math.max(0.75, Number(f) || RATE_DEFAULT));
    rateElegido = true;   // lo tocó alguien: de acá en más manda esto
    try { global.localStorage.setItem(LS_RATE, String(rateFactor)); } catch (e) {}
  }
  function getRateFactor() { return rateFactor; }
  function hayRateElegido() { return rateElegido; }
  /* Poner un DEFAULT sin pisar al alumno, que es el caso de uso real:
     un curso llama a esto y el kit decide. Devuelve si lo aplicó. */
  function setRateDefault(f) {
    if (rateElegido) return false;
    var antes = rateElegido;
    setRateFactor(f);
    rateElegido = antes;   // sigue siendo un default, no una elección
    return true;
  }
  /* Para que ningún control ni ningún test vuelva a hardcodear el
     número: los tres que lo hacían fallaron todos juntos al cambiarlo. */
  function getRateDefault() { return RATE_DEFAULT; }
  function voiceKey(v) { return v.name + '|' + v.lang; }

  // [data-slide-title] (el <h2 class="sr-only"> de cada diapositiva) NO
  // se narra por default — decisión histórica de "Surtido sin venta"
  // (CLAUDE.md §5): sonaba redundante narrar el título Y el cuerpo. Pero
  // ese título casi siempre es el MISMO texto que la píldora horneada en
  // el arte (ej. "Alteración", "Temperatura alimentaria") — un curso
  // puede querer que SÍ se lea, para anunciar el tema antes del cuerpo.
  // Opt-in por curso, no default nuevo: `Narrador.setNarrateTitles(true)`
  // en el propio curso.js, sin tocar el comportamiento de ningún otro.
  var narrarTitulos = false;
  function setNarrateTitles(v) { narrarTitulos = !!v; }

  // El cliente probó varias voces (selector manual, ver initVoicePicker en
  // curso.js) y eligió "Google español de Estados Unidos" (es-US) como la
  // que más le gustó — se prioriza esa por defecto para todos los alumnos.
  // Si el navegador no la tiene, se cae en la cadena de siempre: es-AR
  // primero (más cercana a es-US que la de España), después variantes
  // latinoamericanas, y por último cualquier es-*. Dentro de cada nivel,
  // si hay más de una voz, prefiere una que suene a motor "neural"/online
  // (mejor calidad) sobre la clásica del sistema. Todo esto es "mejor
  // esfuerzo": depende de qué voces tenga el dispositivo del alumno — por
  // eso también existe el selector manual, que le gana siempre a esta
  // elección automática.
  // "Calidad conocida" = la voz probada a mano por el cliente en un
  // curso real (Google es-US), o cualquier voz que el navegador/SO
  // marca como motor neural/online (suenan naturales a velocidad
  // normal-alta). Todo lo demás es una voz de RESPALDO nunca probada a
  // mano.
  // OJO al leer historia: esta función NACIÓ para decidir la VELOCIDAD
  // (§6.7, bug de "Surtido sin venta": con rate fijo en 1.15, un
  // dispositivo sin la voz preferida caía en una de respaldo que a esa
  // velocidad sonaba atropellada). Desde v1.9.82 ya NO decide
  // velocidad —se narra a 1.0x siempre, ver speak()— y queda solo para
  // DESEMPATAR dentro de un nivel de `pickVoice()`: entre dos voces
  // es-AR, gana la mejorada.
  function isHighQualityVoice(v) {
    if (!v) return false;
    if (/^es-US/i.test(v.lang) && /google/i.test(v.name)) return true;
    if (/natural|neural|online|wavenet|premium|plus|multilingual|enhanced/i.test(v.name)) return true;
    /* iOS/iPadOS NO pone la calidad en el NOMBRE: "Diego" se llama
       igual sea la voz compacta de fábrica o la mejorada que el alumno
       bajó desde Ajustes. La diferencia solo está en el `voiceURI`
       (`com.apple.voice.enhanced.es-AR.Diego`, `…premium…`, las de
       Siri). Sin mirar ahí, en un iPad TODA voz caía como "respaldo"
       (kit-base v1.9.82). */
    return /enhanced|premium|siri|neural/i.test(v.voiceURI || '');
  }
  /* `esTablet()` vivía acá y se fue con el atajo de tablet de
     `pickVoice()` (v1.9.82, ver el comentario ahí). Era su único uso:
     dejarla habría sido código muerto que el próximo que lea el archivo
     tiene que descartar a mano. */
  function pickVoice() {
    if (!('speechSynthesis' in global)) return null;
    var voices = global.speechSynthesis.getVoices();
    if (!voices.length) return null;
    if (manualVoiceKey) {
      var manual = voices.find(function (v) { return voiceKey(v) === manualVoiceKey; });
      if (manual) return manual;
    }
    if (voiceCache) return voiceCache;
    /* ⚠️ ACÁ HABÍA UN ATAJO PARA TABLET Y SE SACÓ A PROPÓSITO
       (kit-base v1.9.82). Decía: en tablet, preferir "Paulina" (es-MX)
       y si no está, "Mónica" (es-ES) — pedido real del cliente probado
       en iPad ("Prevención cardiovascular"). Corría ANTES que todo, así
       que en tablet la cadena de abajo NO se evaluaba nunca.

       Efecto no buscado, reportado por el mismo cliente en la vuelta de
       iPad de "Seguridad alimentaria": la locución jamás llegaba a una
       voz argentina AUNQUE el dispositivo la tenga (iOS trae es-AR), y
       en un iPad sin Paulina caía en Mónica, que es de ESPAÑA —
       exactamente lo contrario del pedido de "la voz más parecida al
       argentino o al latino".

       Los dos pedidos se contradicen menos de lo que parece: Paulina es
       es-MX, o sea que ya está dentro de la familia latina. Así que en
       vez de un atajo que se saltea la cadena, Paulina pasa a ser la
       preferida DENTRO de su nivel (es-MX) y España queda última. En un
       iPad con voz es-AR ahora suena esa; en uno sin ella, Paulina
       igual que antes; Mónica solo si no hay ninguna latina, que sigue
       siendo mejor que el silencio. */
    /* Preferencia general:
       pedido explícito del cliente — español argentino/latinoamericano
       ANTES que el de Estados Unidos. "Google español de Estados
       Unidos" (es-US) sigue siendo una voz real y probada por el
       cliente (CLAUDE.md §6.7), pero pasa a ser el RESPALDO: si el
       dispositivo tiene una voz es-AR o es-419 razonable, esa gana; si
       no, se cae en la de siempre — nunca en silencio, nunca en una
       voz peor de lo que ya había.
       No se hardcodea ningún nombre de voz por navegador/SO a
       propósito: el catálogo de voces depende del paquete de idioma
       instalado en CADA dispositivo, no del navegador — un nombre que
       "hoy" existe en una versión de Windows/Android puede no estar en
       otra. Se busca por código de idioma (estable), con la MISMA
       detección de "calidad" (`isHighQualityVoice`) que ya usa el
       resto de la cadena, así que se adapta sola a lo que el
       dispositivo real tenga. */
    /* El ORDEN de los niveles no cambió: es el que el cliente pidió y
       probó. Lo que se agrega (v1.9.82) es `prefer`, un nombre de voz
       que gana DENTRO de su propio nivel — así una preferencia concreta
       no puede volver a saltearse la cadena entera como hacía el atajo
       de tablet. En el nivel es-US "Google" sigue siendo la marca que
       el cliente probó y eligió a propósito.

       ⚠️ `es-ES` sale del comodín y pasa a ser el ÚLTIMO nivel. Antes
       el comodín `/^es/i` lo agarraba junto con todo lo demás, así que
       una voz de España podía ganarle a una de Colombia o Perú solo por
       estar primera en la lista del dispositivo. Con el criterio "lo
       más parecido al argentino", peninsular es el último recurso:
       mejor que el silencio, peor que cualquier latina. */
    var tiers = [
      { re: /^es-AR/i },
      { re: /^es-419/i },
      { re: /^es-US/i, prefer: /google/i },
      { re: /^es-UY/i },
      { re: /^es-CL/i },
      { re: /^es-MX/i, prefer: /paulina/i },
      { re: /^es(?!-ES)/i },
      { re: /^es-ES/i, prefer: /m[oó]nica/i }
    ];
    for (var i = 0; i < tiers.length; i++) {
      var tier = tiers[i];
      var matches = voices.filter(function (v) { return tier.re.test(v.lang); });
      if (!matches.length) continue;
      voiceCache = (tier.prefer && matches.find(function (v) { return tier.prefer.test(v.name); })) ||
        matches.find(isHighQualityVoice) || matches[0];
      return voiceCache;
    }
    return null;
  }
  if ('speechSynthesis' in global) {
    // Chrome (entre otros) carga la lista de voces de forma asíncrona: en
    // la primera llamada getVoices() puede devolver vacío. Se limpia el
    // cache automático cuando avisa que ya están listas.
    global.speechSynthesis.addEventListener('voiceschanged', function () { voiceCache = null; });
  }

  // Web Speech API no soporta SSML/fonemas: la única forma de corregir
  // cómo suena una sigla/término es reescribirlo en el texto que se manda
  // a hablar (nunca se toca el alt/texto visible, solo esta copia "para
  // el oído"). Base = tabla oficial del Manual de Contenido (ver
  // CLAUDE.md §6.5) — cada curso suma sus propios términos con
  // `Narrador.addFixes([[/\bpalabra\b/gi, 'como se pronuncia'], ...])`.
  var SPEECH_FIXES = [
    [/\bticket\b/gi, 'tíquet'],
    [/\benter\b/gi, 'énter'],
    [/\bdni\b/gi, 'deneí'],
    [/\bmultistore\b/gi, 'múltiestór'],
    [/\bok\b/gi, 'okéy'],
    [/\bvoucher\b/gi, 'váucher'],
    [/\bcrm\b/gi, 'ce erre eme'],
    [/\bpower apps\b/gi, 'pábuer áps'],
    [/\bcall center\b/gi, 'col sénter'],
    [/\bonline\b/gi, 'onláin'],
    [/\bsts\b/gi, 'ese te ese'],
    [/\bweb\b/gi, 'güeb'],
    /* "pe ele ú", no "pe ele uh" (kit-base v1.9.71, §7.17): la "uh"
       sale como una duda, no como el nombre de la letra. Lo venía
       pisando a mano cada curso de retail que usa PLU — o sea, la
       corrección estaba en el lugar equivocado. */
    [/\bplu\b/gi, 'pe ele ú'],
    /* Rutas de menú tipo "GESCOM > Consulta de Sets": al oído el ">"
       tiene que ser una pausa, no un símbolo leído ni un silencio. */
    [/\s*>\s*/g, ', '],
    [/\bcashback\b/gi, 'cáshback'],
    [/\bpin ?pad\b/gi, 'pínpad'],
    [/\bcontactless\b/gi, 'cóntact les'],
    [/\bnfc\b/gi, 'ene efe ce'],
    /* Códigos numéricos leídos como CANTIDADES — en un curso sobre
       códigos es el peor error posible: "607054" salía "seiscientos
       siete mil cincuenta y cuatro", que no le sirve a nadie que tenga
       que tipear ese número. Se separan en dígitos por largo exacto,
       de 5 a 8, que es el rango de los códigos que se leen en voz alta
       (artículo, sucursal, PLU).
       ARRANCA EN 5 Y NO EN 4 por un motivo concreto: un AÑO son cuatro
       dígitos con `\b` de los dos lados, así que una regla de 4 haría
       que "en 2026" se narre "en 2 0 2 6". Se probó y pasaba. De 5 en
       adelante no hay cantidad de uso corriente en estos cursos que
       colisione; un precio o un porcentaje quedan por debajo, y un
       número dentro de una palabra no matchea por los `\b`.
       Si un curso igual tiene un número de 5+ que ES una cantidad, lo
       resuelve con `addFixes()`, que se inserta ANTES que esta tabla.
       Van al FINAL de la tabla a propósito: cualquier `addFixes()` del
       curso se inserta antes y puede pisar un código puntual. */
    [/\b(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)\b/g, '$1 $2 $3 $4 $5 $6 $7 $8'],
    [/\b(\d)(\d)(\d)(\d)(\d)(\d)(\d)\b/g, '$1 $2 $3 $4 $5 $6 $7'],
    [/\b(\d)(\d)(\d)(\d)(\d)(\d)\b/g, '$1 $2 $3 $4 $5 $6'],
    [/\b(\d)(\d)(\d)(\d)(\d)\b/g, '$1 $2 $3 $4 $5']
  ];
  function addFixes(pairs) {
    if (!pairs || !pairs.length) return;
    // se insertan ANTES de la base: un término propio del curso puede
    // necesitar pisar/afinar una entrada genérica (ej. un curso que sí
    // quiera decir "GESCOM" de una forma puntual), y el primer match de
    // `speechify` gana porque cada regla ya reemplazó el texto para
    // cuando la siguiente corre sobre lo que quedó.
    SPEECH_FIXES = pairs.concat(SPEECH_FIXES);
  }
  // Los emoji NUNCA se narran (pedido real de un cliente, "Prevención
  // cardiovascular"): sin esto, Web Speech API lee "🏆" como "trofeo" o
  // el nombre Unicode completo según la voz/SO — ruido que no aporta
  // nada al oído aunque se vea bien en pantalla. \p{Extended_Pictographic}
  // cubre la enorme mayoría (incluye el emoji base + su selector de
  // variación FE0F + secuencias ZWJ tipo 👨‍👩‍👧); los indicadores
  // regionales (banderas, pares de 2 letras U+1F1E6-1F1FF) van aparte
  // porque no son "pictográficos" para Unicode. Nunca toca el texto/alt
  // visible, solo la copia que se narra (mismo criterio que SPEECH_FIXES).
  function stripEmojis(text) {
    return text
      .replace(/\p{Extended_Pictographic}(️)?(‍\p{Extended_Pictographic}(️)?)*/gu, '')
      .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  }
  function speechify(text) {
    text = stripEmojis(text);
    SPEECH_FIXES.forEach(function (pair) { text = text.replace(pair[0], pair[1]); });
    return text;
  }

  // Contador de "generación": cada cancel() lo incrementa, así cualquier
  // fragmento que todavía estuviera encolado sabe que ya no corresponde
  // hablarlo. Reemplaza al flag _cancelled de una sola utterance, que no
  // alcanzaba desde que una narración puede ser una CADENA de fragmentos.
  /* ---- Cuánto DURA la locución, en segundos ----  kit-base v1.9.92
     Pedido del cliente: *"me parece que no está funcionando la barra
     para adelantar la locución; además estaría bueno que se marque en
     segundos"*.

     Funcionaba — pero casi nunca se notaba, que para el alumno es lo
     mismo que estar rota. El recorrido eran `total - 1` FRAGMENTOS, y
     medido sobre un curso real de 22 diapositivas con locución: 5 de
     ellas quedaban con 0 o 1 posición de recorrido (el pulgar no se
     puede mover, o tiene dos posiciones y nada en el medio), y la
     mediana son 3 fragmentos, o sea DOS pasos para toda la narración.

     ⚠️ REGLA: una barra cuyo recorrido tiene una o dos posiciones no se
     lee como "esta locución es corta", se lee como "esto está roto". Si
     el recorrido depende del contenido, hay que darle una unidad que
     siempre tenga resolución.

     ⚠️ Y el límite del que hay que partir: **Web Speech API no dice
     cuánto dura un texto**. No hay duración total, ni posición en
     segundos, ni forma de preguntarla antes de empezar. Lo único que da
     es el evento de fin de cada fragmento. Así que los segundos se
     ESTIMAN y se corrigen solos: la duración de un fragmento es
     `caracteres / (c-por-segundo × velocidad)`, y cada fragmento que
     termina se mide contra lo que tardó de verdad para afinar la
     constante. La afinación se guarda en el dispositivo, así que a
     partir de la segunda diapositiva ya está calibrada contra la voz
     real del alumno.

     13,5 c/s a velocidad 1 es el punto de partida para castellano,
     medido sobre las voces de red que el kit prioriza. La media móvil
     70/30 evita que un fragmento raro mueva la estimación de golpe. */
  var CPS_BASE = 13.5;
  var LS_CPS = 'coto-diapos-cps';
  var cpsCal = null;
  try {
    var cpsGuardado = parseFloat(global.localStorage.getItem(LS_CPS));
    if (cpsGuardado > 4 && cpsGuardado < 40) cpsCal = cpsGuardado;
  } catch (e) {}
  function cpsActual() { return cpsCal || CPS_BASE; }
  function calibrarCps(chars, seg, rate) {
    if (!(seg > 0.45) || !chars) return;      // muy corto: es ruido de medición
    var real = chars / (seg * (rate || 1));
    if (!(real > 4 && real < 40)) return;     // fuera de rango: no es creíble
    cpsCal = cpsCal ? (cpsCal * 0.7 + real * 0.3) : real;
    try { global.localStorage.setItem(LS_CPS, String(Math.round(cpsCal * 100) / 100)); } catch (e) {}
  }
  function segActual() {
    if (!estadoActual || !estadoActual.acum) return 0;
    var i = Math.min(estadoActual.index, estadoActual.durs.length - 1);
    if (estadoActual.terminado) return estadoActual.segTotal;
    var base = estadoActual.acum[i] || 0;
    var corrido = estadoActual.t0 ? (Date.now() - estadoActual.t0) / 1000 : 0;
    return Math.min(estadoActual.segTotal, base + Math.min(corrido, estadoActual.durs[i] || 0));
  }

  var speakGen = 0;
  var entregadas = 0;   // locuciones realmente entregadas al motor
  /* ---- `cancel()` tiene que INSISTIR (kit-base v1.9.98) ----
     REPORTE REAL: *"apreté el glosario y saltó esa locución… cerré el
     glosario y quedó abierta la locución, incluso hasta cuando cerré el
     curso"*.

     `speechSynthesis.cancel()` no es confiable, y este kit ya lo tenía
     escrito en otra parte: el comentario de `initNarrateOnSlideChange`
     (coto-player.js) dice que Chrome "no siempre corta en el acto la
     frase que ya está sonando — y menos con las voces DE RED que este
     kit prioriza". Con una voz de red la síntesis vive en el servidor
     del navegador: el `cancel()` es un pedido, no una garantía.

     Hasta acá el kit pedía UNA vez. El `speakGen++` evita que la cola
     avance, así que no sigue con el fragmento siguiente — pero el que
     ya estaba sonando termina de sonar igual, y en un texto largo eso
     son varios segundos de una voz que el alumno mandó a callar.

     Ahora se verifica: si a los 60/180/400ms `speaking` sigue en true,
     se vuelve a pedir; se corta solo en cuanto el motor obedece, así
     que en el caso normal no cuesta nada.

     ⚠️ El guard se cuenta por locuciones ENTREGADAS al motor, no por
     `speakGen`. `speak()` arranca llamando a `cancel()`, así que los
     reintentos heredaban la generación de la locución que estaba POR
     empezar y la mataban a los 60ms. Lo atrapó `locucion-segundos`: sin
     este detalle los fragmentos sanos quedaban marcados como cortados,
     la calibración del reloj —que ignora los cortados a propósito— no
     juntaba una sola muestra válida, y el reloj se quedaba con la
     constante de fábrica. `entregadas` solo avanza cuando de verdad se
     manda algo a hablar, que es exactamente la pregunta que hay que
     hacerse antes de volver a cancelar: *¿esto que suena es lo que
     mandé a callar, o algo nuevo?* */
  function insistirCancel(synth, intentos, marca) {
    if (!intentos.length) return;
    var ms = intentos.shift();
    setTimeout(function () {
      if (entregadas !== marca) return;   // hay algo NUEVO hablando: no es asunto nuestro
      if (!synth.speaking) return;        // obedeció
      try { synth.cancel(); } catch (e) {}
      insistirCancel(synth, intentos, marca);
    }, ms);
  }

  function cancel() {
    var synth = global.speechSynthesis; if (!synth) return;
    speakGen++;
    synth.cancel();
    insistirCancel(synth, [60, 180, 400], entregadas);
    // Si algo interrumpe la narración desde AFUERA (un video que
    // arranca, cambiar de diapositiva) el panel de "Locución" tiene
    // que dejar de mostrar "En curso" — pero sin borrar `estadoActual`:
    // "Repetir" tiene que seguir pudiendo repetir lo último narrado.
    if (estadoActual && !estadoActual.terminado) {
      estadoActual.terminado = true;
      emitirProgreso();
    }
  }

  /* ---- Fragmentado del texto (bug real de Chrome) ----
     Chrome corta la síntesis de voz alrededor de los 15 segundos cuando se
     le pasa una utterance larga: deja de hablar en la mitad de la frase,
     sin error ni evento de fin. Es un bug conocido del motor, no del
     código. Como una diapositiva de este molde narra un párrafo entero
     (fácil 400-700 caracteres, bastante más de 15s), la locución se
     cortaba a mitad de camino en TODAS las diapositivas largas.
     Solución estándar: partir el texto en fragmentos cortos y encolarlos
     uno atrás de otro — cada utterance queda muy por debajo del límite y
     el navegador las encadena sin pausa audible. Se corta por oración
     (respetando el punto/la coma) para que la prosodia no se rompa.
     Sin lookbehind en la regex a propósito: Safari recién lo soporta
     desde 16.4 y estos cursos se abren en el navegador que tenga el LMS
     del cliente. */
  function chunkText(text, max) {
    max = max || 180;
    var oraciones = text.match(/[^.!?:;]+[.!?:;]*\s*/g) || [text];
    var chunks = [], buf = '';
    oraciones.forEach(function (o) {
      if ((buf + o).length <= max) { buf += o; return; }
      if (buf.trim()) chunks.push(buf.trim());
      buf = '';
      if (o.length <= max) { buf = o; return; }
      // una sola oración más larga que el máximo: cortar por coma, y si no
      // hay, por el último espacio antes del límite (nunca a mitad de palabra)
      var resto = o;
      while (resto.length > max) {
        var corte = resto.lastIndexOf(',', max);
        if (corte < max * 0.5) corte = resto.lastIndexOf(' ', max);
        if (corte <= 0) corte = max;
        chunks.push(resto.slice(0, corte + 1).trim());
        resto = resto.slice(corte + 1);
      }
      buf = resto;
    });
    if (buf.trim()) chunks.push(buf.trim());
    return chunks.filter(Boolean);
  }

  /* ---- Estado de la narración EN CURSO (para el panel de "Locución" —
     línea de tiempo + repetir, coto-player.js) ----
     `estadoActual` guarda los fragmentos (`trozos`) de la última
     llamada a `speak()`, no solo mientras habla: así "Repetir" sigue
     funcionando después de que terminó, no solo a mitad de camino.
     Se reemplaza ENTERO en la siguiente llamada a `speak()` (nueva
     diapositiva, nuevo feedback) — nunca se mezclan dos narraciones.
     `seek(i)`/`repeat()` son las únicas formas de volver a hablar
     SOBRE el mismo texto ya trozado, sin re-fragmentarlo de nuevo. */
  var estadoActual = null; // { trozos, v, rate, kind, index, terminado } | null

  /* Un solo lugar arma el estado que ve el panel: `progreso()`. Antes
     este evento armaba su propio objeto con `index`/`total`/`terminado`
     y NADA MÁS, y cuando la línea de tiempo pasó a medirse en segundos
     (§7.40 K32) eso dejó de alcanzar: `pintar(e.detail)` recibía un
     `segTotal` indefinido, así que en cada evento —y `seek()` emite uno
     por vía de `cancel()`— el reloj y la barra se iban a 0:00 y
     `max` a 0.1. MEDIDO: arrastrar al segundo 28 y soltar dejaba el
     reloj en "0:00" mientras la voz hablaba desde el 26. Se recuperaba
     al siguiente tick de 250ms, o sea un parpadeo a cero justo en el
     gesto que el parche venía a arreglar. Dos formas de decir lo mismo
     es una de más: la que se olvida de un campo nuevo. */
  function emitirProgreso() {
    document.dispatchEvent(new CustomEvent('narracionprogreso', { detail: progreso() }));
  }

  function hablarDesde(i) {
    var synth = global.speechSynthesis;
    if (!synth || !estadoActual) return;
    var gen = speakGen;
    var trozos = estadoActual.trozos;
    i = Math.max(0, Math.min(i, trozos.length));
    estadoActual.index = i;
    estadoActual.terminado = i >= trozos.length;
    emitirProgreso();
    if (estadoActual.terminado) {
      // aviso genérico "terminó la narración de la diapo" — lo escucha un
      // eventual modo "Reproducir todo" del curso para avanzar solo.
      if ((estadoActual.kind || 'other') === 'slide') document.dispatchEvent(new CustomEvent('slidenarrationend'));
      /* `narracionfin` — el mismo aviso, pero para CUALQUIER tipo de
         locución, no solo la de diapositiva. `slidenarrationend` existe
         desde siempre para encadenar el autoplay entre diapositivas, y
         por eso filtra por `kind === 'slide'`; pero un curso que quiera
         esperar a que termine de hablar una devolución, un cartel o un
         pop-up (`kind: 'other'`) no tenía de dónde agarrarse y
         terminaba adivinando con un `setTimeout`.

         Caso real que lo pidió: en el minijuego, la devolución del
         último hallazgo arrancaba y se cortaba en seco porque el pop-up
         de repaso aparecía 700 ms después, con el número puesto a ojo.

         Se emite ADEMÁS de `slidenarrationend`, no en su lugar: ese
         sigue siendo el que usa el autoplay, y cambiarlo rompería los
         cursos que ya lo escuchan. */
      document.dispatchEvent(new CustomEvent('narracionfin', {
        detail: { kind: estadoActual.kind || 'other' }
      }));
      return; // OJO: no se borra estadoActual acá — "Repetir" lo sigue usando
    }
    estadoActual.t0 = Date.now();
    var arranque = estadoActual.t0;
    var u = new SpeechSynthesisUtterance(trozos[i]);
    if (estadoActual.v) u.voice = estadoActual.v;
    u.lang = (estadoActual.v && estadoActual.v.lang) || 'es-AR';
    u.rate = estadoActual.rate;
    u.pitch = 1;
    /* Se lee en CADA fragmento a propósito: una locución larga se parte
       en varios utterances (chunkText), así que mover el slider a mitad
       de una narración se escucha en el fragmento SIGUIENTE, no recién
       en la próxima diapositiva. */
    u.volume = volumenEfectivo();
    u.onend = function () {
      /* ⚠️ Solo se calibra en el `onend` NATURAL. Un fragmento cortado
         —cambio de diapositiva, mute, seek— duró MENOS de lo que le
         correspondía, y usarlo para calibrar haría creer que la voz es
         mucho más rápida de lo que es. El guard `gen === speakGen` es
         el mismo que ya usaba la cadena para no encadenar fragmentos de
         una locución cancelada. */
      if (gen !== speakGen) return;
      calibrarCps(trozos[i].length, (Date.now() - arranque) / 1000, estadoActual && estadoActual.rate);
      hablarDesde(i + 1);
    };
    u.onerror = function () { if (gen === speakGen) hablarDesde(i + 1); }; // que un fragmento falle no debe colgar la cadena
    entregadas++;                    // ver `insistirCancel`
    synth.speak(u);
  }

  function speak(text, kind) {
    var synth = global.speechSynthesis; if (!synth) return;
    cancel();
    estadoActual = null;
    if (!narrating || !text) { emitirProgreso(); return; }
    var v = pickVoice();
    /* VELOCIDAD BASE 1.0x PARA TODA VOZ — decisión explícita del
       cliente en la vuelta de iPad (kit-base v1.9.82), que reemplaza
       el ajuste por voz que había antes.

       Lo anterior era 1.22x con Paulina, 1.15x con una voz de calidad
       conocida y 1.0x con una de respaldo. Cada número salía de probar
       UNA voz en UN dispositivo, y el resultado práctico fue que la
       misma locución corría a tres velocidades distintas según qué
       paquete de voces tuviera instalado el alumno, sin que él tocara
       nada ni pudiera entender por qué. Con el catálogo de voces
       variando por dispositivo, esa afinación no escala: lo que se
       ganaba en un equipo se perdía en otro.

       ⚠️ EFECTO ESPERADO EN ESCRITORIO: la voz sigue siendo la misma
       (Google es-US) pero pasa de 1.15x a 1.0x, o sea suena más lenta.
       Es lo pedido, no una regresión.

       Si una voz puntual suena lenta, el alumno tiene el control de
       velocidad del panel — que es la forma correcta de resolverlo:
       preferencia de la persona, no una constante escondida en el
       código. `isHighQualityVoice` ya no decide velocidad: queda solo
       para desempatar dentro de un nivel en `pickVoice()`. */
    var rate = rateFactor;
    var trozos = chunkText(speechify(text), 180);
    if (!trozos.length) { emitirProgreso(); return; }
    var cps = cpsActual() * rate;
    var durs = trozos.map(function (t) { return Math.max(0.4, t.length / cps); });
    var acum = [], acc = 0;
    durs.forEach(function (dd) { acum.push(acc); acc += dd; });
    estadoActual = {
      trozos: trozos, v: v, rate: rate, kind: kind, index: 0, terminado: false,
      durs: durs, acum: acum, segTotal: acc, t0: 0
    };
    hablarDesde(0);
  }

  /* `seek(i)`/`repeat()` — para la línea de tiempo del panel de
     "Locución": saltan a la FRASE `i` (el mismo fragmentado de
     `chunkText`, CLAUDE.md §6.55 — Web Speech API no da precisión de
     palabra confiable con voces de red). No re-narran nada si no hay
     una narración activa (`estadoActual === null`, ej. recién cargó
     la página) — el panel deshabilita sus controles en ese caso, esto
     es la garantía del lado del motor. */
  function seek(i) {
    if (!estadoActual || !narrating) return;
    cancel(); // corta lo que esté sonando (sube speakGen)
    hablarDesde(i);
  }
  function repeat() {
    if (!estadoActual) return;
    seek(0);
  }
  /* `volume` de un SpeechSynthesisUtterance NO se puede tocar en caliente
     sobre uno que ya está sonando — la única forma de aplicar un volumen
     nuevo a lo que ya se está narrando es re-emitirlo desde el fragmento
     actual. Pensado para el gesto de MUTE (discreto: quien lo toca
     espera silencio ya) — nunca para el `input` continuo del slider,
     donde re-emitir en cada píxel cortaría la frase en seco. */
  function refreshVolume() {
    if (!estadoActual || estadoActual.terminado || !narrating) return;
    seek(estadoActual.index);
  }
  function progreso() {
    if (!estadoActual) return null;
    return {
      index: estadoActual.index, total: estadoActual.trozos.length,
      terminado: !!estadoActual.terminado,
      seg: segActual(), segTotal: estadoActual.segTotal || 0
    };
  }

  /* Adelantar POR SEGUNDO.
     ⚠️ Límite honesto: la API solo sabe empezar a hablar un texto desde
     el principio, así que "ir al segundo 12" es en realidad "empezar
     por el fragmento que contiene al segundo 12". El salto cae al
     comienzo de esa frase, no en la mitad de una palabra — que además
     es lo que uno querría escuchar. */
  function seekSeg(s) {
    if (!estadoActual || !narrating || !estadoActual.acum) return;
    s = Math.max(0, Math.min(estadoActual.segTotal, s));
    var i = 0;
    for (var k = 0; k < estadoActual.acum.length; k++) if (estadoActual.acum[k] <= s) i = k;
    seek(i);
  }

  /* ---- Callar cuando la página se va o se esconde (v1.9.98) ----
     La otra mitad del reporte: *"quedó abierta la locución incluso hasta
     cuando cerré el curso"*. En Moodle el curso vive en un iframe, y
     cerrar la actividad lo descarga o lo esconde sin que nada del curso
     se ejecute. `speechSynthesis` NO vive en el documento: vive en el
     navegador, por origen, así que una voz lanzada desde un iframe que
     ya no existe sigue sonando, y no queda ninguna interfaz para
     callarla.

     `pagehide` cubre descarga y navegación (y, a diferencia de
     `beforeunload`, también el caché de retroceso de Safari).
     `visibilitychange` cubre la pestaña en segundo plano y el iframe
     escondido. Los dos son pasivos: si no hay nada hablando, `cancel()`
     no hace nada. */
  if (global.addEventListener) {
    global.addEventListener('pagehide', function () { cancel(); });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') cancel();
    });
  }

  /* ---- alTerminar(fn, pausaMs) — correr algo cuando la voz TERMINÓ ----
     kit-base v1.9.99, subido de "Seguridad alimentaria" (`trasLaLocucion`).

     Pedido del cliente: *"al tocar la última opción, la retroalimentación
     empieza pero se corta porque aparece enseguida el pop-up
     «¡Encontraste las 6!»"*. Y el minijuego DEL KIT tenía el mismo bug:
     medido con un motor de voz asíncrono (como el real), la última
     devolución arrancaba en t=8120ms, el repaso se abría en t=8821 —700ms
     después— y su propia locución cortaba la devolución, que nunca
     llegaba a su fin.

     La causa, y por qué preguntar "¿está hablando?" no alcanza:
     `speechSynthesis.speak()` es ASÍNCRONO. Justo después de pedir una
     frase, `speaking` sigue en `false` un rato. Quien pregunta en ese
     instante concluye "no hay nada sonando" y sigue de largo — que es
     exactamente lo que hacía el minijuego.

     Lo que hace esto, con los tres casos reales en que el evento de fin
     NO llega nunca (un dispositivo sin voces, una voz de red que pierde
     conexión, y los tests que interceptan `speak()`):
       · escucha `narracionfin`;
       · y ADEMÁS sondea el motor, pero recién desde los 500ms (antes,
         `speaking` en false no significa nada) y pidiendo DOS lecturas
         seguidas en silencio (entre fragmento y fragmento de un texto
         largo hay un instante con `speaking` en false que no es el
         final de nada);
       · con un tope de 12s: un juego que no avanza es peor que una
         locución cortada. (El curso de origen tenía 6s en el código y
         "9s" en el comentario; 6s cortan una devolución de dos
         renglones, así que se usa el tope que el kit ya tenía.)
     Si la locución está apagada, corre tras la pausa sin esperar nada:
     lo que tenía que pasar pasa siempre. */
  function alTerminar(fn, pausaMs) {
    pausaMs = typeof pausaMs === 'number' ? pausaMs : 450;
    var hecho = false, poll = null;
    function seguir() {
      if (hecho) return;
      hecho = true;
      document.removeEventListener('narracionfin', seguir);
      if (poll) clearInterval(poll);
      setTimeout(fn, pausaMs);
    }
    if (!narrating) { seguir(); return; }
    var syn = global.speechSynthesis;
    var sonando = !!(syn && (syn.speaking || syn.pending));
    var pr = progreso();
    /* Dos cosas, no una: `progreso()` describe la última locución que se
       ARMÓ, que puede figurar terminada mientras el motor todavía dice
       la anterior; `speaking`/`pending` es el estado real del motor. */
    if (!sonando && (!pr || pr.terminado)) { seguir(); return; }
    document.addEventListener('narracionfin', seguir);
    var quietos = 0;
    setTimeout(function () {
      if (hecho) return;
      poll = setInterval(function () {
        var sy = global.speechSynthesis;
        var p2 = progreso();
        if (p2 && p2.terminado) { seguir(); return; }
        if (sy && !sy.speaking && !sy.pending) { quietos++; if (quietos >= 2) seguir(); }
        else quietos = 0;
      }, 200);
    }, 500);
    setTimeout(seguir, 12000);
  }

  function isNarrating() { return narrating; }
  function setNarrating(v) {
    narrating = !!v;
    try { global.localStorage.setItem(LS_NARRATE, narrating ? '1' : '0'); } catch (e) {}
    if (!narrating) cancel();
  }
  function setManualVoice(v) {
    manualVoiceKey = v ? voiceKey(v) : null;
    voiceCache = null;
    try {
      if (manualVoiceKey) global.localStorage.setItem(LS_VOICE, manualVoiceKey);
      else global.localStorage.removeItem(LS_VOICE);
    } catch (e) {}
  }

  /* ---- Texto real accesible de una diapositiva/panel/pop-up ----
     4 bugs reales, encontrados uno por uno en cursos distintos, que
     esta función ya trae resueltos (por eso subió al kit: cada curso
     los volvía a tropezar al escribir su propio slideText()):

     1. NODOS OCULTOS. Los paneles [data-panel] de las capas siguen en
        el DOM con [hidden] y `textContent` los devuelve igual. Sin el
        filtro `:not(closest('[hidden]'))`, entrar a una diapo de capas
        narraba TODOS los paneles seguidos (la consigna + los 7
        factores) en vez del visible.
     2. TÍTULO DE DIAPOSITIVA. No se narra [data-slide-title] por
        DEFAULT (CLAUDE.md §5: no leer títulos repetidos dentro del
        propio texto — decisión de un cliente anterior: "solo el
        contenido explícito"). Antes de esa corrección se narraba el h2
        de cada diapositiva. Un curso distinto puede querer lo
        contrario — ver `setNarrateTitles()` más arriba.
     3. NÚMERO DE PREGUNTA. `.d-q-num` va pegado al enunciado sin
        espacio (los separa el CSS), así que sin sacarlo se narraba
        "1¿Con qué muestra…" como una sola palabra.
     4. NÚMEROS ANIMADOS. Los `[data-count-to]` cuentan de 0 a N con
        animación y la narración arranca junto con ella, así que leía el
        valor INICIAL: un pop-up de estadística se narraba "se puede
        disminuir 0% de la mortalidad" en vez de 50%. Se usa el valor
        final declarado en el atributo, que no depende del frame.

     5. GRILLA DE TIPS DE "AYUDA" MUDA. `.d-instr-item` (el patrón
        genérico del kit para la grilla de 2-5 tips de "Ayuda" —
        `coto-base-addendum-v1.8.css`, ej. "Tarjetas y flechas",
        "Video") vive en `<span>/<small>` sueltos dentro de un `<div>`,
        ninguno de los tags que ya se narraban — así que en CUALQUIER
        curso que use este patrón (no es nuevo de "Seguridad
        alimentaria", es del boilerplate) esos tips quedaban mudos,
        aunque el resto del panel de "Ayuda" sí se narrara. Sumado a
        TEXT_SEL, con el mismo cuidado del punto 3 (separar título y
        nota con un punto, si no se narran pegados).

     Además, el propio contenedor cuenta si él mismo es un nodo de los
     que narramos: hace falta al acotar la narración a un solo elemento
     (ver [data-narrate-only] en coto-ui.js) — pasarle un <p> y buscar
     'p' adentro no devuelve nada.

     Las limpiezas se hacen SIEMPRE sobre una copia, nunca sobre el DOM
     real: el texto visible/accesible no se toca (CLAUDE.md §5). */
  /* `.d-repaso-btns button` entró en kit-base v1.9.81 y NO es un
     agregado cosmético: hasta v1.9.80 las OPCIONES del repaso rápido
     no se narraban en NINGÚN curso. El relay del primer simulador lo
     reportó como un riesgo a futuro ("rehacer una lista como fila de
     botones apaga la locución"), pero al verificarlo contra el kit
     real resultó ser el estado por defecto: el marcado documentado en
     `coto-repaso.css` pone cada opción en un `<button>` suelto, y
     `<button>` nunca estuvo en esta lista. Medido en los dos cursos de
     referencia: 12 opciones cada uno, las 24 mudas.
     O sea que quien hace el curso escuchando oía la pregunta y
     después silencio, y tenía que mirar la pantalla para saber entre
     qué estaba eligiendo.
     Va acotado a `.d-repaso-btns` a propósito: las flechas de la
     navegación (`.d-repaso-arrow`) y el "Siguiente"
     (`.d-repaso-next`) viven fuera de ese contenedor y no son
     contenido. */
  /* ⚠️ NO agregar acá los selectores del modal de INSTRUCCIONES, por más
     que se vea "mudo" (kit-base v1.9.95). Llegó exactamente esa propuesta
     desde un curso, bien diagnosticada: `textOf()` del pop-up
     `instrucciones` devuelve cadena vacía en todo curso generado, porque
     el rediseño v3 del instructivo (§6.10.2 / §6.20) pasó el marcado a
     `h3` + `.d-instr-card > div > b` + `span` y esta lista nunca lo
     siguió. El diagnóstico es correcto; la conclusión, no.

     Ese modal NO SE NARRA A PROPÓSITO: es una decisión de producto tomada
     con el cliente en v1.9.86 —el instructivo de arranque se LEE— y está
     cuidada por `tools/tests/narracion-ayuda.mjs`, que se pone rojo si
     empieza a narrarse. Narrarlo habría cambiado la conducta que el
     cliente eligió y habría dejado dos tests del kit peleados, igual que
     pasó con `video-tap-chip` y `video-autoplay-ios`.

     Lo que SÍ hacía falta arreglar es que el silencio era un ACCIDENTE:
     salía de que ningún selector matchea ese marcado, así que alcanzaba
     con que alguien le agregara un `<p>` para que empezara a narrarse sin
     que nadie lo hubiera decidido. Ahora el modal lleva
     `data-narrate-skip` en el boilerplate: la decisión está escrita donde
     se ve, y `.d-instr-item` —que sí está en esta lista— sigue narrando
     los tips del panel de AYUDA, que es otra pieza con nombre parecido. */
  var TEXT_SEL = 'h2, p, dt, dd, li, .d-q-title, .d-opt-text, .d-quiz-fb, .d-quiz-result, .who, .d-cert-note, .d-instr-item, .d-repaso-btns button';
  function addTextSel(sel) { if (sel) TEXT_SEL += ', ' + sel; }
  /* Lo publica `Narrador.textSel()` (kit-base v1.9.81) para que un test
     pueda preguntar QUÉ narra el kit en vez de traer su propia copia de
     la lista, que es la que se desactualiza en silencio. Lo usa
     `tools/tests/narracion-completa.mjs`. */
  function textSel() { return TEXT_SEL; }
  /* BUG REAL ("Seguridad alimentaria", diapo "inocuidad"): la locución
     sigue el orden del DOM, pero un panel de hint/cartel de una
     interacción-hotspot (`.d-info-panel`) tiene que vivir DENTRO de
     `.d-shot` para que `_initShots()` lo posicione contra el arte
     (motor-slides.js) — y ese `.d-shot` siempre cierra ANTES del
     `.sr-only` con el texto real de la diapo, que vive afuera. Result:
     "Tocá el ícono para..." se narraba ANTES del contenido, no después
     como corresponde (título → info → indicación de qué hacer). No es
     un problema de ESTA diapo — cualquier hotspot con hint/cartel
     tiene la misma tensión posición-vs-orden. Fix general: un
     contenedor puede marcarse `[data-narrate-last]` (ver
     `.d-info-panel` en el curso) y acá se lo empuja al final de la
     narración sin importar dónde vive en el DOM, preservando el orden
     relativo DENTRO de cada grupo. */
  /* BUG REAL encontrado en "Seguridad alimentaria": las 4 diapositivas
     de video de fondo (portada + 3 separadores de unidad) tienen un
     `<p>` real dentro de su `.sr-only` (la frase de portada, "Arranca
     la Unidad N...") — `speakSlide()` lo lee igual que cualquier otro
     párrafo, así que al entrar arrancaban DOS audios a la vez: la
     locución leyendo esa frase y el video reproduciéndose con su
     propio sonido (una vez que el navegador permite el autoplay con
     audio, típicamente inmediato tras el gesto de "Siguiente"). Es
     exactamente lo que CLAUDE.md §5 prohíbe ("una diapositiva que ES
     un video no se narra... narrar encima sería contraproducente") —
     pero esa regla vivía solo como convención de contenido (no meter
     un `<p>` narrable ahí), nunca aplicada por el código. Los otros 3
     patrones de video (`initVideoPlayer`/pop-up, `initPopupVideos`/
     `initLayerVideos`, `initInlineCircleVideos`) sí cortan la locución
     antes de reproducir (`Narrador.cancel()`, coto-media.js) — el de
     fondo (`initBgVideos`) es el único que no compite con nada porque
     nunca se pensó que fuera a haber un `<p>` narrable ahí adentro.
     Fix a la raíz, acá en `textOf()` (no en cada curso): una diapositiva
     `.d-shot-slide--bg-video` nunca se narra al nivel de "toda la
     diapositiva" (la llamada de `speakSlide`) — su `.sr-only` sigue
     ahí, íntegro, para un lector de pantalla real, que no pasa por
     `textOf()`. Un pop-up abierto DESDE una diapo de video (otro
     `container`, no la `<section>` misma) sigue narrando normal. */
  function textOf(container) {
    if (!container) return '';
    if (container.classList && container.classList.contains('d-shot-slide--bg-video')) return '';
    /* `[data-narrate-only]` — acota QUÉ se narra de este contenedor
       (kit-base v1.9.95). La convención ya existía y estaba documentada,
       pero vivía SOLO del lado de quien llama: `initPopupNarration()`
       (coto-ui.js) hace `pop.querySelector('[data-narrate-only]') || …`,
       así que funcionaba en los pop-ups y NO en las diapositivas, que le
       pasan la `<section>` entera a esta función.

       Los otros dos atributos de la familia —`[data-narrate-last]` y
       `[data-narrate-prefix]`— sí viven acá adentro, y por eso andan en
       los dos lados. Este quedó afuera por dónde se implementó, no por
       una decisión.

       Para qué sirve, con el caso real que lo pidió: la diapositiva de
       índice tiene el temario horneado en la captura, y en el DOM vive
       como `<ul class="sr-only">` porque es el único acceso que tiene un
       lector de pantalla a esa imagen. El cliente pidió que la voz diga
       el título y el nombre del curso y no enumere los 7 ítems. O sea:
       sacar algo de la VOZ sin sacarlo de la ACCESIBILIDAD, que es
       justamente lo que `hidden` o `data-narrate-skip` no permiten. */
    if (container.querySelector) {
      var soloEsto = container.querySelector('[data-narrate-only]');
      if (soloEsto) container = soloEsto;
    }
    var propios = container.matches && container.matches(TEXT_SEL) ? [container] : [];
    var nodos = propios.concat(Array.prototype.slice.call(container.querySelectorAll(TEXT_SEL)))
      .filter(function (n) {
        /* `[data-narrate-skip]` — este nodo (o su contenedor) NO se
           narra, pero SIGUE ENTERO EN EL DOM para un lector de
           pantalla real, que no pasa por `textOf()`.

           Viene de un pedido concreto —que el índice narre solo los
           títulos de las unidades y no los 16 puntos del detalle— y de
           la tentación obvia: borrar ese detalle del `.sr-only`. Eso
           habría "arreglado" la locución ROMPIENDO LA ACCESIBILIDAD,
           que es exactamente lo que ese bloque existe para dar.

           ⚠️ REGLA: la locución y el lector de pantalla tienen públicos
           y tiempos distintos. Uno ACOMPAÑA a la lámina que el alumno
           está mirando; el otro la REEMPLAZA. `data-narrate-skip` es la
           costura entre los dos. */
        if (n.closest('[data-narrate-skip]')) return false;
        return (narrarTitulos || !n.hasAttribute('data-slide-title')) && !n.closest('[hidden]');
      });
    var normal = nodos.filter(function (n) { return !n.closest('[data-narrate-last]'); });
    var ultimo = nodos.filter(function (n) { return n.closest('[data-narrate-last]'); });
    var todos = normal.concat(ultimo);
    var partes = todos
      .map(function (n) {
        var txt;
        /* ---- Un descendiente `[hidden]` no se narra (kit-base v1.9.96) ----
           El filtro de más arriba saca los NODOS que están dentro de algo
           `[hidden]`, pero cuando el nodo que matchea es el contenedor —un
           `<dd>`, por ejemplo— se lee su `textContent` completo, y ahí
           entran sus hijos escondidos.

           Caso real, el glosario del boilerplate: la definición y la pista
           del candado son dos `<span>` DENTRO del mismo `<dd>`, así que se
           narraba *"...No aparece en el envase.Se desbloquea al llegar a
           «Algunos conceptos importantes»."* — la pista incluso con el
           término ya desbloqueado, y pegada sin espacio.

           ⚠️ El parche que trajo este hallazgo proponía marcar esos spans
           con el atributo `hidden` (además de la clase). MEDIDO: no
           alcanza — con `hidden` puesto el texto narrado no cambia ni una
           letra, porque el filtro nunca mira dentro del nodo. La marca
           igual se hace (sirve para lectores de pantalla y para
           `:has()`), pero lo que resuelve la narración es esto. */
        if (n.querySelector('[hidden]')) {
          var limpio = n.cloneNode(true);
          Array.prototype.forEach.call(limpio.querySelectorAll('[hidden]'), function (h) { h.remove(); });
          n = limpio;
        }
        if (n.querySelector('.d-q-num') || n.querySelector('[data-count-to]')) {
          var clone = n.cloneNode(true);
          var num = clone.querySelector('.d-q-num'); if (num) num.remove();
          Array.prototype.forEach.call(clone.querySelectorAll('[data-count-to]'), function (c) {
            c.textContent = c.getAttribute('data-count-to');
          });
          txt = clone.textContent.trim();
        } else if (n.querySelector('small')) {
          // `.d-instr-item` (grilla de tips de "Ayuda", CLAUDE.md §6.54
          // punto 4) trae <span>Título<small>ayuda corta</small></span>
          // — el título y la nota van pegados sin espacio (los separa
          // el CSS), así que sin esto se narraba "Videoen 'El
          // proceso...'" como una sola palabra. Mismo patrón que
          // `.d-q-num` de arriba: clonar y separar ANTES de leer el
          // texto, nunca tocar el DOM real.
          var clone2 = n.cloneNode(true);
          Array.prototype.forEach.call(clone2.querySelectorAll('small'), function (s) {
            s.textContent = '. ' + s.textContent;
          });
          txt = clone2.textContent.trim();
        } else {
          txt = n.textContent.trim();
        }
        /* `[data-narrate-prefix="..."]` — un nodo puede pedir que su
           texto se anuncie con un prefijo hablado (ej. una pregunta de
           Verdadero/Falso: el texto VISIBLE es la afirmación sola —
           "Verdadero"/"Falso" son botones al lado, no texto — pero por
           voz, sin ver la pantalla, sonaba como un dato suelto en vez
           de algo que hay que responder). Nunca toca el texto/alt
           visible (CLAUDE.md §5): es puramente lo que se dice de más,
           mismo criterio que `speechify()`. */
        var prefijo = n.getAttribute && n.getAttribute('data-narrate-prefix');
        return (prefijo && txt) ? (prefijo + ': ' + txt) : txt;
      });
    /* BUG REAL, encontrado auditando "Seguridad alimentaria" a pedido
       del cliente ("que la narración sea clara y con sentido"): con
       `setNarrateTitles` prendido, 6 de las 26 diapositivas decían el
       título DOS VECES SEGUIDAS ("Introducción. Introducción. En
       COTO..."). Causa: esos párrafos ya arrancaban anunciando el tema
       en palabras ("Introducción. En COTO trabajamos...") — escritos
       en una época en que el título nunca se narraba, así que el
       propio texto hacía ese trabajo. Prender el título no le avisó a
       esos párrafos que ya no hacía falta. Fix: si el primer fragmento
       es el título (`setNarrateTitles` on) y el fragmento siguiente
       ARRANCA repitiendo el mismo texto como su propia primera
       oración, se recorta esa apertura duplicada del segundo
       fragmento — nunca el título en sí, y nunca el texto VISIBLE
       (CLAUDE.md §5), solo lo que se dice de más. Diapositivas donde
       el cuerpo NO repite el título (la mayoría) quedan intactas: la
       comparación no encuentra coincidencia y no recorta nada. */
    if (narrarTitulos && todos[0] && todos[0].hasAttribute('data-slide-title') && partes[1]) {
      partes[1] = quitarAperturaRepetida(partes[1], partes[0]);
    }
    /* Unir con ". " SOLO si el fragmento no viene ya cerrado
       (kit-base v1.9.71, §7.17). El `join('. ')` incondicional de
       antes generaba "...correctamente.. Objetivos de aprendizaje." en
       cada límite entre dos nodos narrados — o sea, en TODO curso que
       escriba sus párrafos como prosa normal, que es la forma natural.
       No rompe nada (un motor de síntesis lee ".." como una pausa un
       poco más larga), pero no es prolijo y ensucia cualquier lectura
       del texto narrado. */
    return partes.filter(Boolean).reduce(function (acc, frag) {
      if (!acc) return frag;
      return acc + (/[.!?…:;]$/.test(acc) ? ' ' : '. ') + frag;
    }, '');
  }
  function quitarAperturaRepetida(texto, titulo) {
    function limpiarBordes(s) {
      return (s || '').replace(/^[¡¿\s]+/, '').replace(/[\s.!?]+$/, '').toLowerCase();
    }
    var tit = limpiarBordes(titulo);
    if (!tit) return texto;
    var m = texto.match(/^([^.!?]*[.!?]+)\s*/);
    if (!m) return texto;
    if (limpiarBordes(m[1]) === tit) return texto.slice(m[0].length);
    return texto;
  }

  global.Narrador = {
    speak: speak,
    alTerminar: alTerminar,
    textOf: textOf,
    textSel: textSel,
    addTextSel: addTextSel,
    speechify: speechify,
    addFixes: addFixes,
    cancel: cancel,
    isNarrating: isNarrating,
    setNarrating: setNarrating,
    pickVoice: pickVoice,
    setManualVoice: setManualVoice,
    setNarrateTitles: setNarrateTitles,
    setRateFactor: setRateFactor,
    getRateFactor: getRateFactor,
    getRateDefault: getRateDefault,
    hayRateElegido: hayRateElegido,
    setRateDefault: setRateDefault,
    seek: seek,
    seekSeg: seekSeg,
    repeat: repeat,
    progreso: progreso,
    refreshVolume: refreshVolume
  };
})(window);
