# Cursos SCORM COTO — Área Aprendizaje · guía maestra

> **Desde v1.9.104 las reglas vigentes están en `MANUAL-DEL-MOLDE.md`**,
> cortas y por tema. Este archivo es el DIARIO del kit: cuenta cómo se
> llegó a cada regla, en orden, y solo se agrega. Un párrafo de acá
> puede describir algo que después cambió; **si no coincide con el
> manual, manda el manual** (§7.53).

> Este documento es el "gen" del que parte cada curso nuevo. Lo lee Claude
> (o cualquier dev) al arrancar un curso. **Se actualiza SOLO desde el chat
> dedicado a mejorar `kit-base/` — nunca desde una sesión de curso, ver
> §0.1** — con lo nuevo que valga la pena retener; nunca se re-escribe
> desde cero. Es la contraparte *reutilizable* del README de cada curso
> (que sigue siendo su bitácora propia, cronológica, con decisiones
> específicas de ESE cliente/contenido).
>
> Curso de referencia donde se fijó este patrón: **"Surtido sin venta"**
> (Área Salón). Segundo curso que ya reusa la base: **"Medios de pago"**.
> Desde esta versión, la parte reutilizable en código vive aparte como
> **`kit-base/` (v1.3)** — este documento sigue siendo la guía de
> proceso/diseño/contenido; ver `kit-base/README.md` para qué hay en
> la carpeta y cómo arrancar un curso con eso (§7 tiene el checklist
> corto).
>
> **Este archivo también tiene una copia dentro de `kit-base/CLAUDE.md`**
> (el original de la fuente de verdad sigue siendo este, un nivel
> arriba de esa carpeta) — así un zip de `kit-base/` solo ya trae la
> guía completa, sin depender de acordarse de mandarla aparte en el
> flujo sin repo (chat nuevo por curso). Si edita uno, editar el otro.

---

## Índice

- [0. Qué es un curso de este molde](#0-qué-es-un-curso-de-este-molde)
- [0.1 Regla dura: `kit-base/` se edita en UN solo lugar — nunca desde una sesión de curso](#01-regla-dura-kit-base-se-edita-en-un-solo-lugar-nunca-desde-una-sesión-de-curso)
- [1. Qué es genérico (se copia tal cual) vs. qué es del curso](#1-qué-es-genérico-se-copia-tal-cual-vs-qué-es-del-curso)
- [2. El patrón central: `.d-shot-slide--bg-layered`](#2-el-patrón-central-d-shot-slide--bg-layered)
- [3. Flujo: de "PDF de Illustrator" a curso terminado](#3-flujo-de-pdf-de-illustrator-a-curso-terminado)
- [4. Sistema de diseño (`coto-base.css` + addendum)](#4-sistema-de-diseño-coto-basecss-addendum)
- [5. Narración por voz](#5-narración-por-voz)
- [6. Testing (`tools/tests/`, Playwright)](#6-testing-toolstests-playwright)
- [6.5 Manuales oficiales de marca y contenido (fuente de verdad)](#65-manuales-oficiales-de-marca-y-contenido-fuente-de-verdad)
- [6.6 Rediseño de la barra superior (`.d-top`) — kit-base v1.1](#66-rediseño-de-la-barra-superior-d-top-kit-base-v11)
- [6.7 Locución: velocidad fija = bug real en dispositivos sin la voz preferida](#67-locución-velocidad-fija-bug-real-en-dispositivos-sin-la-voz-preferida)
- [6.8 Márgenes en tablet — primera pasada: aceptado tal cual (ver §6.9 para la vuelta 2)](#68-márgenes-en-tablet-primera-pasada-aceptado-tal-cual-ver-69-para-la-vuelta-2)
- [6.9 Margen de seguridad ampliado para tablets — la solución real](#69-margen-de-seguridad-ampliado-para-tablets-la-solución-real)
- [6.9.1 Franjas laterales en ultrawide: es lo correcto, NO lo "arregles"](#691-franjas-laterales-en-ultrawide-es-lo-correcto-no-lo-arregles)
- [6.10 Avance bloqueado por contenido (gate) — kit-base v1.7](#610-avance-bloqueado-por-contenido-gate-kit-base-v17)
- [6.10.1 Interacciones nuevas: 4 reglas que salieron de bugs reales](#6101-interacciones-nuevas-4-reglas-que-salieron-de-bugs-reales)
- [6.10.2 Pop-ups: una sola regla para todo el curso](#6102-pop-ups-una-sola-regla-para-todo-el-curso)
- [6.10.2.1 El instructivo de arranque: qué decir y qué NO prometer](#61021-el-instructivo-de-arranque-qué-decir-y-qué-no-prometer)
- [6.10.2.2 Cuándo conviene romper la convención de pop-ups](#61022-cuándo-conviene-romper-la-convención-de-pop-ups)
- [6.10.2.3 Tono: el alumno puede estar nervioso en su primer día](#61023-tono-el-alumno-puede-estar-nervioso-en-su-primer-día)
- [6.10.3 Resaltar una hitbox: el ícono, no la caja](#6103-resaltar-una-hitbox-el-ícono-no-la-caja)
- [6.10.4 Tiempo mostrado ≠ tiempo de sesión](#6104-tiempo-mostrado-tiempo-de-sesión)
- [6.10.5 El curso tiene que poder cerrarse](#6105-el-curso-tiene-que-poder-cerrarse)
- [6.10.6 Premio final: los umbrales se calculan, no se eligen](#6106-premio-final-los-umbrales-se-calculan-no-se-eligen)
- [6.10.7 Zonas interactivas sobre el arte: el toggle del clic](#6107-zonas-interactivas-sobre-el-arte-el-toggle-del-clic)
- [6.10.8 "Extraído al kit" no es "probado en un curso real" — auditar la diferencia](#6108-extraído-al-kit-no-es-probado-en-un-curso-real-auditar-la-diferencia)
- [6.11 Animación de entrada escalonada — hasta dónde llega (y por qué)](#611-animación-de-entrada-escalonada-hasta-dónde-llega-y-por-qué)
- [6.12 Pop-up de arranque, video circular, torta interactiva y video en pop-up — 4 lecciones reales (kit v1.9)](#612-pop-up-de-arranque-video-circular-torta-interactiva-y-video-en-pop-up-4-lecciones-reales-kit-v19)
- [6.13 Ronda de revisión visual: 3 lecciones más (kit v1.9)](#613-ronda-de-revisión-visual-3-lecciones-más-kit-v19)
- [6.14 Pop-up 2x2 con color de curso, hover duplicado, video "recortado" y voz en tablet (kit v1.9)](#614-pop-up-2x2-con-color-de-curso-hover-duplicado-video-recortado-y-voz-en-tablet-kit-v19)
- [6.15 Bug real: la barra superior/inferior se cortaba en iPad — pero solo con un alumno real logueado](#615-bug-real-la-barra-superiorinferior-se-cortaba-en-ipad-pero-solo-con-un-alumno-real-logueado)
- [6.16 El fix de §6.15 tenía un costo de UX que había que resolver aparte](#616-el-fix-de-615-tenía-un-costo-de-ux-que-había-que-resolver-aparte)
- [6.17 Primera prueba real end-to-end del kit — 2 bugs reales confirmados en el kit mismo (kit v1.9.2)](#617-primera-prueba-real-end-to-end-del-kit-2-bugs-reales-confirmados-en-el-kit-mismo-kit-v192)
- [6.17.1 Gamificación completa: requisito fijo, no decisión de alcance por curso](#6171-gamificación-completa-requisito-fijo-no-decisión-de-alcance-por-curso)
- [6.17.2 Auditoría dirigida: "traer de vuelta" prevención cardiovascular al kit — 1 gap real más encontrado](#6172-auditoría-dirigida-traer-de-vuelta-prevención-cardiovascular-al-kit-1-gap-real-más-encontrado)
- [6.18 Segunda vuelta de "Uso de Sucursales 3 - NOA" — 4 bugs reales más, los 4 en el kit (kit v1.9.4)](#618-segunda-vuelta-de-uso-de-sucursales-3---noa-4-bugs-reales-más-los-4-en-el-kit-kit-v194)
- [6.19 Tercera vuelta sobre "Uso de Sucursales 3 - NOA" — auditoría dirigida contra "Prevención cardiovascular" pieza por pieza (kit v1.9.5)](#619-tercera-vuelta-sobre-uso-de-sucursales-3---noa-auditoría-dirigida-contra-prevención-cardiovascular-pieza-por-pieza-kit-v195)
- [6.20 Cuarta vuelta sobre "Uso de Sucursales 3 - NOA" — recrear con CSS un pop-up que el diseñador ya armó para copiar y pegar (kit-base v1.9.6)](#620-cuarta-vuelta-sobre-uso-de-sucursales-3---noa-recrear-con-css-un-pop-up-que-el-diseñador-ya-armó-para-copiar-y-pegar-kit-base-v196)
- [6.21 Auditoría a pedido del cliente contra "Prevención cardiovascular", componente por componente (kit-base v1.9.7)](#621-auditoría-a-pedido-del-cliente-contra-prevención-cardiovascular-componente-por-componente-kit-base-v197)
- [6.22 Ronda de UX/interacción a pedido del cliente (kit-base v1.9.7)](#622-ronda-de-uxinteracción-a-pedido-del-cliente-kit-base-v197)
- [6.23 Portada y separadores de unidad pasan a video de fondo — 1 bug real de kit encontrado (kit-base v1.9.8)](#623-portada-y-separadores-de-unidad-pasan-a-video-de-fondo-1-bug-real-de-kit-encontrado-kit-base-v198)
- [6.24 Revisión full a pedido del cliente: 20 hallazgos, y el peor no lo veía ningún test (kit-base v1.9.9)](#624-revisión-full-a-pedido-del-cliente-20-hallazgos-y-el-peor-no-lo-veía-ningún-test-kit-base-v199)
- [6.25 La tilde verde no se marcaba: un bug que YO introduje al "limpiar" estado duplicado](#625-la-tilde-verde-no-se-marcaba-un-bug-que-yo-introduje-al-limpiar-estado-duplicado)
- [6.26 Rebuild sobre el PDF v2: cuando el arte mejora, aparecen bugs que el arte viejo tapaba (kit-base v1.9.10)](#626-rebuild-sobre-el-pdf-v2-cuando-el-arte-mejora-aparecen-bugs-que-el-arte-viejo-tapaba-kit-base-v1910)
- [6.27 Ronda de pulido visual sobre el PDF v2: 5 pedidos puntuales (kit-base v1.9.11)](#627-ronda-de-pulido-visual-sobre-el-pdf-v2-5-pedidos-puntuales-kit-base-v1911)
- [6.28 "Los pop-ups se siguen viendo mal" — la causa real era una sombra DOBLE, no un problema de diseño](#628-los-pop-ups-se-siguen-viendo-mal-la-causa-real-era-una-sombra-doble-no-un-problema-de-diseño)
- [6.29 Video con controles nativos duplicando un reproductor ya dibujado en el poster — bug real de kit (`coto-media.js`, kit-base v1.9.13)](#629-video-con-controles-nativos-duplicando-un-reproductor-ya-dibujado-en-el-poster-bug-real-de-kit-coto-mediajs-kit-base-v1913)
- [6.30 Minijuego: layout debe calcar la disposición del PDF, pero lo recreado en CSS puede (y debe) tener más terminación visual que el arte](#630-minijuego-layout-debe-calcar-la-disposición-del-pdf-pero-lo-recreado-en-css-puede-y-debe-tener-más-terminación-visual-que-el-arte)
- [6.31 Primer intento de rediseño de las 10 fichas (recorte → HTML real, REVERTIDO en §6.32) + bug real de kit: el letterbox lateral se disparaba en las resoluciones de escritorio más comunes](#631-primer-intento-de-rediseño-de-las-10-fichas-recorte-html-real-revertido-en-632-bug-real-de-kit-el-letterbox-lateral-se-disparaba-en-las-resoluciones-de-escritorio-más-comunes)
- [6.32 §6.31 estaba mal leído: el cliente pidió usar las imágenes del PDF, no reinterpretarlas — y las mandó a resolución nativa para pegar directo](#632-631-estaba-mal-leído-el-cliente-pidió-usar-las-imágenes-del-pdf-no-reinterpretarlas-y-las-mandó-a-resolución-nativa-para-pegar-directo)
- [6.33 La ficha quedaba grande y con la ✕ recortada — dos bugs reales, uno de ellos una regla CSS duplicada que se pisaba a sí misma](#633-la-ficha-quedaba-grande-y-con-la-recortada-dos-bugs-reales-uno-de-ellos-una-regla-css-duplicada-que-se-pisaba-a-sí-misma)
- [6.34 Revisión general a pedido del cliente ("pegale una revisión para que se vea y funcione bien") — 3 bugs reales encontrados con Playwright, ninguno reportado antes](#634-revisión-general-a-pedido-del-cliente-pegale-una-revisión-para-que-se-vea-y-funcione-bien-3-bugs-reales-encontrados-con-playwright-ninguno-reportado-antes)
- [6.36 Feedback puntual del cliente sobre la revisión de §6.34 — 5 correcciones reales](#636-feedback-puntual-del-cliente-sobre-la-revisión-de-634-5-correcciones-reales)
- [6.37 El minijuego no calcaba la dinámica original acordada, y "volver para atrás" dejaba sin forma de rejugar](#637-el-minijuego-no-calcaba-la-dinámica-original-acordada-y-volver-para-atrás-dejaba-sin-forma-de-rejugar)
- [6.38 El foco de la ✕ dibujaba un anillo casi cuadrado sobre un botón redondo — bug real de kit](#638-el-foco-de-la-dibujaba-un-anillo-casi-cuadrado-sobre-un-botón-redondo-bug-real-de-kit)
- [6.39 Rediseño completo del minijuego: cajas más lindas, layout, y la tensión de "10 opciones" resuelta con un mecanismo de juego, no con contenido](#639-rediseño-completo-del-minijuego-cajas-más-lindas-layout-y-la-tensión-de-10-opciones-resuelta-con-un-mecanismo-de-juego-no-con-contenido)
- [6.40 El cartel "¡Aprendé jugando!" pasa a estar arriba del iPad (alineado a la izquierda) — 2 bugs reales de layout mobile encontrados al validar el cambio](#640-el-cartel-aprendé-jugando-pasa-a-estar-arriba-del-ipad-alineado-a-la-izquierda-2-bugs-reales-de-layout-mobile-encontrados-al-validar-el-cambio)
- [6.41 Auditoría del cliente comparando 5 pantallas de cierre contra el PDF real + 2 pedidos puntuales resueltos (kit-base v1.9.18)](#641-auditoría-del-cliente-comparando-5-pantallas-de-cierre-contra-el-pdf-real-2-pedidos-puntuales-resueltos-kit-base-v1918)
- [6.42 El fix de §6.41 sobrecorrigió: "centrado" no era `align-items:start`, y mobile necesitaba la MISMA disposición de escritorio, no una rehecha](#642-el-fix-de-641-sobrecorrigió-centrado-no-era-align-itemsstart-y-mobile-necesitaba-la-misma-disposición-de-escritorio-no-una-rehecha)
- [6.43 Cierre de ronda: ícono real de NOA, objetivo C, y un bug real en el armado del zip de entrega](#643-cierre-de-ronda-ícono-real-de-noa-objetivo-c-y-un-bug-real-en-el-armado-del-zip-de-entrega)
- [6.44 Batería grande de correcciones del cliente: índice no interactivo, gate real en el menú lateral, esquina del pop-up de instrucciones, y re-calibración del video de las 10 fichas](#644-batería-grande-de-correcciones-del-cliente-índice-no-interactivo-gate-real-en-el-menú-lateral-esquina-del-pop-up-de-instrucciones-y-re-calibración-del-video-de-las-10-fichas)
- [6.45 Arranque de "Seguridad alimentaria" (Área Control de Calidad) — 8 gaps reales del kit y la primera cáscara de minijuego compartida (kit-base v1.9.21)](#645-arranque-de-seguridad-alimentaria-área-control-de-calidad-8-gaps-reales-del-kit-y-la-primera-cáscara-de-minijuego-compartida-kit-base-v1921)
- [6.46 Ronda de feedback + 10 propuestas de mejora sobre "Seguridad alimentaria" — 3 piezas que subieron al kit (kit-base v1.9.22)](#646-ronda-de-feedback-10-propuestas-de-mejora-sobre-seguridad-alimentaria-3-piezas-que-subieron-al-kit-kit-base-v1922)
- [6.47 Segunda vuelta de feedback sobre "Seguridad alimentaria" — un bug real de kit (`staggerReveal()` con hijos `hidden`) y el resto quedó en el curso (kit-base v1.9.23)](#647-segunda-vuelta-de-feedback-sobre-seguridad-alimentaria-un-bug-real-de-kit-staggerreveal-con-hijos-hidden-y-el-resto-quedó-en-el-curso-kit-base-v1923)
- [6.48 Tercera vuelta sobre "Seguridad alimentaria": video de fondo con auto-avance, 3 bugs reales de interacción, la pantalla de salida, y un bug de mobile real heredado de NOA (kit-base v1.9.24)](#648-tercera-vuelta-sobre-seguridad-alimentaria-video-de-fondo-con-auto-avance-3-bugs-reales-de-interacción-la-pantalla-de-salida-y-un-bug-de-mobile-real-heredado-de-noa-kit-base-v1924)
- [6.49 Cuarta vuelta sobre "Seguridad alimentaria": el video se pausaba solo (o no se pausaba), el botón de play quedaba ovalado, y una trampa de especificidad que hay que dejar advertida en el kit (kit-base v1.9.25)](#649-cuarta-vuelta-sobre-seguridad-alimentaria-el-video-se-pausaba-solo-o-no-se-pausaba-el-botón-de-play-quedaba-ovalado-y-una-trampa-de-especificidad-que-hay-que-dejar-advertida-en-el-kit-kit-base-v1925)
- [6.50 Minijuego: las píldoras se estiraban al achicar la ventana, y "Producto alterado" pasa de trampa a hallazgo real con pista diferenciada (kit-base v1.9.26)](#650-minijuego-las-píldoras-se-estiraban-al-achicar-la-ventana-y-producto-alterado-pasa-de-trampa-a-hallazgo-real-con-pista-diferenciada-kit-base-v1926)
- [6.51 La barra de progreso "olvidaba" sesiones anteriores, y la barra de "pasos" de Rotación pasa a ser arrastrable — el bug más largo de encontrar de todo el curso (kit-base v1.9.27)](#651-la-barra-de-progreso-olvidaba-sesiones-anteriores-y-la-barra-de-pasos-de-rotación-pasa-a-ser-arrastrable-el-bug-más-largo-de-encontrar-de-todo-el-curso-kit-base-v1927)
- [6.52 Glosario interactivo: clic en un término navega a la diapositiva, y el glosario se desbloquea con el progreso real del curso (kit-base v1.9.28)](#652-glosario-interactivo-clic-en-un-término-navega-a-la-diapositiva-y-el-glosario-se-desbloquea-con-el-progreso-real-del-curso-kit-base-v1928)
- [6.53 Auditoría del sistema de puntos a pedido del cliente: un `award()` sin guard persistido en una actividad reintentable es puntaje infinito (curso, no kit)](#653-auditoría-del-sistema-de-puntos-a-pedido-del-cliente-un-award-sin-guard-persistido-en-una-actividad-reintentable-es-puntaje-infinito-curso-no-kit)
- [6.54 Auditoría de locuciones a pedido del cliente: un video de fondo compitiendo con la voz, y la prioridad de voz pasa a ser latina/argentina antes que la de EE.UU. (kit-base v1.9.30)](#654-auditoría-de-locuciones-a-pedido-del-cliente-un-video-de-fondo-compitiendo-con-la-voz-y-la-prioridad-de-voz-pasa-a-ser-latinaargentina-antes-que-la-de-eeuu-kit-base-v1930)
- [6.55 Controles de audio "cool": barra de volumen + línea de tiempo de locución, con popovers que se posicionan dinámicamente en vez de anclar por breakpoint (kit-base v1.9.35)](#655-controles-de-audio-cool-barra-de-volumen-línea-de-tiempo-de-locución-con-popovers-que-se-posicionan-dinámicamente-en-vez-de-anclar-por-breakpoint-kit-base-v1935)
- [6.56 Revisión general a pedido del cliente sobre "Seguridad alimentaria" — recorrido visual completo, 0 bugs reales encontrados, y 1 limitación de diseño preexistente que queda documentada (no corregida sin pedido)](#656-revisión-general-a-pedido-del-cliente-sobre-seguridad-alimentaria-recorrido-visual-completo-0-bugs-reales-encontrados-y-1-limitación-de-diseño-preexistente-que-queda-documentada-no-corregida-sin-pedido)
- [6.57 "Ayuda" deja de mezclar instructivo con configuración: dos botones flotantes, con valor agregado real (kit-base v1.9.36)](#657-ayuda-deja-de-mezclar-instructivo-con-configuración-dos-botones-flotantes-con-valor-agregado-real-kit-base-v1936)
- [6.58 Feedback puntual sobre lo entregado en §6.57: 5 correcciones reales, todas de kit salvo los íconos (kit-base v1.9.37)](#658-feedback-puntual-sobre-lo-entregado-en-657-5-correcciones-reales-todas-de-kit-salvo-los-íconos-kit-base-v1937)
- [6.59 Ronda de "10 mejoras al kit" a pedido del cliente: mobile como parte del diseño (no un parche), y 2 bugs reales de kit encontrados con las herramientas que se acaban de construir (kit-base v1.9.39)](#659-ronda-de-10-mejoras-al-kit-a-pedido-del-cliente-mobile-como-parte-del-diseño-no-un-parche-y-2-bugs-reales-de-kit-encontrados-con-las-herramientas-que-se-acaban-de-construir-kit-base-v1939)
- [6.60 Ronda "mejorar el kit al máximo": el contraste no fallaba en 5 categorías, fallaba el sistema de tokens — y `npm test` corría 6 de 7 tests (kit-base v1.9.40)](#660-ronda-mejorar-el-kit-al-máximo-el-contraste-no-fallaba-en-5-categorías-fallaba-el-sistema-de-tokens-y-npm-test-corría-6-de-7-tests-kit-base-v1940)
- [6.61 Ronda de feedback sobre "Seguridad alimentaria": el volumen de "Sonido" pasa a gobernar también la locución, y un bug real de popovers que se quedaban colgados tras un clic afuera (kit-base v1.9.40)](#661-ronda-de-feedback-sobre-seguridad-alimentaria-el-volumen-de-sonido-pasa-a-gobernar-también-la-locución-y-un-bug-real-de-popovers-que-se-quedaban-colgados-tras-un-clic-afuera-kit-base-v1940)
- [6.62 Discrepancia real entre lo reportado y lo aplicado — y el punto que faltaba: el repaso del minijuego pasa de capa a pop-up real (kit-base v1.9.41)](#662-discrepancia-real-entre-lo-reportado-y-lo-aplicado-y-el-punto-que-faltaba-el-repaso-del-minijuego-pasa-de-capa-a-pop-up-real-kit-base-v1941)
- [6.63 2 bugs reales reportados tras entregar v1.9.41: el volumen de locución no aplicaba sin reiniciar, y el glosario dejaba saltar el gate de avance (kit-base v1.9.42)](#663-2-bugs-reales-reportados-tras-entregar-v1941-el-volumen-de-locución-no-aplicaba-sin-reiniciar-y-el-glosario-dejaba-saltar-el-gate-de-avance-kit-base-v1942)
- [6.64 Lote de 7 mejoras "cinematográficas" reportado desde "Seguridad alimentaria" — 6 de 7 no existían en el kit real (kit-base v1.9.43)](#664-lote-de-7-mejoras-cinematográficas-reportado-desde-seguridad-alimentaria-6-de-7-no-existían-en-el-kit-real-kit-base-v1943)
- [6.65 Ronda de mejoras propuestas por Claude, no reportadas por ningún curso: linter de tokens, índice navegable, protocolo de relay más estricto, y fallback visual de video roto (kit-base v1.9.44)](#665-ronda-de-mejoras-propuestas-por-claude-no-reportadas-por-ningún-curso-linter-de-tokens-índice-navegable-protocolo-de-relay-más-estricto-y-fallback-visual-de-video-roto-kit-base-v1944)
- [6.66 Segunda tanda de la lista de 10 mejoras: peso de assets, lazy-load, modo revisión (deep-link + overlay + panel de tracking), y scaffolding de curso nuevo (kit-base v1.9.48)](#666-segunda-tanda-de-la-lista-de-10-mejoras-peso-de-assets-lazy-load-modo-revisión-deep-link-overlay-panel-de-tracking-y-scaffolding-de-curso-nuevo-kit-base-v1948)
- [6.67 Las 3 últimas de la lista de 10: regresión visual con screenshots, chequeo proactivo de suspend_data, y sprite de íconos — con un hallazgo real de flakiness en el camino (kit-base v1.9.50)](#667-las-3-últimas-de-la-lista-de-10-regresión-visual-con-screenshots-chequeo-proactivo-de-suspenddata-y-sprite-de-íconos-con-un-hallazgo-real-de-flakiness-en-el-camino-kit-base-v1950)
- [6.68 3 mejoras de animación/orden de aparición propuestas por Claude: stagger de hitboxes, crossfade en initShotSwap, y stagger de overlays de texto real (kit-base v1.9.51)](#668-3-mejoras-de-animaciónorden-de-aparición-propuestas-por-claude-stagger-de-hitboxes-crossfade-en-initshotswap-y-stagger-de-overlays-de-texto-real-kit-base-v1951)
- [6.69 Revisada final del kit: 16 bugs reales + 6 desalineaciones entre código y documentación (kit-base v1.9.52)](#669-revisada-final-del-kit-12-bugs-reales--6-desalineaciones-entre-código-y-documentación-kit-base-v1952)
- [6.70 El halo de hallazgo del minijuego, atrapado en el zip del otro chat — y el choque de numeración que lo dejó pasar (kit-base v1.9.53)](#670-el-halo-de-hallazgo-del-minijuego-atrapado-en-el-zip-del-otro-chat--y-el-choque-de-numeración-que-lo-dejó-pasar-kit-base-v1953)
- [7. Checklist de arranque rápido para un curso nuevo](#7-checklist-de-arranque-rápido-para-un-curso-nuevo)
- [7.05 Migrar un curso viejo de Storyline (kit-base v1.9.57)](#705-migrar-un-curso-viejo-de-storyline-kit-base-v1957)
- [7.06 5 parches relayados desde "Uso de Sucursales 3 - NOA", verificados y aplicados (kit-base v1.9.58)](#706-5-parches-relayados-desde-uso-de-sucursales-3---noa-verificados-y-aplicados-kit-base-v1958)
- [7.07 Segundo lote de "Uso de Sucursales 3 - NOA": 3 parches ciertos, uno descartado por diagnóstico incorrecto (kit-base v1.9.59)](#707-segundo-lote-de-uso-de-sucursales-3---noa-3-parches-ciertos-uno-descartado-por-diagnóstico-incorrecto-kit-base-v1959)
- [7.08 Auditoría de los 2 cursos terminados: el kit pasa a generar el `index.html` y a ser dueño de los puntos/logros (kit-base v1.9.60)](#708-auditoría-de-los-2-cursos-terminados-el-kit-pasa-a-generar-el-indexhtml-y-a-ser-dueño-de-los-puntoslogros-kit-base-v1960)
- [7.09 Relay de "Surtido sin ventas": 2 bugs silenciosos, 2 mejoras de herramienta y una técnica que sube al kit (kit-base v1.9.61)](#709-relay-de-surtido-sin-ventas-2-bugs-silenciosos-2-mejoras-de-herramienta-y-una-técnica-que-sube-al-kit-kit-base-v1961)
- [7.10 Relay de "Prevención cardiovascular": el kit se autoinfligió un bug en v1.9.60 y lo encontró el primer curso que lo usó (kit-base v1.9.62)](#710-relay-de-prevención-cardiovascular-el-kit-se-autoinfligió-un-bug-en-v1960-y-lo-encontró-el-primer-curso-que-lo-usó-kit-base-v1962)
- [7.11 Auditoría del 3er curso terminado ("Prevención cardiovascular"): con tres cursos, lo que se repite deja de ser opinión (kit-base v1.9.63)](#711-auditoría-del-3er-curso-terminado-prevención-cardiovascular-con-tres-cursos-lo-que-se-repite-deja-de-ser-opinión-kit-base-v1963)
- [7.12 "¿Por qué tengo que hacer decenas de ediciones?" — la respuesta, medida: el 95% del CSS de curso pisa al kit (kit-base v1.9.64)](#712-por-qué-tengo-que-hacer-decenas-de-ediciones-la-respuesta-medida-el-95-del-css-de-curso-pisa-al-kit-kit-base-v1964)
- [7.13 Los tests miraban al lado: los 3 bugs más caros de esta ronda pasaron la suite en verde (kit-base v1.9.65)](#713-los-tests-miraban-al-lado-los-3-bugs-más-caros-de-esta-ronda-pasaron-la-suite-en-verde-kit-base-v1965)
- [7.14 "Me equivoqué bastante e igual llegué al máximo": cuando el puntaje premia insistencia en vez de precisión (kit-base v1.9.66)](#714-me-equivoqué-bastante-e-igual-llegué-al-máximo-cuando-el-puntaje-premia-insistencia-en-vez-de-precisión-kit-base-v1966)
- [7.15 El destello de arranque: los 3 cursos mostraban TODO el curso superpuesto durante un instante (kit-base v1.9.67)](#715-el-destello-de-arranque-los-3-cursos-mostraban-todo-el-curso-superpuesto-durante-un-instante-kit-base-v1967)
- [7.16 La receta de opt-out que no apagaba nada: `:not(:has())` sube la especificidad y el curso no se entera (kit-base v1.9.70)](#716-la-receta-de-opt-out-que-no-apagaba-nada-nothas-sube-la-especificidad-y-el-curso-no-se-entera-kit-base-v1970)
- [7.17 El relay de "Pedidos de PLU set a Compras": 4 piezas que el kit traía y nadie enchufaba (kit-base v1.9.71)](#717-el-relay-de-pedidos-de-plu-set-a-compras-4-piezas-que-el-kit-traía-y-nadie-enchufaba-kit-base-v1971)
- [7.18 El relay de "Surtido sin venta": 8 de 10 aplicados, y una regresión propia (kit-base v1.9.72)](#718-el-relay-de-surtido-sin-venta-8-de-10-aplicados-y-una-regresión-propia-kit-base-v1972)
- [7.19 El relay de "Seguridad de la información": lo aplicado, y por qué el resto no es un parche (kit-base v1.9.73)](#719-el-relay-de-seguridad-de-la-información-lo-aplicado-y-por-qué-el-resto-no-es-un-parche-kit-base-v1973)
- [7.20 Relay de "Seguridad de la información", pasada 2: los gaps de herramienta y el test que faltaba (kit-base v1.9.74)](#720-relay-de-seguridad-de-la-información-pasada-2-los-gaps-de-herramienta-y-el-test-que-faltaba-kit-base-v1974)
- [7.21 Las trampas y los métodos de "Seguridad de la información" (kit-base v1.9.75)](#721-las-trampas-y-los-métodos-de-seguridad-de-la-información-kit-base-v1975)
- [7.22 Cinco tests nuevos: la suite pasa de 10 a 15 (kit-base v1.9.76)](#722-cinco-tests-nuevos-la-suite-pasa-de-10-a-15-kit-base-v1976)
- [7.23 Las piezas que los cursos venían inventando (kit-base v1.9.77)](#723-las-piezas-que-los-cursos-venían-inventando-kit-base-v1977)
- [7.24 El visor de documentos: la pieza más grande del relay (kit-base v1.9.78)](#724-el-visor-de-documentos-la-pieza-más-grande-del-relay-kit-base-v1978)
- [7.25 Última pasada: el chrome en teléfono, el test de zoom, y uno que NO entró (kit-base v1.9.79)](#725-última-pasada-el-chrome-en-teléfono-el-test-de-zoom-y-uno-que-no-entró-kit-base-v1979)
- [7.26 Revisión general: que el curso nuevo no pueda olvidarse de nada (kit-base v1.9.80)](#726-revisión-general-que-el-curso-nuevo-no-pueda-olvidarse-de-nada-kit-base-v1980)
- [7.27 El molde de los simuladores: un tipo de curso nuevo sube entero al kit (kit-base v1.9.81)](#727-el-molde-de-los-simuladores-un-tipo-de-curso-nuevo-sube-entero-al-kit-kit-base-v1981)
- [7.28 Lo que la auditoría del relay del simulador encontró aparte (kit-base v1.9.81)](#728-lo-que-la-auditoría-del-relay-del-simulador-encontró-aparte-kit-base-v1981)
- [7.29 La vuelta de iPad: 5 parches relayados, 1 ya estaba y 2 venían con un defecto adentro (kit-base v1.9.82)](#729-la-vuelta-de-ipad-5-parches-relayados-1-ya-estaba-y-2-venían-con-un-defecto-adentro-kit-base-v1982)
- [7.30 Segunda vuelta de iPad: el video que arrancaba tarde, el chrome para dedos y un botón que mentía (kit-base v1.9.83)](#730-segunda-vuelta-de-ipad-el-video-que-arrancaba-tarde-el-chrome-para-dedos-y-un-botón-que-mentía-kit-base-v1983)
- [7.31 Puesta al día: tres hallazgos que encontraron los tests, y una revisión general (kit-base v1.9.84)](#731-puesta-al-día-tres-hallazgos-que-encontraron-los-tests-y-una-revisión-general-kit-base-v1984)
- [7.32 El chrome no salía igual en todos los cursos: tres bugs, y los tres eran del kit (kit-base v1.9.85)](#732-el-chrome-no-salía-igual-en-todos-los-cursos-tres-bugs-y-los-tres-eran-del-kit-kit-base-v1985)
- [7.1 Método de arranque con zip de referencia (kit-base + PDF + curso completo)](#71-método-de-arranque-con-zip-de-referencia-kit-base-pdf-curso-completo)
- [7.2 Generar la evaluación para Moodle](#72-generar-la-evaluación-para-moodle)
- [7.3 Checklist de consistencia de diseño — no reintroducir estos bugs](#73-checklist-de-consistencia-de-diseño-no-reintroducir-estos-bugs)
- [8. Kit master — estado actual](#8-kit-master-estado-actual)

---

## 0. Qué es un curso de este molde

Un solo `index.html` (SCORM 1.2, un SCO), **sin scroll de página**,
diapositivas a pantalla completa, en una **proporción panorámica fija**
(ver §2 para cuál usar y por qué — la resolución EXACTA en píxeles del
PDF de Illustrator puede cambiar entre clientes/rondas sin afectar nada
del código, siempre que se respete esa proporción). Solo **modo claro**.
Narración automática por voz. Progreso guardado en `cmi.core.suspend_data`
con bookmark de reingreso.

Tres niveles de estado (contrato fijo de `motor-slides.js`, ver
`spec-motor-slides.md`):

| Nivel | Qué es | Ejemplo |
|---|---|---|
| **Diapositiva** | Pantalla completa, una visible a la vez (`[data-slide][data-slide-index]`) | portada, índice, unidad 1... |
| **Capa** | Bloque que cambia dentro de una diapositiva, sin salir de ella (`[data-layers]`/`[data-panel]`/`[data-target]`) | tabs de conceptos, un caso por vez, una pregunta por vez |
| **Pop-up** | Overlay con fondo oscurecido (`[data-popup-trigger]`/`[data-popup]`) | instrucciones, repasos "Lo que vimos", logros |

---

## 0.1 Regla dura: `kit-base/` se edita en UN solo lugar — nunca desde una sesión de curso

**Si estás leyendo esto DESDE una sesión de curso** (el flujo normal:
zip de `kit-base/` + PDF, sin repo, un chat nuevo por curso) — esto te
aplica directamente, seguí leyendo antes de tocar ningún archivo
"genérico".

**La sesión de un curso nunca es el lugar donde `kit-base/` se corrige
de forma definitiva**, aunque ahí mismo se detecte el bug, se entienda
la causa raíz y hasta se aplique el fix. Podés (y a veces tenés que,
para no bloquear la entrega de ESE curso) parchear tu copia local —
pero ese parche no es la fuente de verdad de nada más que ese zip.

**Por qué esta regla existe — el costo real que tenía la versión
vieja del mecanismo, documentado en §6.17/§6.17.2**: una sesión de
curso encontraba y arreglaba un bug real del kit, lo aplicaba a su
copia local, entregaba el curso... y el `kit-base/` "canónico" nunca
se enteraba — el fix quedaba atrapado en un zip aislado. El próximo
curso arrancaba con el mismo bug, otra vez, porque nada garantizaba
que alguien lo trajera de vuelta a mano. Pasó más de una vez (§6.17,
§6.17.2, §6.18) antes de que esto se formalizara.

**Dónde vive la copia canónica** (desde v1.9.99): en la rama
`claude/kit-base` del repo `cotoaprendizaje/superplannercoto` —una rama
huérfana, exclusiva del kit, que no comparte historia con el
Superplanner—. Cada versión entregada es un commit ahí. Antes el kit
vivía solo en el contenedor de la sesión del kit y **se perdió dos
veces** con un reinicio; hubo que re-subirlo desde un zip. Una sesión
nueva del kit arranca clonando esa rama, no pidiendo el zip. (Los tags
de versión no pasan el proxy de las sesiones en la nube: la versión
está en el mensaje del commit y en `package.json`.)
Una sesión de CURSO sigue sin tocar esa rama: relaya, como dice abajo.

**Cada curso sabe de qué versión del kit es** (desde v1.9.102, §7.51):
`kit-version.json` en la raíz del curso, con una huella de cada archivo
del kit. Para una sesión de curso eso cambia dos cosas: (1) si toca un
archivo del kit para no frenar la entrega, `kit-intacto` lo va a marcar
en rojo —es a propósito: ese cambio tiene que viajar como relevo—; y (2)
para ponerse al día NO se copian archivos a mano: se corre
`node <kit>/tools/actualizar-kit.mjs <curso>`, que muestra el plan, y con
`--aplicar` lo hace respaldando todo en `.kit-anterior/`.


**El mecanismo, en 4 pasos:**

1. Durante una sesión de curso, cualquier cosa que surja y NO dependa
   de contenido de ESE curso (criterio ya fijado en §1: "¿esto lee
   algo del curso? si no, es del kit") es candidata a subir. **La
   sesión de curso relaya el SÍNTOMA y, si lo tiene, el diagnóstico —
   nunca un "fix ya aplicado" ni un número de versión de destino.**
   Motivo (documentado en §6.64): dos veces ya un hallazgo relayado
   como "ya corregido contra la vX.Y" resultó, al auditarlo acá, no
   corresponder a código real (1/6 puntos una vez, 6/7 la otra). Un
   parche local de ESE curso puede incluirse como referencia de lo que
   se probó, pero el diseño y el fix definitivo se hacen en este chat,
   una sola vez, contra el código real — no se copian a ciegas.
2. **Ese hallazgo se lleva, en un prompt, al chat dedicado exclusivamente
   a mejorar `kit-base/`** (este chat/documento es esa fuente de
   verdad) — nunca se da por "ya resuelto" solo porque la copia local
   del curso lo tiene.
3. En el chat dedicado: el hallazgo se **verifica contra el código
   REAL del kit** (nunca se aplica un diff a ciegas solo porque "así
   lo pasaron" — puede haber cambiado desde que se escribió el
   hallazgo), se aplica, se prueba (suite completa contra una copia de
   un curso corriendo el kit modificado — nunca alcanza con correr la
   suite contra el curso tal cual, que sigue usando SU copia vieja del
   CSS/JS) y se documenta acá (sección nueva, más changelog + versión
   en `kit-base/README.md`). **Si cambia una regla, también
   `MANUAL-DEL-MOLDE.md` en la misma versión** (§7.53). Y la suite se
   corre contra los dos cursos: el del arnés y `sh curso-prueba/probar.sh`
   (§7.55).
4. El `kit-base.zip` que sale de ESE chat, ya actualizado, es el que
   arranca el próximo curso — nunca un zip parcheado a mano desde una
   sesión de curso.

**Consecuencia práctica para el checklist de arranque (§7) y de
cierre**: los pasos que decían "actualizar `kit-base/`" o "releer este
archivo y editarlo" ya NO se hacen desde la sesión de curso — se hacen
acá. Ver la nota en cada paso.

**Dos zips con el mismo número NO son el mismo zip** (aprendido en
v1.9.53/§6.70, cuando dos chats de kit habían usado `v1.9.43` para
cosas distintas). El número de versión NO alcanza como identidad: si
dos ramas del kit avanzaron en paralelo, "los dos estamos en 1.9.43"
se LEE como sincronizado y no lo está. Consecuencias operativas:

- **Antes de fusionar dos kits, comparar contenido, no números**:
  `diff` de la lista de archivos + `grep` de los símbolos concretos
  que cada lado dice tener (nombres de función/clase reales, no
  secciones de changelog). El choque de v1.9.43 no se detectó
  comparando versiones — se detectó aplicando el kit sobre el curso
  real y viendo el marcado roto.
- **Un `§6.6x` a secas ya no identifica nada en un relay** entre
  chats: las secciones de dos `CLAUDE.md` no se corresponden. Citar
  siempre el símbolo real (`.d-mj-hotspot`, `_syncGate`) además del
  número de sección.
- **No renumerar retroactivamente** para "arreglar" un choque:
  reescribe un historial que el otro lado ya citó. Se registra el
  choque y se sigue.

---

## 1. Qué es genérico (se copia tal cual) vs. qué es del curso

Esta separación es la que hace posible el "gen". Al arrancar un curso
nuevo, los archivos de la columna izquierda **se copian sin tocar** (o
con cambios triviales de nombre de archivo); todo el trabajo real pasa
por la columna derecha.

⚠️ **Y hay reglas de producto que valen para TODOS los cursos aunque lo
que gobiernan sea contenido.** La primera, fijada por el cliente en
v1.9.97: **el catálogo de logros lo define el curso, con un máximo de 5**.
El catálogo es contenido —lo dice `coto-logros.js` en su cabecera, y está
bien— pero el tope no lo es, y hasta esa vuelta no lo sostenía nada: un
curso podía declarar 8 y la suite entera pasaba en verde. Ahora lo
verifica `tools/tests/gamificacion.mjs`. Si dos logros miden lo mismo
partido en dos, fusionarlos es lo que hizo el curso que fijó la regla.

| Genérico — no sabe nada del contenido | Específico del curso |
|---|---|
| `css/coto-base.css` — sistema de diseño (tokens, tipografías, categorías, `.alert`, `.modal`) | `css/assets.css` — capas `.d-shot-*` de ESTE curso |
| `css/coto-base-addendum-v1.8.css` — componentes "Learning" (tabs, stepper, carrusel, radial...) | `css/diapositivas.css` — layout de ESTAS diapositivas |
| `js/motor-slides.js` — motor de diapositivas/capas/pop-ups + hitboxes (`_initShots`, ver §2) | `css/pulido.css` — ajustes finales de coherencia de ESTE curso |
| `js/scorm-api.js` — wrapper SCORM 1.2 | `js/curso.js` — contenido, gamificación, narración, minijuegos |
| `js/xapi.js` — adaptador xAPI en paralelo | `imsmanifest.xml` — título/identificador de ESTE curso |
| `js/fx.js` — ripple, partículas, modo cine, efectos genéricos | `img/`, `video/` — assets exportados de ESTE PDF |
| `js/narrador.js` — voz + `textOf()` (qué texto narrar de un contenedor) | secciones de test que verifican texto/flujo propios del curso |
| `js/coto-player.js` — chrome del reproductor (saludo, toggles, voz, barra, toast, retomar) | |
| `js/coto-media.js` — los 3 patrones de video (fondo, pop-up, circular en el lugar) | |
| `js/coto-ui.js` — narración de pop-ups, entrada escalonada, count-up, precarga, sonidos, tiempo activo | |
| `js/coto-hotspots.js` — zonas sobre el arte que revelan información (§6.10.7) | |
| `js/coto-quiz.js` / `js/coto-cierre.js` — mini-práctica y cierre con festejo | |
| `tools/tests/*.mjs` (excepto los que auditan contenido puntual) | |

**Regla hermana, aprendida cuatro veces:** cuando un JS sube al kit,
**su CSS tiene que subir en la misma vuelta**. Pasó en v1.4, v1.6, v1.7
y v1.8: el síntoma siempre es un archivo del kit que usa clases que el
kit no define, así que "funciona" solo mientras se copie también el CSS
del curso anterior. Para verificarlo: comparar todas las clases `.d-*`
del CSS propio del curso contra las del kit y revisar una por una las
que no aparezcan.

**Regla al escribir código nuevo:** si una función no lee nada
específico del curso (no conoce IDs de diapositivas, textos, ni
lógica de puntaje) y solo opera sobre atributos `data-*` genéricos,
**va en el kit, no en `curso.js`**. Así el próximo curso la hereda
gratis. Desde el kit v1.7 hay un archivo para cada familia (motor,
narrador, player, media, ui, quiz, cierre, fx) — la pregunta al
escribir algo nuevo ya no es "¿lo dejo en curso.js?" sino "¿a cuál de
estos pertenece?". Lo único que debería quedar en `curso.js` es
**contenido**: textos, banco de preguntas, lógica de puntaje, IDs de
diapositiva y el cableado entre módulos. `initShots()` (hitboxes sobre
diapos-captura) ya vive en `motor-slides.js`
(`Motor.prototype._initShots`, corre solo desde `new Motor()`, igual
que las marcas de sección de la barra de progreso) — es el ejemplo a
seguir. `initConceptShots()` (precarga/swap de las 7 variantes de
imagen de conceptos) se QUEDÓ en `curso.js` a propósito: aunque el
patrón "tabs que cambian la imagen de fondo" es reusable, la función tal
como está tiene hardcodeados los nombres de los 7 conceptos de este
curso — si un curso futuro repite el patrón, generalizarla recién ahí
(parametrizar la lista de variantes), no antes.

**Narración de contenido con render propio en JS (minijuegos, práctica,
laboratorios):** si una diapo arma su contenido con `el.innerHTML = …`
en vez del sistema de capas (`[data-layers]`/`[data-panel]`), el motor
NO se entera de los cambios (no hay `layerchange`) y la narración se
queda muda después del primer nivel/pregunta. Regla: cada función que
re-pinta ese contenido (`render()`, `renderQ()`, etc.) tiene que
terminar con un llamado a `speak(...)` propio, guardado con
`if (narrating) { … if (!slideEl.hidden) speak(...) }` (el guard de
`hidden` evita narrar en el render() inicial de `boot()`, con la diapo
todavía oculta). Ver `initMinijuego`/`initQuiz` en curso.js del curso
base para el patrón exacto.

---

## 2. El patrón central: `.d-shot-slide--bg-layered`

Es la técnica que permite fidelidad 1:1 con la maqueta de Illustrator
sin recodificar cada diapositiva a mano.

1. **Del PDF exportado se sacan 2 capas por diapositiva** (o una sola
   si no hace falta separar):
   - **`bg-*.webp`** — el fondo completo de la página, a sangre.
   - **`img/<slide>/*.webp`** — piezas de contenido con **alfa real**
     (texto, tarjetas, personajes) recortadas del mismo PDF, que se
     posicionan como capas independientes encima del fondo.
   - Fondo y contenido deben quedar **registrados pixel a pixel**: es
     la misma imagen partida en dos. No mover una capa sin la otra
     (se probó parallax de solo-fondo y se sacó por esto — desalinea
     la costura al instante, ver README del curso base).
2. **HTML:** `.d-shot-bg` (fondo) + `.d-shot-img` (imagen base o de
   contenido) + N `.d-anim-item[data-hit]` (piezas sueltas) dentro de
   un contenedor `[data-shot]`.
3. **Posicionamiento:** cada pieza lleva `data-l/data-t/data-w/data-h`
   en **porcentaje contra el tamaño REAL mostrado de la imagen base**
   (no contra el contenedor). `initShots()` recalcula esto en cada
   resize/orientationchange leyendo `naturalWidth/Height`,
   `clientWidth/Height` y el `object-fit`/`object-position`
   **computados** (no asume `cover`+centrado):
   - `contain` → `scale = min(boxW/natW, boxH/natH)`
   - `cover` → `scale = max(boxW/natW, boxH/natH)`
   - offset según `object-position` real (0%=pegado al borde,
     50%=centrado, 100%=pegado al otro borde — misma fórmula que usa
     el navegador).
4. **Cuándo usar `cover` en vez de `contain`:** por defecto `contain`
   (la captura se ve entera, sin recortar). Usar `cover` con
   `object-position` explícito solo cuando hace falta sangrar 100%
   sin banda gris **y** hay margen de sobra de un lado para absorber
   el recorte sin comerse elementos clickeables (ver diapo de
   conceptos: `cover` + `0% 50%` porque las pestañas están pegadas al
   borde izquierdo, así que el recorte se come del derecho).
5. **Resolución de origen del PDF:** el sistema entero trabaja en
   **porcentajes**, nunca en píxeles absolutos del PDF. Cambiar la
   resolución de exportación de Illustrator **no requiere ningún cambio
   de código**, siempre que se mantenga la MISMA proporción — eso es lo
   que permite pasar de un tamaño en px a otro sin tocar una línea. Lo
   que sí importa mucho es **cuál proporción elegir**: ver el punto 6.
6. **Qué proporción usar (y por qué NO 21:9):** 21:9 (2,33:1) se probó
   en "Surtido sin venta" y resultó **más panorámica que cualquier
   pantalla real**. Con el header/footer del curso descontados (~120px),
   las resoluciones típicas dan: 1920×1080 → 2,00 · 1366×768 → 2,11 ·
   1440×900 → 1,85 · 2560×1440 → 1,94. Ninguna llega a 2,33. Resultado:
   con `contain` (nunca recorta) siempre sobra franja vacía arriba/abajo
   en cualquier pantalla real; con `cover` (llena siempre) el recorte
   varía según la ventana y en el peor caso se come contenido real (pasó
   en la diapo de "Rotación": la leyenda "Baja rotación" quedaba
   cortada). **Usar 2:1** como proporción de trabajo — está mucho más
   cerca del promedio real (~1,9–2,1) y reduce la franja/el recorte a
   casi nada en la inmensa mayoría de las pantallas.
   **Margen de seguridad (actualizado desde "Prevención
   cardiovascular" en adelante — ver §6.9 para el porqué): 8% arriba/
   abajo + 13% a cada costado**, sin texto/botones/logos ahí (solo
   fondo o decoración) — así el recorte residual en pantallas atípicas
   de escritorio (ultrawide, etc.) Y en tablets (ver `coto-shot-stage.css`,
   §6.9) nunca se comen contenido real. El margen lateral es más grande
   que el vertical a propósito: el recorte en tablet es siempre lateral,
   nunca arriba/abajo (ver §6.9). Instrucción lista para pasarle al
   diseñador/editor de video: 2:1 exacto (ej. 2520×1260 para el PDF,
   mismo criterio para los videos), con ~330px de margen horizontal
   (13%, a cada lado) y ~100px vertical (8%, arriba y abajo) — a esa
   resolución — libres de contenido importante en los bordes.
   **Cursos ya diseñados con el margen viejo (8% parejo en las 4
   direcciones, ej. "Surtido sin venta") siguen usando ese margen sin
   cambios** — esta instrucción nueva es para el PRÓXIMO PDF que se le
   pida al diseñador, no retroactiva.
7. **El contenedor tiene que estar fijado a la MISMA proporción que el
   PDF — si no, todo lo anterior no sirve.** Bug real encontrado: el
   `.d-shot` (la caja que contiene fondo+captura+hitspots) se dejó en
   `width:100%; height:100%` de `.slide`, que a su vez ocupa TODO el
   espacio libre entre header y footer — o sea, la forma real de la
   ventana del alumno, casi nunca la proporción del diseño. Con
   `object-fit:cover` eso escala/recorta una cantidad *distinta según
   cada ventana*, nunca la prevista. **Solución (CSS puro, sin JS):**
   fijar `.d-stage` como *size container* (`container-type: size`) y
   usar el doble `min()` con unidades `cqw`/`cqh` (a diferencia de
   `%`/`vw`/`vh`, SÍ se pueden combinar en el mismo `calc()`) para que
   `.d-shot` sea SIEMPRE la proporción exacta del diseño, con
   letterbox/pillarbox automático si la ventana no calza:
   ```css
   .d-stage { container-type: size; }
   .d-shot-slide--bg-layered > .d-shot,
   .d-shot-slide--bg-video > .d-shot {
     aspect-ratio: 2 / 1; /* la proporción elegida en el punto 6 */
     width:  min(100cqw, 100cqh * 2 / 1);
     height: min(100cqh, 100cqw * 1 / 2);
     margin: auto;
   }
   ```
   Con esto, `cover` recorta SIEMPRE la misma cantidad prevista por el
   diseño (nunca más), en cualquier ventana — es lo que hace que el
   margen de seguridad del punto 6 sea una garantía real y no una
   esperanza. **Validado con "Surtido sin venta" v2** (PDF 2520×1260,
   exacto 2:1): recorte real = 0 en todas las ventanas probadas, no hizo
   falta ajustar el margen de seguridad del 8%.
8. **Con imagen y contenedor EXACTAMENTE a la misma proporción, `cover`
   no recorta nunca** (recorte = 0 matemáticamente, no "en la práctica").
   Esto cambia el cálculo de costo/beneficio del punto 3 de §3: si el
   PDF se exporta ya a la proporción de trabajo exacta (§2.6), separar
   fondo+piezas en capas con alfa deja de ser necesario para "que no se
   recorte nada" — esa garantía ahora la da la proporción exacta, no el
   `bg-layered` con piezas sueltas. Ver §3 punto 3 (versión actualizada)
   y el nuevo criterio por defecto: **captura íntegra único**, reservar
   piezas separadas solo para necesidades reales de interacción/animación
   por pieza.
9. **Margen de seguridad ampliado para tablets (nuevo desde
   "Prevención cardiovascular" en adelante — NO aplica a cursos ya
   diseñados con el margen viejo, ver §6.8/§6.9):** el lienzo fijo 2:1
   garantiza cero recorte, pero en tablets (proporción de pantalla más
   angosta que 2:1) deja una franja vacía arriba/abajo bastante más
   grande que en desktop — reporte real de uso probando "Surtido sin
   venta" en tablet. La franja no se puede eliminar sin permitir ALGÚN
   recorte en ese rango de proporciones — la solución no es más código,
   es diseñar el PDF con más margen vacío a los COSTADOS (el recorte en
   tablet siempre es lateral, nunca arriba/abajo, ver razonamiento
   completo en §6.9) para poder recortar ahí con seguridad.
   **Instrucción nueva para el diseñador**: margen de seguridad
   **8% arriba/abajo (sin cambio) + 13% a cada costado** (antes 8%
   parejo en las 4 direcciones). Implementado en
   `kit-base/css/coto-shot-stage.css` — lienzo fijo 2:1 en pantallas
   cercanas a esa proporción (≥1.9), lienzo a pantalla completa
   (recortando dentro del margen de 13%) en el rango de tablet
   protegido (1.5–1.9), vuelve al lienzo fijo (letterbox) fuera de ese
   rango. **Ojo con la proporción que hay que medir**: no es la
   proporción cruda del dispositivo/viewport — hay que restar el alto
   fijo del header+footer del área real de la diapositiva. Un iPad "es"
   4:3 (1.33) pero el `.d-stage` real en un iPad landscape mide
   ≈1.58 — confundir estos dos números fue el error real de la 1ª
   pasada de este cálculo (se había calculado con la proporción del
   dispositivo, no la del `.d-stage`, dando un margen sobrestimado de
   17% en vez de los 13% reales necesarios).

---

## 3. Flujo: de "PDF de Illustrator" a curso terminado

Este es el proceso que el cliente/vos van a repetir en cada curso
nuevo. Documentarlo acá es el punto central de este archivo.

1. **Recibir el PDF exportado de Illustrator** (una página por
   diapositiva, en la proporción de trabajo vigente — ver §2.6, hoy
   **2:1**, con margen de seguridad de **8% arriba/abajo + 13% a los
   costados** (desde "Prevención cardiovascular" en adelante — ver
   §6.9; cursos anteriores usan el margen viejo, 8% parejo) — con
   todas las diapositivas del guion ya diagramadas — portada, índice,
   contenido, cierre, etc). Mismo criterio de proporción + margen para
   los videos que entregue el cliente (ver §2.6 para la instrucción
   exacta a pasarle al diseñador y al editor de video).
2. **Renderizar cada página a `.webp`** a la resolución de trabajo
   vigente (el valor exacto en píxeles no importa, lo que importa es
   respetar la proporción — ver §2.5/§2.6).
3. **Para cada diapositiva, decidir (criterio actualizado desde "Surtido
   sin venta" v2 — ver §2.8):**
   - **Por defecto: captura íntegra** — una sola imagen (`.d-shot-img`)
     con TODO el contenido de la página horneado, sin `.d-shot-bg` ni
     piezas `.d-anim-item` separadas. Con el PDF exportado exacto a la
     proporción de trabajo (§2.6), `cover` no recorta nada, así que no
     hace falta la separación fondo/piezas para garantizar fidelidad.
     Encima de la imagen van solo los elementos HTML que necesitan ser
     REALMENTE interactivos: botones invisibles (`.d-shot-hit`) sobre
     zonas clickeables (play de video, tarjetas de pop-up, tabs que
     cambian de imagen completa — ver diapo "conceptos"), con `alt`/
     `sr-only` para accesibilidad y narración. Es el patrón que ya usan
     "conceptos" y "cierre" desde el origen del curso base.
   - **Excepción — piezas separadas con alfa (`bg-layered` "clásico",
     fondo + `img/<slide>/*.webp` con alfa real):** usar SOLO cuando la
     diapo necesita animar la ENTRADA de piezas individuales por
     separado (stagger tipo "armado en cámara") y ese efecto no se puede
     lograr con CSS puro sobre un overlay HTML de texto encima de la
     imagen íntegra. Requiere que el diseñador exporte cada pieza como
     capa Illustrator independiente con alfa — más trabajo de exportación
     y más superficie de bugs (posicionamiento % por pieza, registro
     pixel a pixel fondo/pieza) que la captura íntegra. Pensar dos veces
     antes de pedirlo: casi siempre alcanza con captura íntegra + stagger
     CSS sobre un `<div>` de texto real superpuesto.
4. **Extraer coordenadas de hitboxes** (`data-l/t/w/h`) midiendo la
   posición de cada elemento clickeable como % del lienzo completo.
   **Regla dura, aprendida en "Surtido sin venta" v2:** si el cliente
   reexporta un PDF ya existente (mismo contenido, "mismo layout" a
   simple vista, nueva proporción o nueva resolución), **remedir SIEMPRE
   las coordenadas contra el render nuevo, nunca reusar las % viejas**
   — aunque el elemento clickeable esté dibujado DENTRO de la imagen
   (como las píldoras de "conceptos", horneadas en el PDF, no HTML). Un
   reflow de layout menor entre versiones (por Illustrator, por el
   diseñador ajustando márgenes) desplaza esos elementos unos puntos %
   y las zonas de clic quedan pisando el borde del vecino — bug real
   encontrado en las 7 pestañas de "conceptos" al pasar de 21:9 a 2:1:
   se veían bien (el resaltado activo está horneado en la imagen) pero
   el click real caía corrido. Detectarlo a simple vista es difícil
   porque el arte se ve perfecto; hay que medir en píxeles (script
   Python con PIL: escanear filas/columnas no-blancas para encontrar
   el borde real de cada pieza) o superponer un overlay de debug con
   Playwright (dibujar `getBoundingClientRect()` de cada `[data-hit]`
   en rojo sobre un screenshot) y comparar visualmente contra el arte.
   Vale para CUALQUIER curso con capas/hitboxes sobre imagen — no es
   un caso aislado de este curso, va a repetirse en todos.
5. **Escribir el HTML de la diapositiva** siguiendo el contrato del
   motor (`[data-slide]`, `[data-layers]` si aplica, `[data-popup]`
   si aplica) + capas `.d-anim-item[data-hit]`.
6. **Texto real siempre como HTML accesible encima de la imagen**
   (nunca solo dentro del webp): `<h1>/<h2>` oculto (`sr-only`) con
   el título real, botones invisibles sobre las hitboxes con texto
   accesible, `alt=""` + `aria-hidden="true"` en las imágenes
   puramente decorativas.
7. **Narración:** todo texto leído en voz alta pasa por `speechify()`
   antes de `speechSynthesis` (corrige siglas — ver §5) — nunca se
   toca el `alt` visible/accesible, solo lo que se dice.
8. **Gamificación que no tiene página en el PDF** (minijuegos,
   laboratorios interactivos, evaluación) se construye como interfaz
   propia con el sistema de componentes COTO (`coto-base.css` +
   addendum), no como captura — documentar la decisión en el README
   del curso bajo "decisiones que se apartan del brief".

   **⚠️ Obligatorio en TODO curso, no opcional (regla fija del
   cliente desde "Uso de Sucursales 3 - NOA" — ver §6.17.1):**
   logros + puntos (chip del header + `initCierreCelebration` con
   medalla real), glosario con términos del curso, al menos una
   mini-práctica/quiz (`coto-quiz.js`), y que las interacciones del
   curso (hitboxes, hotspots, videos vistos) sumen puntos de verdad,
   no queden en "gate sin premio". Si un curso puntual no tiene
   contenido natural para alguna de estas piezas (ej. no hay términos
   técnicos para un glosario), **no se saca el elemento en silencio**
   — se arma con lo que haya (aunque sea un glosario corto) o se lo
   consulta explícitamente con el cliente antes de entregar sin él.
   Ver §6.17.1 para el caso real que disparó esta regla.
9. **Placeholders de video:** si el cliente todavía no entrega los
   videos finales, dejar archivos placeholder con el **nombre exacto**
   que van a tener los reales, mismo `src` en el HTML — el cliente
   reemplaza el archivo sin tocar código. **Ojo con nombres de archivo
   con tildes/ñ al armar el zip de entrega**: en este entorno, `zip`
   sin forzar codificación (o con locale no-UTF-8) puede guardar el
   nombre mal (ej. "Cómo" queda como "C#U00f3mo") y se ve roto en
   Windows/7-Zip aunque en el visor de acá parezca normal. Antes de
   entregar, generar el zip forzando el flag UTF-8 en cada entry
   (con Python: `zipfile.ZipInfo` + `zi.flag_bits |= 0x800`) y
   verificarlo reabriendo el zip y chequeando ese flag — no confiar en
   que "se ve bien" en el propio listado.
   ⚠️ **Trampa de `zipfile`**: poner `flag_bits` en el `ZipInfo` ANTES
   de `writestr()` **no sirve** — `_open_to_write()` lo pisa con `0x00`
   internamente. Hay que volver a ponerlo recorriendo `z.filelist`
   DESPUÉS de escribir todo y ANTES de `z.close()` (que es cuando se
   escribe el directorio central, el que leen los descompresores).
   El `assert` de verificación al final atrapa exactamente esto.
10. **Correr la suite de tests** (`tools/tests/`, ver §6) antes de
    dar por cerrado el curso.
11. **`imsmanifest.xml`:** clonar el de un curso anterior, cambiar
    `identifier`/`title`/`ORG_ID`/`ITEM_ID`/`RES_ID` y el criterio de
    completado (¿hay evaluación calificada dentro del SCO o es un
    cuestionario aparte en Moodle? — no declarar `masteryscore` si no
    corresponde).
12. **Nunca entregar el zip final sin que el cliente/vos lo pida
    explícitamente** — regla fija de proceso, no técnica.
13. **`loading="lazy"` en TODO `.d-shot-img` salvo la primera
    diapositiva** (kit-base v1.9.48). Cada diapositiva es un `.webp`
    de página completa (~100-250 KB) y las secciones `[data-slide]`
    ya están todas en el DOM desde el arranque — sin este atributo el
    navegador pide las ~25-30 imágenes de un curso típico ENTERAS al
    cargar la página, aunque el alumno nunca pase de la diapositiva 3.
    `initPrefetchNeighbors()` (`coto-ui.js`) ya evita el parpadeo al
    navegar (precarga la vecina siguiente/anterior con `slidechange`)
    — pero eso es una optimización SOBRE una carga que, sin este
    atributo, ya fue 100% eager desde el HTML. Confirmado con
    Playwright que las dos piezas cooperan bien: (1) con la geometría
    real del motor (`[data-slide]{position:absolute;inset:0}`), un
    `<img loading="lazy" hidden>` NO se pide al cargar la página y SÍ
    se pide en cuanto `_syncNav()` saca el `hidden` de su diapositiva;
    (2) el prefetch de `initPrefetchNeighbors()` usa `new Image()` —
    un objeto aparte del `<img>` real del DOM, así que el atributo
    `loading` no lo afecta, y al llegar a esa diapositiva el
    navegador sirve la imagen desde caché en vez de re-pedirla.
    **Esto tiene que ir en el HTML que arma cada curso** — kit-base no
    genera el marcado de las diapositivas, así que no hay forma de
    aplicarlo retroactivamente desde acá: agregarlo vía JS después de
    que el HTML ya parseó NO sirve (verificado: el navegador ya
    disparó el pedido de red mucho antes de que corra cualquier
    `<script>`, aunque el script le asigne `loading='lazy'` al toque).
    La primera diapositiva queda afuera a propósito: es la única que
    el alumno ve sin haber navegado nunca, `loading="lazy"` ahí solo
    agregaría latencia sin ningún beneficio.

---

## 4. Sistema de diseño (`coto-base.css` + addendum)

- **`coto-base.css`** (versionado, ej. v1.1): tokens (`--brand`,
  `--cat`, `--surface`, `--line`, `--shadow-card`, `--r`...),
  tipografías del sistema, las categorías reales del manual (21 +
  2 excepciones de Zona E!), colores funcionales
  (éxito/advertencia/error/info) y `.alert`/`.modal` base. **No se
  toca por curso** salvo que falte un token real del manual.
- **`coto-base-addendum-v1.8.css`**: componentes de capa "Learning"
  que no están en la base pero se repiten entre cursos —
  `.tabs-v`/`.tabs-h`/`.stepper-h`/`.carousel`/`.toggle-seg`/
  `.radial`/`.alert-inline`. Depende de los tokens de la base, no
  redefine nada. **Cuándo agregar un componente acá vs. dejarlo en
  el CSS del curso:** si la pieza es genéricamente útil (un patrón de
  interacción, no un layout puntual de una diapositiva) y hay
  chance de que otro curso la necesite, sube al addendum;
  bump de versión + una línea en el header del archivo listando qué
  se agregó y en qué curso se detectó la necesidad.
- **Tipografías fijas:** Roboto (contenido), Faible (títulos/impacto),
  Raleway (detalles puntuales). `basis33` (pixel font) **solo** si el
  curso tiene un minijuego retro — no es parte del set base. **Anton
  SC y Unbounded están descartadas por decisión de cliente** (se
  probaron, no convencieron) — no reintroducirlas sin que lo pida
  explícitamente un cliente nuevo. Los `.woff2` reales (Faible-Black,
  Roboto ×4, Raleway ×2, con licencia del cliente) viven en
  `kit-base/fonts/` desde v1.6 — antes cada curso arrancaba con 404 en
  las fuentes hasta que alguien lo notaba.
- **Encabezado de pop-up: dos variantes, y la elección NO es estética.**
  `.modal-hd` (degradado de categoría, texto oscuro) es la de siempre;
  `.modal-hd--dark` (fondo sólido `--cat-strong`, texto blanco) se
  agregó en v1.6 para pop-ups de impacto. **Blanco sobre `--cat`
  (#1EB4BE) da 2.52:1 y NO pasa WCAG AA** — es el error fácil de
  cometer al querer "un header más lindo". Blanco sobre `--cat-strong`
  (#008296) da 4.53:1 y sí pasa. El navy #1E2D46 sobre el degradado da
  4.39-6.93:1, muy por encima del 3.0 que pide texto grande. Regla:
  **medir el contraste antes de invertir un color de header**, no
  después.
- **Las dos variantes de encabezado NO se mezclan dentro de un mismo
  curso.** Hallazgo visual real: quedaron 4 pop-ups con encabezado
  claro y 1 con oscuro, y la diferencia se leía como un error de diseño
  aunque las dos variantes fueran correctas por separado. **Es un
  problema de consistencia, no de accesibilidad** — hay que decir cuál
  es cuál al reportarlo, porque el arreglo es distinto. Al elegir una
  variante para un pop-up, aplicarla a TODOS.
- **`.modal-hd` es `position:sticky`** (v1.7): en un pop-up largo
  (glosario de 16 términos) el título se iba con el scroll y se perdía
  el contexto de qué se estaba leyendo.
- **Toda animación de entrada tiene que verse bien SIN animación.**
  `.d-stagger-in` arranca en `opacity:0` con `both`: si la regla global
  de `prefers-reduced-motion` (`*{animation:none!important}` en
  `coto-base.css`) no estuviera, un alumno con movimiento reducido
  vería el contenido **invisible**, no "sin animación". Vale para
  cualquier efecto de entrada nuevo: el estado visible nunca puede
  depender de que la animación efectivamente corra.
- `data-cat="<categoría>"` en `<body>` resuelve la paleta de esa
  categoría (Área Salón, etc.) contra las variables de la base.
- **Ícono de marca del curso en el header**: va como `<img>` real
  (`img/icono-<área>.webp`) — no como SVG inline improvisado. Lo
  entrega el cliente junto con el PDF; si todavía no llegó, dejar el
  archivo con el nombre final y reemplazarlo después sin tocar código
  (mismo criterio que los videos, §3.9).

---

## 5. Narración por voz

- Web Speech API (`speechSynthesis`), sin dependencias externas.
- Velocidad: **1.0x** para cualquier voz (kit-base v1.9.82, §7.29), más
  lo que el alumno elija en el slider del panel de "Ayuda". Antes había
  un ajuste por voz (1.22x/1.15x/1.0x) que se sacó: la misma locución
  corría a tres velocidades según el paquete de idioma instalado.
- Voz preferida: **la más cercana al argentino**, por cadena de códigos
  de idioma —es-AR → es-419 → es-US → es-UY → es-CL → es-MX → resto de
  Latinoamérica → es-ES última— con una voz puntual preferida DENTRO de
  su nivel (Google en es-US, Paulina en es-MX, Mónica en es-ES). Ningún
  atajo por dispositivo: uno que había para tablet salteaba la cadena
  entera y dejaba iPads hablando en peninsular (§7.29).
- `speechify(text)` corrige pronunciación de siglas/nombres propios
  ANTES de hablar (ej. PLU → "pe ele ú", GESCOM → queda plano) — es
  una función de mapeo simple, se extiende agregando pares
  sigla→pronunciación al diccionario interno, uno por curso según el
  vocabulario específico del contenido. **Nunca toca el `alt` o texto
  visible**, solo la copia que se le pasa al sintetizador.
- No lee el nombre del curso/marca ni títulos repetidos dentro del
  propio texto (se sacó por ruido/redundancia).
- Se narra sola cada diapositiva al entrar, con pausa siempre
  disponible; pop-ups y capas se narran solos al abrirse, se callan
  al cerrarse.
- **Una diapositiva que ES un video no se narra**, y eso no es un
  hueco a tapar: el video trae su propia locución y narrar encima sería
  contraproducente. Igual lleva su título real en `sr-only` para
  lectores de pantalla — o sea, queda muda pero NO queda inaccesible.
  Ojo al auditar: un test que cuente "diapositivas sin narración" va a
  marcarlas, y son correctas. Lo mismo hace `coto-media.js` al
  reproducir cualquier video (`Narrador.cancel()`): la voz nunca compite
  con el audio de un video.

---

## 6. Testing (`tools/tests/`, Playwright)

Suite mínima que debería existir en TODO curso de este molde antes de
entregar (los primeros 4 son genéricos — se adaptan solo en selectores
de IDs de diapositivas, no en lógica):

- `deep-audit` — recorrido completo, consistencia general.
- `full-regress` — regresión de principio a fin.
- `hitbox-click-check` — cada `[data-hit]` es clickeable y dispara lo
  esperado.
- `scroll-audit` — **cero scroll** en ninguna diapositiva, en un set
  de resoluciones/viewports.
- `keyboard-a11y` — recorrido 100% por teclado (flechas + Esc),
  indicador de foco visible, nombre accesible en todos los botones,
  `alt` en todas las imágenes, respeto de `prefers-reduced-motion`.
- `check-cierre-flow` (o equivalente) — específico del curso: valida
  el flujo de cierre/certificación puntual.

Antes de dar un curso por terminado: **correr toda la suite, 0 fallos.**

---

## 6.5 Manuales oficiales de marca y contenido (fuente de verdad)

El cliente entregó dos manuales oficiales — **`Manual_de_diseño.pdf`** (65
págs., cubre marca "Formación", sistema de color/tipografía por
categoría, estructura de curso) y **`Manual_de_Contenido.docx`** (guía de
redacción/tono) — leídos completos y contrastados contra
`coto-base.css`/`curso.js` reales (no contra suposiciones). Quedan como
la referencia oficial de acá en más; lo que sigue es el resumen
accionable, con lo ya cumplido marcado para no re-auditar de cero cada
vez.

### Colores por categoría — YA CORRECTO, no tocar

Se comparó cada uno de los 21+2 valores hex de `coto-base.css` contra la
tabla oficial del manual (paleta monocromática de 6 pasos por categoría,
p.26–27 — el color de marca/identidad de cada categoría es **Valor 3**).
**Coinciden exactamente** en las 15 Sucursales + 5 Central + Zona E! +
las 2 excepciones (Gourmet/Cumples) — `--cat` = V3, `--cat-strong` = V1,
`--cat-soft` = V5, `--cat-grad` = V2→V4 en las 15+5, consistente en
TODAS. Conclusión: **quien armó `coto-base.css` ya había leído bien el
manual** — no hace falta re-derivar nada. Al agregar una categoría nueva
que hoy no esté en el CSS, usar el mismo criterio (V3/V1/V5/V2→V4) leído
directo de la tabla del manual, no inventar valores.

### Tipografía — confirmado, con una escala de referencia nueva

Faible (Black, títulos) + Roboto (Regular/Medium/Bold/Black/Italic,
lectura) son exactamente lo que especifica el manual (p.9, p.23,
p.24). **Raleway no aparece en el manual** — no es una contradicción
(el manual simplemente no cubre "detalles puntuales"), se mantiene como
decisión propia del proyecto ya documentada en §4. Anton SC/Unbounded no
aparecen tampoco — consistente con el rechazo ya registrado.

Escala tipográfica oficial de Storyline 360 (p.24) — útil como
**referencia de jerarquía relativa** (título > subtítulo > destacado >
párrafo), no como valores px/rem literales a copiar 1:1: nuestro medio
es HTML responsive a pantalla completa, no un canvas fijo de Storyline,
así que el número de pt no traduce directo, pero la PROPORCIÓN entre
niveles sí debería respetarse:

| Uso | Fuente | Tamaño Storyline |
|---|---|---|
| Título del curso | Faible Black | 54pt |
| Bajadas de título | Roboto | 28pt |
| Título de diapositiva (sin contenedor) | Faible Black | 40pt |
| Título de diapositiva (con contenido) | Faible Black | 28pt |
| Subtítulos | Roboto Bold | 22pt |
| Destacados | Roboto Bold | 20pt |
| Párrafos | Roboto Regular/Bold/Italic | 18pt |

### Gaps reales del manual (no inventar reglas que no existen)

- **Logo:** las secciones "Usos permitidos/prohibidos/aplicación sobre
  fondos/convivencia con marcas" están en el índice pero las páginas
  salen en blanco en la extracción — no hay regla de tamaño mínimo,
  área de resguardo ni "qué no hacer" recuperable de este PDF. Si hace
  falta esa info, pedirla aparte al cliente, no asumir.
- **Margen de seguridad (nuestro 8%, ver §2.6):** el manual no define
  ningún grid/margen oficial — nuestra regla no está contradicha, pero
  tampoco corroborada por el manual; es una convención propia, no
  citarla como "del manual".
- **Colores funcionales (éxito/error/advertencia/info):** no existen en
  el manual — los que usamos son decisión propia, válida, pero no
  "cumplimiento de manual".
- **Border-radius/shadow numéricos:** el manual solo muestra
  botones/pills/tabs cualitativamente (sin valores px) — nuestros
  tokens `--r`/`--shadow-card` no se pueden validar ni invalidar contra
  esto.

### Reglas de contenido/redacción — nuevas, aplicar desde el próximo curso

Del `Manual_de_Contenido.docx`, reglas concretas que HOY no están
formalizadas en ningún lado del proceso (aplicar en cada curso nuevo,
revisar si corresponde retrofit en cursos ya cerrados):

- **Vos/nosotros mezclado según función**, no un solo registro fijo:
  "nosotros" para presentar contexto/tema ("vamos a aprender..."),
  "vos" para instrucciones concretas ("ingresá...", "seleccioná..."),
  vuelta a "nosotros" para retomar la explicación guiada.
- **Números siempre en dígitos**, nunca escritos en palabras — sin
  excepción de magnitud. ("Llevá 2 paquetes", no "Llevá dos paquetes".)
- **Lenguaje de género neutro para roles**: "el personal de Cajas" /
  "los colaboradores del sector", nunca "el cajero/la cajera". Aplica a
  todos los roles y sectores, siempre.
- **Objetivos de aprendizaje: exactamente 3**, cada uno arranca con un
  verbo en infinitivo de una lista aprobada (Identificar, Conocer,
  Aplicar, Detectar, Asumir — no repetir verbo entre los 3), progresión
  A: qué es → B: cómo funciona → C: cómo se aplica. "Entender" NO es un
  verbo válido (ejemplo del manual de qué evitar: "Entender el proceso
  de limpieza" está marcado como "vago, sin verbo de acción").
- **Últimos consejos: exactamente 5 tips**, siempre 2ª persona +
  imperativo, una oración corta cada uno, justo antes del cierre.
- **Mayúsculas de títulos**: sentence case (solo la primera palabra en
  mayúscula), excepto nombres propios, siglas y nombres de sector/
  sistema (Cajas, Salón, GESCOM, EMC, Track3...). Ojo: el "nombre
  completo" del curso en Moodle es la ÚNICA excepción — ese sí va con
  mayúscula por palabra (Title Case), a propósito, distinto del resto.
- **Punto final**: frase con verbo → lleva punto; título/etiqueta sin
  verbo → sin punto.
- **Negrita con criterio**: solo para el término clave que se define
  por primera vez, una acción crítica que no se puede saltear, o un
  número/código/nombre de sistema importante — "si hay demasiadas
  negritas en una diapositiva, ninguna llama la atención".
- **Nombres de botones/menús/campos entre comillas** en el texto Y en
  la narración: `hacé clic en "Guardar"`.
- **"Una idea por pantalla"**: si el colaborador no puede leer y
  retener el contenido en una sola pantalla, hay que partirlo — bloques
  de 3 a 5 elementos (de ahí que los objetivos sean 3, no 8).
- **Texto + imagen, nunca texto sobre texto**: la imagen tiene que
  aportar información, no decorar. (Esto respalda el patrón de captura
  íntegra: si el HTML pone texto real ENCIMA de una imagen que ya tiene
  texto horneado, se está violando esta regla — cuidado al decidir
  overlays de texto sobre capturas.)

### Narración obligatoria vs. opcional — RESUELTO en "Prevención cardiovascular"

El manual distingue narración **obligatoria** (título + párrafo
principal, se reproduce sola al entrar) de **opcional** (bullets/
tarjetas secundarias, con ícono de sonido que el colaborador aprieta si
quiere escucharlo — si no lo aprieta, sigue leyendo). Hasta el kit v1.6
el pipeline narraba TODO el texto accesible de una sola, sin distinguir
— quedaba anotado acá como decisión de producto pendiente.

**Se resolvió en el marcado, no con código nuevo** (kit v1.7,
`coto-ui.js` → `initPopupNarration`): el atributo **`[data-narrate-only]`**
acota qué se narra dentro de un pop-up. Si está, se narra solo ese
nodo; si no está, se narra el pop-up entero como siempre — o sea,
retrocompatible y opt-in por diapositiva.

**Caso real que lo disparó** (vale como criterio para decidir cuándo
usarlo): al ampliar el glosario a 16 términos, narrarlo entero pasaba
de ~50 segundos a **más de 3 minutos** de locución seguida. Un glosario
es material de **CONSULTA** — se abre para buscar un término puntual,
no para escuchar de corrido. Regla práctica: si el contenido del pop-up
se **consulta** (glosario, tabla de referencia, listado largo), narrar
solo la frase de entrada con `[data-narrate-only]`; si se **lee de
principio a fin** (una explicación, un repaso "Lo que vimos"), narrar
todo.

### Bug real confirmado: re-narrar la consigna fija en cada paso de una actividad multi-paso

Reporte real de uso (no del manual, feedback directo sobre "Surtido sin
venta" ya entregado): en **mini-práctica** (5 preguntas) y
**minijuego** (10 niveles), la narración repite la consigna/intro fija
completa CADA VEZ que se pasa a la siguiente pregunta/nivel, además de
narrar lo nuevo — molesto de escuchar 5 o 10 veces seguidas.

**Causa raíz encontrada en el código** (`curso.js` del curso base):
`narrateStep()` (minijuego) y el narrado de `renderQ()` (mini-práctica)
llaman a `speak(slideText(slideEl))` en cada re-render, y `slideText()`
concatena TODO el texto visible de la diapositiva (`.slide-lead, p, li,
dd`) — incluida la introducción fija que no cambia entre preguntas/
niveles, no solo el contenido nuevo del paso actual.

**Regla para el próximo curso** (aplicar en `curso.js`, patrón
genérico — no requiere cambios en `narrador.js`/motor): en cualquier
actividad de varios pasos dentro de la misma diapositiva
(mini-práctica, minijuego, laboratorio, o lo que venga), separar:
- **Narración de intro/consigna**: se narra UNA sola vez, al entrar a
  la diapositiva (ya cubierto por `speakCurrent()` en `slidechange`) —
  NO debe volver a incluirse en la narración de cada paso siguiente.
- **Narración por paso**: en cada `render()`/`renderQ()` posterior, se
  narra SOLO el contenido específico de ese paso (la pregunta N, el
  feedback, las opciones) — nunca el `.slide-lead`/párrafo introductorio
  de la diapositiva completa.

En la práctica: no reusar `slideText(slideEl)` (que barre TODA la
diapositiva) para narrar un paso individual — armar un texto acotado
solo con los nodos del paso actual (mismo criterio ya usado para el
laboratorio de falso stock con `[data-lab-text]`, ver `slideText()`:
ahí también se evitó traer de vuelta la consigna estática, esto es
extender ese mismo criterio a mini-práctica/minijuego, que hoy no lo
aplican). Pendiente aplicar en el próximo curso — no se tocó en
"Surtido sin venta" (cerrado); si se decide parchearlo ahí también,
hacerlo aparte como fix puntual, no como parte del kit.

### Tabla fonética oficial para narración — ampliar el diccionario

El manual trae una tabla oficial de reescritura fonética para TTS
(término original → cómo escribirlo en la locución, sin tocar el texto
visible), más amplia que el diccionario actual (`SPEECH_FIXES` en
`curso.js`, hoy solo PLU/GESCOM/EAN — específico de este curso):

| Término | Locución |
|---|---|
| Ticket | Tíquet |
| Enter | Énter |
| DNI | deneí |
| Multistore | Múltiestór |
| OK | okéy |
| Voucher | váucher |
| CRM | Ce erre eme |
| Power Apps | Pábuer áps |
| Call Center | Col Sénter |
| Online | onláin |
| STS | ese te ese |
| WEB | güeb |
| PLU | pe ele uh |
| Cashback | cáshback |
| PIN PAD | PíNPAD |
| Contactless | cóntact les |
| NFC | ene efe ce |

Confirma que el criterio actual de PLU (deletrear) es correcto y
avalado por el manual — aunque el texto exacto difiere ("pe ele uh" del
manual vs. "pe ele ú" que usamos hoy, variación menor, revisar si
conviene alinear literal). **Acción pendiente para el próximo curso**:
`speak()`/`speechify()` son 100% genéricos (wrapper de Web Speech API,
sin nada específico del curso) y HOY viven enteros en `curso.js` —
deberían migrar a `motor-slides.js`/`fx.js` (mismo criterio que
`initShots()`, ver §1), con esta tabla oficial como diccionario BASE
genérico, extendido por un array chico de términos propios en cada
`curso.js` (como hoy GESCOM, específico de "Surtido sin venta"). No se
tocó en el curso ya cerrado — es tarea para cuando se arranque el
próximo.

### Gap identificado, no bug: framing de prácticas/evaluaciones

El manual NO tiene ninguna regla sobre cómo hablar de errores/puntaje/
"esto no cuenta para la nota" — el fix que se hizo en un curso anterior
sobre esa frase fue un buen criterio propio, pero no está respaldado
por texto del manual (tampoco contradicho). Vale la pena sugerirle al
cliente que lo agregue como regla explícita a su propio manual de
contenido — hoy es una norma de equipo no escrita en ningún lado
oficial.

---

## 6.6 Rediseño de la barra superior (`.d-top`) — kit-base v1.1

Rediseño completo pedido por el cliente sobre "Surtido sin venta": la
barra tenía hasta 7 botones-ícono idénticos en fila sin agrupar, sin
texto, y el saludo del alumno no tenía lugar fijo. Quedó resuelto,
extraído al kit (`kit-base/css/coto-player-chrome.css` +
`kit-base/header-boilerplate.html`) y validado de forma aislada (ver
kit-base/README.md) — usar ese archivo tal cual en el próximo curso,
no repetir el proceso de diseño desde cero. Lecciones reales de esta
vuelta, todas con bug concreto encontrado y corregido:

1. **Centrado real vs. centrado matemático.** Un bloque centrado con
   grid de 3 columnas iguales (`1fr auto 1fr`) queda centrado contra
   el ANCHO TOTAL del contenedor — si los bloques de los costados
   tienen anchos distintos (típico: marca angosta a la izquierda,
   2+ grupos de controles a la derecha), el centro se ve corrido hacia
   el lado más ancho. Fix: 2 spacers `flex:1` independientes a los
   costados del bloque central (no 1 solo, no grid de columnas
   iguales) — reparten el espacio SOBRANTE real, no el ancho total.
2. **`display:grid` sin columnas apila en vez de poner en fila.** Un
   botón con ícono+texto que hereda `display:grid;place-items:center`
   (pensado para un solo hijo) apila ícono y texto en filas separadas
   en vez de ponerlos uno al lado del otro — grid sin
   `grid-template-columns` explícito mete cada hijo en su propia fila
   implícita. Fix: `display:flex;flex-direction:row` para cualquier
   botón con más de un hijo visual.
3. **`justify-content:center` no es opcional en un botón ícono+texto
   que a veces queda solo-ícono.** Sin esa propiedad, cuando el texto
   se oculta (mobile) el ícono queda pegado a un costado del botón
   mientras el fondo/aro de estado activo (`.is-on`) sí ocupa el
   botón completo — ícono y resaltado quedan visualmente
   desalineados entre sí. Encontrado probando el botón de locución en
   mobile con la voz activada por defecto.
4. **flex-wrap no "encoge para que quepan más ítems por línea".** El
   algoritmo de wrap de flexbox decide cuántos elementos entran en
   cada línea usando el ancho SIN achicar de cada uno; `flex-shrink`
   solo actúa DESPUÉS de que un elemento ya quedó asignado a una
   línea. Un bloque con `flex-shrink` permitido igual puede terminar
   solo en su propia línea si no entraba "justo" junto al anterior —
   nunca cambia CUÁNTOS elementos comparten línea. Para forzar que 2
   bloques compartan SIEMPRE una sola línea (encogiéndose con elipsis
   si hace falta), hay que sacarlos del wrap general y ponerlos en su
   propio contenedor con `flex-wrap:nowrap`.
5. **2 filas independientes con `space-between` cada una ≠ columnas
   alineadas entre sí.** Si fila 1 y fila 2 son 2 flex containers
   separados, cada uno calcula su propio "punto de corte" según el
   ancho de SU contenido — con contenido distinto entre filas (marca+
   saludo arriba, grupos de controles abajo), el corte queda en un
   lugar distinto en cada fila y no se leen como una grilla prolija
   ("se ve chueco", reporte real del cliente). **Fix real: una sola
   CSS Grid de 2 columnas para TODA la barra**, con `display:contents`
   en los wrappers de fila para que sus hijos sean celdas directas de
   esa grilla compartida — mismas columnas garantizadas en las 2
   filas, como una tabla. Ver el media query completo en
   `coto-player-chrome.css` para el patrón exacto (es el fix más
   importante de toda esta vuelta, reusar tal cual ante cualquier
   header/footer de 2+ filas en pantallas angostas).
6. **Auditar el DOM real antes de confiar en medidas de elementos
   "representativos".** Varias veces una medición pareció mostrar un
   bug que en realidad era el script de prueba (no el sitio) — probar
   contra el estado real (voz activada por defecto, saludo con nombre
   real) antes de concluir que algo está mal.
7. **Se sacó el botón "Automático"/"Reproducir todo".** Decisión de
   producto del cliente: bajo valor real frente al ruido visual que
   sumaba. La función sigue en `curso.js` (`initAutoplay`, no-op
   seguro sin el botón en el DOM) por si se recupera con otro punto de
   entrada más adelante — no volver a agregar el botón sin que se
   pida explícitamente.
8. **Micrófono en vez de play/stop para "locución".** Un ícono de play
   se confunde con controles de video; un micrófono comunica mejor
   "hay una voz leyendo esto". Patrón: apagado = mic simple (invita a
   tocar), prendido = mic con ondas de sonido + pulso CSS.

---

## 6.7 Locución: velocidad fija = bug real en dispositivos sin la voz preferida

Reporte real de uso (probando "Surtido sin venta" en tablet): la
locución "iba muy rápido" con voz de hombre — en desktop, con la voz
de Google es-US, sonaba perfecto.

**Causa raíz**: `u.rate = 1.15` estaba hardcodeado en `speak()`,
aplicado siempre sin importar qué voz terminara eligiendo
`pickVoice()`. 1.15x se ajustó y probó SOLO contra la voz preferida
(Google es-US) — cualquier voz de respaldo (el dispositivo no siempre
tiene esa voz específica; en la tablet cayó en otra, de hombre, motor
más básico) hereda la misma velocidad sin haber sido probada,
sonando atropellada.

**Fix** (aplicado en `narrador.js` del kit y en `curso.js` de
"Surtido sin venta"): `isHighQualityVoice(v)` — true solo para la voz
preferida (Google es-US) o cualquier voz marcada por el navegador/SO
como motor neural/online/premium/enhanced. `u.rate` pasa a ser
`isHighQualityVoice(v) ? 1.15 : 1.0` — con una voz no confirmada, se
narra a ritmo normal (1.0x) en vez de arriesgarse a que suene mal.
**Regla general para cualquier ajuste fino de narración**: un valor
tuneado a mano (velocidad, tono) SIEMPRE hay que asumir que se probó
contra UNA voz puntual, no contra "la narración" en abstracto — atarlo
condicionalmente a esa voz, nunca aplicarlo como constante global.

## 6.8 Márgenes en tablet — primera pasada: aceptado tal cual (ver §6.9 para la vuelta 2)

Medido en 4 tamaños reales de tablet: el margen vertical de letterbox
que deja el lienzo fijo a 2:1 (ver §2.6/2.7) varía fuerte según el
dispositivo — ~6% en tablets 16:10 horizontal, ~21-24% en tablets 4:3
horizontal (iPad), ~55% en vertical. Es consecuencia directa y
esperada de la decisión de 2:1 + cero recorte: las tablets están más
lejos de esa proporción que las ventanas de escritorio (~1.85-2.11).

**Primera decisión del cliente** (revisada después en §6.9 al ver el
resultado en un dispositivo real): uso horizontal únicamente + cero
recorte siempre por sobre "pantalla completa" → margen aceptado sin
tocar código. **Esta decisión se revisó** — ver §6.9, quedó
reemplazada por un margen de diseño ampliado en vez de aceptar la
franja vacía tal cual. Se deja este punto igual (no se borra) porque
documenta el razonamiento intermedio y por qué NO alcanzaba con
"aceptarlo" una vez visto en un dispositivo real.

## 6.9 Margen de seguridad ampliado para tablets — la solución real

Al probar "Surtido sin venta" en una tablet real, el margen aceptado
en §6.8 se sintió peor en la práctica que en la tabla de números — el
cliente pidió reconsiderarlo. Propuesta del cliente, correcta en
concepto: **diseñar el PDF con más margen de seguridad, para poder
recortar tablets DENTRO de esa zona ya sabida vacía**, en vez de
mostrar letterbox. Se implementó así:

- **El recorte en tablet es SIEMPRE lateral** (izquierda/derecha),
  nunca arriba/abajo — una tablet horizontal es más angosta que 2:1 en
  relación al alto, así que al llenar la pantalla completa lo que
  sobra es ancho, no alto. Por eso el margen top/bottom (8%) no
  necesita agrandarse, solo el de los costados.
- **Error real en el primer cálculo, corregido**: la proporción a
  proteger NO es la proporción cruda del dispositivo/viewport (un
  iPad "es" 4:3 = 1.33) — hay que restar el alto fijo del
  header+footer (~120px) del alto total para obtener la proporción
  REAL del `.d-stage` (el área donde vive la diapositiva). Para un
  iPad landscape (viewport CSS 1024×768), la proporción cruda es 1.33
  pero la del `.d-stage` real es ≈1.58; para un iPad Pro landscape
  (1366×1024), ≈1.51. Confundir estos dos números llevó a una primera
  estimación de margen (17% por costado) casi el doble de lo
  necesario. **Regla general: medir siempre contra el contenedor
  real que se está protegiendo, nunca contra el dispositivo/viewport
  completo** — mismo tipo de error, en espíritu, que el bug de §2.7
  (`width:100%;height:100%` en vez de un lienzo fijo).
- **Margen final: 8% arriba/abajo (sin cambio) + 13% a cada costado**
  (antes 8% parejo). Protege hasta proporción de `.d-stage` ≈1.5
  (cubre iPad e iPad Pro landscape reales, los casos más angostos
  entre los dispositivos probados). Por debajo de esa proporción
  (tablets aún más angostas, o vertical) el lienzo vuelve al modo
  fijo con letterbox — la opción segura para una proporción no
  protegida por el margen de diseño.
- **Implementación**: `kit-base/css/coto-shot-stage.css` (nuevo,
  reemplaza el bloque de lienzo fijo que antes se escribía a mano por
  curso) — usa una CSS Container Query (`@container
  (min-aspect-ratio:1.5) and (max-aspect-ratio:1.9)`) sobre `.d-stage`
  para decidir entre lienzo fijo 2:1 (desktop) y lienzo a pantalla
  completa recortando con `cover` (tablet protegida). Validado con una
  imagen de prueba marcando la zona seleccionada, confirmando que el
  recorte real en proporción 1.51-1.58 nunca llega a tocarla.
- **⚠️ NO retroactivo**: "Surtido sin venta" quedó diseñado con el
  margen VIEJO (8% parejo) — aplicarle este CSS nuevo recortaría
  contenido real, no margen vacío. Este archivo/instrucción es para
  **"Prevención cardiovascular" en adelante**. Si algún día se decide
  rehacer el PDF de "Surtido sin venta" con el margen nuevo, ahí sí
  se puede sumar el CSS — no antes.

## 6.9.1 Franjas laterales en ultrawide: es lo correcto, NO lo "arregles"

Hallazgo de la revisión visual de "Prevención cardiovascular", anotado
acá porque es exactamente el tipo de cosa que alguien va a ver en el
próximo curso y va a querer "corregir", rompiendo el diseño.

En pantallas muy panorámicas (proporción de `.d-stage` ≈2.67, monitores
ultrawide) el lienzo fijo 2:1 deja **franjas a los costados**. Se ve
como un defecto y no lo es: llenar el frame ahí obligaría a recortar
**12,5% arriba y abajo**, muy por encima del margen de seguridad
vertical del 8% (§2.6) — o sea, se comería contenido real. Las franjas
son la opción correcta.

La asimetría con el caso tablet (§6.9, donde sí se recorta) no es
inconsistencia, es la consecuencia de que el margen de diseño es
distinto en cada eje: **13% a los costados** permite recortar lateral
con seguridad, **8% arriba/abajo** no da para recortar vertical. Por eso
`coto-shot-stage.css` recorta en el rango tablet y hace letterbox en
ultrawide. Regla general: **el recorte solo se habilita en el eje y en
el rango que el margen de diseño ya cubre**; fuera de eso, franja.

## 6.10 Avance bloqueado por contenido (gate) — kit-base v1.7

Pedido explícito del cliente en "Prevención cardiovascular", con la
opción más estricta de las que se le ofrecieron: **la barra queda
bloqueada si el alumno no hizo clic en cada interacción y no vio cada
video** — igual que "Surtido sin venta". Quedó armado como mecanismo
genérico del kit, no como lógica de este curso:

- **`motor.canAdvance`** — punto de extensión oficial del motor (ya
  declarado explícito en el constructor desde v1.6). El curso le
  asigna una función que devuelve `false` mientras falte algo.
- **`data-require-seen="video/x.mp4"`** en la diapositiva — el motor
  frena solo hasta que ese recurso figure como visto.
- **`advanceblocked`** — evento que dispara el motor cuando el alumno
  intenta avanzar igual. Es el gancho para dar feedback.

Tres reglas aprendidas con bugs reales, las tres ya resueltas en el kit:

1. **El botón "Siguiente" NUNCA se deshabilita con `disabled`/
   `aria-disabled`** — un lector de pantalla dejaría de anunciarlo como
   interactivo y el alumno ciego no tendría forma de saber que existe.
   Se atenúa visualmente (`.is-gated`) y, al intentarlo, tiembla
   (`.d-shake`): feedback físico de "todavía no", sin romper la
   accesibilidad.
2. **Negar el avance sin decir DÓNDE falta es una trampa.** El handler
   de `advanceblocked` tiene que terminar SIEMPRE marcando los
   elementos pendientes (`.d-nudge` pulsa 2 veces sobre cada hitbox que
   falta). Bug real: un `return` temprano cortaba el handler antes de
   marcarlos, así que el botón temblaba y nada indicaba qué hacer.
3. **Un `data-require-seen` que quedó de una versión anterior del
   marcado deja el curso encerrado**, sin ningún error en consola. Bug
   real: al generalizar el gate, un atributo viejo volvió a
   "activarse" y una diapositiva se quedó sin forma de avanzar. Al
   tocar el gate hay que revisar TODOS los `data-require-seen` del
   HTML, no solo el que se está agregando — `markup-sanity.mjs` chequea
   que cada valor referenciado exista de verdad.

## 6.10.1 Interacciones nuevas: 4 reglas que salieron de bugs reales

Cuatro cosas que hay que dar por sentadas cada vez que se agrega una
interacción a un curso de este molde. Las cuatro salieron de bugs
concretos, no de teoría.

1. **Todo medio con audio necesita alguien que lo apague.** Bug real
   reportado por el cliente en "Prevención cardiovascular": el video
   circular seguía sonando después de cambiar de diapositiva. Los otros
   dos patrones de video sí tenían su punto de corte (el de fondo
   sincroniza con `slidechange`, el de pop-up para en `popupclose`);
   este no tenía ninguno, así que se quedaba reproduciéndose en una
   diapositiva oculta y el alumno escuchaba una voz sin saber de dónde
   salía. **Al sumar cualquier elemento con audio, la pregunta no es
   "¿arranca bien?" sino "¿quién lo apaga?"** — y la respuesta tiene
   que ser un evento del motor, no la buena voluntad del alumno.
   Corregido en `coto-media.js` del kit, así que un curso nuevo ya lo
   hereda resuelto.
2. **En tablet NO existe el hover.** Una interacción que solo responde
   a `mouseenter` es invisible para la mitad de los alumnos — y el
   cliente prueba los cursos en tablet (§6.8). Toda interacción de
   "pasar el mouse y que aparezca algo" tiene que escuchar **los 3**:
   `mouseenter` (mouse), `focus` (teclado) y `click` (táctil, con
   toggle para poder cerrarlo).
3. **Una interacción nueva también entra al gate.** Si el curso tiene
   avance bloqueado por contenido (§6.10), agregar una interacción sin
   sumarla al gate rompe la regla que el cliente pidió ("la barra
   bloqueada si no hiciste clic en cada interacción"). Para pop-ups
   existe el mismo mecanismo declarativo que para los videos:
   `data-require-popups="id1 id2"` en la diapositiva, con el mismo
   `.d-nudge` señalando los que faltan. Es genérico — mismo criterio
   que `data-require-seen`, candidato claro a subir al kit cuando un
   segundo curso lo use.
4. **Mobile/responsive se piensa AL CONSTRUIR, no se audita al final
   — regla fija del cliente, de acá en adelante sin excepción.**
   Hasta ahora el patrón repetido en este documento (§6.42, §6.48,
   §6.55, §6.58 nota al pie...) fue: se construye una interacción
   viendo solo desktop, se entrega, y RECIÉN ahí — por un reporte del
   cliente o por una auditoría posterior — aparece que en mobile se
   rompe, se recorta, o el gesto no funciona igual (touch sintetiza
   eventos distinto que mouse, ver el propio caso de Rotación arriba).
   Cada una de esas vueltas costó una ronda de feedback completa que
   se podía evitar. **De ahora en adelante, toda pieza de UI/interacción
   nueva se prueba en viewport táctil real (`isMobile:true`,
   `hasTouch:true` con Playwright — nunca solo achicar la ventana de
   escritorio, §6.48/§7.3 punto 11) ANTES de darla por terminada, en
   la MISMA vuelta en que se construye** — no como un chequeo aparte
   que se hace "si después el cliente pregunta". Esto aplica a:
   - Cualquier gesto nuevo (arrastre, swipe, hover-con-gracia): probar
     que el evento sintético real de touch (no solo mouse) produce el
     resultado esperado — `click.detail`, `pointerType`, y qué eventos
     SÍ y NO dispara un tap simple vs. un tap-y-arrastre son distintos
     entre mouse y touch, y typearlo mal es indetectable a simple
     vista (§6.58, Rotación: el bug pasó los tests de mouse en verde).
   - Cualquier layout nuevo (grid, popover, tarjeta): probar en al
     menos un viewport de teléfono real (~375-430px, portrait Y
     landscape) además de tablet — no asumir que "ya se probó
     responsive" porque se probó en un iPad o achicando Chrome.
   - Cualquier popover/tooltip que cuelgue de un botón del chrome:
     medir su posición real en el viewport táctil, no asumir que el
     botón sigue del mismo lado que en desktop (§6.55/§7.3 punto 12).
   La meta es que un curso entregado sea **sólido en cualquier
   dispositivo desde la primera entrega** — que probarlo en el celular
   del cliente confirme lo ya verificado acá, nunca sea la forma en
   que se descubre un bug nuevo. Mismo criterio, más allá de mobile:
   antes de dar por terminada cualquier pieza nueva, pensar qué caso
   obvio-en-retrospectiva podría faltar (teclado, un guard que no
   sobrevive un reintento, un evento que no dispara en el otro
   patrón de video, etc. — los patrones de bug ya catalogados en este
   mismo documento) y verificarlo de una, en vez de entregar y esperar
   a que una vuelta de feedback lo encuentre.

## 6.10.2 Pop-ups: una sola regla para todo el curso

Salió de una revisión del cliente sobre "Prevención cardiovascular", con
pop-ups que cerraban de formas distintas y botones que no hacían nada.

- **Todos se cierran igual**: el control de arriba a la derecha, `Esc`, o
  tocando fuera. Los tres andan en todos, sin excepción.
- **Un pop-up de CONSULTA no lleva botón al pie.** Glosario, ayuda,
  fichas de contenido, estadísticas, logros: el botón "Continuar" ahí no
  continúa nada, solo cierra — o sea, duplica el control de arriba con
  otra palabra. Y en una tarjeta con poco contenido se ve enorme, porque
  ocupa el ancho completo.
- **Solo lleva botón el pop-up que ARRANCA o COMPLETA algo**, porque ahí
  el botón sí hace algo distinto de cerrar: el de instrucciones
  ("Empezar el recorrido"), el de intro de una actividad, y el pop-up
  "gate" (`data-gate-popup`) cuyo cierre completa el avance a la
  diapositiva siguiente.
- **Un ícono grande necesita aire arriba.** Un círculo de 84px con
  `padding-top:.3rem` queda pegado al encabezado. Mínimo `1.5rem`.
- **Si el contenido cambia entre aperturas del MISMO pop-up, reservar
  el alto del texto más largo.** Si no, la tarjeta se agranda y se
  achica al saltar de paso y los controles se mueven bajo el dedo.
- **Un aviso que aparece una sola vez es un aviso que se pierde.** Los
  pop-ups automáticos (`data-intro-popup`) y los "gate"
  (`data-gate-popup`) se re-arman al ENTRAR a la diapositiva: quien
  vuelve espera volver a verlos. Además, si el aviso importa de verdad
  (ej. "esto no es la evaluación"), no alcanza con una línea en la
  bajada: va como pop-up ANTES de empezar y como bloque destacado
  (`.d-aviso`), porque una línea más de texto se lee en diagonal.
- **La info de un pop-up que aparece solo una vez tiene que vivir
  también en un lugar fijo.** El instructivo del índice se duplica en el
  botón "Ayuda" de la barra superior, que está en todas las
  diapositivas.
- **Los paneles que se abren desde la barra superior van como cajón del
  mismo lado que su botón** (`.modal--drawer` a la izquierda para el
  índice, `.modal--drawer-right` para glosario y ayuda). Un pop-up
  centrado no comunica de dónde salió, y un cajón gana el alto que un
  glosario largo necesita.

## 6.10.2.1 El instructivo de arranque: qué decir y qué NO prometer

Error real encontrado en "Prevención cardiovascular": el pop-up "Cómo
recorrer el curso" decía que desde el índice se podía **"saltar a
cualquier diapositiva"**. Es falso en cualquier curso con avance
bloqueado por contenido (§6.10) — el índice sirve para **volver a lo ya
visto**, no para adelantarse. Un instructivo que promete algo que no
pasa es peor que no tener instructivo.

Hay una plantilla genérica en `kit-base/header-boilerplate.html`, y el
criterio es: el instructivo habla de los **controles del reproductor** y
del **tipo de interacciones que tiene el molde** — nunca de las
diapositivas concretas de ese curso. Así sirve igual para todos:

1. Cómo avanzar (flechas, botones, barra de progreso).
2. Los 4 controles de la barra superior, uno por uno.
3. Que el curso es interactivo: videos, zonas que responden, práctica.
4. Que **para avanzar hay que interactuar con todo**, y que si falta
   algo se lo va a señalar.
5. Que se suman puntos y logros, y que al final hay un resumen.

Dos detalles de forma que costaron una vuelta cada uno:
- **El botón va pegado al pie** (`.d-cta-sticky`). Es el pop-up más
  largo del curso y en pantallas bajas su llamado a la acción quedaba
  abajo de todo: un botón que hay que ir a buscar scrolleando no se usa.
- **Los botones de acción van del ancho de su texto**, no del ancho de
  la tarjeta (`.btn-ic`, con ícono). Un botón a ancho completo comunica
  "esta es la única salida" — está bien en un formulario, mal en un
  pop-up que además se cierra con la ✕.

## 6.10.2.2 Cuándo conviene romper la convención de pop-ups

La regla de §6.10.2 es que todos los pop-ups se ven igual. La excepción
válida es el pop-up que **no es contenido ni trámite, sino juego**.

Caso real: las preguntas de predicción antes de cada video de la unidad
2 ("¿Te la jugás?"). Se le dio encabezado propio con degradado, tarjeta
más angosta, opciones tipo ficha y un premio animado al acertar. Se ve
distinto **a propósito**, para que se lea como un desafío rápido y no
como una ficha de contenido más.

Dos condiciones para que la excepción no se vuelva inconsistencia:
1. **Que sea UNA sola** en todo el curso. Dos excepciones ya son un
   segundo estilo, y ahí volvemos al problema de §4.
2. **Que esté escrita en el HTML**, al lado del marcado, explicando por
   qué rompe la convención. Si no, la próxima persona la "corrige".

El premio es **cosmético**: los puntos los suma el mismo `award()` de
siempre. Lo que se agrega es que se VEAN — el número que sube desde el
botón acertado y la moneda de `fx.js`. Gamificación de percepción, no
de puntaje.

## 6.10.2.3 Tono: el alumno puede estar nervioso en su primer día

El copy de un pop-up "divertido" puede sonar mal según QUIÉN lo lee.
Caso real: el pop-up de predicción se llamaba "¿Te la jugás?" — lenguaje
de apuesta/desafío. El cliente lo frenó con un argumento que hay que
tener presente siempre en este tipo de cursos: **quien hace un curso de
inducción suele estar en sus primeros días de trabajo, nervioso**, no
buscando que lo pongan a prueba. "Jugarse", "desafío", "reto", "ganar" —
cualquier palabra que suene a examen o a apuesta puede sumar presión en
vez de sacarla.

Se corrigió a **"Un momento, pensemos"** (invita, no exige) y el
feedback de error a **"No pasa nada, ahora lo vemos"** (nunca hubo
penalidad real — es +5 puntos cosméticos si acierta, nada si no — pero
había que decirlo explícito, no asumir que se entiende solo).

Regla general para cualquier curso de este molde: antes de escribir
copy "con onda" para una interacción opcional, preguntarse si el
público real (alguien nuevo en el trabajo, aprendiendo procesos que
todavía no domina) lo va a leer como invitación o como presión.

## 6.10.3 Resaltar una hitbox: el ícono, no la caja

Reportado dos veces por el cliente sobre diapositivas distintas. Una
hitbox que abarca "ícono + etiqueta" resaltada con fondo o recuadro se
ve como **una tarjeta gris pegada encima del arte**: el recuadro incluye
el texto y no coincide con ninguna forma del dibujo.

Se resalta **solo el ícono**, con un aro que sigue la forma redonda que
ya está dibujada (`.d-hit-ring` del addendum). Cómo dimensionarlo — esto
hay que MEDIRLO en cada curso, no copiar números: el aro se define contra
el eje de la hitbox que sea **constante** entre todos los elementos del
grupo. Si todas tienen el mismo alto y distinto ancho (típico con
etiquetas de 1, 2 o 3 líneas), dimensionar por alto; si comparten ancho,
por ancho. `aspect-ratio:1` completa el otro eje.

Y el aro ES el indicador de foco: ponerle además un `outline` rectangular
vuelve a dibujar justo el recuadro que se quiso evitar.

## 6.10.4 Tiempo mostrado ≠ tiempo de sesión

Pedido del cliente: que el tiempo del resumen no cuente lo que dura mirar
los videos. Con 9 videos, la duración del material se lleva la mayor
parte del número, y "20 min" termina diciendo más sobre el video que
sobre el recorrido de la persona.

`initTiempoActivo()` (kit, `coto-ui.js`) frena el reloj mientras haya
cualquier `<video>` reproduciéndose. Dos cosas que hay que respetar:

1. **Los videos en curso se llevan en una LISTA, no en un contador.** Al
   terminar un video se disparan `pause` **y** `ended`: con un contador
   simple queda en negativo y el reloj no vuelve a arrancar nunca.
2. **`cmi.core.session_time` NO se toca.** El estándar SCORM lo define
   como el tiempo que el SCO estuvo abierto: descontarle los videos sería
   reportarle mal al LMS. Son dos números distintos con dos destinos
   distintos.

## 6.10.5 El curso tiene que poder cerrarse

Antes, al terminar, el botón del pie quedaba como un "Fin" que no hacía
nada y el alumno cerraba la pestaña a mano — que en SCORM equivale a
irse sin avisar.

- El botón pasa a **"Salir del curso"** y **sigue funcionando después
  del primer clic**: si el alumno vuelve al resumen, tiene que poder
  salir otra vez.
- `SCORM.exitCourse()` cierra con **`cmi.core.exit = ""`** (salida
  normal), no con `"suspend"`. La diferencia no es cosmética: `"suspend"`
  le pide al LMS que guarde el punto donde quedó — correcto al cerrar la
  pestaña a mitad de camino, incorrecto al terminar, porque al reabrir el
  curso volvería al bookmark en vez de arrancar limpio.
- `window.close()` solo funciona si el LMS abrió el curso en ventana
  nueva. Dentro de un iframe no hace nada y no tira error: por eso la
  pantalla de despedida se muestra **siempre** y el cierre automático es
  un extra, nunca el mecanismo.

## 6.10.6 Premio final: los umbrales se calculan, no se eligen

Al sumar medallas de oro/plata/bronce, los rangos de puntos salen del
puntaje **realmente alcanzable**, no de números redondos elegidos a ojo.
Se suman todas las fuentes de puntos del curso para obtener el máximo, y
—si hay avance bloqueado por contenido— el **piso asegurado** de quien
lo termina. La medalla más baja arranca en ese piso: una medalla que se
obtiene sin hacer nada no premia nada.

Los 3 rangos se muestran **siempre**, también los no alcanzados, y con
cuántos puntos faltaron para el siguiente. Si no se ve qué faltaba, la
medalla no motiva.

## 6.10.7 Zonas interactivas sobre el arte: el toggle del clic

Al agregar zonas que revelan información sobre una imagen (sectores de
un gráfico, filas de una tabla, etapas de un proceso), el patrón es
siempre el mismo y conviene usar `initHotspots()` del kit en vez de
volver a escribirlo — en "Prevención cardiovascular" terminó escrito
**cuatro veces** con nombres distintos, y las cuatro hubo que
corregirlas por separado.

El detalle que se paga caro son **dos bugs encadenados del toggle**:

1. Con `if (activa === z) limpiar()` a secas, en una computadora con
   **mouse el clic cierra lo que el hover acababa de abrir**: el
   `mouseenter` llega primero y deja la zona activa, así que el clic la
   encuentra abierta y la apaga.
2. Atarlo a "cerrar solo en táctil" **tampoco alcanza**: un toque
   sintetiza `mouseenter` antes del `click` (los navegadores emulan
   mouse sobre touch), así que en tablet el toque abría y cerraba en el
   mismo gesto y no pasaba nada.

La solución no es mirar el estado en el momento del clic, sino el que
había **antes de que empezara la interacción**: `pointerdown` se dispara
antes que los eventos de mouse sintetizados, así que ahí se guarda la
foto y el toggle compara contra esa.

## 6.10.8 "Extraído al kit" no es "probado en un curso real" — auditar la diferencia

Pedido explícito del cliente: verificar si el sistema de puntos/medallas
va a funcionar igual en el próximo curso vía el kit. La respuesta
obligó a auditar algo más grande de lo esperado.

**El mecanismo en sí es sano**: `pintarMedalla(puntos, niveles)` en
`coto-cierre.js` es puro y parametrizado — no lee nada de un curso en
particular, recibe los puntos y los 3 rangos por parámetro. Probado en
aislamiento (página mínima, solo el kit) resuelve el nivel correcto y el
mensaje de "te faltaron N" bien en los casos límite.

**Pero "Prevención cardiovascular" no lo usa.** Auditando los
`<script src>`/`<link>` del curso real contra lo que el kit declara
como v1.8, ninguno de los 6 módulos nuevos (`coto-player.js`,
`coto-media.js`, `coto-ui.js`, `coto-hotspots.js`, `coto-quiz.js`,
`coto-cierre.js`) está cargado — el curso sigue con
`coto-base-addendum-v1.2.css` y todo el comportamiento vive inline en
`curso.js`/`diapositivas.css`. "Extraído y validado en aislamiento" y
"funciona en un curso real" son afirmaciones distintas, y solo la
primera era cierta.

**La consecuencia concreta que esto produjo**: `curso.js` tenía su
propia copia local de `medallaDe()`/`pintarMedalla()`, casi idéntica a
la que subió al kit el mismo día — nunca migrada. Como `curso.js` corre
en su propio IIFE, la copia local **tapa** a la función global sin
pisarla: no hay ningún error, la página funciona perfecto, pero
`window.pintarMedalla` del kit simplemente nunca se llama. Dos
implementaciones del mismo cálculo, sin que nada las mantenga
sincronizadas si una cambia.

**Regla para no repetir esto**: cuando se extrae una función al kit
desde un curso ya escrito, el trabajo no termina hasta que ESE curso
llama a la versión del kit (borrando la copia local) o hasta que se
documenta explícitamente por qué no. "Subir la función" sin "migrar
quien la usaba" dejó un duplicado silencioso.

**Veredicto honesto para el próximo curso**: el mecanismo de medallas
(y los otros 5 módulos) está listo para copiarse tal cual — la lógica
es correcta y ya se probó aislada. Pero la primera prueba real,
end-to-end, dentro de un curso completo, todavía no pasó. Si el próximo
curso arranca copiando `kit-base/` de punta a punta (checklist §7) y
usando los módulos sin reescribirlos, esa va a ser la validación real.
Hasta entonces, tratar el kit como "diseño correcto, no como
"funcionando comprobado".

## 6.11 Animación de entrada escalonada — hasta dónde llega (y por qué)

Consulta real del cliente: "¿qué complejidad tiene que primero entren
los títulos, después los párrafos y después los elementos?". La
respuesta corta: **depende de si la diapositiva es HTML real o una
captura**, y no es un problema de código sino de qué entregó el
diseñador.

- **HTML real** (pop-ups, mini-práctica, resumen del cierre, logros):
  trivial y ya resuelto en el kit — `.d-stagger-in` de `coto-base.css`
  + `staggerReveal()` de `coto-ui.js`, que se engancha solo a
  `popupopen`. Escalona los hijos directos y, un nivel más adentro, las
  tarjetas de las grillas conocidas, para que entren en cascada entre
  sí y no todas juntas como "un elemento más".
- **Diapositivas-captura**: **no se puede**, y no por falta de código.
  Una captura es UNA imagen con el texto horneado adentro (§2.8): no
  existen "el título" y "el párrafo" como objetos separados que puedan
  entrar por turnos. Lograrlo exige volver al camino caro de §3.3 —
  pedirle al diseñador cada pieza como capa Illustrator independiente
  con alfa, con el costo de exportación y la superficie de bugs de
  posicionamiento que eso trae.
- **Decisión tomada con el cliente**: aplicar el escalonado **solo
  donde ya hay HTML real**. Es el 90% del efecto percibido a costo
  cero, sin cambiarle el pipeline de entrega al diseñador.
- Detalle de implementación que se paga caro si se olvida: entre
  `classList.remove` y `classList.add` hace falta un `void
  el.offsetWidth` para forzar el reflow — sin eso la animación **no se
  reinicia** y la segunda vez que se abre el mismo pop-up no anima nada.

---

## 6.12 Pop-up de arranque, video circular, torta interactiva y video en pop-up — 4 lecciones reales (kit v1.9)

Ronda de revisión en vivo de "Prevención cardiovascular" que tocó 4
componentes ya extraídos o candidatos a extraerse. Las 4 lecciones son
genéricas — aplican a cualquier curso del molde, no solo a este.

**1 · El pop-up de arranque no debe abrirse solo, y menos ser largo.**
La plantilla `data-intro-popup` (automática al entrar a una diapo) es
mala opción para un pop-up de bienvenida: interrumpe sin que el alumno
lo pida. Se reemplazó por `data-gate-popup` en la diapositiva "índice"
— el mismo mecanismo que cualquier otro gate de contenido — así el
pop-up aparece recién cuando el alumno toca "Siguiente", como un paso
más del recorrido, no una interrupción. De paso se recortó de 2 grillas
de íconos (7 ítems) a 2 párrafos + botón: el detalle de controles de la
barra superior YA vive en el pop-up "Ayuda" (accesible desde cualquier
diapositiva) — duplicarlo en el pop-up de arranque solo lo infla.
Actualizado en `kit-base/header-boilerplate.html` (v1.9).

**2 · Video que se reproduce EN el lugar (círculo o cualquier overlay
sobre `.d-shot-img`): el `<video>` tiene que estar OCULTO salvo
mientras reproduce, nunca visible por defecto.** Bug real: al terminar
el video (`ended`), se sacaba la clase `.is-playing` pero el `<video>`
seguía dibujado encima, mostrando su último cuadro — negro en estos
clips — tapando la imagen de base que debería volver a verse. La regla
general: si un `<video>` se superpone a una imagen estática que "hace
de poster", el `<video>` debe tener `opacity:0` (o `visibility:hidden`)
salvo mientras está en reproducción real (`.is-playing`), nunca
"siempre visible" con la esperanza de que su último cuadro coincida con
algo razonable. Sumar también `video.currentTime = 0` en `ended`, para
que el próximo play no intente arrancar desde el final. Corregido en
`kit-base/js/coto-media.js` + `coto-media.css`
(`initInlineCircleVideos`).

**3 · Una tarjeta de datos que "sigue" al elemento activo de un gráfico
interactivo (torta, barras, etc.) no necesita rastrear la posición real
del mouse.** Pedido típico: "que el dato aparezca cerca de la parte del
gráfico que estoy mirando". Rastrear el cursor en píxeles es fuente de
jitter, no funciona con teclado/foco (mitad de los alumnos en tablet no
tienen mouse, CLAUDE.md §6.10.1), y es más código del necesario. Si el
gráfico ya calcula una dirección/bisectriz por elemento para el efecto
de "separarse un poco al elegirlo" (variables tipo `--bx`/`--by`,
patrón ya usado en la torta de este curso), esa MISMA dirección sirve
para posicionar la tarjeta: un atributo (`data-pie-active="<id>"` o
similar) por selección, con una posición CSS fija por elemento. Menos
código, funciona igual con mouse/teclado/tap, sin jitter.

**4 · El radio de esquina del `:hover` tiene que MEDIRSE contra el
radio real del arte, no heredar el genérico.** La clase base
`.d-shot-hit` trae `border-radius:var(--r-sm)` (8px) — pensada para
hitboxes rectas/chicas. Sobre una tarjeta de video con esquinas muy
redondeadas dibujadas en el PDF (~32px reales, medido con el mismo
método PIL de CLAUDE.md §3.4: escanear la tarjeta blanca contra el
fondo), un tinte de `:hover` con 8px de radio se ve como un rectángulo
casi recto asomando por fuera de las esquinas curvas — "una forma rara
que se extiende de más", reporte real del cliente. Regla: cualquier
hitbox que se dibuja sobre una tarjeta/forma redondeada del arte
necesita su propio `border-radius` ajustado a esa forma (`--r-lg`/
`--r-xl` del sistema de diseño, o medido a mano si no calza con ninguno
de los tokens), no el genérico de `.d-shot-hit`.

**5 · Pop-up de video: la barra superior (`.modal-hd`) es opcional, no
obligatoria.** La regla de consistencia de pop-ups (§6.10.2) exige que
TODOS cierren igual (X/Esc/backdrop), pero no exige que todos tengan
`.modal-hd`. Para un reproductor de video, mostrar solo el video con
sus controles nativos (sin barra de título encima) es más limpio; el
cierre pasa a un botón flotante sobre la esquina del video
(`position:absolute` directo sobre `.modal-card`, ya que `.modal-x`
solo necesita un ancestro `position:relative` — no específicamente
`.modal-hd`) con fondo semitransparente oscuro para leerse sobre
cualquier contenido de video. El título accesible se mantiene en el DOM
como `sr-only` para lectores de pantalla, sin verse.

---

## 6.13 Ronda de revisión visual: 3 lecciones más (kit v1.9)

Cuarta pasada de revisión en vivo sobre "Prevención cardiovascular".
Las 3 lecciones son genéricas, aplican a cualquier curso del molde.

**1 · `.btn-ic` (y cualquier clase del addendum v1.8) NO existe si el
curso todavía carga la v1.2 — y eso rompe visualmente, no solo
"falta un estilo".** Bug real, encontrado recién ahora aunque el botón
llevaba varias vueltas usando la clase: sin `.btn-ic svg{width:1.1em;
height:1.1em}`, un `<svg>` sin `width`/`height` propios cae en su
tamaño intrínseco por default — **300×150px** — y como el botón es
`inline-flex` (se agranda para contener a su hijo), el resultado es un
óvalo gigante con un triángulo enorme adentro, no "un botón sin
ícono". Cualquier curso que use una clase del addendum tiene que
verificar que el `<link>` de esa versión esté realmente en el
`<script>/<link>` del `index.html` — no alcanza con que la clase
"suene familiar" del kit. Mientras un curso no migre de verdad (ver
§6.10.8), la clase necesaria se copia entera al CSS propio del curso,
con un comentario explicando por qué existe ahí duplicada.

**2 · Una tarjeta que seguía la dirección bx/by "matemática" pisaba las
etiquetas horneadas en la imagen — medir en píxeles, no confiar en la
fórmula.** Extensión del hallazgo de §6.12 punto 3: usar la misma
dirección que separa un sector al elegirlo (`--bx`/`--by`) es un buen
punto de partida para posicionar una tarjeta de datos, pero no alcanza
solo — hay que chequear en píxeles reales dónde están las etiquetas ya
impresas en el arte (mismo método PIL de §3.4) y mover la tarjeta a un
hueco realmente vacío, aunque eso signifique alejarse de la dirección
"pura" bx/by. En este curso terminó siendo más simple: UNA posición a
la derecha de la torta (hueco real, antes del video) para el sector de
ese lado, y UNA posición a la izquierda (hueco entre las 2 etiquetas
de ese lado) reusada por los 2 sectores de ese lado — nunca se
muestran a la vez, así que no hace falta una posición por sector.

**3 · El color de un "premio" (medalla, insignia, logro) va en un
badge propio, no tiñendo toda la tarjeta que lo contiene.** Reporte
real: la tarjeta de medalla tenía un degradado MUY pálido de fondo por
tier (oro/plata/bronce) — en pantalla se leía casi gris, "quedaba
feo". Fix: el color de tier se concentra en un badge cuadrado-
redondeado propio alrededor del ícono (`width`/`height` fijos,
degradado con más saturación, `box-shadow`), y la tarjeta que lo
contiene queda neutra (`var(--surface-2)`). El contraste hace que el
badge se lea como "el premio" en vez de que toda la tarjeta se vea
desteñida.

**4 · Un efecto de entrada "cinematográfico" para un logro se arma con
2 piezas, no una: pop elástico + destello, y las dos SOLO una vez.**
`cubic-bezier(.34,1.56,.64,1)` con overshoot (escala pasa de 1 antes
de asentarse) da la sensación de "cayó en su lugar"; un
`radial-gradient` detrás que se expande y se apaga (no un loop) suma
la sensación de flash sin volverse ruido permanente. Se dispara una
vez por vuelta de celebración (`classList.remove` + reflow forzado +
`classList.add`, mismo patrón que `.d-nudge`/`.d-stagger-in`), nunca
como animación continua — un brillo que no termina se lee como
"rota", no como festejo. Respeta `prefers-reduced-motion` como
cualquier otra animación de entrada (regla ya fija del sistema de
diseño, CLAUDE.md §4).

---

## 6.14 Pop-up 2x2 con color de curso, hover duplicado, video "recortado" y voz en tablet (kit v1.9)

Quinta ronda de revisión en vivo de "Prevención cardiovascular". 5
lecciones genéricas.

**1 · Antes de implementar un rediseño visual grande, mandar preview de
imagen — no el curso real.** El cliente pasó una referencia visual de
otro curso y pidió algo parecido para el pop-up de arranque. Se armó un
mockup HTML aislado (mismos tokens de color/tipografía del kit,
`data-cat` real) y se generaron capturas con Playwright ANTES de tocar
`index.html`, iterando los 4 íconos en vivo (varias rondas: "no
quedaron muy bien", cambios puntuales por ícono) sin arriesgar romper
el curso real en cada vuelta. Recién con el diseño aprobado se portó a
`index.html` + `header-boilerplate.html` + CSS. Vale para cualquier
pedido de "hacé algo parecido a esta referencia": el costo de un mockup
aislado es mínimo comparado con iterar directo sobre el curso.

**2 · Un componente de color "de marca" se arma con tokens, nunca con
hex fijos, si tiene que ser reusable entre cursos.** El pop-up nuevo
(`.d-instr-modal`, `.d-instr-card-ic`, etc.) usa exclusivamente
`--cat`/`--cat-strong`/`--cat-soft`/`--cat-grad` — ni un color
hardcodeado. Resultado: el mismo bloque HTML/CSS sirve para cualquier
curso del kit cambiando SOLO el `data-cat` del `<body>`, que es
exactamente lo que hace que valga la pena subirlo al addendum.

**3 · Dos reglas `:hover` con la MISMA especificidad conviven mal si un
elemento hereda las dos clases.** Bug real: un video circular con
`class="d-shot-hit--circle d-shot-hit--video"` recibía el `background`
de `.d-shot-hit--circle:hover` (pensado para hitboxes normales) en vez
del `background:transparent` de `.d-shot-hit--video:hover` (pensado
para no teñir el video) — ambos selectores son "1 clase + :hover", así
que gana el que esté MÁS ABAJO en el archivo final, no el que "tenga
más sentido". Visualmente: un aro de color de más, superpuesto al
botón de play. Fix: un selector combinado
(`.d-shot-hit--circle.d-shot-hit--video:hover`) con más especificidad,
que gana siempre sin depender del orden de los archivos CSS. Cuando dos
clases utilitarias conviven en el mismo elemento y una necesita anular
a la otra en el mismo pseudo-estado, el selector combinado es la forma
robusta — no reordenar reglas y confiar en que el orden nunca cambie.

**4 · Un reproductor de video que se ve "recortado" en tablet puede no
tener nada que ver con la tablet.** Reporte real: "en iPad el
reproductor se ve recortado". Causa real: los placeholders de video son
archivos de 0 bytes (CLAUDE.md §3.9) — sin metadata, un `<video>` con
`width:100%;height:auto` cae en el alto FIJO por default del navegador
(150px, sin relación con el ancho), así que se ve como una franja
angosta en CUALQUIER dispositivo, no solo en tablet — pasa que en
desktop con un modal más chico es menos notorio y en tablet con el
modal más ancho la franja se nota más. Fix: `aspect-ratio:16/9` en el
`<video>` — reserva una caja razonable desde el placeholder, y en
cuanto carga un video real con su propia relación de aspecto, el
navegador la usa por sobre el `aspect-ratio` de CSS (no hace falta
sacarlo al reemplazar placeholders). Regla general: ante un bug
reportado "en tablet", reproducirlo TAMBIÉN en desktop antes de asumir
que es de tablet — puede ahorrar horas de buscar en el lugar
equivocado. `scroll-audit` (kit-base/tools/tests/) suma 3 viewports de
tablet (iPad horizontal 1024×768, iPad Pro horizontal 1366×1024, iPad
chico vertical 768×1024) para que este tipo de bug aparezca en la
suite en vez de en un dispositivo real.

**5 · Un ajuste de voz por dispositivo (no solo por voz) es un caso
legítimo, y se detecta sin sniffear user-agent.** Extensión de
`isHighQualityVoice`/§6.7: el cliente probó en iPad y pidió preferir
voces específicas (Paulina es-MX, después Mónica es-ES) ahí, más allá
de la cadena es-US de siempre. `matchMedia('(pointer:coarse)')` +
umbral de tamaño de pantalla (`Math.min(screen.width,screen.height)
>= 600`) distingue tablet de celular sin tocar `navigator.userAgent` —
más confiable entre navegadores y no se rompe si un fabricante cambia
el string de UA. Mismo criterio que §6.7 para la velocidad: un ajuste
fino probado contra UNA voz puntual (acá, Paulina sonando "cortada") se
ata condicionalmente a esa voz (rate 1.22x solo para Paulina), nunca se
generaliza como constante global.

---

## 6.15 Bug real: la barra superior/inferior se cortaba en iPad — pero solo con un alumno real logueado

Reporte real del cliente probando en un iPad físico (no en nuestros
tests): la barra superior e inferior aparecían cortadas — el botón
"Ampliar" desaparecía del header y "Siguiente"/"Empezar" quedaba
recortado en el footer. Costó dos rondas de fotos del cliente
diagnosticarlo bien (la primera foto tenía una rotación que llevó a un
diagnóstico erróneo — ver más abajo) y **nuestra propia suite de tests
nunca lo detectó**, con dos causas encadenadas, ambas genéricas:

1. **Bug de fondo — "grid blowout" de CSS Grid.** `.d-app` (kit-base,
   `coto-player-chrome.css`) es `display:grid` con `grid-template-rows`
   definido pero **sin `grid-template-columns`**. Sin eso, la columna
   implícita usa su ancho `auto` por default — que en CSS Grid se
   calcula por el **min-content** de los ítems adentro, no por el
   ancho real del contenedor. `.d-top`/`.d-bottom` tienen varios hijos
   `flex:none` que se niegan a achicarse (el saludo, los botones-ícono,
   los grupos de controles); si la suma de esos anchos supera el
   viewport, la fila del grid crece más ancha que la ventana — el
   contenido de más NO scrollea (`body{overflow:hidden}`, a propósito,
   ver arriba en este mismo archivo), simplemente queda invisible,
   cortado. Fix: `grid-template-columns: minmax(0,1fr)` en `.d-app` —
   es el fix estándar de este bug conocido de CSS Grid, fuerza a la
   columna a nunca superar el contenedor sin importar cuánto pidan sus
   hijos.
2. **Por qué ningún test lo agarró — el header nunca se probó en su
   ancho real.** El saludo (`#d-greet`, "👋 Hola, Nombre") solo se
   completa si `SCORM.getFirstName()` devuelve algo — y en cualquier
   corrida automática (Playwright sin LMS real detrás) esa función
   siempre devuelve vacío, así que el header SIEMPRE se probaba en su
   versión más angosta posible. El ancho real que un alumno de carne y
   hueso genera (con su nombre real en el saludo) nunca se ejecutó en
   la suite. Fix: `scroll-audit.mjs` ahora inyecta un saludo con un
   nombre deliberadamente largo antes de medir, y además mide
   `.d-top`/`.d-bottom` directamente (no solo
   `document.documentElement`, que el `overflow:hidden` del body deja
   ciego a este tipo de desborde).
3. **El breakpoint mobile (850px) tampoco alcanzaba para un iPad de
   1024px con el header completo.** Con el saludo puesto, el header
   necesitaba ~1146px para entrar en una sola fila — muy por encima de
   los 850px donde recién pasaba al layout de 2 filas (§6.6). Subido a
   1180px: cubre el iPad horizontal más chico (1024px) con margen.

**Lección general, más allá de este bug puntual:** cualquier pieza de
UI cuyo contenido dependa de un dato que la suite de tests NUNCA tiene
disponible (acá, el nombre real de un alumno vía SCORM) es una zona
ciega automática — por más que la suite pase en verde, no probó ese
caso. Antes de confiar en "0 fallos" para un componente así, hay que
preguntarse explícitamente qué datos reales le faltan a la simulación
y, si es barato, simularlos (como se hizo acá) en vez de asumir que el
caso vacío representa el peor caso real — casi nunca lo es.

**Nota aparte sobre cómo se llegó a diagnosticarlo:** la primera foto
que mandó el cliente tenía el header/footer visualmente rotados 90° —
llevó a un diagnóstico inicial equivocado (bloqueo de rotación del
iPad). El cliente aclaró que el dispositivo SÍ estaba en horizontal;
la rotación era un artefacto de cómo se había tomado/orientado esa
foto en particular, no del dispositivo. La foto nativa (captura de
pantalla real, sin cámara de por medio) que se pidió después fue la
que permitió ver el desborde real sin ambigüedad — pedir una captura
nativa en vez de una foto de la pantalla ahorra rondas de diagnóstico
cuando hay dudas de orientación o nitidez.

---

## 6.16 El fix de §6.15 tenía un costo de UX que había que resolver aparte

El pasaje a layout de 2 filas a partir de 1180px (§6.15) resuelve el
desborde real, pero el cliente lo probó en iPad (1024px) y prefería la
barra de 1 sola fila "prolija" de escritorio — el layout de 2 filas se
sentía más apretado/distinto de lo esperado justo en un ancho donde,
sacándole el TEXTO a los botones-ícono, en realidad entra todo en 1
fila sin problema.

**Fix: una tercera franja de breakpoints**, no solo dos. Antes había
"desktop completo" y "2 filas" con un solo corte. Ahora:

1. **Desktop** (sin media query): 1 fila, todo con texto.
2. **Tablet compacta, nueva** (`800px`–`1180px`): sigue en 1 fila, pero
   se le aplica EL MISMO recorte que ya existía para celular —
   `.d-iconbtn--labeled .lbl{display:none}` (solo ícono, sin texto),
   subtítulo de marca oculto, `max-width` más chico en marca/saludo.
   El contenido cabe en 1 fila porque se le sacó el peso que sobraba,
   no porque se comprimió tipografía.
3. **2 filas** (`≤799px`, bajado de 1180px): recién acá, donde ni con
   los íconos solos alcanza una fila cómoda.

**Regla general que deja esto**: cuando un fix de "no se corta más"
cambia también la FORMA del layout (acá: 2 filas en vez de 1),
verificar con el cliente si el cambio de forma en sí es aceptable —
"ya no se corta" y "se ve como yo esperaba" son dos preguntas
distintas, y un reporte de bug puede en realidad ser sobre la segunda
aunque la causa raíz sea la primera. La solución casi siempre está a
mitad de camino: no volver al layout roto, pero tampoco quedarse con
el primer layout que "funciona" — acá alcanzó con adelantar un
recorte que YA existía en el kit para un ancho más angosto.

---

## 6.17 Primera prueba real end-to-end del kit — 2 bugs reales confirmados en el kit mismo (kit v1.9.2)

§6.10.8 dejaba pendiente **la** validación real: un curso que arranque
copiando `kit-base/` completo y use los 6 módulos nuevos (`coto-player.js`,
`coto-media.js`, `coto-ui.js`, `coto-hotspots.js`, `coto-quiz.js`,
`coto-cierre.js`) TAL CUAL, sin reimplementar nada a mano en `curso.js`
(a diferencia de "Prevención cardiovascular", que nunca los cargó).
Ese curso fue **"Uso de Sucursales 3 - NOA"**, armado en otra sesión sin
acceso a este repo (flujo zip: kit-base.zip + PDF → curso nuevo). El
cliente lo comparó con "Prevención cardiovascular" y lo vio muy por
debajo — pidió auditar qué le faltaba al kit. La auditoría (comparación
de HTML/CSS/JS lado a lado + Playwright contra el zip real entregado)
encontró **2 bugs reales confirmados, los dos en `kit-base/` mismo, no
en cómo se usó** — la señal de que "extraído y validado en aislamiento"
seguía sin ser lo mismo que "anda en un curso real":

1. **`coto-player.js` — `#d-narrate`/`#d-fullscreen` quedaban
   invisibles SIEMPRE, en cualquier navegador.**
   `header-boilerplate.html` trae los dos botones con `hidden` en el
   HTML a propósito — para el caso SIN soporte de Web Speech API /
   Fullscreen API. Pero `initNarrateToggle()`/`initFullscreen()` en
   `coto-player.js` solo tocaban `btn.hidden` en la rama SIN soporte
   (`btn.hidden = true`); la rama CON soporte (el caso normal, el que
   pasa en cualquier navegador moderno) nunca hacía `btn.hidden =
   false`. Resultado: los botones de Locución y Ampliar quedaban
   ocultos para siempre, sin error en consola, en cualquier curso que
   usara el kit como está documentado. Nadie lo había visto antes
   porque "Prevención cardiovascular" — el único curso probado a fondo
   hasta ahora — nunca cargó `coto-player.js`: su versión de estos
   botones vive inline en su propio `curso.js`, sin el atributo
   `hidden` de arranque, así que el bug no tenía forma de aparecer ahí.
   **Fix**: `btn.hidden = false` agregado en la rama con soporte de
   las dos funciones. Verificado con Playwright contra el zip real
   entregado: antes del fix, cero controles de Locución/Ampliar
   visibles en el header pese a que el navegador soporta ambas APIs;
   después del fix (mismo HTML, solo reemplazando `coto-player.js`),
   los dos aparecen andando.
2. **`coto-base.css` — rutas de `@font-face` rotas.** Los 8
   `@font-face` apuntaban a `url('fonts/Nombre.woff2')` — una ruta
   relativa al propio archivo CSS (`css/coto-base.css`), que en
   realidad resuelve a `css/fonts/Nombre.woff2`. La carpeta real de
   fuentes del kit vive un nivel arriba (`fonts/`, hermana de `css/`),
   así que la ruta correcta es `../fonts/Nombre.woff2`. El bug estaba
   agazapado sin que nadie lo notara porque `prevencion-cardiovascular/`
   tiene, además de la carpeta `fonts/` correcta, una copia duplicada
   accidental en `css/fonts/` — un resabio de armado que sin querer
   "tapaba" la ruta rota. El curso nuevo no tenía ese duplicado (armó
   la carpeta limpia, como corresponde) y ahí sí se vio el 404: título/
   textos cayendo a la tipografía de sistema en vez de Faible/Roboto/
   Raleway. **Fix**: las 8 rutas corregidas a `../fonts/` en
   `kit-base/css/coto-base.css`. **Lección**: un curso con un archivo
   de más (la carpeta duplicada) puede estar ocultando un bug real en
   vez de ser simple desprolijidad — vale la pena preguntarse, ante
   cualquier carpeta "de más" en un curso que funciona, si no está ahí
   tapando algo.

**Lo que la auditoría NO encontró en su momento — decisión de contenido
del curso nuevo, no bug del kit** (para no confundir las dos cosas al
leer el reporte que se le mandó al cliente): el chip de logros/puntos y
el botón "Glosario" del header-boilerplate no aparecen en "Uso de
Sucursales 3 - NOA" porque ese curso no tiene sistema de puntaje ni
términos de glosario — se armó `initCierreCelebration({statIds:
[]})` y el header se recortó a mano sacando esos dos elementos. **El
cliente revisó esta "decisión de alcance" y la rechazó de plano — ver
§6.17.1: pasa a ser un requisito fijo, no algo opcional a criterio de
quien arma el curso.**

**Meta-lección de proceso, más allá de estos 2 bugs puntuales:** el
flujo de trabajo real es **kit-base vive en este repo, pero viaja a
cada curso nuevo por zip, hacia sesiones sin acceso a este repo**. Esas
sesiones SÍ pueden encontrar y corregir bugs reales del kit (como pasó
acá — el propio curso nuevo ya traía el fix de fuentes aplicado a su
copia local) pero **no tienen forma de devolver ese fix a este
`kit-base/` canónico** — el arreglo queda atrapado en el
`kit-base.zip` de esa sesión aislada, y este repo sigue con el bug
hasta que alguien lo trae de vuelta a mano (como se hizo acá). **Regla
de proceso**: cuando una sesión de curso nuevo reporta "encontré y
arreglé un bug del kit", ese fix tiene que volver a auditarse y
aplicarse ACÁ, en el `kit-base/` de este repo — no asumir que "ya
está resuelto" solo porque el zip que le devolvieron al cliente lo
tiene.

**Este hallazgo se formalizó como regla dura en §0.1**: el mecanismo
de "alguien se acuerda de traerlo de vuelta" no alcanza — ahora hay un
chat dedicado exclusivamente a `kit-base/`, y todo lo genérico que
surja en una sesión de curso se releva ahí en un prompt, nunca se edita
en el kit desde la sesión de curso misma.

---

## 6.17.1 Gamificación completa: requisito fijo, no decisión de alcance por curso

Tras leer el hallazgo de §6.17 (glosario y logros/puntos ausentes en
"Uso de Sucursales 3 - NOA" por decisión de esa sesión), el cliente
fue explícito: **eso no es una decisión de alcance válida, es un
faltante.** Regla fija desde acá en adelante, para TODO curso de este
molde, sin excepción salvo que el cliente la apruebe explícitamente
para un curso puntual:

- **Logros + puntos**: el chip del header (`data-open-badges`,
  `#d-badge-count`/`#d-points`) tiene que estar presente y funcionando
  — no se recorta del `header-boilerplate.html`. El cierre usa
  `initCierreCelebration()` con rangos de medalla reales (§6.10.6:
  los umbrales se CALCULAN sobre el puntaje realmente alcanzable de
  ESE curso, nunca `statIds: []` ni un cierre "unlocked" sin premio).
- **Glosario**: el botón "Glosario" del header tampoco se recorta.
  Todo curso tiene vocabulario propio del sector/sistema que vale la
  pena definir (nombres de pantallas, siglas, términos de proceso) —
  si a primera vista "no hay términos técnicos", releer el guion del
  PDF buscando nombres de sistema/sector/función que un colaborador
  nuevo no conoce todavía; casi siempre hay más de los que parece.
  Un glosario de 5-6 términos ya cumple la regla — no hace falta que
  sea largo, solo que exista y sirva de consulta real.
- **Al menos una mini-práctica o quiz** (`coto-quiz.js`): el curso
  tiene que darle al alumno una instancia real de poner en práctica lo
  visto, no solo consumir contenido pasivamente. Si el guion del PDF
  no trae una página de práctica explícita, se construye como
  interfaz propia (mismo criterio ya fijado en §3 punto 8) — un banco
  chico de 3-5 preguntas sobre el contenido de las unidades alcanza.
- **Las interacciones dan puntos de verdad**: hitboxes, hotspots,
  videos vistos — cualquier cosa que el gate (§6.10) ya exige para
  avanzar tiene que sumar puntos al completarse, no ser un trámite
  silencioso. Si algo es obligatorio para avanzar pero no premia nada,
  es la señal de que falta cablear `award()`/el sistema de puntos
  sobre esa interacción, no de que "no aplica" gamificación ahí.
- **Si de verdad no hay forma razonable de cumplir alguna de estas
  piezas** para un curso puntual (caso excepcional, no el default):
  **no se resuelve sacando el elemento en silencio.** Se consulta
  explícitamente con el cliente ANTES de entregar, y la decisión (y
  el motivo) queda documentada en el README del curso bajo
  "decisiones que se apartan del brief" — igual que cualquier otra
  desviación del molde estándar (§3 punto 8).
- **Para quien arranca un curso nuevo desde `kit-base/`**: el
  checklist de §7 ya incluye este chequeo como paso explícito — no
  alcanza con "los 6 módulos están cargados" (§6.10.8/§6.17), hay que
  verificar que las 4 piezas de esta lista estén realmente presentes
  y funcionando antes de dar el curso por terminado.

---

## 6.17.2 Auditoría dirigida: "traer de vuelta" prevención cardiovascular al kit — 1 gap real más encontrado

A pedido explícito del cliente ("tomá la última versión de prevención
y llenar el kit base con todo lo desarrollado"), se hizo una segunda
pasada — esta vez comparando función por función `curso.js` de
"Prevención cardiovascular" (1956 líneas, nunca migrado a los módulos
del kit — ver §6.10.8) contra los 6 módulos nuevos del kit, no solo
los 2 bugs puntuales de §6.17.

**Resultado principal: la enorme mayoría YA estaba migrada.** Cada
ronda de este curso (v1.1 a v1.9) fue, en los hechos, exactamente este
trabajo — extraer lo genérico de `curso.js` al módulo del kit que
corresponde. Un repaso función por función confirma que
`initGreeting/initSoundToggle/initNarrateToggle/initVoicePicker/
initFullscreen/initProgressSeek/initAutoplay/initResume` (chrome),
`initBgVideos/initVideoPlayer/initInlineCircleVideos` (media),
`initPopupNarration/initPopupStagger/initStatPopups/
initPrefetchNeighbors/initTiempoActivo` + sonidos (ui),
`initHotspots` (hotspots), `initMiniQuiz` (quiz), y
`animateCertStats/shineCertStats/celebrate/unlockCierre/mostrarResumen/
salirDelCurso/medallaDe/pintarMedalla` (cierre) tienen su equivalente
1:1 en el kit, con la misma firma y el mismo comportamiento.

**Lo que quedó fuera, y por qué está bien que quede fuera** (no son
gaps, son diapositivas específicas de ESTE curso): `initFactores`,
`initPieChart`, `initEtapas`, `initBarras` son 4 aplicaciones
distintas del mismo patrón toggle que `initHotspots` ya generaliza —
existen porque "Prevención cardiovascular" se escribió ANTES de que
`initHotspots` existiera en el kit y nunca se migró (mismo gap de
§6.10.8, ya documentado, no nuevo). `initPrediccion` es la excepción
de diseño de §6.10.2.2 (pop-up "¿Te la jugás?" → "Un momento,
pensemos"), a propósito UNA sola vez, no un patrón a generalizar.
`initSlideGates`/`missingSeen`/`missingPopups` son el cableado de gate
de ESTE curso sobre el punto de extensión `motor.canAdvance` — cada
curso escribe el suyo, es el patrón correcto (§6.10).

**El gap real que sí apareció — medalla, versión desactualizada.**
`css/coto-base-addendum-v1.8.css` todavía tenía la versión VIEJA del
componente `.d-medalla*` (teñir toda la caja con un degradado pálido
por tier) — la que el cliente rechazó explícitamente en la revisión
que dio origen a §6.13 punto 3. El rediseño real (badge saturado
propio alrededor del ícono + caja neutra + efecto cinematográfico de
pop elástico y destello al revelar) quedó documentado en `CLAUDE.md`
pero **nunca se había vuelto a traer al kit** — exactamente el mismo
patrón de falla que los 2 bugs de §6.17 (una sesión de curso encuentra
y arregla algo real, pero el kit canónico de este repo se queda
atrás). Se portó ahora:
- `css/coto-base-addendum-v1.8.css`: bloque `.d-medalla*` reemplazado
  entero por la versión real de "Prevención cardiovascular"
  (`.d-medalla-ic` con badge + `box-shadow`, `@keyframes d-medal-pop`/
  `d-medal-glow`, guard de `prefers-reduced-motion`, ajustes
  responsive en `max-height:800px`/`860px`).
- `js/coto-cierre.js`: faltaba la función `revealMedalla()` — el CSS
  nuevo depende de que algo agregue `.is-revealing` a `[data-medalla]`
  para disparar la animación, y nada lo hacía. Agregada (mismo cuerpo
  que la de "Prevención cardiovascular") y cableada en `mostrarResumen()`
  junto a `animateCertStats`/`shineCertStats` (`setTimeout(revealMedalla,
  150)`), mismo timing que el curso real.
- Verificado con una página de smoke test aislada (solo
  `coto-base.css` + addendum + `coto-cierre.css` + `coto-cierre.js`,
  sin nada de un curso real): antes del fix, badge plano sin
  tratamiento visual; después, degradado oro/plata/bronce con sombra
  sobre la caja neutra, igual al diseño aprobado por el cliente.

**Conclusión honesta para el próximo curso**: después de esta
auditoría, el kit SÍ contiene — código y estilos — prácticamente todo
lo desarrollado y aprobado en "Prevención cardiovascular". Lo que
falta no es volumen de funciones sin migrar, sino que **cada bug o
mejora real que una sesión de curso encuentre tiene que volver a
traerse a este `kit-base/` a mano** (§6.17 ya lo dejó como regla de
proceso) — no hay ninguna sincronización automática entre el
`kit-base.zip` que circula por las sesiones sin repo y este original.

---

## 6.18 Segunda vuelta de "Uso de Sucursales 3 - NOA" — 4 bugs reales más, los 4 en el kit (kit v1.9.4)

El curso se rehízo desde cero siguiendo el método de §7.1 (kit-base +
PDF + zip de "Prevención cardiovascular" como referencia). La auditoría
del PASO 1 —comparar módulo por módulo, función por función, el kit
contra el curso de referencia— **no encontró ninguna diferencia**: la
v1.9.3 ya tenía todo lo de "Prevención cardiovascular" migrado, y las
~94 clases `.d-*` que ambos comparten coinciden byte a byte. Los 4
bugs de esta vuelta aparecieron **construyendo el curso nuevo**, no
comparando con el viejo — que es exactamente el punto de §6.10.8: hay
bugs que solo se ven cuando alguien usa el kit de verdad.

**1 · `header-boilerplate.html` traía 3 botones que nada cableaba.**
El boilerplate marca Glosario, Ayuda y Logros con `data-open-glossary`
/ `data-open-help` / `data-open-badges`, pero el motor solo entiende
`[data-popup-trigger]` y ningún módulo del kit escuchaba esos otros
tres atributos. Un curso que copiaba el boilerplate tal cual —que es
literalmente lo que manda el checklist de §7— quedaba con **3 botones
muertos en la barra superior**: sin error en consola, sin nada que se
abra al tocarlos. Es el mismo patrón de falla que los botones de
Locución/Ampliar invisibles de §6.17, y por la misma razón: el curso
de referencia no usa el boilerplate (su header usa
`data-popup-trigger` directo), así que el bug no tenía dónde
manifestarse. **Fix**: `initHeaderShortcuts()` en `coto-player.js`,
que mapea los 3 alias al pop-up correspondiente (IDs configurables por
`opts`). **Lección**: cuando el kit ofrece DOS formas de declarar lo
mismo, hay que verificar que las dos estén implementadas — un atributo
que solo existe en la plantilla y no en el código es peor que no
tenerlo, porque parece que funciona.

**2 · Un `<video>` dentro de un pop-up de contenido no tenía quién lo
apagara.** `initVideoPlayer` sabe frenar SU reproductor
(`#d-video-player`) al cerrar; `initInlineCircleVideos` ya aprendió a
frenarse en `slidechange` (§6.10.1). Pero un `<video>` cualquiera
adentro de otro pop-up —el caso de este curso, donde cada ficha de
reporte es texto + su video— **no lo frenaba nadie**: se cerraba el
pop-up y el audio seguía sonando sobre la diapositiva. Tercera vez que
se paga la misma pregunta. **Fix**: `initPopupVideos()` en
`coto-media.js` (+ su CSS pareja en `coto-media.css`, con el
`aspect-ratio:16/9` que evita el falso bug de "video recortado" de
§6.14 punto 4 con placeholders de 0 bytes). Cubre cualquier pop-up del
molde: pausa y vuelve a 0 al cerrar, calla la locución al reproducir y
avisa el primer visionado por callback para que el curso premie sin
cablear listeners propios.

**3 · Sin `<link rel="icon">`, un curso nuevo no puede pasar su propia
suite.** El navegador pide `/favicon.ico`, no existe en el paquete, y
ese 404 entra como "error de consola" en **3 de los 6 tests**
(`deep-audit`, `markup-sanity`, `full-regress`). O sea: un curso recién
armado desde el boilerplate arranca con 3 fallos que no son del curso,
y quien audita pierde el tiempo buscando un archivo que no falta. El
curso de referencia SÍ tiene el favicon (data-URI en su `<head>`), pero
nunca se había subido a `header-boilerplate.html` — el mismo tipo de
hueco que §6.17 punto 2. **Fix**: la línea, como data-URI parametrizado
por color de categoría, agregada al boilerplate con la explicación al
lado.

**4 · `medallaDe()` daba la medalla equivocada si los rangos venían en
el orden "natural".** La función recorría `niveles` tal cual y devolvía
el primero que el puntaje alcanzara — correcto SOLO con el array
ordenado de mayor a menor, algo que no estaba escrito en ningún lado.
Con el array al revés (bronce, plata, oro — el orden en que uno los
piensa y los escribe) devolvía **siempre la medalla más baja**, sin
ningún error: 150 puntos exactos sobre un umbral de plata de 150
mostraban "bronce", y el subtítulo decía "te faltaron 20 para la de
oro" **salteando plata**, que es la pista de que algo estaba mal.
Encontrado recién en el recorrido end-to-end real, no por los tests
—ninguno llega al cierre, porque el gate de contenido los frena antes
(§6.10)—. **Fix**: `medallaDe()` ordena una copia por umbral
descendente antes de decidir, así el orden del array del curso deja de
importar. **Lección más general**: una función del kit que depende de
un orden implícito en los datos que le pasa el curso es una trampa —
o lo documenta y lo valida, o se vuelve independiente del orden. Y:
**los 6 tests en verde no significan "el curso anda"**; en cualquier
curso con gate hay que hacer además un recorrido completo a mano
(o con un script propio que resuelva los gates) hasta la última
pantalla, porque toda la lógica de cierre/medalla/estadísticas vive
justo del otro lado de donde la suite se frena.

---

## 6.19 Tercera vuelta sobre "Uso de Sucursales 3 - NOA" — auditoría dirigida contra "Prevención cardiovascular" pieza por pieza (kit v1.9.5)

El cliente pidió algo más puntual que §6.18: comparar, **componente por
componente**, el índice/glosario/ayuda/logros/resumen de cierre de este
curso contra los mismos componentes de "Prevención cardiovascular", y
además rehacer las fichas de reporte y el panel final del minijuego
para que sigan el diseño real del PDF. La sesión que armó la v1 de este
curso (§6.18) había escrito su PROPIA versión de varios de estos
componentes en vez de usar el contrato que el kit ya define — funcionan,
pero no se ven iguales al resto del molde. Hallazgos:

**1 · Índice/glosario/ayuda/logros: reinventados en vez de reusar el
contrato del kit.** La v1 de este curso armó su propio HTML para estos
4 pop-ups (con clases propias, sidenav con "candados" a mano) en vez de
copiar la estructura que ya define `coto-base-addendum-v1.8.css`
(`.d-sidenav-hd`/`.d-drawer-r`/`.modal-hd--dark`/`.d-badges-grid`
`.d-badge.earned`) y que el propio motor cablea solo
(`Motor.prototype._init` ya escucha `[data-goto]`, pone `.is-active` en
el activo). Resultado: visualmente distintos del resto del molde,
aunque funcionaban. **No es un bug del kit** — el kit ya tenía el
contrato correcto, documentado con ejemplo de marcado completo en el
addendum — es la lección de siempre (§6.17.2): "está en el kit" no
sirve de nada si la sesión que arma el curso no lo usa. Reescrito para
copiar el marcado tal cual, incluida `marcarVistas()` (mismo nombre y
misma lógica que el curso de referencia: `.is-done` en lo ya visitado,
nunca "candados" con `disabled` sobre diapositivas futuras — el índice
sirve para VOLVER, el motor ya deja `[data-goto]` saltar a cualquier
lado sin chequear gate, es una limitación conocida y aceptada desde
"Prevención cardiovascular", no algo que este curso deba resolver de
nuevo por su cuenta).

**2 · Resumen de cierre: layout propio en vez del contrato de
`coto-cierre.js`.** Mismo patrón — IDs inventados
(`d-cert-reportes`/`d-cert-situaciones`/...) en vez de los 4 fijos que
`initCierreCelebration` anima con el count-up
(`d-cert-score`/`d-cert-points`/`d-cert-badges`/`d-cert-tries`), sin
`.d-cert-stats .s` (el layout de tarjeta que espera el brillo del
kit), sin el botón "Imprimir resumen" ni la sección `#d-summary` que
lo respalda. Reescrito con el contrato real + contenido propio de este
curso en el resumen imprimible.

**3 · Gap real del kit, no de este curso: faltaba el esqueleto CSS del
resumen imprimible.** `coto-ui.js` trae `initSummaryPrint()` desde v1.6
y varios cursos ya tienen su propio `<section id="d-summary">`, pero
**ningún archivo del kit define el mecanismo genérico** de
mostrar/ocultar (`.d-summary{display:none}` + el bloque
`@media print{ body.printing-summary ... }`). Un curso que cablea el
botón y escribe su `#d-summary` (como pide el checklist) igual
terminaba imprimiendo la app en vivo, rota, porque nada ocultaba el
resto de la interfaz al imprimir. **Fix**: el esqueleto genérico subió
a `coto-cierre.css` (pareja de `initSummaryPrint`); el contenido de
`#d-summary` sigue siendo de cada curso, como corresponde.

**4 · Fichas de reporte: rediseñadas para seguir el PDF real (píldora
de título + esquina redondeada con la ✕), no el `.modal-hd` genérico.**
Es contenido específico de este curso (no sube al kit), pero dejó una
lección de proceso cara: al escribir la regla `.d-rep{padding-top:0}`
con un reemplazo de texto amplio, **se pisó por accidente todo el
resto de las reglas de `.d-rep`** (el grid de 2 columnas, las viñetas
de la lista) que ya estaban escritas más arriba en el mismo archivo —
la ficha quedó en 1 columna, texto y video apilados, sin ningún error
de sintaxis que lo delatara. Se encontró recién mirando el screenshot,
no leyendo el CSS. **Lección general**: un reemplazo de texto que
usa "desde este comentario hasta antes de aquella regla" es tan
peligroso como un merge a ciegas — hay que releer el bloque COMPLETO
después, no solo el fragmento que se tenía en mente al escribir el
`replace`.

**5 · Panel final del minijuego: reusa el arte REAL del diseñador con
las zonas de texto borradas, no una tarjeta genérica inventada.** El
cliente fue explícito: mismo diseño, mismos 2 personajes con trofeos,
la medalla central — el mensaje tiene que poder variar según el
resultado (aprobado / a reintentar) sin perder el arte original. Como
las 6 zonas de texto del PDF (título, bajada, 3 indicadores, botón)
estaban horneadas sobre fondo blanco liso, se pudo re-exportar la
imagen con esas zonas blanqueadas (Python/PIL, rectángulos blancos
sobre las coordenadas medidas) y poner HTML real encima, posicionado
con el MISMO mecanismo que cualquier hitbox sobre captura
(`Motor._initShots`, `[data-place]` para lo no-clickeable, `[data-hit]`
para el botón) — nada de layout propio a mano. **Técnica reusable**
para cualquier curso futuro que necesite un resultado condicional
sobre arte ya diagramado por el diseñador: blanquear solo lo que
cambia, mantener todo lo demás (personajes, íconos, decoración) tal
cual el PDF, texto real encima con las coordenadas de siempre.
Dos bugs de CSS reales al implementarlo, los dos con lección general:
  - `display:flex` sobre un contenedor con texto suelto + `<br>` +
    un `<b>` (mezcla de nodo de texto y elemento) trata cada uno como
    un ITEM DE FLEX separado con `flex-direction` en `row` (el
    default) — el texto y la etiqueta en negrita quedaban lado a lado
    en vez de una línea abajo de la otra. Fix: `flex-direction:column`
    explícito en cualquier contenedor flex que mezcle texto suelto con
    elementos hijos.
  - Un bloque de texto posicionado con `data-place` y anclado con
    `justify-content:flex-end` (pensado para el contenido más largo
    que medía el arte original) empujaba contenido más corto contra el
    borde inferior de su caja — pisaba el botón que está inmediatamente
    debajo. Fix: `flex-start`, el contenido dinámico se ancla arriba de
    su zona, no abajo.

**6 · Gap real del kit: `markup-sanity.mjs` asumía que TODO
`[data-hit]`/`.d-shot-hit` tiene que llevar su texto en `.sr-only`.**
Cierto en el 100% de los casos hasta ahora (botones invisibles sobre
capturas), pero el panel final del punto 5 introduce un patrón nuevo y
legítimo: un botón REAL con texto VISIBLE reconstruido sobre una zona
que el arte dejó en blanco a propósito. El test lo marcaba como el
mismo bug que dio origen al test (`sr-only` filtrándose por una
etiqueta sin cerrar) — falso positivo. **Fix**: nuevo atributo de
opt-out explícito, `data-hit-label-visible`, que el test respeta y que
dice en el propio marcado "este texto visible es a propósito, no una
fuga".

**7 · Interacción de las burbujas azules — CORREGIDO en §6.20: esto
SÍ era un bug, no gustos de diseño.** Lo que sigue quedó mal
diagnosticado en su momento y la vuelta siguiente lo revirtió: pulso
idle sutil y desfasado entre burbujas, hover/focus con `translateY` +
sombra propia (cubic-bezier con overshoot) y estado de presión al
tocar. El cliente lo rechazó explícitamente ("están muy feas y
desprolijas las animaciones... por qué no te copias un poco del
estilo que veníamos usando en Prevención?") — y contra el código real
de "Prevención cardiovascular", NINGÚN `.d-shot-hit` de ningún curso
del kit anima nada: el tinte de fondo en hover + el aro de foco que ya
trae `.d-shot-hit` en `coto-shot-stage.css` ES el estándar. Ver §6.20
punto 2 para el fix y la lección de proceso (inventar una interacción
"vistosa" sin verificarla contra el molde real, aunque se sienta
"mejor", es el mismo error de raíz que ya se documentó en §6.10.8).

---

## 6.20 Cuarta vuelta sobre "Uso de Sucursales 3 - NOA" — recrear con CSS un pop-up que el diseñador ya armó para copiar y pegar (kit-base v1.9.6)

Feedback del cliente con capturas: la ficha de reporte (pop-up con
texto + video) NO se parecía al PDF ("a vos te parece que los pop-ups
están iguales? solo tenías que copiar y pegar, no rehacerlos"), y
después una vuelta más específica: "no tenés que extraer solo el
pop-up, podés copiar directamente toda la diapo con el fondo blur, ya
el diseñador lo armó para que solo copies y pegues la diapo... vos
solo tenés que sumar el reproductor".

**1 · Ficha de reporte: de "recrear con CSS" a "captura íntegra +
overlay real" — mismo patrón `.d-shot-slide--bg-layered` de siempre,
aplicado a un pop-up.** La v1 de la ficha (§6.19 aplicado a este
pop-up) tenía título en píldora + esquina de color + columna de texto
+ columna de video con placeholder gris — todo reconstruido a mano en
CSS tratando de calcar a ojo el diseño del PDF. Resultado: proporciones
distintas del original y un video sin la captura+play que el diseñador
ya horneó en el arte. El pedido real era más simple Y más fiel: la
diapositiva COMPLETA del PDF (fondo difuminado + tarjeta blanca +
título + texto + mockup de video, todo en un mismo render) es un solo
`.d-shot-img`, y sobre esa imagen solo se agregan 2 elementos
posicionados por `Motor._initShots` — el mismo mecanismo que ya usan
las burbujas sobre las diapositivas normales, aplicado por primera vez
DENTRO de un `.modal-card`:
- un botón `[data-hit]` invisible sobre la ✕ ya dibujada (cierra el
  pop-up, `data-popup-close`);
- un `<video controls playsinline poster="...">` real como
  `[data-place]`, del tamaño y posición exactos del mockup ya dibujado
  (mismo `poster` — un recorte del propio render, no un placeholder
  genérico — así la transición póster→reproducción no salta).

Medido con detección de posición por comparación de píxeles (no a
ojo): las 10 fichas del curso comparten la MISMA región de video
(1923,619 a 2717,1128 sobre el render de 3360×1680) y la MISMA región
de ✕ (2654,248, 170×170) — son elementos de plantilla, idénticos en
las 10 diapositivas del PDF. Una sola coordenada de cada uno alcanza
para las 10 fichas.

**Bug real encontrado armando esto:** `.modal-card--shot` necesitaba
que su `.d-shot` interno reservara alto según `aspect-ratio:2/1` —
igual que el lienzo principal (`.d-shot-slide--bg-layered > .d-shot`).
El primer intento reusó el mismo patrón `container-type:size` +
`min(100cqw, 100cqh*2/1)` de ese lienzo, agregando `.modal-card--shot`
a la misma lista de selectores. Resultado: el pop-up abría
COMPLETAMENTE VACÍO (`.d-shot` con `clientHeight:0`, así que
`_initShots` nunca podía calcular ninguna posición). Causa: ese cálculo
con `cqw`/`cqh` depende de que el *contenedor* con `container-type:size`
ya tenga un alto propio resuelto desde AFUERA (el `.d-stage` del curso
lo tiene fijo por el layout de header+footer) — un `.modal-card` no
tiene ningún alto externo, así que con `container-type:size` no puede
resolver ni su propio alto ni el de sus queries: colapsa a 0. Fix: dentro
de un pop-up no hace falta esa gimnasia — `.modal-card` ya sabe encogerse
solo (`max-width`/`max-height:88vh` de la clase base del kit), así que
alcanza con `width:100%` + `aspect-ratio:2/1` directo, sin
`container-type` ni unidades `cqw/cqh`. Nueva clase genérica en
`coto-shot-stage.css`: `.modal-card--shot` + `.modal-card--shot > .d-shot`
— reusable por cualquier curso futuro que necesite este mismo patrón
("pop-up = captura íntegra de una diapo + overlay real").

**2 · Burbujas: animación de 3 capas revertida a la interacción
estándar del kit (ver corrección en §6.19 punto 7).** Se sacaron el
pulso idle (`@keyframes d-burbuja-idle`), el hover con
`translateY`+`scale`+sombra propia y el `:active` con scale — quedó
solo `border-radius` (medido contra el arte) + el `.is-done::after`
(puntito, sin animar). La interacción real vuelve a ser 100% la que ya
da gratis `.d-shot-hit` del kit (tinte en hover, aro en foco) — cero
CSS nuevo de interacción, coherente con "Prevención cardiovascular" y
con cualquier otro hitbox del curso.

**3 · Minijuego "se rompió todo": investigado, NO se encontró
regresión real.** Se rearmaron por script las 2 rutas (3/5 aprobado,
1/5 no aprobado) contra el build corregido y ambas renderizan
correctamente — título, bajada, contador, porcentaje, mensaje y el
botón correcto (`Continuar` solo si aprobó, `Reintentar` si no) todos
en su lugar, sin superposiciones. La captura que mostró el cliente
(3/5, 60%, "¡Excelente!", `Continuar`) es exactamente el resultado
esperado con `MJ_APROBAR = 3` de 5 — no hay bug visible reproducible.
Queda para confirmar con el cliente si la confusión es sobre el
UMBRAL en sí (¿por qué 60%?) más que sobre algo roto en pantalla — el
umbral es una decisión de negocio, no algo que este kit pueda inferir
solo. Las 3 vidas (corazones) del HUD son puramente decorativas — bajan
con cada error pero no cortan el juego ni afectan si se aprueba o no
(eso depende solo de aciertos ≥ `MJ_APROBAR`); si el diseño esperaba que
quedarse sin vidas interrumpiera el intento, es un requisito nuevo, no
un bug de esta implementación.

**4 · `.modal-card--shot` a 1100px dejaba la diapo chica, con doble
fondo difuminado.** Bug real en el fix del punto 1 de esta misma
sección: el ancho se dejó en `min(1100px,94vw)` — el tamaño default de
un pop-up de CONTENIDO (texto/listas), no el de una captura que ya es
la diapositiva completa con su propio fondo horneado. A 1100px la
imagen quedaba centrada con un marco de sobra alrededor mostrando la
diapositiva EN VIVO desenfocada detrás — dos "blur" distintos y
visibles a la vez. Pedido explícito del cliente: "la idea es que la
diapo del diseñador complete todo el espacio". Subir el tamaño a
`min(96vw,176vh)` NO alcanzó (ver punto 5): el doble fondo seguía ahí.

**5 · El fondo difuminado del PDF, sacado del arte — solo queda el de
la tarjeta.** El punto 4 subió el TAMAÑO del pop-up pero dejó el
`.webp` con el fondo difuminado del PDF horneado adentro — a
pantalla casi completa, el doble blur (el del PDF + el del propio
`.modal-back` del pop-up detrás) se veía todavía más, no menos.
Feedback del cliente con captura señalando el borde visible entre
ambos: "tenemos doble fondo y erróneo... de última sacale el fondo
del pop-up y recortalo, solo dejá el pop-up". Fix real: cada `.webp`
de ficha se recortó a SOLO la tarjeta blanca (bounding box del blob
blanco más grande de la página, detectado por componentes conexos —
mismas coordenadas en las 10 fichas: es un elemento de plantilla,
443,153 a 2916,1524 sobre el render de 3360×1680). Sin el fondo del
PDF horneado, el único blur que queda es el del `.modal-back` del kit
— uno solo, no dos. Como la tarjeta NO es 2:1 (es ≈1.805:1,
1980×1097), hubo que ajustar el `aspect-ratio` de `.modal-card--shot
> .d-shot` a la proporción real del recorte — con 2:1 fijo,
`object-fit:cover` (default de `.d-shot-img`) recortaba el arte para
forzarlo al cuadro equivocado. Las coordenadas de `[data-hit]`/
`[data-place]` (✕ y video) también se recalcularon relativas al
recorte nuevo, no a la página completa.

**6 · La ficha dejó de ser un pop-up — pasó a ser una CAPA de la
propia diapositiva.** El punto 5 dejó la ficha viéndose bien (una sola
capa de blur), pero seguía siendo un `.modal` — el cliente lo vio de
nuevo y fue tajante: "a vos te parece que está bien? no entiendo por
qué no copiás y pegás tal cual la diapo del diseñador, no la hagas
como pop-up, hacela como una diapo capa nueva a pantalla completa".
Fix real (no un ajuste de tamaño más — un cambio de mecanismo):
- Los 10 `<div class="modal" data-popup="rep-XXX">` se BORRARON
  enteros. Cada ficha ahora es un `[data-panel]` más, hermano del
  panel `base` (el contenido original con las burbujas), dentro de un
  `[data-layers]` que vive DENTRO de la propia `<section data-slide>`
  — el mismo mecanismo que ya usaba el minijuego para sus 3 capas
  (intro/jugar/fin), aplicado por primera vez a diapositivas-captura
  normales. La burbuja pasa de `data-popup-trigger` a `data-target`
  (cambia de capa en la MISMA diapositiva, no abre nada encima); el
  botón ✕ vuelve a `data-target="base"`.
- Cada panel de ficha reusa el patrón `.d-shot-slide--bg-layered >
  .d-shot` de siempre (mismo lienzo 2:1, mismas reglas cqw/cqh de
  `_initShots`) — puesto en el panel en vez de en la `<section>`
  (ahora hay 2 niveles de por medio: `[data-layers]` y `[data-panel]`).
  Puente nuevo en el `diapositivas.css` DEL CURSO (`.slide-inner[data-layers]{width:100%;
  height:100%;display:flex;align-items:center;justify-content:center}`)
  porque solo lo usan las 3 diapositivas con burbujas de este curso —
  si otro curso repite el patrón "captura con capas en vez de
  pop-up", vale la pena subir el puente al kit en su momento.
- **Bug real de proceso al migrar**: `initPopupVideos()` (coto-media.js
  §4) escucha el evento `popupclose` para pausar el video al cerrar —
  una capa nunca dispara ese evento (dispara `layerchange`). Sin
  arreglarlo, el video de la ficha hubiera seguido sonando después de
  cambiar de capa (mismo bug de "¿quién lo apaga?" de CLAUDE.md
  §6.10.1 punto 1, de nuevo). Se agregó `initLayerVideos()` — mismo
  contrato (silenciar locución al reproducir, premiar primer
  visionado, pausar+resetear al salir), pero escuchando `layerchange`
  y buscando el `[data-panel]` ancestro en vez de `[data-popup]`. El
  curso ahora llama `initLayerVideos()` en vez de `initPopupVideos()`
  (ya no queda ningún `<video>` real dentro de un `[data-popup]` en
  este curso).
- El atributo de la burbuja se renombró de `data-popup-trigger` a
  `data-ficha-trigger`: `data-popup-trigger` tiene cableado GENÉRICO
  en `motor-slides.js` (cualquier elemento con ese atributo dispara
  `showPopup()` al hacer clic) — dejarlo hubiera hecho que la burbuja
  intentara abrir un `[data-popup]` que ya no existe, además de
  cambiar de capa. `data-require-popups` (el atributo de gate en la
  `<section>`) se renombró a `data-require-fichas` por la misma razón
  de claridad, aunque no colisionaba con nada del kit.
- Aprovechando la reescritura completa del archivo, se sacó un
  fragmento de marcado roto que quedó de una edición anterior (un
  comentario HTML sin cerrar entre la sección del minijuego y
  "Últimos consejos" que por casualidad no rompía el render — el
  primer `-->` real que encontraba el parser resultaba estar más
  adelante, así que el contenido intermedio quedaba comentado sin que
  se notara desde afuera).

**7 · La capa SÍ tiene que verse como pop-up — con fondo difuminado
del PDF y todo.** Corrección inmediata al punto 6: sacar el `.modal`
no significaba sacar la estética de "tarjeta flotando sobre un fondo
difuminado" — el cliente lo aclaró con la MISMA captura del punto 5
("la capa nueva tiene que ser esta, como simulando que es un
pop-up"). El punto 5 ya había resuelto el doble-fondo sacando el
`.webp` de solo-la-tarjeta; ese cambio se revirtió: cada panel de
ficha vuelve a usar la diapositiva COMPLETA del PDF (fondo difuminado
horneado + tarjeta) como `.webp`, en las coordenadas originales de
`[data-hit]`/`[data-place]` sobre la página entera. La diferencia
real con el punto 5 (v3) es que ahora NO hay un `.modal-back` de
kit encima — el layer ES la diapositiva, así que solo hay UN fondo
difuminado (el horneado en el arte), nunca dos. Con el panel usando
el mismo `.d-shot-slide--bg-layered > .d-shot` (2:1, `object-fit:cover`
sin recorte porque el PDF completo SÍ es 2:1 real) no hizo falta
ningún `aspect-ratio` especial — es exactamente el mismo cálculo que
cualquier otra diapositiva-captura del curso, sin excepción nueva que
mantener.

---

## 6.21 Auditoría a pedido del cliente contra "Prevención cardiovascular", componente por componente (kit-base v1.9.7)

Pedido directo: "sentí que muchas cosas nos están quedando mal o
faltan". Se comparó cada componente visible de este curso contra el
código REAL del curso de referencia (no contra la memoria de sesiones
anteriores) — capturas lado a lado de header, índice, glosario,
ayuda, logros, salida y resumen, más un diff de clases CSS entre los
dos bundles. La mayoría coincidía ya (índice, glosario, ayuda, logros
y resumen están al día, herencia del trabajo de §6.19). 4 hallazgos
reales:

**1 · Los botones del header usaban atributos inventados
(`data-open-glossary`/`data-open-help`/`data-open-badges`) en vez del
mecanismo genérico del kit (`data-popup-trigger`).** El curso de
referencia usa `data-popup-trigger="glosario"/"ayuda"/"logros"` en
los 3 botones — el motor ya sabe abrir un pop-up con eso, sin JS
extra. La vuelta anterior de este curso (CLAUDE.md §6.18) había
"solucionado" que esos 3 botones no hicieran nada agregando una
función nueva al kit (`initHeaderShortcuts()`, coto-player.js) que
los traducía a `showPopup()` — un parche sobre un síntoma. La raíz
real era que `header-boilerplate.html` traía los atributos
EQUIVOCADOS: debían ser `data-popup-trigger` desde el principio, como
en la referencia. Fix real: se corrigieron los 4 atributos en
`header-boilerplate.html` (kit) y en este curso, y se borró
`initHeaderShortcuts()` — ya no hace falta, es el mismo mecanismo
genérico que abre el índice y cualquier otro pop-up. Lección: un
"arreglo" que agrega código nuevo al kit para que un síntoma
desaparezca, sin comparar contra el molde real, puede estar
tapando el bug en vez de corregirlo — exactamente el error de proceso
que ya describe §6.10.8, de nuevo.

**2 · `.d-sidenav-progress` y `.d-salida-eval` sin CSS propio.** Las
dos clases están en el contrato (las usa el marcado/JS del kit) pero
cada curso tiene que traer su propia regla en su `diapositivas.css`
— no son universales, dependen de `--cat`. Sin la regla, "Viste 1 de
12 secciones" se leía como párrafo negro grande en vez de nota chica
y gris, y el aviso de la evaluación en la pantalla de salida no se
distinguía como nota destacada. Se agregaron las 2 reglas
(equivalentes a las de "Prevención cardiovascular", con
`--cat-soft`/`--cat-strong` en vez de los hex hardcodeados que tenía
la referencia — CLAUDE.md §6.14 punto 2).

**3 · `coto-quiz.css`/`coto-quiz.js`/`coto-hotspots.js` cargados sin
usarse.** Los 3 archivos estaban en el `<head>`/`<body>` del curso
(cargados en cada visita) pero ningún marcado ni JS de este curso los
invoca — el minijuego reemplaza a la mini-práctica de quiz en el
diseño de este curso, así que esos módulos no aplican. Se sacaron las
3 referencias del `index.html` (los archivos siguen en `kit-base/`
para el próximo curso que sí tenga una mini-práctica de quiz).

**4 · Todo lo demás auditado coincide.** Header, índice/sidenav
(mismo `.ix-ck`, mismos grupos), glosario, ayuda, logros (grid de
tarjetas, mismo criterio de bloqueado/desbloqueado), resumen del
cierre (medalla + stats + recap de 3 columnas + imprimir), banner de
"retomá donde dejaste" (`#d-resume`) y el mecanismo de
"Finalizar curso" en 2 pasos (`data-nav-cta`/evento `navcta`) están
todos alineados con el molde real. La sensación de "muchas cosas
quedando mal" venía de estos 4 puntos puntuales, no de una brecha
estructural generalizada.

**5 · Chequeo visual recorriendo las 12 diapositivas a mano, pedido
aparte del cliente.** La auditoría de componentes (arriba) no
reemplaza mirar cada diapositiva real — se recorrieron las 12 por
captura. Confirmó un pendiente real que ya estaba anotado desde antes
sin resolver: en "Stock del sector" la burbuja mostraba **"Activos"**
horneado en el arte, pero abría la ficha **"Clavos (281)"** (el
nombre accesible sr-only ya decía "Clavos" — el desajuste era solo
visual, para el alumno vidente). Fix: se tapó "Activos" con el mismo
azul de la burbuja y se escribió "Clavos" encima (Roboto Bold, misma
altura y centrado que el resto de las burbujas — la fuente real del
diseñador no estaba disponible en `.ttf`, así que se usó la más
cercana ya empaquetada en el curso). Se eligió renombrar la IMAGEN
para que diga "Clavos", no la ficha para que diga "Activos": el resto
del curso (glosario, minijuego situación 5, ficha 281) ya usa
"Clavos" como nombre canónico del reporte — cambiarlo ahí hubiera
sido más invasivo y menos consistente. El resto del recorrido visual
no encontró nada más — el texto invertido en los círculos "Unidad
1/2/3" es diseño intencional del PDF (motivo de sello circular), no
un defecto.

**6 · Re-medición de TODOS los `[data-hit]` importantes contra el
PDF original (pedido explícito: "medilo contra el PDF").** No contra
capturas de pantalla ni contra memoria — contra los renders de las
33 páginas. Se re-detectaron por color+bounding-box las 10 burbujas
(2+5+3) de Ventas/Stock/Gestión, el botón "Empecemos" del minijuego y
el botón "Empezar" de la portada. Resultado: las 10 burbujas y el
botón del minijuego dieron una coincidencia EXACTA (a menos de 0.1
punto porcentual) contra los valores ya cargados — la medición
original de esas piezas fue correcta. **1 hallazgo real**: el botón
"Empezar" de la portada tenía un hitbox `data-h="7.30"` que se
quedaba corto contra la altura real de la píldora (medida: `8.10`)
— el ~1.7% inferior de la píldora visible (unos 21px sobre el lienzo
de 1260px) no respondía al clic/toque. Causa probable: la medición
original de ese botón se hizo a mano/aproximada, no por detección de
color como el resto — inconsistencia de método entre piezas, no un
cambio de diseño posterior. Fix: recalculado por el mismo método de
detección que ya usa el resto del curso (`data-l="75.06"
data-t="82.92" data-w="11.73" data-h="8.10"`). El botón "Continuar"/
"Reintentar" del final del minijuego mostró una diferencia mayor
(~1-3 puntos porcentuales) pero en la dirección de SOBRA, no de
falta — su hitbox es más grande que la píldora del PDF original, lo
cual es intencional ahí: es un botón HTML real con texto dinámico
sobre una zona repintada en blanco (§6.19 punto 6), no una
recreación 1:1 de un elemento oculto del arte, así que no aplica el
mismo criterio de "tiene que calzar exacto".

---

## 6.22 Ronda de UX/interacción a pedido del cliente (kit-base v1.9.7)

Pedido con 4 capturas y 6 puntos de texto — "miralo del lado de UX
diseño interacción, que todo esté en su correcto lugar".

**1 · El pop-up "Cómo recorrer el curso" ya calcaba el de referencia.**
El cliente pidió que quedara igual al de "Prevención cardiovascular"
(píldora "ANTES DE EMPEZAR", grilla 2×2 de tarjetas con ícono, botón
único al pie) pero en colores NOA. Al comparar: ya era así — la
vuelta de §6.19 ya lo había armado con ese contrato
(`.d-instr-modal`/`.d-instr-cardgrid`/`.d-instr-card`) y en azul NOA.
Sin cambios; se dejó registrado para no reabrirlo por error creyendo
que faltaba.

**2 · Hover de las burbujas: el aro de color, no el tinte plano.**
El cliente señaló con captura el hover de los círculos de ENT en
"Prevención cardiovascular" (`.d-shot-hit--ent`, ya documentado en
CLAUDE.md §6.10.3 "resaltar una hitbox: el ícono, no la caja") y
pidió aplicarlo a las burbujas. La v2 de la burbuja (§6.19 punto 7)
había vuelto al tinte plano genérico pensando que ESE era "el estilo
de Prevención" — en realidad el tinte plano es el default para
cualquier hitbox que NO pide el patrón de aro, y los que sí lo piden
(como ENT) usan exactamente este aro. Fix en `assets.css`:
`.d-shot-hit--burbuja` pasa a `background:transparent` con un
`box-shadow` de aro (`color-mix(--cat-strong 55%)`) + elevación
mínima en hover/focus, sin tinte de fondo.

**3 · La ficha vuelve a ser un pop-up real (otra vez).** El cliente
probó la versión de capa (§6.20/§6.21) y objetó algo que ninguna
captura mostraba: "si bien estéticamente queda similar, la idea es
que el pop-up viva separado del fondo, para poder cerrarlo tocando
el fondo" — una capa dentro de la diapositiva nunca iba a poder dar
eso, por diseño (no hay backdrop, no hay nada "afuera" que tocar).
Se ofrecieron 2 caminos (recortar el fondo del arte, o pedirle al
diseñador páginas sin fondo) y se optó por el primero, ya resuelto
en v3 (§6.20 punto 5): el `.webp` de cada ficha vuelve a ser SOLO la
tarjeta (sin el fondo difuminado del PDF), montada de nuevo en un
`.modal`/`.modal-card--shot` real — con `.modal-back
data-popup-close` (tocar afuera cierra) y sin doble blur (el único
fondo difuminado que se ve es el del propio `.modal-back`). Las 10
burbujas volvieron a `data-popup-trigger` (cableado genérico del
kit); `data-ficha-trigger` se mantiene aparte, solo para las marcas
de "visto"/"mirado" (punto 4). Sobre "la cruz mal posicionada": con
las coordenadas del recorte de v3 (`l:89.41 t:6.93 w:6.87 h:12.40`)
el hitbox cubre la X del arte con margen de sobra — se remidió y no
se encontró error; probablemente la observación fue sobre la versión
de capa (con la página completa, otras coordenadas), ya reemplazada.

**4 · Tilde verde al mirar el video, no solo al abrir la ficha.**
Pedido explícito, mismo criterio que el check verde (`#2e7d32`) de
"Prevención cardiovascular" en sus tildes de avance. Se agregó
`estado.videosFicha` (nuevo, separado de `estado.fichas` que ya
marcaba "abrí la ficha") y `marcarBurbujaVisto()`, disparado desde
`initPopupVideos({onFirstPlay})` — que volvió a usarse tal cual (ya
existía en el kit, había quedado sin uso durante la vuelta de capas).
CSS nuevo: `.d-shot-hit--burbuja.is-watched::after` (tilde ✓ blanca
sobre círculo verde, reemplaza visualmente al puntito de `.is-done`
en el mismo lugar — nunca compiten porque "visto" implica "abierto").

**5 · Botón Continuar/Reintentar del minijuego: rectángulo blanco
detrás rompiendo el arte.** Bug real de una vuelta anterior
(§6.17.1/§6.19): al preparar `minijuego-fin.webp` para el texto
dinámico se pintó un rectángulo blanco RECTO sobre la zona del botón
original (que en el arte real es una píldora redondeada más chica)
— el botón CSS (píldora, `border-radius:999px`) no cubría las 4
esquinas del rectángulo, así que quedaban asomando como un recuadro
blanco alrededor del botón redondeado. Fix: se repintó esa franja
con el color de fondo real de la ola (`rgb(150,157,207)`, medido con
color-picker) en vez de blanco — ya no hay nada que sobresalga del
botón, cualquiera sea su forma.

**6 · Resumen de cierre: "se ve muy chiquito" — bug real, no
opinión.** Encontrado auditando `coto-cierre.css`: un bloque de ~20
reglas (`.d-cierre-recap`, `.d-cert-note`, etc.) estaba escrito SIN
ningún `@media` que lo envolviera, y ESE MISMO bloque de valores
(los 3 escalones de compresión para pantallas bajas) ya estaba
correctamente envuelto en `@media (max-height:860/740/660px)` más
abajo en el archivo — comparación línea por línea confirmó que eran
duplicados exactos. El bloque sin `@media` se aplicaba siempre,
pisando en cascada TODO lo de arriba con los valores del escalón más
chico (pensado para pantallas de 660px de alto), sin importar el
tamaño real de pantalla — por eso se veía "muy chiquito" incluso en
pantallas grandes. Fix: se borró el bloque duplicado sin `@media`
(las versiones correctamente envueltas siguen intactas). Aparte, a
pedido del cliente ("agregale más info, para qué sirve cada
reporte"): el repaso rápido pasó de una lista de nombres a una lista
de definición con nombre + 1 línea de qué hace cada uno de los 10
reportes (`.d-recap-rep`, mismo patrón visual que `.d-gloss` pero en
color de categoría), y el ancho del resumen subió de 1400px a
1680px/96% para aprovechar mejor pantallas grandes.

**7 · Fila de tildes verdes "N de M videos vistos" — el cliente
mandó una captura aparte para aclarar el punto 4.** La captura
mostraba el patrón exacto de "Prevención cardiovascular": no solo el
checkmark chico sobre cada burbuja (eso ya estaba, punto 4), sino
también una FILA de tildes agrupadas con etiqueta ("Factor 1 de 6" +
6 círculos que se ponen verdes uno por uno) — el patrón
`.d-u2-prog`/`.d-u2-tick` que ya estaba identificado en el kit
(comentario de §6.10.3) pero nunca se había portado a un curso nuevo.
Se agregó una fila por cada una de las 3 diapositivas con burbujas
(2/5/3 tildes según la cantidad de reportes de esa unidad),
posicionada con el mismo mecanismo `[data-place]` de siempre, debajo
del párrafo de introducción. **Bug real al armarlo**: la primera
pasada dejó el elemento invisible en la posición equivocada (caía
pegado al pie de la diapositiva en vez del 40% de alto pedido) —
`.d-u2-prog` no tenía `position:absolute`, así que el
`left`/`top` en píxeles que calcula `_initShots` no hacía nada
(un elemento en flujo normal ignora `top`/`left`). Mismo tipo de
bug que ya avisa el comentario de `_initShots` en motor-slides.js
sobre por qué CUALQUIER `[data-hit]`/`[data-place]` nuevo necesita
heredar `position:absolute` de alguna clase base — acá se agregó
directo en la regla en vez de heredarlo, y se pasó por alto.

**8 · "La cruz y el play siguen sin funcionar", "las tildes no se
marcan" — investigado, NO son bugs de este curso.** Los 10
`video/*.mp4` son placeholders de 0 bytes (documentado desde CLAUDE.md
§3.9: el cliente todavía no entregó los videos finales). Con un
`<video>` de 0 bytes, `.play()` no dispara el evento `play` (el
navegador no tiene nada que reproducir) — por eso el botón de play no
hace nada VISIBLE, y por la misma razón `initPopupVideos`
(`onFirstPlay`) nunca se dispara, así que la tilde verde tampoco se
marca. Se verificó por script que el botón ✕ SÍ cierra el pop-up
(clic real en sus coordenadas, en 4 tamaños de ventana distintos) y
que el `<video>` está bien posicionado — el bloqueo real es la falta
de archivo, no el marcado ni el JS. Van a funcionar solos en cuanto
se reemplacen los 10 placeholders por los videos reales, sin tocar
código.

**9 · "No hiciste el pop-up de inicio" — investigado, el gate SÍ
funciona, pero dispara al SALIR de "Índice", no al entrar.**
Comprobado por script el flujo completo: Portada → Empezar →
Objetivos → Siguiente (a Índice, sin pop-up, correcto) → Siguiente
(intenta ir a Unidad 1) → ahí SÍ aparece "Cómo recorrer el curso" y
bloquea el avance hasta cerrarlo. Es el mismo mecanismo y el mismo
criterio que usa "Prevención cardiovascular" con su propio
`data-gate-popup="instrucciones"` (también en la diapositiva de
índice, no en la anterior) — `Motor.prototype._advance` gatea
`data-gate-popup` de la diapositiva que se está por ABANDONAR, no de
la que se está por entrar, por diseño (ver comentario en
motor-slides.js). Si el cliente lo espera más temprano (por ejemplo
disparado directo después de "Empezar"), es un cambio de UX a
confirmar explícitamente, no una corrección de bug — mover el
`data-gate-popup` a la diapositiva "Objetivos" lo lograría.

**10 · Fila de tildes: alineada al párrafo y más abajo.** Pedido
puntual — pasó de `data-l="3" data-t="40"` (posición arbitraria) a
`data-l="12.94" data-t="44"`, medido contra el borde izquierdo real
del párrafo de texto en el arte (mismo margen que el título) y con
más aire debajo del párrafo más largo (Stock del sector, 2 líneas +
2 líneas).

---

## 6.23 Portada y separadores de unidad pasan a video de fondo — 1 bug real de kit encontrado (kit-base v1.9.8)

El cliente confirmó que portada y los 3 separadores de unidad
(`unidad1`/`unidad2`/`unidad3`) son diapositivas con VIDEO de fondo,
no imagen estática — mismo patrón que usa "Prevención cardiovascular"
en su propia portada/separadores (`d-shot-slide--bg-video` +
`<video class="d-shot-video">` con `poster`, en vez de
`d-shot-slide--bg-layered` + `<img class="d-shot-img">`). Los videos
reales los agrega el cliente después, directo en el zip — igual
convención que las 10 fichas de reporte, que ya usan placeholders de
0 bytes desde §3.9.

**Cambios:**
- Las 4 diapositivas convertidas a `d-shot-slide--bg-video` con
  `<video class="d-shot-video" playsinline preload="auto"
  poster="img/X.webp"><source src="video/X.mp4"></video>` +
  `.d-shot-video-tap` (botón de gesto para autoplay con sonido
  rechazado), markup idéntico al de la referencia.
- 4 placeholders nuevos de 0 bytes: `video/portada.mp4`,
  `video/unidad1.mp4`, `video/unidad2.mp4`, `video/unidad3.mp4`.
- `initBgVideos()` (ya existía en `coto-media.js`, sin uso) ahora se
  llama desde `boot()` en `curso.js` — quedaba escrito en el kit pero
  ningún curso lo invocaba todavía.

**Bug real de kit encontrado al probar esto — `hitbox-click-check`
lo agarró en el primer test:** la portada tiene un botón "Empezar"
dibujado en el arte, con hitbox `[data-hit]` posicionada en
`data-l/t/w/h`. `Motor.prototype._initShots` (motor-slides.js) mide
SIEMPRE contra `.d-shot-img` (`naturalWidth/naturalHeight`) para
calcular dónde cae esa hitbox — con la portada ahora en video, no hay
`.d-shot-img` en la diapositiva, así que la hitbox quedaba en 0×0 (no
inicializada). La referencia nunca tuvo este caso porque en
"Prevención cardiovascular" ninguna diapositiva con video de fondo
real (con `<video>`, no solo la clase CSS) tiene hitboxes encima — es
una diferencia de diseño de este curso, no algo que la referencia ya
hubiera resuelto.

Fix en el kit (`motor-slides.js`, `_initShots`): ahora soporta tanto
`.d-shot-img` como `.d-shot-video`. Cuando el fondo es video, mide
contra las dimensiones naturales del `poster` (una `Image` oculta
cargando esa URL) en vez de `videoWidth/videoHeight` del propio
video — el poster siempre está presente y es el mismo arte que
tendría la imagen estática, mientras que un video de 0 bytes (o
todavía sin cargar) nunca expone `videoWidth`. Cualquier curso futuro
que ponga un `[data-hit]`/`[data-place]` sobre una diapositiva de
video de fondo hereda el fix gratis, igual que con `.d-shot-img`.

Verificado: `hitbox-click-check` pasa (portada 0×0 → tamaño correcto,
clic real funciona), los otros 5 tests del kit también pasan, y por
captura se confirmó que la portada muestra el poster + botón de
gesto (autoplay con audio rechazado, como es de esperar con un
video de 0 bytes) sin romper el layout.

**Además, en la misma ronda:**
- **Botón "Empezar mi aprendizaje" sin centrar — bug real, CSS
  faltante.** El curso no tenía ninguna regla base para
  `.d-instr-cta` (solo el addendum del kit define su `background`,
  nunca su `display`/alineación) — sin `display:flex;
  justify-content:center` el botón quedaba pegado a la izquierda de
  su contenedor. Se agregó la regla, idéntica a la que ya usa
  "Prevención cardiovascular" en su propio `diapositivas.css`.
- **Tildes de avance de video más grandes:** `.d-u2-tick` pasó de
  `clamp(16px,1.8cqw,26px)` a `clamp(20px,2.3cqw,32px)`, pedido
  puntual del cliente.

---

## 6.24 Revisión full a pedido del cliente: 20 hallazgos, y el peor no lo veía ningún test (kit-base v1.9.9)

El cliente pidió "una revisión full, proponeme 20 correcciones y
mejoras" mientras esperaba el PDF nuevo. De los 20, se ejecutaron 17
(los 4 críticos + 13 elegidos por el cliente). Lo importante no es el
número: es **dónde** estaba el peor.

### El bug que 6 tests en verde no podían ver

`motor-slides.js` emite `courseend` al llegar a la diapositiva marcada
`data-slide-end`, y `courseexit` al salir. **Ningún curso escuchaba
ninguno de los dos.** Consecuencia: `SCORM.markCompleted()` no se
llamaba nunca, así que el alumno recorría el curso entero, aprobaba el
minijuego, llegaba al resumen — y en el LMS su estado seguía siendo
`incomplete`. Para el negocio, el curso no servía para nada.

Los 6 tests del kit estaban en verde porque **todos miran el DOM**:
marcado, hitboxes, teclado, scroll, recorrido, auditoría. Ninguno
miraba la conversación con el LMS, que es justo lo que el cliente
paga. Por eso el fix incluye un 7º test (`scorm-tracking.mjs`) que
levanta un LMS falso en `window.API` y verifica el contrato mínimo.
**Lección: un test que no puede fallar por la razón por la que el
producto existe, no está cubriendo el producto.**

### Corrección de un hallazgo propio, antes de romper nada

El hallazgo inicial decía "`setScore()` nunca se llama, la nota no
viaja al LMS". Es cierto, pero el fix obvio era **peor que el bug**:
`setScore()` marca `passed`/`failed` de forma irreversible, y este
curso NO es la evaluación (el texto de salida dice que el cuestionario
es aparte, en la plataforma). Llamarla habría **reprobado** a quien
sacara 2/5 en un minijuego de práctica. "Prevención cardiovascular"
tampoco la llama nunca — el patrón ya estaba, mal leído.

Fix real: `setProgressScore()` nuevo en el kit, que reporta
`score.raw` como dato informativo **sin tocar `lesson_status`**. La
inconsistencia "minijuego aprueba con 60% pero MASTERY es 70" se
disuelve sola al no flipear estado. En `setScore()` quedó el comentario
que dice cuándo sí y cuándo no usarla.

### Gates que no se pueden satisfacer

Al hacer los videos obligatorios (`faltanVideos`) apareció un riesgo
real: los `.mp4` son placeholders de 0 bytes hasta que el cliente suba
los finales. Un gate a secas dejaba el curso **imposible de terminar**
— el alumno trabado esperando ver un video que no existe. `faltanVideos`
descarta los videos cuya fuente no se puede reproducir (`v.error` o
`networkState === 3`): hoy no molesta, y en cuanto entren los archivos
reales empieza a exigir solo, sin tocar código. **Regla: un gate nuevo
sobre un recurso que todavía no existe tiene que degradar, no trabar.**

### El resto, en breve

- **Botón de play fantasma (kit)**: `initBgVideos` mostraba el ▶ ante
  *cualquier* rechazo de `play()`, incluso con la fuente rota. Ahora
  solo ante `NotAllowedError` (lo único que un gesto arregla).
- **Estado duplicado**: `estado.videos` (por `src`, rutas largas) y
  `estado.videosFicha` (por id) guardaban lo mismo. Quedó solo el
  segundo; `initPopupVideos` ahora pasa `popId` también a
  `seen`/`mark`. `suspend_data` medido: 126 caracteres con 3 fichas,
  lejos del techo de 4096 — pero ahora el test lo vigila.
- **Índice clicable, solo hacia atrás**: pedido explícito — saltar
  libre habría anulado los gates de obligatoriedad. Los destinos no
  visitados quedan `disabled` (fuera del tab order gratis).
- **Intentos del minijuego**: sacados del estado, del `suspend_data` y
  del panel final por pedido del cliente. La 4ª tarjeta del cierre
  ahora muestra "videos vistos". El índice de `cmi.interactions` usa un
  contador local de sesión, no persistido.
- **Dato redundante encontrado de paso**: el panel final mostraba
  "3/5 situaciones" y "60% completado" — el mismo número dicho dos
  veces. El segundo pasó a mostrar el puntaje del juego, que sí agrega
  una dimensión (descuenta por error).
- **Glosario**: de 15 a 31 entradas. Faltaba lo más buscado —
  encontrar un reporte **por número** ("pasame el 219"), que es como
  los nombra la gente en la sucursal.
### Promoción al kit: la deuda que casi se repite

Los arreglos salieron funcionando pero **quedaron en `curso.js`**, que
por la tabla de §1 es archivo del curso. Tres no leían nada propio de
este curso, así que por esa misma regla les tocaba subir — y no
subirlos era exactamente el patrón que genera los bugs de estas
vueltas: algo se resuelve bien en un curso y se vuelve a descubrir,
roto, en el siguiente. Promovidos:

| Antes (curso.js) | Ahora (kit) |
|---|---|
| `habilitarIndice()` | `initIndexJumps(opts)` — coto-ui.js |
| `precargarFichas()` | `initPopupPrefetch(opts)` — coto-ui.js |
| `roto(v)` (local de initBgVideos) | `videoUsable(v)` — coto-media.js, exportado |
| `.d-shot-hit--indice` (assets.css) | coto-shot-stage.css |
| `.d-glossary-sub` (diapositivas.css) | coto-base-addendum-v1.8.css |

`videoUsable` es el caso más claro de por qué conviene: la MISMA
pregunta ("¿este video se puede reproducir?") resuelve el bug del ▶
fantasma y el riesgo del gate imposible. Teniéndola en dos lados se
arregla una y se olvida la otra.

En `curso.js` queda solo lo que sí es de este curso: de dónde sale
"ya visitado" (`estado.vistas`) y qué pop-ups precargar. Verificado
después del refactor: índice deshabilitado en fresco, habilitado tras
pasar por la unidad, clic navega, y las 2 fichas de "Ventas del
sector" se precargan al entrar.

- **2 hallazgos propios que resultaron falsos** y se verificaron antes
  de "arreglarlos": `SCORM.finish()` en `pagehide`/`beforeunload` ya
  estaba (scorm-api.js), y el resumen imprimible ya estaba completo y
  cableado. `prefers-reduced-motion` también estaba cubierto en los 9
  CSS. **Auditar incluye descartar los propios hallazgos.**

---

## 6.25 La tilde verde no se marcaba: un bug que YO introduje al "limpiar" estado duplicado

El cliente reportó tres veces que las tildes verdes no se marcaban. Las
dos primeras lo atribuí (con evidencia) a los .mp4 de 0 bytes: sin
archivo no hay evento `play`, sin `play` no hay tilde. Era cierto —
pero incompleto, y tapó un bug real que había metido yo.

**Cómo se encontró:** en vez de volver a explicar la teoría, generé un
.mp4 real de 2 segundos con ffmpeg, lo puse en lugar de un placeholder
y probé la cadena entera. El evento `play` disparó **y la tilde siguió
gris**. Ahí se acabó la hipótesis del placeholder.

**Causa:** al deduplicar el estado (§6.24) apunté `markSeen` al mismo
mapa que usaba la guarda de `onFirstPlay`:

```js
// coto-media.js — el orden importa
if (!visto.seen(src, popId)) {
  visto.mark(src, popId);                 // escribe estado.videosFicha[popId]
  opts.onFirstPlay(src, popId);           // ...y recién acá corre el curso
}

// curso.js — la guarda ya no podía ser verdadera NUNCA
onFirstPlay: function (src, popId) {
  if (popId && !estado.videosFicha[popId]) {   // ← siempre false
    marcarBurbujaVisto(popId);
  }
}
```

Antes de la limpieza, `markSeen` escribía en `estado.videos` (otro
mapa), así que la guarda seguía funcionando por casualidad. Al unificar
los mapas —que era lo correcto— quedó una doble verificación del mismo
hecho, y la segunda se volvió imposible.

**Fix:** sacar la guarda. `initPopupVideos` YA garantiza que
`onFirstPlay` corre una sola vez; el curso solo tiene que reaccionar.

**Lecciones, las dos caras:**
1. **Una condición verificada dos veces contra el mismo dato es una
   condición muerta esperando.** Si el módulo ya decide "primera vez",
   el consumidor no vuelve a preguntarlo.
2. **Una explicación correcta puede tapar un bug.** El diagnóstico de
   los 0 bytes era verdadero y verificable, y por eso mismo frenó la
   investigación dos rondas. Cuando el cliente insiste después de una
   explicación que cierra, conviene reproducir con el recurso REAL
   (acá: fabricar el .mp4 que faltaba) en vez de repetir el argumento.

**De paso, medido y corregido:** la hitbox de la ✕ de las fichas cubría
x 1770-1906 / y 76-212 cuando la ✕ dibujada mide 33×33px centrada en
(1886, 94) — colgaba 116px a la izquierda y 101px por debajo del
símbolo visible. Ahora es un cuadrado de 77px centrado en la ✕ (área
táctil cómoda, ~51px en pantalla a 1400px de ancho). Las 10 fichas
tenían la ✕ en el mismo píxel, verificado una por una.

**Confirmado con video real:** la ficha reproduce EN EL LUGAR con los
controles nativos (play/pausa, tiempo, volumen, **pantalla completa**),
que es exactamente lo que pedía el cliente. No hacía falta cambiar
nada: `controls` ya estaba en el marcado.

---

## 6.26 Rebuild sobre el PDF v2: cuando el arte mejora, aparecen bugs que el arte viejo tapaba (kit-base v1.9.10)

El cliente pidió al diseñador tres cosas concretas y las tres llegaron:
pop-ups **sin fondo horneado**, una **segunda arte de cierre** para el
minijuego (reintentar además de continuar), y los **datos en blanco**
para completarlos por código. 29 páginas contra 33 de la v1.

### Auditar el PDF ANTES de construir: 3 errores de contenido

1. **Objetivos B y C idénticos**, palabra por palabra.
2. **La burbuja seguía diciendo "Activos"** donde el índice, la ficha y
   el minijuego dicen "Clavos (281)". Mismo error que en la v1, no
   corregido. Evidencia 3 a 1 → se repinta a "Clavos" otra vez.
3. **La situación 1 del minijuego mostraba resaltado el 194** cuando el
   enunciado es textualmente la descripción del 191. Acá el hallazgo
   más útil fue el negativo: **el curso ya tenía `ok: '191'`**. El
   error vivía solo en el mockup. Sin revisar el código antes de
   "arreglarlo", se habría roto algo que estaba bien.

### Los bugs que el arte nuevo destapó

**1 · `_initShots` no re-medía al cambiar el `src` (bug de kit).** El
listener de `load` se enganchaba SOLO si la imagen no estaba completa
al iniciar. El panel final ahora cambia de arte según el resultado, y
como las dos artes miden lo mismo el `ResizeObserver` tampoco
disparaba: las hitboxes y los `[data-place]` se quedaban sin calcular.
Fix: enganchar `load` siempre. **Regla: un elemento cuyo `src` puede
cambiar en caliente necesita que el recálculo esté atado al evento, no
al estado inicial.**

**2 · El CSS pintaba fondo sólido sobre el botón del cierre**, tapando
el texto que ahora viene horneado. Pasó a ser hitbox transparente,
mismo patrón que el "Empezar" de la portada. **Cuando el arte empieza a
traer una pieza, el CSS que la dibujaba deja de ser estilo y pasa a ser
estorbo.**

**3 · Inconsistencia entre las dos artes nuevas**: en "reintentar" el
primer ícono está 51px más abajo que en "continuar". Se ubicaron los
indicadores en una posición que despeja las dos, en vez de moverlos por
JS según la variante.

### Medir, no estimar (otra vez)

Las 10 burbujas se re-detectaron por color. Dos salían de ~700px contra
~455px de las demás: el navy de la burbuja es contiguo con el traje del
personaje, así que la caja se estiraba hasta el hombro. Con el aro de
hover eso se ve mal y además hace clickeable a una persona dibujada.
Fix: avanzar desde el borde izquierdo hasta el primer hueco real de
cobertura. Las 10 quedaron en ~455px.

### Parametrizar en vez de hardcodear

La proporción del recorte de ficha cambió (1980×1097 → 1902×1076).
Estaba escrita a mano en `coto-shot-stage.css`, que es archivo de KIT —
o sea que el kit venía cargando un dato del arte de UN curso. Ahora el
kit expone `--shot-card-ratio` con un default y cada curso declara la
suya. **Si un valor del kit cambia cada vez que cambia el arte, no era
del kit: era una variable disfrazada de regla.**

---

## 6.27 Ronda de pulido visual sobre el PDF v2: 5 pedidos puntuales (kit-base v1.9.11)

**1 · Nombres de video.** El cliente exporta los 10 videos como
"Reporte 191.mp4", "Reporte 194.mp4"... — se renombraron los 10
placeholders y sus 10 referencias en `index.html` para calzar exacto
(antes usaban slugs propios, ej. `191-evolucion-de-ventas.mp4`).

**2 · Tildes pegadas al párrafo — bug real de medición.** El párrafo
de "Stock del sector" en el PDF v2 es más largo que en la v1 y termina
en `data-t≈45.16%`; la fila de tildes seguía en `data-t="44"` (medido
contra el arte VIEJO, nunca reajustado tras el rebuild). Se subió a
`48.5` con margen suficiente para las 3 variantes (ventas 40.08%,
stock 45.16%, gestión 41.98%).

**3 · La forma del hover, corregida con la silueta real, no con
CSS genérico.** El cliente lo dijo con precisión: "esa forma no se
parece a la correcta". Tenía razón — `border-radius:2.2em` dibuja un
óvalo uniforme, pero el globo de diálogo del PDF tiene una "colita"
apuntando al personaje, una curva asimétrica que ningún
`border-radius` reproduce. Fix: se extrajo el contorno EXACTO de cada
una de las 10 burbujas en píxeles (componente conexo no-blanco que
contiene el centro medido, agujeros de texto rellenados con
`binary_fill_holes`, dilatado 6px y restado el original → queda solo
el borde), guardado como máscara PNG→WebP de ~4-5KB por burbuja
(`img/masks/rep-XXX-ring.webp`). En CSS, un `::before` con
`mask-image` + `background:var(--cat-strong)` dibuja el aro con la
forma real, oculto por opacity y visible en :hover/:focus-visible.
**Bug de implementación propio, encontrado antes de entregar**: los
`url()` de un CSS se resuelven relativos a la carpeta del ARCHIVO CSS,
no a la raíz del sitio — escribir `url(img/masks/...)` desde
`css/assets.css` apuntaba a `css/img/masks/...`, que no existe. Se
corrigió a `url(../img/masks/...)`, mismo criterio que ya usan los
`@font-face` de `coto-base.css`.

**4 · Botón "Ampliar" sin estado — bug real, kit.** Los 2 SVG
(expandir/contraer) ya se alternaban solos por CSS al entrar/salir de
pantalla completa, pero el TEXTO visible y el `title`/`aria-label`
quedaban fijos en "Ampliar" aunque el curso ya estuviera maximizado —
mismo botón, dos estados, un solo nombre. Fix en `coto-player.js`
(kit): `fullscreenchange` ahora también sincroniza `.lbl.textContent`
y `title`/`aria-label` ("Ampliar"/"Pantalla completa" ↔
"Contraer"/"Salir de pantalla completa").

**5 · Botón "Empezar" del minijuego, coordenadas del arte viejo.**
Mismo patrón que el bug de la portada en §6.25: el rebuild sobre el
PDF v2 regeneró `minijuego-intro.webp`, pero la hitbox de la píldora
"¡Empecemos!" se quedó con las coordenadas medidas contra la v1
(`data-t="62.38"`). En el arte nuevo la píldora está en
`data-t="54.68"` — 7.7 puntos porcentuales más arriba. Re-medido y
verificado con un clic real (no simulado por selector) en las
coordenadas de pantalla reales del botón.

**6 · El diseño del minijuego no calcaba el arte del PDF v2 — pedido
explícito, no ajuste menor.** El HUD y la grilla de opciones eran una
interpretación libre de la v1, nunca actualizada cuando el diseñador
rehizo el minijuego para v2 (chip "¡Aprendé jugando!" en vez de "¡Jugá
con nosotros!", 4 tarjetas grises uniformes en vez de 3 estilos
distintos, corazones 8-bit en vez del glifo ❤, y sobre todo: el banco
de 10 reportes pasa de una grilla suelta a un "mapa" con líneas
conectoras, estilo organigrama).

Implementación de las líneas — **sin SVG y sin JS de layout**: en vez
de `gap` (que no deja dónde "enganchar" una línea), el grid define sus
propios TRACKS de conexión de 2rem entre cada columna/fila de
contenido (`grid-template-columns: 1fr 2rem 1fr 2rem 1fr`, filas
análogas) y las líneas son ítems más del grid, posicionados por número
de línea (`grid-column`/`grid-row`). El nodo suelto de la 4ª fila
("Relevamiento de clases") cuelga de un travesaño horizontal + 3
tramos verticales cortos — mismo patrón que un organigrama de RRHH.

**Bug real de implementación (encontrado en la primera prueba, no en
producción)**: sin posición explícita en LOS 9 PRIMEROS botones (solo
el 10º la tenía), el auto-flow de CSS Grid llena los tracks en orden,
incluidas las columnas/filas de 2rem reservadas para las líneas —
2 de los 10 reportes terminaban aplastados dentro de una columna
angosta de conexión. Fix: los 9 primeros también reciben
`grid-column`/`grid-row` explícitos por índice (`POS[idx]`), no solo
el que se sale del patrón regular.

**Segundo bug real, mismo commit**: como el "mapa" (grid + líneas) es
SIEMPRE igual — no cambia entre las 5 situaciones, solo cambia cuál de
los 10 nodos es la respuesta correcta — `render()` hacía
`grid.innerHTML=''` y reconstruía los 10 botones en cada situación.
Funcionaba con botones sueltos, pero ahora las líneas viven adentro del
mismo contenedor: recrearlo todo también las hubiera borrado. Se separó
en `armarGrid()` (arma botones + líneas UNA sola vez, al arrancar el
minijuego) y `render()` (solo resetea clases/`disabled` de los botones
existentes) — verificado con las 5 situaciones seguidas Y un reintento
completo: 16 líneas y 10 botones estables, sin clases ni `disabled`
residuales de la partida anterior.

**Tercer bug, cosmético**: `.d-mj-stat b{ display:flex; gap:.3rem }`
en la regla genérica de las 4 tarjetas metía un hueco entre "1" y "/5"
en "Situaciones" ("1 /5") — el gap solo hacía falta en "Puntos"
(ícono + número), pero al ponerlo en la regla compartida, flexbox trata
el texto suelto como otro ítem de flex más. Se acotó `display:flex` +
`gap` a `.d-mj-stat--pts` únicamente.

---

## 6.28 "Los pop-ups se siguen viendo mal" — la causa real era una sombra DOBLE, no un problema de diseño

El cliente insistió varias veces en que las fichas de reporte "se ven
mal" sin poder señalar qué exactamente, y en las últimas 2 vueltas
corregí posición de la ✕, del video y del hover de las burbujas sin
tocar el síntoma real. La vuelta que lo resolvió no fue un ajuste de
coordenadas: el cliente le pidió al diseñador sacar una sombra que
tenía horneada la tarjeta del PDF, y con esa arte nueva el problema
desapareció solo.

**Causa raíz, confirmada pixel a pixel**: el recorte de cada ficha
(`img/rep-XXX.webp`) traía un degradé gris suave horneado alrededor de
todo el borde (~20px, de 255 a ~219 y de vuelta a 255 — una sombra
suave tipo tarjeta). Al mismo tiempo, `.modal-card` (kit,
`coto-base.css`) le aplica su PROPIO `box-shadow: var(--shadow-pop)`
(`0 18px 50px rgba(30,45,70,.22)`, sombra grande) a CUALQUIER pop-up,
incluida la ficha (`class="modal-card modal-card--shot"`, las dos
clases conviven). Resultado: dos sombras superpuestas, una rectangular
(la del PDF, siguiendo el borde recto de la tarjeta original) y una
redondeada (la del CSS, siguiendo el `border-radius` del modal) — el
"se ve mal" era exactamente esta doble sombra desalineada, visible
como un halo gris raro alrededor de la tarjeta.

**Fix, con el PDF v2 actualizado (sin la sombra horneada)**: como el
arte ahora es contenido borde a borde sobre blanco puro sin ningún
límite de tarjeta dibujado, el recorte ya no necesita "encontrar el
borde de la tarjeta" — se mide la UNIÓN del bounding box de contenido
de las 10 fichas (título, párrafo, viñetas, mockup de video, ✕) y se
le agrega un margen uniforme de 70px por los 4 lados, mismo criterio
que el padding interno de una tarjeta. El único fondo/sombra que se ve
ahora es el de NUESTRO `.modal-card`, una sola vez, prolijo.

**Cambios**: los 10 `img/rep-XXX.webp` y sus 10 posters regenerados
(mismo criterio, nueva caja de recorte); `--shot-card-ratio` pasa de
`1.7677` a `2.0917` (la caja con margen es más ancha en proporción que
el recorte ajustado de antes); re-medidos la ✕ (43×43px, antes
también 43×43 pero en otra posición relativa por el nuevo margen) y el
área de video (misma proporción interna, 1.724, se mueve por el mismo
motivo).

**Lección para el checklist de auditoría del kit**: cuando un curso
usa `.modal-card` + arte propio (`.modal-card--shot` u otro patrón de
recorte), el arte NUNCA debería traer su propia sombra/borde horneado
— el kit ya la provee vía `--shadow-pop`, y una segunda sombra en el
PNG/WebP es indetectable "a ojo" en una revisión rápida pero se nota
enseguida al lado de otros pop-ups del mismo curso que sí usan un solo
borde limpio. Pedirle al diseñador arte "sin sombra ni borde, el kit
la pone" debería ser parte del brief inicial, no algo que se descubre
en la 6ª vuelta de feedback.

---

## 6.29 Video con controles nativos duplicando un reproductor ya dibujado en el poster — bug real de kit (`coto-media.js`, kit-base v1.9.13)

El cliente reportó dos síntomas sobre el video de las fichas de
reporte: "el botón de play no funciona" y, al reproducirse, "queda con
bordes circulares y algo en el fondo, no cubre bien la pantalla". El
segundo síntoma resultó ser el contenido REAL del video que el cliente
agrega manualmente al zip (una tarjeta de texto sobre fondo punteado,
exportada así desde su editor) — no un bug de este curso, así que no
hay nada que arreglar en CSS/HTML para eso; se le explica al cliente
que es un tema de export de su lado, no del reproductor.

El primer síntoma sí era un bug real, y de kit. `initPopupVideos()`
(`coto-media.js`) dejaba el atributo `controls` puesto desde el
arranque en los `<video>` de las fichas. El problema es que el
`poster` de estos videos (`img/posters/rep-XXX-poster.webp`) es un
mockup ya renderizado por el diseñador que trae DIBUJADO un
reproductor falso (triángulo de play centrado, barra de progreso roja,
íconos de pausa/volumen/pantalla completa) como parte de la imagen
estática. Con `controls` nativo puesto, el navegador superpone SU
PROPIO overlay de controles sobre ese dibujo — dos reproductores
compitiendo visualmente, con el triángulo de play real invisible o
mal alineado sobre el dibujado. El clic "no funcionaba" porque el
usuario tocaba el play dibujado (parte de la imagen, no clickeable),
no el control real del navegador debajo.

**Fix**: mismo patrón que ya usa `initInlineCircleVideos()` en el
propio kit para el mismo problema — sin `controls` nativo, el video
entero es el target de clic (`video.paused ? video.play() : —`), y
`controls` se activa recién en el evento `play` (así el usuario tiene
forma de pausar/buscar una vez que el video ya arrancó y el poster
dibujado ya no se ve). Al cerrar el pop-up se resetea `currentTime` y
se vuelve a sacar `controls`, para que al reabrir se vea el poster
limpio otra vez. Los 10 `<video class="d-rep-video">` del curso
perdieron el atributo `controls` del HTML (ahora lo pone JS on-demand).

**Nota de entorno de testing**: no se pudo confirmar la reproducción
real (decodificación H.264) en este sandbox — el Chromium de Playwright
acá no tiene códec de video, `canPlayType('video/mp4;codecs="avc1..."')`
devuelve vacío. Se verificó en cambio el ciclo de vida completo del
estado (`controls` false → true al reproducir → false al cerrar/reabrir)
a nivel DOM, que es donde vivía el bug real.

---

## 6.30 Minijuego: layout debe calcar la disposición del PDF, pero lo recreado en CSS puede (y debe) tener más terminación visual que el arte

Dos pedidos en la misma vuelta que en un primer intento fueron en
direcciones opuestas y hubo que corregir: (1) mover las 4 tarjetas de
estado (Situaciones/Puntos/Vidas/Reglas) del header a un bloque
centrado arriba del banco de respuestas, y (2) casi enseguida después,
"que quede con la misma disposición que traía el arte, los tamaños y
ubicaciones similares al arte". La lectura correcta del pedido
completo: la DISPOSICIÓN (posición/tamaño de cada pieza) tiene que
calcar el PDF —cartel a la izquierda, las 4 tarjetas a la derecha,
misma franja superior—, pero las piezas que son recreación en CSS (no
un recorte de imagen real, como sí lo es el cartel "¡Aprendé
jugando!") tienen que verse **más terminadas que el plano gris
original**, con sombras/degradés/transiciones — "más pro diseñador,
con efectos".

**Bug real encontrado de paso, en la vuelta anterior**: las tarjetas
de estado tenían `color:#fff` (texto blanco) sobre `background:#e3e3e6`
(gris muy claro) — contraste casi nulo, el número y la etiqueta de
cada tarjeta eran prácticamente invisibles. Se coló al copiar un
estilo pensado para fondo oscuro sin verificar contra el fondo real.
Fix: `color:var(--text)` para los números y `var(--text-soft)` para
las etiquetas (mismos tokens que usa el resto del curso para texto
sobre superficie clara).

**Terminación visual agregada** (sin tocar la disposición del PDF):
degradé sutil + sombra de "elevación real" (contacto + ambiente) en
las 4 tarjetas, con la de "Puntos" con un acento dorado propio;
hover/active con leve `translateY` + sombra más marcada en el botón
"Reglas"; las píldoras de respuesta ganaron sombra de contacto y un
hover con escala + sombra más notoria (antes solo cambiaba el borde);
el estado de respuesta correcta/incorrecta ahora tiene un pulso corto
(`@keyframes mj-pop`) al aparecer, en vez de cambiar de color en seco.

---

## 6.31 Primer intento de rediseño de las 10 fichas (recorte → HTML real, REVERTIDO en §6.32) + bug real de kit: el letterbox lateral se disparaba en las resoluciones de escritorio más comunes

El cliente reexportó el PDF (`fa455572-...v2.pdf` → nueva versión) con
un diseño de ficha de reporte totalmente distinto al que veníamos
recortando como imagen: fondo blanco liso de borde a borde, título en
píldora que sangra hasta el borde izquierdo, un adorno curvo tipo
"hoja" en la esquina superior derecha con la ✕ de cerrar, viñetas con
punto + línea conectora (1 a 5 por ficha, sin línea cuando hay una
sola), y una tarjeta de video aparte a la derecha. El pedido fue
explícito: "acomodalos como deberían ir en nuestro formato de diapo",
es decir, no seguir recortando la ficha entera como imagen.

**Por qué esta vez SÍ conviene HTML/CSS real** (a diferencia del v1 de
§6.19/§6.20, donde recrear con CSS "no calcaba"): ese arte viejo tenía
textura/sombra imposible de igualar en CSS plano. Este arte nuevo es
geometría plana simple — píldora, círculos, líneas rectas, una tarjeta
redondeada — exactamente el tipo de diseño que SÍ se recrea bien.
Cambio de arquitectura en las 10 fichas (`index.html` + nueva sección 1
de `diapositivas.css`):
- Título, descripción y viñetas pasan a ser HTML real y visible (antes
  vivían DUPLICADOS: la imagen mostraba una versión horneada y un
  `.sr-only` idéntico servía solo al lector de pantalla — ahora hay una
  sola fuente de verdad, visible y accesible a la vez).
- La lista de viñetas usa un patrón genérico reutilizable: punto
  (`.d-rep2-dot`) + línea `::after` que conecta cada punto con el
  siguiente, SALVO en el último `<li>` (que no tiene `:not(:last-child)`)
  — con una sola viñeta no hay línea, igual que el PDF.
- El único recorte de imagen que queda es el adorno de esquina
  (`img/rep-corner.webp`, ~5KB, con transparencia): es una curva tipo
  blob (no un radio circular simple) que se repite IDÉNTICA en las 10
  fichas, así que un solo recorte reutilizado es más prolijo que
  aproximarla con `border-radius`. La ✕ de cerrar es un botón real
  (mismo patrón `data-hit`/hitbox-sobre-imagen que ya usa el kit en
  otros lados) posicionado por porcentaje sobre ese adorno — no es
  parte de la imagen.
- El video ya no depende de `[data-place]`/`_initShots` (ese mecanismo
  es para overlays que tienen que registrarse contra una imagen con
  letterboxing real vía `object-fit`); ahora es un `<video>` normal
  dentro de una tarjeta con `aspect-ratio` fija, posicionado con
  `position:absolute;inset:0` — no hace falta JS para colocarlo.

**Bug real de KIT encontrado de paso** (`css/coto-shot-stage.css`,
kit-base v1.9.14): mientras investigaba el segundo reclamo del cliente
("las diapos no llegan a los bordes laterales"), medí el aspect-ratio
real del `.d-stage` (ancho / (alto − header − footer, ~120px fijos))
contra las resoluciones de escritorio más comunes, no contra el
viewport crudo. El breakpoint que decide "lienzo fijo 2:1 con
letterbox" vs. "llenar el frame completo" estaba en 1.9, pensado como
"cerca de 2:1, letterbox chico y tolerable". Medido de verdad: **casi
ninguna resolución 16:9 común da cerca de 2:1** — 1366×768 (la
resolución de laptop MÁS usada en el mundo) da ≈2.11, 1600×900 ≈2.05,
1280×720 ≈2.13, 1536×864 ≈2.07, 2560×1440 ≈1.94. Todas por encima
(o rozando) el viejo techo de 1.9, así que cualquiera de estas
resoluciones caía en la rama de lienzo fijo con letterbox lateral
REAL — hasta 30-45px de cada lado en 1366×768, medido con Playwright,
nada "chico ni tolerable". Solo 1920×1080 exacto da 2:1 justo (por
eso "se veía bien" en el testeo previo con esa resolución puntual).
**Fix**: subir el techo del rango "llenar completo" de 1.9 a 2.2 —
cubre 16:9 completo (hasta ~1280×720) y deja SOLO ultrawide de verdad
(21:9 ≈2.33+) en la rama de lienzo fijo, que es donde sí corresponde
un letterbox real (recortar tanto ancho ahí SÍ excede el margen de
seguridad del 13% por costado). Verificado con Playwright en 8
resoluciones reales: gap lateral bajó de 30-45px a ≤16px (redondeo)
en TODAS las 16:9/16:10 comunes, mientras 2560×1080 (21:9 real) sigue
letterboxeado a propósito.

---

## 6.32 §6.31 estaba mal leído: el cliente pidió usar las imágenes del PDF, no reinterpretarlas — y las mandó a resolución nativa para pegar directo

Inmediatamente después de entregar el rediseño HTML/CSS de §6.31, el
cliente corrigió: *"no tenías que rehacer los pop ups, tenías que usar
los que te pasé en el pdf"*, y después, más específico todavía:
*"fijate que los pop ups te los pasé en una reso menor para que ya no
tengas que recortar sino que lo pegues encima de la capa base"*.

**Error real de lectura, dos capas**:
1. El mensaje original ("ya exportados los pop de otra forma, vos
   acomodalos como deberían ir en nuestro formato de diapo y
   ubicación") lo interpreté como "reconstruí el contenido en nuestro
   sistema" cuando en realidad decía "el diseñador ya te dio el activo
   final, vos posicionalo" — ambigüedad real del lenguaje, pero el
   precedente de TODAS las vueltas anteriores (§6.19-§6.28) era usar
   recorte de imagen, así que ante la duda debí haber preguntado en
   vez de asumir el cambio de arquitectura más grande posible.
2. Más concreto todavía y verificable con `pdfinfo`: estas 10 páginas
   del PDF NO vienen al tamaño 2520×1260 del resto (el que uso siempre
   para renderizar) — vienen en su propio tamaño de página, ~1855×1029pt
   (ratio 1.8). Mi primer render de estas páginas (antes de escribir
   HTML/CSS) usó `pdftoppm -scale-to-x 2520 -scale-to-y 1260`, que
   ESTIRA cualquier página a ese tamaño exacto sin importar su tamaño
   real — así que aunque hubiera querido recortar la imagen tal cual,
   el render de origen ya venía distorsionado. Eso reforzó (mal) la
   sensación de "esto no se puede usar tal cual, hay que reconstruirlo".

**Fix real**: revertir el HTML/CSS de §6.31 (se descarta, no se deja
"por si sirve" — código muerto no documentado es peor que no tenerlo),
volver al patrón `.modal-card--shot` + `img/rep-XXX.webp` de §6.19/
§6.22 (recorte real, `<video>` posicionado encima con `data-place`),
pero esta vez renderizando cada una de las 10 páginas CON SU PROPIO
tamaño nativo (`pdftoppm -r 130` sin `-scale-to-x/-scale-to-y`, una
página a la vez) en vez de forzarlas al tamaño del resto del PDF.
Resultado: el `.webp` de cada ficha es la tarjeta completa tal cual la
exportó el diseñador (fondo blanco, píldora, viñetas, adorno de
esquina, tarjeta de video con el mockup de muestra incluido) — sin
ningún recorte manual de mi parte, solo convertida a webp. Nuevo
`--shot-card-ratio: 1.8` (era 1.8 también en versiones previas de la
ficha vieja — no es casualidad, es la proporción real del diseño de
ficha en este curso). Coordenadas de `data-place` del video y del
hitbox de cierre re-medidas contra el nuevo recorte (mismo criterio
que siempre: detectar el rectángulo oscuro del mockup / el centro de
la ✕ dibujada, con Python/PIL, no a ojo).

**Lección de proceso para el checklist**: cuando el cliente dice "usá
lo que te pasé" después de una vuelta donde reconstruiste contenido,
la lectura por defecto es SIEMPRE "poné la imagen tal cual", no
"reinterpretalo mejor". Y antes de decidir que un recorte "no se puede
usar tal cual" por verse distorsionado o desproporcionado, correr
`pdfinfo` para confirmar el tamaño de página real de CADA página del
PDF — un PDF puede mezclar tamaños de página distintos entre secciones
(este los mezcla: la mayoría a 2520×1260, las fichas a ~1855×1029), y
forzar todo al mismo tamaño de render estira/distorsiona silenciosamente
lo que no coincide.

---

## 6.33 La ficha quedaba grande y con la ✕ recortada — dos bugs reales, uno de ellos una regla CSS duplicada que se pisaba a sí misma

El cliente probó el fix de §6.32 y reportó dos problemas puntuales:
la ficha se veía "algo grande" y la ✕ de cerrar aparecía recortada
(no se veía completa ni funcionaba bien al tacto/clic en esa zona).
Pidió comparar contra los PDF viejos para ver "el tamaño exacto".

**Bug real #1 — regla CSS duplicada, la última pisa a la primera**:
`diapositivas.css` tenía DOS declaraciones de `.modal-card--shot`
con `--shot-card-ratio` distinto: la de la sección 1 (agregada en
§6.32, valor correcto `1.8`, medido contra el arte nuevo) y otra más
abajo, en la sección 7, que había quedado de §6.28 con el valor del
arte VIEJO (`2.0917`, de un recorte que ya no existe). Mismo
selector, misma especificidad → gana la que aparece último en el
archivo, así que el navegador armaba la caja de la ficha con la
proporción **vieja**, no la nueva — de ahí el tamaño raro y (via
`object-fit:cover`, que recorta lo que sobra para llenar una caja con
la proporción equivocada) la ✕ cortada. Es la misma familia de bug
que §6.25 (estado duplicado, uno de los dos queda viejo) pero en CSS
en vez de JS: **antes de agregar una regla nueva para un selector que
ya existe en el archivo, buscarlo primero** (`grep` del selector) en
vez de asumir que es la única declaración.

**Bug real #2 — tamaño no calibrado contra ninguna referencia real**:
el ancho por default del kit para `.modal-card--shot` (`94vw`) es un
default genérico "lo más grande posible sin salirse", pensado para
cuando no hay otra pista. Medí el PDF de referencia MÁS VIEJO de este
curso (`a5cf8e1b-...`, el que ya mostraba la ficha como pop-up abierto
sobre el fondo de la diapositiva, no como página aparte) con
Python/PIL: ahí la tarjeta ocupa ≈74% del ancho / ≈84% del alto del
lienzo, con harto margen de backdrop visible alrededor — bastante más
chica que el 94vw que se estaba usando. Ajustado a `min(74vw, 80vh ×
1.8)`.

**Ajuste adicional, mismo commit**: el radio de borde de la tarjeta
bajó de `--r-xl` (32px, el default del kit) a `--r` (14px). El arte
nuevo dibuja su propio adorno de esquina (la "hoja" con la ✕) bien
pegado al borde de la imagen — un radio de contenedor grande le comía
un pedazo real, más allá del bug de la proporción. Con uno chico el
recorte del contenedor casi no toca el dibujo, pero la tarjeta sigue
leyéndose redondeada como el resto de los pop-ups del curso.

**Lección para el checklist**: cuando el cliente manda VARIAS versiones
de un mismo PDF a lo largo de la vuelta a vuelta, las versiones viejas
siguen siendo una fuente de verdad válida para proporciones/tamaños
que la versión nueva no muestra en contexto (acá: cómo se ve la ficha
YA ABIERTA sobre el fondo, algo que el PDF más nuevo — cada ficha en
su propia página suelta — no mostraba). No descartar el PDF anterior
una vez que llega uno nuevo; puede seguir respondiendo preguntas que
el nuevo no cubre.

---

## 6.34 Revisión general a pedido del cliente ("pegale una revisión para que se vea y funcione bien") — 3 bugs reales encontrados con Playwright, ninguno reportado antes

Pedido abierto, sin síntoma puntual. Metodología: capturar las 12
diapositivas + los 10 pop-ups de ficha + los pop-ups genéricos
(índice, glosario, instrucciones, reglas) con Playwright a 1600×1000,
mirarlas una por una, y probar el minijuego a un par de resoluciones
angostas realistas (900×700, no solo el ancho de escritorio de
siempre). Encontró 3 bugs reales que ningún test automatizado
detecta (verifican estructura/accesibilidad, no que dos elementos se
vean superpuestos):

**1. El confeti del cierre tapaba el botón "Ampliar" del header.**
`#d-confetti,.d-confetti` (kit, `coto-cierre.css`) tenía
`z-index:200` — muy por encima de `.d-top` (z-index:40, el header del
reproductor). Las piezas de confeti que caen por esa franja quedaban
VISUALMENTE encima del texto de los botones del header, tapándolo. No
hacía falta ganarle a ningún chrome fijo del curso, solo al contenido
normal de la diapositiva (sin z-index, auto/0) — bajado a 35. Bug de
kit, corregido en las dos copias (curso + `kit-base/`, kit-base
v1.9.15).

**2. En el layout apilado del minijuego (`<1000px` de ancho), la
imagen de la situación se derramaba sobre el texto y las opciones de
abajo.** `.d-mj-escena{ height:100% }` funciona en desktop porque su
fila de grid tiene una altura definida (`grid-template-rows` con
`1fr`, agregado ahora), pero en el layout de 1 columna de mobile la
fila quedaba implícita ("auto") — porcentaje contra una fila de altura
indeterminada es circular, así que el navegador terminaba ignorando
el `max-height:100%` de la imagen y la dibujaba a tamaño natural
(~600px) sin que nada la contuviera. Fix real, no cosmético: la imagen
pasa a `position:absolute;inset:0` dentro de un contenedor con altura
DEFINIDA (`height:34vh`, no `%`) — así `object-fit:contain` tiene
contra qué calcular y encoge de verdad en vez de desbordar.

**3. El pop-up de "Reglas del minijuego" no le gustó al cliente.**
No había síntoma técnico — era la única pieza del curso con acento
ámbar/amarillo mientras todo el resto es azul/blanco. Investigando el
motivo: la vuelta que lo creó (ver el `.d-reglas-*` ya borrado) lo
declaró como "excepción de diseño" citando §6.10.2.2 — pero esa
sección describe una excepción real de OTRO curso ("¿Te la jugás?",
con arte propio del diseñador); acá no había ningún respaldo del PDF
para el acento ámbar, fue una decisión mía sin pedido del cliente ni
referencia de diseño. Se reemplaza por el patrón `.d-instr-*` que ya
usa el pop-up "Cómo recorrer el curso" (kit,
`coto-base-addendum-v1.8.css`) — mismo look, cero CSS nuevo que
mantener.

**Lección para el checklist**: "revisión general" sin síntoma puntual
justifica un barrido visual completo con capturas — bugs de
superposición/z-index/desborde son literalmente invisibles para los
7 tests automatizados (que verifican estructura y comportamiento, no
"¿se ve mal esto?"). Y una "excepción de diseño declarada" (§6.10.2.2)
solo es válida si tiene un motivo de diseño real detrás — si en algún
momento se cuela una sin ese respaldo, no hay problema en revertirla
después.

---

## 6.36 Feedback puntual del cliente sobre la revisión de §6.34 — 5 correcciones reales

Ronda de feedback con capturas concretas sobre lo entregado en §6.34.
Cada punto, con su causa real:

1. **La portada no debería tener botón "Empezar"**: es una diapositiva
   de fondo de VIDEO — el cliente pidió sacar el hotspot invisible
   `.d-shot-hit--cta` por completo. Pedido relacionado, mismo mensaje
   ("los videos de las portadas deberían continuar directamente a la
   diapo sin necesidad de hacer clic en Siguiente — así lo veníamos
   haciendo en Storyline"): agregado `initBgVideos` (kit,
   `coto-media.js`) reacciona al atributo `[data-autoadvance]` en la
   diapositiva — al terminar el video de fondo, llama
   `motor._advance(1)` solo. **Distinto del botón global "Reproducir
   todo"** que el cliente pidió sacar en su momento (CLAUDE.md §6.6,
   sigue sin botón en el DOM): esto es angosto y sin UI nueva, opt-in
   por diapositiva vía atributo — no revive esa función. Marcado en
   `portada`, `unidad1`, `unidad2` y `unidad3` (las 4 diapositivas que
   son solo video + texto, sin ninguna otra interacción).
2. **La ✕ de "Cómo recorrer el curso" no cerraba**: bug real de kit,
   confirmado con Playwright (`elementFromPoint` devolvía
   `.d-instr-hd`, no el botón). `.d-instr-hd` tiene `position:relative`
   (lo necesita para sus propios hijos) y sin `z-index` en `.modal-x`,
   dos elementos "positioned" con z-index:auto se apilan por ORDEN DE
   DOM — `.d-instr-hd`, que viene después en el marcado, ganaba aunque
   la ✕ se viera "arriba". `z-index:2` en `.modal-x` (kit,
   `coto-base.css`) lo resuelve para cualquier modal, no solo este.
3. **El círculo decorativo de esquina se recortaba raro**: el
   `::after` de `.d-instr-modal` (kit, addendum) estaba centrado
   exactamente sobre la esquina REDONDEADA de la tarjeta — un círculo
   recortado por otro arco (el de la esquina) dibuja un escalón, no
   una curva limpia. Corrido para que asome solo por el borde inferior
   recto.
4. **El video de la ficha quedaba corrido del fondo blanco**: la caja
   `data-place` del video se había medido a ojo sobre un crop de
   contexto amplio; remedida con detección de borde por gradiente
   (Python/PIL, scaneando dónde el gris del `box-shadow` empieza a
   subir hacia blanco puro, en 3 filas distintas para confirmar) dio
   una caja bastante más angosta y un poco más abajo que la usada —
   sincronizada en las 10 fichas.
5. **Los videos se podían descargar** desde el menú de 3 puntos de los
   controles nativos: `controlsList="nodownload noremoteplayback"` +
   `disablePictureInPicture` en los 10 `<video class="d-rep-video">`.

---

## 6.37 El minijuego no calcaba la dinámica original acordada, y "volver para atrás" dejaba sin forma de rejugar

Feedback de una sesión de prueba real con el equipo del cliente (no
solo la persona que revisa el curso):

**1. Avance automático por temporizador, no por decisión del alumno.**
La versión anterior avanzaba sola con `setTimeout` (1.9s si acertabas,
3.2s si no) — muy poco tiempo para leer la explicación completa y ver
cuál era la correcta, Y no calcaba la dinámica que el cliente había
acordado con el equipo: la marca de correcto/incorrecto tiene que
quedar FIJA hasta que el alumno decida seguir, no revertir sola. Fix:
`responder()` ya no dispara ningún timer — deja las píldoras marcadas
(verde la elegida si acertó, roja la elegida + verde la correcta si no)
y muestra un botón real "Siguiente situación" (`data-mj-next`, oculto
hasta responder) como único disparador para avanzar.

**2. "Volví para atrás y ya no puedo volver a jugar."** El motor no
recarga la diapositiva al navegar — es la MISMA instancia de siempre.
Si el alumno salía a mitad de partida (o después de terminarla) y
volvía, encontraba el panel "jugar" (o "fin") exactamente como lo
había dejado, sin ningún botón visible para arrancar de nuevo — el
único disparador de `empezar()` es el botón de la portada de
bienvenida (`.d-mj-start`), invisible si esa capa no está activa. Fix:
un listener de `slidechange` que, al salir de la diapositiva del
minijuego, resetea a la capa "intro" — volver siempre ofrece el mismo
"¡Empecemos!" limpio de la primera vez.

**3. Las líneas del "mapa" no calcaban el PDF.** La conexión hacia el
10º reporte (el nodo solo, centrado abajo) usaba un travesaño
horizontal a todo el ancho del grid + 3 tramos verticales cortos (tipo
organigrama) — el PDF conecta ese nodo con una única línea vertical
recta desde el botón del medio de la fila de arriba, nada más. El
cliente lo marcó como "líneas raras" con una captura del PDF al lado;
comparación directa confirmó que el travesaño ancho no existe en el
original. Simplificado a una sola línea vertical (`.d-mj-line--v3c`).

**No resuelto en esta vuelta, necesita más información**:
- **Pantalla de resultado "deformada" en el caso de fallar**: no pude
  reproducirlo en Playwright a varios tamaños de ventana (1600×1000,
  1024×640) ni jugando la partida real hasta fallar — el layout salió
  igual en los dos estados (éxito/reintentar) en todos los casos
  probados. Puede ser específico del tamaño de ventana/zoom real del
  que reportó el bug. Pendiente: pedir una captura de pantalla
  completa (no recortada) + tamaño de ventana para reproducirlo.
- **Línea del conector ligeramente descentrada en la ficha "Clavos
  (281)"**: confirmado que el corrimiento YA está en el PDF original
  (se ve igual en un render fresco de la página, antes de cualquier
  recorte o conversión de mi parte) — es el vector del propio archivo
  de diseño, no algo introducido acá. No corregible sin re-dibujar
  encima del arte del cliente; se lo señalo para que lo vean en su
  archivo fuente si les importa corregirlo.
- **Demasiadas opciones (10) para una sola respuesta correcta por
  situación**, y **pedido de rediseñar el layout para que el texto
  "esté todo junto"**: son decisiones de contenido/diseño, no bugs —
  quedan para que el cliente confirme qué dirección quiere antes de
  tocar nada.

---

## 6.38 El foco de la ✕ dibujaba un anillo casi cuadrado sobre un botón redondo — bug real de kit

El cliente volvió a marcar el pop-up "Cómo recorrer el curso" como
"algo mal en el diseño", con una captura mostrando un círculo raro
alrededor de la ✕. No era el mismo bug de §6.36 (el corte de esquina,
ya corregido) — era otra cosa, visible SOLO porque §6.36 arregló que
la ✕ tuviera foco de verdad al abrir el pop-up (WCAG: el foco tiene
que entrar al modal). El anillo de `:focus-visible` genérico del kit
(`coto-base.css`, pensado para botones rectangulares) usa
`border-radius:6px` — sobre un botón CIRCULAR (`.modal-x`,
`border-radius:50%`) dibuja un anillo casi cuadrado que no sigue el
contorno del botón, y esa forma desalineada es la que se lee como
"recorte"/glitch. Bug real de kit, no específico de este curso — pasa
en cualquier pop-up con `.modal-x`. Fix de una línea:
`.modal-x:focus-visible{ border-radius:50%; }`.

**Verificado, no era el problema del cliente pero corre riesgo de
confundir**: la dinámica del minijuego de §6.37 (marca fija +
"Siguiente situación", sin auto-avance) SÍ está andando bien —
probado con Playwright clickeando una opción y esperando 4s: el
estado queda idéntico, sin revertir. El cliente repitió el mismo
reclamo textual de §6.37 en el mensaje siguiente; probablemente
todavía no había probado el zip con el fix, o lo hizo contra una copia
vieja en caché. Las 10 opciones por situación del minijuego (la queja
de "muy difícil") son las MISMAS 10 que trae el PDF del cliente en
cada situación — reducirlas se iría de "que sea lo más parecido al
PDF" (pedido explícito, mismo mensaje). Tensión real entre dos pedidos
del cliente, señalada de vuelta, no resuelta unilateralmente.

---

## 6.39 Rediseño completo del minijuego: cajas más lindas, layout, y la tensión de "10 opciones" resuelta con un mecanismo de juego, no con contenido

El cliente contestó a §6.38 confirmando que la dinámica de "marca fija
+ Siguiente situación" ya andaba bien, y pidió una segunda ronda de
pulido — esta vez con dirección de diseño concreta (screenshot del PDF
al lado) y, sobre la tensión señalada en §6.38 ("10 opciones vs. que
sea igual al PDF"), una idea propia para resolverla sin sacrificar
ninguna de las dos cosas.

**Cambios de layout/visual**:
1. Las 4 tarjetas de estado (Situaciones/Puntos/Vidas/Reglas) vuelven
   a moverse — esta vez a `.d-mj-choose`, centradas arriba del banco
   de respuestas (revierte el layout "cartel + tarjetas en la misma
   fila" de §6.30, que a su vez había revertido la versión centrada de
   una vuelta anterior a esa — la disposición final es esta).
2. Cartel "¡Aprendé jugando!" agrandado (`clamp(2.4rem→3.4rem` pasa a
   `clamp(3.4rem→5rem`).
3. **Bug real encontrado de paso** ("sacale el recuadro blanco que
   tiene detrás del iPad"): las 5 ilustraciones de situación son un
   webp plano sin alpha (fondo blanco horneado), las 5 con el MISMO
   tamaño exacto (950×668). `.d-mj-escena` usaba `object-fit:contain`
   sin que su caja tuviera la misma proporción que la imagen — el aire
   sobrante en un eje se veía como un recuadro blanco de más alrededor
   del iPad, porque el fondo de la diapositiva también es blanco. Fix
   real: `aspect-ratio:950/668` en la caja (no un truco de recorte),
   así no sobra aire en ningún eje.
4. Píldoras de opción con degradé sutil de superficie (no blanco
   plano), sombra de contacto, y estado "resuelto" (ver punto 6) con
   su propio estilo — gris tildado, no "botón roto".
5. Feedback (`.d-mj-fb`) y el botón "Siguiente situación" rediseñados:
   el feedback pasa de texto suelto a una tarjeta con acento de color
   + ícono redondo (✓ verde / i gris), y ambos entran con una
   animación corta en vez de aparecer en seco.

**Mecánica nueva, pedido explícito ("que a medida que contestás bien
tengas más opciones de seguir contestando bien")**: cada reporte
contestado CORRECTAMENTE queda bloqueado (`is-resuelto`, con ✓ y
estilo apagado) para el resto de la partida — el banco de 10 se achica
solo para quien va bien. Seguro por diseño de datos: los 5 `ok` de
`MJ_SITUACIONES` son los 5 IDs distintos (191/285/196/222/281), así
que bloquear un acierto pasado NUNCA puede tapar la respuesta correcta
de una situación futura — el guard en `render()` (`id !== s.ok`) lo
documenta pero en la práctica nunca se dispara con los datos actuales.

**Esto es la resolución real de la tensión de §6.38**: en vez de sacar
opciones del PDF (que lo aleja del original) o dejar las 10 siempre
(que lo hace "muy difícil" para todos), el juego se vuelve
PROGRESIVAMENTE más fácil para quien acierta — mismo tablero que el
PDF en todo momento, pero con menos candidatas activas a medida que
avanza una buena partida.

**Pista tras 20s de inactividad** (pedido explícito, con parámetros
dados: "contador de 50s, a los 20s resaltar 3 opciones"): un
`setTimeout` de 20s por situación resalta con un halo pulsante ámbar
la respuesta correcta + 2 distractores al azar entre los que siguen
disponibles — no delata cuál es la correcta, solo reduce el ruido de
10 a 3. Se cancela al responder o al cambiar de situación/salir de la
diapositiva (mismo `slidechange` de §6.37). No se implementó ninguna
acción especial a los 50s puntuales — el cliente dio el parámetro de
"contador de 50s" sin especificar qué pasa exactamente en ese punto
más allá del resaltado a los 20s; se prefirió no inventar una segunda
mecánica no pedida.

**Animaciones de "sensación de juego"** (pedido explícito): la
respuesta correcta ahora tiene un festejo corto (`mj-celebrate`,
escala + rotación leve) en vez de un pulso plano; la incorrecta
tiembla (`mj-shake`) en vez de solo cambiar de color. Las dos respetan
`prefers-reduced-motion`.

---

## 6.40 El cartel "¡Aprendé jugando!" pasa a estar arriba del iPad (alineado a la izquierda) — 2 bugs reales de layout mobile encontrados al validar el cambio

**Pedido del cliente**, con una captura de la pantalla en vivo:
"el aprendé jugando debería estar arriba del ipad alineado desde el
inicio izquierdo". Antes de tocar código se armó un artifact de
preview (proceso nuevo pedido por el cliente, ver más abajo) con dos
propuestas — cartel arriba del iPad + 3 estilos de píldora — y el
cliente eligió la disposición mostrada y la píldora "opción B"
(elevada, con gradiente y sombra — la que ya estaba en el zip).

**Cambio real**: se sacó el wrapper `.d-mj-hud` (que ponía cartel +
stats en una fila horizontal arriba de las 2 columnas) y se armó
`.d-mj-escena-col` — una columna flex (`align-items:flex-start`) con
el cartel y el iPad apilados, viviendo DENTRO de la primera columna
del grid de `.d-mj-body` junto al iPad. Las stats se quedan centradas
arriba de las opciones, como ya estaban.

**Bug 1 — recorte del iPad en mobile** (encontrado al probar en
900×700, no reportado por el cliente): el `@media(max-width:1000px)`
tenía `.d-mj-escena{ height:34vh; position:relative }` +
`.d-mj-escena img{ position:absolute; inset:0; width:100%; height:100%
}` — una altura fija SIN relación con la proporción real de las 5
imágenes (950×668, ver §6.34). Con `object-fit:cover` forzando esa
caja desproporcionada, la imagen se recortaba mal (se veían franjas
verdes/negras del fondo del arte a los costados en vez del contenido
completo). Fix: en vez de `height:34vh` + `width:100%` (dos medidas
INDEPENDIENTES entre sí, forzando una caja con proporción propia), la
caja pasa a `height:34vh; width:auto` — con el `aspect-ratio:950/668`
de la regla base (desktop) todavía activo, el ancho se DERIVA de esa
altura ya definida, así la proporción real de la imagen se respeta
siempre, en cualquier alto.

**Bug 2 — las stats se superponían al iPad en mobile** (mismo
viewport, encontrado en la misma pasada): `.d-mj-body` es un grid; en
mobile pasa a 1 columna con 2 filas apiladas. Primer diagnóstico
equivocado: parecía el mismo patrón de "altura en % sobre una fila
`auto`" de §6.34, así que se probó sacar `height:100%` de
`.d-mj-escena-col` — no cambió nada. Medición real con Playwright
(bounding boxes de cada bloque) mostró la causa correcta: `.d-mj-body`
hereda `align-items:center` de la regla base de escritorio (donde
tiene sentido, las 2 columnas miden parecido). Acá abajo, apilado, el
contenido de la fila 2 (`.d-mj-choose`, con el listado completo de
opciones) mide MÁS que lo que el grid le asigna a su fila `auto` — y
"centrado" reparte ese sobrante mitad arriba, mitad abajo: la mitad de
arriba invadía visualmente la fila 1 (el iPad), aunque en el DOM las
filas nunca se solapan. Se probó `align-items:start` con
`grid-template-rows:auto auto` explícito — mejoró pero seguía sin
cerrar bien, porque un grid con fila `auto` midiendo una columna flex
que a su vez tiene un ítem con `aspect-ratio` es una medida circular
(el navegador mide la fila `auto` ANTES de que el ancho final de la
columna esté resuelto, y le da un alto menor al real). Como en mobile
`.d-mj-body` es 1 sola columna, el grid no aporta nada ahí: la
solución de raíz fue pasar `.d-mj-body` a `display:flex;
flex-direction:column` dentro de ese media query — cada bloque mide su
alto real por contenido y el siguiente arranca justo después, sin que
el navegador tenga que adivinar el tamaño de una fila antes de tener
los datos para calcularla.

**Proceso nuevo, pedido explícito del cliente** (se aplica de acá en
adelante para todo cambio visual, no solo para éste): *"siempre andá
mostrándome antes de hacer y antes de darme el zip preguntame"* — dos
reglas separadas: (1) antes de implementar un cambio visual/de layout,
mostrar una propuesta (screenshot o artifact) y esperar aprobación
explícita antes de tocar código; (2) antes de entregar cualquier zip,
avisar y esperar el OK del cliente — no enviarlo automáticamente
apenas los tests pasan.

---

## 6.41 Auditoría del cliente comparando 5 pantallas de cierre contra el PDF real + 2 pedidos puntuales resueltos (kit-base v1.9.18)

El cliente mandó 5 capturas (paneles de fin del minijuego, resumen
final, Índice, Glosario) con dos pedidos: **"comparado con el PDF hay
cosas mal"** (genérico) y **"unifiquemos Índice/Glosario/Ayuda en un
solo diseño"** (puntual). Antes de tocar nada se comparó cada captura
contra el render real del PDF (`render/p-31/32/33.png`) para separar
lo que es un bug real de lo que ya era una decisión de cliente tomada
en una vuelta anterior — evitar deshacer trabajo ya aprobado por
malinterpretar "distinto al PDF" como "mal".

**Hallazgo real 1 — Índice/Glosario/Ayuda, 2 estilos de encabezado
mezclados.** El Índice usa su propio header (`.d-sidenav-hd`,
degradado `--brand-deep→--brand`); Glosario y Ayuda traían
`.modal-hd--dark` (navy sólido). La propia nota de `.modal-hd--dark`
en `coto-base.css` (kit-base v1.6, hallazgo de "Prevención
cardiovascular") ya advierte no mezclar variantes de header dentro de
un mismo curso — acá se había vuelto a pisar esa regla. Fix (kit,
`coto-base-addendum-v1.8.css`): `.modal-card.d-drawer-r > .modal-hd`
ahora fuerza el mismo degradado/padding/tipografía del Índice, sin
tocar `.modal-hd--dark` en sí (otros popups que sí la usan a
propósito, como "Mis logros", no cambian).

**Hallazgo real 2 — panel final del minijuego, NO es un bug.** Los 3
datos ("Situaciones correctas/Puntos en el juego/Videos vistos") no
calzan con el texto genérico del PDF ("Situaciones/% completado/
mensaje"), pero es un cambio explícito de una vuelta anterior (§6.10.1/
notas de kit): el PDF repetía el mismo número dos veces ("3/5" y
"60%") y el cliente pidió reemplazar el segundo dato por el puntaje
real. Se dejó como está — señalado al cliente para que confirme, no
se tocó sin su OK.

**Hallazgo real 3 (fuera de alcance, sin tocar todavía) — "Repaso
rápido de todo el curso".** Esa pantalla (medalla + stats + 3 columnas
de texto) es un componente genérico del kit que nunca recibió la
identidad visual real del PDF de cierre (blob azul curvo de "Últimos
consejos", tarjetas tipo globo de diálogo). Es la que más se aleja del
PDF de las 5 capturas. El cliente todavía no priorizó este frente —
queda pendiente, no descartado.

**Pedido puntual — "mucho aire arriba entre el cartel y la barra
superior" (minijuego).** Causa real: `.d-mj-body` es `flex:1` (ocupa
TODO el alto restante de la diapositiva) con `align-items:center` en
una sola fila de grid — con contenido más bajo que ese alto
disponible, quedaba centrado verticalmente y el aire de sobra se
repartía mitad arriba, mitad abajo. `align-items:start` ancla las 2
columnas arriba, sin aire fantasma.

**Pedido puntual — "en mobile está todo desorganizado" (minijuego).**
`.d-mj-escena-col` (cartel+iPad) hereda `align-items:flex-start` de la
regla de escritorio (pensada para vivir al lado de la columna de
opciones) — apilado a pantalla completa en mobile, eso dejaba el
cartel+iPad pegados a la izquierda con aire vacío a la derecha,
mientras las tarjetas de stats y las opciones (ancho completo) se
centran solas: 2 alineaciones distintas en la misma pantalla. Fix
(`@media max-width:1000px`): `.d-mj-escena-col{ align-items:center }`
— todo el stack mobile queda centrado como una sola unidad.

---

## 6.42 El fix de §6.41 sobrecorrigió: "centrado" no era `align-items:start`, y mobile necesitaba la MISMA disposición de escritorio, no una rehecha

Dos correcciones sobre lo hecho en §6.41, con el cliente ya viendo el
resultado en pantalla — ambas bugs reales de CSS Grid, no cambios de
gusto.

**1 · "mucho aire abajo" después de arreglar "mucho aire arriba".**
`.d-mj-body` tenía una sola fila `minmax(0,1fr)` — un track FLEXIBLE
que siempre absorbe el 100% del alto disponible de `.d-mj-body`
(`flex:1`, todo el alto restante de la diapositiva), sin importar qué
diga `align-items`. Con `center` (versión original) cada COLUMNA se
centraba por separado dentro de esa fila gigante — la columna más
corta (cartel+iPad) quedaba flotando con aire propio arriba Y abajo.
Con `start` (fix de §6.41) el contenido anclaba arriba pero todo el
sobrante de esa fila gigante se acumulaba abajo, de un solo lado —
"mucho aire arriba" se convirtió en "mucho aire abajo". Fix real: la
fila pasa de `minmax(0,1fr)` a `auto` (mide lo que el contenido
necesita, ni más) y `align-content:center` centra esa fila YA COMPACTA
como una sola unidad dentro del alto disponible de `.d-mj-body` —
mismo aire arriba que abajo del bloque completo, no de cada columna
por separado.

**2 · El rediseño mobile de §6.40/§6.41 no era "el mismo diseño
ajustado", era otro diseño.** El cliente lo dijo explícito: "el ipad
quedó super chico", "hay huecos, faltan opciones", "respetemos la
disposición del diseño web ajustado un poco para mobile pero
manteniendo el diseño web". Tenía razón — el `@media(max-width:1000px)`
reemplazaba la disposición ENTERA de escritorio (grid de 2 columnas,
grilla de opciones de 3 columnas con líneas conectoras) por otra cosa
(layout apilado, iPad forzado a `height:34vh`, grilla de solo 2
columnas). Se sacó ese reemplazo: ahora la disposición de escritorio
se mantiene tal cual hasta 600px de ancho (las columnas son `fr`, se
angostan solas) y recién por debajo de eso se compacta tipografía y
espaciados — nunca la disposición en sí.

**Bug real de kit encontrado al bajar el ancho, afecta CUALQUIER
tamaño de pantalla, no solo mobile:** `.d-mj-grid` usaba
`grid-template-columns: 1fr 2rem 1fr 2rem 1fr` — `1fr` a secas es
`minmax(auto,1fr)`, el mínimo automático es el tamaño INTRÍNSECO del
contenido, así que la columna nunca se encoge más allá de eso. Con
texto largo ("Mercadería no apta (210)"), en vez de hacer wrap el
grid se ensanchaba más allá del contenedor — la 3ª columna de
opciones quedaba literalmente recortada fuera de la pantalla en vez
de angostarse. Y aunque el TRACK se arregla con `minmax(0,1fr)`, el
ÍTEM (el botón `.d-mj-opt`) también necesita su propio `min-width:0`
— un ítem de grid tiene `min-width:auto` por defecto (= su contenido
sin partir) sin importar cuán angosto sea el track que lo contiene.
Dos fixes, uno en el contenedor y otro en el ítem — con solo el del
contenedor la píldora se sigue derramando fuera de su columna.

**3 · "la de ipad le falta aire arriba" — feedback sobre el resultado
del punto 1, mismo turno.** No era el centrado (ese ya estaba bien):
en anchos ~900-1100px (típico iPad) las columnas de `.d-mj-body` son
más angostas que en escritorio grande, el texto de las opciones
envuelve a más líneas, y `.d-mj-choose` termina midiendo MÁS alto que
el espacio vertical disponible — `align-content:center` reparte
correctamente, pero reparte un DESBORDE (mitad arriba, mitad abajo) en
vez de aire, y la mitad de arriba se comía el hueco bajo la barra
superior. Fix: nuevo `@media(max-width:1100px)` que compacta los
espacios "elásticos" pensados para escritorio grande (los `2rem` fijos
entre filas/columnas de `.d-mj-grid`, el padding de `.d-mj-opt`, los
márgenes de `.d-mj-consigna`/`.d-mj-stats`) — no cambia la
disposición (sigue siendo el mismo grid de escritorio, sin rehacer
nada), solo el "aire interno" de cada pieza, lo suficiente para que el
contenido vuelva a ser más bajo que el espacio disponible y el
centrado tenga margen real. Confirmado con capturas en 900×700 y
1024×768: ~20-45px de aire visible arriba y abajo.

**4 · "las reglas quedaron en 2 líneas" — mismo turno, viendo la
captura de arriba.** `.d-mj-stats` tenía `flex-wrap:wrap` con 4
tarjetas de `min-width:88px` fijo: en el mismo rango ~900-1100px la
4ª tarjeta ("Reglas") no entraba en la fila y se caía sola a una 2ª
línea — 4 tarjetas de estado nunca deberían partirse en 2+2 ni 3+1.
Fix: `flex-wrap:nowrap` (fuerza 1 sola fila siempre) + `.d-mj-stat`
pasa de `min-width:88px` fijo a `min-width:0; flex:1 1 88px` (88px es
ahora una BASE, no un piso — la tarjeta se achica por su contenido
real si hace falta en vez de forzar el wrap). Con "Reglas" ya fijo en
la misma fila, sobró alto para devolverle aire a los márgenes que se
habían compactado en el punto 3 (`.d-mj-escena-col` gap 1.6rem,
`.d-mj-stats` margin-bottom hasta 1.2rem en el rango 1100px) — pedido
explícito del cliente viendo la captura ("me gusta más... incluso
podrías darle más aire").

**5 · "los datos de vida y puntos salen por fuera de sus cajas" —
regresión introducida por el fix del punto 4, mismo turno.** Al sacar
`min-width:0` de `.d-mj-stat` en el punto 4 quedó bien documentado
pero el propio código TODAVÍA lo tenía puesto — quedó una línea vieja
sin borrar. Con `min-width:0` + `flex-wrap:nowrap`, si las 4 tarjetas
no entran en la fila el navegador las achica con `flex-shrink` más
allá de lo que su contenido necesita: el número "1000" (PUNTOS) y los
3 corazones (VIDAS) — las 2 tarjetas con más contenido — se dibujaban
igual, a su tamaño real, pero DESBORDADOS fuera del borde redondeado
de su propia tarjeta (mismo síntoma que el wrap del punto 4, distinta
forma: antes se caía a una 2ª línea, ahora se sale de la caja). Fix
real, dos partes: (1) sacar `min-width:0` de una vez — vuelve el piso
de contenido real por tarjeta; (2) como sacar ese piso hace que la
fila necesite más ancho del disponible en ~900-1100px, achicar el
CONTENIDO de las 2 tarjetas más anchas en ese rango (ícono del trofeo,
tamaño de "1000", corazones, gaps internos) para que su piso real
vuelva a entrar cómodo en una sola fila sin invadir nada. La lección:
`min-width:0` sin verificar que el contenido real entre en el espacio
disponible no es un fix, es mover el problema de "se cae a otra línea"
(visible, feo) a "se derrama silenciosamente" (más difícil de notar
en una revisión rápida).

---

## 6.43 Cierre de ronda: ícono real de NOA, objetivo C, y un bug real en el armado del zip de entrega

**Ícono de marca del header** (pendiente desde §3.9/README-CURSO.md
punto 4): el cliente mandó `Icono NOA.png` — blanco con transparencia,
pensado para ir sobre el fondo de color, no sobre blanco (por eso se
veía "en blanco" al mandarlo por chat, antes de tenerlo como archivo).
Reemplazó `img/icono-no-alimentos.webp` (el donut genérico que había de
placeholder) con el mismo nombre de archivo, sin tocar código.

**Objetivo C** (pendiente desde §3.4/README-CURSO.md 0.4): el PDF v2
repetía el texto de B en C. El cliente mandó una captura con el texto
real ("Aplicar los puntos de control en la rutina diaria de gestión.")
— coincide exacto con `render/p-02.png` (el PDF original, no el v2),
así que se reexportó `img/objetivos.webp` desde esa página (mismo
recorte de 2520×1260, sin re-diagramar nada) en vez de escribir el
texto a mano sobre la imagen existente.

**Bug real encontrado armando el zip de entrega**: el curso tiene DOS
READMEs en la raíz — `README.md` (copia vieja del README del propio
kit-base, arrastrada desde que el curso se scaffoldeó, nunca
actualizada, quedó en v1.9.12) y `README-CURSO.md` (la bitácora real
de ESTE curso, la que se le escribe al cliente en cada vuelta). El zip
de una vuelta anterior empaquetó por error el primero — el cliente
recibía notas de desarrollo del kit en vez de su propia bitácora.
Fix: excluir `README.md` del zip del curso y usar `README-CURSO.md`.
**Regla para el próximo curso**: si se scaffoldea copiando `kit-base/`
de punta a punta (§7), borrar o renombrar el `README.md` heredado
antes de escribir `README-CURSO.md`, para que no puedan coexistir 2
READMEs con nombres casi iguales y contenido totalmente distinto.

---

## 6.44 Batería grande de correcciones del cliente: índice no interactivo, gate real en el menú lateral, esquina del pop-up de instrucciones, y re-calibración del video de las 10 fichas

Pedido en un solo mensaje largo, con varios items reales de distinto
tipo — resumen de los que ya quedaron resueltos:

**1 · Índice de contenidos (diapositiva) dejó de ser clicable.** Tenía
3 hitboxes (una por unidad) que en realidad NUNCA funcionaron —
quedaron `disabled` a mano en el HTML desde siempre (el
`habilitarIndice()` que las iba a prender, mencionado en un comentario
viejo, nunca se escribió). El navegador les seguía dibujando foco/hover
residual igual — el "recuadro raro" que vio el cliente sobre "Stock y
productos". Se sacaron los 3 botones muertos: la diapositiva es 100%
informativa ahora, sin hitboxes fantasma.

**2 · Bug real de gate, no cosmético: el índice lateral (menú ☰) dejaba
saltar a CUALQUIER diapositiva.** `marcarVistas()` en `curso.js` solo
marcaba el tilde `.is-done` en las secciones vistas — el link en sí
seguía siempre habilitado. Cualquiera podía abrir el menú y saltar
directo a "Cierre y resumen" sin abrir una sola ficha, mirar un video ni
jugar el minijuego — los gates de obligatoriedad (que sí frenan el
botón "Siguiente") no se aplicaban acá. Fix (`curso.js` + kit,
`.d-sidenav-item:disabled` en `coto-base-addendum-v1.8.css`): las
secciones no vistas quedan `disabled` — mismo criterio que ya usaba el
índice de contenidos. Vistas → libre ir y volver; no vistas → bloqueadas
hasta pasar por "Siguiente".

**3 · Esquina del pop-up "Cómo recorrer el curso" (`.d-instr-modal`).**
2 intentos previos (§6.36 y uno de esta misma vuelta) de un círculo
decorativo flotante en la esquina inferior izquierda, ninguno se leía
como una esquina limpia — un círculo de OTRO radio superpuesto a una
esquina redondeada siempre deja un "escalón" visible donde las 2 curvas
se cruzan. Fix real: se saca el círculo (`::after`) y la esquina en sí
pasa a `border-bottom-left-radius:70px` — una esquina en punta de medio
círculo de verdad, no una forma superpuesta imitándola. Mismo componente
que usa el pop-up de reglas del minijuego (`.d-instr-modal` compartido).

**4 · Re-calibración completa del video superpuesto en las 10 fichas de
reporte.** Bug real, no solo estético: las 10 usaban las MISMAS
coordenadas `data-place` heredadas de una versión anterior del arte —
el video quedaba más chico y más abajo que la tarjeta blanca real
dibujada en cada imagen, dejando un borde de esa tarjeta visible en vez
de taparla entera ("el rectángulo blanco de atrás"). Proceso de
re-medición, con 2 vueltas en falso documentadas para que no se repita
el mismo error:
  - Medir directo sobre el `.webp` del curso (Python/PIL, transición de
    sombra/fondo) da un resultado que en el render EN VIVO no calza
    igual — hay una diferencia entre el espacio de porcentaje del
    archivo crudo y el del contenedor ya renderizado (no se identificó
    una causa de 1 sola línea; puede ser antialiasing/redondeo de
    layout) lo bastante grande como para que "se ve bien en un recorte
    del archivo" NO garantice "se ve bien en el pop-up real".
  - Medir directo sobre la página del PDF original (que el cliente
    volvió a pasar como referencia) tampoco alcanza sola: hay que saber
    EXACTO dónde está el borde de la tarjeta blanca dentro de esa
    página completa, y un error ahí (ej. agarrar de más el margen del
    pop-up) se traduce 1:1 al resultado.
  - **Método que sí funcionó, y que hay que usar de entrada la próxima
    vez que haga falta re-posicionar algo superpuesto a un `.d-shot`**:
    ocultar el elemento superpuesto (`display:none` por JS), screenshotear
    el POP-UP YA RENDERIADO en el tamaño real de pantalla, y medir sobre
    ESE screenshot (no sobre el archivo fuente ni sobre el PDF). Así se
    mide en el mismo espacio de coordenadas donde después se va a
    POSICIONAR — cero traducción entre sistemas, cero margen para que
    un desajuste de un paso se filtre al siguiente.
  - Valores finales (compartidos por las 10 fichas, mismo template):
    `data-l="50.02" data-t="30.2" data-w="41.39" data-h="48.05"`.
  - De paso, `.d-rep-video` no tenía `border-radius` — con el video
    llenando la tarjeta de punta a punta (ya no hay hueco), sus esquinas
    cuadradas asomaban por fuera de las esquinas redondeadas de la
    tarjeta dibujada debajo. `border-radius:14px` (mismo `--r` que usa
    `.modal-card--shot`) lo resuelve.

**5 · Botones de play sin feedback al hover (kit, `coto-media.css`).**
`initPopupVideos` (coto-media.js) deja TODO el video como un solo botón
de play mientras está pausado (el poster ya trae el ▶ horneado), pero
sin ningún feedback propio más que `cursor:pointer`. Nuevo
`[data-popup] video:not([controls]):hover` con `brightness(1.08)` +
`scale(1.012)` leve (respeta `prefers-reduced-motion`) — apunta solo al
estado pausado/antes de arrancar; una vez reproduciendo, los controles
nativos del navegador ya traen su propio hover.

**6 · Botón "Ampliar"/"Contraer" — pedido opuesto al de una vuelta
anterior.** El texto en pantalla completa había pasado de "Contraer" a
"Salir" por pedido explícito del cliente en una vuelta previa ("cuando
está maximizado no estaría bueno que se llame contraer"). Esta vuelta
pidió volver a "Contraer" — revertido en `coto-player.js` (kit),
dejando el `title`/`aria-label` ("Salir de pantalla completa") sin
tocar, que es donde vive el matiz más explícito.

**7 · Error propio, encontrado y corregido en el momento**: al
sincronizar los archivos de kit tocados esta vuelta, un `cp` sin filtrar
sobrescribió `kit-base/js/curso.js` (la plantilla de arranque para el
PRÓXIMO curso) con el `curso.js` completo de ESTE curso — exactamente
lo que CLAUDE.md §1 prohíbe ("curso.js es específico de cada curso,
nunca toca kit-base"). Reconstruido como plantilla genérica real
(el snippet corto documentado en `kit-base/README.md`, "con v1.7 un
curso.js nuevo arranca así"), sin ningún dato de "Uso de Sucursales 3".
No afectó al curso entregado — el `curso.js` real de este curso nunca
se tocó — pero si no se detectaba a tiempo habría arruinado el punto de
partida del próximo curso.

**8 · "Mis logros" al mismo diseño de Índice/Glosario/Ayuda.** Pedido
explícito de seguir unificando ("todo lo que se desprenda del menú del
curso debe tener el mismo diseño"). `.modal-card.d-drawer-r > .modal-hd`
(fix de §6.41) se extiende a `.modal-card.d-wide > .modal-hd` — mismo
degradado/tipografía, 2 formas de contenedor (cajón lateral vs. modal
centrado), sin tocar `.modal-hd--dark` en sí (queda disponible para un
uso futuro genuinamente distinto).

**9 · "Sonido" no muteaba los videos — bug real, no solo del curso.**
`initSoundToggle` (`coto-player.js`) solo escribía
`localStorage['coto-diapos-mute']`; fx.js/coto-ui.js SÍ la leen (efectos
de UI), pero los 3 patrones de video de `coto-media.js` (fondo, pop-up,
círculo inline) nunca la leían — "Sonido" apagaba los efectos pero no
los videos, contradiciendo la expectativa de un mute GLOBAL. Fix en 2
partes, ambas necesarias:
  - `coto-media.js` gana el mismo helper `muted()` que ya usan
    fx.js/coto-ui.js, y lo aplica (`v.muted = muted()`) justo antes de
    cada `.play()` de los 3 patrones — así todo video que arranca
    DESPUÉS de togglear "Sonido" ya nace en el estado correcto.
  - Eso solo no alcanza para un video de FONDO que ya está sonando EN
    EL MOMENTO del click (portada, separador de unidad) — nadie le
    tocaba `.muted` en vivo. `coto-player.js` suma `syncVideos()`
    (`document.querySelectorAll('video').forEach(v => v.muted = ...)`)
    llamado desde el mismo `sync()` que ya corre al togglear Y al
    cargar la página — cualquier video, de cualquier patrón, presente
    en el DOM en ese momento, queda sincronizado al toque.

---

## 6.45 Arranque de "Seguridad alimentaria" (Área Control de Calidad) — 8 gaps reales del kit y la primera cáscara de minijuego compartida (kit-base v1.9.21)

Curso nuevo armado con el método de §7.1 (kit-base + PDF + el zip de
"Uso de Sucursales 3 - NOA" como referencia). La auditoría del PASO 2
—módulo por módulo, clase por clase— encontró **6 diferencias reales**
entre el kit y el curso de referencia; construir el curso destapó **2
bugs más**, los dos en el kit. Y por primera vez apareció un caso que
la regla de §4 ("si un segundo curso la necesita, sube al kit") pedía a
gritos: **el minijuego**.

### El minijuego: el diseñador reusa su propio molde, así que el kit también

El PDF de este curso trae un minijuego con **el mismo molde visual** que
el de NOA: cartel "¡Aprendé jugando!" arriba a la izquierda, la
ilustración al costado, las 4 tarjetas de estado (encontrados / puntos /
vidas con corazones 8-bit / reglas), el banco de opciones como un "mapa"
de píldoras unidas por líneas, y el panel final con los 2 personajes y
sus trofeos. La **mecánica** sí cambia (acá es UNA imagen con 5 cosas
mal y 12 opciones, no 5 situaciones con 1 respuesta cada una), pero eso
es lógica de juego, no diseño.

Toda esa cáscara vivía en el `diapositivas.css` de NOA — ~120 reglas
`.d-mj-*` con **seis rondas de feedback del cliente encima** (§6.30,
§6.34, §6.37, §6.39, §6.40, §6.42: el aire arriba/abajo, el wrap de la
4ª tarjeta, el derrame de "1000" fuera de su caja, el recuadro blanco
alrededor del iPad, el `minmax(0,1fr)` + `min-width:0`…). Reescribirla
era garantía de volver a pisar los mismos 8 bugs. Se extrajo a
**`css/coto-minijuego.css`** con la separación explícita escrita en el
propio archivo:

- **Kit**: lienzo de las capas intro/fin, columna cartel + ilustración,
  las 4 tarjetas de estado, las píldoras con sus estados, el feedback,
  el botón de avance, el panel final y toda la escalera responsive.
  Parametrizado con `--mj-accent`, `--mj-escena-ratio` y `--mj-track`.
- **Curso**: la TOPOLOGÍA del banco (cuántas filas/columnas y dónde va
  cada línea — 10 nodos en NOA, 12 acá), la proporción real de sus
  ilustraciones, y la lógica del juego en `curso.js`.

**Lección**: cuando el diseñador reusa su propio molde entre cursos, lo
que se repite no es "un componente" suelto sino una PANTALLA entera con
su historia de correcciones. Ahí el costo de no subirla al kit no es
escribir CSS de nuevo: es volver a descubrir los mismos bugs de layout
uno por uno, con el cliente mirando.

### Los 2 bugs que aparecieron construyendo, no comparando

**1 · `medallaDe()` daba una medalla de consuelo, y el subtítulo la
desmentía en la línea de abajo.** Con un puntaje por debajo del umbral
más bajo, la función devolvía igual el nivel más bajo (`return
orden[orden.length - 1]`), mientras el subtítulo —que sí calcula el
próximo umbral por alcanzar— decía cuánto faltaba para ESE MISMO nivel.
En pantalla, textual:

> **Medalla de bronce** — 230 puntos · te faltaron 45 para la de bronce

Te felicita por una medalla y te dice que te faltan puntos para
conseguirla. Se ve solo si alguien queda por debajo del piso (en un
curso bien armado el gate lo garantiza, §6.10.6), pero cuando se ve es
peor que no mostrar nada. **Fix**: `medallaDe` devuelve `null` cuando no
se alcanzó ninguna, y `pintarMedalla` lo trata como el estado real que
es (candado, "Todavía sin medalla de bronce", "te faltan N"). El
contrato suma un `[data-medalla-lbl]` **opcional y retrocompatible**:
si el curso lo trae, el kit escribe ahí la etiqueta que va delante del
nombre y el `<b>` del nombre queda intacto con su estilo; si no lo
trae, se comporta igual que antes.

**2 · El mismo bug de orden implícito de §6.18 punto 4, una función más
abajo.** Aquella vuelta arregló `medallaDe()` para que ordenara una
copia antes de decidir… y dejó intacta la búsqueda del "próximo nivel"
dentro de `pintarMedalla()`, que seguía recorriendo `niveles` en el
orden en que lo escribió el curso. **Lección de proceso**: cuando se
corrige una dependencia de orden implícito, hay que buscar el MISMO
patrón en todo el archivo, no solo en la función que falló — casi nunca
está una sola vez.

### Los 6 gaps de la auditoría contra el curso de referencia

1. **`coto-cierre.css` estilaba `.d-cert-stats` solo dentro de sus media
   queries.** El archivo declaraba que el layout de la tarjeta de
   estadística "queda a cargo de cada curso"… y traía igual sus 3
   escalones responsive de `padding`/`font-size` más abajo. O sea: el
   kit estilaba el componente pero dependía de que el curso escribiera
   la regla base. El que se olvidaba veía "10/10Reportes explorados"
   pegado en una línea. Subió la regla base (usa solo tokens).
2. **El ancho del resumen de cierre (`1680px/96%`) nunca volvió al
   kit** — el fix de §6.22 punto 6 quedó atrapado en el curso, el
   patrón de siempre (§6.17.2). El kit seguía en `1400px/100%`.
3. **`.d-sidenav-progress` y `.d-salida-eval`** seguían fuera del kit
   con una nota que decía que "no son universales porque dependen de
   `--cat`". Es falso: `--cat` lo resuelve el `data-cat` del `<body>`,
   que es justamente el mecanismo genérico del kit (§6.14 punto 2). Las
   dos usan solo tokens. Subieron al addendum.
4. **`.d-instr-cta`**: el addendum traía SOLO el degradé de fondo dentro
   de `.d-instr-modal`; la regla base (`display:flex;justify-content:
   center`) vivía suelta en cada curso, y sin ella el botón queda
   alineado a la izquierda (§6.23). Subió.
5. **Las tildes de avance `.d-u2-prog`/`.d-u2-tick`**: patrón
   identificado desde §6.10.3, portado a mano en §6.22 punto 7, nunca
   subido. Subieron con el `position:absolute` que las hace funcionar
   sobre un `[data-place]` (el bug de §6.22 punto 7 escrito al lado).
6. **`initInlineCircleVideos` no cubría "el arte ya dibuja el
   reproductor".** El fix de §6.29 —sin `controls` nativo hasta que el
   video arranca, porque si no el navegador superpone SUS controles
   sobre el play dibujado en el póster— existía SOLO en
   `initPopupVideos`. Este curso tiene un video embebido en una
   diapositiva normal (no en un pop-up) con ese mismo mockup dibujado,
   y el bug se reproducía igual. Ahora `initInlineCircleVideos` detecta
   la variante por el MARCADO (si no hay `.d-shot-hit-play`, el
   `<video>` es visible siempre y `controls` se agrega en `play`), y
   marca `.is-poster` en el wrapper desde el propio JS para que el CSS
   no dependa de `:has()` ni de que el curso se acuerde de escribirla.

### 2 piezas nuevas del kit, las dos pedidas por el arte de este curso

**`.modal-card--art` (coto-shot-stage.css)** — el diseñador entregó los
6 pop-ups como **PNG con alfa real**, a resolución nativa, con su ✕ (o
su botón "Continuar") ya dibujados. `.modal-card--shot` no servía por
dos motivos que no son de gusto: (a) la silueta no es un rectángulo —el
ícono redondo sobresale por arriba de la tarjeta—, así que el
`background` y el `border-radius` de `.modal-card` se dibujarían como
una caja blanca detrás del círculo, delatando el recorte; y (b) la
sombra ya viene en el alfa, y `.modal-card` le suma `--shadow-pop`: las
dos sombras desalineadas de §6.28, otra vez. La clase nueva es
transparente, sin borde ni sombra, con `object-fit:contain` y su
`--shot-card-ratio` por pop-up.

**`initShotSwap()` (coto-media.js)** — la generalización que §1 y §8
venían anotando como pendiente desde "Surtido sin venta"
(`initConceptShots`, con los 7 conceptos hardcodeados: *"si un curso
futuro repite el patrón, generalizarla recién ahí"*). Este curso lo
repite **cuatro veces**: 2 carruseles, 1 juego de pestañas y 1 barra de
4 pasos, todos "una zona dibujada en el arte cambia la página entera
por otra variante del mismo PDF". Tres detalles que valen para
cualquier curso futuro:

- **Swap de `src`, no `[data-layers]` con un panel por variante.** Son
  la MISMA página con una pieza distinta: N paneles serían N copias del
  mismo marcado y N juegos de hitboxes que mantener sincronizados.
- **La flecha que se iría de rango se OCULTA sola.** En estos PDF el
  diseñador dibuja la flecha solo donde existe (la primera página no
  tiene "anterior", la última no tiene "siguiente"). Un botón invisible
  sobre una flecha que no está dibujada es exactamente el hitbox
  fantasma que prohíbe §7.3 punto 4.
- **El módulo no narra.** Expone `onChange(indice, id, vistos, total)`
  y nada más: qué se narra en cada paso es contenido, y narrar el paso
  actual —nunca la consigna fija de la diapositiva— es la regla de
  §6.5 que ya costó un reporte del cliente.

### El botón del panel final: cuándo pintar y cuándo no

El arte de cierre del minijuego de este curso dibuja **"Reintentar" en
las DOS versiones**, también en la de aprobado — el alumno que pasa
quedaría sin botón para seguir. El cliente confirmó que tiene que decir
"Continuar" al aprobar, así que el botón pasa a ser HTML real.

La tentación es blanquear la zona en el arte y dibujar encima. **No**:
es exactamente el bug de §6.22 punto 5 (un rectángulo blanco sobre una
píldora redondeada deja las 4 esquinas asomando), y acá encima el botón
cae justo sobre el borde entre el fondo blanco de la tarjeta y el piso
gris del dibujo — no hay un color de fondo único con el que taparlo.
Lo que sí funciona: **repintar el botón entero con la misma forma,
tamaño y colores medidos sobre el arte**, de modo que cubra al dibujado
sin dejar nada asomando (relleno y trazo sacados con un muestreo de
píxeles, no a ojo). Quedó como variante genérica en el kit,
`.d-shot-hit.d-mj-fin-cta` (coto-minijuego.css), al lado de la
`.d-mj-fin-btn` transparente de siempre, con la regla de cuándo usar
cada una escrita en el propio archivo:

- El arte trae el texto CORRECTO para ese resultado → hitbox
  transparente (`.d-mj-fin-btn`). Pintarle fondo taparía el texto del
  diseñador (§6.26 punto 2).
- El texto DEPENDE del resultado y el arte dibuja uno solo →
  `.d-mj-fin-cta`, con `--mj-cta-bg`/`--mj-cta-border` que pone el
  curso porque los colores salen del arte, no de la categoría.

### Dos errores propios, atrapados antes de entregar

- **`data-nav="next"` sobre una hitbox invisible.** Parecía la forma
  natural de cablear el "Empezar" dibujado en la portada. Pero
  `_syncNav` le agrega `.d-nav-btn--cta` a **cualquier** elemento con
  ese atributo, y esa clase pinta `background:var(--cat-strong)`: el
  resultado habría sido un bloque de color sólido tapando el botón que
  el arte ya dibuja. `data-goto` hace lo mismo (el motor lo cablea
  igual) sin ese efecto. **Regla**: antes de reusar un atributo del
  chrome en un elemento que NO es del chrome, revisar qué le hace
  `_syncNav` — el motor no distingue entre un botón de la barra y una
  hitbox sobre una captura.
- **La fila de tildes pisando el párrafo de consigna**, en 2
  diapositivas. No se vio mirando el curso: se vio con el overlay de
  hitboxes (`tools/verify-hitboxes.mjs`), que dibuja también los
  `[data-place]`. La banda realmente vacía del arte estaba DEBAJO de
  los puntos del carrusel (82,1% de alto), no arriba. **Reafirma §7.3
  punto 5**: la posición de cualquier overlay se mide contra el arte
  (acá: perfil de filas no-blancas del render), no se estima.

---

## 6.46 Ronda de feedback + 10 propuestas de mejora sobre "Seguridad alimentaria" — 3 piezas que subieron al kit (kit-base v1.9.22)

Ronda con dos partes: 6 correcciones puntuales pedidas por el cliente
sobre lo entregado en §6.45, y un bloque de 10 propuestas de mejora
propias (autorizadas 9/10 — la restante, mostrar el nombre del alumno
en el certificado, quedó pendiente de decisión del cliente, sin
implementar). La mayoría de lo nuevo (repaso rápido en los resúmenes de
unidad, hotspots informativos en "seguridad"/"temperatura"/"envasado"/
"inocuidad", pop-up de predicción antes del video, pista del minijuego)
es contenido específico de este curso y quedó en `seguridad-alimentaria/`.
Tres piezas eran genéricas de verdad y subieron al kit:

**1 · `.modal-card--art` seguía viéndose grande, incluso después del
primer ajuste.** La fórmula de §6.45 (`min(46vw, 420px, calc(70vh *
ratio))`) fue la primera pasada; el cliente pidió achicarla más. Se
escaló cada término x0.7: `min(32vw, 294px, calc(49vh * ratio))`.
Verificado en los 3 pop-ups representativos (situaciones del minijuego,
peligros, reglas): 18% del ancho de pantalla en los 3, texto legible
sin recortes. **Lección de proceso**: "achicalo" sin un número no
significa "un poco" — confirmar la magnitud (acá, otro 30%) antes de
ajustar a ojo, y volver a medir con Playwright después, no solo mirar.

**2 · Buscador del glosario — 100% genérico, nunca supo qué términos
tiene el curso.** `initGlossarySearch()` (nuevo, `js/coto-ui.js`)
filtra cualquier `dl.d-glossary` dentro del pop-up de glosario por
texto, ignorando mayúsculas y acentos (`quimico` encuentra `químico`,
vía `normalize('NFD')`). Si una sección entera queda sin resultados
oculta también su encabezado — nunca deja un `<h4>` colgado sin nada
debajo — y muestra un mensaje "sin resultados" opcional
(`data-gloss-empty`). Markup y estilos del campo de búsqueda en
`css/coto-base-addendum-v1.8.css`.

Bug real encontrado de paso, en la misma sección del CSS: el borde
divisor entre entradas (`.d-glossary > dt:not(:first-child)`) dependía
de la POSICIÓN en el DOM, no de visibilidad — con el buscador activo,
la primera entrada realmente visible podía no ser la primera del DOM y
quedaba con un borde superior de más (o la que debía tenerlo, no lo
tenía). Corregido a `.d-glossary dt:not([hidden]) ~ dt:not([hidden])`,
correcto con o sin filtro activo.

**3 · Lo que NO subió, a propósito.** El pop-up de predicción antes del
video "proceso" reutiliza `data-intro-popup`/`data-intro-once`
(mecanismo ya genérico desde antes, `motor-slides.js`) pero con
markup/estilo de texto plano igual al de "logros" — no la excepción de
diseño de §6.10.2.2 de OTRO curso ("¿Te la jugás?", con arte propio del
diseñador detrás). §6.36 punto 3 ya había documentado el costo real de
invocar esa excepción sin respaldo de diseño (acento ámbar sin pedido
del cliente, revertido); este curso no lo repite. La pista del
minijuego (`programarPista()`, `curso.js`) reusa `.d-mj-opt.is-hint` —
animación que YA vivía en `css/coto-minijuego.css` desde "Uso de
Sucursales 3 - NOA" sin que ningún curso la disparara todavía; sigue
sin subir nada nuevo, solo la primera vez que se usa.

---

## 6.47 Segunda vuelta de feedback sobre "Seguridad alimentaria" — un bug real de kit (`staggerReveal()` con hijos `hidden`) y el resto quedó en el curso (kit-base v1.9.23)

Feedback visual puntual sobre lo entregado en §6.46: el pop-up seguía
chico, faltaba contraste en un header, y 3 pedidos de diseño más
(tilde en vez de punto, reubicar un hint, rediseñar el repaso rápido).
Casi todo quedó en `seguridad-alimentaria/` por ser específico del
curso — una sola pieza era un bug real de kit.

**1 · `.modal-card--art` necesitaba bastante más tamaño, no un ajuste
fino.** El cliente pidió "60%" tras ver el resultado de §6.46 (18% del
viewport). Probado literal (`min(60vw, 960px, calc(96vh * ratio))`):
56.6% de un viewport 1600×900 — el pop-up tapaba las tarjetas de los
costados y el aviso de puntos, texto enorme. Se convalidó un punto
medio con Playwright antes de aplicarlo, no directamente el número
pedido: `min(48vw, 500px, calc(80vh * ratio))` ≈ 31% del viewport,
visiblemente más grande que antes sin romper el layout. **Mismo
patrón que §6.46 punto 1**: un número del cliente sin ver el resultado
renderizado es una intención, no una medida — verificar con captura
antes de aplicar, y si el literal rompe algo, decirlo y proponer un
punto medio con evidencia, no aplicar a ciegas ni tampoco ignorarlo.

**2 · Bug real de kit: `staggerReveal()` dejaba contenido invisible
para siempre.** El pop-up de predicción de este curso (texto plano,
§6.46 punto 3) suma un botón "Continuar" y usa el `<p>` de feedback ya
existente — ambos nacen `hidden`, recién aparecen cuando el alumno
responde. `staggerReveal()` (`js/coto-ui.js`) le pone `.d-stagger-in` a
TODOS los hijos directos de `.modal-hd`/`.modal-bd` al abrir el
pop-up, sin mirar si están `hidden`. Con `display:none` en ese
momento la animación (`opacity:0 → 1`) nunca arranca, y sacar el
`hidden` más tarde no la reinicia sola — queda pegada en el fotograma
`from` (`opacity:0`) para siempre, confirmado en Chromium con
`getComputedStyle`. `coto-quiz.js` esquivaba el problema sin querer
(llama a `stagger()` sobre `.d-q`, que no incluye el feedback/mascota
como hijos directos), pero cualquier pop-up de texto plano con
contenido que se revela después de una interacción lo iba a pisar
tarde o temprano. **Fix**: `staggerReveal()` ahora filtra `el.hidden`
antes de asignar la clase — animar la entrada de algo invisible
tampoco tenía sentido, así que el fix es a la vez la corrección y la
simplificación correcta (nada que un curso tenga que acordarse de
anular a mano).

**3 · Lo que quedó en el curso, y por qué.**
- **Tilde en vez de punto** en las tarjetas de peligro/limpieza
  (`.d-shot-hit--peligro.is-done`): antes un punto verde liso, ahora el
  mismo ícono de tilde que `.d-riesgo-check`/`.d-u2-tick`. Puramente
  visual y específico de esas 5 tarjetas — no hay nada genérico que
  extraer.
- **Reposición del hint de "temperatura"**: el `data-l/t/w/h` del panel
  de hint/cartel vivía abajo a la derecha, lejos de las filas clicables
  y pegado a un globo de texto FIJO del arte (parecía el disparador).
  Se subió y alineó con las filas. Son coordenadas contra el arte de
  ESTE curso — no hay pieza de kit involucrada.
- **Rediseño del repaso rápido**: tarjeta con borde/sombra propios,
  numeración en círculo, botones V/F con ✓/✕, feedback con emoji de
  cierre. Vive enteramente en `seguridad-alimentaria/css/assets.css`
  (el widget completo, `.d-repaso*`, ya era course-only desde §6.46 —
  ver la nota ahí sobre por qué no se reutilizó `coto-quiz.js`).
- **Contraste del header del pop-up de predicción**: `[data-cat=
  "control-de-calidad"]` fija `--on-cat` oscuro (navy) A PROPÓSITO
  para ese degradado claro (`css/coto-base.css`, tabla de colores por
  categoría) — pero el pop-up de predicción es el ÚNICO del curso que
  usa `.modal-hd` liso sin pasar por `.d-wide`/`.d-drawer-r` (que ya
  fuerzan blanco por pedido de cliente, §6.41): sin
  ningún otro pop-up hermano que mantener consistente, el fix fue un
  `color:#fff` scoped a `[data-popup="prediccion-proceso"] .modal-hd`
  en el curso, no un cambio al default de la categoría en el kit (que
  sigue siendo válido para el próximo curso que sí use `--on-cat` como
  está pensado).

---

## 6.48 Tercera vuelta sobre "Seguridad alimentaria": video de fondo con auto-avance, 3 bugs reales de interacción, la pantalla de salida, y un bug de mobile real heredado de NOA (kit-base v1.9.24)

Ronda con cuatro focos distintos — arranca con una regla de proceso
nueva del cliente, sigue con una batería de bugs reales encontrados
probando (no reportados a ciegas), suma una pieza del kit que estaba a
medio terminar, y cierra con una auditoría de mobile pedida
explícitamente a partir de un bug ya resuelto en otro curso.

**1 · Portada y separadores de unidad: regla fija nueva.** El cliente
avisó que, en TODO curso nuevo, portada y separadores de unidad van a
ser un video que arranca solo al entrar y avanza a la próxima diapo al
terminar — sube los `.mp4` finales directo al zip, sin pedir cambios de
código. El patrón (`initBgVideos` + `.d-shot-slide--bg-video` +
`data-autoadvance`) ya existía en el kit desde "Prevención
cardiovascular", pero "Seguridad alimentaria" había arrancado esas 4
diapos como imagen estática (§6.45 no lo tocó). Convertidas con
placeholders de 0 bytes (§3.9). 100% curso — no hay nada de kit acá,
solo un recordatorio: **la próxima auditoría de arranque (§7.1) debería
chequear esto de entrada**, no esperar a que el cliente lo pida nuevo
en cada curso.

**2 · Bug real: `staggerReveal()` no era el único lugar que asumía
orden del DOM = orden de narración.** `Narrador.textOf()` (kit,
`narrador.js`) narra en orden de aparición en el DOM — pero un panel de
hint/cartel de hotspot (`.d-info-panel`) tiene que vivir DENTRO de
`.d-shot` para que `_initShots()` lo posicione, y `.d-shot` cierra
SIEMPRE antes del `.sr-only` con el texto real de la diapo (que vive
afuera, por accesibilidad). Resultado real, reportado en "inocuidad":
la indicación ("Tocá el ícono para...") se narraba ANTES que el
contenido, no después como corresponde (título → info → indicación).
Mismo patrón en los otros 6 `.d-info-panel` del curso (seguridad/
temperatura/envasado/3 resúmenes). Fix: nuevo `[data-narrate-last]` —
un contenedor marcado así se empuja al final de la narración sin
importar dónde vive en el DOM, preservando el orden relativo dentro de
cada grupo. Genérico, cero curso-specific.

**3 · Bug real: video inline con controles nativos + layout de
diapositiva a medida = pantalla completa rota.** El video de "proceso"
(`initInlineCircleVideos`, variante (b) con controles nativos, §6.46)
vive dentro de una diapositiva posicionada en píxeles por
`_initShots()`, recalculados solo en `slidechange`/resize. Entrar y
salir de pantalla completa NATIVA del navegador no dispara ninguno de
esos dos eventos — el cliente lo reportó "roto" (mal posicionado) al
pausar en pantalla completa y volver, y el audio seguía sonando después
de cerrar. Sin fix de browser real posible (mezclar fullscreen nativo
con un layout de diapositivas a medida es una fuente conocida de este
bug en cualquier navegador): se saca el botón con
`controlslist="nofullscreen"` en el curso. Documentado en
`coto-media.js` para que el próximo curso con esta variante lo sepa de
entrada — si necesita fullscreen real, usar el patrón 2 (pop-up,
`initVideoPlayer`) en su lugar, que sí vive fuera del lienzo.

**4 · Bug real: `initHotspots()` no dejaba leer el cartel con mouse
real.** `mouseleave` del contenedor limpiaba CUALQUIER interacción
(hover, foco o clic) apenas el mouse salía — en desktop era imposible
sacar el mouse del ícono para leer el cartel sin que se cerrara solo
(pedido real del cliente: "que al hacer clic el cartel pueda quedar
fijo"). Ahora el clic fija la zona (`pinned`); mientras haya una fija,
`mouseleave` no limpia — vuelve a mostrar esa zona. Se destraba
clickeando la misma zona, otra, o afuera. De paso se pudo SACAR el
viejo truco de `pointerdown`/`activaAlTocar` que evitaba que el toggle
de toque se confundiera con el `mouseenter` sintético que los
navegadores emulan sobre touch (§1.8 original) — con `pinned` movido
solo por clic, ese truco ya no hacía falta. Aplica a los 4 hotspots del
curso sin tocar nada course-specific.

**5 · Pieza de kit que estaba a medio terminar: `#d-salida`.** El
CSS completo de la pantalla de salida (`.d-salida`/`.d-salida-card`/
`.d-salida-ic`/`.d-salida-eval`, addendum §14) y el JS que la busca por
id (`salirDelCurso()`, `coto-cierre.js`) ya estaban en el kit desde
v1.8 — pero el HTML nunca se agregó a "Seguridad alimentaria", así que
"Salir del curso" no mostraba nada más que el intento de
`window.close()`. Apareció recién cuando el cliente pasó una captura
del mismo mensaje rediseñado en "Uso de Sucursales 3 - NOA" pidiendo
aplicarlo acá también — es decir, la pieza YA vivía en el kit, lo que
faltaba era el markup del curso. Se sumó un detalle de diseño real al
CSS del kit: borde izquierdo en `.d-salida-eval` en vez de un recuadro
parejo, para que lea como nota al margen y no como alerta de error.
**Lección de proceso**: si una pieza del kit tiene CSS pero cero
cursos usándola, un checklist de arranque no la va a encontrar sola —
agregar `#d-salida` (con el contenido real del curso) al §7 de abajo
para que el próximo curso no dependa de que el cliente vea el gap en
otro lado primero.

**6 · Bug real de kit, heredado sin saberlo de "Uso de Sucursales 3 -
NOA": el panel "jugar" del minijuego no pasaba a 1 columna en mobile
real.** Pedido explícito del cliente de auditar esto con la MISMA
metodología que ya le había costado una vuelta entera en NOA (no
redimensionar la ventana de escritorio — viewport mobile real con
`isMobile`/`hasTouch`). El comentario de la "escalera responsive" de
`coto-minijuego.css` (§6.42 punto 2) decía que angostar las columnas
`fr` alcanzaba — probado en 375/414px real, `.d-mj-body` seguía siendo
grid de 2 columnas fijas, comprimidas a ~135-155px: imagen minúscula,
píldoras del banco de opciones a ~50px, texto en 3-4 líneas, ilegible.
Mismo bug, mismo archivo compartido, nunca antes probado en un
viewport real para ESTE curso. Fix: `display:grid` → `flex-direction:
column` en el breakpoint ≤600px, con las 2 trampas que el cliente ya
había mapeado en NOA (y que se evitaron gracias a eso):
- `.d-mj-escena-col` ya traía `min-height:0` (para el grid) — en
  columna, sumado al `flex-shrink:1` por default de cualquier hijo
  flex, colapsaba la imagen a 0px en vez de solo achicarla.
  `flex-shrink:0` lo fija a su alto real.
- `.d-mj-escena` traía `max-height:100%` pensado para una fila de grid
  con alto ya resuelto — sin base fiable en columna (`aspect-ratio` ya
  dimensiona la imagen sola, no hace falta).
- `.d-mj-play` suma `overflow-y:auto` (mismo patrón que
  `.d-cierre-summary`, `coto-cierre.css`) porque `.d-stage` recorta con
  `overflow:hidden` más arriba en la cadena — sin esto, lo que no entra
  en un viewport bajo queda CORTADO, no solo apretado.
Verificado con Playwright en viewport mobile real (375/414px): imagen
completa, tarjetas legibles, opciones a ancho completo, scroll llega a
todo, clic funcional (feedback + puntos correctos). Re-verificado en
768/834 (tablet, sigue en grid) y 1280 (desktop) sin cambios.
**Lección de proceso, la misma que §6.34 y varias más ya dejaron
anotada de otras formas**: "probé el responsive" sin especificar CÓMO
se probó no alcanza como verificación — redimensionar la ventana de
escritorio no es lo mismo que un viewport mobile real (faltan
`isMobile`/`hasTouch`, y algunos navegadores/CSS se comportan distinto).
Sumado a §7.3 (checklist de consistencia de diseño) como punto
explícito: probar cualquier breakpoint ≤600px con Playwright en
viewport mobile real (`isMobile:true`, `hasTouch:true`), no solo la
ventana de escritorio angosta.

---

## 6.49 Cuarta vuelta sobre "Seguridad alimentaria": el video se pausaba solo (o no se pausaba), el botón de play quedaba ovalado, y una trampa de especificidad que hay que dejar advertida en el kit (kit-base v1.9.25)

Feedback puntual sobre el video de "proceso" (patrón 3, variante con
carátula real — §6.29/§6.45): al tocar pausa en los controles nativos
el video volvía a mostrar la carátula pero el audio seguía sonando
("no corta"), y el botón de play quedaba ovalado en vez de circular al
entrar a pantalla completa. Los dos, bugs reales de KIT — no del
marcado de este curso.

**1 · Pausa que no pausaba — carrera entre el clic del control nativo y
el propio handler.** `initInlineCircleVideos` dejaba un
`video.addEventListener('click', …)` que decidía play/pausa mirando
`video.paused` en CUALQUIER clic sobre el `<video>`, sin distinguir un
clic sobre el CUERPO del video de uno sobre la barra de controles
nativos que ese mismo `play` ya le había puesto (variante con
carátula). El clic sobre el botón de pausa nativo llega al `<video>`
**antes** de que el navegador aplique la pausa — así que el handler
propio leía `video.paused === false` (todavía, el estado viejo),
concluía "está reproduciendo, así que pauso", llamaba `video.pause()`
a mano… y un instante después el control nativo terminaba de procesar
SU pausa, dejando los dos en pugna. El síntoma real observado
(carátula de vuelta + audio sonando) es la firma clásica de un
`play()`/`pause()` en carrera: `.is-playing` se sacaba (mostrando la
carátula) mientras el `<video>` de fondo seguía sonando porque el
segundo `pause()` interno de los controles nunca llegó a aplicarse
limpio.

Fix real, no un parche de timing: el toggle por clic **deja de
decidir nada una vez que hay controles nativos puestos** (`if
(video.hasAttribute('controls')) return;`) — con controles nativos, el
play/pausa es trabajo DE ELLOS, punto. El estado visual
(`.is-playing`) pasa a escuchar los eventos reales `play`/`pause` del
propio `<video>` en vez de que un clic los infiera — así da igual
quién disparó el cambio (el botón del kit, un clic sobre el video
antes del primer play, o los controles nativos después). Un matiz
más: en pausa, la variante CON carátula ya no vuelve a mostrarla —
se queda mostrando el cuadro congelado + los controles, como
cualquier reproductor real (volver a la carátula ahí ERA el bug); la
variante circular SIN carátula sí vuelve al arte de base al pausar,
porque no tiene controles con los que retomar — su único affordance
es el botón de play propio.

**Regla general que deja esto**: un listener de `click` genérico sobre
un `<video>` que en algún momento de su ciclo de vida puede tener
`controls` nativo puesto es una fuente de carrera garantizada — los
controles nativos YA manejan sus propios clics internamente, y
duplicar esa decisión "por si acaso" es lo que rompe. La pregunta
correcta no es "¿qué hago en este clic?" sino "¿quién es dueño del
play/pausa en este momento?" — y una vez que hay `controls`, la
respuesta es siempre "el navegador".

**2 · Botón de play ovalado en pantalla completa.** `.d-shot-hit-play`
se dimensionaba con `width:44%; height:44%` (dos ejes en % del
wrapper) más `max-width:64px; max-height:64px` (un tope por eje). Un
wrapper CUADRADO no delata el problema (los dos ejes dan el mismo
número), pero uno rectangular sí — y el wrapper es una caja de video
(nunca cuadrada). En cuanto un tope entra a jugar en un eje y en el
otro no (típico al cambiar de tamaño de ventana, y sobre todo al pasar
a pantalla completa, donde el lienzo cambia de proporción de golpe),
ancho y alto dejan de coincidir → botón ovalado. Fix: un solo eje
manda (`width: 44%`) y `aspect-ratio: 1` deriva el otro — redondo
siempre, en cualquier caja, sin importar cuántos topes se crucen.
Mismo patrón de bug (2 ejes independientes + tope por eje) que ya
había costado 2 vueltas distintas en "Uso de Sucursales 3 - NOA"
(§6.42 punto 5, la tarjeta "Puntos" derramándose) — vale la pena
recordar: **cualquier elemento que tenga que ser un círculo real se
dimensiona con UN eje + `aspect-ratio:1`, nunca con `width`/`height`
independientes**, así sea 99% de las veces "obviamente" redondo en las
pruebas de escritorio.

**3 · Trampa de especificidad al pisar `object-fit` de la variante con
carátula, dejada documentada en el propio `coto-media.js`.** Bug
course-specific (no de kit), pero la CAUSA es genérica y se va a
repetir: este curso quiso `cover` en vez del `contain` por defecto
para la caja de video del proceso (la tarjeta del diseñador es
1.716:1, los videos del cliente se exportan a 2:1 — con `contain`
sobraba franja arriba/abajo dentro de la tarjeta). El primer intento
agregó `.d-shot-hit--videobox .d-shot-hit-video { object-fit: cover;
}` — 2 selectores de clase. La regla del kit que había que pisar,
`[data-inline-video].is-poster .d-shot-hit-video`, tiene 3. Un
selector con MENOS especificidad nunca gana, sin importar en qué
archivo esté ni en qué orden se cargue: el `<video>` se quedó en
`contain` mientras la carátula (que sí tenía menos competencia, un
solo selector del lado del kit) pasó a `cover` sin problema — dos
`object-fit` distintos conviviendo, uno para el reposo y otro para la
reproducción. El síntoma reportado por el cliente fue justamente
"el video tiene unos recortes arriba y abajo cuando empieza a
reproducir" — que en realidad era el encuadre CAMBIANDO de golpe al
arrancar, no un recorte real de contenido. Fix del curso: repetir el
prefijo completo del kit en el selector propio
(`[data-inline-video].is-poster.d-shot-hit--videobox …`), no solo
sumar una clase más. Documentado ahora como advertencia directamente
en el doc-comment de `initInlineCircleVideos` (kit,
`js/coto-media.js`) para que el próximo curso que quiera pisar este
`object-fit` lo vea ANTES de repetir el mismo bug.

---

## 6.50 Minijuego: las píldoras se estiraban al achicar la ventana, y "Producto alterado" pasa de trampa a hallazgo real con pista diferenciada (kit-base v1.9.26)

Dos pedidos/reportes del cliente sobre "Seguridad alimentaria" en la
misma vuelta, los dos con cambios de kit.

**1 · Bug real de layout: "las cajitas de respuesta del minijuego se
agrandan cuando el curso está achicado".** Medido con Playwright en 12
anchos de ventana (620px a 1920px), comparando la altura de una
píldora CORTA ("Contaminación cruzada") contra una LARGA ("Productos
de limpieza cerca de los alimentos") en la misma fila del grid: la
corta pasaba de 46px a 86px de alto según el ancho — sin que su propio
texto necesitara más de 1 línea. Causa: `.d-mj-grid` tenía
`align-items:stretch` — el default de CSS Grid para el eje de bloque.
En cuanto la ventana se angosta lo suficiente para que la etiqueta
larga pase a 2 líneas, la fila ENTERA (todas sus celdas) se estira
para igualar a la más alta, inflando también a las vecinas cortas.
Fix: `align-items:start` en `.d-mj-grid` — cada píldora mide su propio
contenido; el alto TOTAL de la grilla no cambia (las filas siguen
reservando el espacio de la celda más alta, así que el layout general
es idéntico), solo deja de inflarse el botón individual. Las líneas
conectoras (`.d-mj-line--h`/`--v`) no se ven afectadas: ya fijan su
propia alineación con `align-self`/`justify-self` explícito,
independiente del `align-items` del contenedor — vale como regla
general: cualquier ítem de grid que necesite una alineación distinta a
la del resto debería fijar la suya propia en vez de depender de que el
`align-items` del padre nunca cambie.

**2 · "Producto alterado" tenía un problema real, no de percepción.**
El cliente señaló que una de las dos piezas de carne del arte SÍ se ve
de un color distinto a la otra (más oscura) — y el feedback del juego
decía "no cambiaron de color", contradiciendo lo que se ve. Confirmado
con recorte + comparación de píxeles (no a ojo). Dos caminos posibles:
recolorear el arte para que ambas piezas queden parejas (mockup
armado, comparado antes/después), o promover la opción de "trampa" a
"hallazgo real". El cliente eligió la segunda — preferencia explícita
de no tocar el dibujo del diseñador. Esto es contenido, no kit (queda
en `curso.js`/`README-CURSO.md` del curso: `MJ_TOTAL` 5→6, `MJ_APROBAR`
3→4, umbrales de medalla recalculados sobre el nuevo puntaje máximo),
pero deja una lección general: **antes de "arreglar" un arte que no
calza con el copy, preguntar si el copy es el que está mal** — en este
caso, technically ninguna de las dos correcciones era "más correcta"
en abstracto, la decisión fue del cliente.

**3 · Pista diferenciada — reversión explícita de una decisión de
diseño anterior.** La pista tras 20s de inactividad (y la remediación
al reintentar) resaltaban 3 opciones — 1 correcta + 2 incorrectas —
SIN decir cuál era cuál, a propósito (§6.39: "nunca delata CUÁL de las
3 es la correcta, solo reduce el ruido"). El cliente pidió ahora
explícitamente que SÍ se distinga. Importante: esto no es un bug
corregido, es un cambio de producto que REVIERTE una decisión anterior
— documentarlo así evita que alguien mire el commit viejo y "corrija"
el nuevo pensando que es un descuido. Kit (`css/coto-minijuego.css`):
`.is-hint-ok` (la correcta) suma una insignia con ícono 💡 + pulso
celeste; `.is-hint-bad` (las incorrectas del trío) se queda con el
pulso ámbar de siempre, sin ícono — dos estados que no dependen solo
del color, para no fallar en daltonismo. El curso decide CUÁLES 3
resaltar (`programarPista()`/`aplicarRemediacion()` en `curso.js`,
con un helper `marcarHint(id, ok)` que centraliza qué clase poner);
el kit solo decide cómo se ve cada estado.

---

## 6.51 La barra de progreso "olvidaba" sesiones anteriores, y la barra de "pasos" de Rotación pasa a ser arrastrable — el bug más largo de encontrar de todo el curso (kit-base v1.9.27)

**1 · Bug real, encontrado a partir de un reporte confuso del
cliente**: "estaba intentando adelantar la barra de abajo y no me
deja, pero yo ya había visto las diapos siguientes". La barra de
progreso SÍ soporta arrastrar hacia adelante hasta lo ya visitado
(`initProgressSeek`, §6.10/kit v1.7) — pero el TOPE se calcula con
`motor.maxVisited`, una propiedad que **cada curso** inicializa en su
propio `boot()` (no es del kit: nació en `curso.js`, ver el comentario
ya existente ahí sobre el bug original de `NaN`). El código lo
inicializaba con `motor.maxVisited = motor.index` — que es 0 al
arrancar, salvo que el alumno acepte el banner "Retomá donde dejaste"
(opt-in, nunca salta solo, §6.10). El problema: `restaurar()` YA había
repoblado `estado.vistas` con el progreso de sesiones ANTERIORES un
par de líneas antes — el mismo dato que sí restaura bien puntos y
logros — pero `motor.maxVisited` nunca lo consultaba. Resultado: quien
reabre el curso sin tocar el banner de "retomar" se encuentra con la
barra de arrastre creyendo que el techo real es 0, aunque haya
recorrido media unidad en una sesión previa. Fix (en `curso.js`, no
hay código de kit que tocar — pero la LECCIÓN sí es genérica, ver
abajo): recorrer `Object.keys(estado.vistas)` contra
`data-slide-index` de cada diapositiva para calcular el máximo real,
ANTES de fijar `motor.maxVisited`. Verificado con Playwright simulando
una recarga completa de página (avanzar, `page.reload()`, comprobar
que el arrastre hacia adelante llega hasta lo ya visitado).

   **Regla para el checklist de arranque (§7) de cualquier curso
   futuro que use `initProgressSeek` + `visitedIndexes`**: si el curso
   persiste progreso entre sesiones (todos lo hacen, vía
   `suspend_data`), `motor.maxVisited` — o el mecanismo equivalente
   que el curso use para alimentar `visitedIndexes()` — tiene que
   calcularse a partir del estado YA RESTAURADO al arrancar, nunca
   solo desde `motor.index` en frío. Es exactamente el mismo tipo de
   bug, en espíritu, que ya cuesta caro en este molde: un dato que se
   restaura bien en un lugar (puntos, logros) y se olvida restaurar en
   otro (el techo de arrastre) porque viven en variables separadas que
   nadie sincronizó explícitamente.

**2 · Barra de "pasos" arrastrable — pedido explícito, generalizado en
el kit.** La diapositiva "Rotación y control de vencimientos" tiene 4
botones `.d-shot-hit--paso` ("Paso 1 de 4"... "Paso 4 de 4") dibujados
sobre una barra horizontal del arte — hasta ahora solo clic discreto
por tramo. El cliente pidió que se pudiera ARRASTRAR, como un slider
real. Generalizado en `initShotSwap()` (kit, `js/coto-media.js`),
acotado a propósito a `.d-shot-hit--paso` — **no** a cualquier
`[data-shot-swap-go]`: ese mismo atributo también arma pestañas de
categoría (`.d-shot-hit--tab`, "Personas/Medio ambiente/Plagas/...",
usado en "¿Cómo se contaminan?"), donde arrastrar entre opciones no
tiene sentido semántico — no son una progresión lineal, son categorías
sin orden. Solo `.d-shot-hit--paso` (un progreso real: paso 1→2→3→4)
suma la posibilidad de deslizar.

   **El bug real, y por qué costó 2 rondas encontrarlo**: el arrastre
   se cortaba solo a mitad de camino, de forma INTERMITENTE — a veces
   al primer intento, a veces recién al segundo, lo que hizo pensar
   por un rato que el problema era de timing/coalescing de eventos
   sintéticos de Playwright. La causa real, confirmada instrumentando
   `pointercancel`/`gotpointercapture`/`lostpointercapture` con logs
   dentro del propio handler: el botón del paso ACTIVO tiene
   `pointer-events:none` (CSS ya existente, para no competir
   visualmente con el resaltado) — así que el `pointerdown` que arranca
   ahí en realidad hace *hit-test* sobre el `<img>` de fondo, no sobre
   el botón. Y una imagen es ARRASTRABLE por el navegador por default
   (se puede arrastrar para guardarla/copiarla). En cuanto el mouse se
   mueve lo suficiente, el navegador reconoce el gesto como "el usuario
   quiere arrastrar esta imagen" y dispara SU PROPIO drag-and-drop
   nativo — lo que cancela la secuencia de eventos de puntero en curso
   (`pointercancel`), cortando el `pointermove` en seco a mitad de
   camino. `e.preventDefault()` en el `pointerdown` se lo impide.
   **Por qué la barra de progreso del curso (`initProgressSeek`, kit
   v1.7) nunca tuvo este bug**: su pista es un `<div>` plano, no una
   imagen — los `<div>` no son arrastrables por default, así que nunca
   compitió con el drag nativo del navegador. **Regla nueva para
   cualquier interacción de arrastre futura que viva ENCIMA de un
   `<img>`** (no solo swap de pasos — cualquier hitbox arrastrable
   sobre una captura): llamar `e.preventDefault()` en el `pointerdown`
   SIEMPRE, no solo cuando "se nota" el bug en pruebas rápidas — la
   intermitencia es la firma de este tipo de carrera con el navegador,
   no una señal de que "a veces no pasa nada".

   **Regresión propia, encontrada y corregida antes de subir esto**:
   la primera versión escuchaba `pointerdown` en cada BOTÓN de paso
   individual (no en el `[data-shot]` contenedor) y llamaba a
   `setPointerCapture` sobre un elemento DISTINTO (el contenedor) —
   mezcla que además de no arreglar el bug de arriba, dejaba al botón
   del paso activo (`pointer-events:none`) sin ningún listener que
   pudiera dispararse ahí, imposibilitando arrancar el arrastre parado
   en el paso actual. Fix: todo — `pointerdown`/`pointermove`/
   `pointerup` Y la captura — vive en el MISMO elemento (`shot`), y el
   punto de partida se decide por POSICIÓN (¿la coordenada cae dentro
   del rectángulo que ocupan los botones de paso?), no por cuál
   elemento resultó ser el target real del evento — mismo patrón que
   ya usa `initProgressSeek`, ahora con la razón explícita de por qué
   importa copiarlo exacto.

   **Segunda regresión propia, distinta**: al mover el `pointerdown` al
   contenedor y disparar `go()` inmediatamente al presionar (para que
   un simple clic sin arrastre también funcione), el listener de
   `click` YA EXISTENTE (delegado, para el resto de los patrones de
   swap) seguía disparando `go()` una segunda vez para el mismo botón
   — inofensivo para el índice final, pero duplicaba `onChange`
   (narración/puntaje dos veces). Peor: al excluir sin más
   `.d-shot-hit--paso` del handler de `click`, los pasos dejaron de
   responder a activación por TECLADO (Enter/Espacio sobre el botón
   con foco disparan un `click` sintético, sin ningún `pointerdown`
   previo — un lector de pantalla o un alumno sin mouse se hubiera
   quedado sin poder cambiar de paso). Fix: distinguir el origen del
   `click` con `e.detail` — un clic real de mouse siempre trae
   `detail >= 1` (cuenta de clics), uno sintetizado por activación de
   teclado trae `detail === 0`. El handler de `click` solo se salta
   para `.d-shot-hit--paso` cuando `e.detail !== 0` (ya resuelto por el
   arrastre); con `detail === 0` deja pasar el `go()` de siempre.
   **Regla general**: cualquier vez que se reemplace un mecanismo de
   `click` por uno de `pointerdown`/drag, verificar EXPLÍCITAMENTE que
   la activación por teclado (que nunca genera eventos de puntero)
   siga funcionando — es fácil de pasar por alto porque "anda bien" en
   cualquier prueba manual con mouse.

   Verificado con Playwright: 8 corridas seguidas de 3 arrastres
   consecutivos cada una (incluido arrancar parado en el paso activo),
   sin un solo fallo; Enter/Espacio con foco de teclado siguen
   cambiando de paso; un clic simple de mouse no narra/premia dos
   veces; los tabs de "¿Cómo se contaminan?" y las flechas+puntos de
   malas/buenas prácticas quedan sin cambios de comportamiento.

---

## 6.52 Glosario interactivo: clic en un término navega a la diapositiva, y el glosario se desbloquea con el progreso real del curso (kit-base v1.9.28)

Pedido explícito del cliente sobre "Seguridad alimentaria": que cada
término del glosario, al tocarlo, lleve a la diapositiva donde se
explica; que el glosario se vaya desbloqueando a medida que el alumno
llega a esas diapositivas; y que avise cuando desbloquea un concepto.
Confirmado con el cliente antes de escribir código (dos decisiones de
diseño reales, por `AskUserQuestion`): término bloqueado = nombre
visible + candado, definición oculta (no "nombre + definición
tachada"); la búsqueda del glosario excluye los términos bloqueados.

**Diseño clave: cero estado nuevo que mantener sincronizado.** La
tentación era un `estado.glosario = {}` propio, marcado a mano por
término. Pero el curso YA sabe "qué diapositivas se visitaron"
(`estado.vistas`, restaurado entre sesiones desde antes — CLAUDE.md
§6.51) — un término está desbloqueado si y solo si ya se visitó SU
diapositiva. Cero mapa nuevo, cero riesgo de que un dato se desincronice
del otro (la misma familia de bug que costó caro en §6.25/§6.51: dos
lugares guardando el mismo hecho, y uno de los dos quedando viejo).

**Diseño clave 2: "clic navega" no necesitó JS nuevo.** El atributo
`data-goto="<slide-id>"` ya es el mecanismo del kit para el índice/
sidenav — `Motor._init()` lo cablea solo (cierra cualquier pop-up
abierto vía `go()` y navega). Poner ese mismo atributo en el `<dt>`
del término (dentro de un `<button>`, para que sea foco/teclado real)
es TODO lo que hace falta — cero JS de navegación propio.

**Lo que SÍ subió al kit — genérico de verdad, no sabe qué términos
tiene ningún curso:**
- `initGlossaryUnlock(opts)` (`js/coto-ui.js`) — recorre
  `dl.d-glossary dt[data-goto]`, pregunta `opts.seen(id)` (que el curso
  responde con `!!estado.vistas[id]`) y pone/saca `.is-locked` en el
  `<dt>`. Devuelve una función `refresh()` que el curso llama de nuevo
  en cada `slidechange` — la primera pasada (arranque, progreso ya
  restaurado) es SILENCIOSA a propósito (`refresh(true)`): aplicar un
  estado que ya existía no es una notificación nueva. Las pasadas
  siguientes sí acumulan qué términos pasaron de bloqueado a
  desbloqueado y se los pasan a `opts.onUnlock(labels)`, para que el
  curso dispare un toast (`Player.toast('🔓 Desbloqueaste ...')`) —
  mismo patrón ya usado para logros/puntos, nada nuevo del lado del
  toast.
- CSS pareja en `coto-base-addendum-v1.8.css`, sección 21 (GLOSARIO):
  `.d-gloss-term-btn` (el término, sin skin de botón, subrayado al
  hover/foco), `.d-gloss-lock-ic` (candado, oculto salvo
  `dt.is-locked`), y `dt.is-locked + dd .d-gloss-def{display:none}` /
  `.d-gloss-hint{display:inline}` — el `<dd>` de cada término trae
  SIEMPRE los dos `<span>` (definición real + hint de desbloqueo), el
  CSS decide cuál se ve según la clase del `<dt>` hermano. Ningún JS
  reescribe contenido en caliente — evita el riesgo de "guardé la
  definición en un `data-*` y me olvidé de un caso" que ya costó caro
  en otros componentes del kit.
- `initGlossarySearch()` (mismo archivo, ya existente desde v1.9.22) se
  extiende una línea: con texto de búsqueda, un `<dt class="is-locked">`
  nunca entra en los resultados (su definición real sigue en el DOM,
  pero oculta por CSS, no por el filtro — no debería poder
  "encontrarse" buscando antes de desbloquearse). Sin texto de
  búsqueda, se sigue mostrando igual que siempre (con su candado): esa
  es la vista normal del glosario, no un resultado de búsqueda.

**Lo que quedó en el curso, a propósito**: el mapeo término→diapositiva
(qué `data-goto` le corresponde a cada uno de los 26 `<dt>`) es
contenido — depende de qué explica cada diapositiva de ESTE curso. Se
armó leyendo el HTML real de cada diapositiva/pop-up (no adivinado),
agrupando términos que se explican en la MISMA diapositiva (ej. los 3
"Peligro biológico/físico/químico" → la diapositiva "Contaminación",
donde viven los 3 pop-ups que los explican) — visitar esa diapositiva
una vez desbloquea los 3 de un saque, y el toast lo dice ("Desbloqueaste
3 términos") en vez de listarlos uno por uno.

Verificado con Playwright (`seguridad-alimentaria/tools/tests/
check-glosario-flow.mjs`, nuevo test de contenido — no es genérico,
queda en el curso): los 26 términos arrancan bloqueados; buscar el
texto de un término bloqueado no lo encuentra; clic en un término
navega a su diapositiva y cierra el glosario; visitar esa diapositiva
lo desbloquea Y dispara el toast; reabrir el glosario ya lo muestra sin
candado, con su definición real, y ahora sí aparece en la búsqueda.

---

## 6.53 Auditoría del sistema de puntos a pedido del cliente: un `award()` sin guard persistido en una actividad reintentable es puntaje infinito (curso, no kit)

Pedido directo del cliente sobre "Seguridad alimentaria": revisar que
el sistema de puntos y los 3 umbrales de medalla (bronce/plata/oro)
"funcionen bien y tengan lógica correcta". Auditoría completa de TODAS
las fuentes de puntos del curso (`award()` en cada una) contra su
mecanismo de guard:

| Fuente | Guard antes de `award()` |
|---|---|
| 3 peligros + 2 fichas de limpieza (`estado.peligros`) | ✓ `if (estado.peligros[id]) return;` |
| 4 carruseles/pestañas (`estado.swaps`) | ✓ `if (!estado.swaps[id][i]) {...}` |
| Alteración (`estado.alteracion`) | ✓ flag booleano revisado antes |
| Video del proceso (`estado.video`) | ✓ vía `seen`/`markSeen` de `initInlineCircleVideos` |
| Repaso rápido (`estado.repaso`) | ✓ `if (acerto && !estado.repaso[id])` |
| Bonus "encontró las 6" del minijuego (`estado.juegoPerfecto`) | ✓ `if (gano && !estado.juegoPerfecto)` |
| **Hallazgo individual del minijuego** (30 pts c/u) | **✗ ninguno — bug real** |

**El bug real**: `responder()` llamaba `award(PUNTOS.hallazgo, ...)`
directo, sin mirar nada persistido — solo `mj.hallados` (el mapa del
INTENTO actual, que `empezar()` resetea entero en cada partida nueva).
El curso permite reintentar el minijuego sin límite ("podés
reintentarlo las veces que quieras", texto real de "Ayuda") — así que
cada reintento volvía a sumar 30 puntos por CADA hallazgo, aunque ya se
hubiera encontrado y premiado en un intento anterior. Con 2-3
reintentos alcanzaba para superar el umbral de oro sin haber recorrido
el resto del curso, rompiendo por completo el techo de puntaje
(`PUNTOS_MAX`) y el sentido de los 3 umbrales.

**Por qué no se había visto antes**: es el ÚNICO punto de premio de
todo el curso que vive dentro de una actividad diseñada para
reintentarse. Las 6 fuentes restantes son todas "se hace una vez y
queda hecho" (abrir un pop-up, ver un video, acertar una pregunta) —
ahí `estado.<algo>[id]` alcanza sola como guard porque nunca hay un
segundo intento del mismo ítem. El minijuego es la excepción: el mismo
hallazgo puede "sucederle" al alumno más de una vez en la vida del
curso, y necesita su PROPIO flag persistido, distinto del estado
efímero del intento en curso.

**Fix** (curso, no kit — `estado.juegoAciertos`, mismo patrón que
`estado.peligros`): un mapa persistido de "hallazgos ya premiados
alguna vez", separado de `mj.hallados` (que sigue reseteándose cada
intento, porque SÍ necesita reiniciarse para la lógica de juego —
`disabled`, clases `.is-ok`, cuándo termina la partida). `responder()`
solo llama `award()` si el hallazgo no está en `estado.juegoAciertos`
todavía. Verificado con un test nuevo que juega, pierde a propósito,
reintentra y confirma que re-encontrar los mismos hallazgos no suma
puntos — solo un hallazgo genuinamente nuevo sigue sumando.

**Regla nueva para el checklist de cualquier curso futuro (§7)**:
**toda actividad que el curso deja REINTENTAR (no solo "hacer una
vez") necesita que su premio por ítem individual se guarde en un flag
persistido, independiente del estado efímero del intento actual** — no
alcanza con revisar "¿tiene guard?", hay que revisar específicamente
"¿ese guard sobrevive a un reintento, o vive en una variable que se
resetea junto con la partida?". Cualquier minijuego/práctica/quiz que
permita repetir intentos en cursos futuros debe auditarse con esta
pregunta antes de dar el sistema de puntos por terminado.

**De paso, confirmado correcto (no hacía falta tocar nada)**: con el
fix aplicado, el piso garantizado de quien completa el gate coincide
EXACTO con el umbral de bronce (mismo diseño de §6.10.6: nadie que
termine el curso siguiendo el gate se queda sin medalla), los 3
umbrales quedan espaciados en incrementos parejos dentro del rango de
puntos "extra" que da el contenido opcional, y `medallaDe()`/
`pintarMedalla()` (kit, `coto-cierre.js`) ya tienen el fix de §6.45 (no
dan medalla de consuelo por debajo del piso, ordenan una copia del
array antes de decidir). Único detalle cosmético, no un bug: el
subtítulo dice "el máximo posible del curso" también cuando se alcanza
el umbral de la medalla más alta sin llegar al puntaje máximo literal
— la palabra "máximo" ahí se refiere a "no hay nivel siguiente", no a
"puntaje perfecto". No se tocó (es de kit, afecta a todos los cursos,
y es una imprecisión de redacción menor, no un error de cálculo) —
queda anotado por si vale la pena aclarar la frase en una vuelta futura.

---

## 6.54 Auditoría de locuciones a pedido del cliente: un video de fondo compitiendo con la voz, y la prioridad de voz pasa a ser latina/argentina antes que la de EE.UU. (kit-base v1.9.30)

Pedido explícito del cliente: "revisemos cómo funcionan las locuciones
en este curso y en los cursos en general". Se auditó `narrador.js`
completo contra las reglas ya documentadas (§5, §6.5, §6.7,
§6.10.1) y contra el cableado real de `curso.js` — el minijuego, el
repaso rápido y los hotspots ya cumplían la regla de "narrar solo lo
nuevo, nunca repetir la consigna fija" (§6.5). Dos hallazgos reales.

**1 · Bug real: las 4 diapositivas de video de fondo tenían un `<p>`
narrable, y nada las excluía.** Portada + los 3 separadores de unidad
(`.d-shot-slide--bg-video`) traen un `<p>` real dentro de su
`.sr-only` ("Arranca la Unidad 1..."). `speakSlide()` lo lee igual que
cualquier párrafo — así que al entrar arrancaban DOS audios a la vez:
la locución leyendo esa frase y el video reproduciéndose con su propio
sonido (normalmente sin bloqueo de autoplay, porque el gesto de
"Siguiente" que llevó hasta ahí ya cuenta como interacción del
usuario para el navegador). Es exactamente lo que CLAUDE.md §5 prohíbe
("una diapositiva que ES un video no se narra... narrar encima sería
contraproducente") — pero esa regla vivía solo como convención de
contenido (no poner un `<p>` narrable ahí), nunca aplicada por código.
Los otros 4 patrones de video del kit (`initVideoPlayer`,
`initPopupVideos`, `initLayerVideos`, `initInlineCircleVideos`) sí
cortan la locución antes de reproducir (`Narrador.cancel()`) —
`initBgVideos` era el único que no, porque nunca se pensó que fuera a
convivir con un párrafo narrable.

Fix a la raíz, en `textOf()` (`js/narrador.js`), no en cada curso: una
diapositiva `.d-shot-slide--bg-video` devuelve `''` al nivel de "toda
la diapositiva" (la llamada de `speakSlide`) — su `.sr-only` sigue
íntegro para un lector de pantalla real, que no pasa por `textOf()`.
Un pop-up abierto DESDE una diapo de video sigue narrando normal (el
`container` ahí es el pop-up, no la `<section>`). Además,
`initBgVideos()` (`js/coto-media.js`) suma `Narrador.cancel()` antes de
reproducir, como cinturón extra — mismo criterio que los otros 4
patrones. Verificado con Playwright
(`seguridad-alimentaria/tools/tests/check-narracion-video.mjs`, nuevo
test de contenido): `textOf()` da `''` en las 4 diapos de video y texto
real en una diapo normal; un spy sobre `speechSynthesis.speak()`
confirma que nunca se llama al entrar a un separador de unidad. Se
verificó también que el test detecta el bug real revirtiendo el fix a
propósito antes de confirmar el resultado final.

**2 · Pedido de producto: la voz preferida pasa a ser
argentina/latinoamericana, con la de Estados Unidos como respaldo, no
como default.** Hasta ahora `pickVoice()` (fuera de tablet) probaba
primero "Google español de Estados Unidos" (es-US, la que el cliente
había elegido probando voces en una vuelta anterior, §6.7) y recién
si no estaba cae en la cadena por región (es-AR → es-419 → es-UY →
es-CL → es-MX → cualquier es-*). El cliente pidió invertir esa
prioridad: preferir una voz argentina o latinoamericana, y usar la de
EE.UU. solo si el dispositivo no tiene ninguna de esas.

Se investigó qué tan realista es prometer una voz "es-AR" específica
por navegador antes de tocar código — conclusión: **no conviene
hardcodear nombres de voz por navegador/SO**, porque el catálogo
depende del paquete de idioma instalado en CADA dispositivo, no del
navegador — un nombre que hoy existe en una versión de Windows/Android
puede no estar en otra. Lo estable es buscar por **código de idioma**
(`es-AR`, `es-419`...), que es exactamente el mecanismo que la cadena
de respaldo YA usaba — el cambio real es de ORDEN, no de mecanismo
nuevo.

Fix: la cadena de tiers pasa de `[es-AR, es-419, es-UY, es-CL, es-MX,
es-*]` (corriendo DESPUÉS de es-US) a `[es-AR, es-419, es-US, es-UY,
es-CL, es-MX, es-*]` — es-US se corre adentro de la MISMA cadena, ya no
tiene un chequeo aparte antes de ella. Dentro del nivel es-US puntual
se sigue prefiriendo la marca "Google" (el matiz de §6.7) por sobre
cualquier otra es-US genérica. El caso tablet (Paulina es-MX / Mónica
es-ES, probado a mano en un iPad real) queda intacto — ya cumplía
"latina" con Paulina, y es una preferencia ya validada con el
cliente, no algo a tocar sin pedido explícito. Verificado con
Playwright inyectando catálogos de voces falsos vía
`speechSynthesis.getVoices()`: con es-AR disponible gana es-AR; sin
es-AR/es-419 cae en la Google es-US de siempre (nunca en silencio, ni
en una voz peor que antes); en tablet con Paulina disponible sigue
ganando Paulina sin cambios.

**3 · Pedido de seguimiento, mismo día: el título horneado en el arte
SÍ debe narrarse — opt-in por curso, no cambio de default (kit-base
v1.9.31).** El cliente confirmó que el título de cada diapositiva
(la píldora del arte, ej. "Alteración", "Temperatura alimentaria") es
el MISMO texto que el `<h2 data-slide-title>` de accesibilidad — y que
en ESTE curso lo quiere escuchado antes del cuerpo, algo que
`textOf()` excluye por default desde una decisión de OTRO cliente
("Surtido sin venta", CLAUDE.md §5: "sonaba redundante"). En vez de
pisar ese default para todos los cursos, se sumó un opt-in nuevo:
`Narrador.setNarrateTitles(bool)` (default `false`, sin cambiar nada
para ningún curso existente) — `textOf()` deja de excluir
`[data-slide-title]` cuando está prendido. Este curso lo activa en
`curso.js`, una línea, al lado de `addFixes()`. El orden queda
correcto sin código extra: el `<h2>` ya es el primer hijo de la
`<section>` en el marcado, así que sale primero en `textOf()` por
orden de DOM, igual que cualquier diapositiva normal. No afecta al
glosario (sigue acotado a `[data-narrate-only]`, nunca la lista
completa) ni a las diapositivas de video de fondo (el fix del punto 1
de esta misma sección corta ANTES de llegar a este filtro). Verificado
con Playwright (`check-narracion-titulos.mjs`): el texto narrado de
una diapositiva normal ahora empieza con su título exacto; una diapo
de video sigue en silencio; el glosario sigue narrando solo la frase
de entrada.

**4 · Pedido de seguimiento: la grilla de tips de "Ayuda" quedaba
muda — bug real de KIT, no de este curso (kit-base v1.9.32).** Se
auditó qué narra y qué no cada pop-up del curso comparando la salida
real de `textOf()` contra lo que se ve en pantalla. Dos hallazgos:

- **"Cómo recorrer el curso" no narra nada** (todo su texto vive en
  `h3`/`div`/`b`/`span`, ninguno de los tags que `textOf()` lee).
  Consultado con el cliente — decisión explícita: se deja mudo, es
  contenido visual/skimmable, no hace falta narrarlo.
- **"Ayuda" narraba 6 de 9 piezas de contenido reales**: sí leía el
  párrafo de navegación y las 5 notas, pero se saltaba por completo la
  grilla de 3 tips (Tarjetas y flechas / Video / Mini juego). Causa:
  `.d-instr-item` (`coto-base-addendum-v1.8.css` — el patrón GENÉRICO
  del kit para esta grilla, no algo propio de este curso) guarda su
  texto en `span > small`, y ninguno de los dos estaba en `TEXT_SEL`.
  Como es un componente del boilerplate, el gap existe en CUALQUIER
  curso que use el panel de "Ayuda" tal cual viene, no solo acá.

  Fix: `.d-instr-item` sumado a `TEXT_SEL`. Con el mismo cuidado del
  bug 3 original de `textOf()` (`.d-q-num` pegado al enunciado): el
  título y la nota de cada tip van sin espacio en el DOM (los separa
  el CSS), así que sin más se narraba el título y la nota pegados como
  una sola palabra — mismo patrón de fix, clonar el nodo y anteponer
  un punto y espacio a cada nota antes de leer el texto, nunca tocar el
  DOM real. Verificado con Playwright (`check-narracion-ayuda.mjs`):
  los 3 tips narran separados correctamente, "Cómo recorrer el curso"
  sigue mudo.

**5 · Pedido explícito: auditoría completa de "lee correctamente y en
orden", con eso como regla permanente (no una revisión puntual)
(kit-base v1.9.33).** El cliente pidió verificar que TODAS las
diapositivas se narren bien y en orden, con un ejemplo concreto: "las
preguntas ¿las lee como preguntas?". Auditando el repaso rápido
(`resumen1/2/3`) con la misma técnica (leer la salida REAL de
`textOf()`, no asumir por el marcado) apareció un bug real, más grave
que los anteriores porque **revela contenido antes de tiempo**:

- **Las 2 preguntas de repaso se narraban SEGUIDAS al entrar a la
  diapositiva**, aunque el widget solo muestra una por vez. Causa:
  `.d-repaso-item{display:none}` (`assets.css`, curso) esconde las
  preguntas que no son la actual con una clase CSS — pero
  `Narrador.textOf()` solo sabe filtrar por el atributo `hidden` real
  (`!n.closest('[hidden]')`), nunca miró `display:none` de una clase.
  Un alumno escuchando (sin mirar la pantalla) se enteraba de la
  pregunta 2 antes de haber contestado la 1. Fix, en el curso (esto es
  un widget propio, `initRepasoRapido`, no del kit): `mostrar(i)` ahora
  ADEMÁS pone `hidden` real en cada `.d-repaso-item` que no es la
  actual — la ocultación visual y la de narración pasan a ser la MISMA
  garantía, no dos mecanismos separados que hay que mantener
  sincronizados a mano.
- **Las preguntas se narraban como afirmación lisa, sin avisar que hay
  que elegir Verdadero o Falso** — esa parte solo se veía (los
  botones), nunca se escuchaba. El cliente confirmó que sí quiere el
  aviso por voz. Fix genérico de kit, no un parche puntual: nuevo
  atributo `[data-narrate-prefix="..."]` en `textOf()` — cualquier nodo
  narrado puede pedir un prefijo hablado sin tocar su texto visible
  (mismo espíritu que `speechify()`: nunca se toca el `alt`/texto
  accesible, solo lo que se dice de más). El curso lo usa en las 6
  `<p class="d-repaso-q">` (`data-narrate-prefix="Verdadero o
  falso"`) — cualquier curso futuro con el mismo patrón de pregunta
  V/F hereda el mecanismo gratis, solo pone el atributo.

**La "regla permanente" que pidió el cliente**, no una revisión
puntual: `tools/tests/check-narracion-completa.mjs` (nuevo, test de
CONTENIDO — el método es genérico pero las aserciones puntuales son de
este curso). Recorre las 26 diapositivas, para cada una compara la
salida real de `Narrador.textOf()` contra 3 reglas: (1) las 4 de video
de fondo narran `''`, el resto no narra vacío; (2) con
`setNarrateTitles` prendido, el texto tiene que EMPEZAR con el título
exacto de la diapositiva — así "narra en orden" queda verificable, no
solo "narra algo"; (3) un heurístico genérico (minúscula pegada
directo a mayúscula, sin espacio ni punto) detecta cualquier texto
"corrido" — la misma firma que ya dieron 3 bugs reales distintos
(`.d-q-num`, los tips de "Ayuda", y este). Más una aserción específica
del repaso rápido: exactamente una pregunta con el prefijo "Verdadero
o falso:" por diapositiva de resumen, nunca cero ni dos. Verificado
revirtiendo cada fix a propósito antes de confirmar el resultado
final — el test lo detecta.

**Patrón para el próximo curso** (vale la pena copiarlo, no reinventar
la auditoría cada vez): si un curso tiene widgets propios con estado
"solo uno visible a la vez" (repaso, pasos, tabs armados a mano en
HTML real en vez de por swap de imagen), verificar explícitamente que
la ocultación use el atributo `hidden` real y no solo una clase CSS —
es exactamente el mismo tipo de bug, en espíritu, que el `[hidden]`
que ya usa el resto del kit en todos lados (paneles de capas, pop-ups,
gates) para la MISMA garantía doble (visual + narración).

**6 · El pedido "que sea clara, ordenada, con sentido" encontró el bug
más frecuente de toda la auditoría: el título dicho DOS VECES seguidas
en 6 de las 26 diapositivas (kit-base v1.9.34).** No alcanzaba con
chequear estructura (título presente, en orden, sin palabras pegadas)
— hubo que efectivamente LEER las 26 salidas de `textOf()` de punta a
punta para encontrarlo. Causa: varios párrafos de este curso ya
abrían anunciando el tema en palabras ("Introducción. En COTO
trabajamos...", "Objetivos de aprendizaje. A: Identificar...") — se
escribieron así en una época en que ningún título se narraba (§6.54
puntos 1-3 son de ESTA misma vuelta, el título recién se prendió acá
mismo), así que el propio texto hacía ese trabajo. Prender
`setNarrateTitles` no le avisó a esos párrafos que ya no hacía falta,
y quedó sonando "Introducción. Introducción. En COTO trabajamos...".
Otros 20 de los 26 no tenían este problema (sus párrafos ya arrancaban
directo con contenido real, sin restatear el tema) — el bug no es
sistemático del molde, depende de cómo se redactó cada `.sr-only`.

Fix genérico en `textOf()` (`js/narrador.js`), no un parche por
diapositiva: si el primer fragmento narrado es el título Y el
fragmento siguiente ARRANCA repitiendo ese mismo texto como su propia
primera oración, se recorta esa apertura duplicada — nunca el título
en sí, nunca el texto visible (CLAUDE.md §5), solo lo que se dice de
más. La comparación es tolerante a la puntuación de apertura/cierre
(¡¿.!?) para que funcione igual con un título que termina en "!" o "?"
que con uno que termina en nada. Diapositivas sin esta redundancia
quedan intactas — la comparación simplemente no encuentra coincidencia
y no recorta nada (verificado con un diff completo de las 26 salidas
antes/después del fix: SOLO las 6 afectadas cambiaron, byte por byte
iguales en las otras 20 y en los 12 pop-ups auditados).

`check-narracion-completa.mjs` suma esta 4ª regla (además de las 3 de
§6.54 punto 5): el texto que sigue al título, después de sacarle el
punto/espacio, nunca puede volver a empezar con el título mismo.
Verificado revirtiendo el fix a propósito: el test detecta las 6
diapositivas afectadas, una por una.

---

## 6.55 Controles de audio "cool": barra de volumen + línea de tiempo de locución, con popovers que se posicionan dinámicamente en vez de anclar por breakpoint (kit-base v1.9.35)

Pedido explícito del cliente sobre "Seguridad alimentaria" a partir de
una captura de los botones "Sonido"/"Locución" del header: al de
Sonido, sumarle una barra para subir/bajar el volumen; al de Locución,
una línea de tiempo pequeña que muestre por qué frase va la narración,
permita arrastrar para saltar, y repetirla — "algo muy cool", con las
opciones desplegándose al pasar el mouse sobre cada botón. Antes de
tocar código se armó un mockup HTML aislado (mismos tokens/CSS reales
del kit) y se mostró con capturas de Playwright — aprobado explícito
("sisi me re gusta") antes de escribir el HTML/CSS/JS real del curso,
siguiendo el proceso fijado en §6.40. Al terminar, el cliente pidió
también verificar mobile ("fijate de que no se rompa nada, y ajustarlo
para mobile como siempre") — eso encontró el bug real de kit que se
documenta abajo.

**1 · Volumen (`#d-sound`).** `initSoundToggle()` (kit,
`coto-player.js`) suma un slider 0-100% + botón de mute propio +
ecualizador decorativo de 10 barras, con un `localStorage` nuevo
(`coto-diapos-volume`, string float 0-1) al lado del `coto-diapos-mute`
ya existente. `efectivoMudo()` (`muted || volume <= 0`) es la única
verdad para el ícono/estado — `muted` y `volume` se persisten por
separado, pero mover el slider por encima de 0 estando muteado
desmutea solo (comportamiento esperado de cualquier control de volumen
real). El volumen se aplica en 3 lugares que antes solo miraban
`muted()`:
- **Video** (`coto-media.js`): `v.volume = volumeLevel()` junto a
  `v.muted` en los 4 puntos de reproducción de los 3 patrones (fondo,
  pop-up, círculo inline).
- **Tonos de UI** (`coto-ui.js`/`fx.js`): `volumeLevel()` (mismo
  helper, duplicado en los 3 archivos — criterio ya fijado en el kit
  de que cada archivo es copy-paste autocontenido, no un módulo
  compartido) escala el gain de `tone()`/`uiTone()`; con `vl<=0` se
  corta antes de crear el oscilador.

**2 · Locución (`#d-narrate`).** Requirió reestructurar `narrador.js`:
el `speak()`/`siguiente()` de siempre (closure inline, sin estado
recuperable desde afuera) pasa a un estado de módulo `estadoActual`
(`{trozos, v, rate, kind, index, terminado}` — los fragmentos de
`chunkText`, la voz/velocidad elegidas, y en qué fragmento va) y un
driver único `hablarDesde(i)`, que emite un evento
`narracionprogreso` en `document` en cada arranque/fin de fragmento.
Nuevo en `Narrador`: `seek(i)` (salta y arranca desde ahí, solo si hay
narración activa), `repeat()` (= `seek(0)`, funciona también DESPUÉS
de que la narración terminó — `cancel()` marca `terminado:true` pero
nunca borra `estadoActual`, justamente para que "Repetir" lo siga
usando) y `progreso()` (`{index, total, terminado}` o `null`). La
línea de tiempo del panel (`initNarrateTimeline()`, `coto-player.js`)
es un `<input type=range>` que refleja `progreso()` en vivo.

**Deliberadamente a nivel de FRASE/fragmento, no de palabra** — se le
comunicó al cliente antes de implementar y lo aceptó: Web Speech API
no da progreso intra-utterance confiable, sobre todo con las voces de
red (Google/Microsoft online) que el kit ya prioriza (§6.7/§6.54) —
prometer una línea de tiempo palabra-por-palabra hubiera sido una
promesa que la API no puede cumplir de forma estable entre
dispositivos/navegadores.

**3 · Bug real de kit encontrado en la verificación de mobile: anclar
el popover por breakpoint fijo asume mal dónde va a estar el botón.**
El primer intento fijaba el panel centrado en desktop y anclado al
borde DERECHO en `@media(max-width:480px)` — asumiendo que el grupo de
botones de audio se mantiene cerca del borde derecho de la pantalla en
cualquier ancho. Falso: el layout de 2 filas YA EXISTENTE del header
(§6.6, `≤799px`) mueve `.d-top-group--audio` a
`grid-row:2;justify-self:start` — el costado IZQUIERDO. Con el botón
ya cerca del borde izquierdo, un panel anclado a la derecha se salía
del viewport por completo (medido con Playwright en 390px de ancho:
`left:-150px` en el panel de volumen, `left:-108px` en el de
locución — el equivalente táctil del "grid blowout" que ya costó una
vuelta entera en §6.15, mismo tipo de error: asumir una posición fija
del chrome sin medirla contra el layout real en ese ancho).

Fix real, sin depender de ningún breakpoint: `initAudioPopovers()`
(kit, `coto-player.js`) mide la posición REAL del botón
(`getBoundingClientRect()`) en cada apertura —
`click`/`mouseenter`/`focusin`, más `resize` mientras el panel esté
`.is-open` (el caso táctil/rotación, el más propenso a necesitar
recalcular) — y fija un `left` inline clampeado a
`[8px, viewport - ancho del panel - 8px]`, con una variable CSS
(`--flecha-left`) para que la flechita del panel (`.d-audio-pop::before`)
siga apuntando al centro real del botón aunque el panel se haya
corrido para entrar en pantalla. El CSS (`left:50%;
transform:translateX(-50%)`) queda como fallback SOLO para el caso sin
JS — nunca vuelve a asumir en qué breakpoint o lado de la pantalla va
a estar el botón, así que sigue funcionando aunque el layout del
header cambie de nuevo en el futuro (otro breakpoint, otro orden de
grupos) sin que este componente necesite tocarse.

**Lección general, en la misma línea que §6.15/§7.3 punto 11**: cualquier
elemento de UI cuya posición en pantalla puede cambiar entre
breakpoints (por un layout de grid/flex que ya reordena cosas, como
este header) no debería recibir un segundo elemento (un popover, un
tooltip) anclado con una posición fija asumida para "el otro"
breakpoint — hay que medir la posición real en el momento de mostrarlo,
o el popover hereda el mismo bug de "se ve bien en desktop, se rompe en
mobile" que ya costó dos vueltas distintas en este kit por razones
parecidas.

**4 · Pitfall de testing en este sandbox, documentado para reusar.**
El Chromium de Playwright acá no tiene backend de audio real —
`speechSynthesis` resuelve los fragmentos casi instantáneo, así que un
test que espera con `waitForTimeout()` y saca una foto del estado
nunca alcanza a ver "a mitad de la narración" (siempre ve el estado
final). Patrón que sí funciona, para cualquier test de narración
futuro: registrar el listener de `narracionprogreso` ANTES de llamar
`speak()`, juntar la secuencia COMPLETA de eventos en un array
resuelto por `Promise` (con un `setTimeout` de red de seguridad), y
afirmar sobre la secuencia/orden entera en vez de una foto en un
instante — el mismo problema, en espíritu, que ya documentó §6.34 para
bugs visuales que un test estructural no puede ver: acá el problema es
de TIMING, no de estructura, y la solución es capturar la secuencia
completa en vez de adivinar cuándo mirar.

**Tests nuevos, curso** (no genéricos — quedan en
`seguridad-alimentaria/tools/tests/`, no en el kit):
`check-controles-audio.mjs` (slider, mute, secuencia completa de
`narracionprogreso`, `seek`/`repeat`, estado inicial deshabilitado) y
`check-controles-audio-mobile.mjs` (viewport táctil real 390×844,
`isMobile:true`/`hasTouch:true`: tap abre/cambia/cierra el panel
correcto, el panel nunca se sale del viewport, el slider sigue siendo
arrastrable con drag táctil nativo).

---

## 6.56 Revisión general a pedido del cliente sobre "Seguridad alimentaria" — recorrido visual completo, 0 bugs reales encontrados, y 1 limitación de diseño preexistente que queda documentada (no corregida sin pedido)

Pedido abierto ("pegale una buena revisada a todo"), sin síntoma
puntual — mismo criterio de §6.34: un pedido de "revisión general" se
responde con un barrido visual completo con capturas, no solo con la
suite automatizada (los 7 tests genéricos + los 8 propios ya venían en
verde antes de empezar). Se recorrieron con Playwright las 26
diapositivas completas, sus pop-ups internos, los 4 pop-ups genéricos
del header (índice, glosario, ayuda, logros), las dos rutas completas
del minijuego (aprobado y a reintentar, incluida la pantalla de repaso
de partida y el reset real al tocar "Reintentar"), el resumen final +
"Mis logros" + la pantalla de salida, y un pase en viewport móvil real
(390×844, header/minijuego/glosario/índice).

**Resultado: cero bugs reales.** Cada cosa que a primera vista parecía
un hallazgo se investigó hasta la causa y resultó ser diseño intencional
ya documentado, o un artefacto del propio script de revisión — vale la
pena dejar registrado el descarte, porque cada uno es el mismo tipo de
señal que en rondas anteriores SÍ resultó ser un bug real, y conviene
que quien audite después sepa que ya se revisó y por qué se descartó:

1. **El video placeholder de "El proceso de limpieza y desinfección" se
   ve con un póster con textura repetida y una barra de controles
   dibujada.** Es el placeholder genérico (el `.mp4` real todavía no lo
   subió el cliente, mismo patrón de §3.9) — no es el arte final ni un
   glitch. Confirmado extrayendo el `.webp` del póster directo (sin
   pasar por el navegador): la textura y la barra "de mentira" ya están
   horneadas en el archivo.
2. **El panel "Puntos" del minijuego arranca en 1000, no en 0.** Es
   `MJ_BASE = 1000`, documentado en el propio código
   ("puntaje interno inicial, lo dibuja el PDF") — el minijuego usa un
   presupuesto que sube con cada acierto (+800) y baja con cada error
   (−150), no un contador que arranca en cero. Partida perfecta:
   1000 + 6×800 = 5800, exacto al número que mostró la corrida real.
3. **El pop-up de "Reglas del mini juego" tiene 2 íconos "¡" y formas
   decorativas en las 4 esquinas que a simple vista parecen un glitch
   de posicionamiento.** Es el arte del diseñador tal cual
   (`img/pop-reglas-minijuego.webp`, patrón `.modal-card--art` de
   §6.45) — confirmado extrayendo el PNG con su alfa real: las formas
   están dibujadas ahí, no las agrega ningún CSS.
4. **"Peligro biológico/físico/químico" aparecen en el glosario en una
   sección aparte ("Los 3 peligros, de un vistazo") separada de la
   lista alfabética completa.** Es contenido curado a propósito
   (`h4.d-glossary-sub` distinto), no una duplicación — verificado que
   NO vuelven a aparecer en "Términos, de la A a la Z" (grep sobre el
   bloque completo del glosario, un solo `<dt>` por término en todo el
   archivo).
5. **Un párrafo del pop-up "Ayuda" se veía notablemente más transparente
   que los de arriba en una captura.** Es la animación `.d-stagger-in`
   de siempre (§6.11) atrapada a mitad de camino porque la captura se
   tomó a los 400ms de abrir el pop-up — con `animation-delay` de hasta
   0.49s + 0.38s de duración, el último párrafo no termina de entrar
   hasta los ~870ms. Confirmado re-midiendo `opacity` a los 3s: los 5
   párrafos en `1`. Error del script de revisión (esperó poco), no del
   curso — pero deja la lección para cualquier captura futura de un
   pop-up recién abierto: esperar al menos ~1s si tiene contenido con
   `.d-stagger-in`, no solo el tiempo de apertura del modal.

**Lo único real que apareció, y por qué NO se tocó sin consultar:**
en un viewport de **teléfono en vertical** (390×844, portrait), el
lienzo de la diapositiva (`.d-shot`, fijo a la proporción 2:1 del
diseño — §2.6/§2.7) queda como una franja horizontal angosta centrada
verticalmente, con una franja vacía enorme arriba y abajo — el
contenido se ve, pero ocupa una fracción chica de la pantalla. **No es
una regresión de esta ronda ni de ninguna anterior**: es la
consecuencia esperada y ya documentada del lienzo fijo 2:1 en
proporciones lejos de esa relación (§6.9 — "por debajo de esa
proporción [protegida por el margen de diseño] el lienzo vuelve al
modo fijo con letterbox"), aplicada a un caso más extremo que los que
el kit prueba hoy. **La suite del kit nunca probó este caso**:
`scroll-audit.mjs` llega hasta "768×1024 (iPad chico vertical)" como
el viewport angosto más extremo — un teléfono en vertical (~375-430px
de ancho) nunca estuvo en la lista, y todo el diseño de este molde
(§0, "proporción panorámica fija") asume uso desktop/tablet, coherente
con que el cliente (colaboradores de sucursal accediendo desde una
notebook/tablet de trabajo) probablemente nunca lo vea así. Se decidió
**dejarlo documentado en vez de "corregirlo" unilateralmente**: la
corrección real (¿pedirle al alumno que rote el teléfono? ¿ampliar el
rango de proporciones que llenan pantalla completa más allá de lo que
el margen de seguridad del PDF permite recortar sin seguridad, §6.9?)
es una decisión de producto, no un bug de código — igual que cada vez
que este documento distingue explícitamente entre "hallazgo real" y
"decisión que hay que consultar" (§6.17, §6.44 punto 5, etc.).

**Regla nueva para el checklist de revisión (complementa §7.3 punto
11):** cuando se prueba un curso en viewport móvil real, probar
también el caso PORTRAIT angosto de teléfono (no solo el táctil
genérico de 390×844 que ya usan los tests de controles de audio) contra
el LIENZO PRINCIPAL de las diapositivas, no solo contra popovers/pop-ups
sueltos — un componente flotante (popover, drawer) puede pasar
perfecto en ese viewport mientras el lienzo 2:1 de fondo se reduce a
una franja — son dos preguntas distintas y hay que probarlas por
separado.

---

## 6.57 "Ayuda" deja de mezclar instructivo con configuración: dos botones flotantes, con valor agregado real (kit-base v1.9.36)

Pedido explícito del cliente sobre "Seguridad alimentaria": el botón
"Ayuda" del header en realidad mezclaba dos cosas distintas —
instructivo (navegación, atajos, avisos) y configuración real
(selector de voz + velocidad, escondidos adentro del mismo pop-up
desde que existen). Pidió separarlos en dos botones (Ayuda /
Configuración), bajarlos del header a **flotantes discretos, apilados
abajo a la derecha**, con estilo "pop-up" en vez de drawer — y, en una
segunda vuelta, que cada uno sume **valor real**, no solo el contenido
reubicado. Aprobado con mockup (dos rondas: una versión inicial simple,
descartada por pedido explícito de "más pro, más interactivo"; la
versión final con acordeón + reabrir intro + escuchar ejemplo +
restablecer, sí aprobada) antes de tocar código, siguiendo el proceso
fijo de §6.40.

**1 · Mecanismo**: `[data-fab-stack]` con dos `[data-fab-ctl]`
(`"config"` y `"ayuda"`), cableado por `initFabPopovers()`
(`coto-player.js`) — mismo criterio "pinned" que `initAudioPopovers`
(hover/foco en desktop, clic fijo en táctil, CLAUDE.md §6.10.1 regla
2). A diferencia de `initAudioPopovers`, **no necesita posicionamiento
dinámico por JS**: el anclaje es siempre abajo a la derecha (nunca se
mueve entre breakpoints como el grupo de audio, §6.55), así que un
`max-width` en CSS alcanza para no salirse en mobile. `position:fixed`
contra el viewport, mismo criterio que `.d-award-toast`/`.d-resume`
(ya en `coto-player-chrome.css`) — nunca dentro de `.d-stage`, que
recorta con `overflow:hidden`.

**2 · Contenido movido, sin reescribir**: el instructivo (nav +
`.d-instr-grid` de 3 tips) y el selector de voz/velocidad
(`d-voice-field`/`d-rate-field`, IDs intactos — los sigue leyendo
`initVoicePicker`/`initRatePicker` sin cambios) pasaron tal cual del
viejo drawer `[data-popup="ayuda"]` (que se borró) a sus popovers
nuevos. Los 5 avisos sueltos (`.d-instr-note`) se reorganizaron como
**acordeón de preguntas frecuentes** (`[data-fab-acc]`, una pregunta
abierta a la vez) — mismo contenido, formato más interactivo.

**3 · Valor agregado real, no solo reubicación** (2ª vuelta, pedido
explícito tras rechazar una primera propuesta más floja — "dame
mejores opciones"):
- **"Volver a ver la introducción"** (`.d-fab-replay`,
  `data-popup-trigger="instrucciones"`): el pop-up "Cómo recorrer el
  curso" se ve UNA sola vez (`data-gate-popup` en la diapositiva de
  índice, §6.12/§6.36) — si el alumno lo cerró sin querer, antes no
  había forma de recuperarlo. El motor ya sabe abrir cualquier
  `[data-popup]` vía `data-popup-trigger`, así que no hizo falta JS de
  navegación nuevo — `initFabPopovers()` solo cierra el propio
  flotante de Ayuda al tocarlo, para que no quede "pinned" abierto
  detrás del modal.
- **"Escuchar un ejemplo"** (`#d-voice-listen`, dentro de
  `initVoicePicker`): reproduce la MISMA frase de prueba que ya sonaba
  sola al cambiar de voz en el `<select>` — pero a demanda, sin tener
  que tocar el selector. Cubre el caso real de querer re-escuchar la
  voz YA elegida (por ejemplo, la primera vez que se abre el panel,
  antes de cambiar nada).
- **"Restablecer a los valores recomendados"** (`#d-config-reset`,
  `initConfigReset()`): en vez de duplicar la lógica de
  `setManualVoice`/`setRateFactor`, le baja el valor "automático"/`1`
  al `<select>`/`<input range>` y dispara sus propios eventos
  `change`/`input` — reusa exactamente los mismos listeners que ya
  existían, así que el label, la persistencia y el aviso hablado
  quedan iguales que si el alumno lo hubiera tocado a mano. Cero
  camino de código paralelo para el mismo resultado.

**4 · Efectos visuales, con guardas**: aro de color alrededor del
botón que pulsa 2 veces al cargar el curso y se apaga solo (o al
primer clic en cualquiera de los dos botones) — nunca en loop, sería
ruido permanente en vez de un llamado de atención puntual. Hover con
`translateY`+`scale`, el engranaje de Configuración gira al pasar el
mouse, el popover entra con un leve rebote (`cubic-bezier` con
overshoot, mismo lenguaje que el resto del kit — medallas, logros).
Todo corre bajo la regla global de `prefers-reduced-motion` de
`coto-base.css` (`*{animation:none!important}`) — en reposo, sin la
animación, el aro es `opacity:0` (invisible), así que sin movimiento
se ve exactamente igual que "todavía no pulsó", nunca roto.

**5 · Bug real de kit encontrado de paso, sin relación con este
pedido**: `seguridad-alimentaria/index.html` tenía **dos
`<div class="d-app">` anidados sin su segundo cierre** — un
`<div class="d-app">` duplicado justo antes del real, ambos abiertos,
con un solo `</div>` de cierre más abajo (el HTML quedaba mal
balanceado). No se notaba visualmente porque `.d-app` es
`position:fixed` — el div interno (con la MISMA regla `position:fixed`
aplicada a sí mismo) se sale del flujo del grid del externo y listo,
ningún test de los 6 genéricos lo detecta porque ninguno valida
balance de tags, solo comportamiento. Encontrado al tocar exactamente
esa zona del archivo para este cambio. Corregido en el curso — no es
un bug de kit (el `header-boilerplate.html` nunca tuvo la
duplicación), fue un accidente de una edición anterior de este curso
puntual.

**Tests nuevos, curso**: `check-fab-ayuda-config.mjs` (selector de voz
con catálogo falso inyectado vía `addInitScript` — Web Speech API no
tiene voces reales en este sandbox; espía `Narrador.speak` en vez de
ejercitar el motor real, ver nota en el propio test sobre por qué;
persistencia de voz/velocidad; reset; acordeón "una pregunta a la
vez"; "volver a ver la introducción" abre el modal Y cierra el
flotante) y `check-fab-mobile.mjs` (viewport táctil real 390×844: no
se superpone con el footer, el popover nunca se sale del viewport).
`check-narracion-ayuda.mjs` (ya existente, §6.54 punto 4) se actualizó
para apuntar al nuevo selector (`[data-fab-ctl="ayuda"] .d-fab-pop` en
vez de `[data-popup="ayuda"] .modal-card`, que ya no existe) — mismo
contenido, mismas aserciones.

---

## 6.58 Feedback puntual sobre lo entregado en §6.57: 5 correcciones reales, todas de kit salvo los íconos (kit-base v1.9.37)

Ronda de feedback directo sobre los botones flotantes de §6.57 y una
diapositiva vieja (Rotación, §6.51). Los 5 puntos, con su causa real:

**1 · Íconos del índice: la mayoría no representaban su sección**
(reporte del cliente, con razón — auditado uno por uno contra su
`data-goto`). Reutilizar íconos genéricos "porque ya existían en el
sprite" sin pensar el significado dejó casos como `alteracion` con
`i-cursor` (puntero de mouse — cero relación con "un alimento
alterado") o las 3 `unidad1/2/3` compartiendo `i-boxes` con
`envasado` (que sí es packaging de verdad). Corregido en
`seguridad-alimentaria/index.html` — 7 símbolos nuevos en el sprite
(`i-shield`, `i-alert`, `i-clock`, `i-x-circle`, `i-droplet`,
`i-rotate`, `i-layers`, mismo estilo línea/24×24 que el resto) y 9
reasignaciones: `inocuidad`→escudo (coincide con el ícono que ya usa
el propio arte de esa diapositiva), `riesgo`→alerta, `alteracion`→
reloj (la alteración se define por vencimiento/vida útil, no por
"click aquí"), `malas`→prohibido, `limpieza`→gota, `unidad1/2/3`→
capas (dejó de competir con `envasado`), `rotacion`→flechas
circulares (coincide literal con la palabra). De paso, `i-chart-pie`
(único uso: `contaminacion`) tenía una sola línea radial — a ese
tamaño se leía como manecillas de reloj, no como gráfico de torta; se
le sumaron 2 líneas más para que se vea como 3 gajos (biológico/
físico/químico, que es justo lo que esa diapositiva reparte). **Es
contenido de curso, no del kit** — el sprite de íconos vive en cada
`index.html`, no en `header-boilerplate.html`.

**2 · Bug real de kit: los popovers (Sonido/Locución/Ayuda/
Configuración) se cerraban de golpe al cruzar el hueco entre el botón
y el panel.** `.d-audio-pop`/`.d-fab-pop` abren por CSS `:hover` puro
— sin perdón de un solo frame fuera de los dos rectángulos (botón +
popover, con un hueco real de 10-14px entre ambos). Mover el mouse
rápido y en diagonal (el caso real que reportó el cliente) podía salir
de los dos rectángulos a la vez durante esa transición, y el CSS
cerraba al instante. Fix: `attachHoverGrace(el, openClass, delayMs)`
nuevo en `coto-player.js` — JS agrega una clase (`is-hover`) al
`mouseenter` y la saca recién 3s después del `mouseleave`, cancelable
si el mouse vuelve a entrar (al botón O al popover — el listener está
en el contenedor que envuelve a los dos) antes de que venza. El CSS
pasa de `:hover` a `.is-hover` como disparador (`:focus-within` se
queda igual, sin gracia — con teclado no hay "hueco que cruzar", Tab
salta directo). Mismo helper reusado para los 4 popovers —
`initAudioPopovers` e `initFabPopovers` lo llaman igual.

**3 · "1 de 2", "1 de 5" en Locución: pedido explícito de sacarlo —
"como si el sonido tuviese distintas partes".** El conteo de
fragmentos (`chunkText`, narrador.js) es un detalle interno para
resolver el bug del corte de ~15s de Chrome en utterances largas
(CLAUDE.md, narrador.js) — nunca fue pensado como algo que el alumno
tuviera que ver o entender. Mostrarlo ("frase 1 de 5") sí sonaba como
si la narración tuviera "partes" separadas, cuando es un audio
continuo. Sacado: `#d-narr-time` se borró del HTML (curso y
`header-boilerplate.html`) y de `initNarrateTimeline()` — el panel
queda con la barra arrastrable (salta al soltar, no en cada pixel) +
"Repetir", nada más. El conteo interno de fragmentos sigue existiendo
puertas adentro, simplemente ya no se expone.

**4 · El popover de Ayuda se veía "con cosas muy grandes" — bug real
de reutilización de tamaño, no de contenido.** `.d-instr-nav`/
`.d-instr-grid`/`.d-instr-item` (addendum) están pensados para el
drawer ANCHO de "Cómo recorrer el curso" (400px+) — reusados tal cual
dentro de un popover de ~320px (§6.57), el grid de 3 tarjetas
(padding `.9rem`, íconos 28px) apenas entraba, la 3ª tarjeta se caía a
una 2ª fila y el popover necesitaba scroll para mostrar todo. Fix:
overrides scoped a `.d-fab-pop .d-instr-*` en `coto-player-chrome.css`
— padding, íconos e íconos de texto más chicos SOLO dentro de este
popover, sin tocar el tamaño original que sigue siendo correcto en el
drawer/modal donde se usa así desde antes. Con el fix, las 3 tarjetas
+ el botón de reabrir intro + las 5 preguntas del acordeón entran
completas sin scroll en un viewport de escritorio típico.

**5 · Bug real de kit: la barra de "pasos" de Rotación (arrastrable
desde §6.51) todavía saltaba con un clic sin arrastrar de verdad.**
El código de §6.51 ya tenía el `return` que evita que el `click`
salte directo — pero el arrastre en sí (`pointerdown`→`pointermove`→
`pointerup`) llamaba a `go()` en el PRIMER `pointermove`, sin importar
cuánto se hubiera movido el mouse. En la práctica, ningún clic real es
100% inmóvil entre el down y el up (siempre hay 1-2px de temblor de
mano/mouse) — así que CUALQUIER clic terminaba llamando a `go()` de
todas formas, contradiciendo el "solo arrastre" que el propio comentario
del código decía haber resuelto. Fix real: umbral de movimiento
(`UMBRAL_ARRASTRE_PX = 6`) — `pointermove` no llama a `go()` hasta que
el desplazamiento acumulado desde el `pointerdown` supera ese umbral;
por debajo, un clic (con o sin el temblor normal de la mano) no mueve
nada. Una vez cruzado el umbral una vez, el arrastre sigue fluido para
el resto del gesto. **Lección para cualquier interacción "solo
arrastre" futura**: un `return` en el handler de `click` NO alcanza
para bloquear el salto si el mecanismo real de movimiento vive en
`pointermove` — hay que poner el umbral ahí, donde realmente se
decide si hubo arrastre o no.

**Tests nuevos, curso**: `check-popover-hover-gracia.mjs` (hover real
con `page.hover()`, no `click({force:true})` — el force-click no
dispara `mouseleave` de forma realista y da falsos positivos de "se
quedó pegado"; prueba los 4 popovers: abre al entrar, sigue abierto
durante la gracia tras salir, se cierra solo pasados los 3s, y la
gracia se cancela si el mouse entra al popover antes de que venza) y
`check-rotacion-arrastre.mjs` (un clic exacto sin mover no cambia el
paso activo; un arrastre real de >6px sí). `check-fab-ayuda-config.mjs`
(§6.57) no necesitó tocarse — sigue pasando igual, no ejercita hover.

**Nota agregada al verificar mobile (kit-base v1.9.38): el fix del
punto 5 (Rotación solo-arrastre) estaba incompleto en touch.** Auditar
"¿anda bien en mobile?" tras esta entrega (no un reporte del cliente,
sino la verificación de rutina de §7.3 punto 11) encontró que un TAP
táctil simple en un `.d-shot-hit--paso` seguía saltando directo, sin
arrastrar — el guard `e.detail !== 0` que distinguía clic real de
activación por teclado (comentario del punto 5, arriba) resultó
indistinguible en touch: un `click` sintetizado por un tap táctil real
TAMBIÉN trae `detail: 0`, igual que uno de teclado (confirmado
instrumentando el evento con Playwright en viewport táctil real —
`isMobile`/`hasTouch`, no redimensionando la ventana de escritorio).
**Fix real** (`js/coto-media.js`, `initShotSwap`): se reemplaza la
heurística de `e.detail` por una bandera (`pasoPointerVisto`) que el
`pointerdown` deja en `true` — para mouse Y para touch por igual,
porque los dos disparan `pointerdown` antes del `click`, y ninguno de
los dos lo hace la activación por teclado. El `click` handler la lee y
la resetea: si estuvo prendida, hubo un dedo/mouse de por medio y se
bloquea el salto (igual que antes con mouse, ahora también con touch);
si no, es la única vía posible sin puntero — teclado — y se deja
pasar, sin cambios. **Lección general, aplica a cualquier guard
`click`-vs-`teclado` futuro en este molde**: `e.detail` NO es un
sustituto confiable de "¿hubo un puntero real?" — distingue "cuántos
clics seguidos" (pensado para dobles clics), no "de dónde vino este
clic". La señal correcta es la presencia (o ausencia) de un evento de
puntero (`pointerdown`/`pointerup`) inmediatamente antes del `click`.
Nuevo test `check-rotacion-mobile.mjs`, compañero de
`check-rotacion-arrastre.mjs` pero en viewport táctil real: tap simple
no salta, arrastre táctil real sí, Enter/Espacio con foco sigue
saltando igual que siempre.

---

## 6.59 Ronda de "10 mejoras al kit" a pedido del cliente: mobile como parte del diseño (no un parche), y 2 bugs reales de kit encontrados con las herramientas que se acaban de construir (kit-base v1.9.39)

Pedido directo, sin síntoma puntual: "proponeme 10 cosas que hoy el
kit base debería tener y no tenga". Se armó la lista priorizando lo
que el cliente había pedido en el mismo intercambio — mobile pensado
desde el diseño, no auditado al final — y gaps ya señalados en este
documento sin resolver. Las 10 aprobadas ("mandale") e implementadas.

**Regla de proceso nueva, pedida en el mismo intercambio, ANTES de
esta lista — queda registrada acá porque cambia cómo se trabaja de acá
en adelante, no es parte de las 10 mejoras en sí**: "de ahora en
adelante... todo tiene que ser responsive e ir de la mano con mobile...
nuestro producto de curso tiene que estar pensado en su totalidad de
formas y dispositivos" + "vos tenés que adelantarte y prever cosas que
se te puedan pasar... para evitar tantas correcciones a futuro". Ver
§6.10.1 punto 4 (regla fija, ya escrita ahí) — mobile se prueba en la
MISMA vuelta en que se construye, no como auditoría posterior.

**1 · Aviso "Girá tu dispositivo" para portrait angosto.** Resuelve la
limitación que §6.56 había dejado documentada A PROPÓSITO sin
resolver ("es una decisión de producto, no un bug de código"). Con el
pedido explícito de hoy de que el curso sea sólido en cualquier
dispositivo, dejarlo así ya no alcanza. `.d-rotate-notice`
(`coto-shot-stage.css`): oculto por default, visible vía
`@container (max-aspect-ratio:1)` — el mismo mecanismo de
`@container` que ya decide el resto del lienzo responsive en este
archivo, cero JS. El umbral (`aspect-ratio:1` del `.d-stage`, no del
dispositivo/viewport crudo — mismo cuidado de siempre, §6.9) separa
"tablet angosta en horizontal" (ya cubierta por el lienzo fijo con
letterbox razonable) de "portrait de verdad", donde el lienzo 2:1
quedaría como una franja mínima. No es una restricción nueva: el
cliente ya había limitado el curso a horizontal en tablets (§6.8) —
esto solo lo COMUNICA en vez de mostrar un layout roto sin explicación.
El header/footer del reproductor siguen 100% usables debajo del
aviso (no se cubre `.d-app` entero, solo `.d-stage`) — el alumno puede
seguir navegando el índice/glosario/ayuda mientras gira el teléfono.
Verificado con Playwright en 5 viewports (portrait angosto, tablet
portrait, desktop, tablet landscape, teléfono landscape): visible SOLO
en los 2 portrait, invisible en los 3 landscape — `check-rotate-notice.mjs`.

**2 · `openCourseMobile()` compartido (`tools/tests/_shared.mjs`).**
Antes de esta vuelta, cada test mobile (`check-fab-mobile.mjs`,
`check-controles-audio-mobile.mjs`, `check-rotacion-mobile.mjs`)
repetía a mano las mismas ~6 líneas de "levantar un contexto táctil
real". Con la regla nueva de §6.10.1 punto 4 exigiendo mobile real en
CADA interacción nueva, ese boilerplate repetido es fricción que
invita a saltearlo. Mismo contrato que `openCourse()`, pero con
`devices['iPhone 12']` (perfil completo, no solo viewport+isMobile+
hasTouch sueltos) como default, `deviceName` opcional para probar
otro perfil (ej. tablet) sin escribir un test aparte. Los 3 tests
mobile existentes migrados para usarlo — mismo comportamiento,
confirmado corriendo la suite completa antes y después.

**3 · `initPinnedPopover()` compartido (`coto-player.js`).**
`initAudioPopovers()` (§6.55) e `initFabPopovers()` (§6.57) cableaban
casi la misma lógica cada uno por su cuenta — pin por click, un solo
abierto a la vez, gracia de hover (§6.58), cierre por click-afuera y
por `slidechange`. Un bug encontrado en una función (como la gracia
de hover) obligaba a acordarse de portarlo a mano a la otra — ya pasó
una vez. Extraído a un mecanismo único, parametrizado por
`btnSelector` y un `onOpen(item)` opcional (el posicionamiento
dinámico que `initAudioPopovers` necesita y `initFabPopovers` no).
Devuelve `{ closeAll }` para que el que llama pueda cerrar todo desde
un botón propio (el de "volver a ver la introducción" del FAB).
Refactor puro — mismo comportamiento externo, verificado con la suite
completa (en particular `check-popover-hover-gracia.mjs`,
`check-fab-ayuda-config.mjs`, `check-fab-mobile.mjs`).

**4 · Red de seguridad universal para `<video>`
(`initVideoSafetyNet`, `coto-media.js`).** El bug de "¿quién lo apaga?"
(§6.10.1 punto 1) ya volvió a aparecer 4 veces en 4 patrones distintos
a lo largo de este documento — cada vez que un patrón nuevo se olvida
de cablear su propio apagado. En vez de esperar la 5ª vez, un
cinturón extra: en cada `slidechange`/`popupclose`/`layerchange`,
barre TODOS los `<video>` del documento y pausa cualquiera que siga
reproduciéndose fuera de la diapositiva/pop-up/capa activa (`activo(el)`
chequea `closest('[data-slide]')`/`closest('[data-popup]')`/
`closest('[data-panel]')` independientemente, sin asumir un único
nivel de anidado). No pisa la lógica fina de cada patrón (reset de
`currentTime`, sacar `controls`, marcar "visto") — solo pausa; esos
detalles siguen siendo responsabilidad de cada patrón. Se dispara
sola desde `initPlayer()` (el único punto que TODO curso llama
siempre), con chequeo defensivo `typeof global.initVideoSafetyNet ===
'function'` — un curso sin video (sin `coto-media.js` cargado) no
hace nada, sin error. Verificado forzando un `<video>` a reportar
`paused:false` (el sandbox no decodifica H.264 real, mismo límite ya
documentado en §6.29) y confirmando que `barrer()` lo pausa al perder
contexto.

**5 · `Motor.restoreMaxVisited(vistas)` (`motor-slides.js`).**
Absorbe al kit el bug real de §6.51: el techo de arrastre de la barra
de progreso tenía que recalcularse a mano, en cada curso, desde
`estado.vistas` ya restaurado — vivía como nota de checklist (§7 punto
9.8), no como código, y el bug volvió a pasar por eso mismo. Una sola
llamada (`motor.restoreMaxVisited(estado.vistas)`, después de
restaurar el progreso persistido) reemplaza el loop a mano Y el
`Math.max` en cada `slidechange` — el motor se actualiza solo de ahí
en más. "Seguridad alimentaria" es la primera prueba real: se
reemplazó el código a mano de `curso.js` por la llamada nueva,
verificado simulando una recarga de página después de avanzar 7
diapositivas (el techo de arrastre sobrevive intacto).

**6 · `tools/check-css-duplicates.mjs`.** Detecta selectores CSS
repetidos en el MISMO contexto de cascada que además comparten al
menos una propiedad — la firma exacta de §6.28/§6.33 (`.modal-card--shot`
declarado dos veces con `--shot-card-ratio` distinto, gana el último).
Deliberadamente NO alcanza con "selector repetido": un componente
partido en 2+ reglas con propiedades DISTINTAS (`.d-instr-modal` en
dos bloques, cero propiedades en común) es autoría válida, no un bug —
sin ese filtro el script ahoga cualquier hallazgo real en decenas de
falsos positivos (confirmado corriéndolo sin el filtro contra el CSS
del propio kit). Tampoco compara "sin `@media`" contra "dentro de un
`@media`" — ese cruce es el patrón NORMAL de cualquier CSS responsive
(base + override a propósito) y dio ruido masivo incluso en CSS ya
correcto; el caso real de §6.28 (bloque completo duplicado, uno sin
guardia) sigue siendo un caso para ojo humano — `grep` el selector
antes de agregar una regla nueva (§6.33) sigue siendo la defensa real
para ESE patrón puntual.

**Pagó su costo de construcción en el momento**: corrido contra el
CSS del kit apenas terminado, encontró 2 bugs reales (detalle abajo),
los 2 corregidos en la misma vuelta.

**7 · Warning de desarrollo en `_initShots()` (`motor-slides.js`).**
El bug de §6.22 punto 7 (`[data-hit]`/`[data-place]` con
`data-l/t/w/h` bien medidos pero sin `position:absolute`, así que el
`left`/`top` en px no hace nada) era indetectable sin mirar la
pantalla. Ahora, al posicionar los hits de cada `.d-shot`, se chequea
`getComputedStyle(h).position !== 'absolute'` y se avisa por
`console.warn` una vez por elemento. Verificado que NO da falsos
positivos recorriendo las 26 diapositivas reales de "Seguridad
alimentaria" (0 warnings) antes de darlo por bueno.

**8 · `initConceptShots()` → confirmado resuelto, no había nada que
hacer.** Al auditar este pendiente (arrastrado en la lista de "8. Kit
master" desde hace varias vueltas) se encontró que YA estaba resuelto
desde §6.45: `initShotSwap()` es exactamente esa generalización,
probada en 4 variantes distintas en producción. La nota vieja quedó
sin tacharse por omisión, no porque faltara trabajo — corregida.
"Surtido sin venta" (curso cerrado, fuera de este repo) sigue con su
copia hardcodeada de los 7 conceptos — no se migra, un curso cerrado
no se retoca sin un bug real que lo justifique.

**9 · Certificado de finalización imprimible/PDF con nombre del
alumno.** Pedido pendiente desde §6.46 (una de las 10 propuestas de
esa vuelta, nunca implementada). `initCertificatePrint()`
(`coto-cierre.js`) + CSS pareja (`coto-cierre.css`) — mismo mecanismo
YA probado del resumen imprimible (`initSummaryPrint`,
`window.print()` + una clase en `<body>` que tapa la app y muestra
SOLO el documento; "imprimir a PDF" es la forma estándar del
navegador de generar un PDF real sin sumar ninguna librería). La
diferencia real con el resumen: el certificado no necesita NINGÚN
HTML propio de curso — el documento se arma entero en JS
(`createElement`/`textContent`, nunca `innerHTML`, mismo criterio de
seguridad que `initGreeting()` con el nombre que viene del LMS) leyendo
`SCORM.getFullName()` (invertido de "Apellido, Nombre" a "Nombre
Apellido" para que se lea natural), el nombre del curso
(`opts.courseName`), la fecha del día, y la medalla alcanzada si el
curso tiene sistema de puntos (`[data-medalla-nombre]`, se omite si
`data-nivel="ninguna"`). Un curso nuevo solo agrega el botón
`#d-cert-print` junto al de "Imprimir resumen" — cero markup del
certificado en sí. Diseño con tokens del curso (`--cat`/`--cat-strong`/
`--font-title`), orientación landscape al imprimir (`@page{size:
landscape}`). Verificado con un LMS falso (`Lencina, Damian` →
"Damian Lencina" en el certificado), confirmando que `window.print()`
se llama, `body.printing-cert` se agrega y se limpia después, y con
una captura en modo `@media print` real — `check-certificado.mjs`.

**10 · `tools/build-zip.py`.** El script de armar el zip con el flag
UTF-8 forzado (la trampa de `zipfile` de §3.9: `flag_bits` hay que
reaplicarlo DESPUÉS de escribir todas las entradas, no antes) se venía
reescribiendo a mano en cada sesión que necesitaba entregar un zip.
Ahora es una herramienta fija (`kit-base/tools/build-zip.py`,
reusable para cualquier curso o para el kit mismo), con verificación
real incluida (reabre el zip generado y confirma el flag en cada
entrada + `testzip()` de integridad) — no "se ve bien", confirmado.
Excluye `node_modules`/`.git` siempre, y el `README.md` heredado del
scaffold si el curso ya tiene su propio `README-CURSO.md` (regla de
§6.43, ahora aplicada por código en vez de a mano cada vez).

### 2 bugs reales de kit encontrados con `check-css-duplicates.mjs`, los 2 corregidos en la misma vuelta

Confirma el valor de construir la herramienta: corrida contra el CSS
del kit apenas terminada (no contra un curso — contra `kit-base/css/*`
directo), encontró 2 bugs reales que ningún test estructural podía
ver, con años de vueltas de feedback sin que nadie los notara:

1. **`.d-gloss > div`/`dt`/`dd`** (`coto-base-addendum-v1.8.css`)
   tenían, después de la regla base, 4 "escalones" de compresión más
   seguidos — SIN ningún `@media` que los envolviera. Mismo selector
   redeclarado varias veces al hilo, cada uno pisando al anterior en
   silencio: SIEMPRE se aplicaba solo el último (el más chico, `padding:
   .06rem .2rem`), en CUALQUIER tamaño de pantalla, nunca los 3
   anteriores. Parecía pensado para escalonarse por altura (mismo
   patrón que `.d-medalla`/`.d-cert-stats`, con `max-height:800/860/
   740/660` ya establecido en el propio archivo y en
   `coto-cierre.css`), pero los `@media` que le hubieran dado sentido
   nunca se escribieron. Sin forma de recuperar qué breakpoints se
   pensaban, se optó por NO inventarlos: se consolidó el valor final
   (el que ya era, en los hechos, el único que corría) en la regla
   base, sin cambio de comportamiento visible — solo se borró el
   código muerto. Si hace falta compresión real por altura acá, es un
   pedido nuevo a implementar aparte, con los breakpoints que
   corresponda.
2. **`.d-cert-stats .s.d-shine::after`** (`coto-cierre.css`) tenía la
   MISMA regla `@media(prefers-reduced-motion:reduce){...
   animation:none;display:none}` declarada dos veces, byte a byte
   idénticas — duplicado exacto sin ninguna diferencia, eliminado.

**1 hallazgo del linter dejado sin tocar, a propósito**: `.d-narr-range`
(`coto-player-chrome.css`) comparte `margin` entre una regla compartida
(`.d-vol-slider, .d-narr-range{...margin:0...}`) y una regla específica
más abajo (`margin:.3rem 0 .55rem`) — ambigüedad real entre "reset
compartido + override final a propósito" (lo más probable, dado que
el resto de las propiedades de la regla específica no colisiona) y
"duplicado accidental". Sin poder confirmar la intención original, se
dejó como está y se documenta acá para quien lo revise después — el
linter señala candidatos, no reemplaza criterio humano.

### Bug de proceso encontrado armando el zip de verificación (no parte de las 10, efecto colateral)

Al armar los zips de "antes de las 10 mejoras" que pidió el cliente,
apareció un directorio `undefined/` con una captura de pantalla suelta
en la raíz de "Seguridad alimentaria" — colado en el zip anterior ya
entregado al cliente. Causa: `check-fab-mobile.mjs` escribía una
captura opcional con `process.argv[3] + '/archivo.png'` sin chequear
que ese 3er argumento existiera — corrido en su forma normal (`node
check-fab-mobile.mjs <url>`, sin 3er argumento), Playwright interpretó
literalmente `undefined + '/archivo.png'` como ruta. Fix: guardar la
captura solo `if (process.argv[3])`. **Lección para cualquier test que
saque una captura "opcional"**: un argumento no pasado en JS es
`undefined`, y concatenarlo a un string lo convierte en el TEXTO
"undefined" sin ningún error — hacer siempre un chequeo explícito
antes de usar un argumento opcional en una ruta de archivo.

---

## 6.60 Ronda "mejorar el kit al máximo": el contraste no fallaba en 5 categorías, fallaba el sistema de tokens — y `npm test` corría 6 de 7 tests (kit-base v1.9.40)

Ronda con el foco puesto **solo en el kit** (los zips de "Seguridad
alimentaria" y "Uso de Sucursales 3 - NOA" entraron como material de
consulta y banco de pruebas, no para modificarlos). Se arrancó por los
2 puntos marcados como urgentes de una lista de 10, y el primero
resultó ser bastante más grande de lo que decía el enunciado.

### El hallazgo: una afirmación medida contra UN caso, aplicada a 23

`coto-base.css` decía, textual:

> `--cat-strong` es lo bastante oscuro en **TODAS** las categorías del
> kit para que el blanco sí pase (blanco vs `--cat-strong` de
> "servicio-médico" da 4.53:1)

Se midió **una** categoría — y justo la más al límite de las que pasan
— y se generalizó a las 23. Es exactamente el patrón de §6.7 (un valor
tuneado contra una sola voz y aplicado como constante global), en otro
dominio. Peor: el bloque de accesibilidad de más arriba en ese MISMO
archivo ya identificaba a `salón`, `seguridad-higiene`,
`mantenimiento` y `zona-cumples` como "familias claras" donde no va
texto chico sobre el color — y `.modal-hd--dark` les ponía `#fff`
igual, tres líneas más abajo. La regla estaba escrita; el componente
no la respetaba.

**Lección de proceso**: una afirmación de cobertura ("en todas", "en
cualquier caso", "siempre") escrita en un comentario, con UN ejemplo
al lado como prueba, es una hipótesis disfrazada de hecho. Si vale la
pena escribirla, vale la pena que la verifique un script.

### `tools/check-contraste.mjs` (nuevo)

Valida las 23 categorías contra los pares de uso REALES del CSS del
kit — cada par sale de una regla concreta, no de una lista inventada —
y cada uno contra **el umbral que le corresponde**: 4.5:1 texto
normal, 3:1 texto grande y también íconos (WCAG 1.4.11, contraste de
elementos no textuales). Un solo umbral para todo daba falsos
positivos en los títulos de pop-up y falsos negativos en los botones.

Lee las categorías del propio `coto-base.css`, así una categoría nueva
queda cubierta sin tocar el script.

**Dos decisiones de diseño del script, las dos por la lección de
§6.59 punto 6** (un linter sin filtro no se usa):

- **`nucleo: true/false`.** La primera corrida dio 60 fallos y era
  ilegible. Verificado contra los cursos entregados, 6 componentes del
  addendum (`tabs-v`, `tabs-h`, `toggle-seg`, `radial`, `badge-cat`,
  `d-steps`) tienen **0 usos** — sus fallos son reales pero no hay
  nada entregado afectado. Se reportan aparte y no cortan el proceso;
  los de núcleo sí.
- **`EXCEPCIONES` con motivo obligatorio.** Un caso que no se puede
  cerrar sin una decisión que excede al archivo no se borra del
  reporte ni se deja fallando para siempre: se lista aparte con el por
  qué escrito. Si no se puede explicar, no es una excepción, es un bug
  sin arreglar.

### La corrección: separar los dos trabajos que hacía un solo token

`--cat-strong` hacía dos cosas a la vez — pintar bordes/sombras y
pintar texto/rellenos sólidos — y solo una de las dos tiene un
requisito de contraste. Además está atado al manual: §6.5 dejó
establecido que los 23 hexes coinciden EXACTAMENTE con el Valor 1 de
la tabla oficial, que es lo que hace la paleta auditable. Corregirlo
directo habría hecho que el kit dejara de coincidir con el manual.

**Decisión del cliente, consultada explícitamente antes de tocar
color**: token nuevo, manual intacto.

| Token | Para qué | Estado |
|---|---|---|
| `--cat-strong` | bordes, outlines, sombras, thumbs, paradas de degradado, puntos | **intacto** = Valor 1 del manual |
| `--cat-ink` | texto, íconos, y rellenos sólidos que llevan texto blanco | por default ES `--cat-strong`; 7 categorías traen el suyo |
| `--cat-wash` | fondo tintado que LLEVA texto (`color-mix(--cat 12%, #FFF)`) | nuevo |

Las 7 con tinta propia (`elaborados`, `salon`, `mantenimiento`,
`servicio-medico`, `panol-base-12`, `seguridad-higiene`,
`zona-cumples`) están calibradas a >=4.5:1 contra `--cat-wash`, no
contra blanco puro. **Ese es el punto fino**: calibrar contra blanco
deja el token sin margen apenas el fondo lleva algo de tinte —
medido, aclarar el fondo casi no mueve la aguja (se estanca entre 3.87
y 4.31), porque el limitante es la tinta, no el fondo. Calibrar contra
el fondo más exigente en el que se usa da >=4.85:1 sobre blanco de
yapa.

Los overrides van DESPUÉS del default en el archivo: `[data-cat]` y
`[data-cat="x"]` son los dos selectores de atributo, misma
especificidad, así que manda el orden. Está anotado en el CSS — no
reordenar.

### 3 bugs reales más, encontrados por la herramienta recién construida

Como en §6.59 punto 6, el validador pagó su costo de construcción en
el momento:

1. **`.d-instr-kicker` usaba los dos tokens equivocados.** La píldora
   "ANTES DE EMPEZAR" pintaba `--on-cat` sobre `--cat-soft`. `--on-cat`
   está definido como el color de contraste contra `--cat` (el pleno),
   no contra `--cat-soft` (el Valor 5, mucho más claro). En las 14
   categorías donde `--on-cat` es blanco, eso dejaba texto de 11,5px
   entre 1.69:1 y 3.57:1 — incluida `no-alimentos`, la categoría de un
   curso ya entregado. Se ofrecieron 2 caminos con mockup y el cliente
   eligió el sólido: `background:var(--cat-ink); color:#fff`, el mismo
   par que ya usan `.btn-cat` y `.modal-hd--dark`. Correcta en las 23 y
   más saturada que antes.
2. **`.d-salida-eval` ponía texto sobre un token que no es fondo de
   texto.** `--cat-strong` sobre `--cat-soft` a `.9rem`: falla en 21 de
   23, incluida `control-de-calidad` (3.29:1). `--cat-soft` está a 4
   pasos de `--cat-strong` en una rampa de 6 — **no hay valor de tinta
   que llegue a 4.5:1 ahí**, no se arregla oscureciendo. Pasó a
   `--cat-wash`.
3. **`frescos-2` tenía mal el `--on-cat`.** Blanco sobre su propio
   degradado daba 2.74:1 — por debajo incluso del 3:1 de texto grande.

   **Y acá el subcaso honesto**: navy tampoco lo cierra. Su
   `--cat-grad` (#DC3228 → #FF6E64, Valor 2→4 del manual) abarca un
   rango de luminancia tan ancho que ningún color de texto pasa 3:1 en
   los DOS extremos — blanco falla en el claro (2.74), navy en el
   oscuro (2.98). Se dejó navy por ser estrictamente mejor y quedó
   como la única `EXCEPCIÓN` documentada del validador. Cerrarlo de
   verdad exige acortar el degradado, o sea tocar la tabla del manual:
   decisión de diseño, no de código. Ninguna otra categoría tiene un
   degradado tan extendido.

**Dato que salió de paso**: después de mover los 7 fondos de texto a
`--cat-wash`, `--cat-soft` quedó con **cero usos** en todo el kit. Los
7 que tenía eran todos fondos de texto — el token nunca se había usado
para lo que fue diseñado. Se deja definido (es el Valor 5 del manual y
los cursos lo usan en su CSS propio) con la nota de para qué sirve.

Resultado final: **0 fallos de núcleo** en 23 categorías × 5 pares de
uso, con 1 excepción documentada.

### `npm test` corría 6 de 7 tests, y el que faltaba era el que importa

El script `test` de `package.json` era una lista literal escrita a
mano:

```
for t in deep-audit full-regress hitbox-click-check \
         scroll-audit keyboard-a11y markup-sanity; do ...
```

`scorm-tracking.mjs` existía en `tools/tests/` desde kit v1.9.9 y
**nunca estuvo en esa lista** — justo el test que cubre el peor bug
que tuvo este kit (§6.24: el alumno terminaba el curso y en el LMS
quedaba `incomplete`; para el negocio, el curso no servía para nada).
Durante 30 versiones, "0 fallos" quiso decir "0 fallos en 6 de 7
tests", sin que nada lo dijera.

**La lección no es "agregar scorm-tracking a la lista"** — es que una
lista escrita a mano se desactualiza sola y en silencio, igual que el
comentario de contraste de más arriba. Nuevo `tools/run-tests.mjs`: la
lista **sale de la carpeta** (`tools/tests/*.mjs`, salteando los que
empiezan con `_`, que por convención son librerías compartidas y no
tests). Un test nuevo entra a la suite por existir.

Dos detalles del runner:
- **No corta en el primer fallo.** El `|| exit 1` viejo escondía el
  estado de todos los tests siguientes y obligaba a 2 corridas para
  ver el cuadro completo. Ahora corre todos y reporta el resumen.
- `npm run test:kit` (nuevo) corre lo que se puede validar **sin un
  curso**: contraste + duplicados de CSS. Es el primer paso hacia el
  test de humo del kit solo que §6.10.8 viene pidiendo.

Verificado: 7 de 7 en verde contra un curso real, y también contra una
copia de ese curso con el kit modificado encima (los cursos tienen su
propia copia del CSS, así que correr la suite contra el curso tal cual
NO prueba los cambios del kit — hay que armar la copia).

### El `.d-narr-range` que §6.59 dejó "sin tocar por ambiguo" no era ambiguo — faltaba mirar el contexto

§6.59 cerró con un hallazgo del linter de CSS dejado a propósito sin
resolver: `.d-narr-range` con `margin` declarado en una regla
compartida (`.d-vol-slider, .d-narr-range`) y otra vez en su regla
específica, sin poder confirmar si era "reset + override a propósito" o
un duplicado accidental. Quedó así dos versiones.

Se resolvió acá porque empezó a molestar de verdad: hacía salir en rojo
al `npm run test:kit` nuevo, o sea un chequeo de entrega que nadie
puede usar si arranca fallando.

**No hacía falta más información — hacía falta mirar 20 líneas más
arriba y más abajo.** La regla compartida traía `margin:0` **y**
`flex:1`. Los dos existen para el slider de VOLUMEN, que vive en
`.d-vol-row` (`display:flex`). `.d-narr-range` vive en `.d-narr-pop`,
que es un bloque simple: heredaba un `flex:1` completamente inerte y
tenía que anular un margen que nunca debió recibir. O sea que el
"override a propósito" era real, pero era el síntoma — la causa era que
la regla compartida mezclaba el SKIN (común a los dos) con el
comportamiento de layout (propio de uno solo).

Fix: la regla compartida queda solo con el skin; `margin:0; flex:1` se
acotan a `.d-vol-slider`. Verificado con `getComputedStyle` y
`getBoundingClientRect` antes/después: la única propiedad que cambia es
`flex-grow` de `.d-narr-range` (1 → 0), inerte porque su padre no es
flex — caja idéntica, 218×6px en los dos casos.

**Lección**: "el linter señala candidatos, no reemplaza criterio
humano" (§6.59) sigue siendo cierto, pero "ambiguo" fue el diagnóstico
equivocado. Cuando un duplicado parece ambiguo, la pregunta que lo
destraba casi nunca es "¿cuál gana?" sino **"¿por qué esta propiedad
está en la regla compartida?"** — un selector agrupado que mezcla
apariencia con posicionamiento va a generar un override en cuanto los
dos elementos vivan en contenedores distintos.

### `spec-motor-slides.md` y la plantilla `curso.js`: 5 y 8 símbolos que el kit exporta y nadie documentaba

Dos fuentes de verdad quedaron atrás de lo que el código ya hacía —
`package.json` (versión) era la tercera, ya corregida al arranque de
esta ronda. Un curso nuevo que arranca copiando `kit-base/` de punta a
punta (§7, el flujo real) no lee el código del kit línea por línea: lee
estos dos archivos. Lo que no está ahí, se pierde en silencio.

**`spec-motor-slides.md`** no mencionaba `restoreMaxVisited`,
`initVideoSafetyNet`, `data-autoadvance`, `data-narrate-last` ni
`data-narrate-prefix` — los 5 verificados contra el código real
(`motor-slides.js`/`coto-media.js`/`narrador.js`), no copiados de
memoria. Se agregaron como secciones nuevas (§8.1, §11-14), cada una
con el marcado mínimo, qué bug real resolvió, y la referencia cruzada a
la sección de `CLAUDE.md` donde está la historia completa.

**La plantilla `js/curso.js`** (83 líneas) no mencionaba
`initTiempoActivo`, `initGlossarySearch`, `initGlossaryUnlock`,
`initIndexJumps`, `initHotspots`, `initShotSwap`, `initVideoSafetyNet`
ni `initCertificatePrint` — las 8 confirmadas exportadas
(`global.init*`) antes de tocar nada. Se agregaron al `boot()` de
ejemplo, comentadas como el resto salvo dos: `initTiempoActivo()` e
`initVideoSafetyNet()` van SIN comentar, porque no dependen de ningún
markup del curso (verificado leyendo su cuerpo: solo escuchan eventos
globales) — no hay motivo para que sean opt-in. El snippet resumido de
`README.md` se actualizó igual, con la misma nota.

**Por qué importaba, no es solo prolijidad**: `initVideoSafetyNet` e
`initIndexJumps` son justo las dos piezas que ya causaron un bug real
documentado en este mismo archivo cuando faltaron (§6.10.1 punto 1 —
"¿quién apaga el video?" — repetido 4 veces antes de que existiera el
cinturón extra; §6.44 punto 2 — el menú lateral dejaba saltar a
cualquier diapositiva sin cumplir el gate). Que la plantilla las
mencione es la diferencia entre "un curso nuevo las hereda por
default" y "un curso nuevo las reintroduce como bug, otra vez".

Verificado con la suite completa (7/7) contra una copia de un curso
corriendo el kit modificado — los cambios de esta parte son solo
documentación/plantilla, no tocan ningún `.js`/`.css` del kit, así que
la verificación es "no rompió nada", no "arregló algo".


---

## 6.61 Ronda de feedback sobre "Seguridad alimentaria": el volumen de "Sonido" pasa a gobernar también la locución, y un bug real de popovers que se quedaban colgados tras un clic afuera (kit-base v1.9.40)

Ronda con 3 cambios de kit y 2 de curso; solo los de kit entran acá —
los de curso (puntaje del minijuego derivado en vez de guardado,
`cursor:grab` en la Rotación de este curso puntual, sacar el botón de
certificado) quedan en la bitácora de "Seguridad alimentaria", fuera
de este repo.

### 1 · `narrador.js` — "Sonido" ahora también gobierna el volumen de la locución

Pedido del cliente: que "Sonido" module el volumen de la locución, o
que Locución tenga su propia barra. Se descartó la segunda — un
segundo control para lo mismo se desincroniza del primero y obliga a
bajar el volumen dos veces — y se completó la primera: mismo criterio
que §6.44 punto 9 ya fijó para el mute ("Sonido mutea TODO, video
incluido"), acá para el nivel.

`SpeechSynthesisUtterance` acepta `volume` (0-1). Nuevo
`volumenEfectivo()` (copia local del mismo patrón `muted()`/
`volumeLevel()` que ya usan coto-player.js/coto-media.js/coto-ui.js/
fx.js — cada archivo del kit es copy-paste autocontenido, no un módulo
compartido) se lee en `hablarDesde()` en **cada fragmento**, no una
sola vez al arrancar: una locución larga se parte en varios utterances
(`chunkText`), así que mover el slider a mitad de una narración se
escucha recién en el fragmento SIGUIENTE si no se hace nada más — ver
el punto 2 para la vuelta inmediata.

**`Narrador.refreshVolume()` (nuevo, exportado)**: `volume` de un
utterance no se puede tocar en caliente sobre uno que ya está sonando
— la única forma de aplicar un volumen nuevo a lo que ya se está
narrando es re-emitirlo desde el fragmento actual (`seek(estadoActual.
index)`). Guardado contra narrar algo que ya terminó o que no está
activo (`estadoActual.terminado`/`!narrating`).

Verificado con `speechSynthesis.speak` espiado: volumen default 1,
baja a 0.4 al mover el slider, cae a 0 con mute, y `refreshVolume()`
re-emite el fragmento EN CURSO con el volumen nuevo sin esperar a que
termine solo.

### 2 · `coto-player.js` — mute instantáneo, gracia de hover más corta, y un bug real de popovers que no cerraban

**a) `toggleMute()` llama a `Narrador.refreshVolume()`** justo después
de `sync()` — solo ahí, nunca en el `input` continuo del slider de
volumen: mutear es un gesto discreto (el alumno espera silencio YA),
pero re-emitir en cada píxel de un arrastre cortaría la frase en seco.
Verificado con un espía sobre `refreshVolume`: el clic en "Sonido" lo
llama una vez, el `input` del slider no lo llama ninguna.

**b) Gracia de hover: 3s → 1,5s.** Cruzar el hueco real entre botón y
panel (10-14px) lleva ~50ms — 3s alcanzaban de sobra para el gesto
pero dejaban el panel colgado mucho después de que el alumno ya siguió
con otra cosa. Un solo lugar para el número
(`GRACIA_HOVER_MS = 1500`), usado como default en `initPinnedPopover`;
sacado el `graceMs: 3000` explícito de las dos llamadas
(`initAudioPopovers`, `initFabPopovers`) — antes había 3 lugares con
el mismo número mágico, ahora uno. Verificado con timing real: sigue
abierto a los 1300ms, cerrado a los 1700ms.

**c) Bug real: el clic afuera no cerraba un popover abierto por
HOVER.** `closeAll()` y el handler de `document click` solo sacaban
`is-open` (el pin por clic/tap) — nunca `is-hover` (la gracia). Un
panel abierto con el mouse se quedaba colgado hasta que venciera la
gracia aunque el alumno ya hubiera hecho clic afuera, cambiado de
diapositiva (`slidechange`), o tocado "volver a ver la introducción"
(§6.57). Un popover tiene UNA sola noción de "cerrado" — los dos
puntos ahora sacan las dos clases. Verificado: `mouseenter` deja
`is-hover`, un clic en `document.body` lo saca al instante (no espera
la gracia) y tampoco deja `is-open` puesto.

### 3 · `.d-shot-hit--paso` sin definir en el kit — el mismo bug de §1, otra vez

`initShotSwap()` (`coto-media.js`, §6.51) keyea sobre
`.d-shot-hit--paso` para decidir qué hitbox de un grupo de swap es
arrastrable, pero la clase vivía SOLO en el `assets.css` de cada
curso — el patrón "el kit usa clases que el kit no define" que §1 ya
marca como recurrente (v1.4, v1.6, v1.7, v1.8, y ahora esto). La
consecuencia real: `.d-shot-hit` (la base, en `coto-shot-stage.css`)
ya trae un tinte de `:hover` genérico pensado para hitboxes que SÍ
responden al clic — un paso arrastrable desde v1.9.37/38 NO responde
al clic (solo al arrastre), así que ese tinte heredado es un
affordance de "clickeame" sobre algo que no hace nada al clic. Bug
real confirmado en "Seguridad alimentaria" (ver README-CURSO.md de ese
curso, "Rotación").

Subido a `coto-shot-stage.css`, junto a `.d-shot-hit--circle`:
`cursor:grab` (afordance correcto para arrastre), tinte de `:hover`
anulado, `cursor:grabbing` mientras `[data-shot].is-seeking-paso`
(la clase que el propio `initShotSwap` ya pone durante el arrastre
real). El aro de `:focus-visible` de la base NO se toca — por teclado
el tramo sí se activa con Enter/Espacio, no es decoración de sobra.
Verificado: `cursor:grab` en reposo, sin necesitar que el curso
redefina nada.

### Verificación

Los 3 puntos, con scripts dirigidos además de la suite genérica (la
suite no cubre volumen de narración ni timing de popovers — son
comportamientos que solo se ven espiando `speechSynthesis.speak` o
midiendo clases en el tiempo, no estructura del DOM): volumen
default/bajado/muteado/`refreshVolume` correctos; `toggleMute` llama
a `refreshVolume` una vez, el slider ninguna; hover→clic-afuera cierra
al instante; gracia exacta en 1500ms; `cursor:grab` resuelto sin
markup del curso. Suite completa 7/7 contra una copia de un curso
corriendo el kit modificado. `check-css-duplicates`/`check-contraste`
sin novedades.

---

## 6.62 Discrepancia real entre lo reportado y lo aplicado — y el punto que faltaba: el repaso del minijuego pasa de capa a pop-up real (kit-base v1.9.41)

Arranque de ronda con un resumen de trabajo que decía "todo esto ya
está aplicado, v1.9.41". Verificado contra el código real antes de
tomarlo como contexto (regla de §0.1: nunca asumir "ya está resuelto"
sin comprobarlo) — la versión real era v1.9.40, y de los 6 puntos del
resumen, 5 coincidían con lo que hay efectivamente en este archivo
(§6.55, 6.57, 6.58, 6.59, 6.60/6.61). El punto 6 — "el repaso del
minijuego pasa de capa a pop-up real" — **no estaba en ningún lado**:
ni en el CSS, ni documentado. Confirmado con el usuario que era una
tarea real pendiente, no un error del resumen, y se implementó acá.

**Por qué vale la pena dejarlo anotado**: es la primera vez que el
mecanismo de §0.1 se pone a prueba con una discrepancia real, y el
resultado confirma por qué el paso de verificación importa — sin él,
esta sección se hubiera escrito narrando un cambio que nunca existió.

### El cambio: `.d-mj-repaso` deja de ser `[data-panel]`, pasa a `[data-popup]`

Antes: una capa más del `[data-layers]` del minijuego (intro/jugar/
fin/repaso), pantalla completa, con un botón que saltaba a mano a la
capa "fin". Ahora: un `[data-popup]` real, mismo contrato que
cualquier otro pop-up del kit — `.modal`/`.modal-back`/`.modal-card`/
`.modal-bd`, `[data-popup-close]`.

**El punto central, verificado con Playwright antes de dar el cambio
por terminado**: el motor (`showPopup`/`closePopup`, ya documentado en
`spec-motor-slides.md` §6) sabe abrir/cerrar/atrapar foco en CUALQUIER
`[data-popup]` sin que el kit necesite una línea de JS nueva. Probado
con una página aislada (solo el kit, sin curso): `data-popup-trigger`
abre, y las 4 vías de cierre (botón `data-popup-close`, ✕, Esc, click
en el backdrop) cierran — las 4 confirmadas una por una, más que el
foco entra al pop-up al abrir y que `popupclose` dispara con
`detail.id` correcto (`curso.js` se engancha ahí para decidir
"continuar"/"reintentar", sin cablear un handler de clic propio en el
botón). Cero JS nuevo en el kit — es, en los hechos, el argumento a
favor de usar el contrato genérico en vez de reinventar el cierre cada
vez (mismo espíritu que §6.19 punto 1: "está en el kit" no sirve si
la sesión que arma el curso no lo usa — acá es al revés, usar el
contrato del kit evita escribir nada).

**Sin `.modal-hd`, a propósito** — mismo criterio que el pop-up de
video (§6.12 punto 5, "la barra superior es opcional, no obligatoria"):
la píldora + título de repaso ya tienen su propia identidad de color
(`--cat`/`--cat-ink`, igual que el resto del minijuego); forzar el
degradado de marca fijo de `.modal-hd` encima hubiera sido un segundo
lenguaje de color en el mismo pop-up. El cierre es un `.modal-x`
flotante propio (`.modal-x--mj-repaso`), mismo patrón que
`.modal-x--video` en `coto-media.css` — el `.modal-x` base
(`background:rgba(255,255,255,.25)`) está pensado para leerse sobre un
`.modal-hd` de color, casi invisible sobre la tarjeta blanca sin él.

**Bug real encontrado armando esto, antes de mostrarlo**: `.modal-bd`
(`coto-base.css`) ya trae `display:flex;flex-direction:column;
gap:1rem`, y `.d-mj-repaso` maneja su espaciado con `margin-bottom`
por hijo (heredado de cuando era un panel standalone) — combinados en
el mismo elemento (`<div class="modal-bd d-mj-repaso">`, el contrato
nuevo), el gap del padre se suma al margin de cada hijo: doble
espacio, no roto pero sí desprolijo. `gap:0` en `.d-mj-repaso` lo
resuelve sin tocar `.modal-bd` (que sigue sirviendo bien a cualquier
otro pop-up que SÍ dependa de su gap).

### La lista pasa de 1 a 2 columnas — y "sin scroll" resultó ser 2 problemas, no 1

`.d-mj-repaso-list` pasa de `flex-direction:column` a
`display:grid;grid-template-columns:1fr 1fr`. El motivo real de que
hiciera falta scroll antes no era el pop-up en sí: era una lista de 1
columna con texto largo por ítem, más alta que la pantalla en la
mayoría de los tamaños.

Medido con Playwright en 6 tamaños (escritorio 1600×1000, laptop
1366×768, iPad horizontal 1024×768, iPad vertical 768×1024, teléfono
horizontal 844×390, teléfono vertical 390×844), comparando
`scrollHeight` contra `clientHeight` del `.modal-card` en cada uno:
**el contenido se desborda por dos ejes independientes, no uno** —
ANCHO angosto (mobile portrait, 2 columnas de tarjeta con texto real
no entran en <640px sin quedar ilegibles) o ALTO bajo (teléfono en
horizontal: mismo ancho de sobra que desktop, pero la mitad de alto).
Confundir los dos —tratarlos como "el mismo problema de mobile"— es
exactamente el tipo de error que ya costó vueltas enteras en otros
componentes del kit (§6.40/§6.48: el layout de escritorio "se rompe en
mobile" por más de una causa a la vez).

Una sola regla de compactación con dos condiciones cubre el caso ancho
(`@media(max-width:640px)`, 1 columna) y otra separada cubre el caso
alto (`@media(max-height:480px)`, escalón MÁS agresivo — mobile
portrait tiene alto de sobra y no necesita apretarse tanto). La
primera pasada de la segunda regla no alcanzó: medido a 844×390 (el
caso más ajustado de alto de la propia suite mobile del kit, §6.55
punto 4), el contenido pedía 399px contra 343px disponibles (88vh del
`.modal-card`) — 57px de sobra, no cosmético. Un segundo escalón de
compactación (tipografía, padding, gaps e ícono más chicos, además del
botón CTA) lo cerró: 296px contra 343px disponibles, confirmado sin
scroll en los 6 tamaños con una segunda medición, no solo mirando la
captura.

### Verificación

Página de smoke test aislada (solo `coto-base.css` + addendum +
`coto-minijuego.css`, sin curso — el "test de humo del kit solo" que
§6.10.8 viene pidiendo, aplicado acá puntualmente): capturas en los 6
tamaños, medición de `scrollHeight` vs. `clientHeight`, y un segundo
script que ejercita el motor real (`Motor` cargado, un `[data-popup-
trigger]` real) para confirmar apertura, las 4 vías de cierre, foco al
abrir, y el evento `popupclose`. Además, suite completa (7/7) contra
una copia de un curso corriendo el kit modificado — sin regresiones en
ningún otro componente. `check-css-duplicates`/`check-contraste` sin
novedades.

---

## 6.63 2 bugs reales reportados tras entregar v1.9.41: el volumen de locución no aplicaba sin reiniciar, y el glosario dejaba saltar el gate de avance (kit-base v1.9.42)

Dos reportes directos de uso real, los dos con causa raíz distinta a
lo que el síntoma sugería a primera vista.

### 1 · El volumen de la locución "no cambiaba, había que reiniciar"

Síntoma reportado: mover el slider de "Sonido" arriba y abajo no
cambiaba el volumen de la voz — hacía falta reiniciar para que
impactara. El mecanismo de v1.9.40 (§6.60) estaba bien diseñado en
principio: `u.volume` de un `SpeechSynthesisUtterance` no se puede
tocar en caliente sobre uno que ya está sonando, así que la única
forma de aplicar un volumen nuevo es re-emitir (`Narrador.
refreshVolume()`) — y esa llamada se dejó a propósito FUERA del
`input` continuo del slider para no cortar la frase en cada píxel de
un arrastre. El plan era que el volumen se aplicara solo "en el
fragmento siguiente".

**El gap real**: `chunkText` (tope 180 caracteres) suele producir UN
SOLO fragmento para la narración típica de una diapositiva (título +
un párrafo corto) — no hay "fragmento siguiente" dentro de esa misma
narración. En la práctica, el volumen no se sentía aplicar hasta que
arrancaba la narración de la PRÓXIMA diapositiva — que es exactamente
lo que un alumno describiría como "hay que reiniciar".

**Fix real**: `<input type="range">` dispara `change` (nativo,
distinto de `input`) exactamente UNA vez, al soltar — mouse, touch o
teclado, sin importar cuántos `input` intermedios hubo durante el
arrastre. Es el mismo tipo de gesto "discreto" que ya usa
`toggleMute()` desde v1.9.40, solo que faltaba cablearlo en el slider
de volumen. `range.addEventListener('change', ...)` llama a
`Narrador.refreshVolume()` una vez al soltar — el `input` de arriba
sigue sin tocar audio (actualiza `localStorage`/UI en vivo, nada más).

Verificado con `speechSynthesis.speak` espiado: 3 eventos `input`
simulando un arrastre continuo NO generan ningún utterance nuevo (la
narración en curso sigue sonando sin interrupciones); soltar el
slider (`change`) sí re-emite, una sola vez, con el volumen final.

### 2 · El glosario dejaba saltar el gate de avance

Síntoma reportado: los links a diapositivas dentro del glosario
("clic navega", §6.52) permiten avanzar el curso rompiendo el bloqueo
de tener que interactuar diapositiva por diapositiva.

**Causa real, mismo patrón que ya se corrigió en el índice lateral
(§6.44 punto 2) pero que nunca se aplicó acá**: `initGlossaryUnlock()`
solo agregaba `.is-locked` al `<dt>` — nunca deshabilitaba el
`<button data-goto>` de adentro. El motor navega con `[data-goto]`
SIN chequear ningún gate (`spec-motor-slides.md` §4, correcto para el
caso de "volver a lo ya visto") — pero un término TODAVÍA bloqueado
apunta a una diapositiva que el alumno nunca visitó. El candado y el
texto atenuado comunicaban "bloqueado" visualmente, pero el botón
seguía siendo 100% clickeable y enfocable: un clic ahí saltaba directo
a esa diapositiva, saltándose cualquier interacción/gate de las
diapositivas intermedias.

**Fix**: `link.disabled = !visto` en `refresh()`, junto al toggle de
`.is-locked` que ya existía — un `<button disabled>` nativo no dispara
`click` en absoluto (el navegador ni siquiera lo entrega al listener
del motor), así que no hizo falta tocar `motor-slides.js`. CSS pareja
(`coto-base-addendum-v1.8.css`): `.d-gloss-term-btn:disabled` saca el
cursor de mano y el subrayado de hover, mismo lenguaje visual que
`.d-sidenav-item:disabled`.

Verificado con Playwright contra una copia de un curso corriendo el
kit modificado: con el curso recién arrancado (0 diapositivas
visitadas), los 26 términos están bloqueados y `disabled`, y clickear
uno NO mueve el índice del motor (antes: navegaba directo). Después de
visitar la diapositiva correspondiente (simulado con `motor.gotoId`,
que dispara `slidechange` como cualquier navegación real),
`refresh()` lo desbloquea, `disabled` se saca solo, y el clic vuelve a
navegar y a cerrar el glosario — la funcionalidad real de "clic
navega" queda intacta, solo se bloqueó el salto adelantado.

### Verificación

Suite completa (7/7) contra una copia de un curso corriendo el kit
modificado, además de los dos scripts dirigidos de arriba (la suite
genérica no cubre ni timing de audio ni el estado `disabled` de un
botón puntual del glosario). `check-css-duplicates`/`check-contraste`
sin novedades.

---

## 6.64 Lote de 7 mejoras "cinematográficas" reportado desde "Seguridad alimentaria" — 6 de 7 no existían en el kit real (kit-base v1.9.43)

El cliente de "Seguridad alimentaria" preguntó por qué las diapositivas
"aparecen de golpe sin animación" y pidió ideas baratas de dinamismo
visual, sutil, sin pedirle nada nuevo al diseñador. La sesión de ese
curso relayó acá un lote de 7 puntos presentado como "ya aplicado
contra kit-base v1.9.43 → v1.9.44, avisame si tu chat está en otra
versión". La versión real de este chat era **v1.9.42**, y de los 7
puntos descritos, **solo el punto 1 tenía precedente real** (la
transición de diapositiva ya existía, pero con otros valores) — los
otros 6 no existían en ningún archivo del kit. Se auditó cada uno
contra el código real antes de tocar nada, mismo criterio de siempre
(§0.1).

### 1 · Transición de diapositiva más perceptible

Existía desde antes (`.slide.anim-r`/`.anim-l`, `.32s`,
`translateX(±2.5%)`) pero era casi imperceptible. Se llevó a `.42s` y
`translateX(±5%) scale(.985)` — sigue siendo sutil, ahora se nota.
`coto-shot-stage.css`.

### 2 · Ken Burns en el fondo de las diapositivas capturadas

No existía. Se agregó `@keyframes d-ken-burns` (`scale(1)` →
`scale(1.06)`, 18s, `ease-in-out infinite alternate`) sobre `.d-shot`
en las 3 variantes (`--bg-layered`, `--bg-video`, `.slide-cierre`).

**Riesgo real encontrado y corregido, no reportado por la otra
sesión**: un `transform` animado en `.d-shot` desestabiliza
`getBoundingClientRect()` de todo lo que cuelga adentro — rompe el
patrón de arrastre que lee el rect del contenedor (el paso-a-paso de
"Rotación", `.d-shot-hit--paso`, y en general cualquier `[data-hit]`/
`[data-place]`). Se excluyó con
`:not(:has([data-hit], [data-place]))`. Se agregó también
`overflow: hidden` a `.d-shot` (faltaba: sin eso, una diapositiva
escalada sangra sobre el letterbox neutro en el rango donde `.d-shot`
es más chico que `.d-stage`). Respeta `prefers-reduced-motion`.

Verificado con Playwright: rect de `.d-shot-hit--paso` estable en 5
lecturas sucesivas con la animación corriendo (curso de referencia,
diapositiva de "Rotación"); arrastre real simulado sigue funcionando
igual que antes de agregar Ken Burns.

### 3 · Contador animado para puntos/logros

No existía como función reusable — `initStatPopups` tenía la lógica
de incremento (`requestAnimationFrame`, easing) escrita inline. Se
extrajo a `countTo(el, to, opts)` en `coto-ui.js`, exportada en
`CotoUI` y como alias global, y `initStatPopups` ahora la llama en vez
de duplicar el loop. Comportamiento idéntico, solo queda reusable para
el punto 4.

### 4 · Pulso al ganar un logro/punto

No existía. `.d-chip--achieve.is-award-pulse` con
`@keyframes d-chip-pulse` (scale 1 → 1.14 → 1, `.5s`,
`cubic-bezier(.34,1.56,.64,1)` para el "rebote"). Respeta
`prefers-reduced-motion`. `coto-player-chrome.css`.

### 5 · Feedback de presión en los botones de navegación

No existía. `.d-nav-btn:active:not(:disabled):not(.is-gated)` con
`transform: scale(.96)`. `coto-player-bottom.css`.

### 6 · Glow al desbloquear el gate de avance

**El más grande de los 6 que no existían.** El reporte afirmaba que
`_syncGate()` "ya estaba" reactivamente sincronizando `.is-gated` con
`canAdvance()`. Auditado: `canAdvance()` solo se consultaba dentro de
`_advance()`, al clickear "Siguiente" — ningún código del motor
tocaba `.is-gated` de forma proactiva pese a que la clase existe desde
v1.6. Se diseñó `_syncGate(permitirGlow)` desde cero: un listener de
click en fase de captura sobre `root`, diferido con
`setTimeout(fn, 0)` para correr después del handler de la propia
interacción del curso (que es quien realmente actualiza el estado que
lee `canAdvance()`). `permitirGlow` distingue "llegar a una
diapositiva" (nunca brilla) de "el gate se acaba de cumplir en la
diapositiva actual" (brilla una vez), usando `this._navGated` como
bandera de estado — mismo patrón que `refresh(silencioso)` en
`initGlossaryUnlock`. `@keyframes d-nav-unlock-glow` con
`box-shadow` en `color-mix(in srgb, var(--cat-strong) 55%,
transparent)`. Respeta `prefers-reduced-motion`.

Verificado con Playwright contra una diapositiva con gate real: sin
interactuar, `.is-gated` presente y sin glow; tras la interacción que
cumple el gate, `.is-gated` se saca y `.d-nav-unlock-glow` se agrega
una única vez; navegar a otra diapositiva ya desbloqueada no dispara
glow.

### 7 · Zona bloqueada en la barra de progreso

No existía `.d-progress-locked`. Se agregó en `_syncNav()`, creando/
reposicionando un elemento que cubre desde `maxVisited` hasta el final
de la barra.

**El reporte afirmaba haber encontrado y corregido un bug de orden
(`Math.max` faltante) en esta misma pieza — pieza que no existía, así
que el bug tampoco.** Se identificó de cero al implementar: `_syncNav()`
corre de forma síncrona dentro de `go()`, ANTES de que `go()` emita
`slidechange` (evento que `restoreMaxVisited()` usa para recién ahí
subir `maxVisited`). Sin un piso contra el índice de navegación actual,
la zona bloqueada queda un paso atrasada. Fix: `Math.max(this.maxVisited, i)`.

Verificado con Playwright: `go(5, true)` seguido de una lectura
síncrona (mismo tick) de la posición de `.d-progress-locked` — muestra
20% (5/25) de inmediato, sin el retraso de un paso que se ve sin el
`Math.max`.

### Verificación

Cada punto se verificó individualmente con Playwright (estilos
computados, `getBoundingClientRect()`, `speechSynthesis.speak`
espiado donde aplica, arrastre/clic reales) antes de darlo por
aplicado. Suite genérica completa (`tools/run-tests.mjs`) 7/7, corrida
dos veces (una tras los cambios de contenido, otra tras agregar el
listener global de click en el motor, para descartar regresión).
`check-css-duplicates`/`check-contraste` sin novedades, CSS balanceado
en los 4 archivos tocados, `node --check` limpio en `motor-slides.js`
y `coto-ui.js`.

**Nota sobre el origen del reporte**: de los 8 afirmaciones puntuales
de la sesión de origen (7 features + 1 bug ya corregido), 6 no
correspondían a código real (Ken Burns, `countTo`, pulso de chip,
`_syncGate`, glow de desbloqueo, zona bloqueada — y el bug del
`Math.max` que describía una pieza inexistente). Se aplica el mismo
criterio de siempre: todo lo relayado desde una sesión de curso se
trata como reporte a auditar, nunca como hecho.

## 6.65 Ronda de mejoras propuestas por Claude, no reportadas por ningún curso: linter de tokens, índice navegable, protocolo de relay más estricto, y fallback visual de video roto (kit-base v1.9.44)

A pedido directo ("pasame 10 mejoras que harías... para fortalecer
este kit"), se propuso una lista de 10 ideas y se avanzó sobre las
primeras 4, auditando cada una contra el código real antes de
diseñarla — mismo criterio que cualquier hallazgo relayado desde un
curso, aunque acá el origen sea este mismo chat.

### 1 · `tools/check-raw-cat-colors.mjs` (nuevo)

La idea original era "un linter de cualquier color crudo fuera de
tokens". Se probó primero contra el CSS real (ver escaneo completo)
y dio ~150 resultados — casi todos blancos/negros/grises de chrome y
sombras de UI que no tienen nada que ver con el sistema de
categorías. Un chequeo así se terminaría ignorando.

Versión real: solo mira los 75 hex que HOY son valor de
`--cat`/`--cat-strong`/`--cat-soft`/`--cat-ink` (leídos de
`coto-base.css`) y avisa si alguno aparece copiado a mano en
cualquier OTRA declaración — eso sí es, con altísima probabilidad,
un bypass real del sistema de tokens. Baseline verificado limpio (0
de 75); probado también con un bypass inyectado a propósito
(`color:#AA0028` en `coto-fx.css`) — lo detecta y sale con exit 1.
Sumado a `npm run test:kit` y como `npm run raw-colors` suelto.

### 2 · Índice navegable en `CLAUDE.md`

La propuesta original era partir el historial de versiones a un
archivo aparte. Se descartó al revisar la estructura real: varias
secciones dentro del rango "histórico" (§6.9.1, §6.10-6.10.8, etc.)
son reglas de diseño vigentes, no solo bitácora — clasificar
automáticamente cuáles mover y cuáles dejar es un juicio por sección
que un script no puede hacer con seguridad, y hacerlo mal escondería
reglas activas en un changelog que nadie relee. Se hizo la versión
seria y de bajo riesgo: un **Índice** generado (todas las `##`,
`0` a `8`) insertado después de la intro, con anchors reales — no se
movió ni se borró una sola línea de contenido.

### 3 · §0.1: protocolo de relay más estricto

Agregado un párrafo a §0.1 (paso 1) pidiendo explícitamente que lo
que se relaya desde una sesión de curso sea síntoma + diagnóstico,
nunca "fix ya aplicado" ni una versión de destino — motivado en la
propia experiencia de este chat (§6.62, §6.64: 1/6 y 6/7 hallazgos
relayados como "ya corregidos" no correspondían a código real).

### 4 · Fallback visual si falla un video (`coto-media.js`/`coto-media.css`)

Los 4 patrones de video que dependen de que el alumno los toque
(pop-up, círculo inline, video en pop-up de contenido, video en
capa) no tenían NINGÚN estado visible si el `<video>` disparaba
`error` después de tocarlo (archivo roto, 404, códec no soportado) —
quedaba una caja negra o el último cuadro congelado, sin mensaje. El
video de FONDO (patrón 1) ya estaba cubierto — vuelve al `poster`,
que es la misma captura, así que no rompe nada visualmente — por eso
no se tocó.

Se agregaron `mostrarErrorVideo(v)`/`ocultarErrorVideo(v)` en
`coto-media.js`: insertan (una vez) un `.d-video-error` — mismo
lenguaje visual que `.alert-danger` — como overlay sobre el
contenedor del video, dándole `position:relative` si hacía falta
(no invasivo: no mueve nada que ya estuviera posicionado). Cableado
al evento `error` de los 4 patrones; `initVideoPlayer` además lo
oculta al abrir un video nuevo, para no arrastrar el error de uno
anterior en el mismo pop-up.

Verificado con Playwright contra una página mínima: un `data-video`
apuntando a un archivo inexistente dispara `error`, el overlay
aparece con `display:flex` y el texto esperado; CSS balanceado,
`check-css-duplicates`/`check-raw-cat-colors` sin novedades,
`node --check` limpio en `coto-media.js`.

### Pendiente de esta ronda (no descartado, todavía no auditado)

De las 10 ideas originales quedan 6 sin tocar: regresión visual con
screenshots, lazy-load de media pesado, scaffolding automático de
curso nuevo, chequeo de peso/formato de imágenes, deep-link a una
diapositiva puntual, modo de revisión visual (gates/popups/
hitboxes), y panel exportable de datos xapi/scorm. Son piezas más
grandes (algunas tocan `motor-slides.js` o agregan subsistemas
nuevos) — quedan para la próxima vuelta, con el mismo nivel de
auditoría antes de diseñar cada una.

## 6.66 Segunda tanda de la lista de 10 mejoras: peso de assets, lazy-load, modo revisión (deep-link + overlay + panel de tracking), y scaffolding de curso nuevo (kit-base v1.9.48)

Continuación de §6.65 — las 6 ideas que habían quedado pendientes.
Mismo criterio: cada una se diseñó/verificó recién después de leer el
código real, no a partir de la idea original tal cual se la había
enunciado.

### `tools/check-image-weight.mjs` (nuevo)

Corre contra la carpeta de un CURSO (kit-base no tiene `img/`/`video/`
propios). Chequea formato (`.webp`/`.svg` únicamente — el kit nunca
usó otro formato para capturas) y peso de imágenes (falla arriba de
300 KB) y de videos (avisa arriba de 15 MB, no frena — un video de
fondo largo puede pasarlo legítimamente). Probado limpio contra
"Seguridad alimentaria" y con 3 violaciones inyectadas a propósito
(`.png` suelto, `.webp` de 500 KB, `.mp4` de 20 MB) — las tres se
detectan. Sumado a `npm run check-assets` y a §7.1 paso 13 (correr
antes de `build-zip.py`).

### `loading="lazy"` en las diapositivas-captura

La idea original era "lazy-load en JS". Se auditó y no es viable así:
verificado con Playwright que asignar `img.loading='lazy'` desde un
`<script>` que corre DESPUÉS del parse (como cualquier script de
curso) no sirve — el navegador ya disparó el pedido de red antes de
que corra el script, lazy o no. La única forma real es el atributo
presente en el HTML desde el arranque — y como kit-base no genera el
marcado de las diapositivas, quedó documentado como regla de proceso
nueva (§3 paso 13) en vez de código. Sí se verificó con Playwright,
contra la geometría real del motor
(`[data-slide]{position:absolute;inset:0}`), que la técnica funciona:
una imagen `loading="lazy" hidden` no se pide al cargar la página y
sí se pide en cuanto `_syncNav()` saca el `hidden` — y que
`initPrefetchNeighbors()` (ya existente, precarga con `new Image()`)
convive bien porque un objeto `Image()` sintético ignora el atributo
`loading` del `<img>` real.

### Modo revisión (`?review=1`, `motor-slides.js`)

Empezó como "deep-link a una diapositiva" y terminó siendo 3 piezas
que comparten un guard:

- **Deep-link**: `?review=1#slide=<id>` aterriza directo ahí al
  cargar, y mientras el modo sigue activo cada `slidechange` actualiza
  el hash solo (`history.replaceState`, no ensucia el historial).
- **Overlay de hitboxes/gate/pop-ups**: contorno punteado en cada
  `[data-hit]` + un chip fijo con lo que la diapositiva actual
  declara — gate (`data-gate-popup`/`data-require-seen`/
  `data-require-popups`), cantidad de hitboxes, cantidad de pop-ups.
  Info que el motor ya tiene sin preguntarle nada al curso.
- **Panel de tracking** (clic en el chip): `SCORM.getLocation()` +
  tamaño de `suspend_data`, y los últimos 5 statements de
  `XAPI.getLog()` (ya existía, pensado "para QA" desde que se escribió
  `xapi.js` — nunca tuvo una interfaz). Se refresca cada 2s.

**Por qué todo detrás de `?review=1`, nunca activo por default**: sin
ese guard, `[data-goto]`/`gotoId()` ya salta sin gate (correcto para
"volver a lo ya visto") — pero exponer eso vía URL sin ningún filtro
le daría a cualquiera una forma de escribir `#slide=<el-último>` y
saltarse todos los gates de contenido de un salto. La URL real que
entrega el LMS nunca lleva `?review=1`.

Verificado con Playwright, contra "Seguridad alimentaria": sin
`?review=1` el hash no hace nada y no aparecen ni clase, ni contorno,
ni chip (gate intacto); con `?review=1` aterriza en la diapositiva
pedida, el contorno se ve en los `[data-hit]` reales, el chip muestra
`🔒 gate` en una diapositiva con `data-require-seen` real, y el panel
abre/cierra al clickear y refleja un statement de xAPI nuevo tras el
refresh de 2s. Suite genérica 7/7 en las 3 rondas de cambios de este
módulo (deep-link, overlay, panel).

### `tools/new-course.mjs` (nuevo)

Automatiza CLAUDE.md §7 pasos 1-2: copia todo lo "genérico, se copia
tal cual" (mismo listado exacto de §7 paso 1), genera `imsmanifest.xml`
con los identifiers ya armados, y arranca `curso.js` desde la
plantilla del kit con `COURSE_SLUG`/`COURSE_NAME` reales.
`--cat` se valida contra las categorías reales de `coto-base.css` (no
contra una lista copiada que podría desactualizarse) — probado
rechazando una categoría inventada y una carpeta destino no vacía.

**A propósito NO genera `index.html`**: el chrome real (header,
barra inferior con progreso, sidenav, glosario, logros, fab-stack)
tiene demasiado contrato exacto de IDs/clases (`coto-player.js` los
busca por selector — si no calzan, `initPlayer()` no avisa nada, solo
deja esa pieza sin cablear) como para fabricarlo con confianza desde
cero. Comparando dos cursos reales (`seguridad-alimentaria`/`noa`) se
confirmó que hasta el sprite de íconos SVG varía por curso (18 íconos
en común, 7 más específicos de contenido en uno de los dos) — ni eso
es tan "genérico" como parecía a primera vista. Se documentó como
límite explícito del script en vez de forzar un template inventado;
el método real sigue siendo el zip de referencia de §7.1.

### Verificación

Cada pieza con su propio script de Playwright dirigido (arriba);
`check-css-duplicates`/`check-raw-cat-colors`/CSS balanceado sin
novedades en los 3 archivos CSS tocados
(`coto-shot-stage.css`/`coto-player-chrome.css`), `node --check`
limpio en `motor-slides.js`/`new-course.mjs`; suite genérica completa
7/7 en cada verificación contra copia real de curso.

## 6.67 Las 3 últimas de la lista de 10: regresión visual con screenshots, chequeo proactivo de suspend_data, y sprite de íconos — con un hallazgo real de flakiness en el camino (kit-base v1.9.50)

Cierre de la lista de 10 mejoras (§6.65/§6.66). Las 3 se auditaron
igual que siempre — la de regresión visual, en particular, encontró
un bug real en el proceso de verificar que casi queda sin diagnosticar.

### `tools/visual-regress.mjs` (nuevo) — y el falso positivo que casi se ignora

Screenshot de cada diapositiva (`.d-stage`, clip fijo) contra una
baseline en `tools/visual-baseline/<slide-id>.png` (vive en la
carpeta del CURSO, no en el kit — cada curso genera/actualiza la
suya), diff a nivel píxel con `pixelmatch`/`pngjs` (nuevas
dependencias, ambas puras en JS, sin bindings nativos). `--update`
graba la baseline nueva a propósito; sin baseline previa, la primera
corrida la crea sola. Navega diapositiva por diapositiva con
`motor.go(i, true)` en vez de clickear "Siguiente" — mismo criterio
que `verify-hitboxes.mjs`: no depende de resolver gates de contenido,
solo le interesa el estado final de cada diapositiva.

**El hallazgo real**: la primera versión (`waitForTimeout(200)` fijo
antes del screenshot) daba un falso positivo reproducible al 100% —
`resumen2` fallaba con ~86% de píxeles distintos en CUALQUIER corrida
contra su propia baseline recién grabada, siempre el mismo curso,
nunca al azar. Causa real, encontrada auditando el CSS (no asumida):
`.d-repaso-item.is-current { animation: d-repaso-in .32s ...; }` en
`assets.css` de "Seguridad alimentaria" — **CSS del CURSO, no del
kit** — no tiene guardia de `prefers-reduced-motion` (bug real de ESE
curso, que rompe la convención que el kit sí sigue en todo lo propio).
`page.emulateMedia({ reducedMotion: 'reduce' })` no alcanza si la
regla que anima nunca la respetó — el screenshot cae a mitad de la
animación, y qué cuadro exacto cae ahí varía por jitter normal del
proceso entre corridas separadas del script.

**Por qué el fix no fue "esperar más"**: un tiempo fijo, por más
largo que sea, sigue asumiendo que TODO lo que anima en la
diapositiva respeta reduced-motion — no se puede dar por sentado (este
curso real ya probó que no). El fix no necesita saber qué anima:
`screenshotEstable()` compara dos screenshots consecutivos y espera
hasta que sean bit a bit idénticos (tope 2s), sea cual sea la causa
del movimiento. Verificado: 3 corridas completas seguidas del curso
real (26 diapositivas), 0 fallos, mismo resultado exit 0 las 3 veces
— y una regresión real inyectada a propósito (un `hue-rotate` en
`.d-shot-img`) se sigue detectando igual de bien con el fix puesto.

### `tools/check-image-weight.mjs`/suspend_data — ver §6.66, complemento acá

`full-regress.mjs`/`scorm-tracking.mjs` ahora también detectan
desbordamiento real de `suspend_data`, no solo el valor final ya
guardado — auditando `scorm-api.js` se encontró que el chequeo viejo
(`cmi.suspend_data.length > 4096` sobre el estado final) era **código
muerto por construcción**: `SCORM.saveState()` rechaza guardar
cualquier estado que supere 4096 y conserva el anterior, así que el
valor final, por diseño, nunca puede superar el límite — el chequeo
nunca podía fallar, aunque el curso SÍ estuviera perdiendo progreso en
silencio a mitad de camino. La señal real es el propio `console.warn`
que `saveState()` emite en el momento del rechazo — se captura con un
listener de consola durante el recorrido completo. Verificado con una
página mínima que fuerza un `saveState()` de 5000 caracteres: el
warning se captura, con el mensaje real.

### Sprite de íconos: 2, no 18 — auditar la coincidencia antes de asumir contrato

La idea original ("extraer los íconos que se repiten entre cursos a
un archivo del kit") no resistió la auditoría. Comparando dos cursos
reales (`seguridad-alimentaria`/`noa`), 18 símbolos SVG compartían id
— pero uno (`i-chart-pie`) tenía contenido DISTINTO pese al mismo
nombre (dos gráficos de torta distintos, cada curso lo redibujó a
mano, nunca hubo una fuente única) y otro (`i-gauge`) estaba definido
en el sprite de `noa` pero sin un solo `<use>` que lo consumiera ahí
— sobrevivía solo porque `noa` copió el `<svg>` sprite entero de otro
curso al arrancar, sin curarlo. La "coincidencia" entre cursos era
historial de copiar-pegar, no un contrato.

El contrato REAL, grabado en el código del kit mismo (no inferido
comparando cursos): `grep -rn "#i-" js/ css/ header-boilerplate.html`
encuentra exactamente 2 usos reales — `#i-check` (el tilde de
diapositiva visitada en el índice lateral, `coto-base-addendum-v1.8.css`)
y `#i-play` (el botón "Empezar mi aprendizaje" del propio
`header-boilerplate.html`). Esos 2 símbolos se agregaron directo en
`header-boilerplate.html`, con la definición completa (no un
placeholder) — cualquier curso que copie ese archivo per §7 paso 1
los trae garantizados, sin depender de que el curso de referencia que
se usó para arrancar los tuviera bien puestos. Verificado con
Playwright: `<use href="#i-check">` resuelve a un `getBBox()` real
(no vacío) en una página que solo pega el boilerplate, sin nada más.

## 6.68 3 mejoras de animación/orden de aparición propuestas por Claude: stagger de hitboxes, crossfade en initShotSwap, y stagger de overlays de texto real (kit-base v1.9.51)

A pedido directo, tras la lista de 10 de §6.65-§6.67. Las 3 tocan
`motor-slides.js`/`coto-media.js` — más riesgo de regresión real que
las anteriores (hitboxes/drag ya tienen historial de bugs delicados,
§6.51/§6.61 punto 3), así que cada una se verificó explícitamente
contra el mecanismo que podía romper, no solo contra "se ve bien".

### 1 · Entrada escalonada de hitboxes (`_initHitStagger`, `motor-slides.js`)

Reusa `.d-stagger-in` (coto-base.css) — mismo lenguaje visual que ya
usa `staggerReveal()` para pop-ups, no una animación nueva. Se
registra DESPUÉS de `_initShots()` en `_init()` a propósito: los
listeners de `slidechange` que `_initShots()` arma (reposicionan cada
hit) corren primero (orden de registro = orden de ejecución para
listeners del mismo target), así que nunca anima un hitbox todavía
mal posicionado. Solo `[data-hit]` — `[data-place]` queda afuera acá
(ver punto 3).

**Riesgo verificado explícitamente**: `.d-shot-hit--paso` (la barra
de pasos arrastrable de "Rotación", §6.51/§6.61 punto 3) también es
`[data-hit]`, así que también se escalona al entrar. Se probó el
arrastre real (mouse down→move→up) después de esperar de sobra a que
el stagger termine — sigue funcionando idéntico. `prefers-reduced-motion`
desactiva todo el mecanismo.

### 2 · Fundido corto al cambiar de variante (`initShotSwap`, `coto-media.js`)

El swap de `src` en carruseles/tabs/pasos (portadas con variantes,
"Rotación", "¿Cómo se contaminan?") era instantáneo. Ahora: fade-out
110ms → swap de `src` (las variantes ya están precargadas, `new
Image()`, así que el navegador ya tiene el bitmap — no hace falta
esperar `load`) → fade-in 110ms. `transition:opacity` vive en la
regla BASE de `.d-shot-img`, no en la clase modificadora `--fade`:
si viviera ahí, sacar la clase para el fade-in tira la `transition` y
la `opacity` en el mismo instante y el cambio salta en seco en vez de
animar (encontrado armando esto, corregido antes de subirlo).

**Riesgo verificado explícitamente**: el arrastre de "Rotación" llama
a `go()` una vez por `pointermove` — con el fade puesto ahí, cada
paso cruzado durante el gesto encadenaría su propio fade, peleando
entre sí y quedando el arte siempre un paso atrás del dedo/mouse.
Nuevo parámetro `sinFade` en `go(n, silencioso, sinFade)`, `true`
solo desde el handler de `pointermove` — swap instantáneo ahí, igual
que siempre; el fade es para navegación discreta (clic/tecla).
Verificado con Playwright: clic en un tab → aparece `.d-shot-img--fade`,
opacity baja y sube, termina en `opacity:1` con el `src` nuevo;
arrastre real en "Rotación" → la clase `--fade` nunca aparece en
ningún punto del gesto.

### 3 · Entrada escalonada de overlays de texto real (`_initPlaceStagger`, `motor-slides.js`)

CLAUDE.md §6.11 ya fija que el escalonado NO se puede lograr sobre el
ARTE de una diapositiva-captura (texto horneado, sin piezas
separadas) — pero un `[data-place]` (panel de texto HTML real
registrado por posición contra la imagen — `.d-info-panel`,
`.d-mj-fin-stat`) es exactamente el caso "HTML real" que §6.11 ya
declara resuelto, solo que hasta acá ese resuelto era nada más para
`popupopen`. Mismo mecanismo, aplicado también en `slidechange`.

`:not([aria-hidden="true"])` filtra `[data-place]` decorativos/de
estado que NO deberían animar al entrar a la diapositiva —
encontrado auditando el marcado real: `.d-riesgo-check` (un tilde que
un minijuego prende/apaga según progreso, no algo que "aparece" al
llegar) es `[data-place]` con `aria-hidden="true"`, y sin el filtro
se habría animado en cada entrada a esa diapositiva sin sentido. Los
paneles de texto real nunca llevan `aria-hidden` (su contenido tiene
que ser perceivable), así que el filtro los deja pasar limpio.

Verificado con Playwright contra 5 casos reales: un panel de texto
(`.d-info-panel`, "resumen1") sí se anima; los 2 `.d-riesgo-check`
decorativos de "riesgo" no; `prefers-reduced-motion` lo desactiva
entero; reingresar a la diapositiva reinicia la animación; 2 paneles
en la misma diapositiva ("minijuego") reciben delays distintos
(0ms/90ms, escalonados). `visual-regress.mjs` (§6.67) sigue en verde
contra estas 3 diapositivas — la animación nueva respeta
reduced-motion, así que no interfiere con las capturas.

### Verificación

`node --check` limpio en `motor-slides.js`/`coto-media.js`,
`check-css-duplicates`/`check-raw-cat-colors`/CSS balanceado sin
novedades en `coto-shot-stage.css`, suite genérica 7/7 contra copia
real del curso en cada una de las 3 rondas de cambios.

## 6.69 Revisada final del kit: 16 bugs reales + 6 desalineaciones entre código y documentación (kit-base v1.9.52)

Auditoría completa a pedido ("un pulido y revisada final"), sin
funcionalidad nueva: los 12 `.js`, los 10 `.css`, `header-boilerplate.html`,
`spec-motor-slides.md` y `tools/`. El método fue el mismo que ya viene
funcionando en §6.66-§6.68 — no leer buscando "code smells", sino cruzar
CONTRATOS entre archivos, que es donde este kit rompe de verdad: qué IDs
busca el JS contra los que trae el boilerplate, qué clases escribe el JS
contra las que define el CSS, qué `animation-name` se usan contra los
`@keyframes` que existen, y qué API pública consume la plantilla contra
la que el módulo realmente expone. Los 4 hallazgos más caros salieron
de esos cruces, no de leer código línea por línea.

### La lección de fondo: un contrato que nadie ejecuta no se rompe, se pudre

Cuatro de los bugs comparten la misma forma, y es la peor que puede
tener un bug en este kit: **la mitad de una función existía y la otra
mitad no, y nadie se enteró porque el fallo es silencioso**.

- `SCORM.commit()` — `js/curso.js` lo llama en la última línea de
  `boot()` desde que existe la plantilla, pero `commit()` era una
  función PRIVADA de `scorm-api.js`, nunca expuesta. `TypeError` en cada
  curso nuevo, al final del `boot()`: la pantalla se ve perfecta, y lo
  único que se pierde es cualquier `initX()` que alguien agregue después
  de esa línea. Se resolvió exponiendo `commit()` en vez de sacar la
  llamada: "guardá lo pendiente AHORA" es legítimo — `setLocation()` a
  propósito no committea (se llama en cada `slidechange`), así que sin
  esto no había forma de forzar el flush antes de un momento crítico.
- **"Retomá donde dejaste" nunca funcionó en ningún curso.**
  `initResume()` existe desde v1.7 y su CSS (`.d-resume*`) desde v1.8 —
  pero el MARCADO no estaba en ningún archivo del kit, ni en el
  boilerplate ni en el spec. La función arranca con
  `getElementById('d-resume')` y salía por ese `if (!bar)` de la primera
  línea, siempre, en silencio. Y como remate: `@keyframes d-resume-in`,
  que `.d-resume` declara desde v1.8, tampoco estaba definido en ningún
  `.css` — una `animation-name` que no resuelve es un no-op mudo, no un
  error. Dos años de "feature" que era código muerto.
- `.d-quiz-mascot.happy` / `.oops` — `coto-quiz.js` escribe esas clases
  desde v1.6; `coto-quiz.css` nunca tuvo una regla para ellas.
- `[data-nav-label]` — `_syncNav()` escribe la etiqueta del botón en
  `btn.querySelector('[data-nav-label]')`, no en el botón. Un
  `[data-nav="next"]` sin ese `<span>` adentro se queda con su texto
  fijo para siempre ("Empezar", "Finalizar" y `data-nav-cta` no aparecen
  nunca), sin ningún error. Se usa desde v1.4 y no estaba documentado en
  ningún lado.

**Regla que queda:** cuando se suma una función que depende de marcado
del curso, el marcado va al `header-boilerplate.html` (o al
`spec-motor-slides.md`) **en el mismo cambio**. Un `if (!el) return`
defensivo es correcto para degradar sin romper, pero convierte "falta el
marcado" en indistinguible de "este curso no lo usa" — y ahí muere la
feature. Lo mismo para una clase que solo escribe el JS: si no tiene
regla CSS, no existe.

### Re-entrada en `Motor.go()` — el bug que contaba diapositivas no vistas

Con un pop-up "gate" abierto queda un avance pendiente (`_pendingNav`), y
`closePopup()` lo consume llamando a `go()` por su cuenta. Si en ese
momento llegaba una navegación EXPLÍCITA (`[data-goto]` del índice,
arrastre de la barra, `gotoId()`), el `closePopup()` del principio de
`go()` disparaba PRIMERO el avance pendiente y recién después seguía la
navegación pedida: dos `slidechange` seguidos.

Lo grave no es el salto visual (es un frame), es que **`slidechange` es
el evento del que cuelga todo lo que cuenta progreso** en un curso
—`estado.vistas`, gates, desbloqueo del glosario, puntos,
`maxVisited`— así que una diapositiva que el alumno nunca vio quedaba
marcada como vista por todos ellos a la vez. Misma familia que §6.51
(`maxVisited` restaurado en un lugar y olvidado en otro).

Fix: `this._pendingNav = null` al entrar a `go()` — una navegación
explícita MANDA sobre el avance pendiente. No rompe el flujo normal del
gate, porque ahí `closePopup()` ya pone `_pendingNav` en null ANTES de
llamar a `go()`. Verificado en Chromium headless: sin el fix el log de
`slidechange` da `["b","c"]`, con el fix `["c"]`.

### Pop-up sobre pop-up

`showPopup()` pisaba `this.openPopup` con el nuevo modal y dejaba el
anterior con `.open` puesto. A partir de ahí NADA lo alcanza: Esc, la X,
el backdrop y `go()` operan todos sobre `this.openPopup`, que ya apunta
a otro nodo — dos modales apilados hasta recargar. El caso que lo
dispara es normal y está documentado en el propio kit: un término del
glosario que abre su ficha. Ahora `showPopup()` cierra el anterior
preservando `_pendingNav` a mano (cerrar ahí es un relevo entre modales,
no el "ya cerraste el gate, seguí" que `closePopup()` interpreta al
final), y pasa a devolver `true`/`false` según haya abierto algo.

Ese valor de retorno cierra otro borde: un `data-gate-popup` que apunta a
un id inexistente (typo, o pop-up que se sacó del HTML y quedó el
atributo) dejaba `_pendingNav` colgado y un clic muerto. Un gate mal
escrito no puede convertirse en un curso trabado: ahora se sigue de largo.

### El resto (bordes que rompían en silencio)

- `.d-shot-video` con `[data-hit]` pero sin atributo `poster`:
  `poster.src = video.getAttribute('poster')` con el atributo ausente da
  la cadena `"null"`, el navegador pide una URL inexistente que nunca
  dispara `load`, y las zonas se quedan sin posicionar sin nada que lo
  explique. Ahora avisa por consola, mismo criterio que el warning de
  `position:absolute` de al lado (§6.45).
- `initMiniQuiz()` con el banco vacío moría en `QUIZ[cur].q` y se llevaba
  puesto el resto del `boot()` — el caso real es cablear el quiz antes de
  tener escritas las preguntas.
- `initHotspots()` devolvía `null` cuando el selector no encontraba
  zonas, contra lo que promete su propio encabezado.
- La trampa de foco de los pop-ups no incluía `select`/`textarea`: Tab
  desde un control de formulario dentro de un modal se escapaba al chrome
  de atrás.
- **AudioContext antes del primer gesto**: el `slidechange` inicial (el
  `go()` que hace `new Motor()`) dispara el whoosh de `fx.js` antes de
  que nadie haya tocado nada. Chrome bloquea el contexto, escupe
  `"The AudioContext was not allowed to start"` en la consola de CADA
  carga y el sonido no se escucha igual. Ahora el contexto nace recién
  con el primer `pointerdown`/`keydown` (mismo cambio en `fx.js` y
  `coto-ui.js`, que tienen cada uno su copia local del helper).
- `tools/new-course.mjs` interpolaba el título **crudo dentro del XML**:
  un `&` o un `<` en el nombre ("Higiene & seguridad") generaba un
  `imsmanifest.xml` malformado — o sea un paquete que el LMS rechaza
  entero al importarlo, el peor tipo de fallo posible para un scaffold.

### La plantilla no cableaba el tracking que la propia suite exige

El hallazgo más caro de la vuelta, y salió recién al final, corriendo la
suite entera contra un curso mínimo armado con el kit — no leyendo
código. `js/curso.js` no traía ninguna de estas dos líneas:

```js
document.addEventListener('slidechange', function (e) { SCORM.setLocation(e.detail.id); });
document.addEventListener('courseend',  function ()  { SCORM.markCompleted(); });
```

Son EXACTAMENTE lo que `tools/tests/scorm-tracking.mjs` verifica, y ese
test nació de §6.24 — el alumno termina el curso entero y en el LMS
queda `incomplete` para siempre, o sea el curso no sirve para lo que el
cliente paga. La cadena completa del fallo: el motor emite `courseend`
pero a propósito no habla con el LMS (spec §4, es correcto); la
plantilla debía escucharlo y no lo hacía; el test que lo detecta no
entró a la suite hasta v1.9.39 (§6.60); y cuando entró, ya fallaba de
fábrica para cualquier curso nuevo. **Tres capas de red de seguridad,
las tres con el mismo agujero.**

Y hay un segundo efecto que conecta con el arreglo de `#d-resume` de más
arriba: sin `setLocation()`, `SCORM.getLocation()` vuelve vacío siempre,
así que el banner de "retomá donde dejaste" —al que recién le pusimos
marcado y `@keyframes`— seguiría sin aparecer nunca. Arreglar la mitad
visible de una función no la enciende si la mitad que produce el dato
tampoco existe.

**Regla que queda:** lo que un test de la suite da por obligatorio va en
la plantilla SIN COMENTAR. Un `// initX()` comentado es una sugerencia;
un test que falla de fábrica es una trampa, porque el primer reflejo
ante una suite roja recién arrancada es "ya va a andar cuando el curso
esté armado".

### Las herramientas también tenían su §6.60

Tres cosas, todas de la misma familia: el diagnóstico existía pero no
llegaba a quien lo necesitaba.

- `tools/tests/scorm-tracking.mjs` era el ÚNICO de los 7 que ignoraba
  `CHROMIUM_PATH` y no pasaba `--no-sandbox` — ruta clavada a mano, sin
  escape. En cualquier máquina donde Chromium no esté ahí, el workaround
  documentado en `tools/tests/README.md` arregla 6 de 7 y deja ése roto
  sin explicar por qué justo ése. Es la SEGUNDA vez que este archivo
  queda afuera de algo por haberse escrito aparte del resto.
- Un error de consola se reportaba sin la URL: `msg.text()` de un
  recurso caído dice "Failed to load resource: the server responded with
  a status of 404 (File not found)" y nada más — ni qué archivo ni desde
  dónde. `msg.location().url` lo tenía y se tiraba. Un informe de fallo
  que no te deja avanzar un paso es casi tan malo como no tenerlo.
- Y con eso a la vista apareció lo de fondo: el 404 era `favicon.ico`,
  que el navegador pide SOLO contra la raíz del servidor —no contra la
  carpeta del curso— así que **todo paquete SCORM hacía fallar 4 de los
  7 tests** por algo que no es del curso y que en el LMS real ni ocurre
  (ahí la raíz es el host del LMS). Se ignora explícitamente. Dejarlo
  rojo por default es peor que ignorarlo: entrena a mirar la suite en
  rojo y asumir que siempre está así, que es el modo de fallar de §6.60
  otra vez —"0 fallos" que no quería decir nada—.

Con eso, la suite pasa de 3/7 a 5/7 contra un curso mínimo del kit; los
2 que quedan (`deep-audit`, `keyboard-a11y`) fallan CON RAZÓN, porque ese
curso mínimo trae los botones `sidenav`/`logros`/`glosario` del
boilerplate sin los pop-ups que cada curso escribe aparte.

### Documentación que decía algo distinto del código

`xapi.js` nombraba en su encabezado un `XAPI.track(...)` que nunca
existió (son 4 verbos: `experienced`/`answered`/`completed`/`awarded`);
un comentario de `motor-slides.js` nombraba `SCORM.getState()` (es
`loadState()`); el namespace `CotoUI` no incluía `initIndexJumps` ni
`initPopupPrefetch`, que estaban solo en los alias sueltos; y el árbol
"Qué hay" de `kit-base/README.md` listaba 3 de las 9 herramientas de
`tools/` y no mencionaba `js/curso.js`.

### Verificación

`node --check` limpio en los 29 `.js`/`.mjs`; `check-contraste` (23
categorías × 5 pares, 0 fallos), `check-css-duplicates` y
`check-raw-cat-colors` sin novedades; barrido de `@keyframes` definidos
contra usados (31 definidos, 0 huérfanos después del fix); cruce de IDs
del JS contra `header-boilerplate.html` y de clases del JS contra el CSS.
Y un curso mínimo armado con el propio kit, levantado en Chromium
headless: `boot()` sin errores ni warnings de consola, navegación con
etiquetas correctas, y los 4 arreglos del motor probados uno por uno
(gate abre pop-up, `data-goto` con gate abierto da UN solo
`slidechange`, pop-up anidado cierra el anterior, gate inexistente no
traba). Y la suite completa de 7 tests corrida contra ese mismo curso
mínimo: 5 en verde, y los 2 restantes fallando con razón por lo que le
falta al curso de prueba, no por el kit.

## 6.70 El halo de hallazgo del minijuego, atrapado en el zip del otro chat — y el choque de numeración que lo dejó pasar (kit-base v1.9.53)

Reportado desde el chat de "Seguridad alimentaria" siguiendo §0.1
(el relay pidió explícitamente auditar, no confiar). **Se auditó todo
contra el código real antes de tocar nada, y las 3 afirmaciones dieron
verdaderas** — vale dejar registrado que se verificaron, porque el
valor de §0.1 es justamente que un relay correcto y uno equivocado se
leen igual hasta que se chequea:

| Afirmación del relay | Verificación |
|---|---|
| `.d-mj-hotspot` no existe en el kit | `grep` en los 10 CSS + los 12 JS + boilerplate + spec: **0 ocurrencias** |
| `.d-mj-escena` necesita `position:relative` y hay que ver si el kit lo tiene | El kit tenía `overflow:hidden` y `aspect-ratio` pero **NO** `position:relative` |
| El contrato del repaso diverge | Kit: `modal-card--mj-repaso`/`d-mj-repaso-kicker`/`modal-x--mj-repaso` ✓ existen · `d-mj-repaso-card`/`d-mj-repaso-bd` ✗ no existen |
| El lote cinematográfico llegó fiel y compatible | `is-award-pulse`, `d-progress-locked`, `d-nav-unlock-glow`, `countTo(el, to, opts)`, el `:not(:has([data-hit], [data-place]))` del Ken Burns y el `Math.max(this.maxVisited, i)` de `_syncNav`: los 6 presentes con esos nombres |
| Las variables `--l/--t/--w/--h` y el keyframe `d-mj-hotspot-pulse` | Sin colisión con nada del kit |

### El choque de numeración: §6.17 otra vez, en vivo

Los dos chats usamos `v1.9.43` para cosas distintas — acá fue el lote de
7 mejoras "cinematográficas" (§6.64), allá fueron estos hotspots, y el
lote cinematográfico allá fue `v1.9.44`. Resultado: **este kit fue de
1.9.43 a 1.9.52 sin recibir nunca los hotspots**, que es literalmente el
patrón que §6.17 ya describe ("un fix queda atrapado en el zip de una
sesión aislada"). No se renumera nada retroactivamente: renumerar
reescribiría un historial que ya se citó en los dos lados y agregaría
una segunda fuente de confusión encima de la primera.

**Lo que sí queda escrito, porque es lo accionable:** las secciones
`§6.6x` de los dos `CLAUDE.md` NO se corresponden entre sí. Al citar una
sección en un relay entre chats, decir de qué chat es — un "§6.63" a
secas ya no identifica nada.

Y la lección de fondo, que §6.17 no cubría: el choque no se detectó por
comparar números de versión (los dos decían "1.9.43", y eso se lee como
que están sincronizados). Se detectó **aplicando el kit sobre el curso
real y viendo qué se rompía**. Dos zips con el mismo número no son el
mismo zip; lo único que dice la verdad es aplicar uno sobre el otro.

### La feature

Al acertar una opción del minijuego, además de que la píldora se ponga
verde, se resalta con un aro pulsante la zona REAL del dibujo que
explica ese hallazgo (acertar "Plagas" resalta la mosca). Aprobada por
el cliente y en producción en "Seguridad alimentaria".

No era una pérdida silenciosa —de esas que solo se notan auditando—:
sin el CSS, los 6 hotspots quedan `position:static` y las etiquetas
("Plagas", "Mala higiene"…) aparecen tiradas como texto suelto encima
del dibujo. Se ve roto a simple vista.

El detalle de por qué usa variables CSS (`--l/--t/--w/--h`) en vez de
`[data-hit]` + `_initShots()`, por qué la etiqueta es hija del aro, por
qué su tamaño va en `em`, y para qué existe
`data-mj-hotspot-lbl-pos="abajo"`, está donde corresponde: en el
comentario del propio bloque en `coto-minijuego.css`, junto al código.
Acá solo lo que no cabe ahí.

**La precondición que se agregó al subirlo (no estaba en el reporte):**
el argumento "el % del archivo mapea 1:1 al del contenedor" vale SOLO si
el curso puso `--mj-escena-ratio` igual a la proporción real de SUS
ilustraciones. Con un ratio equivocado, el `object-fit:cover` del `<img>`
sí recorta y los aros se corren del objeto, sin ningún error. Un curso
que necesite halos sobre un arte que NO llena el contenedor exacto tiene
que usar `[data-hit]` + `_initShots()`, que es justamente el caso para
el que `_initShots()` existe.

### Regla de método: las coordenadas se MIDEN, y la medición se verifica

Misma familia que §3.4, y vale para cualquier zona sobre un arte, no
solo para estos aros:

1. Medir con Python/PIL — bounding box por diferencia de color contra un
   punto de fondo limpio. Nunca a ojo.
2. **Verificar la medición dibujando el rectángulo detectado sobre la
   imagen real antes de usarlo.** Una medición automática equivocada se
   ve idéntica a una correcta hasta que se dibuja.
3. Cuando el feedback del curso afirma algo VISUAL que en miniatura no
   se distingue, medirlo también. Caso real: "Producto alterado" dice
   que una pieza de carne está más oscura que la otra, pero a ese tamaño
   las dos se ven casi iguales — el color promedio (`[213,138,124]` vs
   `[175,95,91]`) confirmó cuál era, y el halo va SOLO ahí. Poner el aro
   sobre la pieza equivocada habría contradicho el texto del feedback.
4. Si dos hallazgos comparten o se superponen en zona física, prenderlos
   JUNTOS con Playwright y sacar screenshot para ver si sus etiquetas
   chocan — no asumir que la posición por default alcanza. Acá el caso
   común (no el borde raro) era que chocaran.

### Divergencia conocida, deliberadamente no resuelta: el pop-up de repaso

Los dos chats construimos el repaso del minijuego con marcados
incompatibles (ver la tabla de arriba). Con el CSS del kit sobre el
marcado del curso, las reglas de compactación apuntan a clases que no
existen y el pop-up scrollea en mobile landscape (el otro chat lo midió:
419px de contenido contra 343 disponibles, detectado por un test propio
del curso).

No se toca el kit: su contrato es el mejor de los dos (sin `.modal-hd`,
con kicker propio, que es lo que permite compactar). **Cuando el curso
suba a esta versión, migra el curso hacia el contrato del kit, no al
revés.** Queda anotado acá para que la migración no se descubra a mitad
de una entrega.

### Verificación

`check-css-duplicates` y `check-raw-cat-colors` limpios sobre
`coto-minijuego.css`. Y la parte que importa, medida en Chromium sobre
un arte de proporción conocida con marcas en coordenadas exactas —no
mirando si "se ve bien"—: el aro cae con **0.00px de desvío** tanto a
800px como a 420px de ancho de escena, la imagen llena la escena sin
recorte en los dos, el `offsetParent` del aro es `.d-mj-escena` (o sea
el `position:relative` nuevo hace efecto), el estado apagado es
`opacity:0` sin animación y el encendido `opacity:1` con
`d-mj-hotspot-pulse`, y las dos etiquetas de zonas superpuestas quedan
separadas (52-73px contra 250-270px) gracias a
`data-mj-hotspot-lbl-pos="abajo"`.

## 7. Checklist de arranque rápido para un curso nuevo

> ⚠️ Las listas de este punto (módulos, cantidad de tests) son de su
> época y quedaron viejas. Las reglas al día están en
> `MANUAL-DEL-MOLDE.md` §2 (§7.53).

1. **Generar el curso con `tools/new-course.mjs`** (ver abajo). No se
   copia nada a mano y **nada del kit se edita** — el listado que sigue
   es para saber QUÉ hay disponible, no para armarlo uno.

   **⚠️ Este listado se desactualiza.** La fuente de verdad de qué
   módulos existen es `js/*.js` + la plantilla `js/curso.js`, que desde
   v1.9.80 menciona los 32 `init*` que el kit publica — si un módulo no
   está ahí, es un bug del kit (`check-globals` y `contrato-cableado`
   lo cubren desde dos ángulos distintos).

   - **JS (17)**: `motor-slides.js`, `narrador.js` (voz + `textOf()`),
     `scorm-api.js`, `xapi.js`, `fx.js`, `coto-player.js` (chrome),
     `coto-media.js` (los 4 patrones de video), `coto-ui.js` (pop-ups,
     stagger, count-up, precarga, sonidos, glosario, gates, repaso),
     `coto-quiz.js`, `coto-cierre.js`, **`coto-logros.js`** (puntos y
     logros), **`coto-piezas.js`** (revelado acumulativo, tandas, pasos
     y salida del repaso), **`coto-visor.js`** (visor de documentos,
     gate por documento leído, paginado en la diapositiva),
     **`coto-simulador.js`** (el motor de un curso-simulador: pistas
     con economía, reloj, derrota con retomar, hoja de ruta, zona
     resaltada, gate y lupa de pantalla — §7.27),
     **`escenario-boilerplate.js`** (la plantilla de DATOS de un
     simulador: se copia a `js/escenario.js` y se llena), y
     `curso.js` (la plantilla, lo ÚNICO que se escribe entero).
   - **CSS (13)**: `coto-base.css`, `coto-base-addendum-v1.8.css`,
     `coto-player-chrome.css` (§6.6), `coto-player-bottom.css` (§6.10),
     `coto-shot-stage.css` (lienzo 2:1, márgenes 8%/13%, §6.9),
     `coto-media.css`, `coto-fx.css`, `coto-quiz.css`,
     `coto-minijuego.css` (solo si el curso tiene minijuego),
     `coto-cierre.css`, **`coto-repaso.css`**, **`coto-piezas.css`**,
     **`coto-visor.css`**, **`coto-simulador.css`** y
     **`coto-gescom.css`** (los dos, solo en cursos-simulador §7.27).
   - **Resto**: `fonts/` (7 `.woff2`), `header-boilerplate.html`,
     `index-boilerplate.html`, **`simulador-boilerplate.html`** (el
     marcado que espera `coto-simulador.js`), `spec-motor-slides.md`,
     **`PROMPT-CURSO-NUEVO.md`** (el prompt de arranque, que viaja con
     cada curso generado), los **23 tests** de `tools/tests/` y las
     herramientas de `tools/` (`run-tests`, `verify-hitboxes`,
     `visual-regress`, `build-zip`, `new-course`, `import-storyline`,
     `build-evaluacion-xml`, `limpiar-recorte`, `pdf-capa-texto` y los
     6 chequeos `check-*`). El detalle de cada una está en
     `kit-base/README.md`.
   El orden de carga de `<link>`/`<script>` importa (cada uno depende
   del anterior) — está listado en `kit-base/README.md`, junto con el
   esqueleto de `boot()` que un `curso.js` nuevo debería tener.

   **Pasos 1-2 automatizados** (kit-base v1.9.48):
   `node tools/new-course.mjs <carpeta_destino> --titulo "Nombre del
   curso" --cat <categoría>` copia todo lo de arriba, genera
   `imsmanifest.xml` con los identifiers ya armados, y arranca
   `curso.js` desde la plantilla del kit con `COURSE_SLUG`/
   `COURSE_NAME` reales — `--cat` se valida contra las categorías
   reales de `coto-base.css`, no contra una lista que podría
   desactualizarse. **Genera el `index.html` COMPLETO** desde v1.9.60 (§7.08) — chrome,
   barra inferior, índice lateral, modales y orden de scripts. El texto
   viejo de este punto decía lo contrario y mandaba a adaptar a mano el
   index de otro curso, que es justo el método que §7.08 reemplazó
   (§7.18 K7).

   **Y el arreglo de §7.18 K7 quedó a medias hasta v1.9.80**: este mismo
   punto seguía terminando con "seguir con el método de zip de
   referencia de §7.1 para eso", o sea mandando otra vez a adaptar el
   index a mano. Lo que el generador arma es justamente el chrome
   completo —barra superior e inferior, sidenav, glosario, logros,
   modales y orden de scripts—, y precisamente PORQUE tiene tanto
   contrato de IDs exacto es que no se hace a mano: `initPlayer()` no
   tira ningún error si un id no calza, simplemente deja medio chrome
   muerto. El zip de referencia de §7.1 sigue sirviendo para UNA sola
   cosa: mirar el estándar de pulido.
2. Nuevo `imsmanifest.xml` (identifiers/título propios) — ya generado
   si se usó `tools/new-course.mjs` del paso 1.
3. Definir `data-cat` (categoría del manual que corresponde al área,
   ver §6.5 para la tabla oficial de colores por categoría) — ya
   validado por `tools/new-course.mjs` si se usó ahí; falta ponerlo
   en el `<body>` real de `index.html`.
4. Recibir PDF, renderizar a `.webp`, seguir el flujo del §3.
   **Antes de contar diapositivas, contar ESTADOS**: un PDF de N
   páginas casi nunca son N diapositivas — las variantes de una misma
   pantalla (pestañas, pasos de un carrusel, el "antes/después" de una
   zona interactiva, los pop-ups en su propia página) son UNA
   diapositiva con `initShotSwap`/`[data-popup]`, no varias. En
   "Seguridad alimentaria" 49 páginas dieron 26 diapositivas.
   Y correr `pdfinfo` (o equivalente) por página: un PDF puede mezclar
   tamaños de página entre secciones y forzar todo al mismo render
   estira lo que no coincide, en silencio (§6.32).
5. Escribir `curso.js` — **solo contenido**: textos, banco de
   preguntas, puntaje, IDs de diapositiva y el cableado entre los
   módulos del kit (`initPlayer`, `initPopupNarration`,
   `initBgVideos`, `initMiniQuiz`, `initCierreCelebration`...).
   Siglas propias del curso con `Narrador.addFixes()`. Más los 3 CSS
   propios (`assets.css`/`diapositivas.css`/`pulido.css` o los nombres
   que correspondan). Si estás escribiendo algo que no lee ningún texto
   ni ID de este curso, **parar**: eso va al kit (paso 7).
6. Si aparece un componente de interacción reutilizable → addendum,
   no en el CSS del curso. Documentarlo para el paso 7, no asumir que
   con tenerlo en la copia local del curso ya está "en el kit".
7. Si aparece una función 100% genérica → parchear la copia LOCAL del
   curso si hace falta para no bloquear la entrega, pero **el fix real
   se lleva al chat dedicado a `kit-base/` (§0.1), nunca se edita acá
   `kit-base/` como si esta sesión fuera la fuente de verdad**. Anotar
   el hallazgo (qué, causa real, el código) para no perderlo antes de
   pasarlo.
8. Gate de avance (§6.10) si el curso lo pide: `motor.canAdvance` +
   `data-require-seen`, y verificar que el handler de `advanceblocked`
   marque los pendientes, no solo niegue el paso.
9. Placeholders de video con nombre final si faltan los reales.
9.5. **Gamificación completa (§6.17.1, obligatorio, no opcional)**:
   antes de dar el curso por terminado, verificar explícitamente que
   estén los 4 elementos — chip de logros/puntos visible y funcionando
   en el header, botón "Glosario" con términos reales del curso, al
   menos una mini-práctica/quiz, y que las interacciones/gate sumen
   puntos de verdad. No alcanza con que los `<script src>` de los 6
   módulos estén cargados (eso ya lo audita §6.17) — hay que confirmar
   que cada pieza esté REALMENTE armada con contenido de este curso,
   no solo disponible sin usar.
9.6. **Checklist de consistencia de diseño (§7.3)** — repasarlo antes
   de dar el curso por terminado, no solo cuando el cliente se queja:
   headers de popups unificados, "Sonido" mutea todo, menú lateral
   respeta gates, sin hitboxes muertos, `curso.js`/`diapositivas.css`/
   `index.html` nunca tocan `kit-base/`.
9.7. **Evaluación para Moodle (§7.2)** si el curso la necesita:
   `tools/build-evaluacion-xml.mjs` + un JSON de datos (plantilla en
   `tools/evaluacion.ejemplo.json`) generan el **Moodle XML**
   importable — el único formato de entrega desde v1.9.56.
9.8. **Si el curso usa `initProgressSeek` (barra de progreso
   arrastrable) con avance bloqueado por contenido (§6.10)**: llamar
   `motor.restoreMaxVisited(estado.vistas)` (kit-base v1.9.39, §6.59
   punto 5) una vez, después de restaurar el progreso persistido — ya
   NO hace falta escribir el loop a mano ni el `Math.max` en cada
   `slidechange`, el motor se actualiza solo de ahí en más. Antes de
   esta versión había que calcularlo a mano desde el estado YA
   RESTAURADO al arrancar (`estado.vistas`), nunca solo desde
   `motor.index` en frío — si no, quien reabre el curso en una sesión
   nueva se encuentra con la barra creyendo que no vio nada, aunque
   puntos/logros sí restauren bien (§6.51, bug real que dio origen a
   esta función). Probarlo simulando una recarga de página después de
   avanzar, no solo en una sesión continua.
9.9. **Auditoría de narración: "lee correctamente y en orden"
   (§6.54 punto 5, regla permanente pedida por el cliente).** No
   alcanza con probar que "algo se narra" — hay que leer la salida
   REAL de `Narrador.textOf()` por diapositiva (no asumir por el
   marcado) y verificar: cada diapositiva empieza narrando su título
   (si el curso prendió `setNarrateTitles`); ningún texto queda
   "pegado" sin espacio (heurístico: minúscula seguida directo de
   mayúscula); las diapositivas de video de fondo narran `''`; y
   cualquier widget propio con estado "uno visible a la vez" (repaso,
   pasos armados en HTML real) esconde lo no-actual con el atributo
   `hidden` REAL, no solo una clase CSS — si no, se narra de más y
   puede revelar contenido antes de tiempo (bug real encontrado acá:
   2 preguntas de repaso narradas juntas). Si el curso tiene preguntas
   tipo Verdadero/Falso u otro formato donde la narración necesita
   avisar algo que solo se VE (unos botones, un ícono), usar
   `[data-narrate-prefix="..."]` en vez de tocar el texto visible.
   Construir un test de contenido tipo
   `check-narracion-completa.mjs` (recorrer todas las diapositivas,
   comparar contra estas 3-4 reglas) y dejarlo en la suite del curso,
   no como chequeo manual de una sola vez.
10. Suite de tests, 0 fallos. Además, `node tools/visual-regress.mjs
    <url> --update` (kit-base v1.9.50, §6.67) la primera vez que el
    curso queda visualmente terminado — graba la baseline de cada
    diapositiva. De ahí en más, correrlo SIN `--update` antes de
    cualquier entrega: si algo cambió visualmente sin querer (un CSS
    que se tocó, un asset que se reemplazó mal), avisa con un diff en
    `tools/visual-diff-out/`. Si el cambio fue a propósito,
    `--update` de nuevo y guardar los `.png` de `tools/visual-baseline/`
    junto con el resto del curso.
11. README propio del curso (bitácora, decisiones, bugs reales) —
    **no** se mezcla con este archivo.
12. Al cerrar el curso: **NO** editar este archivo desde acá (§0.1) —
    juntar en el README del curso (o en un mensaje aparte) todo lo que
    surgió y que no es contenido de este curso (nuevo componente
    candidato al addendum, nueva regla aprendida, bug genérico
    encontrado/evitado) y llevarlo, en un prompt, al chat dedicado a
    `kit-base/`. Ese chat es el único lugar donde este documento se
    edita.
13. Antes de armar el zip: `node kit-base/tools/check-image-weight.mjs
    <carpeta_del_curso>` (kit-base v1.9.48) — avisa si quedó algún
    `.png`/`.jpg` suelto en `img/` (el kit usa `.webp` únicamente,
    §3) o algún asset pesado de más que nadie recomprimió. Los videos
    pesados solo avisan, no frenan (`--video-mb` para ajustar el
    umbral si el curso lo justifica).
14. Nunca entregar el zip final sin pedido explícito. Armarlo con
    `python3 tools/build-zip.py <carpeta> <salida.zip>
    [carpetas_a_excluir...]` (kit-base v1.9.39) — nunca a mano con
    `zip`, para no perder el flag UTF-8 en nombres con tildes/ñ (§3.9).

---

## 7.05 Migrar un curso viejo de Storyline (kit-base v1.9.57)

Para el lote de cursos hechos con Articulate Storyline antes del kit.
`tools/import-storyline.mjs` no convierte el curso — **produce el
insumo que normalmente sale del PDF del diseñador** (una captura
`.webp` por diapositiva) más el texto y la estructura ya extraídos, y
un informe de qué queda a mano.

```bash
node tools/import-storyline.mjs <export-storyline/> <destino/> [--escala 2]
```

Sale: `img/NN-slug.webp` (una por diapositiva), `storyline-import.json`
e `INFORME-IMPORT.md`. Medido contra el export real de "Surtido sin
venta": 13/13 capturas, 7 mecánicas y 6 a mano.

**Lo que hay que saber antes de prometer una migración rápida** — los
cuatro obstáculos son reales y ninguno es automatizable:

1. **La proporción no coincide.** Storyline usa ~1.78-1.86; el kit,
   2.0 (§2.6). No es recortar — los layouts difieren. La herramienta
   NO recorta (perdería contenido en silencio): reporta la proporción
   y el reencuadre es a mano.
2. **La interactividad no sobrevive a una captura plana.** Se cuentan
   capas y estados por diapositiva y se marcan las que hay que rehacer
   con `initShotSwap`/`[data-layers]`. En el curso medido: 46 capas y
   416 estados en total, pero MUY concentrados — el minijuego solo
   tenía 22 capas y 277 estados.
3. **Los videos no viajan en el export.** Verificado: cero `.mp4` en
   el paquete. Y capturar una diapo de video plana hornea el
   reproductor de Storyline dentro de la imagen — el bug de §6.29.
   Esas diapos se rearman con `coto-media.js` y el video original.
4. **La locución es otro modelo.** Storyline trae audio grabado (42
   pistas en el curso medido); el kit narra con `speechSynthesis`. O
   se re-narra con el texto extraído, o hay que sumarle al kit soporte
   de audio grabado, que hoy no tiene.

**Tres trampas del formato Storyline, encontradas construyendo esto**
(las tres daban datos incorrectos EN SILENCIO, y por eso la
herramienta no cruza nada por título):

- **El orden de `data.js` no es el de reproducción.** Listaba la
  diapositiva 11 como "Lo que vimos en este video" cuando el menú
  —por donde se navega— dice "Logueo y precarga en PDA". Etiquetar
  con `data.js` nombra las capturas mal: la imagen correcta con el
  título de otra.
- **La etiqueta del menú y el título interno son campos distintos**, y
  ese título interno además puede estar DUPLICADO entre diapositivas.
  Cruzar contenido por título es imposible de hacer bien.
- **El audio se referencia solo desde `data.js`**, nunca desde el JS
  de cada diapositiva: contarlo por diapo daba 0 siempre.

La herramienta resuelve las tres por estructura: el orden y los
títulos salen del menú (`[role="treeitem"]` sin treeitems adentro —
así soporta cursos con varias escenas y no depende del idioma), y el
contenido se cruza por **qué archivo pide el player al abrir cada
diapositiva**, escuchando la red.

## 7.06 5 parches relayados desde "Uso de Sucursales 3 - NOA", verificados y aplicados (kit-base v1.9.58)

Primera vez que un relay llega como `.patch` (`git format-patch`, sin
repo acá — se aplicaron con `patch -p1`). Origen: una sesión probando
el kit contra un curso real ("Uso de Sucursales 3 - NOA") mientras
adoptaba los flotantes de Ayuda/Configuración. Los 5 se verificaron
contra el código real antes de tocar nada (§0.1) — estática primero
(lectura directa de cada archivo apuntado) y después dinámica
(Playwright contra una copia del curso overlayada con el kit
parcheado, más "Seguridad alimentaria" para los dos consumidores del
popover pinned). Los 5 resultaron ciertos.

1. **`js/coto-player.js`** — `initPinnedPopover()` no cerraba con Esc,
   solo con clic afuera o `slidechange`. Se agrega un listener de
   `keydown` que, si el foco quedó dentro del panel, lo suelta
   (`blur()`) antes de cerrar — necesario porque el CSS también abre el
   panel con `:focus-within` (`.d-audio-ctl:focus-within .d-audio-pop`,
   `.d-fab:focus-within .d-fab-pop`), así que sacar las clases sin
   soltar el foco deja el panel abierto igual. Afecta a los dos
   consumidores del helper: los popovers de audio de la barra superior
   y los flotantes de Ayuda/Configuración. Verificado en vivo contra
   "Seguridad alimentaria" (que sí trae el fab-stack): los dos abren y
   cierran con Esc, incluso con foco dentro del acordeón de Ayuda.
2. **`tools/tests/markup-sanity.mjs`** — bloque 5 nuevo: ids
   duplicados. `getElementById` toma siempre el primero del documento,
   así que un id repetido dejaba controles VISIBLES PERO MUERTOS, con
   0 errores de consola y los 7 tests en verde — exactamente la clase
   de fallo silencioso que este archivo existe para atrapar. Corrido
   contra la copia de referencia de NOA encontró el caso real:
   `#d-confetti` duplicado (dos divs idénticos, el segundo sin
   cablear) — bug de ESE curso, ya corregido ahí, no de kit-base (no se
   toca nada acá por eso).
3. **`header-boilerplate.html`** — el docblock del fab-stack no decía
   qué sacar al migrar un curso que venía con el drawer de Ayuda viejo
   (anterior a v1.9.36). Se agrega el checklist de 4 pasos: sacar el
   botón `data-popup-trigger="ayuda"` de la barra superior, sacar el
   modal `data-popup="ayuda"` entero, MOVER (no copiar) los 7 ids de
   voz/velocidad/reset al flotante de Configuración (duplicarlos es el
   mismo fallo silencioso del punto 2), y el contenido propio del curso
   va al acordeón `[data-fab-acc]`. Corregido de paso: el texto
   original decía "markup-sanity lo detecta desde v1.9.57" — la versión
   correcta es esta (v1.9.58), donde el chequeo del punto 2 se sumó
   realmente. Mismo choque de numeración que documenta §0.1: el parche
   se armó contra un kit-base propio de la otra sesión, con su propia
   cuenta de versiones.
4. **`js/coto-media.js`** — `initPopupVideos` no volvía a reproducir
   después de pausar. Mismo bug que ya se había corregido en
   `initInlineCircleVideos` sin portarse a este patrón: una vez que
   `play` prende `v.controls`, el clic sobre el video pasa a ser el
   toggle NATIVO del navegador — el handler propio corre ANTES y lee el
   estado viejo, así que sobre un video pausado llamaba `play()` a mano
   y el toggle nativo lo volvía a pausar acto seguido. Guard de una
   línea, idéntico al de la variante circular: `if (v.controls)
   return;`. Verificado disparando el evento de clic a mano en un
   video real de NOA: antes de esto el handler seguía actuando sobre un
   video con controles nativos ya prendidos; con el guard, deja de
   interferir apenas hay controles.
5. **`js/motor-slides.js`** — `closePopup()` no resincronizaba el gate
   de avance al cerrar con Esc. El listener de clic diferido de
   `_init()` cubre cerrar con la X o "Continuar" (son clics dentro de
   `root`), pero Esc no dispara ningún clic — así que `.is-gated`
   quedaba con el valor viejo hasta el próximo `_syncNav()`. Se ve en
   cualquier curso donde abrir la última ficha destraba el avance: el
   alumno la mira, cierra con Esc, ya cumplió el requisito y "Siguiente"
   sigue mostrándose bloqueado. Se agrega `this._syncGate(true)` al
   final de `closePopup()`, DESPUÉS de `_emit('popupclose')` a
   propósito — ese es el evento que los cursos usan para marcar la
   ficha vista, el estado que `canAdvance()` lee. Verificado en el
   navegador simulando el flujo completo (`canAdvance` dependiente de
   `popupclose`, popup abierto, cierre por `keydown` Escape sin ningún
   clic): `.is-gated` pasa de `true` a `false` solo por el cierre por
   teclado.

## 7.07 Segundo lote de "Uso de Sucursales 3 - NOA": 3 parches ciertos, uno descartado por diagnóstico incorrecto (kit-base v1.9.59)

Mismo curso que §7.06, segunda tanda: 9 parches de nuevo, pero esta vez
5 (0001-0005) eran contenido IDÉNTICO a lo ya aplicado en v1.9.58 —
`patch --dry-run` los reportó "previously applied", cero acción. De
los 4 restantes, 3 se verificaron ciertos contra el código real y uno
no se sostuvo — primer caso de este flujo donde una verificación
descarta un parche entero, no solo corrige un detalle.

1. **`css/coto-media.css`** — `[data-popup] video` fija
   `aspect-ratio:16/9` (`width:100%; height:auto`) pero nunca seteaba
   `object-fit`, así que el valor inicial (`fill`) estira cualquier
   video real que no sea exactamente 16:9 para llenar la caja —
   invisible con el placeholder de 0 bytes del kit (sin metadata real,
   no hay frame que deformar), por eso nadie lo había notado. Un
   `object-fit:cover` lo resuelve. Verificado leyendo la regla real
   (confirma la ausencia) y en vivo con Playwright: `getComputedStyle`
   sobre un video real de NOA da `object-fit: cover` tras el fix.
2. **`css/coto-shot-stage.css`** — solo documentación: la receta de
   una línea (`.slide.anim-r, .slide.anim-l{ animation:none; }` en el
   CSS del curso, después del archivo del kit) para apagar la
   animación de entrada de diapositivas cuando un cliente la encuentra
   molesta — sin tocar el default del kit, que existe porque OTRO
   cliente la pidió (v1.9.43). No hay una respuesta correcta única;
   documentar la receta evita redescubrirla la próxima vez.
3. **`css/coto-minijuego.css`** — documentación de una lección real: el
   `curso.js` de NOA pagaba los puntos del minijuego en un bloque al
   TERMINAR la partida, gateado detrás de un mínimo de aciertos, así
   que la tarjeta de puntaje se quedaba en 0 durante las primeras
   respuestas correctas y saltaba de golpe al llegar al mínimo —
   reportado como "algunas respuestas suman puntos y otras no". La
   lección (pagar por unidad de trabajo, en vivo) es válida, pero el
   parche recibido citaba un selector que NO EXISTE en el kit:
   `[data-mj-score]`. El selector real de la tarjeta de puntos es
   `.d-mj-stat--pts` (confirmado por grep — cero resultados para
   `mj-score` en todo el repo). Se aplicó la lección con el selector
   corregido, no el texto del parche tal cual.
4. **Descartado — `js/narrador.js`: reintento de narración por
   gesture-gating de Safari/iOS.** La premisa: el primer
   `speechSynthesis.speak()` de la página puede ser descartado en
   silencio por el navegador si no ocurre dentro de un gesto real, y
   sin eso `Narrador.progreso()` quedaría en `null` para siempre,
   dejando "Repetir"/la barra de locución deshabilitados. El parche
   agregaba un listener de gesto que reintenta `speak()` si
   `estadoActual` sigue en `null`. Trazando `speak()`/`hablarDesde()`
   (js/narrador.js): `estadoActual` se puebla DE FORMA SINCRÓNICA
   dentro de `speak()` —línea que asigna `estadoActual = {trozos, v,
   rate, kind, index:0, terminado:false}`— ANTES de que
   `hablarDesde(0)` llegue a llamar `synth.speak(u)`, y
   `emitirProgreso()` dispara el evento `narracionprogreso` en ese
   mismo tick síncrono. `initNarrateTimeline` (coto-player.js) habilita
   "Repetir"/la barra apenas `progreso()` devuelve `{total}` — que ya
   pasó a ser cierto en cuanto se llamó `speak()`, sin esperar a que el
   audio realmente suene. O sea: para cuando el usuario hace el primer
   gesto, `estadoActual` YA no es `null` en el escenario exacto que el
   parche dice resolver (el navegador descartó el audio mismo, pero el
   estado JS síncrono ya se completó antes de eso) — la condición de
   reintento (`ultimoIntentoNarrador && !estadoActual`) no se cumple
   nunca para ese caso. El síntoma reportado ("un bloqueo" en
   Repetir/Adelantar) puede ser real, pero esta causa raíz no se
   sostiene contra el código actual — no se aplicó. Si vuelve a
   aparecer el síntoma, hay que buscar la causa en otro lado (por
   ejemplo, si el panel realmente queda deshabilitado en el dispositivo
   real reportado, medir qué evento — o falta de evento — deja
   `progreso()` en `null` en ESE momento, en vez de asumir el mecanismo
   ya usado para `AudioContext`/`huboGesto` en `coto-ui.js`).

## 7.08 Auditoría de los 2 cursos terminados: el kit pasa a generar el `index.html` y a ser dueño de los puntos/logros (kit-base v1.9.60)

El pedido fue literal: *"la idea es que el kit base pueda crear estos
cursos — con nuestro último kit base tuve que hacerle muchos edits
para llegar a estos cursos finales"*. Se auditaron los dos cursos
terminados ("Uso de Sucursales 3 - NOA" y "Seguridad alimentaria")
contra kit-base v1.9.59.

**Estado de salud primero, porque cambia la lectura del resto:** los
dos pasan la suite oficial **7/7 en verde**, y ninguno tiene arreglos
locales metidos en archivos del kit. NOA no tiene NI UNA modificación
propia en archivos del kit (todo su drift son agregados posteriores
del kit); "Seguridad alimentaria" está ~15 versiones atrás (v1.9.44) y
su drift es puro envejecimiento — su `narrador.js`, que era el
sospechoso por tener 47 líneas que el kit no tenía, resultó
funcionalmente idéntico, solo con los comentarios de la versión vieja.
O sea: el problema NO era la calidad de los cursos ni parches sin
subir. Era cuánto hay que escribir a mano para llegar a ellos.

### Lo que se midió

`new-course.mjs` generaba ~4.200 líneas (archivos del kit + manifest)
y dejaba ~3.000 por curso a mano: `index.html` (1.372 en NOA / 1.586
en SA) y `curso.js` (1.464 / 1.572). El propio script lo decía en su
docblock: *"No genera `index.html`"*, con el argumento de que el
chrome tiene "demasiados IDs/clases con contrato exacto" para
fabricarlo con confianza.

Los números dieron vuelta ese argumento:

- El chrome de cabecera de los dos cursos difiere en **73 de ~180
  líneas**, y esas diferencias son PARÁMETROS: `<title>`, color del
  favicon, `data-cat`, un `<link>` extra si hay minijuego, y qué
  íconos del sprite usa. La estructura y el contrato de ids son
  idénticos.
- De los **27 ids** que el JS del kit busca por `getElementById`,
  `header-boilerplate.html` ya satisfacía **23**. Los 4 restantes
  (`d-autoplay`, `d-cert-doc`, `d-confetti`) están todos guardados con
  `if (!el) return` — son opcionales de verdad.

Conclusión: "tiene demasiados contratos exactos" es el argumento a
FAVOR de generarlo. Un generador acierta el contrato siempre; una
adaptación a mano es donde se rompe, y se rompe **en silencio** —
`initPlayer()` no tira ningún error si un id no calza, simplemente
deja medio chrome muerto.

### 1 · El kit genera el `index.html` completo

`index-boilerplate.html` (plantilla con tokens) + la etapa 5 de
`new-course.mjs`. Decisión de diseño importante: el chrome de la barra
**no está copiado** en la plantilla — el generador inyecta
`header-boilerplate.html` en el momento de generar, así hay UNA sola
fuente de verdad. Dos copias de la misma barra era garantizar que se
desincronicen, que es el bug que este kit ya pagó con el sprite y con
los popovers.

**Verificación real:** se generó un curso desde cero
(`--titulo "Higiene y seguridad" --cat seguridad-higiene`) y se le
corrió la suite oficial: **7 de 7 en verde, sin un solo edit a mano.**

Llegar a ese 7/7 destapó **5 defectos de contrato** que hoy se pagan
en cada curso hecho a mano — la primera pasada dio 5 tests en rojo:

1. **`data-slide-index` faltaba.** El motor lo **LEE**
   (`+a.getAttribute('data-slide-index')` para ordenar), no lo asigna.
   Sin él todas las diapositivas leen 0 y `deep-audit` tira "índice no
   consecutivo" una vez por diapositiva.
2. **Faltaba el envoltorio `.d-app`.** No es decorativo:
   `coto-player-chrome.css` lo define `position:fixed; inset:0;
   display:grid` con `grid-template-rows: 56px 1fr 64px` — las tres
   filas del molde. Sin él `markup-sanity` falla directo ("no existe
   .d-app") y, peor, el contenido fluye y CADA diapositiva se va de
   alto ~44px en las 5 resoluciones (`scroll-audit`). Un solo error
   estructural, 2 tests en rojo y decenas de líneas de reporte.
3. **`#i-check` duplicado.** El sprite base lo definía y
   `header-boilerplate.html` también: id repetido, o sea el fallo
   silencioso del §7.06 punto 2. Se sacó del sprite del generador.
4. **Placeholders `<>` sin resolver.** `header-boilerplate.html` trae
   `<NOMBRE DEL CURSO>`, `<CATEGORÍA>` y `img/icono-<CATEGORIA>.webp`
   para rellenar a mano. El del logo es un **404**, y la suite cuenta
   cualquier error de consola como fallo: **3 tests en rojo** por un
   placeholder olvidado.
5. **El logo no existía aunque el nombre estuviera bien.** Se escribe
   un WebP de 1x1 transparente (44 bytes) como placeholder real, así
   el curso arranca en verde y el ícono se reemplaza cuando el
   diseñador lo entrega, sin tocar el HTML.

De paso, la capa `#d-confetti` se emite desde el generador, una sola
vez, en la diapositiva de cierre: cierra las dos puntas del bug de NOA
(faltar, y estar duplicada).

El color del favicon sale de `--cat-strong` de la categoría, leído del
CSS real — no de una tabla copiada en el script que se desactualice.

### 2 · `coto-logros.js` — puntaje y logros suben al kit

Comparando los dos `curso.js` función por función: `award` 92% de
similitud, `unlockBadge` 96%, `renderBadges` 88%, `updateHud` 67%.
El kit ya era dueño de TODO lo demás de esa pieza — el marcado
(`#d-badge-count`/`#d-points` en el boilerplate), el CSS de las
tarjetas, el pulso del chip, la moneda de `fx.js`, el sonido de
`CotoUI.sStreak` — y lo único que no vivía acá era el pegamento entre
todo eso, justo lo que cada curso reescribía.

**El costo ya estaba pagado, y es el mejor argumento:** "Seguridad
alimentaria" tenía el conteo animado (`CotoUI.countTo`), el pulso del
chip y `XAPI.awarded`; "Uso de Sucursales 3 - NOA", armado DESPUÉS, no
los tiene. La duplicación no cuesta solo líneas: hace que un curso
nuevo ARRANQUE PEOR que el anterior, porque el que copia no sabe qué
mejoras había que traerse. El módulo toma como base la versión más
completa de las dos.

El seam quedó donde corresponde: el kit se queda con el mecanismo, el
curso con el CATÁLOGO de logros (contenido) y con CUÁNDO otorgarlos
(sus reglas). La persistencia no la hace el módulo por su cuenta —
cada curso guarda además sus propias claves y `suspend_data` tiene
4096 caracteres contados: expone `serialize()`/`restore()` y el curso
los mezcla con lo suyo. Las claves son las MISMAS que ya usaban los
dos cursos (`p`/`b`), así un curso que migre sigue leyendo el
suspend_data que ya tenía guardado.

Verificado en vivo contra el marcado real de NOA: HUD, `countTo`,
idempotencia de `unlock()`, rechazo de ids fuera del catálogo,
contrato de tarjetas (`.d-badge` con `.i`/`.n`/`.d`), round-trip de
`serialize()`→`restore()` y `restore(null)` sin romper. Cero errores.

### 3 · Ícono de Locución tachado cuando está apagada

Pedido del curso. Antes, apagado y prendido se distinguían SOLO por
dos ondas chiquitas al costado del micrófono — al tamaño real de la
barra eso no se lee, y no quedaba claro si el curso estaba narrando.
Ahora el estado apagado lleva raya diagonal, el mismo lenguaje que ya
usaba "Sonido" (parlante tachado al mutear): apagado = tachado en los
dos controles de audio, sin dos convenciones distintas en una barra.

### Lo que se decidió NO subir

`initMinijuego` da **6% de similitud** entre los dos cursos (450 vs
346 líneas): son juegos genuinamente distintos, no dos copias del
mismo. Confirma que estuvo bien haber frenado las propuestas B2/B3 de
`PROMPT-KIT.md` en la ronda anterior — sin un segundo caso real que
muestre la forma correcta, generalizar ahí es inventar. Queda pendiente
como candidato si aparece un tercer curso que lo necesite.

Sí quedan medidos y anotados para una próxima vuelta:
`initRepasoRapido` (~95 líneas, 70% de similitud — el bloque duplicado
más grande, y §6.46 lo había declarado "course-only" antes de que dos
cursos lo implementaran casi igual) y `persistir`/`restaurar` (56-59%,
área que el kit ya vigila con el checker de suspend_data pero cuya
lógica no provee).

## 7.09 Relay de "Surtido sin ventas": 2 bugs silenciosos, 2 mejoras de herramienta y una técnica que sube al kit (kit-base v1.9.61)

Tercer chat de curso que relaya (los anteriores, §7.06 y §7.07), esta
vez sobre v1.9.57. El informe venía bien armado: separaba "parches ya
verificados" de "hallazgos SIN parche, verificar contra el código real
ahí" y de "lecciones a documentar" — el formato que §0.1 pide.

**Los parches adjuntos ya estaban aplicados… salvo medio.** Los 5
`.patch` son los mismos de §7.06, en el kit desde v1.9.58. Pero hay
una trampa que vale anotar: `patch --dry-run` reportó "previously
applied, 2 out of 2 hunks ignored" para `04-coto-media.patch`, y era
mentira a medias — el primer hunk sí estaba aplicado, y `patch`
descarta el archivo entero apenas detecta eso, sin llegar a mirar el
segundo. El segundo (`data-shot-swap-nofade`) era genuinamente nuevo.
**Moraleja para el próximo relay: la salida de `patch` no es una
verificación.** Un `grep` del símbolo que el hunk introduce sí lo es,
y es lo que destapó la diferencia.

### Los dos bugs, los dos silenciosos

1. **`.d-mj-shot`/`.d-mj-fin` sin `height` — latente desde v1.9.21.**
   Tenían `container-type:size` y `display:block`, sin alto. Se suman
   dos cosas: un bloque no hereda el alto de su padre por estar dentro
   de un `height:100%`, y `container-type:size` aplica contención en
   LOS DOS ejes, o sea que el elemento deja de mirar su contenido para
   calcular su propio alto. Colapsa a 0 — y como los hijos se miden en
   `100cqh` del propio contenedor, todo lo de adentro colapsa con él.
   Verificado con una repro mínima en Chromium sobre el marcado real:
   `.d-mj-shot` daba 900x**0**, `.d-shot` 0x0, y un `[data-hit]`
   declarado 20%x12% terminaba midiendo **16x6 px** — el residuo del
   texto del botón, no la zona que dice tener. Con `height:100%`:
   900x500 y el hitbox en 180x60. Cero errores de consola: el arte
   simplemente no está y los hitboxes son inservibles.
   El relay lo encontró con `verify-hitboxes.mjs` en la intro de un
   minijuego, y avisó que su propio curso ya NO usaba ese patrón — o
   sea, lo relayó sabiendo que a él ya no lo afectaba. Es el mejor
   tipo de relay que puede llegar acá.

2. **`verify-hitboxes.mjs` producía informes que no describían lo que
   decían describir.** Navegaba clickeando el `[data-goto]` del índice
   lateral. En un curso con gate de avance, `initIndexJumps()` deja
   `disabled` los ítems no vistos, y un clic sobre un botón `disabled`
   es un no-op **silencioso**: el script seguía su bucle sacando
   mediciones que eran todas de la última diapositiva alcanzable,
   repetida. Un informe completo, con pinta de correcto, sobre
   diapositivas que nunca visitó — el peor modo de fallar posible para
   una herramienta cuyo único trabajo es verificar.
   Ahora usa `motor.go(idx, true)`: saltea gates a propósito, sin
   animación, mismo criterio que `?review=1`. `visual-regress.mjs` ya
   lo hacía bien, y su comentario decía "mismo criterio que
   verify-hitboxes.mjs" — una afirmación que había dejado de ser
   cierta y que nadie notó, porque los comentarios no se testean.
   Corregido también.

### Las dos mejoras de herramienta

3. **`import-storyline.mjs` mandaba diapositivas de video a la pila
   mecánica.** `clasificar()` solo miraba capas y estados, y una
   diapositiva de video en Storyline suele tener una capa y pocos
   estados: caía en "simple", cuyo motivo literal es "la captura sirve
   como `.d-shot-img`". Es exactamente el error de §6.29 — capturarla
   plana hornea el reproductor de Storyline dentro de la imagen, y el
   cliente después reporta "el botón de play no funciona" porque está
   tocando píxeles dibujados. En ese curso pasó dos veces y se
   descubrió mirando las imágenes a ojo, que es justo lo que la
   herramienta existe para evitar.
   La señal barata estaba ahí sin usar: el texto que la propia
   herramienta ya extrae. Si menciona video, va a revisión manual. La
   heurística es asimétrica a propósito — solo puede mover una
   diapositiva HACIA "a mano", nunca al revés: un falso positivo
   cuesta cinco segundos de mirada, un falso negativo cuesta un
   reproductor horneado descubierto con el curso ya entregado.

4. **`data-shot-swap-nofade`** (`js/coto-media.js`), opt-in por grupo.
   Lo que generaliza no es "a este cliente no le gustó el fundido"
   sino una regla sobre **qué porción del arte cambia**: el fundido de
   v1.9.51 funde la imagen ENTERA, así que cuando las variantes
   comparten casi todo el cuadro y solo cambia un panel, lo que se
   percibe es "la pantalla entera se apagó un instante" —incluida la
   columna que no cambió— en vez de "se actualizó ese panel". Con
   variantes que cambian de punta a punta el fundido sigue siendo lo
   correcto, así que el default no se toca. Verificado en vivo sobre
   "Seguridad alimentaria": con el default aparece
   `.d-shot-img--fade`; con el atributo no aparece nunca y el `src`
   cambia en el mismo tick.

### La técnica que sube al kit

5. **`tools/limpiar-recorte.mjs`.** Cuando el PDF de referencia trae
   el arte como página plana, recortar una ilustración se lleva puesta
   la sombra suave del elemento de al lado, y no hay capas que
   separar. La técnica: blanquear un píxel solo si es "casi gris" (los
   tres canales dentro de una tolerancia) **y además** claro (por
   encima de un piso). Las dos condiciones juntas son lo que la hace
   funcionar — solo "casi gris" se comería los contornos y los ojos
   del dibujo (también grises, pero oscuros); solo "claro" se comería
   los blancos legítimos del arte.
   Sube al kit por el criterio de §4 y con margen: se usó **3 veces en
   un solo curso**, y quedan ~20 migraciones de Storyline por delante
   (§7.05). Sin dependencias nuevas — usa el `pngjs` que ya estaba
   para la regresión visual. Probado contra una imagen sintética con
   las cuatro zonas que importan: sombra gris clara → blanqueada;
   rojo del arte → intacto; línea oscura → intacta; casi-blanco de
   fondo → blanqueado.
   La advertencia sobre `--alfa` quedó en el encabezado del archivo y
   es la parte que más fácil se pierde: transparentar en vez de
   blanquear sirve SOLO si el elemento no tiene zonas propias blancas.
   Una guirnalda anda; un personaje con casco blanco se agujerea, y no
   se nota hasta que el arte queda sobre un fondo de otro color.

Los puntos 1 y 2 del grupo "lecciones" del relay (contexto de
apilamiento con `z-index:-1`, y versionar el nombre de un asset que se
corrige dos veces) quedaron como §7.3 puntos 18 y 19, que es donde se
buscan cosas así.

## 7.10 Relay de "Prevención cardiovascular": el kit se autoinfligió un bug en v1.9.60 y lo encontró el primer curso que lo usó (kit-base v1.9.62)

Cuarto relay seguido (§7.06 a §7.09), y el más limpio de todos: 4
parches contra v1.9.61, los 4 ciertos, los 4 aplican sin conflicto.
Vale anotar el contraste con las primeras rondas de este chat, donde
un lote llegó a tener 6 de 7 puntos inventados: el formato de relay
que pide §0.1 —síntoma, diagnóstico, y cómo se verificó— viene
funcionando.

### 1 · El bug que se autoinfligió el kit

`coto-logros.js` (v1.9.60, §7.08) saca sus avisos con
`global.Player.toast(...)`: el "+N · motivo" de cada `award()` y el
"🏆 Logro: …" de cada `unlock()`. Pero `initPlayer()` solo DEVOLVÍA su
API — nunca la publicaba en `window` — y tanto el boilerplate de
`js/curso.js` como los dos cursos terminados la guardan en una
variable local del IIFE del curso. `global.Player` era `undefined`, así
que **todos esos toasts estaban muertos**, sin un solo error en
consola.

Lo que hace este caso digno de anotar no es el fix (una línea) sino
por qué no lo agarró nadie acá: `coto-logros.js` se escribió en el
mismo chat que tiene los dos cursos de referencia, se probó contra el
marcado real de uno de ellos, y **pasó** — porque la prueba llamaba a
`initLogros()` a mano sobre una página donde el curso ya había corrido
su propio `initPlayer()`… que en ESA página sí dejaba un `Player`
alcanzable por otras vías. La verificación tocó el módulo nuevo, no la
integración real (curso arrancando de cero con el boilerplate). El
módulo andaba; el cableado no.

**Regla que deja:** cuando un módulo nuevo del kit depende de un
símbolo global que produce OTRO módulo, verificar que el productor lo
publique — no alcanza con que el consumidor funcione en una página
donde el símbolo ya estaba por casualidad. El `grep` que faltaba era
de una línea: `grep -n "global.Player =" js/coto-player.js` → 0
resultados.

Fix: `initPlayer()` publica `global.Player` además de devolverlo, el
mismo criterio defensivo que ya usaba `initVideoSafetyNet()` dos
líneas más arriba en ese archivo ("que no dependa de que cada curso se
acuerde"). Verificado en vivo contra NOA: `award()` saca "+10 · Ficha
completa" y `unlock()` saca "🏆 Logro: Explorador"; antes, nada.

Nota de método, porque me hizo perder dos mediciones: el primer test
buscó el toast en `#d-toast` (el elemento del curso) y el segundo con
`querySelector('.d-award-toast')` — y `toast()` CREA su propio
elemento, del que el curso ya tenía uno vacío. Los dos dieron "no
aparece" sobre un fix que sí andaba. La medición correcta era el
ÚLTIMO `.d-award-toast`, no el primero. Un "no anda" propio también se
verifica antes de creerlo.

### 2 · `initVideoGate()` — el "cómo" que faltaba desde v1.9.9

`videoUsable()` fijó la regla hace mucho: no exijas un video que no se
puede reproducir, o el curso queda imposible de terminar. Pero nunca
dio el mecanismo, así que cada curso lo improvisaba — y hay una forma
tentadora de improvisarlo que sale mal: mirar el `<video>` de la
diapositiva. En "Prevención cardiovascular", de 9 diapositivas con
gate solo 2 (video circular) tienen un `<video>` en el DOM; las otras
7 lo abren en pop-up y no hay nada que inspeccionar hasta que el
alumno lo abre. Con los `.mp4` en placeholder de 0 bytes —el estado
normal durante casi todo el armado (§3.9)— esas 2 se eximían y las 7
seguían trabadas. Eso es PEOR que trabarse en las 9: la incoherencia
parece un bug de contenido de esas diapositivas puntuales y manda a
buscar donde no está.

`initVideoGate()` sondea cada `src` declarado en `data-require-seen`
con un `<video>` suelto, así que hace la MISMA pregunta para los 4
patrones de video del kit, y se responde sola cuando entran los
archivos reales sin tocar código. Devuelve
`{ faltan(slideEl), marcarVisto(src), visto(src), roto(src) }` y toma
el mismo `vistoOpts` que los `init*Videos`.

Verificado en las dos direcciones, que es lo que importa en un gate:
con un `.mp4` de 0 bytes lo marca roto y `faltan()` devuelve `[]` (el
curso se puede terminar); con un webm reproducible de verdad
—generado con el propio Chromium para la prueba— `faltan()` bloquea, y
tras `marcarVisto()` destraba.

### 3 · Una clase que pasó a tener consecuencia

`.d-shot-slide--bg-video` empezó dimensionando el lienzo, nada más;
copiarla de más era inofensivo. Desde que `Narrador.textOf()` la usa
como señal —"una diapositiva que ES un video no se narra", devuelve
cadena vacía— pasó a ser una clase CON consecuencia: una diapositiva
mal marcada se queda **muda**. Sin error de consola, con el `.sr-only`
intacto en el DOM, así que ni `deep-audit` ni un lector de pantalla lo
delatan. En ese curso eran 15 de 18, por copiar y pegar la anterior.

El chequeo nuevo de `markup-sanity` usa el selector EXACTO de
`initBgVideos()` (`video.d-shot-video`), así que un video circular o
de pop-up no cuenta como "video de fondo" — que es justo la distinción
que hace falta para no llenar el informe de ruido. Verificado en las
dos direcciones: detecta una diapositiva inyectada a propósito, y no
da falsos positivos ni en NOA ni en "Seguridad alimentaria".

**Lección más general, y la razón de que esto sea §7.10 y no una línea
de changelog:** cuando una clase que era decorativa pasa a ser una
SEÑAL que cambia comportamiento, todo el marcado viejo que la copiaba
de más se convierte retroactivamente en bugs. El cambio que la
convierte en señal es el momento de sumar el chequeo, no dos cursos
después.

### 4 · Se saca el desplazamiento lateral (cambio de default)

No es un bug: es producto. La historia quedó anotada en el propio
archivo para no rediscutirla desde cero — `translateX(2.5%)`/320ms
hasta v1.9.42; subida a `translateX(5%) + scale(.985)`/420ms en
v1.9.43 porque un cliente pidió dinamismo; NOA la apagó por curso y
§7.06 documentó ese opt-out como receta, bajo la premisa de que era
gusto de cada cliente. Esa premisa es la que cae acá: al subirla a 5%
la queja dejó de ser puntual y pasó a ser sobre el molde, así que se
cambia el default en vez de repetir el opt-out curso por curso.

Queda el fundido de opacidad, que resuelve el pedido original ("que no
aparezcan de golpe") sin lo que se objeta ahora. `anim-l`/`anim-r`
siguen existiendo y el motor las sigue poniendo — no se toca
`motor-slides.js`, y un curso que quiera el desplazamiento puede
redefinir los keyframes en su propio CSS. `prefers-reduced-motion`
sigue apagando todo.

## 7.11 Auditoría del 3er curso terminado ("Prevención cardiovascular"): con tres cursos, lo que se repite deja de ser opinión (kit-base v1.9.63)

Primera auditoría con **tres** cursos terminados sobre la mesa, y eso
cambia el método: hasta acá, decidir si algo subía al kit era un juicio
sobre dos casos. Con tres, una función que aparece en los tres con el
mismo cuerpo ya no es una coincidencia que haya que interpretar.

**El estado del curso, primero, porque cambia la lectura del resto:**
cero drift — usa los archivos del kit sin tocar UNO solo — y tiene 17
funciones propias contra 20 de NOA y 34 de "Seguridad alimentaria". No
es que este curso sea más simple: es que ya se apoya en los módulos que
el kit fue absorbiendo (§7.08, §7.10) en vez de reimplementarlos. La
cuenta de funciones de `curso.js` es, de hecho, una buena métrica de si
el kit está haciendo su trabajo.

### La pregunta que llegó con el curso: el glosario

*"¿el glosario está bien definido de cómo debe funcionar? por orden de
aparición, bloqueado, y clickeable después"* — las tres cosas estaban
implementadas y dos documentadas (§6.52 el desbloqueo atado a
`estado.vistas` y la navegación por `data-goto`; §6.63 el
`link.disabled` que faltaba, porque `.is-locked` solo pintaba el `<dt>`
y dejaba el botón clickeable, saltándose el gate).

Lo que NO estaba escrito en ningún lado era **el orden**. El código lee
los `<dt>` en el orden del HTML y no los ordena nunca, así que "orden
de aparición" era comportamiento emergente, no una regla — y un curso
nuevo podía asumir razonablemente que el kit ordena alfabético. Ahora
está explicitado en `initGlossaryUnlock()`, con el motivo: el orden de
aparición encaja con el desbloqueo progresivo, porque deja lo
desbloqueado arriba y lo pendiente abajo, y el glosario se lee como un
mapa del avance. Un curso puede escribirlos alfabéticos si quiere —el
kit es agnóstico— pero el default del molde no es "cualquiera".

### Lo que pidió guardarse: el repaso final antes del resumen

*"tiene un repaso final antes del resumen que está bueno para
guardarlo"*. Buena noticia: **ya está todo en el kit**, y el curso no
aporta código nuevo ahí — solo cablea dos módulos que ya existen.
`initMiniQuiz()` (coto-quiz.js) ya hace el sorteo de N preguntas de un
banco más grande, mezcla las opciones, da explicación inmediata y link
de repaso a la diapositiva relacionada si la respuesta fue incorrecta;
`initCierreCelebration()` ya trae el cierre en 2 pasos
(`[data-cierre-step]`: captura → resumen) y el `unlockCierre()` que lo
destraba. Lo único propio del curso es el contenido del banco y el
aviso de "esto NO es la evaluación", que es texto de ese cliente.

Vale anotarlo igual, porque la pregunta es razonable y va a volver: que
un patrón esté en el kit no se nota desde el curso, donde se ve como
diez líneas de cableado en `boot()`. Si algo "está bueno para
guardarlo", la primera pregunta es si ya está guardado.

### Lo que sí subió

**1 · `initPopupGate()`.** `faltanPopups()` estaba en los TRES cursos,
con el mismo cuerpo. Cambiaba el nombre del atributo —
`data-require-popups` en dos, `data-require-fichas` en el tercero — y
qué mapa de estado leía. Esa divergencia de nombres es el síntoma
clásico: nadie decidió que fueran distintos, aparecieron distintos
porque cada curso lo escribió de cero. Y el kit ya tenía la MITAD del
problema resuelto: `initVideoGate()` (§7.10) hace exactamente esto para
videos. Faltaba la de pop-ups, así que un curso que gatea por las dos
cosas escribía una mitad llamando al kit y la otra a mano.
Mismo contrato `faltan(slideEl)` a propósito. Y absorbe también el
listener de `popupopen` que marca visto — otra cosa que los tres
repetían igual.

**2 · `initGateHints()`, y este es el que más duele.** El kit ya tenía
el CSS: `.d-shake` para que "Siguiente" tiemble, `.d-nudge` para que
pulse el elemento pendiente, los dos con su `prefers-reduced-motion`,
extraídos de este mismo curso hace versiones. Lo que nunca subió fue el
JS que los dispara. O sea, el kit tenía la animación guardada y cada
curso tenía que acordarse de cablearla — **exactamente el mismo seam
mal puesto que §7.08 encontró con los puntos y logros**: el kit dueño
del marcado y del estilo, el curso dueño del pegamento. Que el mismo
error de división aparezca dos veces en dos áreas distintas lo
convierte en una regla: si el kit ya tiene el CSS de un
comportamiento, preguntarse quién lo dispara — si la respuesta es "cada
curso", falta la mitad del componente.

Lo que aporta de verdad: un gate que solo dice "no podés avanzar" deja
al alumno buscando qué le falta. Con esto el curso señala la
interacción pendiente y dice cuántas quedan. Se avisa por el PRIMER
gate con pendientes y no por todos — tres toasts encimados sobre el
mismo intento es ruido, y el orden del array lo decide el curso.

**3 · `.d-nudge` se desata de `.d-shot-hit`.** El selector era
`.d-shot-hit.d-nudge`, o sea que el pulso solo funcionaba si el
elemento pendiente era una hitbox sobre la captura. En este curso los 4
triggers gateados SÍ son hitboxes, así que andaba — pero es
casualidad del marcado de este curso: un trigger que sea una tarjeta o
un botón del cuerpo de la diapositiva recibía la clase y no pasaba
nada, un no-op silencioso. Ahora `.d-nudge` anima solo, y el
`border-radius` extra queda para la hitbox, que es la que no trae uno.

### Método: la cuenta de funciones como señal

Comparar `curso.js` función por función entre los cursos terminados
resultó, otra vez, la herramienta más productiva de esta auditoría —
igual que en §7.08. Con tres cursos se le puede pedir más: lo que está
en los tres con el mismo cuerpo sube sin discusión; lo que está en dos
se mira; lo que está en uno se anota y se espera. `initMinijuego`
sigue dando ~6% de similitud entre cursos y sigue sin subir, tres
cursos después — la espera también es un resultado.

## 7.12 "¿Por qué tengo que hacer decenas de ediciones?" — la respuesta, medida: el 95% del CSS de curso pisa al kit (kit-base v1.9.64)

Ronda con los TRES cursos terminados juntos más dos lotes de parches.
La pregunta que la originó fue concreta: *"los hice a partir del kit
base pero tuve que hacerle decenas de ediciones para que lleguen a su
versión final"*. Vale la pena anotar cómo se respondió, porque la
primera medición que se me ocurrió NO era la buena.

### La medición que no servía, y la que sí

Primer instinto: comparar los archivos del kit en cada curso, buscando
ediciones locales. Resultado: **NOA y "Prevención cardiovascular" no
tienen NI UNA** (su drift era exactamente lo que este kit les sacó
después: el certificado y el desplazamiento lateral), y el de
"Seguridad alimentaria" es envejecimiento, no edición. O sea: por ahí
no eran.

Segundo instinto: comparar los `.css` propios buscando clases
repetidas entre cursos. De 80/91/53 selectores propios, **una sola**
aparece en los tres. Tampoco era duplicación de nombres.

La medición buena fue otra pregunta: **¿a qué le apuntan esas reglas?**

| curso | reglas propias | pisan clases del kit |
|---|---|---|
| Uso de Sucursales 3 - NOA | 241 | 233 (**96%**) |
| Prevención cardiovascular | 254 | 238 (**93%**) |
| Seguridad alimentaria | 132 | 125 (**94%**) |

Ahí está la respuesta. Casi nada del CSS de un curso es diseño propio:
es el curso ajustando lo que el kit ya define. Y el ranking de clases
pisadas señala el lugar exacto: `.d-repaso-item` (31), `.d-repaso-btns`
(27), `.d-repaso-fb` (16), `.d-repaso` (15)… **106 reglas de
`.d-repaso*`** entre dos cursos.

**La lección de método:** "cuántas líneas escribió el curso" no dice
nada por sí sola — un curso TIENE que escribir su contenido. La
pregunta útil es **contra qué escribe**. Una regla de curso que apunta
a una clase del kit es, casi siempre, o un default mal elegido o una
pieza que el kit todavía no tiene.

### Lo que subió: el repaso rápido

`.d-repaso*` no aparecía en el ranking por ser un default malo, sino
por lo contrario: **el kit no define NADA** de ese widget. Cada curso
lo escribe entero. §6.46 lo había dejado del lado del curso y en su
momento estuvo BIEN — existía en un solo curso, y §4 pide un segundo
caso antes de generalizar. El segundo caso llegó.

La evidencia de que es copia y pega, no diseño convergente: de las 42
reglas con el mismo selector en los dos cursos, **40 son idénticas byte
a byte**. La JS iba por ~95 líneas al 70% de similitud.

Corte del seam, que es la parte que había que pensar: sube la CÁSCARA
(panel, pregunta, botones V/F, feedback desplegable, estados del ítem,
flechas, contador, "Siguiente") y queda en el curso la COLOCACIÓN —
NOA lo apoya sobre el arte con `[data-place]`, y por eso necesita
`position:absolute`, candado propio y una forma alternativa para
lienzo chico; "Seguridad alimentaria" lo pone en una diapositiva
normal. Esa diferencia es real y no se puede promediar, así que
NINGUNA regla con `[data-place]` viajó al kit.

Un detalle del JS que valía la pena conservar tal cual: la pregunta no
actual se oculta con el ATRIBUTO `hidden`, no con una clase. Con solo
la clase, `Narrador.textOf()` —que filtra por `hidden`, nunca por el
`display` calculado— narraba las dos preguntas seguidas al entrar,
revelando la segunda antes de tiempo.

Dato que conviene tener presente: **"Prevención cardiovascular" escribe
CERO reglas de `.d-repaso`**, porque resolvió la misma necesidad con
`initMiniQuiz()`, que ya era del kit. Tres cursos, tres caminos: uno
usó la pieza del kit y dos reinventaron una parecida. Cuando eso pasa,
la pregunta no es solo "¿esto sube?" sino también "¿por qué los otros
dos no encontraron lo que ya existía?".

### El bug bloqueante: minijuego en teléfono horizontal

Medido a 844×390 (iPhone 12 apaisado) sobre el kit v1.9.63:
`.d-mj-play` necesitaba 355px y tenía 270 —el alto del `.d-stage`—
con `overflow-y:visible`. **3 de las 12 opciones quedaban físicamente
inalcanzables**: sin scroll, sin gesto, sin nada. Y el minijuego suele
ser gate obligatorio, así que esto no es un apretón cosmético: es un
alumno que no puede terminar el curso desde el celular acostado.

Lo instructivo es por qué ninguno de los tres mecanismos que parecen
cubrirlo lo cubría:
- El bloque `max-width:600px` —el único con el `overflow-y:auto` que
  hace falta— no aplica: el teléfono apaisado mide 844px de ancho.
  **Es ANCHO; lo que le falta es ALTO.** Toda la escalera responsive
  del archivo estaba pensada por ancho.
- El aviso "Girá tu dispositivo" se muestra solo en portrait, y este
  caso ES el landscape que ese aviso pide.
- `@media (max-height:760px)` solo achica fuentes; no abre scroll.

Regla general: en una escalera responsive por ancho, el teléfono
apaisado es el punto ciego estructural. Vale chequearlo aparte.

### Y el resto del lote

- **Contraste del subtítulo del header**: `--brand-soft` (token de
  fondo claro) usado sobre el degradado de marca. Recalculado acá,
  idéntico a lo reportado: **2.25:1** contra el extremo claro, cuando
  AA pide 4.5:1. De paso queda anotado que `check-contraste.mjs` NO
  mira el chrome —solo los tokens de categoría— y por eso esto pasó.
- **`verify-hitboxes.mjs`, segunda vuelta.** En §7.09 arreglé la
  navegación; faltaban dos: verificar que efectivamente LLEGÓ (si no,
  avisar y no auditar, en vez de medir la diapositiva anterior) e
  ignorar los `[data-hit]` ocultos a propósito. Lo segundo tiene una
  lección propia: un ⚠️ que aparece en cada corrida y nunca importa es
  un ⚠️ que se deja de leer, justo el día que aparezca uno de verdad.
- **Certificado descargable, afuera** (producto). Verificado antes de
  borrar: existía desde §6.59, probado en aislamiento, y **ningún
  curso lo integró jamás** — cero llamadas y cero `#d-cert-print` en
  los tres. Sacarlo no pierde nada: formaliza lo que ya era el estado
  real. Cuidado al auditar con los nombres parecidos que SÍ siguen en
  uso (`.d-cert-stats`, `.d-cert-note`, `@keyframes d-cert-shine` son
  del resumen de cierre).

## 7.13 Los tests miraban al lado: los 3 bugs más caros de esta ronda pasaron la suite en verde (kit-base v1.9.65)

Pregunta directa: *"¿no hay que generar más tests y pruebas para que
el kit funcione mejor?"*. La respuesta salió de mirar los bugs de las
últimas versiones y preguntar, uno por uno, **por qué la suite no los
agarró** — y la respuesta nunca fue "faltaba un test", sino "el test
que correspondía medía otra cosa".

Los tres, con su modo de falla:

| bug | lo debía agarrar | por qué no lo agarró |
|---|---|---|
| minijuego inalcanzable en teléfono acostado | `scroll-audit` | ninguna de sus 6 resoluciones bajaba de 720px de alto |
| `window.Player` indefinido, toasts muertos | nadie | nada verificaba el contrato entre módulos |
| subtítulo del header a 2.25:1 | `check-contraste` | solo miraba la paleta POR CATEGORÍA, nunca el chrome |

Los tres se arreglaron y **los tres se validaron revirtiendo el bug a
propósito**, que es la única forma de saber que un test detecta algo y
no que pasa por casualidad.

### 1 · `clip-audit.mjs` — y las dos veces que me equivoqué construyéndolo

Vale documentar el camino, porque las dos equivocaciones son
instructivas y las dos me las devolvió la medición, no el razonamiento.

**Primer intento: sumar resoluciones bajas a `scroll-audit`.** Parecía
la respuesta obvia y barata. Corrí el curso con el fix revertido: verde.
`scroll-audit` mide el scroll del DOCUMENTO y el desborde de
`.slide-inner` contra `.slide`; este recorte pasa varios niveles más
abajo. Agregar viewports a un test que mide otra cosa no agrega nada —
y habría quedado la sensación de estar cubierto.

**Segundo intento: medir `scrollHeight - clientHeight` de cada
elemento.** También verde sobre el bug real. La razón es la parte
interesante: `.d-mj-play` tenía `overflow-y: **visible**`, así que ÉL
no recortaba nada — el contenido "cabía" en su caja; era la CAJA la que
se salía de `.d-stage`, que sí recorta, varios niveles arriba. La
medición correcta es por **rectángulo contra el ancestro que recorta**,
no por el scroll del propio elemento.

**Tercer intento, el que funciona**, más un detalle que faltaba: la
capa de juego del minijuego arranca oculta detrás de la intro
("¡Empecemos!"), así que al entrar a la diapositiva no hay nada que
medir — el recorte aparece recién cuando el alumno ya está jugando, o
sea cuando ya no puede salir. El test revela cada `[data-panel]` /
`.d-mj-panel` por turno, mide y restaura el estado.

Y una cuarta pasada, de calidad de señal: la primera corrida limpia
reportaba `.sr-only` en cada diapositiva de cada curso (miden 1px y
recortan A PROPÓSITO — es la técnica misma), el confeti del cierre (se
sale 64px por diseño, es lo que lo hace verse caer) y las imágenes con
`object-fit` (se encuadran, no pierden contenido). Todo eso está
filtrado, y no por prolijidad: **un ⚠️ que aparece siempre es un ⚠️ que
se deja de leer**, que es exactamente la lección que §7.12 ya había
pagado con `verify-hitboxes`.

Medición final: 45 hallazgos sin el fix, 16 con él — y los que
desaparecen son justo los del banco de opciones.

### 2 · `check-globals.mjs` — la pregunta de una línea

`coto-logros.js` consumía `global.Player.toast(...)` y nadie lo
publicaba. Tres versiones de avisos muertos, sin un error de consola,
descubiertos recién cuando un curso estrenó el módulo (§7.10).

El chequeo es deliberadamente tonto: junta lo que cada archivo PUBLICA
(`global.X = …`) y lo que CONSUME (`global.X`), y compara. Estático,
sin navegador, milisegundos, dentro de `npm run test:kit`. Un detalle
que importa: **saca los comentarios antes de buscar**, porque este kit
documenta muchísimo y un `global.Player` mencionado en una explicación
habría dado justo el falso negativo que el chequeo viene a evitar.
También avisa si dos archivos publican el mismo símbolo, donde el orden
de los `<script>` decide en silencio cuál gana.

Verificado comentando el `global.Player = api` real: lo agarra,
nombrando los dos archivos que lo consumen.

### 3 · El bug de navegación estaba en TRES archivos

Al arreglar `scroll-audit` apareció lo mismo que ya había arreglado dos
veces: navegar clickeando el `[data-goto]` del índice, que en un curso
con gate está `disabled` — y el clic es un **no-op silencioso**. Estaba
en `verify-hitboxes.mjs`, `scroll-audit.mjs` y `hitbox-click-check.mjs`.

O sea: **2 de los 7 tests de la suite venían auditando solo las
diapositivas alcanzables de cualquier curso gateado**, y reportando 0
fallos sobre un recorrido que casi no hicieron. Eso explica bastante
del "7/7 en verde" que convivía con bugs bloqueantes.

En vez de un tercer copy-paste, `irASlide()` en `_shared.mjs`: una sola
implementación, que navega por el motor **y verifica que llegó**. La
regla que deja: cuando el mismo bug aparece por tercera vez en tres
archivos, el bug ya no es el bug — es que falta el helper.

### La regla general que queda

Un test que no falla no prueba nada por sí solo. Las dos preguntas que
valen, y que ahora tienen respuesta escrita:

1. **¿Qué mide exactamente?** No "¿cubre el scroll?", sino "¿el scroll
   de qué elemento, contra qué contenedor?". Los dos primeros intentos
   de `clip-audit` fallaron ahí.
2. **¿Lo probé rompiendo lo que debería detectar?** Los tres chequeos
   de esta versión se validaron revirtiendo el bug real. Sin eso, un
   test verde es indistinguible de un test que no mira nada.

## 7.14 "Me equivoqué bastante e igual llegué al máximo": cuando el puntaje premia insistencia en vez de precisión (kit-base v1.9.66)

Relay del chat de "Seguridad alimentaria", a partir de un reporte real
del cliente después de hacer el curso entero:

> *"¿es posible sacarse menos del puntaje de la medalla de oro? hice el
> curso, me equivoqué bastante e igual llegué al máximo del puntaje, no
> me pareció correcto."*

Tenía razón, y la causa no era un número mal elegido: era estructural.

**Este relay es notable por lo que NO trae: código de kit.** Llegó
diciendo, textualmente, que el cambio vive entero en `curso.js` porque
la tabla de puntos, los escalones del bonus y los umbrales de medalla
son contenido de ese curso (§1), y que lo que sube es *la lección*.
Verificado acá antes de aceptarlo: `medallaDe()`/`pintarMedalla()`
(coto-cierre.js) ordenan los niveles internamente
(`niveles.slice().sort(...)`), así que ya eran independientes del orden
y de la cantidad — el kit efectivamente soportaba el rebalanceo sin
tocar una línea. Un relay que se toma el trabajo de distinguir "esto es
mío" de "esto es del kit", y que además lo comprueba, vale el doble.

Igual quedaron **dos cosas para el kit**, y las dos salieron de
verificar afirmaciones que el relay hacía sobre código mío.

### El diagnóstico, en una cuenta

El recorrido (todo obligatorio por gate) valía 160 y el mini juego
completo 240. 160 + 240 = 400 contra un oro de 395: **se llegaba a la
medalla máxima sin contestar una sola pregunta del repaso**. Y el bonus
era binario —se cobraba entero por encontrar los 6, sin mirar cómo—
con reintentos ilimitados y remediación que resalta lo que fallaste.
Equivocarse no costaba puntos: costaba tiempo. Cualquier alumno
persistente terminaba en el techo.

### Las 3 patologías que hay que buscar en el puntaje de un curso nuevo

Ninguna se ve leyendo la tabla de PUNTOS. Aparecen recién al cruzarla
contra un recorrido real:

1. **Puntos que solo miden asistencia.** Si el grueso del puntaje son
   interacciones que el gate YA obliga a hacer, el puntaje no mide
   desempeño: mide haber llegado al final. Todos terminan igual.
2. **Premios binarios en actividades reintentables.** Un bonus de
   "completaste todo" en algo que se reintenta sin límite es, en los
   hechos, un premio por insistir. Misma raíz que §6.53 (premio por
   ítem sin guard = puntaje infinito) un nivel más arriba: acá el guard
   existía, pero el MONTO no dependía de nada que el alumno hiciera
   bien. Si el bonus mira solo el intento ganador, reintentar hasta una
   corrida limpia lo devuelve entero — tiene que mirar el acumulado de
   todo el curso, y persistirse.
3. **La parte que sí evalúa, pesando poco.** El repaso era lo único que
   distinguía contestar bien de contestar mal, y valía 30 de 445 (7%).
   Estadísticamente invisible.

**El criterio de tono, explícito:** la salida no es castigar el error
sino premiar la precisión — engancha con §6.10.2.3 (el alumno puede
estar nervioso en sus primeros días). Los puntos por ENCONTRAR o
explorar no se tocan nunca: eso es el aprendizaje. Y pesar lo
suficiente para importar es distinto de volver algo obligatorio: el
repaso subió de peso sin gatearse.

### Regla nueva para el checklist (§7)

**Los 3 umbrales de medalla nunca se escriben a mano.** Se derivan del
máximo REALMENTE alcanzable en esa corrida —bronce = piso garantizado
del gate, para que nadie que termine se quede sin medalla; oro = un %
alto del máximo— descontando lo que todavía no exista (placeholders,
§3.9). Y ese máximo **se verifica con un recorrido real instrumentado,
no con la suma de la tabla: la tabla es una intención, el contador es
el hecho.**

Los dos bugs que encontró esa regla, los dos por medir en vez de
confiar en la tabla:
- La tabla declaraba **25 puntos que el curso nunca pagó**, desde el
  origen. Nadie los había cruzado nunca contra el contador real.
- Los umbrales fijos contaban los 20 puntos de un video que hoy es
  placeholder, así que el piso real caía **por debajo del bronce**:
  quien hacía lo mínimo terminaba sin ninguna medalla, exactamente lo
  contrario de lo que pide §6.10.6.

### Lo que sí cambió en el kit (2 cosas, las dos verificadas acá)

**1 · `initShotSwap` dispara `onChange` N−1 veces por grupo de N
variantes, y ahora está documentado donde se lo lee.** Confirmado en el
código: la variante 0 se marca vista al inicializar (`vistos[i] = true`)
sin llamar a `onChange`, que solo corre dentro de `go()`. El
comportamiento es CORRECTO —premiar ahí repartiría puntos al cargar la
página, antes de que el alumno llegue a la diapositiva— pero era
invisible para quien escribe la tabla de puntos, y es el origen exacto
de los 25 puntos fantasma. La nota va en el docblock de `onChange`, que
es donde un autor de curso mira.

**2 · El contador de puntos ahora publica `data-valor` con el número
verdadero.** El relay avisaba de una trampa de medición: desde que el
chip anima el count-up, leer el `textContent` a mitad devuelve valores
intermedios. Medido acá sobre `initLogros`: a los 0/80/200/400ms el
`textContent` da 0 / 21 / **46** / 50. El "46 donde hay 50" es lo peor
que puede pasar, porque no parece un error de lectura sino un bug de
producto y manda a buscar donde no está.

Lo importante es la decisión: **en vez de documentar "esperá 650ms", se
elimina la trampa**. `updateHud()` escribe `data-valor` con el número
exacto ANTES de animar, así que el dato correcto está disponible desde
el primer instante (medido: `data-valor` da 50 en las cuatro lecturas).
El `textContent` queda para el ojo, que es a quien la animación le
sirve. Una regla que vale para todo el kit: si una animación vuelve
ambiguo un dato, publicar el dato aparte sale más barato que enseñarle
a cada test a esperar — y no se olvida.

### Verificación del rebalanceo (del curso, no del kit)

Cinco perfiles de alumno con recorridos instrumentados, los cinco
dando exacto contra el modelo:

| Perfil | Puntos | Medalla |
|---|---|---|
| Impecable (0 errores, repaso 6/6) | 440 | 🥇 oro |
| Bueno (1 error, repaso 5/6) | 405 | 🥇 oro |
| Juego impecable, **sin repaso** | 380 | 🥈 plata |
| Impreciso (perdió y reintentó), repaso 4/6 | 360 | 🥈 plata |
| Mínimo del gate (4 de 6, sin repaso) | 260 | 🥉 bronce |

Las dos filas del medio son el objetivo: para el oro hacen falta LAS
DOS cosas —precisión en la actividad y haber hecho la parte
evaluativa—; cualquiera de las dos sola deja en plata.

## 7.15 El destello de arranque: los 3 cursos mostraban TODO el curso superpuesto durante un instante (kit-base v1.9.67)

Dos zips de parches en la misma tanda; el segundo era el primero más un
parche. De los 7, cinco ya estaban aplicados desde v1.9.62 — y acá va
una nota de método que se repite: los `.patch` de los dos zips tenían
md5 distintos, lo que a primera vista parece "son otros parches". No lo
eran: la diferencia estaba en las cabeceras de `git format-patch`
(hash del commit y fecha). Comparar desde `diff --git` para abajo
confirmó que el contenido era idéntico. **El md5 de un `.patch` no
sirve para decidir si dos parches son el mismo cambio.**

Los dos nuevos son bugs reales y comparten algo que vale subrayar:
**los dos llegaron por una captura de pantalla de un usuario**, y los
dos son del tipo que NO aparece en la máquina de quien arma el curso.

### 1 · Todas las diapositivas visibles a la vez, antes del motor

Ninguna `.slide` trae `hidden` en el marcado, y el motor recién las
oculta en su primer `go()`, adentro de `new Motor()`. Entre que el
navegador pinta el HTML y ese momento, las N diapositivas están TODAS
visibles y apiladas (`.slide` es `position:absolute; inset:0`), así que
se ve un instante con todos los textos del curso superpuestos. En
"Prevención cardiovascular" se leía el arte de la última diapositiva
con el enunciado de la mini práctica y el "🔒 Hacé la mini práctica…"
del cierre encima.

**Cómo lo verifiqué, que es la parte reutilizable:** el estado a medir
es "lo que el navegador pinta ANTES de que corra el JS", y eso es
difícil de atrapar con un `waitForTimeout` porque es una carrera. La
forma limpia es cargar la página con **JavaScript deshabilitado**
(`newContext({ javaScriptEnabled: false })`): ahí el motor nunca corre,
así que el DOM queda congelado exactamente en el estado previo. Sobre
un curso recién generado por el kit: **7 de 7 diapositivas visibles a
la vez, cero con `hidden`**. Con el fix, 1. Sin carreras, sin timeouts
frágiles, reproducible siempre.

**Por qué el fix va en CSS y no pidiendo `hidden` en el marcado.** Son
12, 20 o 26 `<section>` según el curso: es exactamente el detalle que
se olvida al agregar una diapositiva nueva, y ningún test lo atraparía
—para cuando los tests miran el DOM, el motor ya ordenó todo—. Una
regla `.d-stage:not([data-ready]) > .slide:not(:first-of-type)` lo
resuelve para todos los cursos, incluidos los YA ENTREGADOS, sin que
ninguno toque una línea. El `:first-of-type` visible evita el efecto
contrario (un flash en blanco antes de que arranque el motor), y el
motor pone `data-ready` DESPUÉS de su primer `go()` para que no haya
ni un frame en el que no gobierne ninguno de los dos mecanismos.

Es, además, un buen ejemplo de un bug que la suite no podía encontrar
por una razón estructural y no por descuido: **el estado defectuoso
deja de existir antes de que cualquier test pueda mirarlo.** Cuando el
modo de falla vive en una ventana de tiempo que la herramienta no
alcanza, hay que cambiar el punto de observación (acá: apagar el JS),
no agregar otro chequeo del mismo tipo.

### 2 · El video circular se veía cuadrado al reproducir

El redondeo dependía SOLO del `overflow:hidden` del wrapper
(`.d-shot-hit--circle { border-radius:50%; overflow:hidden }`), y el
`<video>` no tenía `border-radius` propio — confirmado en el CSS. Un
`<video>` reproduciéndose es un elemento reemplazado que el navegador
suele promover a su propia capa de composición, y una capa de
composición **no siempre queda recortada** por el `overflow` de un
ancestro: depende del navegador y de si hay aceleración por GPU. De ahí
el síntoma exacto de la captura: redondo en reposo (donde lo que se ve
es la imagen debajo) y cuadrado apenas se toca play.

Honestidad sobre la verificación: **este no lo reproduje**. El bug
depende del camino de composición por GPU y no se manifiesta en el
Chromium headless de acá, así que decir "verificado" sería falso. Lo
que sí verifiqué es la causa —que el redondeo dependía únicamente del
ancestro— y que tras el fix el `<video>` computa `border-radius: 50%`
propio. El mecanismo es conocido y el fix no tiene contraindicación: el
video es `object-fit:cover` llenando la caja, así que redondearlo calza
exacto con el wrapper. Cuando no se puede reproducir, corresponde
decirlo y apoyarse en la causa, no inflar la evidencia.

## 7.16 La receta de opt-out que no apagaba nada: `:not(:has())` sube la especificidad y el curso no se entera (kit-base v1.9.70)

**Síntoma relevado.** Un curso quería apagar el Ken Burns de las
diapositivas-captura (otro cliente lo había pedido explícitamente, así
que sacarlo del kit no era opción). El relay traía la receta obvia,
para el CSS del curso:

```css
.d-shot-slide--bg-layered > .d-shot{ animation:none; }
```

**No funciona.** Medido en chromium contra el CSS real del kit, con esa
regla cargada DESPUÉS de `coto-shot-stage.css`, el elemento sigue
computando `animationName: d-ken-burns`.

**Por qué.** El selector del kit no es el de la receta:

```css
.d-shot-slide--bg-layered > .d-shot:not(:has([data-hit], [data-place]))
```

`:has()` toma la especificidad de su argumento más específico —acá un
selector de atributo, 0,1,0— y `:not()` toma la del suyo. O sea el
selector del kit es **0,3,0** y la receta **0,2,0**. Venir después en el
orden de carga no sirve: el orden solo desempata cuando la
especificidad EMPATA. El `:not(:has())` se agregó en v1.9.43 por una
razón buena y no relacionada (un `transform` continuo en el ancestro
volvía inestable cualquier `getBoundingClientRect()` leído adentro), y
de paso, sin que nadie lo decidiera, dejó fuera de alcance a toda receta
de opt-out escrita con la forma corta.

**Lo que lo hace peor que un bug común: falla en silencio.** El curso
escribe la línea, no ve ningún error, y la animación sigue. No hay
consola, no hay test que lo agarre, no hay nada que distinga "lo apagué"
de "no lo apagué". Es la misma familia de fallas que §7.15 (`initPlayer`
que no protesta si un id no calza) y merece la misma respuesta: cerrar
la posibilidad de escribirlo mal, no documentar cómo escribirlo bien.

**El arreglo.** El default no cambia. La animación pasa a leerse de una
custom property con fallback:

```css
animation: var(--d-ken-burns, d-ken-burns 18s ease-in-out infinite alternate);
```

Sin variable, el fallback deja el comportamiento idéntico al de v1.9.43.
Con variable, el curso apaga en una línea y **la especificidad deja de
importar**, porque las custom properties se heredan:

```css
:root{ --d-ken-burns: none; }          /* todo el curso */
#s-3 .d-shot{ --d-ken-burns: none; }   /* una diapositiva sola */
```

**Verificado en chromium contra el CSS real del kit, los cuatro casos:**

| caso | `animationName` |
|---|---|
| default, sin tocar nada | `d-ken-burns` |
| `.d-shot` con `[data-hit]` adentro | `none` (la exclusión de v1.9.43 sigue viva) |
| `:root{--d-ken-burns:none}` | `none` |
| receta corta del relay | `d-ken-burns` ← sigue animando, a propósito documentado |
| `prefers-reduced-motion: reduce` | `none` |

**Lo que NO era un bug, y por poco lo parece.** En el camino salió que
el `@media (prefers-reduced-motion:reduce)` local de este archivo
—`.d-shot-slide--bg-layered > .d-shot{animation:none}`, 0,2,0— tiene
exactamente el mismo problema de especificidad y por sí solo no apagaría
nada. Aislado, no apaga: se midió. Pero en el kit real no importa,
porque `coto-base.css` tiene una regla global
`*{animation:none!important}` bajo la misma media query, y `!important`
gana sin depender de especificidad. El bloque local queda como
redundancia inofensiva. **Vale registrar el paso en falso**: la primera
lectura fue "encontré un bug de accesibilidad vivo desde v1.9.43", y era
un artefacto de haber probado el archivo suelto en vez del stack
completo. Medir el archivo no es medir el producto — la misma lección
que ya costó dos mediciones falsas negativas en §7.12.

**Regla que queda.** Cuando el kit ofrezca una palanca al curso, la
palanca es una **custom property**, no "pisá esta regla". Una variable
se hereda y no tiene especificidad que perder; una regla para pisar es
una promesa que el kit puede romper sin querer la próxima vez que
alguien le agregue un `:not()`, un `:has()` o una clase más al selector
—y la va a romper en silencio.

## 7.17 El relay de "Pedidos de PLU set a Compras": 4 piezas que el kit traía y nadie enchufaba (kit-base v1.9.71)

Un curso construido y auditado de punta a punta trajo 30 hallazgos con
archivo y línea. Verificados uno por uno contra el código real: **29
ciertos, 1 mal atribuido**. Es el relay mejor medido que recibió este
kit, y el más incómodo, porque el bloque más grave no era una lista de
bugs sueltos sino un PATRÓN.

### El patrón: el kit trae la pieza, nadie la cablea, no hay error

Cuatro hallazgos con la misma forma exacta:

| | pieza que el kit YA traía | qué pasaba sin el cable |
|---|---|---|
| **B1** | `speakSlide` en `initPlayer()` | **el curso quedaba MUDO en todas sus diapositivas** |
| **B2** | `motor.restoreMaxVisited()` | `.d-progress-locked` no existía en el DOM |
| **B3** | `#d-salida` (CSS desde v1.8) | "Salir del curso" no hacía nada visible en un LMS |
| **B4** | `.d-rotate-notice` (CSS desde v1.9.39) | teléfono vertical: lienzo achatado sin explicación |

B1 es el peor bug que tuvo este kit desde el §6.24. `speakSlide` se
usaba en UN solo lugar —el click del botón "Locución"— y nadie narraba
al cambiar de diapositiva: eso quedaba como línea a escribir en cada
`curso.js`. Los pop-ups SÍ narraban (tienen su propio enganche), lo que
hacía la falla todavía más difícil de leer: no era "la locución no
anda", era "anda a veces". Se descubrió interceptando `Narrador.speak`
y recorriendo el curso: **14 diapositivas, 14 mudas**, cero errores en
consola.

Y B4 es el caso de manual: el propio comentario del CSS decía "agregar
como PRIMER hijo de `.d-stage`, curso por curso". Se agregaba en cero
cursos. **Una instrucción en un comentario no es un mecanismo.**

### Por qué ninguno de los 8 tests los agarraba

Vale entenderlo antes de agregar el noveno: los 8 tests miden lo que la
página HACE. Estas fallas son cosas que la página NO hace. Un curso
mudo no tira error, no rompe el layout, no pierde un rect ni un nombre
accesible — simplemente está callado. **Un test que busca síntomas no
puede ver una ausencia.**

De ahí `tools/tests/contrato-cableado.mjs` (el 9º). No busca síntomas:
por cada pieza que el kit trae, pregunta *"¿está enchufada?"*. La regla
es "si está la pieza, tiene que estar el cable", nunca "todo curso
tiene que tener todo" — un curso sin locución no tiene `#d-narrate` y
ahí no hay nada que exigir.

Verificado en los dos sentidos, que es lo único que hace confiable a un
test: **en verde** contra un curso recién generado (9/9 en toda la
suite), y **5 fallos** contra una copia con el cableado roto a
propósito, cada uno nombrando la pieza y la consecuencia.

### El choque que NO se resolvió aplicando el parche

El relay pedía reponer el contador "Frase 4 de 12" en el panel de
locución, porque un cliente reportó: *"muchos no entendían que la barra
era para adelantar, pensaban que era el sonido"*. Cierto. Pero el
código tenía escrito, desde v1.9.35, que ese contador se sacó por
**pedido explícito de otro cliente**: sonaba a que la locución tuviera
"partes" separadas.

Dos reportes reales y opuestos. La salida no es elegir uno: es leer qué
dice cada uno. El primero objeta **exponer los fragmentos**; el segundo
señala que **la barra no se distingue de la de volumen**. Reponer el
contador arreglaría el segundo reintroduciendo el primero.

Así que se atacó la ambigüedad sin volver a mostrar el conteo: título
**"Avance"** (que hace par con "Volumen", en vez de repetir la palabra
del botón), una línea que dice qué hace la barra, la barra **con marcas**
—visualmente distinta de la pista continua del volumen— y el estado
escrito en palabras ("La locución está apagada" / "Esta diapositiva no
tiene locución"), que antes era un slider gris sin ninguna explicación.

**Regla que queda:** cuando dos clientes piden lo contrario, casi nunca
están en desacuerdo sobre lo mismo. Separar la queja del remedio
propuesto suele dejar un tercer camino que satisface a los dos. Y si no
lo deja, la decisión se toma y se escribe — no se aplica el parche más
reciente por ser el más reciente.

### El hallazgo mal atribuido

**D3** decía que el pop-up "Antes de empezar" del boilerplate queda
mudo porque sus tarjetas usan `.d-instr-card` y no `.d-instr-item`.
Verificado: `.d-instr-item` **sí** está en `TEXT_SEL` (narrador.js), y
`.d-instr-modal`/`.d-instr-card` no existen en ningún archivo del kit.
O sea: el marcado que queda mudo es del CURSO, no del boilerplate. No
es un bug del kit y no se tocó nada. La otra mitad de D3 —narrar el
panel visible en `layerchange`— sí es real y queda anotada como
pendiente de diseño, no de arreglo.

### Lo demás que entró, en una línea cada uno

· **A1** `<link rel="icon">` muerto en el `<body>` con un placeholder que
el generador nunca resolvía — remanente del método viejo, borrado (el
bueno vive en el `<head>` de `index-boilerplate.html`).
· **A2** el buscador del glosario tenía la clase pero no el atributo
`data-gloss-search` que `initGlossarySearch()` busca: se veía, se podía
tipear y no filtraba nada.
· **A3** `textOf()` unía con `'. '` sin mirar si el fragmento ya cerraba:
punto doble en todo curso que escriba prosa normal.
· **A4** el ✕ del pop-up de video (`z-index:2`) quedaba tapado por el
aviso de error (`z-index:3`) — o sea, con cualquier `.mp4` de 0 bytes,
que es el estado de todo curso que espera los videos finales.
· **A5** el aviso de logro pisaba el contenido anclado al pie del lienzo
(medido: bandas 82-116px vs 79-110px). Subido a 130px y expuesto como
`--d-award-toast-bottom`, por §7.16: la palanca es una variable.
· **A6/C1** la gracia de hover de 1,5s no cerraba al hermano: barrer el
mouse dejaba dos paneles abiertos. Ahora los cuatro controles son UN
conjunto, registrado a nivel de módulo para que la exclusión cruce
también entre grupos.
· **A7** `title` redundante donde el nombre ya está visible al lado del
ícono: el tooltip nativo aparecía como tercera capa encima del panel que
el mismo botón acababa de abrir.
· **A9/C8-C13** el panel de Ayuda scrolleaba entero y perdía su cabecera;
ahora scrollea solo la lista (con el `min-height:0` sin el cual un hijo
flex no se achica), más rótulo de sección, degradado al pie y alto de
toque recuperado con `@media (pointer:coarse)`.
· **A10/D4** `.d-q{overflow:hidden}` convierte a la tarjeta del quiz en
el scrollport de cualquier `sticky` de adentro, así que a 390px de alto
el enunciado se iba de vista (medido en `top:-101px`) y el alumno elegía
sin ver la pregunta. Resuelto bajo `@media (max-height:560px)`.
· **A11** la trama de "bloqueado" a 22% no se leía; 45%. Con la
advertencia al lado: si el curso no llamó a `restoreMaxVisited()`, no hay
contraste que arreglar porque el elemento no existe (B2).
· **D1** "la locución sigue al pasar de diapo" NO era doble narración
—se midió, `speak()` se llama una vez por diapositiva— sino la latencia
del `cancel()` de Chrome. El `cancel()` adelantado + 220ms de espera
arregla eso y, de paso, hace que pasar 5 diapositivas rápido dispare UNA
narración en vez de encolar cinco. **Verificado: 4 clics rápidos → 1.**
· **D2** "PLU" pasa a "pe ele ú" (la "uh" sonaba a duda), el ">" de las
rutas de menú se lee como coma, y los códigos numéricos se separan en
dígitos.
· **D6** el cierre era un trinquete de un solo sentido: `shot.hidden=true`
sin vuelta, así que "Anterior" retrocedía la diapositiva entera y la
felicitación no volvía a verse en toda la sesión. Ahora "Anterior" vuelve
al paso 0, enganchado en FASE DE CAPTURA sobre `document` — que gana
sobre el listener del motor sin depender del orden de arranque, a
diferencia del `stopImmediatePropagation()` que había que registrar
antes.

### Un error propio, del que sale la lección más útil

Al separar códigos numéricos en dígitos escribí una regla de 4 dígitos
y, en el comentario que la acompañaba, afirmé que un año no colisionaba.
Un año son exactamente cuatro dígitos con `\b` de los dos lados: "en
2026" se narraba "en 2 0 2 6". Lo agarré probando la regla, no
releyéndola — la tabla arranca en 5 dígitos.

**Escribir en el comentario por qué algo es seguro no lo vuelve seguro.**
Si la justificación se puede correr en 30 segundos, se corre.

## 7.18 El relay de "Surtido sin venta": 8 de 10 aplicados, y una regresión propia (kit-base v1.9.72)

Un curso construido sobre v1.9.71 y pasado por siete rondas con el
cliente devolvió diez hallazgos (K1–K10), cada uno con síntoma,
diagnóstico contra el código real y método de verificación. Verificados
uno por uno: **nueve ciertos, uno falso**.

### El que más duele: K1 lo introduje yo, en la versión anterior

`.d-fab-pop--ayuda{ position: relative }` — lo agregué en v1.9.71 para
que el degradado al pie del panel de Ayuda (§7.17 C11) tuviera contra
qué posicionarse. `.d-fab-pop` ya era `position: absolute`, con la
MISMA especificidad (una clase), así que el `relative` escrito después
ganaba por orden de fuente: el panel dejaba de ser overlay, `.d-fab-stack`
crecía de 115px a 465px y **los dos botones flotantes terminaban en el
medio del lienzo, encima del contenido**.

Reproducido en un curso recién generado a 1440×810: pila en `y=265,
h=465`, botón de Configuración en `y=265` cuando `bottom:80px` lo tiene
que dejar en `y=615`. Los mismos números que trajo el relay.

Y no hacía falta: `position: absolute` **también** arma bloque
contenedor, así que el `::after` funciona igual sin la línea. Borrada.
Tras el fix, `y=615, h=115`, con el scroll de la lista y el degradado
intactos.

**Lo que hace esto grave no es el bug, es que nadie lo vio.** Salió del
kit, pasó los 9 tests, entró en un curso y lo encontró el cliente. Por
eso el arreglo de verdad es K1b.

### K1b — el chequeo que sí lo habría cazado

`check-css-duplicates.mjs` corría sobre el CSS del kit y decía "sin
duplicados con propiedades en conflicto" **con el bug adentro**. El
motivo es entendible: compara los bloques del selector duplicado ENTRE
SÍ, y ahí no hay conflicto — declaran propiedades distintas. El
conflicto real era entre el duplicado y **la clase base que pisaba en
silencio**.

Ahora también avisa cuando un modificador `.a--b` **duplicado** pisa una
propiedad **estructural** (`position`, `display`, `overflow*`) de su
base `.a`.

Las dos condiciones —duplicado y estructural— están medidas, no
elegidas de oído: la versión amplia ("cualquier modificador que pisa a
su base") da un aviso por un override legítimo (`.d-iconbtn--labeled`
cambiando `display`), que es exactamente para lo que existe un
modificador. Un ⚠️ que salta por lo correcto deja de leerse (§7.3). Lo
que convierte a K1 en bug no es el override: es que estaba escrito en un
bloque APARTE del principal, que es la forma que tiene "no me di cuenta
de que la base ya lo declaraba".

Verificado en los dos sentidos: **0 hallazgos** sobre el CSS del kit ya
arreglado, y sobre el `coto-player-chrome.css` de v1.9.71 lo caza con
nombre y líneas exactas (439, 448).

### K10 — el patrón estrella del kit nunca arrancaba solo

Reporte del cliente con el curso ya en Moodle: "la portada sigue
mostrando la imagen estática, el video no se reproduce".

`initBgVideos` ponía `v.muted = muted()` —el toggle de Sonido, que
arranca en ON— y llamaba a `play()`. Los navegadores bloquean el
autoplay CON SONIDO mientras no hubo un gesto del alumno, así que en la
PRIMERA diapositiva ese `play()` era rechazado **siempre**. O sea: el
patrón "video de fondo", cuyo caso de uso principal y cuyo propio
ejemplo en el comentario del archivo es la portada, **no arrancaba
nunca solo**. El comentario del kit ya decía "pasa SIEMPRE en la
portada": estaba identificado como condición y asumido como inevitable.

No lo es. **Lo que se bloquea es el sonido, no el video**: el autoplay
mudo lo permiten todos los navegadores. Ante `NotAllowedError` —y solo
ante ese— ahora se reintenta con `muted = true`, y el botón pasa de
pedir "reproducir" a ofrecer "activar el sonido" (`data-modo`). El
click, con el video ya corriendo mudo, solo saca el mute: no vuelve a
pasar por `attempt()`, que reiniciaría `currentTime` a 0 y haría empezar
la portada de nuevo delante del alumno.

Medido con un video real y `--autoplay-policy=document-user-activation-required`
(sin esa bandera el navegador de pruebas deja pasar cualquier autoplay y
el bug no existe):

| | v1.9.71 | v1.9.72 |
|---|---|---|
| tras 1,6s | `reproduciendo:false`, `tiempo:0` | `reproduciendo:true`, `mudo:true`, `tiempo:2.04` |
| al tocar el botón | — | `mudo:false`, `tiempo:2.6` (sigue de largo) |

Es el default, no una opción, porque una portada congelada es una falla
que ve el alumno y un video mudo no. `bgVideoAutoMudo: false` lo apaga
para el curso que prefiera el poster fijo.

### K9 — el botón de locución releía todo en vez de reanudar

"Silenciar y volver a activar no retoma en el punto actual ni queda
mudo — arranca de nuevo desde el principio". Cierto: `if (on)
speakSlide(...)` siempre desde la frase 0.

Lo llamativo es que **el kit ya tenía todo para reanudar y no lo
usaba**: `cancel()` no borra `estadoActual` (a propósito, para que
"Repetir" siga sirviendo), `progreso()` da `{index, total, terminado}`
y `seek(i)` retoma. No hubo que agregarle nada a `narrador.js`.

Tres casos, verificados con un motor de voz falso que tarda 300ms por
fragmento —en headless no hay voces y todo termina al instante, así que
sin eso el caso "cortar a mitad" no existe—:

| caso | resultado |
|---|---|
| cortado a mitad | `seek(0)`, sin releer |
| ya terminada, misma diapositiva | **silencio** (ni `seek` ni `speak`) |
| navegó en silencio | lee la diapositiva EN PANTALLA, no la anterior |

El caso "ya terminada" es una **decisión de producto**, no un descuido:
releer entero es justamente lo que se reportó como bug, y para volver a
escucharla está "Repetir" en el mismo panel.

### K2 — el hallazgo que valía por dos cursos

Un `[data-shot]` dentro de un `[data-panel]` que arranca `hidden` mide
0×0, así que `place()` no calcula nada y sus overlays quedan **sin
ninguna coordenada** hasta que el `ResizeObserver` los reposiciona.
Mientras tanto, un `position:absolute` sin `left/top` cae en su posición
ESTÁTICA, que suele ser fuera del arte.

Lo decisivo del relay: lo verificaron también contra el curso de
referencia YA APROBADO. Lo corrí yo y da el mismo fallo, palabra por
palabra: `data-slide="minijuego" (capa "mj-fin"): div.d-mj-fin-stat se
sale 28px de .d-stage`.

Fix en el motor y no en CSS: una regla `[data-shot] [data-place]{left:0;
top:0}` tendría 0,2,0 y le ganaría a un curso que posicione su overlay
con su propio CSS en vez de con `data-l/t/w/h` — uso válido que hoy
funciona. El ancla provisional se aplica SOLO a lo que el motor gobierna
(tiene `data-l`) y SOLO si nunca se posicionó. **Medido sobre el curso
aprobado: 2 fallos → 0.**

### K3 — el único falso

Decía que `.d-mj-fin-stat` se usa con `[data-place]` pero no declara
`position:absolute`. **No se reproduce:** computa `absolute`. La regla
está en la línea 430, declarada junto a `.d-mj-fin-tit` y
`.d-mj-fin-sub`; el relay miró la 447, que la redeclara para otras
propiedades. No se tocó nada.

Vale como recordatorio de por qué §0.1 existe: nueve de diez ciertos es
una tasa altísima para un relay, y aun así el décimo habría metido una
regla redundante en el kit.

### Los cuatro baratos

· **K4** — `is-done` (el tilde de "ya visto") y `#d-sidenav-progress`
los emitía el generador y **no los cableaba nadie**: `grep` sobre todo
el JS del kit daba cero. Un tilde que no aparecía nunca y una línea de
progreso vacía, sin error. Misma forma que los cuatro de §7.17. Se
cablean en `initIndexJumps`, que ya recibe `visited` y no necesita nada
nuevo del curso. Verificado: "1 de 7 vistas" y un ítem con tilde.
· **K5** — la plantilla de `curso.js` llamaba a `initGlossaryUnlock` y
`initIndexJumps` sin guardar el `refresh` que devuelven. Un curso que
siguiera la plantilla al pie de la letra quedaba con el glosario
CONGELADO en el estado del arranque: curso terminado, medalla de oro, y
los términos con candado. La plantilla ahora captura los dos retornos y
muestra dónde se llaman.
· **K7** — tres textos decían que `new-course.mjs` **no** genera el
`index.html` y mandaban a adaptar a mano el de otro curso, que es el
método que §7.08 reemplazó. El mismo archivo, más abajo, lo genera y lo
anuncia por consola. Corregidos.
· **K8** — `PROMPT-CURSO-NUEVO.md` y `header-boilerplate.html` viajaban
al zip de entrega. Para la carpeta de trabajo tienen sentido; para el
paquete no: uno es documentación de proceso y el otro una segunda copia
de una barra que ya está dentro del `index.html` — justo lo que el
comentario del generador señala como "garantizar que se desincronicen".
`build-zip.py` los excluye por defecto. Verificado sobre un zip real.

### Lo que NO se aplicó

**K6** (faltan estilos de lista para el cuerpo de un pop-up de
contenido) queda afuera a propósito. Es un gap real y el propio relay lo
dice: es el PRIMER caso, y la regla del kit (§4) pide un segundo curso
que lo necesite antes de generalizar. Anotado para el próximo.

### Lo de método que se lleva el kit

**Un bug de ASSETS no lo caza ningún test de marcado.** Dos rondas del
curso se fueron compensando con CSS un corrimiento que estaba en el PDF
del diseñador. La regla: cuando algo "salta" o "no calza", **medir el
arte antes de tocar el CSS**.

**Reinterpretar el arte en HTML no escala.** El minijuego armado "al
estilo" del PDF fue rebotado por cinco diferencias a la vez; se resolvió
horneando la página del diseñador y dibujando encima SOLO lo que cambia
durante la partida. Si algún día el kit tiene un patrón de "pantalla de
juego", ese es el molde: captura + overlays medidos, no componentes que
imitan.

## 7.19 El relay de "Seguridad de la información": lo aplicado, y por qué el resto no es un parche (kit-base v1.9.73)

Un curso de 21 diapositivas y 11 rondas, armado sobre v1.9.71, devolvió
el relay más grande que recibió este kit: siete secciones, unos sesenta
puntos, con mediciones propias.

**Tres de sus hallazgos ya estaban arreglados** cuando llegó, porque el
relay anterior ("Surtido sin venta") los había traído también y salieron
en v1.9.72: su **A1** es K1 (el `position:relative` que mandaba los
botones flotantes al medio), su **B1** es K1b (el chequeo base↔modificador)
y su **D** es K4 (el tilde del índice sin cablear). Dos cursos
independientes encontrando lo mismo es la señal más fuerte que puede dar
este flujo.

### Lo que entró en esta versión

**A2 · `initGateHints({ pendientes })` estaba documentado y el código no
lo leía.** El encabezado promete `opts.pendientes(slideEl)` desde que la
función existe; el cuerpo solo usaba `opts.gates`. Un curso con un gate
propio —uno que no sea `initPopupGate`/`initVideoGate`— lo implementaba
siguiendo la documentación y no pasaba nada: ni pulso, ni toast, ni un
error. Ahora se lee, y gana sobre los gates declarativos cuando devuelve
algo, porque es lo más específico que el curso puede decir sobre su
propia diapositiva.

**A3 · El generador escribía tres CSS y el boilerplate enlazaba uno.**
`assets.css` y `pulido.css` quedaban muertos en disco desde que se creó
el scaffold. Ahora se enlazan los tres, con `pulido.css` al final porque
es, por definición, el que ajusta lo anterior. Verificado sobre un curso
recién generado: las tres hojas cargan.

**A4 · `initIndexJumps` apuntaba por defecto a un índice que el chrome
generado no tiene.** El default era `.d-shot-hit--indice` —el índice
DIBUJADO EN EL ARTE— mientras `new-course.mjs` genera el cajón lateral
`.d-sidenav-item[data-goto]`. Llamarla sin `selector` no fallaba ni
avisaba: **el menú lateral quedaba sin gate y se podía saltar al cierre
sin cumplir nada**. El default ahora cubre los dos.

Medido antes y después en un curso recién generado, llamando sin
`selector` y con una sola diapositiva visitada: antes 0 de 7 ítems
bloqueados; ahora 6 de 7.

De paso, un bug que se iba a introducir con el fix: `sel + '[data-goto]'`
sobre una LISTA de selectores le agrega el atributo solo al último y
deja el primero sin filtrar. Ahora se le agrega a cada parte.

**A5 · El segundo clic no cerraba el popover.** `closeAll()` sacaba
`is-open` e `is-hover`, pero el CSS abre el panel con tres condiciones
en OR y la tercera es `:focus-within` — y el clic acababa de dejar el
foco EN EL BOTÓN, que está adentro del control. Había que clickear
afuera para cerrar (reporte del cliente). Es exactamente el motivo por
el que el manejador de `Escape` ya hacía `blur()`; faltaba en el clic.
Verificado: tras el segundo clic, `is-open` en false y el foco fuera del
control.

**A6 · El hover plano tapaba el arte.** `background: color-mix(--cat
12%)` funciona en una zona chica; sobre una hoja blanca que ocupa media
diapositiva se lee como "se apagó el documento". Lo notable: **la regla
correcta ya estaba escrita tres reglas más abajo**, en
`.d-shot-hit--indice` — *"un realce SOBRE la forma, nunca un tinte plano
que tape el arte"*. Se sube a la base: aro, sombra proyectada y 1px de
levante. Medido con hover real: el fondo queda transparente y aparecen
outline y sombra.

**El buscador del glosario tenía una clase que no existe.** El
boilerplate ponía `.d-glossary-search`; el kit define `.d-gloss-search`,
y además como CONTENEDOR (`.d-gloss-search input{...}`). El campo se veía
con el estilo por defecto del navegador y **funcionaba igual**, porque
lo funcional lo decide el atributo `data-gloss-search` que se agregó en
v1.9.71 — o sea que el arreglo anterior tapó el síntoma visible que
habría delatado el nombre mal puesto. Ahora va el contenedor correcto,
con la lupa que el CSS reserva con 2.3rem de padding. Medido: el input
computa 36.8px de padding izquierdo, o sea el estilo del kit aplica.

### Lo que NO entró, y por qué

El resto del relay no son parches pendientes: son **otra clase de
trabajo**, y meterlo a presión en una versión de arreglos sería peor que
dejarlo anotado.

· **Sección C — quince piezas nuevas** (visor de documentos con zoom y
paginado, revelado acumulativo, gate por "documento leído entero",
paginador de tandas, panel de recursos descargables, capa de texto por
OCR…). Son módulos, no fixes. Cada uno necesita su decisión de diseño y
su segundo caso de uso antes de generalizar (§4). El relay mismo los
llama "candidatas a subir", no bugs.

· **Sección E — cambios de default**, empezando por apagar el Ken Burns
para todos. Eso no lo decide el kit solo: en §7.16 quedó escrito que un
cliente lo pidió explícitamente y otro lo objetó, y por eso existe la
palanca `--d-ken-burns`. Cambiar el default es una decisión de producto
que hay que tomar a la vista, no deducir de un relay.

· **Sección G — cuatro tests nuevos**, más los cuatro del relay
anterior. Ocho tests sin escribir es una versión entera dedicada a eso.
`overlays-colocados.mjs` es el que más vale: cubre B2 —los `console.warn`
del motor que ningún test escucha— y el propio relay dice que fue "el gap
que más caro salió", catorce píldoras invisibles **con los once tests en
verde**.

· **Sección F — quince trampas para documentar** y **J — nueve métodos de
construcción**. Es material valioso y en buena medida ya está bien
escrito; entrarlo al `CLAUDE.md` es una pasada de edición, no de código.

**A7** (un gate de video también bloquea el auto-avance, y el archivo
ausente recién se exime a los 6 segundos) queda anotado sin aplicar:
verifiqué que `_advance()` consulta `canAdvance`, pero el fix correcto
—documentar la interacción, o eximir el archivo que ni siquiera empezó a
cargar— toca la misma lógica que v1.9.71 tocó para los placeholders de
video, y quiero medirla contra un curso real antes de moverla.

### Lo de método que se lleva el kit

**Un arreglo puede tapar el síntoma que delataba a otro.** El
`data-gloss-search` de v1.9.71 hizo que el buscador funcionara, y al
funcionar dejó de ser evidente que su clase no existía en ningún CSS.
Cuando un fix hace que algo "ya ande", conviene mirar una vez más si
andaba por la razón correcta.

## 7.20 Relay de "Seguridad de la información", pasada 2: los gaps de herramienta y el test que faltaba (kit-base v1.9.74)

Segunda pasada sobre el mismo relay. La 1.9.73 cerró la sección A (los
bugs); ésta cierra **A7, los gaps de herramienta (B) y el primer test de
la sección G** — que es, según el propio relay, el que más caro salió.

### El test que faltaba: `overlays-colocados.mjs`

La frase del relay que lo justifica: **catorce píldoras revelables no se
veían, con los once tests en verde.**

El mecanismo estaba documentado desde §6.22 y el motor **avisa por
`console.warn`** desde v1.9.39. El problema es que ningún test escuchaba
los `warning`: `_shared.mjs` filtra `msg.type() !== 'error'`. Un aviso
que nadie escucha es un aviso que no existe.

El test hace las dos cosas que faltaban: escucha la consola incluyendo
`warning` (filtrado por el prefijo `[motor-slides]`, para no arrastrar
ruido de terceros) **y además mide** — cada overlay tiene que caer
dentro de su `[data-shot]` con 4px de tolerancia. Recorre todas las
diapositivas, no solo la primera, y revela las capas ocultas de a una,
porque un overlay dentro de un `[data-panel][hidden]` es donde esto se
esconde mejor.

Verificado en los dos sentidos, que es lo único que hace confiable a un
test: verde sobre un curso recién generado, y sobre una copia con un
`[data-place]` sin `position:absolute` lo caza con el nombre del
elemento y la explicación de por qué su `left/top` no hace nada.

### A7 · El gate de video se peleaba con el auto-avance

`[data-autoadvance]` llama a `motor._advance(1)` cuando el video de
fondo termina, y `_advance()` consulta `canAdvance` antes de pasar: o
sea que **el propio video que satisface el gate no lo satisfacía**, y la
diapositiva quedaba trabada justo cuando el alumno ya había hecho lo que
se le pedía.

El arreglo no es documentar la interacción: es que **un video que llegó
al final está visto**. Se engancha en `initVideoGate` y no en
`initBgVideos` porque vale para los tres patrones de video del kit, y el
curso no tiene que cablear nada. Medido: antes del `ended`, `faltan: 1`;
después, `faltan: 0`.

### B4 · El umbral de peso trataba igual a una animación y a una captura

300 KB está calibrado —lo dice el propio encabezado de la herramienta—
para una captura 2:1 estática. Un `.webp` animado legítimo pesa del
orden del megabyte y quedaba como **falso positivo permanente**, que es
la peor clase de aviso: el que se aprende a ignorar.

Ahora se detecta la animación leyendo el archivo, no la extensión: chunk
`ANIM` en un RIFF/WebP, más de un bloque `0x21 0xF9` en un GIF, `acTL`
antes del primer `IDAT` en un PNG. Umbral aparte de 1200 KB (`--anim-kb`).

Y el dato que hace que esto importe, medido por el curso sobre un mismo
GIF: **arriba de ~75 cuadros el peso casi no depende de la calidad ni
del tamaño, depende de la cantidad de cuadros** — 130 KB entre la mejor
y la peor imagen, contra ~400 KB que cuesta duplicar los cuadros. O sea
que apretar la calidad para entrar en 300 KB empeora la imagen sin
resolver nada.

Verificado con los dos casos: un WebP estático de 352 KB se reporta; uno
animado de 900 KB, no.

### B5 · El kit se hacía fallar a sí mismo

`hitbox-click-check` reportaba como "no inicializado o roto" cualquier
`[data-hit]` de 0×0 — y un elemento escondido a propósito mide
exactamente eso. Las flechas `data-shot-swap-step` **del propio kit** se
esconden al llegar a los extremos, que es su comportamiento correcto.
Ahora se saltean los ocultos (`hidden` propio o heredado, `display:none`,
`visibility:hidden`).

### E1 · Ken Burns apagado por default

Tercer cliente sobre el mismo efecto, y el que definió: *"ese efecto no
lo queremos ni en este curso ni en el kit"*. Nació en v1.9.43 por un
pedido ("aparecen de golpe sin animación") y en §7.16 se le puso la
palanca porque otro lo objetaba. Dos de tres en contra — y el que estaba
a favor pedía que la diapositiva no apareciera de golpe, cosa que ya
resuelve el fundido de `.slide.anim-r/.anim-l`, que sigue puesto.

El efecto no se borra: se invierte la palanca. El curso que lo quiera lo
enciende con `:root{ --d-ken-burns: d-ken-burns 18s ease-in-out infinite
alternate }`. Verificado en los dos sentidos.

## 7.21 Las trampas y los métodos de "Seguridad de la información" (kit-base v1.9.75)

Tercera pasada sobre el mismo relay. Ésta entra sus secciones **F**
(trampas que merecen estar escritas) y **J** (métodos de construcción),
más los tres puntos de F que resultaron ser **bugs de código y no
documentación**.

### Los tres que eran código

**F2 · `initShotSwap.go(n)` pagaba por quedarse donde estabas.**
`onChange` es donde los cursos suman puntos, y se disparaba aunque
`n === i`. Un paginador con un botón por variante le pagaba al alumno
por tocar la que YA estaba viendo, tantas veces como quisiera. El curso
lo detectó porque su máximo medido dio **220 contra 210 declarado**, y
la diferencia no se explicaba leyendo la tabla de puntos.
Medido antes y después: tocar la variante actual tres veces daba 4
llamadas a `onChange`; ahora da 1 (la del cambio real). `vistos` y
`sync()` siguen corriendo igual — volver a tocar la variante actual no
la "des-ve"; lo único que no vuelve a dispararse es el aviso al curso.

**F3 · El ✓ del repaso regalaba la respuesta en opción múltiple.**
`.d-repaso-btns button[data-repaso-ans="true"]::before{content:"✓"}` no
estaba condicionado a nada. En un Verdadero/Falso el ✓/✕ es la
ETIQUETA del botón y está perfecto; en una pregunta de opción múltiple
—que el kit soporta, porque `resolver()` compara `eligio === ok` y no
limita la cantidad de botones— el ✓ aparecía sobre la opción correcta
**antes de contestar**.
Ahora exige `.d-repaso-btns--vf`. Medido: en V/F el `::before` computa
`"✓"`; en múltiple, `none`.
Y queda escrito el contrato completo: en múltiple va **un solo** botón
con `data-repaso-ans="true"` — con `"false"` habría varias "correctas"
a la vez.

**F6 · `<kbd>` era navy sobre navy en cualquier fondo oscuro.**
`kbd{color:var(--text)}` asume el fondo claro. Al llevar una pieza del
kit a un panel oscuro, el `<kbd>Esc</kbd>` salía como un recuadro vacío.
Ahora `color:inherit`, y el fondo y el borde se derivan de
`currentColor`: la tecla se adapta al fondo en vez de asumir uno. La
suite de contraste sigue en verde.

**F8 no era un bug del kit:** `.d-iconbtn--labeled` ya resuelve el caso
"ícono + texto" con `display:inline-flex`. Lo que el relay vio era
`.d-doc-btn`, una clase del CURSO. Queda como regla: **a un botón de
ícono del kit no se le agrega texto sin pasarlo a `--labeled`**, porque
la base es `display:grid` sin columnas y el texto se apila debajo.

### F · Las trampas, para no volver a pisarlas

1. **`Narrador.textOf()` filtra por el ATRIBUTO `hidden`, nunca por el
   `display` calculado.** Esconder algo solo con CSS lo esconde de la
   vista **pero no de la voz**. Mordió dos veces en el mismo curso: el
   recap del repaso narraba las respuestas al entrar, y las dos
   variantes de devolución se leían seguidas. Regla: **si algo no se
   tiene que ver todavía, va con `hidden` real.**
2. **`[data-hit]` y `[data-place]` necesitan `position:absolute` del
   lado del curso.** El motor escribe `left/top` en px como estilo en
   línea, y sobre un elemento `static` eso no hace nada: la pieza cae al
   final del flujo, fuera del arte, **mientras el clic sigue sumando
   puntos**. Avisa por `console.warn` — que desde v1.9.74 sí escucha un
   test (`overlays-colocados`).
3. **Antes de darle `position` a un contenedor del kit, fijate si el kit
   ya se lo dio.** Un `.d-slide-pad{position:relative}` de una línea
   pisó el `.slide{position:absolute;inset:0}` del kit (misma
   especificidad, la hoja del curso carga después) y descentró tres
   diapositivas. Pisar un `absolute` con un `relative` no da error en
   ningún lado. Es el mismo mecanismo que §7.18 K1, que costó una
   regresión del propio kit.
4. **`.modal-card--art` es para pop-ups que SON una imagen con alfa.**
   Usarla para un pop-up con cabecera y texto te saca el cap de alto:
   medido, 422px de tarjeta en un viewport de 340. Para eso va
   `.modal-card d-wide`.
5. **Un número que describe el render se MIDE contra el render, nunca se
   escribe.** Mordió tres veces en un solo curso: el piso del zoom
   clavado en 100 cuando el real era 64, el máximo de puntos, y las
   hitboxes.
6. **Cuidado con los bucles de `ResizeObserver`.** El alto de la hoja
   salía del alto del visor, el visor era `flex:1` en la tarjeta, y la
   tarjeta se dimensionaba por su contenido: la tarjeta bajaba sola de
   772 a 720px en 4 segundos. Se corta dándole alto definido a la
   tarjeta; el guard en el observer es el segundo cinturón, no la
   solución.
7. **Para leer `textOf()` de una diapositiva hay que NAVEGAR a ella
   primero.** El narrador filtra por `hidden` y todas menos la activa lo
   tienen, así que recorrer el DOM de una sola pasada devuelve `''` para
   todas y parece que el curso entero está mudo.
8. **Un `!important` legítimo:** `Motor._initShots()` escribe
   left/top/width/height como estilo EN LÍNEA. Cualquier regla
   responsive que quiera despegar una pieza de su caja medida —por
   ejemplo en teléfono acostado, donde 19,5% de alto son 34px reales
   para 130px de contenido— **necesita** `!important`. No es pereza.
9. **Una pieza reintentable paga solo en `onFirstFinish`.** Un `award()`
   por respuesta, sin guard persistido, es puntaje infinito.
10. **`Escape` con varios niveles abiertos va en fase de CAPTURA.** En
    un visor ampliado, `Esc` tiene que salir primero de pantalla
    completa y recién después cerrar el pop-up. Sin el listener en
    captura corre antes el cierre del motor y volver al curso desde
    ampliado es imposible sin mouse.
11. **Un desbloqueo no puede colgar de una pieza opcional.**
    `unlockCierre()` colgaba del `onFinish` de la mini-práctica: quien
    no la hacía no veía nunca el resumen final, y al sacar la
    mini-práctica quedó inalcanzable para todos. Va atado a **llegar** a
    la diapositiva de cierre.
12. **Verificá que lo medido sea el elemento correcto en el estado
    correcto.** Dos errores de MEDICIÓN, no de construcción: leer el HUD
    de puntos mientras `countTo` lo animaba (lo mismo que §7.14 y que
    resolvió `data-valor`), y medir una ilustración contra el elemento
    equivocado.

### E · Convenciones que pasan a ser regla

**Íconos del índice.** Sin regla, un curso terminó con el mismo ícono
que los repasos, contraseñas con el del convenio y tres entradas
compartiendo el de usuarios — y **nada de eso lo agarra un test**,
porque el `<use>` resuelve perfecto:
· Diapositiva **estructural** → ícono de su TIPO, y se repite a
  propósito (presentación de unidad, repaso).
· Diapositiva de **contenido** → ícono de su TEMA.
· **Dos temas distintos nunca comparten ícono.**
· Ícono definido y sin uso, se borra del sprite.

**Cómo se derivan los 3 umbrales de medalla.** No se escriben a mano:
· **bronce = el piso garantizado por el gate** (todo lo obligatorio, sin
  nada opcional). Un bronce por encima de ese piso deja sin medalla a
  alguien que terminó el curso.
· **oro = 90% del máximo medido.**
· **plata = el punto medio** entre los dos.
Y el máximo sale de un recorrido instrumentado, nunca de sumar la tabla.

**Esconder vs. deshabilitar un control.** Las dos son correctas, y lo
que decide es **quién dibujó el control**:
· Lo dibujó **el arte** (una flecha pintada en el render) →
  **deshabilitar**, con un velo bien visible y un rótulo que diga por
  qué. Esconderlo es imposible: está en el píxel. Y si está
  deshabilitado con razón, el velo tiene que ser **evidente** — 62% de
  opacidad se lee como "no responde", 88% se lee como "está apagado" — y
  el rótulo tiene que dar el dato que separa las dos lecturas: "Página 1
  de 5", no "1 de 5 vistas".
· Lo dibujaste **vos** → **esconder**. Un control que no puede hacer
  nada y que nadie dibujó no tiene por qué ocupar lugar.

**Hover sobre arte**, que es la regla que sale de §7.19 A6:
· El arte dibuja un **control** (una píldora que ya se lee como botón) →
  **no agregues realce**, `cursor:pointer` alcanza. Un aro o un tinte
  ahí crea una caja donde el alumno no ve ningún elemento.
· El arte dibuja **contenido** (una hoja, un círculo numerado) → **sí**
  hace falta realce, pero **sobre la forma**, nunca un tinte plano que
  la tape.

### J · Métodos de construcción que dejan de reinventarse

**Del PDF al curso: estados, no páginas.** 24 páginas del diseñador no
son 24 diapositivas: pueden ser 19 estados de arte. El criterio es
*"¿es el mismo cuadro con algo que cambia, o es contenido nuevo?"* — lo
primero es un estado (`initShotSwap`, píldoras revelables), lo segundo
una diapositiva. **Primer paso siempre: medir las páginas.** Si las 24
dan 2:1 exacto, `cover` no recorta nada y todo puede ir como captura
íntegra; con tamaños mezclados la decisión es otra.

**Cómo se miden las hitboxes, y las dos trampas que se repiten.**
Detección de píxeles sobre el render, bbox por color o por banda de
contenido no-blanca. Nunca a ojo. Las trampas:
· **Algo decorativo entra en la ventana.** Un bbox dio 700px de ancho
  porque atrapó una línea que cruzaba la píldora; se filtró por "filas
  con ≥40px de relleno macizo" y quedó en los 292px reales.
· **Algo sobresale de la forma.** El bbox de unos discos incluía un
  rótulo rotado que asomaba; se filtró por ancho mínimo del disco.
Y un truco que evita que un revelado "salte": verificar que el círculo y
la píldora compartan **banda `y` exacta**.

**Dónde poner controles propios sin tapar el arte: se mide la tinta.**
Para un paginador: 0px de contenido entre y 1130 y 1250 en x 700..1820,
**en los dos renders**. Por eso va ahí y no en otro lado. Del mismo
modo, unificar dos diapositivas en un swap exige verificar que la
píldora del título esté en el **mismo lugar exacto** en los dos
renders: si se mueve, el swap se percibe como "se apagó la pantalla".

**Volver a montar una ilustración que el diseñador entregó suelta.** La
pregunta correcta **no es *qué cambió* sino *dónde había contenido y
ahora hay fondo***. Comparar los dos renders y quedarse con "lo que
cambió" dio media pantalla, porque el texto también cambia entre un
render propio y el export del diseñador (hinting de fuentes); con la
máscara correcta el hueco quedó en 655×603px. Segundo paso fácil de
olvidar: medir el encuadre **del propio GIF** y corregir la caja para
que caiga el dibujo en el hueco, no el lienzo.

**Recortar un ícono del arte reconstruyendo el alfa.** Cuando el cliente
no manda el logo suelto pero está dibujado en el arte: bbox medido y
alfa reconstruido contra el fondo conocido —
`alfa = (pixel − fondo) / (255 − fondo)`, por canal y tomando el máximo—
para que quede blanco sobre transparente con bordes limpios. Se
verifica componiéndolo de vuelta sobre ese fondo antes de guardar.
**Corolario: un placeholder de 1×1 transparente NO es invisible.** Con
`.d-brand .lg img{width:20px;height:20px}` se renderiza como un cuadrado
blanco de 20px al lado del título, en todas las diapositivas. Que el
generador deje un 1×1 es razonable; que nada lo marque, no.

**Cuadros vs. peso en una imagen animada.** Contraintuitivo y medido:
**arriba de ~75 cuadros el peso casi no depende de la calidad ni del
tamaño, depende de la cantidad de cuadros.** 130 KB entre la mejor y la
peor imagen, contra ~400 KB que cuesta duplicar los cuadros. Si el peso
va a quedar arriba del umbral de todos modos, **conviene la mejor
imagen**, no la más comprimida. Y 8,3 fps se ve trabado; 12,5 no.

**Renders para ver vs. archivos para descargar: no es el mismo tamaño.**
Las hojas de un visor van a 1700px (nítidas hasta 300% de zoom); los PDF
descargables, a 1240px / 150 DPI / JPEG 78. Armarlos a 1700 daba 5,5 MB
sumados sobre un zip de 10,4 MB, para algo que en pantalla se lee igual.

**La descarga dentro de un LMS es un `<a>`, no un botón con JS.**
`<a download target="_blank">`. En un iframe de LMS un link normal es lo
único que no depende de permisos de script, y el `target="_blank"` es el
plan B para el iframe que venga sin `allow-downloads`.

**El responsive del ARTE se hace con `@container`, no con `@media`.**
Los umbrales se miden en el `.d-stage` real, no en la ventana. Y a un
tamaño donde el arte ya no se lee, **tapar parte de un dibujo ilegible
con texto legible es la mejor de las dos opciones**.

### Lo de método que se lleva el kit

**Un relay que trae mediciones vale más que uno que trae diagnósticos.**
De los tres puntos de esta sección que resultaron ser código, dos se
detectaron por un NÚMERO que no cerraba —220 contra 210 de puntaje— y no
por leer el código. El curso no sabía que `go()` tenía un bug: sabía que
le sobraban diez puntos.

## 7.22 Cinco tests nuevos: la suite pasa de 10 a 15 (kit-base v1.9.76)

Cuarta pasada. Entran los cuatro tests de la sección G del relay de
"Seguridad de la información" más uno del relay anterior, y **todos
verificados en los dos sentidos** — verde contra un curso limpio y
rojo contra una copia rota a propósito. Un test que solo sabe decir "✓"
no sirve: eso ya lo pagó este kit.

| test | qué caza que ninguno veía |
|---|---|
| `narracion-completa` | una diapositiva MUDA, una pieza escondida con CSS que el narrador lee igual, puntuación doble, frases pegadas |
| `iconos-indice` | dos temas con el mismo ícono, un `<use>` a un id inexistente, un `<symbol>` fuera del sprite, un ícono sin uso |
| `puntaje-maximo` | el máximo MEDIDO contra el declarado, más `suspend_data` pasando la mitad del cupo |
| `locucion-control` | entrar a una diapositiva y que no narre, o que narre dos veces, o que al prender relea todo |
| `video-fondo` | nombre/carpeta del .mp4, poster, playsinline, botón de gesto, y que el autoplay rechazado igual termine reproduciendo |

### Tres decisiones de diseño que vale la pena dejar escritas

**El motor de voz falso no es un capricho.** En headless no hay voces,
así que `speak()` termina al instante y `progreso()` siempre devuelve
`terminado:true`. Con eso, el caso "silenciar a mitad de la frase" —que
es justo el que importa— **no existe**. `locucion-control` reemplaza el
motor por uno que tarda 300ms por fragmento, y recién entonces se puede
medir.

**La política de autoplay tampoco.** Sin
`--autoplay-policy=document-user-activation-required`, el navegador de
pruebas deja pasar cualquier autoplay y el bug de §7.18 K10 **no se
reproduce**. Por eso `video-fondo` lanza su propio Chromium en vez de
usar `openCourse`.

**El puntaje se lee de `data-valor`, no del `textContent`.** `#d-points`
se anima con `countTo`, así que leer el texto a mitad de la animación da
un valor intermedio que "casi" parece bien — el peor resultado posible
para una medición, porque no parece un error de lectura sino un bug de
producto (§7.14).

### Un mensaje de fallo que apunta a dos lugares, a propósito

`video-fondo` detecta "el video está cargado y no se reproduce" y no
puede saber por qué, así que **nombra las dos causas y el orden en que
conviene descartarlas**: primero "nadie llamó a `initBgVideos()`" —la
falla más común de este molde— y después el autoplay sin reintento mudo.
Un mensaje que afirma una sola causa cuando hay dos manda a buscar donde
no está, que es exactamente lo que costó una vuelta entera en §7.14.

### El test que se encontró un bug del propio kit

`iconos-indice` falló de entrada contra un curso recién generado:
`tema-1` y `tema-2` compartían `i-layers` en el scaffold. La regla que
el test hace cumplir la escribió un curso, y el generador del kit la
violaba. Ahora cada tema trae su propio ícono placeholder — y al
sacarlos, el mismo test avisó que `i-layers` quedaba sin uso, que es su
cuarta regla. Se borró.

**Esa es la señal de que un test está bien escrito: encuentra algo el
día que lo enchufás, no el día que alguien rompe algo.**

## 7.23 Las piezas que los cursos venían inventando (kit-base v1.9.77)

Quinta pasada. Entra la primera mitad de la sección C del relay de
"Seguridad de la información": las piezas que un curso tuvo que
escribir porque el kit no las tenía. Todas pasan el criterio de §1
—ninguna lee nada de un curso— y viven en `js/coto-piezas.js` +
`css/coto-piezas.css`.

### `initRevelados` — revelado ACUMULATIVO

Clic en el punto N → aparece la píldora N **y las anteriores quedan
visibles**. Es lo que no hacía ninguna pieza del kit:
`initHotspots()` es "uno activo a la vez" y limpia los demás;
`initShotSwap()` cambia la captura entera. El caso real: un diagrama
donde cada número explica una parte y al final se ven todas juntas —
que es justamente el resumen que el alumno necesita. Un curso usó 14.

Tres decisiones que vale dejar escritas:
· **`faltan(slideEl)` con el mismo contrato que los gates del kit**, así
  que entra en `motor.canAdvance` y en `initGateHints` sin nada nuevo;
· **solo paga la PRIMERA vez** — una pieza reintentable que paga en cada
  toque es puntaje infinito (§7.21), y es el mismo bug que §7.21 F2;
· **`hidden` real y no CSS**, porque el narrador filtra por el atributo
  y una píldora escondida con `display:none` se narra igual (§7.21 F1).

Medido: 0 visibles al inicio, **2 acumuladas tras dos clics** (no 1),
`faltan` en 1, y repetir un punto ya revelado no vuelve a pagar.

### `initTandas` — dos juegos de carteles sobre el mismo arte

No es `initShotSwap` (que cambia la captura) ni son dos diapositivas
(el arte es el mismo y separarlas se lee como repetición).

Los controles **se esconden** en los extremos, no se deshabilitan —
porque los dibujó el kit y no el arte (§7.21, sección E). Y dónde van
se decide midiendo la tinta del arte, no a ojo. Medido: "◀" oculto al
inicio, "1 de 3" → "3 de 3", "▶" oculto al final, y tocar el final otra
vez no cuenta como cambio.

### `initPasosRepaso` — y por qué usa `MutationObserver`

Pasos numerados que reflejan en qué pregunta está el alumno y cómo le
fue en las anteriores. **Lee las clases que el kit ya escribe
(`is-current`, `is-answered`, `is-correct`) con un `MutationObserver`,
NO con un listener de clic propio.** El estado también cambia con las
flechas ‹ › y al restaurar una respuesta de una sesión anterior — un
listener de clic se pierde esos dos casos y el panel queda mintiendo.

En el CSS, el color dice el RESULTADO y un aro dice DÓNDE ESTÁS: dos
canales separados, para que se lea de un vistazo y también sin
distinguir colores.

### `initSalidaRepaso` — el "Siguiente" de la última pregunta

Con todas contestadas, lleva a la diapositiva siguiente en vez de
quedarse sin hacer nada. Pedido explícito de cliente, y hasta ahora cada
curso lo cableaba a mano. Se engancha en fase de CAPTURA por el mismo
motivo que §7.18 K9: el kit ya tiene su listener en esos botones y entre
listeners del mismo nodo gana el que se registró primero.
Medido las dos ramas: con preguntas sin contestar no sale; con todas
contestadas, sale.

### Devolución distinta según acierto o error

`resolver()` mostraba el mismo texto aciertes o no, así que la redacción
tenía que servir para los dos casos — y terminaba presuponiendo que
erraste ("Recordá que…"), raro de leer cuando acertaste. Ahora
`[data-fb-ok]` y `[data-fb-no]`, los dos opcionales: un curso que solo
traiga el `[data-repaso-fb]` de siempre se comporta igual que antes.
El genérico aparece **solo si no hubo uno específico**, porque si no se
leen los dos — y el narrador los lee los dos (§7.21 F1).
Medido: al acertar sale solo el de acierto; al errar, solo el de error.

### Dos que ya estaban resueltas

El relay listaba **"opción múltiple declarada"** y **"workaround de
A5"**. La primera salió en v1.9.75 (el modificador `.d-repaso-btns--vf`,
que además arregló que el ✓ regalara la respuesta); el segundo
desaparece porque A5 se arregló en el kit en v1.9.73 — el curso puede
borrar su `initCierreConSegundoClic()`.

### Y una que se queda afuera a propósito

Los **pips de progreso por objetivo de aprendizaje** son contenido: qué
objetivos tiene el curso y qué diapositiva cuenta para cuál no
generaliza, y el propio relay dice que "vive en el `curso.js` de cada
curso". Es la misma frontera de §1 que mantiene `initMinijuego` afuera.

## 7.24 El visor de documentos: la pieza más grande del relay (kit-base v1.9.78)

Sexta pasada. Entra la otra mitad de la sección C: el visor de
documentos (`js/coto-visor.js` + `css/coto-visor.css`), el paginado en
la diapositiva, el panel de recursos descargables y la herramienta de
capa de texto por OCR.

El kit solo tenía `.modal-card--shot` y `--art`, que muestran UNA imagen
fija. Un curso con documentos reales —un convenio, un instructivo—
necesita paginar, acercar, arrastrar, ver a pantalla completa y
descargar, y lo tuvo que escribir entero.

### Las cinco decisiones que hacen que esto no sea un visor genérico

**1 · El zoom se MIDE, no se escribe.** El piso y los escalones salen de
la escala real de ajuste (`min(ancho/natural, alto/natural)`), medida
contra el render. Un curso que clavó el piso en 100% cuando el real era
64% hacía que el primer clic saltara de 64% a 125%.
Medido acá con una hoja de 1200×1700 en un lienzo de 560px de alto: el
ajuste da **33%** y el primer escalón **41%** (33 × 1.25), no 125%.

**2 · El alto del lienzo lo fija el CSS, nunca el contenido.** Si el
alto de la hoja sale del alto del visor y el visor se dimensiona por su
contenido, el `ResizeObserver` entra en un bucle y la tarjeta se achica
sola — medido en un curso real, de 772 a 720px en 4 segundos (§7.21,
trampa 6). El guard en el observer es el segundo cinturón; el alto
definido es la solución.

**3 · Tocar el fondo para salir respeta LA HOJA, no su marco.**
Ampliado, el lienzo ocupa todo el ancho y el marco deja de ser
referencia. Y hay un umbral de 6px porque **arrastrar termina en un
`click`**: sin él, soltar el dedo después de mover cerraba el visor.

**4 · `Esc` con dos niveles, en fase de CAPTURA.** Ampliado, `Esc` sale
primero de pantalla completa y recién después cierra el pop-up. Sin el
listener en captura corre antes el cierre del motor y volver al curso
desde ampliado es imposible sin mouse. Medido: tras `Esc` el visor sale
de `is-full` **y el evento no llega al listener de burbujeo del motor**.

**5 · La pantalla completa es dentro de la página, no la API nativa.**
Adentro del iframe de un LMS, `requestFullscreen` depende de
`allow="fullscreen"` y falla en silencio.

Y la descarga es un `<a download target="_blank">` y no un botón con JS:
en un iframe de LMS un link normal es lo único que no depende de
permisos de script, y el `target="_blank"` es el plan B para el iframe
que venga sin `allow-downloads`.

### El gate por "documento leído entero"

No alcanza con abrir el pop-up: hay que pasar por las N hojas. Usa el
MISMO contrato `faltan(slideEl)` que `initPopupGate`/`initVideoGate`,
así que entra en `motor.canAdvance` y en `initGateHints` sin nada nuevo.
Medido: con 1 y con 2 de 3 hojas leídas devuelve `['convenio']`; con las
3, vacío. Y `serialize()`/`restore()` para que una sesión anterior no se
pierda.

### `initDocEnDiapo` — pasar hojas sin abrir el pop-up

Las flechas ◀ ▶ que **dibuja el arte** pasan las hojas ahí mismo, y
tocar la hoja abre el visor **en la página que se estaba mirando** — si
abriera siempre en la 1, el alumno perdería lo que venía leyendo.

No se puede hacer con `initShotSwap`, que funde la captura entera: acá
lo que cambia es UNA hoja dentro del arte, así que va un `<img>`
colocado sobre el bbox medido de la hoja.

Y acá la regla de §7.21 sección E se aplica al revés que en el visor:
estas flechas **las dibujó el arte**, están en el píxel y esconderlas es
imposible, así que se **deshabilitan** con un velo evidente y un rótulo
que da el número de página. En la barra del visor, que dibuja el kit,
también se deshabilitan —porque la barra es fija y un hueco se lee peor
que un botón apagado—; en `initTandas`, que también dibuja el kit pero
flota sobre el arte, se esconden. Lo que decide no es una regla única
sino **quién dibujó el control y si su lugar es fijo**.

### `tools/pdf-capa-texto.py`

Le pone capa de texto invisible (`render_mode=3`) a un PDF hecho de
imágenes: rinde a 300 DPI, saca las cajas de palabra con tesseract y las
escribe calzadas con la imagen, que no se toca. Un documento que el
alumno baja "para consultar" y en el que no puede buscar una palabra
sirve la mitad.

El peso no se mueve si se limpia con `clean_contents()` + `garbage=4`;
sin eso, el texto invisible suma un par de cientos de KB de fuentes
embebidas.

**Lo que NO pude verificar, y corresponde decirlo:** esta máquina no
tiene `pymupdf` ni `tesseract`, así que el camino de OCR está escrito
pero **no corrido**. Lo que sí verifiqué es que la herramienta falla
prolijamente cuando faltan las dependencias, diciendo cuáles instalar,
en vez de reventar con un stack trace. Las dependencias quedan fuera del
kit a propósito: son pesadas y esto se corre una vez por documento, no
en cada build.

### El chequeo del kit se agarró a sí mismo

`check-css-duplicates` falló sobre `coto-visor.css` **recién escrito**:
`.d-visor-zoom-val` declarado dos veces, las dos con `min-width`. Es
exactamente lo que la herramienta existe para cazar, y lo cazó en CSS
nuevo, no heredado. Corregido: un bloque por selector.

## 7.25 Última pasada: el chrome en teléfono, el test de zoom, y uno que NO entró (kit-base v1.9.79)

Séptima y última pasada sobre los relays. Cierra **E2** y **B7**, y deja
**B3 explícitamente afuera** — con lo aprendido intentándolo, que es lo
más útil de esta sección.

### E2 · El chrome no dependía del alto de la pantalla

`.d-app { grid-template-rows: 56px 1fr 64px }` — 120px fijos, sin
importar si la ventana tiene 900px de alto o 390.

**Medido en un curso recién generado**, que es el dato que faltaba:

| | lienzo | chrome | |
|---|---|---|---|
| iPhone 12 acostado (844×390) | 270px | **120px = 31%** | |
| iPhone grande (932×430) | 310px | 120px = 28% | |
| tablet (1024×768) | 648px | 120px = 16% | |

**El relay decía 56% y ~170px de lienzo; acá da 31% y 270px.** La
diferencia es chrome propio de ese curso, no del kit. Pero el problema
de fondo —que el alto del chrome no dependa del alto de la pantalla— es
real y es del kit, así que se arregla igual. Vale como recordatorio de
que un número de relay se vuelve a medir, aunque el hallazgo sea cierto.

Bajo `@media (max-height: 460px)` las filas pasan a 44px y 50px, con los
controles compactados para que entren sin perder el alto de toque.
Resultado medido: **el lienzo pasa de 270 a 296px** en teléfono
acostado, y la tablet queda exactamente igual.

No es todo lo que se podría ganar, pero es lo que se gana **sin sacar
ningún control**: los botones siguen todos, con 44px arriba y 50px
abajo contra el piso recomendado de 44.

### B7 · `visor-zoom.mjs` — cómo PROGRESA el zoom, no que exista

Los tests miraban que el zoom existiera, nunca cómo avanza. Un curso
tenía el piso escrito a mano en 100% cuando el real era 64%: el primer
clic en "+" saltaba de 64% a 125%, salteándose el escalón que el alumno
esperaba. Es la familia de §7.21 trampa 5 — **un número que describe el
render se mide contra el render**— y no da error: el zoom funciona, solo
que mal.

Verifica cuatro cosas: que el arranque sea el de "ajustar" (la hoja
entra entera), que ningún escalón sea un salto (razón < 2× entre
consecutivos), que "Ajustar" vuelva exactamente al valor de arranque, y
que los botones se apaguen en los extremos.

Verificado en los dos sentidos, y el negativo **rompiendo el código real
del kit** en vez de armar un fixture: con `escalaAjuste = 1` clavado,
reporta "arranca en 100% y la hoja NO entra entera en el lienzo".

### B3 · Lo que NO entró, y por qué vale más que si hubiera entrado

`visual-regress` es inutilizable como gate en un curso con toasts: el
relay reportó cuatro pasadas contra la misma baseline fallando en
diapositivas distintas cada vez, ninguna por una regresión real.
El arreglo parecía obvio: ignorar las zonas volátiles.

**Primer intento: tapar las zonas con un `<div position:fixed; inset:0>`
propio.** Parece razonable y **rompe la herramienta entera**: esa capa
se lleva puesta la captura del locator, así que todas las capturas salen
idénticas y `visual-regress` deja de detectar cualquier cosa. Medido:
con la capa, una regresión real daba 0% de diferencia incluso con el
umbral en 0,01%.

Eso es el peor resultado posible para una herramienta de control: **no
falla, deja de servir**. Y habría pasado desapercibido, porque "todo en
verde" es justo lo que uno espera ver.

**Segundo intento: `mask`, la opción que Playwright trae para esto.**
Funciona en aislado —lo probé: dos capturas de contenido distinto dan
bytes distintos— pero en la integración tampoco detectaba. Buscando la
causa apareció algo más importante: **la versión ORIGINAL de
`visual-regress`, sin ninguno de mis cambios, tampoco detectaba un
`hue-rotate(90deg)` sobre el lienzo entero** en ese mismo banco de
pruebas.

O sea que mi banco no era confiable y el problema es anterior a lo que
yo estaba tocando. Con eso, cualquier "arreglo" que hubiera shipeado
habría sido una conclusión sacada de una medición falsa.

**Decisión: `visual-regress.mjs` vuelve intacto a su versión de v1.9.78
y B3 queda pendiente**, con dos cosas que la próxima vuelta ya no tiene
que redescubrir: el enfoque de la capa propia está descartado y medido,
y hay una sospecha anterior que investigar primero — por qué la
herramienta no detecta un cambio masivo en ese escenario.

La regla que queda: **antes de arreglar una herramienta de
verificación, comprobar que la herramienta detecta algo.** Si no, lo que
se está midiendo es el banco de pruebas y no el arreglo.

## 7.26 Revisión general: que el curso nuevo no pueda olvidarse de nada (kit-base v1.9.80)

Repaso del kit entero con una sola pregunta: **¿qué puede omitir un
curso nuevo sin que nada se lo diga?** Es la falla que más caro salió en
todos los relays, y la auditoría la encontró otra vez — esta vez causada
por mí.

### La medición que abrió todo

El kit publica **32 funciones `init*`**. La plantilla de `js/curso.js`
mencionaba 23. **Las 9 que faltaban incluían los 6 módulos que yo mismo
agregué entre v1.9.77 y v1.9.78**: `initRevelados`, `initTandas`,
`initVisorDocs`, `initDocEnDiapo`, `initPasosRepaso`,
`initSalidaRepaso`.

O sea: construí las piezas, escribí su documentación, las probé en el
navegador… y un curso nuevo **no se iba a enterar de que existen**.
Habría vuelto a escribirlas a mano, que es exactamente el problema que
esos módulos vinieron a resolver.

Peor: tampoco estaban en `contrato-cableado`, así que un curso que
escribiera el marcado y se olvidara del `init` **no recibía ningún
aviso**. La pieza está, el cable no, y silencio — §7.17 de nuevo, en
código que yo escribí sabiendo de §7.17.

**La lección: agregar una pieza al kit no es escribir el módulo. Es
escribir el módulo, ponerlo en la plantilla, cubrirlo en el test de
cableado y nombrarlo en el prompt de arranque.** Tres de esos cuatro
pasos son los que hacen que la pieza EXISTA para quien viene después.

### El arreglo de fondo: `contrato-cableado` deja de ser una lista a mano

Los cuatro chequeos originales estaban puestos uno por uno, así que cada
módulo nuevo nacía sin cobertura. Ahora hay una tabla `PIEZAS` con el
mecanismo generalizado: **si está el marcado, tiene que estar la HUELLA
que el `init` deja en el DOM**.

| pieza | marcado | huella |
|---|---|---|
| `initRevelados` | `[data-revelar]` | `aria-expanded` puesto |
| `initTandas` | `[data-tandas]` | una sola tanda visible |
| `initVisorDocs` | `[data-visor]` | la hoja tiene `src` |
| `initPasosRepaso` | `[data-repaso-pasos]` | tiene `<li>` |
| `initDocEnDiapo` | `[data-doc-hoja]` | tiene `src` |
| `initShotSwap` | `[data-shot-swap-srcs]` | la flecha "◀" oculta en la 1ª |
| `initLogros` | `#d-badges-list` | `#d-points` con `data-valor` |

Agregar una pieza al kit = agregar una fila. Y si la pieza no deja
huella en el DOM, no va en la tabla: un chequeo que no puede distinguir
"cableado" de "no cableado" da falsos positivos, y un aviso que salta
por lo correcto deja de leerse.

Verificado: verde en un curso limpio, y **5 fallos** contra una copia
con el marcado de cinco piezas y ningún `init`, cada uno nombrando la
consecuencia que vería el alumno.

### `gamificacion.mjs` — el punto 9.5 del checklist deja de ser manual

§6.17.1 hace obligatoria la gamificación completa, y la única forma de
hacerla cumplir era el punto 9.5 de §7: *"verificar explícitamente que
estén los 4 elementos"*. **Un checklist que se verifica a mano se cumple
hasta que alguien tiene apuro.**

Ahora se mide: chip de puntos cableado, catálogo de logros con
contenido, glosario con términos reales, y al menos una práctica.

**El cuidado que hace que esto no moleste** — y es el mismo criterio que
salvó a `iconos-indice`: un curso recién generado no tiene nada de eso y
**no debe fallar por estar vacío**. El test primero mide cuánto
contenido narrable hay: por debajo de 150 palabras informa que el curso
está en construcción y no exige nada. Un scaffold da 11 palabras; un
curso real, cientos.

Verificado en los tres estados: scaffold → no exige; curso con contenido
y sin gamificación → 3 fallos con nombre; curso completo → verde.

### Y un arreglo mío que había quedado a medias

En v1.9.73 corregí §7 paso 1 para que dijera que el generador **sí**
hace el `index.html`. El párrafo seguía terminando con *"seguir con el
método de zip de referencia de §7.1 para eso"* — o sea mandando otra vez
a adaptar el index a mano, tres líneas después de decir lo contrario.

Alguien leyendo §7 en orden se llevaba la instrucción vieja. Corregido,
y de paso §7 pasó a listar los 15 JS, 13 CSS y 16 tests reales en vez de
los 10 JS y 7 tests de v1.7 — con una advertencia arriba de que **ese
listado se desactualiza y la fuente de verdad es `js/curso.js`**, que
ahora sí menciona los 32.

### Lo que la revisión NO encontró

Vale decirlo, porque una auditoría que solo reporta problemas no dice
cuánto miró:
· **Ningún id ni `data-*` huérfano** en los boilerplates: todo lo que el
  generador emite lo lee alguien (JS o CSS).
· De las **261 clases `.d-*`** del CSS, 94 las tiene que escribir el
  curso. Eso NO es un hueco: es el reparto correcto — el kit pone el
  estilo, el curso pone el contenido.

## 7.27 El molde de los simuladores: un tipo de curso nuevo sube entero al kit (kit-base v1.9.81)

Siete rondas de feedback del cliente sobre **"Simulador — Impresión de
obleas de precios"**, y lo que sale no es un lote de parches: es un
**tipo de curso** que el kit no tenía.

### Qué es un curso-simulador, y en qué NO se parece a un minijuego

No es un curso con una actividad adentro. El alumno recorre las
**mismas pantallas del sistema real** que va a tener delante en la
sucursal —el login de GESCOM, su árbol de menú, su formulario de
impresión— y resuelve cada una como la resolvería ahí.

La diferencia práctica: la cáscara de minijuego (`coto-minijuego.css`,
el "¡Aprendé jugando!" con píldoras, vidas y mapa de opciones) **no se
usa**. Es otra dinámica. Lo que sí se reusa es todo el resto del kit —
motor, chrome, narración, logros, gates, cierre.

### Arranca del PDF del diseñador, como cualquier otro curso

Esto es lo primero que hay que tener claro, y es fácil de olvidar
porque un simulador "parece" software: **el punto de partida sigue
siendo el PDF que entrega el diseñador** (§3). El riel de ayudas, las
dos cáscaras de pop-up, la pantalla de "¡Ups!" y las proporciones del
monitor del primer simulador están todas CALCADAS de ese PDF.

Y ya costó una vuelta entera: las dos últimas páginas del PDF eran los
contenedores de "Pistas" y de "Reglas", se leyeron como "pantallas
vacías", y los dos pop-ups se armaron con el modal genérico del kit. El
diseñador ya los había dibujado. Hubo que rehacerlos.

El procedimiento, cada vez:

1. **Leer el PDF entero ANTES de tocar marcado.** Las últimas páginas
   suelen ser las cáscaras de los pop-ups.
2. **Contar ESTADOS, no páginas** (§7 paso 4). Tres páginas con el
   mismo menú desplegándose son UNA diapositiva con tres estados.
3. **Decidir por pantalla**: captura íntegra vs. HTML real. Las
   pantallas del sistema van en HTML real siempre —tienen que ser
   interactivas— y las ilustraciones (portada, "¡Ups!", cierre) van
   como captura, con su texto duplicado en `.sr-only` (§7 punto 9.9).
4. **Medir sobre el arte, no estimar** (§6.70). Lo recreado en CSS
   puede —y debe— tener más terminación que el plano del arte (§6.30),
   pero la COMPOSICIÓN es la del arte.

### El corte de tres capas, que es lo que hace que el segundo sea barato

| Capa | Archivo | Quién lo toca |
|---|---|---|
| Mecánica | `js/coto-simulador.js` (kit) | nadie |
| Contenido | `js/escenario.js` (curso) | un diseñador instruccional, sin saber JS |
| Cableado | `js/curso.js` (curso) | quien arma el curso |

Hasta la ronda 5 las tres estaban mezcladas en `curso.js`. Para UN
simulador se banca; para una LÍNEA significa volver a leer 1.300 líneas
de motor para cambiar tres textos.

**Medido después de separarlas**: el `curso.js` del simulador de obleas
pasó de **1.760 a 766 líneas**, y su `diapositivas.css` de **1.665 a
184** (el resto es kit). Lo que queda en el curso es lo único que no se
puede generalizar: qué cuenta como error en un login, en un árbol de
menú y en un formulario.

**El primer bug de la separación llegó el mismo día**, y vale anotarlo:
quedó una copia vieja de `ERRORES_MENU` más abajo en `curso.js` además
de la nueva lectura desde `ESCENARIO`. En JavaScript **el `var`
duplicado de abajo gana**, así que el simulador seguía diciendo los
textos viejos mientras el archivo de datos decía otros. No lo agarró
ninguna lectura del código: lo agarró comparar el texto EN PANTALLA
contra el del archivo.

### La mecánica de pistas: tres versiones, y las dos primeras fallaron distinto

Es la pieza que más se rehizo y la que más enseña.

**v1 — una pista por pantalla, tres lupas.** El alumno gastaba la
segunda esperando algo nuevo y leía el mismo párrafo. Reporte textual:
*"cada vez que abro una nueva es la misma info"*.

**v2 — tres niveles por pantalla, UNA lupa gastable por pantalla, y los
niveles 2 y 3 destapándose gratis al equivocarse.** Arreglaba la
repetición y rompía otra cosa. Dos fallas a la vez:

- con 3 lupas para 3 pantallas y una por pantalla, **el presupuesto
  nunca apretaba**: siempre alcanzaba justo, así que no había ninguna
  decisión que tomar;
- si equivocarse destapaba ayuda gratis, **equivocarse era
  estrictamente mejor que pedir una pista**. La jugada óptima era no
  usarlas nunca.

El cliente lo detectó sin poder explicarlo: *"lo de las pistas quedó
raro, como que ahora no tienen mucho sentido"*. Tenía razón, y la
lección es dura: **yo mismo había escrito la consecuencia de balance
como "nota al pie anotada a propósito" en el README de esa ronda, y no
la corregí.** Una consecuencia de diseño que uno documenta y no
arregla es una consecuencia que vuelve.

**v3 — la que quedó:**

- cada nivel cuesta una lupa del presupuesto común, y se pueden gastar
  varias en la misma pantalla;
- cada clic trae información NUEVA y más concreta, nunca el párrafo
  anterior;
- **el último nivel SEÑALA**: además del texto, resalta la zona en la
  pantalla. Es lo que se compra con esa lupa;
- equivocarse no regala nada;
- releer lo ya abierto es gratis, siempre.

El efecto de fondo: quemar dos pistas en la primera pantalla es
quedarse con una para las dos que faltan, y **quedarse sin pistas vuelve
a ser algo que puede pasar** — con lo cual el reloj y el "¡Ups!" que el
cliente definió en la primera reunión vuelven a tener sentido. En v2
eran prácticamente inalcanzables.

`tools/tests/simulador.mjs` mide esto: falla si el presupuesto alcanza
para todas las pistas de todas las pantallas, y si dos pistas de una
misma pantalla son iguales.

### Las tres reglas de contenido que salieron de este curso

**1 · Una pista nunca canta la respuesta primero.** Orientar → acotar →
señalar. Y ninguna se burla ni presupone que el alumno es lento: puede
ser su primer día (§6.10.2.3). Una pista del primer simulador mandaba a
mirar la sucursal *"arriba de todo"* — donde no decía nada. El dato no
estaba en la pantalla: hubo que ponerlo Y reescribir la pista para que
diera la REGLA, no la respuesta.

**2 · Una trampa que no se puede deducir no enseña: castiga.** La
pantalla de impresión tenía siete controles que penalizaban. Cuatro de
ellos —"Activos/Inactivos", "Plu en Surtido", "Novedades", "Tomado
PDA"— son filtros internos que el curso nunca explica. Se sacaron de las
trampas. Pero **no se desactivaron**: siguen tocándose y avisan una vez
que para ese pedido dan igual. Un control que responde al clic y no hace
nada es un control roto (§7.3); uno que castiga sin explicación es una
trampa. Esto no es ninguna de las dos.

**3 · Ningún logro por "terminar sin usar pistas".** Premia al que duda
y no pide ayuda para no perder la medalla — exactamente el
comportamiento que no queremos. Las pistas están para usarse.

### Perder tiene que decir dónde

Un "¡Ups!" genérico manda al alumno a repetir desde cero las pantallas
que ya tenía resueltas: la forma más rápida de que abandone. El del kit
dice en qué pantalla se trabó, y el botón del arte pasa a significar
**retomar desde ahí** — con una pista nueva, porque volver con cero
pistas y el próximo error sacándolo otra vez es un callejón. Empezar de
cero queda como segunda opción, abajo.

Y **de ahí no se sale con Escape**: el motor cierra cualquier pop-up con
Escape o con clic en el fondo, y eso dejaba una partida congelada
—controles mudos, riel escondido— sin nada que lo explicara. No se le
pelea el Escape al motor: se le da al cierre el único significado que
tiene ahí, que es reintentar.

### Lo que el simulador le saca al chrome del curso, y lo que no

Durante la partida se apagan el chip de puntos, el glosario y el índice
(`body.sim-jugando`). No es cosmética: el chip convierte cada pantalla
en una jugada por puntaje, el índice es un atajo para salirse del
procedimiento en el medio, y el glosario tapa la pantalla que el alumno
tiene que estar mirando. Vuelven en la portada y en el cierre.

**"Anterior" NO se esconde.** Fue la primera versión y rompía una
garantía del kit que está bien puesta —que el alumno nunca queda
encerrado, medida por `full-regress`—. Lo que molestaba no era el botón
sino lo que hacía: caminar hacia atrás por pantallas congeladas. Así que
**se resignifica**: adentro del simulador dice "Al inicio" y sale de una.
El pedido se cumple, la garantía se mantiene, y el botón hace lo que
dice.

Mismo criterio con **"Continuar" del resumen final**: cierra el resumen,
desbloquea el gate y deja al alumno donde estaba. El avance lo maneja él
con la barra de abajo, como en todo el resto del curso. Saltar solo al
cierre era un salto de más.

### El teléfono acostado, resuelto y medido

En un teléfono acostado el lienzo mide **932×336** y la tipografía de
una pantalla de sistema recreada cae a **3,76px**: está, se ve, y no se
lee. `clip-audit` pasa —nada se sale del lienzo— y el simulador igual no
sirve.

Lo que **no** se hizo: una versión "móvil" con menos controles. El
sistema real tiene esos veinte controles; sacarle la mitad enseña un
sistema que no existe.

Lo que se hizo: **acercar y arrastrar**, con umbral de 6px para que un
toque siga siendo un clic y se puedan tildar casillas con la pantalla
acercada. Medido después: **14,4px al 240%**. El control va en el RIEL y
no flotando sobre el monitor — probado sobre un viewport táctil real,
encima tapaba una casilla del formulario.

Dos detalles que solo aparecen probando: el zoom se ancla **arriba** y
no en el centro geométrico (en una pantalla de sistema los controles
están arriba y la mitad de abajo es grilla vacía: centrar dejaba al
alumno mirando un rectángulo blanco), y los rótulos de la hoja de ruta
se esconden a esa altura —caen a 5px— dejando solo los números.

### `css/coto-gescom.css`: por qué la pantalla del sistema también sube

GESCOM es EL sistema del salón. Cualquier simulador de un procedimiento
de sucursal —pedidos, precios, stock, devoluciones— empieza por esa
misma ventana, ese mismo árbol y ese mismo formulario Java. Rehacerlos
por curso es rehacer el mismo trabajo y que cada curso tenga un GESCOM
apenas distinto.

**Los colores están muestreados pixel a pixel de las capturas reales del
cliente**, no derivados de los tokens del curso — por eso el archivo
tiene hex crudos y `check-raw-cat-colors` no se queja: no son colores de
categoría disfrazados, son los grises de Windows y los azules de Swing.
Un GESCOM "lindo", con la paleta del curso, deja de parecerse al que el
alumno tiene en la sucursal, y ahí el simulador pierde justo lo que lo
hace valer.

### Dos bugs de este curso que son lecciones generales

**El `autocomplete="off"` no alcanza.** Chrome lo ignora en cualquier
formulario que huela a login, y lo que lo delata es el
`type="password"`: aparecía el desplegable con las credenciales
GUARDADAS DEL ALUMNO encima del campo. Se sacó el `type="password"` y
la contraseña se enmascara con CSS (`-webkit-text-security`). Cubre
Chrome/Edge/Safari, **no Firefox** — queda anotado, no escondido.

**Un elemento con `container-type` no es su propio contenedor.** Un
`padding: 2.2cqw` sobre un elemento que declara `container-type` se
resuelve contra el contenedor de AFUERA. La etiqueta impresa salía
2.87:1 donde el arte manda 3:1. Se detectó **midiendo el elemento
renderizado**, no leyendo el CSS.

### Los 6 relays que este curso dejó, aplicados

1. **`hitbox-click-check`, falso positivo**: miraba el estilo computado
   del hitbox y no de sus ancestros, así que un hitbox dentro de un
   contenedor apagado por CSS se reportaba como "roto". Ahora usa
   `checkVisibility()`.
2. **La cáscara del simulador** → este lote.
3. **La primera diapositiva de CUALQUIER curso quedaba muda.** Los
   navegadores bloquean `speechSynthesis.speak()` hasta que hay un
   gesto, y el primer `slidechange` lo emite el constructor del motor.
   El kit ya tenía el guard equivalente para los SONIDOS (`huboGesto`) y
   no para la voz. Reparado en `coto-player.js`, y solo si el alumno
   sigue en la misma diapositiva.
4. **`initRepasoRapido` no señalaba la correcta ni narraba la
   devolución.** Un repaso que dice "te equivocaste" y no muestra la
   respuesta no enseña. Las dos cosas están ahora en el kit.
5. **Un cambio de DISEÑO podía apagar la locución en silencio**:
   rehacer una lista de opciones como fila de `<button>` las saca de
   `TEXT_SEL`, y la pregunta se narra sin ninguna respuesta. Lo detecta
   `narracion-completa`.
6. **`gamificacion` medía la práctica por su marcado.** Un curso que es
   100% práctica —un simulador— fallaba el test que pide práctica, y el
   empujón era agregar un quiz decorativo. Ahora el curso puede
   declararla con `<body data-practica="…">`.

### Un bug propio, encontrado al empaquetar

`build-zip.py` excluye `PROMPT-CURSO-NUEVO.md` y
`header-boilerplate.html` del zip: son archivos de TRABAJO y no van al
alumno (§7.18 K8). Aplicaba la misma regla **al zip del kit**, donde
esos dos archivos son parte del kit — `new-course.mjs` los copia a cada
curso que genera. Un kit empaquetado sin ellos genera cursos rotos.

No se encontró usándolo: se encontró **revisando la lista de entradas
del zip recién armado**. Y ese es el punto — el kit se arma en una
sesión y se usa en otra, así que el error habría aparecido en el
próximo curso, lejos de su causa y sin nada que lo conectara con esta
sesión. Ahora el script distingue kit de curso por su huella (trae
`tools/new-course.mjs` + `index-boilerplate.html`).

**La verificación que corresponde a un cambio de empaquetado**:
descomprimir el zip, generar un curso desde ESA copia y correrle la
suite. 18/18.

### `--tipo simulador`

`node tools/new-course.mjs <dir> --titulo "…" --cat <cat> --tipo simulador`
deja la carpeta con `js/escenario.js` creado desde la plantilla, el
`simulador-boilerplate.html` a mano, los `<link>`/`<script>` en orden y
el `data-practica` puesto.

**No genera pantallas.** A propósito: un esqueleto de tres pantallas
inventadas invita a llenarlo sin abrir el PDF, que es el error que este
kit ya pagó más de una vez.

---

## 7.28 Lo que la auditoría del relay del simulador encontró aparte (kit-base v1.9.81)

§7.27 es el relay tal como llegó. Esta sección es lo que apareció al
verificarlo contra el código real, que es el paso que pide §0.1 y que
acá volvió a pagar: **dos de los seis hallazgos eran más graves de lo
que decía el relay, y aparecieron cuatro que el relay no traía.**

### 1. K5 no era un riesgo a futuro: era el estado por defecto

El relay reportaba las "opciones mudas" como una trampa de diseño —
*"rehacer una lista de opciones como fila de botones apaga la locución
sin tocar una línea de JS"*. Al medirlo contra el kit real resultó que
**el marcado que el propio kit documenta ya es esa fila de botones**:
`coto-repaso.css` muestra cada opción como un `<button>` suelto dentro
de `.d-repaso-btns`, y `<button>` nunca estuvo en `TEXT_SEL`.

Medido en los dos cursos de referencia terminados: **12 opciones cada
uno, las 24 mudas.** No es que un rediseño pudiera romperlo; estaba
roto desde siempre, en todos los cursos. Quien hace el curso
escuchando oía la pregunta y después silencio.

El arreglo va en el kit, no en el test: `.d-repaso-btns button` entra
en `TEXT_SEL` (`narrador.js`). Verificado en las dos direcciones sobre
un curso real: con el arreglo la locución dice "…Verdadero. Falso."
después de cada pregunta; sacándolo, esas dos palabras desaparecen de
`textOf()`.

Y el test se cambió para que **le pregunte al kit** en vez de traer su
propia copia de la lista: `Narrador.textSel()` (nuevo) devuelve el
`TEXT_SEL` vivo, con lo que el curso le haya sumado por `addTextSel()`.
Una lista duplicada en un test es una lista que un día se
desincroniza y el test miente en verde.

### 2. Tres comentarios rotos en el boilerplate — texto vivo en la página

`simulador-boilerplate.html` llegó con tres bloques donde un
encabezado de sección nuevo se había pegado DENTRO de un comentario ya
existente. El `-->` del encabezado cerraba el comentario de arriba, y
la cola del viejo quedaba como **texto que se renderiza**:

```html
<!-- ========== 7 · "¡UPS!" ... ========== -->
significado que puede tener, que es empezar de nuevo. -->
```

Las cinco verificaciones de completitud que traía el relay no podían
verlo: cruzaban atributos y clases, ninguna parseaba el HTML. Los
tests de Playwright tampoco, porque corren contra el `index.html`
generado y los boilerplates son archivos que se copian a mano.

Arreglados los tres, y el agujero cerrado con
**`tools/check-comentarios-html.mjs`**, que entra en `test:kit`:
ningún `.html` del kit puede tener un `<!--` sin cerrar ni un `-->`
en texto vivo. Verificado en rojo rompiendo el archivo a propósito.

### 3. El README le prometía al curso una función que el kit ya no tiene

`initCertificatePrint()` se sacó en v1.9.64 por decisión de producto
(§7.12), y la línea siguió viva en el snippet de `boot()` del
`README.md` —el que un curso nuevo copia y pega— hasta acá. Lo
encontró un curso real tirando `initCertificatePrint is not defined`
en consola.

`check-globals.mjs` no podía verlo: solo miraba `js/`. Ahora tiene una
tercera pasada que revisa los **bloques de código** de `README.md` y
`PROMPT-CURSO-NUEVO.md` y exige que todo `initX(` que aparezca ahí lo
publique algún módulo. Solo los bloques de código: en la prosa se
nombran funciones históricas a propósito, y eso es información, no una
promesa.

### 4. El error que el relay acababa de arreglar, repetido con los archivos nuevos

El relay arregló que `build-zip.py` no excluyera `PROMPT-CURSO-NUEVO
.md` ni `header-boilerplate.html` del zip del KIT (§7.27). Pero los
dos archivos de trabajo que ESE MISMO relay agrega no estaban en la
lista de exclusión del zip del CURSO:

- `simulador-boilerplate.html` — 45 KB de pantallas de referencia que
  el alumno nunca abre. Agregado a `ARCHIVOS_DE_TRABAJO`.
- `js/escenario-boilerplate.js` — la plantilla de datos. Peor que el
  otro: `copiarDir('js')` la copiaba al `js/` de **todos** los cursos,
  simulador o no, así que viajaba al zip sin que nadie la nombrara.
  Ahora `new-course.mjs` la saltea, igual que a `curso.js`.

### 5. CSS sin marcado, marcado sin CSS — el cruce que el relay dice hacer

El relay declara tres pasadas de completitud (A: atributos 30/30, B y
C: clases). A se confirmó exacta. B y C no: quedaban **cuatro clases
con CSS en el kit y ningún ejemplo de marcado en ningún lado**
(`.sim-hit-cta`, `.sim-pop-txt`, `.sim-llevate`,
`.sim-cierre-reintentar`) y **tres clases muertas en el marcado**
(`.gx-node--l2`, `.gx-ojo-on`, `.gx-ojo-off`, que no definía nadie).

Es exactamente la forma de error que el propio relay nombra —*subió el
CSS y no el marcado*— y la conclusión es la misma que allá: las cuatro
tienen ahora su ejemplo en la sección 7b del boilerplate, las tres
muertas se fueron, y las `.sim-oblea-*` —cuyo CSS vive a propósito en
el `diapositivas.css` del curso— llevan el aviso escrito al lado del
marcado, que es donde alguien lo va a leer.

### 6. El índice de `CLAUDE.md` estaba parado en §7.3

Nada que ver con el simulador, pero salió en la misma pasada: el
índice tenía 92 entradas para 116 secciones. Le faltaban las 23 de
§7.05 a §7.27 — o sea, **todos los relays de curso desde v1.9.57**.
Un índice que no nombra la mitad del documento no es un índice
incompleto: es uno que enseña a no usarlo. Completado.

### Lo que NO se pudo verificar, y hay que decirlo

§0.1 paso 3 pide cerrar el relay corriendo la suite contra el curso
REAL con el `js/`+`css/`+`tools/` del kit reemplazados. **Acá no se
hizo: el curso del simulador de obleas no vino en el zip** (§8 del
relay lo excluye a propósito, y con razón: es contenido de ese curso).

Lo que sí se hizo en su lugar:
- curso nuevo normal → **18/18**;
- curso nuevo `--tipo simulador` → **18/18**;
- un curso-simulador armado a mano con el marcado del boilerplate y un
  `escenario.js` de tres pantallas → `simulador.mjs` **en verde**, y en
  rojo al subirle el presupuesto de pistas y repetirle una: los dos
  fallos que el test existe para dar.

Eso prueba que el molde arranca y que el test mide, pero no reemplaza
correrlo contra el simulador terminado. Queda pendiente para la
sesión que lo tenga.

## 7.29 La vuelta de iPad: 5 parches relayados, 1 ya estaba y 2 venían con un defecto adentro (kit-base v1.9.82)

Relay de "Seguridad alimentaria" después de que el cliente probara el
curso en un iPad. Cinco hallazgos, los cinco genéricos. Verificados uno
por uno contra el código real, que es lo que §0.1 pide y lo que acá
volvió a evitar dos regresiones.

### El saldo, antes del detalle

| # | Qué | Veredicto |
|---|---|---|
| 1 | Video de fondo recortado de costado en tablets | real, aplicado |
| 2 | El video de fondo no arranca solo en iOS | **ya estaba** desde v1.9.72, y el kit lo tiene mejor resuelto |
| 3 | El foco del pop-up levanta el teclado de iPadOS | real, aplicado — pero el fragmento venía mutilado |
| 4 | Locución: voz latina por regla, velocidad 1.0x | real, aplicado |
| 5 | Pop-ups más chicos | real, **se había perdido** en una vuelta anterior |

### 1 · El video recortaba contenido, y `object-position` no podía salvarlo

La rama de "llenar y recortar" del `@container` (§6.9/§6.31) se apoya en
una premisa: el arte respeta el margen de seguridad lateral del 13%, así
que recortar los bordes es gratis. **Las láminas exportadas del PDF lo
respetan. Los videos no** — son una exportación aparte que el cliente
hace fuera del PDF y que no hereda el margen del molde.

La medición que cierra el caso: en la portada el título arranca en 13,3%
(correcto) pero el ornamento de la derecha deja solo **3,0%** libre. En
un iPad Pro 12,9" hay que esconder **24,4%** del ancho y solo hay 16,3%
disponible sumando los dos lados. O sea que **no existe ningún
`object-position` que salve las dos puntas**: no es un encuadre mal
elegido, es que no alcanza el margen.

El fix: `.d-shot-slide--bg-video > .d-shot` vuelve al lienzo fijo 2:1
cuando el stage es más angosto que 2:1. La banda sale sola del
`background` que `.d-stage` ya tiene.

Dos decisiones de alcance que vale conservar:

- **Techo en 2.0, no en 2.2.** Por encima de 2:1 el stage es más ancho
  que el arte, así que `cover` recorta ALTO y no ancho: ahí no hay nada
  que arreglar. Con el techo en 2.0, **16:9 puro queda idéntico**.
  Tampoco se acotó a 1.7 ("solo iPad"): un monitor 16:10 de 2560×1600 da
  1.730 y se come el mismo ornamento. Una sola regla, un solo criterio.
- **Solo `--bg-video`, no `--bg-layered`.** En las láminas el recorte
  solo se come decoración, y ponerles banda las dibujaría 21% más chicas
  justo donde SÍ hay texto que leer.

### 2 · El que ya estaba, y por qué igual valió mirarlo

El relay traía el reintento mudo ante `NotAllowedError` como hallazgo
nuevo. **El kit lo tiene desde v1.9.72** (§7.18 K10) y además mejor: el
kit expone `bgVideoAutoMudo` para apagarlo y marca el botón con
`data-modo="sonido"|"reproducir"` para que el curso lo rotule. El
fragmento del relay no tiene ni una cosa ni la otra.

Aplicarlo habría sido una regresión silenciosa — el caso exacto contra
el que §0.1 previene. Lo que sí entró de ese hallazgo es su TEST, que
el kit no tenía.

### 3 · El fragmento que venía con dos cosas de menos

El hallazgo es real: `showPopup` enfocaba el primer enfocable del
pop-up, y si ese primero es un `<input>` —el buscador del glosario, los
sliders del panel de sonido— iPadOS levanta el teclado en pantalla y en
pantalla completa dispara el cartel de Safari *"parece que estás
escribiendo…"*. En un curso de puro touch, una y otra vez. El foco pasa
a la TARJETA con `tabindex="-1"`.

Pero el fragmento venía como "reemplazá `showPopup` completo", y esa
versión **no tenía el `return true`/`return false`** ni el arreglo de
modales apilados de v1.9.52. Pegado tal cual:

- `_advance()` hace `if (this.showPopup(gate)) return;` — sin el valor
  de retorno, **el gate de avance deja pasar al alumno**;
- abrir un pop-up desde otro volvía a dejar los dos apilados.

Se aplicó solo el cambio de foco. Es la lección de §0.1 en su forma más
concreta: el fragmento estaba escrito contra una versión del kit más
vieja que la que tenemos, y "reemplazá la función completa" arrastra
todo lo que esa versión no tenía.

### 4 · La voz: un atajo que se salteaba la cadena entera

`pickVoice()` tenía un atajo para tablet —preferir Paulina (es-MX) y si
no, Mónica (es-ES)— que corría ANTES de la cadena de preferencia. Era un
pedido real del cliente de una vuelta anterior, y tuvo un efecto que
nadie buscó: **en iPad la cadena no se evaluaba nunca**, así que no se
llegaba a una voz argentina aunque el dispositivo la tenga (iOS trae
es-AR), y sin Paulina caía en una voz de ESPAÑA — lo contrario del
pedido.

Los dos pedidos se contradicen menos de lo que parece: Paulina es es-MX,
ya está dentro de la familia latina. Así que en vez de un atajo, pasa a
ser la preferida DENTRO de su nivel (`prefer`), y `es-ES` sale del
comodín `/^es/i` para ser el último nivel.

**Y la velocidad pasa a 1.0x para toda voz.** Antes era 1.22x con
Paulina, 1.15x con voz de calidad conocida y 1.0x con una de respaldo.
Cada número salía de probar UNA voz en UN dispositivo, y el resultado
era que la misma locución corría a tres velocidades según qué paquete de
idioma tuviera el alumno. ⚠️ **Efecto esperado en escritorio: la voz
sigue siendo la misma pero pasa de 1.15x a 1.0x, o sea suena más
lenta.** Es lo pedido, no una regresión.

`esTablet()` quedó sin usos y se borró: era su único llamador.

### 5 · El parche que se había perdido

Los tamaños de pop-up se entregaron en una vuelta anterior y **nunca
llegaron al kit** — verificado: los valores viejos seguían los 13
lugares. Entraron ahora.

La lección que dejó, que es lo que vale guardar: **la métrica correcta
NO es el ancho, es el ÁREA en pantalla.** El primer intento de esa
vuelta angostó solo `.modal-card` y el pop-up de Logros quedó PEOR en
iPad (de 30% a 35% de la pantalla), porque al angostarse la grilla de 5
badges se partía en dos filas y el pop-up crecía a lo alto. Por eso el
`minmax` de `.d-badges-grid` baja a 98px.

### Los tres tests nuevos, y los dos que hubo que corregir al integrarlos

La suite pasa de 18 a 21. Los tres venían del relay y los tres
necesitaron un arreglo que solo se ve poniéndolos contra el kit:

- **`video-lienzo-tablet.mjs`** daba por sentado que la portada es
  `--bg-video` y que existe una diapositiva llamada `introduccion`.
  Ciertas en el curso del que salió, falsas en un curso recién
  generado — que no tiene ninguna diapositiva con arte todavía. Sin
  guard, **un curso nuevo arrancaba con el test en rojo por no tener
  contenido**, que es la forma más rápida de enseñar a ignorar la suite.
  Ahora informa y sale, y busca la lámina de control en el documento en
  vez de nombrarla a mano.
- **`video-autoplay-ios.mjs`** tenía el mismo problema de guard, y
  además **una expectativa que contradecía al kit**: esperaba que con el
  sonido apagado por el alumno el botón se ESCONDIERA. El kit lo muestra
  en modo "reproducir", y tiene razón — el video no está corriendo, así
  que esconder el único control deja un poster congelado sin salida. Se
  corrigió el test, no el kit, y de paso ahora verifica el contrato
  `data-modo` que el fragmento del relay ni conocía.
- **`locucion-voz-velocidad.mjs`** entró tal cual. Es el más
  instructivo de los tres por lo que cuenta el propio relay: su primera
  versión pasaba en VERDE con el bug puesto, porque el atajo estaba
  detrás de `matchMedia('(pointer:coarse)')` y un viewport del tamaño de
  un iPad no alcanza — hace falta `hasTouch`/`isMobile`.

Los tres verificados en las dos direcciones. Con el bug repuesto:
`locucion-voz-velocidad` da 6 fallos, `video-lienzo-tablet` da 4 (los
mismos 4 que documentaba el relay) y `video-autoplay-ios` da 3.

### Lo que queda sin confirmar

El punto 3 **no se probó en un iPad real** — iPadOS Safari no se puede
reproducir en este entorno, ni acá ni en la sesión del curso. Lo que se
verificó es que ningún pop-up del kit enfoca ya un `input`, que Tab
sigue llegando al primer botón y que Escape cierra. Si el cartel de
Safari persiste, el siguiente paso es no usar la Fullscreen API en
iPadOS —que es lo único que lo hace aparecer— y resolver "Ampliar" con
CSS.

## 7.30 Segunda vuelta de iPad: el video que arrancaba tarde, el chrome para dedos y un botón que mentía (kit-base v1.9.83)

Tres hallazgos más del mismo relay, después de que el cliente probara en
un iPad los parches de §7.29. Los tres son la misma historia en tres
capítulos, y conviene leerlos juntos: **el 6 hace que el video arranque
a tiempo, el 8 arregla el control que recién ahí se ve, y el 7 es lo que
hace que ese control se pueda tocar.**

### 6 · "Navegué a la siguiente, volví, y RECIÉN AHÍ arrancó solo"

Ese reporte es el diagnóstico completo, y vale la pena ver por qué.

El reintento mudo de §7.18 K10 cubre el rechazo por política de
autoplay, pero **sus dos intentos pasan en el mismo instante: al
cargar**. Y al cargar todavía pueden faltar dos cosas distintas:

- **el gesto** — Safari no da por válido ningún gesto previo cuando el
  SCO recién se monta dentro del iframe del LMS, así que hasta el
  intento mudo puede caer;
- **los datos** — `preload="auto"` sobre un .mp4 de 20MB no garantiza un
  solo frame decodificado: `play()` puede resolver y quedarse igual en
  el póster, buffereando.

Las dos terminan en lo mismo (póster quieto) y las dos se resuelven
solas al volver a pasar por la diapositiva, porque para entonces ya hubo
gesto y ya hay datos. **Navegar y volver no era otro estado: era un
segundo intento más tarde.** Cuando un reporte describe *cuándo* algo
empieza a funcionar, eso vale más que cualquier hipótesis.

No se pueden distinguir sin un iPad en la mano, así que se cubren las
dos con el mismo criterio —no confiar en que el único intento sea el de
la carga—: reintento al primer gesto real (`once`, captura, pasivo) y
reintento en `canplay`. Los dos salen si el video ya está reproduciendo:
un video andando mudo no se reinicia porque el alumno tocó otra cosa.

El daño no era solo visual: estas diapositivas suelen ser
`[data-autoadvance]` y encadenan con `ended`, así que un video que no
arranca **deja al curso esperando un final que no va a llegar**.

### 7 · El chrome medía lo mismo en un monitor de 27" que en un iPad

Medido antes de tocar nada, sobre un curso real: con el chrome fijo en
56+64px, **los 10 botones del header y el footer quedaban por debajo de
44×44 en TODA resolución**, el más chico 26×26. (El relay decía 28; 26
es lo que dio acá. La diferencia no cambia nada.)

Va sobre `pointer: coarse` y NO sobre un ancho: lo que decide es si hay
dedo o mouse. Escritorio queda exactamente como estaba, verificado.

**Efecto lateral bienvenido:** bajar el alto del stage acerca su
proporción a 2:1, así que además baja el recorte lateral del arte de
§7.29 punto 1. Medido: un iPad 10" pasa de 1024×648 (ratio 1.580) a
1024×616 (ratio 1.662).

**Y una corrección al parche, que es lo que hay que retener.** El
fragmento venía como `@media (pointer: coarse)` a secas. Así aplicado,
**un teléfono ACOSTADO —que también es `pointer: coarse`— se comía el
chrome compacto de §7.25 E2**: ahí las barras miden 44+50 sobre 390px de
alto justamente porque 120px se llevan el 31% de la pantalla. Y no hacía
falta ni que ganara `grid-template-rows`: el piso de `min-height: 44px`
por botón le gana igual a `.d-iconbtn { height: 32px }`, porque son
propiedades distintas. Se acotó con `and (min-height: 461px)`.

En un teléfono acostado el que aprieta es el alto, no el dedo — y el kit
ya había elegido cuál gana.

### 8 · Un control que cambió de significado y siguió con la misma forma

El botón del video de fondo nació como *"el video no arrancó, tocá para
reproducirlo"*: un ▶ grande y centrado sobre el arte. Desde §7.18 K10 el
video SÍ arranca solo, mudo, así que lo que ese botón ofrece es **el
audio**. Un ▶ centrado sobre un video que ya se está viendo es
engañoso, y encima está justo donde viven el título y el logo.

Llevaba meses mintiendo sin que nadie lo tocara: lo cambió el arreglo de
al lado. **Al cambiar lo que algo hace, hay que mirar si lo que dice
sigue siendo cierto.**

Ahora es un chip con ícono y texto, abajo al centro, con 44px de alto
mínimo (el mismo piso del punto 7, y este control vive justo donde más
se lo toca).

**Dos diferencias con el parche, las dos porque el kit estaba más
adelante que el curso del que salió el relay:**

1. El relay decía que el CSS "estaba roto" —un círculo de 76px con el
   texto crudo adentro—. En el kit no: v1.9.72 ya lo dejaba crecer a
   píldora cuando hay rótulo. Ese bug era de la copia vieja de ese
   curso. Lo que sí es cierto en el kit es el punto de fondo: la forma
   centrada ya no corresponde.
2. El relay pedía cambiar el MARCADO de cada curso, y avisaba que "un
   curso que pegue solo el CSS va a seguir viendo el texto crudo". Acá
   no hizo falta: **el kit le pone el ícono, el texto y el
   `aria-label` al botón desde `initBgVideos`**, así que los cursos que
   ya existen se arreglan solos sin tocar su `index.html`.

Y el punto 2 destapó un caso más de "la pieza está y el cable no"
(§7.17): desde v1.9.72 el kit marcaba `data-modo="sonido"|"reproducir"`
y el comentario decía *"el curso decide el rótulo leyendo `data-modo`"*.
**Ningún curso lo hizo nunca**, así que el botón decía siempre lo mismo
que traía el boilerplate. Un contrato que hay que acordarse de cumplir
en cada curso es un contrato que no se cumple: ahora lo cumple el kit.

### Los tests: de 21 a 23, y dos correcciones más

`chrome-tactil.mjs` y `video-tap-chip.mjs` son nuevos, y
`video-autoplay-ios.mjs` suma el caso 3 (el rechazo que persiste hasta
el primer gesto). Las correcciones al integrarlos:

- **`video-tap-chip` fallaba en un curso sin video de fondo**, igual que
  los dos tests de video de §7.29 antes de que se les pusiera el guard.
  Tercera vez con la misma forma de error: **un test escrito contra un
  curso terminado da por sentado que hay contenido.**
- **El caso 2 de `video-autoplay-ios` quedó obsoleto por el parche 6.**
  Exigía exactamente un intento de `play()`; con los reintentos
  diferidos la cantidad depende de si llegó antes `canplay` o el gesto,
  y las dos son correctas. Ahora verifica dónde TERMINA —video mudo
  corriendo y botón escondido, o botón visible en modo "reproducir" si
  ningún reintento lo levantó— en vez de contar llamadas.
  (De paso: en §7.29 yo había corregido ese mismo caso en la dirección
  contraria, porque sin el parche 6 el botón sí tenía que quedar
  visible. Las dos lecturas eran ciertas en su momento; la que vale es
  la de ahora, con los reintentos puestos.)

Los cinco tests, verificados en las dos direcciones. Con el fix sacado:
`chrome-tactil` da **33** fallos, `video-tap-chip` **12** y
`video-autoplay-ios` **2** en el caso del gesto.

### Lo que sigue sin confirmarse en un iPad real

Igual que en §7.29: nada de esto se probó en iPadOS Safari, que no se
puede reproducir en este entorno. Lo que se midió son las condiciones
que el kit controla —tamaños, proporciones, cantidad de intentos de
`play()`, qué dice el botón— en un Chromium con contexto táctil. El
comportamiento real de la política de autoplay de Safari dentro del
iframe del LMS solo lo confirma el dispositivo.

## 7.31 Puesta al día: tres hallazgos que encontraron los tests, y una revisión general (kit-base v1.9.84)

Relay de subir "Seguridad alimentaria" de ~v1.9.56 a v1.9.83. Lo que
importa del lote, antes del detalle: **los tres los encontraron los
tests del propio kit, ninguno una persona mirando la pantalla.** Y los
tres estaban pasando hacía versiones sin que nadie los reportara.

### K1 · El repaso dejaba contenido INALCANZABLE en pantallas bajas

Lo encontró `clip-audit`. Hasta v1.9.83 `coto-repaso.css` no tenía
NINGUNA media query ni ningún tope de alto.

El caso medido a 844×390 (teléfono acostado): la ficha arranca sobre el
70% del alto del lienzo y pide 133px donde hay 90. Se sale 42px del
`.d-shot`, que recorta con `overflow: hidden`, y nadie en la cadena
ofrece scroll. **Ese contenido no queda apretado: queda inalcanzable.**
El alumno no puede leer el final de la ficha ni llegar a las flechas.

Dos medidas, y hacen falta las dos: compactar (que es lo que de verdad
baja el alto — medido: tocar solo paddings movió 2px de los 26 que
faltaban) y `max-height:100%` + `overflow:auto` como red para el
contenido que nadie midió.

### K2 · La diapositiva con `data-intro-popup` se narraba a medias y quedaba muda

Lo encontró `locucion-control`. La secuencia, medida:

| t | qué pasa |
|---|---|
| 0 | el motor emite `slidechange` |
| 220ms | `coto-player.js` narra la diapositiva |
| 350ms | el motor abre el `data-intro-popup` |
| 350ms | `initPopupNarration` narra el pop-up, y su `speak()` llama a `cancel()`: **corta la diapositiva a mitad de la primera palabra** |
| al cerrar | `popupclose` → el kit solo hace `cancel()`. **La diapositiva nunca se retoma.** |

Neto: un arranque en falso de ~130ms y después silencio sobre un
contenido escrito para narrarse. No da error de consola, no se ve nada
roto, y pasó por tres cursos sin que nadie lo reportara.

El arreglo va en dos mitades y hacen falta las dos: el motor agrega
`introPopup` al detalle de `slidechange` (el dato que hace falta no es
"¿ya se mostró?" sino "¿va a abrirse ahora?"), y el player usa ese dato
para no narrar la diapositiva si viene un pop-up, y narrarla al
cerrarlo.

**La mitad del motor el relay no la pudo probar** —toca el kit, y desde
una sesión de curso no se toca el kit (§0.1)—. Se verificó acá, en las
dos direcciones, sobre un curso generado con un `data-intro-popup`
puesto a mano:

```
CON el arreglo:   al entrar → other | "Texto del pop-up…"
                  al cerrar → slide | "Introducción"      ✅
SIN el arreglo:   al entrar → slide | "Introducción"   (la corta el pop-up)
                            → other | "Texto del pop-up…"
                  al cerrar → (nada)                       ❌ silencio
```

### K3 · Dos tests afirmaban una consecuencia que no midieron

`contrato-cableado` decía **"NO HAY PUNTOS NI LOGROS"** y `gamificacion`
**"el curso no puntúa nada"** cuando no encontraban la huella de
`initLogros()`. Corridos contra un curso real, los dos fallaron — y ese
curso **sí puntúa**: tiene su gamificación escrita a mano en `curso.js`,
anterior a que el kit publicara `initLogros()`. Medido: 0 → 30 puntos al
abrir tres fichas.

Lo detectado era correcto ("no encuentro la huella"); lo inferido era
falso. Y un test que dice de más gasta el tiempo que venía a ahorrar
y —peor— entrena a leer la suite con desconfianza, que es como se
empiezan a ignorar los hallazgos verdaderos.

Los dos mensajes ahora separan lo medido de lo inferido. Y en
`gamificacion` se partió en dos lo que era un solo fallo, porque son
cosas distintas: **el chip que falta sí es un hallazgo cerrado** (sin él
no hay dónde mostrar los puntos); **la huella ausente de `initLogros()`
no lo es**.

---

### La revisión general, en la misma pasada

### El hallazgo más grande: el índice y el glosario venían muertos en todo curso nuevo

El generador emite en TODO curso el índice lateral con sus
`.d-sidenav-item`, el `<p id="d-sidenav-progress">` y el pop-up de
glosario con su buscador. Y la plantilla `curso.js` dejaba
`initIndexJumps()`, `initGlossarySearch()` y `initGlossaryUnlock()`
**comentadas**.

O sea que un curso recién generado se entregaba con la línea de
progreso vacía para siempre, los tildes de "ya visto" que no aparecían
nunca y un buscador de glosario que no filtraba — sin un solo error en
consola, y sin que nada se lo dijera a quien armaba el curso.

Es la misma forma de §7.17 y §7.18 K4 **un nivel más arriba**: no
faltaba el cable adentro de la pieza, faltaba que alguien llamara a la
pieza. Las tres pasan a ir sin comentar en la plantilla, y degradan
solas si el curso no tiene esa parte.

Al hacerlo apareció el detalle que lo hacía inútil igual: el listener
de `slidechange` que marca las visitas se registra DESPUÉS de
`new Motor(document)`, y el primer `slidechange` lo emite el
constructor — así que la portada nunca se marcaba y el índice arrancaba
diciendo "0 de 7" con el alumno parado en la 1. Medido y corregido
sembrando la diapositiva actual a mano. Ahora dice "1 de 7".

### Dos filas nuevas en `contrato-cableado`

Para que eso no pueda volver a romperse en silencio:

- **`initIndexJumps`** ↔ `#d-sidenav-progress` con texto.
- **`initRepasoRapido`** ↔ a lo sumo un `[data-repaso-item]` sin
  `hidden`. Sin el init quedan todas visibles, y como `textOf()` filtra
  por el atributo `hidden`, la locución lee las preguntas seguidas y le
  revela al alumno las que todavía no contestó.

Las dos verificadas en rojo sacando el `init` del curso.

### Lo que quedó anotado y NO se hizo

**45 de las 246 clases `.d-*` del kit no tienen ejemplo de marcado en
ningún lado** — ni en el JS, ni en los boilerplates, ni en el comentario
de su propio CSS. La mayoría son del minijuego (`.d-mj-*`, 24 clases) y
de los pop-ups de estadística (`.d-stat-pop-*`). Es la misma forma del
hallazgo del simulador en §7.28 punto 5, pero de alcance kit.

No se arregló en esta vuelta a propósito: son 45 bloques de marcado de
ejemplo y conviene hacerlo con un curso real al lado para no inventar
un marcado que nadie usa. **El próximo curso que toque el minijuego es
la oportunidad**: documentar `.d-mj-*` contra su marcado real y de ahí
salen 24 de las 45.

## 7.32 El chrome no salía igual en todos los cursos: tres bugs, y los tres eran del kit (kit-base v1.9.85)

Pedido del cliente, textual: *"yo necesito que todo el menú, el
funcionamiento del menú contenedor del curso, sea el mismo para todos
los cursos cada vez que empiezo uno nuevo... se ve que el kit base no
los está creando a todos por igual"*, con dos cursos terminados como
evidencia.

Los tres hallazgos se reprodujeron **en un curso recién generado por el
kit**, no solo en los cursos entregados. O sea que no era deriva de un
curso: era el kit.

### 1 · El ☰ salía pelado

El rótulo "Índice" y la cápsula `.d-top-group` del ☰ salieron de dos
pedidos del cliente sobre "Seguridad de la información" —primero el
rótulo, después *"me gustaría que el botón índice de arriba se parezca a
los otros botones que tenemos creados como el de glosario, sonido,
etc."*— y vivieron meses **solo en el `index.html` de ese curso**.

Es el caso más simple de por qué dos cursos no salen iguales: el arreglo
se hizo donde se vio el problema, y ahí se quedó. Ahora está en
`header-boilerplate.html`, que es lo que el generador inyecta en todo
curso.

Con su nota al pie, que también venía del curso: en pantallas angostas
la cápsula suma 7px a una barra que ya está al límite, y con el rótulo
escondido no aporta nada — se apaga por debajo de 860px. Medido: la
barra queda en 44px y el lienzo en 296px, igual que antes.

### 2 · El botón de Configuración era INALCANZABLE con Ayuda abierta

Reporte: *"¿si yo quiero pasar del botón de ayuda al de config cómo
hago?"*.

Medido sobre un curso recién generado, 1600×1000:

| elemento | caja |
|---|---|
| panel de Ayuda abierto | x=1258, y=504, 320×350 |
| botón de Configuración | x=1526, y=805, 52×52 |

`elementFromPoint` sobre el centro del botón devolvía
`d-fab-acc-q` — un pedazo del panel de Ayuda. El botón no estaba
"tapado un poco": **no se podía clickear**.

La causa: `.d-fab-pop{ bottom: calc(100% + 14px) }` hacía crecer el
panel hacia ARRIBA desde su propio botón, y los FAB están apilados en
columna con Configuración arriba de Ayuda. Cualquier panel alto se come
al hermano de arriba.

El arreglo es de anclaje, no de z-index: el panel pasa a
`right: calc(100% + 14px); bottom: 0`, o sea **al costado** de la
columna. La columna entera queda clickeable con cualquier panel
abierto. La flechita del panel se movió al borde derecho, y el
`max-width` ahora descuenta el ancho de la columna para que en una
pantalla angosta no se vuelva a montar sobre sus propios botones.

### 3 · Sonido y Locución se abrían los DOS a la vez

Reporte: *"lo mismo pasa con sonido y locución, se pisan"*.

La secuencia, medida:

```
clic en Locución      → [locucion]            foco: #d-narrate
mouse sobre Sonido    → [sonido, locucion]    foco: #d-narrate   ❌
```

El mecanismo de exclusión mutua (`cerrarOtrosPinned`) existía y
funcionaba… para lo que podía tocar. El CSS abre el panel con **tres
condiciones en OR** — `:focus-within ∨ .is-hover ∨ .is-open` — y el
cierre del hermano solo sacaba las clases. `:focus-within` no se saca
con `classList`: hay que mover el foco. Clic en un control = lo fija Y
le deja el foco al botón, así que el hermano quedaba abierto por foco
para siempre.

El kit ya había aprendido esto una vez: el `btn.blur()` del segundo clic
(§7.19 A5). Se había visto para el propio control y no para el hermano.
Ahora `cerrarOtrosPinned` también hace `blur()` si el foco vive adentro
del que está cerrando.

```
clic en Locución      → [locucion]            foco: #d-narrate
mouse sobre Sonido    → [sonido]              foco: (ninguno)     ✅
```

### La lección, que es la de siempre y sigue costando

Los tres se veían a simple vista en un curso abierto, y ninguno lo
reportó un test. El kit tiene 23 tests y ninguno mira **si un control
del chrome tapa a otro**. "Seguridad alimentaria" sí tiene uno
(`check-popover-hover-gracia`, que recorre los cuatro controles), escrito
como test de curso y nunca relayado — el archivo mismo aclara que el
mecanismo que prueba es *"100% de kit"*.

Está en el inventario que se le pasó al cliente como el primero de la
lista de lo que conviene subir.

## 7.1 Método de arranque con zip de referencia (kit-base + PDF + curso completo)

> **Qué cambió en v1.9.60 (§7.08):** el ESQUELETO ya no se saca de
> acá. `new-course.mjs` genera el `index.html` completo —chrome,
> barra inferior, índice lateral, modales, orden de scripts— y da 7/7
> en la suite recién generado. Este método sigue vigente para lo OTRO,
> que es lo que un generador no puede dar: el estándar de PULIDO. El
> zip de referencia se mira para responder "¿esto se siente tan
> terminado como un curso aprobado?", no para copiarle el marcado.

Desde "Uso de Sucursales 3 - NOA" (§6.17.2), el arranque de un curso
nuevo suma un tercer insumo, además del PDF y `kit-base/`: **el zip
de un curso ya cerrado y aprobado por el cliente** (hoy, "Prevención
cardiovascular") como referencia de "qué se ve un curso completo".
Motivo: la auditoría de §6.17/§6.17.2 mostró que un curso armado SOLO
con `kit-base/` + PDF puede salir técnicamente correcto (0 fallos de
test) pero sentirse pobre frente a un curso maduro, porque el kit
todavía no absorbió el 100% del pulido — y la única forma real de
encontrar esas diferencias es comparar contra un curso terminado.

**Regla central: el zip de referencia se AUDITA, no se copia.**
Ninguna diapositiva, imagen ni ID de "Prevención cardiovascular" pasa
al curso nuevo — es contenido de otro cliente/tema. Lo que sí se trae
es cualquier PATRÓN genérico que el zip de referencia tenga y
`kit-base/` no (o tenga desactualizado) — y ese patrón se lleva a
`kit-base/` primero, nunca directo al curso nuevo, siguiendo el mismo
método que ya encontró y corrigió el bug de fuentes, el bug de
Locución/Ampliar y la medalla desactualizada (§6.17, §6.17.2):

1. **Leer `kit-base/CLAUDE.md` completo primero** (trae toda la guía
   de proceso/diseño/contenido — es autocontenida, no depende de tener
   este repo).
2. **Extraer el zip de referencia aparte** (no mezclar sus archivos
   con los del curso nuevo) y auditar, módulo por módulo del kit
   (`coto-player`, `coto-media`, `coto-ui`, `coto-hotspots`,
   `coto-quiz`, `coto-cierre`, sus CSS pareja, y
   `header-boilerplate.html`), si el curso de referencia tiene alguna
   versión MÁS completa o distinta de ese mismo componente genérico.
   Mismo criterio que §6.17.2: comparar función por función / clase
   por clase, no "a ojo".
3. **Cualquier diferencia real encontrada se anota** (qué componente,
   qué le falta, la implementación de referencia si hace falta
   copiarla) **y se lleva al chat dedicado a `kit-base/` (§0.1) —
   nunca se corrige acá, en esta sesión de curso.** Si la diferencia
   bloquea seguir con el curso nuevo, parchear la copia LOCAL lo
   mínimo necesario para no frenarse (nunca parcheando solo el curso
   por fuera de su copia de `kit-base/`, que sigue siendo la regla de
   §1), pero ese parche es un puente, no el fix real — el fix real se
   aplica, prueba y documenta en el chat dedicado, con su propia
   versión de `kit-base.zip` que hereda el PRÓXIMO curso.
4. **Recién ahí**, arrancar el curso nuevo desde `kit-base/` (ya
   corregido) + el PDF, siguiendo el checklist normal de §7.
4.1. **Además de auditar los módulos genéricos (paso 2-3), revisar el
   zip de referencia como catálogo de INTERACCIÓN/EFECTOS/UX** — no
   solo bugs de código. "Prevención cardiovascular" tiene piezas de
   interacción concretas que el brief de un curso nuevo puede no pedir
   explícitamente pero que valen la pena ofrecer si el contenido se
   presta: torta/gráfico interactivo con tarjeta que sigue al sector
   activo (§6.12 punto 3, §6.13 punto 2), zonas que revelan info al
   pasar/tocar (`initHotspots`, §6.10.7), stagger de entrada en
   pop-ups (§6.11), video circular/en pop-up con controles propios
   (§6.12), pop-up de predicción antes de un video como excepción de
   diseño (§6.10.2.2), animación cinemática de premio (§6.13 punto 4,
   §6.17.2). Al leer el guion del PDF nuevo, para cada diapositiva
   preguntarse "¿hay un patrón de interacción ya resuelto en la
   referencia que le quede mejor a este contenido que una captura
   estática?" — un gráfico, un proceso de pasos, una comparación, una
   lista de factores/causas son candidatos típicos. **Esto es una
   sugerencia de diseño para USAR en el curso nuevo con su propio
   contenido, no texto/arte para copiar** — y si el patrón que se
   necesita ya es genérico (`initHotspots`, stagger, medalla), se usa
   directo del kit; si es una variación puntual (como la torta), se
   escribe de nuevo para el gráfico/dato de ESTE curso, tomando la
   implementación de referencia como plantilla de cómo resolverla bien
   (mismos cuidados: hover+focus+táctil, medir en píxeles antes de
   posicionar, respetar `prefers-reduced-motion`).
5. **Gamificación completa es obligatoria** (§6.17.1) — el zip de
   referencia es, además, el ejemplo vivo de cómo se ve un header con
   las 4 piezas (logros/puntos, glosario, mini-práctica, interacciones
   que premian) — compararlo visualmente contra el curso nuevo es una
   buena forma rápida de auditar que no falte ninguna.
6. Al cerrar el curso, confirmar que todo lo anotado en el paso 3
   efectivamente se relayó al chat dedicado (§0.1) — un hallazgo que
   se queda solo en el parche local de esta sesión es exactamente el
   patrón que §6.17/§6.17.2 documentaron como costoso: se resuelve una
   vez, se pierde, y el próximo curso lo vuelve a encontrar.
7. **Modo revisión** (`?review=1`, kit-base v1.9.48,
   `motor-slides.js`): para validar un cambio puntual sin recorrer
   todo el curso desde el índice, abrir
   `index.html?review=1#slide=<id-de-la-diapositiva>` — aterriza
   directo ahí, y mientras `?review=1` sigue en la URL, cada
   navegación actualiza el hash solo (para copiar/compartir el link
   exacto de lo que se está mirando). Además pinta con contorno
   punteado cada `[data-hit]` de la diapositiva y muestra un chip fijo
   abajo a la izquierda con lo que esa diapositiva declara — `🔒 gate`
   si tiene `data-gate-popup`/`data-require-seen`/`data-require-popups`,
   cuántos hitboxes y cuántos pop-ups — sin tener que inspeccionar el
   HTML. **Clickear el chip abre un panel** con lo que SCORM/xAPI ya
   están registrando en esa sesión — `lesson_location`, tamaño del
   `suspend_data`, y los últimos 5 statements de `XAPI.getLog()` (se
   actualiza solo cada 2s) — sin tener que leer `localStorage`/consola
   a mano. Sin `?review=1` nada de esto existe — ni el hash hace algo,
   ni aparece contorno, chip ni panel — es a propósito, para que la
   URL real que entrega el LMS no le dé a un alumno una forma de
   saltarse los
   gates de contenido escribiendo el id de una diapositiva más
   adelante.

---

## 7.2 Generar la evaluación para Moodle

Desde "Uso de Sucursales 3 - NOA" (§6.44/§6.45), armar la evaluación
final del curso (típicamente 20 preguntas — 10 opción múltiple de 3
alternativas + 10 Verdadero/Falso, dificultad media, SIEMPRE con una
explicación por pregunta que diga POR QUÉ, no solo "correcto") es un
paso más del checklist, no un pedido aparte.

⚠️ **Cambió respecto de v1.9.55**: la regla vieja pedía
retroalimentación propia en cada distractor. El formato XML que el
cliente aprobó NO la usa — verificado sobre la evaluación entregada de
"Seguridad alimentaria": 0 de sus 20 distractores llevan feedback
propio; Moodle muestra UNA explicación por pregunta al cerrar el
intento. Escribir feedback por distractor hoy es trabajo que el
entregable descarta.

**Herramienta**: `tools/build-evaluacion-xml.mjs` — 100% genérica (no
sabe nada del contenido de ningún curso), toma el JSON de datos y
escribe el Moodle XML:

```bash
node tools/build-evaluacion-xml.mjs <curso>/evaluacion.json [salida.xml]
```

**Siempre XML, no hay otra opción** (kit-base v1.9.56). Es el formato
que se le entrega a COTO — Moodle lo importa desde Banco de preguntas >
Importar > formato "Moodle XML". Hasta v1.9.55 el kit traía también una
herramienta de formato GIFT; se sacó porque obligaba a elegir en cada
curso y el entregable siempre terminaba siendo el XML, que es el único
que expresa dos cosas que el cliente sí pidió:
- **retroalimentación a nivel de PREGUNTA**
  (`correctfeedback`/`incorrectfeedback`) — lo que Moodle muestra al
  cerrar el intento;
- `shuffleanswers`/`answernumbering`/`defaultgrade` declarados
  explícitamente por pregunta, en vez de heredar los valores por
  defecto de la instalación de Moodle que la importe.

⚠️ **El prefijo del feedback lo pone el script, no el JSON.** En el XML
la misma explicación va dos veces por pregunta, cambiando solo el
prefijo (`¡Correcto! <expl>` / `Incorrecto. <expl>`). Los JSON del formato
viejo traen el prefijo YA adentro del texto ("¡Correcto! El 191
compara…"), así que `build-evaluacion-xml.mjs` se lo saca antes de
volver a prefijar — si no, saldría "Incorrecto. ¡Correcto! El 191
compara…". Consecuencia práctica para quien escriba un JSON nuevo: da
igual escribir la explicación pelada o con prefijo, el XML sale bien de
las dos formas. `explicacion` es el campo canónico del esquema: UNA por
pregunta, escrita sin prefijo.

`tools/evaluacion.ejemplo.json` es el caso real de **"Seguridad
alimentaria"** (las 20 preguntas que se entregaron y el cliente aprobó)
— usarlo como plantilla del formato: copiarlo a
`<curso>/evaluacion.json`, reemplazar el contenido pregunta por
pregunta con el material real del curso nuevo, correr el script. Es
además el caso de prueba de la herramienta: regenerarlo tiene que dar
el XML entregado, **idéntico byte a byte** — si algún día deja de dar
idéntico, algo cambió en el generador sin querer. El script se encarga
de:
- Numerar las preguntas (`MC01…`, `VF01…`) y anteponerlo al `id` de
  cada una, para que el nombre en el banco de Moodle quede ordenado.
- Poner el prefijo del feedback (`¡Correcto! …` / `Incorrecto. …`)
  sobre la MISMA explicación, y sacar el que el texto ya traiga
  escrito — ver el aviso de más arriba.
- Escapar XML donde va texto plano (`<name>`, `<category>`) y envolver
  en CDATA el resto, así el contenido puede traer HTML (`<strong>`,
  `<br>`) sin romper el import.

**Criterio de contenido** (para quien escriba el JSON): cubrir los
puntos de control/reportes reales del curso, una pregunta por concepto
clave — no repetir el mismo dato en 2 preguntas distintas (ej. no
preguntar "¿cuántos días es el límite de X?" en opción múltiple Y en
V/F). Los distractores de opción múltiple funcionan mejor cuando son
OTRO dato real del curso que alguien podría confundir (ej. "30 días"
como distractor de una pregunta cuya respuesta real es "120 días",
porque 30 es el número real de OTRO reporte) — un distractor
inventado/absurdo no mide nada.

---

## 7.3 Checklist de consistencia de diseño — no reintroducir estos bugs

Reglas aprendidas en rondas de revisión reales (mayormente "Uso de
Sucursales 3 - NOA", §6.41-§6.44) que valen para CUALQUIER curso, no
solo para el que las encontró. Revisar esta lista al auditar un curso
nuevo, no solo cuando el cliente se queja.

1. **Todo popup que cuelga del menú superior usa el MISMO estilo de
   header.** Índice, Glosario, Ayuda, Mis logros (y cualquier otro que
   se agregue) — mismo degradado (`--brand-deep→--brand`), mismo
   padding, misma tipografía. Mecanismo ya en el kit
   (`coto-base-addendum-v1.8.css`): `.modal-card.d-drawer-r > .modal-hd`
   y `.modal-card.d-wide > .modal-hd` fuerzan el degradado unificado —
   si un curso nuevo agrega un popup con OTRO tipo de contenedor
   (ni cajón ni `.d-wide`), sumar ese selector a la misma regla, no
   crear un 3er estilo de header. `.modal-hd--dark` (navy sólido) sigue
   existiendo para el caso genuino de querer un header distinto — pero
   si se usa, aplicarlo a TODOS los popups del curso, nunca a uno solo
   (la nota original de `.modal-hd--dark` en `coto-base.css` ya lo
   advertía; §6.41/§6.44 son la prueba de que igual se puede reintroducir
   sin querer).
2. **"Sonido" mutea TODO — video incluido, sin excepción.** Ya
   corregido a nivel kit (`coto-media.js`/`coto-player.js`, §6.44 punto
   9): los 3 patrones de video (fondo, pop-up, círculo inline) leen el
   mismo `localStorage['coto-diapos-mute']` que ya leían fx.js/
   coto-ui.js, y el toggle sincroniza `.muted` en vivo sobre cualquier
   `<video>` presente al togglear. Si un curso nuevo agrega OTRO
   patrón de audio/video (ej. un audio de fondo separado), hacerlo leer
   la misma marca desde el arranque — no esperar a que el cliente lo
   note.
3. **El menú lateral (índice ☰) nunca deja saltar a una diapositiva no
   vista.** `marcarVistas()` en `curso.js` tiene que poner
   `a.disabled = !visto` en cada `.d-sidenav-item[data-goto]`, no solo
   el tilde visual `.is-done` (§6.44 punto 2 — el bug real: el tilde
   estaba bien, pero el link seguía siempre clickeable, dejando saltar
   directo al cierre sin cumplir ningún gate de obligatoriedad). CSS
   del estado ya en el kit (`.d-sidenav-item:disabled`).
4. **Nunca dejar un hitbox permanentemente `disabled` en el HTML sin
   una función real que lo habilite.** Si el plan es "esto se habilita
   cuando se cumpla X" pero esa función nunca se escribe, el resultado
   es un elemento que parece interactivo (foco/hover residual) pero
   nunca funciona — más confuso que no tener nada ahí (§6.44 punto 1).
   Si un patrón queda sin la lógica que lo activa, sacarlo del HTML en
   vez de dejarlo "por si después se termina".
5. **Método para posicionar cualquier overlay sobre un `.d-shot`
   (video, hitbox, texto dinámico) que no calce a la primera:** medir
   sobre el POP-UP YA RENDERIZADO en el tamaño real de pantalla
   (ocultar el overlay por JS, screenshotear, medir sobre ESE
   screenshot), no sobre el archivo de imagen suelto ni sobre la
   página del PDF. Los 3 espacios de coordenadas (archivo crudo, PDF
   completo, contenedor ya renderizado) NO son intercambiables — un
   valor que se ve perfecto medido en uno puede fallar en los otros
   dos (§6.44 punto 4, 3 vueltas en falso documentadas ahí mismo).
6. **Cualquier elemento tipo "toda la superficie es un botón" (el
   patrón `initPopupVideos`/`initInlineCircleVideos` de
   `coto-media.js`, o similar) necesita feedback de hover propio** —
   `cursor:pointer` solo no alcanza como affordance. Ya resuelto para
   los 3 patrones de video del kit (`coto-media.css`,
   `[data-popup] video:not([controls]):hover`); aplicar el mismo
   criterio a cualquier patrón nuevo de este tipo.
7. **`curso.js`, `diapositivas.css` e `index.html` NUNCA se copian a
   `kit-base/`** — son 100% específicos de cada curso. Sale obvio
   dicho así, pero ya pasó por accidente (§6.44 punto 7, un `cp` sin
   filtrar al sincronizar otros archivos de kit sí tocados esa vuelta).
   Al sincronizar kit tras una vuelta de cambios, copiar archivo por
   archivo explícito — nunca un `cp -r`/glob amplio entre la carpeta
   del curso y `kit-base/`.
8. **Antes de reusar un atributo del chrome (`data-nav`, `data-goto`,
   `data-popup-trigger`) sobre un elemento que NO es del chrome,
   revisar qué le hace `_syncNav`.** El motor no distingue una hitbox
   invisible sobre una captura de un botón de la barra inferior:
   `data-nav="next"` en un `[data-hit]` recibe `.d-nav-btn--cta`, que
   pinta `background:var(--cat-strong)` — un bloque de color sólido
   tapando el botón que el arte ya dibuja (§6.45). Para "este botón
   dibujado lleva a la diapositiva siguiente", `data-goto` hace lo
   mismo sin efectos colaterales.
9. **El overlay de hitboxes también dibuja los `[data-place]`, y hay
   que mirarlos.** Los `[data-hit]` se revisan porque "si no se puede
   clickear se nota"; un `[data-place]` mal ubicado (una fila de
   tildes, un cartel de progreso) no rompe nada, simplemente se
   superpone al arte — y eso no se ve leyendo el HTML ni corriendo los
   7 tests. Se ve corriendo `tools/verify-hitboxes.mjs` y mirando las
   capturas (§6.45).
10. **El curso nunca lleva 2 archivos `README.md`/`README-CURSO.md`
   con nombres casi iguales.** Si se scaffoldea copiando `kit-base/` de
   punta a punta (§7), borrar o renombrar el `README.md` heredado del
   kit ANTES de escribir la bitácora propia del curso — si coexisten,
   tarde o temprano se empaqueta el equivocado en el zip de entrega
   (pasó una vez, §6.43).
11. **Cualquier breakpoint ≤600px se prueba con Playwright en viewport
   MOBILE REAL (`isMobile:true`, `hasTouch:true`), nunca solo
   redimensionando la ventana de escritorio.** "Probé el responsive" sin
   especificar cómo no alcanza como verificación — un grid con columnas
   `fr` puede parecer que se angosta bien en una ventana angosta de
   escritorio y romperse en un teléfono real (§6.48, el mismo bug
   pasó sin detectarse en 2 cursos por esto exacto).
12. **Un popover/tooltip que cuelga de un botón del chrome nunca se
   ancla por breakpoint fijo — se posiciona midiendo el botón real en
   cada apertura.** Si el botón del que cuelga puede cambiar de lado de
   la pantalla entre anchos (típico: el layout de 2 filas de §6.6 mueve
   grupos de botones de la derecha a la izquierda por debajo de
   799px), un CSS que asume "en mobile este botón está pegado al borde
   derecho" se rompe apenas ese supuesto deja de ser cierto — el
   popover se sale del viewport por el lado contrario (§6.55, medido
   con Playwright en viewport táctil real: `left:-150px`). El fix
   correcto es JS que mide `getBoundingClientRect()` del botón en cada
   apertura y clampea la posición del popover al viewport real, con el
   CSS centrado de siempre como fallback sin JS — nunca un anclaje fijo
   "para mobile" que vuelve a asumir en qué lado va a estar el botón.
13. **Antes de entregar, correr `node tools/check-css-duplicates.mjs`
   sobre los `.css` propios del curso** (kit-base v1.9.39, §6.59 punto
   6) — detecta selectores repetidos con propiedades en conflicto, la
   familia de bug de §6.28/§6.33 que ya costó 2 vueltas de "se ve mal
   y no sé por qué". Encontró 2 bugs reales en el kit mismo apenas se
   construyó — correrlo también contra el propio `kit-base/css/*` de
   vez en cuando, no solo contra CSS de curso.
14. **Nueva interacción/gesto/layout: probar en viewport táctil REAL
   antes de darlo por terminado, en la MISMA vuelta en que se
   construye** (§6.10.1 punto 4, regla fija desde la ronda de "10
   mejoras al kit", kit-base v1.9.39) — usar `openCourseMobile()`
   (`tools/tests/_shared.mjs`) para que no sea fricción extra. No es
   una auditoría aparte para "cuando el cliente pregunte cómo anda en
   mobile": es parte de construir la pieza.


15. **Antes de entregar, correr `node tools/check-contraste.mjs`**
   (kit-base v1.9.40, §6.60) — valida las 23 categorías contra los
   pares de uso reales del CSS. Si el curso agrega un par nuevo
   (un color de texto sobre un fondo que el kit no combinaba antes),
   sumarlo a la tabla `PARES` del script en la misma vuelta: un par
   que no está en la tabla es un par que nadie está mirando.
   **Y la regla que dio origen a todo esto**: nunca escribir en un
   comentario que algo pasa "en TODAS las categorías" con UN ejemplo
   al lado como prueba. Si vale la pena afirmarlo, lo verifica un
   script — el comentario viejo de `--cat-strong` decía exactamente
   eso y era falso en 5 de 23.

16. **Para texto usar `--cat-ink`, nunca `--cat-strong`; para fondo de
   texto usar `--cat-wash`, nunca `--cat-soft`** (kit-base v1.9.40,
   §6.60). `--cat-strong` es el Valor 1 del manual y quedó reservado a
   bordes/outlines/sombras/degradados, que no tienen requisito de
   contraste. `--cat-soft` es el Valor 5: sirve de tinte decorativo,
   pero a 4 pasos del Valor 1 en una rampa de 6 NUNCA llega a 4.5:1
   contra la tinta — cualquier bloque que ponga texto encima necesita
   `--cat-wash`. Los dos errores estaban en el kit y los dos afectaban
   cursos ya entregados.

17. **La suite sale de un glob, no de una lista** (`tools/run-tests.mjs`,
   kit-base v1.9.40, §6.60). Si un curso agrega tests propios en
   `tools/tests/`, entran solos — no hay lista que actualizar. Los
   archivos que empiezan con `_` son librerías compartidas, no tests,
   y quedan afuera por convención. Antes de confiar en un "0 fallos",
   mirar cuántos tests dice haber corrido: `scorm-tracking.mjs` estuvo
   30 versiones sin correr porque la lista era manual.

18. **Un fondo decorativo con `z-index:-1` necesita que su contenedor
   arme contexto de apilamiento propio** (relay de "Surtido sin
   ventas", kit-base v1.9.61). Al ponerle a una pantalla una mancha o
   textura de fondo con `::before`/`::after` en `position:absolute;
   z-index:-1`, un contenedor con SOLO `position:relative` **no** crea
   contexto de apilamiento: ese `-1` se resuelve contra un ancestro más
   arriba del árbol, y el fondo puede terminar detrás de otro fondo
   opaco de más arriba — invisible por completo, sin ningún error, con
   el marcado y el `src` perfectos. Cuesta horas justamente porque no
   hay nada roto que mirar. El contenedor necesita `position:relative`
   **y** `z-index:0` (o cualquier valor) juntos.

19. **Los 3 umbrales de medalla no se escriben a mano** (§7.14). Se
   derivan del máximo REALMENTE alcanzable en esa corrida (bronce =
   piso garantizado del gate, para que nadie que termine se quede sin
   medalla; oro = un % alto del máximo), descontando lo que todavía no
   exista — un `.mp4` en placeholder (§3.9) son puntos que HOY no se
   pueden conseguir, y contarlos deja el piso real por debajo del
   bronce. Y ese máximo se verifica con un recorrido instrumentado, no
   con la suma de la tabla: **la tabla es una intención, el contador es
   el hecho.** En el caso que originó la regla diferían en 25 puntos
   desde el origen del curso. Ojo puntual: un grupo de N variantes de
   `initShotSwap` paga N−1 (la variante 0 se ve al entrar y no premia).

20. **Si un asset se corrige dos veces sobre el MISMO nombre de
   archivo, versionar el nombre** (misma fuente). Un cliente que
   prueba builds sucesivos sobre la misma carpeta o pestaña puede
   seguir viendo la versión cacheada y reportar "sigue igual" sobre
   algo ya corregido — pasó con 5 imágenes que el cliente no vio
   durante dos rondas enteras. Renombrar con sufijo de versión y
   actualizar las referencias resuelve el problema sin depender de que
   el cliente confirme el diagnóstico ni de que haga un refresco
   forzado. Regla práctica: a la SEGUNDA corrección del mismo archivo,
   versionarlo.
---

## 8. Kit master — estado actual

**v1.9.81 — el molde de los simuladores (§7.27).** El kit pasa a
soportar un TIPO de curso nuevo: el simulador, donde el alumno recorre
las pantallas reales del sistema en vez de leer sobre ellas. Tres
piezas (`coto-simulador.js` + `coto-simulador.css` +
`simulador-boilerplate.html`), el contenido separado en un archivo de
datos que edita un diseñador instruccional, `coto-gescom.css` con la
pantalla del sistema del salón recreada, el 18º test
(`simulador.mjs`) y `--tipo simulador` en el generador. Más 6 relays
del curso que lo originó, tres de ellos de piezas que TODO curso usa:
la primera diapositiva quedaba muda en cualquier curso, el repaso no
señalaba la respuesta correcta, y `hitbox-click-check` daba un falso
positivo con hitboxes dentro de contenedores apagados por CSS.

El kit dejó de ser "copiar del curso anterior" y pasó a ser una carpeta
real y versionada: **`kit-base/`**, al mismo nivel que este
`CLAUDE.md`. Ver `kit-base/README.md` para el detalle completo (qué
contiene, cómo arrancar un curso con esto, los 12 bugs reales ya
resueltos que no hay que volver a introducir, y las 5 falsas alarmas
que enseñaron a medir antes de "arreglar").

**v1.8 es la segunda vuelta de "Prevención cardiovascular"**, con el
curso ya entregado y revisado por el cliente — todo salió de uso real.
Suma al kit: el reloj de tiempo activo que descuenta los videos (§6.10.4),
la salida real del curso con `SCORM.exitCourse()` (§6.10.5), la medalla
final por puntaje (§6.10.6), `[data-place]` para overlays no
interactivos, los pop-ups automáticos y "gate" que se re-arman al entrar
(§6.10.2), y 7 componentes nuevos del addendum: cajón derecho, aro de
resaltado sobre ícono (§6.10.3), tildes de avance, barra de pasos
navegable, medalla, pantalla de salida y bloque de aviso. Más los 2
tests reforzados (contención del DOM en `markup-sanity`, recorte de
contenido en `scroll-audit`) — los dos nacidos de bugs que ninguno de
los 6 detectaba.

**v1.7 terminó de vaciar `curso.js`.** Hasta v1.6, un curso nuevo
copiaba el kit y **igual reescribía a mano ~600 líneas de
infraestructura** — barra superior, videos, pop-ups, precarga,
sonidos — cada vez, y cada vez volviendo a tropezar con los mismos
bugs. Se sumaron 3 archivos (`js/coto-player.js`, `js/coto-media.js`,
`js/coto-ui.js`), `Narrador.textOf()` con sus 4 bugs de extracción de
texto ya resueltos adentro, el atributo `[data-narrate-only]` (§6.5) y
el bloque CSS del gate de avance (§6.10). Los 3 módulos se validaron
en aislamiento antes de subirlos. **Objetivo declarado de v1.7**: que
lo único que quede en `curso.js` sea contenido — textos, banco de
preguntas, puntaje, IDs y el cableado entre módulos.

**v1.6 agregó** `coto-quiz.js`/`coto-cierre.js` (mini-práctica y
cierre extraídos y parametrizados por callbacks), `coto-fx.css`, las
3 secciones nuevas del addendum (índice con ícono+check, pop-up de
instrucciones, pop-up de logros), la entrada escalonada, `fonts/` con
las familias reales y el 6º test (`markup-sanity.mjs`).

**v1.3 agregó** `css/coto-shot-stage.css` — el lienzo de diapositivas-
captura con margen ampliado para tablets (ver §6.9). **Aplica desde
"Prevención cardiovascular" en adelante, NO retroactivo** a cursos
diseñados con el margen viejo (8% parejo) como "Surtido sin venta" —
requiere que el PDF venga diseñado con el margen nuevo (8%
arriba/abajo + 13% a los costados).

**v1.2 corrigió** `js/narrador.js`: la velocidad de narración (1.15x)
ya no es una constante fija — depende de si la voz elegida es de
calidad conocida (`isHighQualityVoice`), ver §6.7. Bug real reportado
probando "Surtido sin venta" en tablet (voz de respaldo sonando
atropellada a 1.15x).

**v1.1 agregó** `css/coto-player-chrome.css` + `header-boilerplate.html`
— el rediseño completo de la barra superior (ver §6.6 para las
lecciones/bugs reales encontrados), extraído y validado de forma
aislada (screenshot idéntico al curso real cargando SOLO el archivo
nuevo + `coto-base.css`/addendum/`assets.css`, sin `diapositivas.css`
ni `pulido.css` del curso). Resumen de lo resuelto en v1.0:

- ~~Migrar `initShots()` de `curso.js` a `motor-slides.js`~~ — hecho
  (sesión anterior). `initConceptShots()` queda en `curso.js` a
  propósito (ver §1, tiene los 7 conceptos hardcodeados).
- ~~"Surtido sin venta" reexportó a 2:1~~ — hecho (sesión anterior).
  2:1 fue suficiente, recorte = 0 (ver §2.7).
- ~~`spec-motor-slides.md` recuperado/reconstruido~~ — hecho, vive en
  `kit-base/spec-motor-slides.md`, reconstruido línea por línea a
  partir del código real de `motor-slides.js` (contrato de
  diapositivas/capas/pop-ups/hitboxes, puntos de extensión, checklist
  de verificación).
- ~~`tools/tests/*.mjs` genéricos como carpeta base del kit~~ — hecho,
  5 tests (`deep-audit`, `full-regress`, `hitbox-click-check`,
  `scroll-audit`, `keyboard-a11y`) en `kit-base/tools/tests/`,
  corridos y en verde contra "Surtido sin venta" real. Detectan y
  distinguen gates de contenido (`motor.canAdvance`) de fallos reales
  — no confundir un curso con gate legítimo con un curso roto.
- ~~Migrar `speak()`/`speechify()` a un archivo genérico~~ — hecho:
  nuevo `kit-base/js/narrador.js` (no se sumó a `motor-slides.js` ni
  `fx.js` a propósito — el motor declara explícitamente que "no habla
  con narración", y fx.js es solo decorativo; un archivo dedicado
  mantiene esa separación). Diccionario fonético base = tabla oficial
  del Manual de Contenido (§6.5), extensible por curso con
  `Narrador.addFixes([...])`.
- **Nueva herramienta**: `kit-base/tools/verify-hitboxes.mjs` —
  generaliza el script ad-hoc que encontró el bug de "conceptos"
  (coordenadas viejas no remedidas tras reexportar el PDF, ver §3
  punto 4). Recorre TODAS las diapositivas con hitboxes de una corrida,
  sin escribir un script nuevo cada vez.
- **Auditoría real al armar el kit**: 3 casos de contenido de curso
  colado en archivos "genéricos" que en realidad no lo eran del todo
  (IDs de diapositiva hardcodeados en `fx.js`, nombre de curso en la
  clave de `localStorage` de `scorm-api.js`, slug de curso en el
  activity ID de `xapi.js` — los tres corregidos, detalle en
  `kit-base/README.md`). **Lección: no asumir que un archivo es
  genérico por estar en la carpeta correcta — auditar antes de
  promoverlo al kit** (grep por nombres de curso/diapositiva/claves de
  storage).

### Resuelto en "Prevención cardiovascular" (kit v1.6-v1.7)

- ~~**Decidir la distinción narración obligatoria/opcional**~~ — hecho:
  `[data-narrate-only]` en `coto-ui.js`, resuelto en el marcado, ver
  §6.5. Criterio de uso: contenido de CONSULTA → narrar solo la
  entrada; contenido para leer de principio a fin → narrar todo.
- ~~**Separación intro-una-vez / paso-a-paso** en actividades
  multi-paso~~ — hecho: `coto-quiz.js` narra SOLO el cuerpo del paso
  actual (`narrate(body)`), nunca la consigna fija de la diapositiva.
  El curso la narra una vez al entrar y no vuelve a incluirla.

### Pendiente real (no resuelto todavía)

- **CONFIRMADO por auditoría (no solo "probable"): "Prevención
  cardiovascular" no carga NINGUNO de los 6 módulos nuevos del kit** —
  ni `coto-player.js`, `coto-media.js`, `coto-ui.js`, `coto-hotspots.js`,
  `coto-quiz.js` ni `coto-cierre.js` están en su `<script src>`, y sigue
  usando `coto-base-addendum-v1.2.css` en vez de la v1.8. Todo lo que
  este curso hace (barra superior, videos, pop-ups, quiz, cierre,
  medallas) corre con las copias inline de `curso.js`/`diapositivas.css`
  — el kit es una segunda implementación PARALELA, nunca invocada por el
  curso del que se extrajo.
  Consecuencia real ya encontrada: la copia inline de
  `pintarMedalla()`/`medallaDe()` había quedado duplicando exactamente
  la función que subió al kit el mismo día, sin que nadie lo notara
  (curso.js corre en su propio IIFE, así que la copia local TAPA a la
  global sin pisarla — no hay error, simplemente nunca se llama a la del
  kit). Es la prueba concreta de que "extraído y validado en
  aislamiento" no es lo mismo que "probado end-to-end": las dos
  implementaciones pueden divergir con el tiempo sin que ningún test lo
  detecte, porque ningún test corre contra la versión del kit dentro de
  un curso real.
  **El primer curso que arranque copiando `kit-base/` de punta a punta
  (siguiendo el checklist de §7, sin reescribir nada a mano) va a ser la
  primera prueba real end-to-end.** Si aparece un ajuste al usarlos,
  corregirlo **en `kit-base/`**, no en el curso nuevo. Hasta que eso
  pase, tratar "está en el kit" como "el mecanismo es sano y se probó
  aislado", no como "ya funciona en un curso real".
- ~~**`initConceptShots()`**~~ — **RESUELTO en kit v1.9.21** (§6.45):
  `initShotSwap()` (`coto-media.js`) es esa generalización, ya probada
  en producción en 4 variantes distintas del mismo patrón dentro de
  "Seguridad alimentaria" (2 carruseles, 1 juego de pestañas, 1 barra
  de pasos arrastrable). Esta nota quedó vieja acá abajo por pura
  omisión — el trabajo ya estaba hecho, solo faltaba tacharla
  (auditado de nuevo en la ronda de "10 mejoras al kit", kit-base
  v1.9.39). La única pieza que sigue sin tocar es el propio `curso.js`
  de "Surtido sin venta" (curso cerrado y entregado, fuera de este
  repo) — sigue con su copia hardcodeada de los 7 conceptos, y no hace
  falta migrarlo: un curso cerrado no se retoca salvo que tenga un bug
  real que reportar (regla general de este documento, no algo nuevo).
- **Sugerirle al cliente agregar a su Manual de Contenido** una regla
  explícita sobre framing de prácticas/evaluaciones (el caso real
  "no cuenta para la nota") — sigue sin estar escrito en ningún manual
  oficial, ver §6.5.
- Limpieza de assets huérfanos en el zip de "Surtido sin venta"
  (`img/introduccion/*`, `img/indice/*`, `img/que-es/*`, etc., de
  cuando esas diapos usaban piezas separadas) — prioridad baja, no
  afecta el kit ni cursos futuros.
- `kit-base/js/motor-slides.js`/`scorm-api.js`/`xapi.js`/`fx.js` no se
  volvieron a auditar línea por línea más allá de lo encontrado esta
  vuelta — si en el próximo curso aparece algo más específico de
  "Surtido sin venta" escondido ahí, corregirlo ahí mismo (en
  `kit-base/`, no en el curso nuevo) y anotarlo acá.

## 7.33 iPad, el aviso de girar, y lo que faltaba promover de los dos cursos (kit-base v1.9.86)

Tres relays desde cursos (§0.1) y la segunda mitad del inventario de dos
cursos terminados, en una sola versión. El hilo común: **cosas que
fallaban en tablets reales y que ningún test headless podía ver**, más
código que dos cursos habían escrito por separado y que la regla §4
mandaba subir.

### 1 · El cartel "Girá tu dispositivo" dejaba el curso inusable (K8)

Reporte del cliente, en tablet: *"cuando giras el dispositivo para verlo
horizontal queda la misma pantalla, siempre la de Girá tu dispositivo"*.
El curso quedaba muerto: Siguiente respondía, pero el cartel tapaba todo.

**Causa: Safari no vuelve a evaluar `@container (max-aspect-ratio: 1)`
cuando cambia la orientación.** La condición queda congelada en el valor
que tenía al cargar, así que un dispositivo que arrancó vertical sigue
"siendo" vertical acostado, para siempre.

⚠️ **Por qué no lo agarró ningún test, y por qué no lo va a agarrar
nunca**: en Chromium rotar funciona perfecto — medido. O sea que *el
mecanismo que falla es el mismo con el que se mide*. Vale como regla
general: cuando el bug está en cómo un motor evalúa una condición, un
test que corre en OTRO motor no puede verlo. Ahí la defensa no es un
test, es no depender del mecanismo sospechoso.

Fix: la decisión pasa a JS. `initAvisoGirar()` (coto-player.js) mide el
`.d-stage` con `getBoundingClientRect()` en `resize`/`orientationchange`
y pone la clase `.is-vertical`; el CSS pregunta por la clase, no por la
proporción. El criterio sigue siendo el mismo — cambió QUIÉN lo evalúa.

⚠️ Los dos `setTimeout` (250 ms y 600 ms) no son paranoia: **iOS informa
dimensiones VIEJAS unos cientos de milisegundos después de rotar**. Una
sola medición inmediata devuelve el tamaño anterior y deja la clase igual
de congelada que la container query.

⚠️ **No dejar además una regla de proporción en el CSS "por las dudas".**
Si el CSS también puede mostrar el cartel, vuelve el bug: alcanza con que
UNA de las dos condiciones quede congelada. La clase tiene que ser la
única fuente. Está anotado en el propio CSS.

**El cartel no tenía salida.** Con el bloqueo de rotación activado
—habitual en tablets— girar el aparato no hace nada y el alumno queda
encerrado. Se agregó "Ver igual, en vertical", que dura la sesión. No
reemplaza al cartel: sigue pidiendo girar, que es lo mejor; es la puerta
para quien no puede cumplirlo.

**Y el video corría DETRÁS del cartel** — encontrado verificando, no
reportado. Como la portada suele ser `[data-autoadvance]`, al terminar el
video el curso avanzaba solo: el alumno giraba y aparecía en la
diapositiva 2, habiéndose perdido la portada entera, sin ningún error.
Ahora `initBgVideos` no arranca con el curso tapado y al destaparse
llama a `sync()`, que reinicia en `currentTime = 0`.

⚠️ **Bug de orden, y vale para cualquier aviso de este tipo**: la primera
versión avisaba solo por evento (`cursotapado`), pero `initBgVideos` hace
su `sync()` inicial al arrancar — si eso pasa antes de que se registre el
listener, el aviso se pierde. Por eso `attempt()` **LEE la clase** de
`.d-stage`, que está puesta desde el primer `medir()`. El evento queda
solo para la transición (destapar → arrancar), que es lo que una clase no
puede avisar.

⚠️ **Un fixture con media de 0 bytes hace que cualquier medición de video
dé un falso negativo.** Verificando esto, el video quedaba "quieto"
después de destapar y parecía un hueco del fix. No lo era: los `.mp4` del
curso de prueba eran archivos vacíos, `videoUsable()` los descartaba con
razón y `attempt()` cortaba antes de `play()`. Se confirmó instrumentando
`play()` (cero llamadas, no un rechazo) y con `networkState = 3`. Con un
video real la tabla del relay se reproduce exacta. **Antes de dar por
malo un fix de video, verificar que el fixture tenga bytes.**

### 2 · Pantalla completa en iOS: dos reportes, una sola causa (K5)

*"me aparece todo el tiempo el cartel 'parece que estás escribiendo
mientras estás en modo de pantalla completa'"* y *"en pantalla completa
aparece una cruz que tapa un botón"*. **Los dos los produce la pantalla
completa REAL, no el curso**: la ✕ es el botón de salir que dibuja
Safari, y el cartel lo tira iOS cuando un control de formulario recibe el
foco en fullscreen — y el curso tiene sliders de volumen y velocidad que
el alumno toca a propósito.

No hay pseudo-fullscreen de reemplazo: la app ya es `position:fixed;
inset:0`, así que una versión por CSS no ganaría nada; lo único que suma
el fullscreen real en Safari es esconder SU barra, y eso no se imita.

Fix: `initFullscreen()` esconde el botón en iOS/iPadOS. Se pierde una
función que ahí rendía poco y molestaba seguido. La detección contempla
iPadOS, que desde iOS 13 se presenta como `MacIntel` (un Mac no tiene
puntos táctiles; un iPad sí).

### 3 · Los rótulos de la barra de progreso, apilados en táctil (K4)

Reporte con foto: en iPad, los cuatro rótulos de sección superpuestos e
ilegibles. `.d-progress:hover .d-progress-mark::after` insinúa TODOS los
rótulos y `.d-progress-mark:hover::after` resalta el de abajo del cursor.
El efecto da por sentado **un cursor que se posa sobre UNA marca a la
vez**, y en táctil no existe tal cosa: el toque dispara `:hover` sobre la
barra entera y se abren los cuatro juntos.

Fix: las dos reglas van dentro de `@media (hover:hover) and
(pointer:fine)`. En táctil los rótulos no se muestran — son decorativos,
`aria-hidden`, y el nombre de cada sección está en el índice lateral.

### 4 · El letterbox de `--bg-video` pasa a opt-out (K6)

La regla que devuelve toda slide `--bg-video` al lienzo 2:1 nació porque
los videos no respetaban el margen lateral del 13%. Con el arte
re-exportado respetando el margen, la banda ya no protege nada: solo
achica el video. Ahora la banda se aplica salvo `[data-arte-con-margen]`.
**El arreglo es por ARCHIVO, no por curso**, así que la granularidad
correcta es la diapositiva.

⚠️ El test `video-lienzo-tablet` encodaba el WORKAROUND, no el
requisito. El requisito es "no se recorta nada importante"; la banda era
un medio. No se escribió un test de reemplazo a propósito: el único
chequeo posible sería medir el margen del arte, y ese método ya dio
falsos positivos (un detector de bordes por gradiente marcaba texturas de
fondo como contenido). **Mejor un rojo explicado que un verde que
miente.**

### 5 · Un test que daba confianza falsa (K7)

El inventario de dos cursos afirmaba que `check-popover-hover-gracia`
*"es el test que habría atajado los bugs 2 y 3"*. **No los ataja**: mide
la gracia de cada popover DE A UNO y nunca abre dos para comprobar que se
excluyan. Verificado — "Seguridad alimentaria" tiene ese test en verde y
el bug presente. Se le agregó la aserción que faltaba (nunca dos paneles
abiertos a la vez) y se verificó que ve el bug real: 4 fallos sin el
`blur()`, 0 con él.

⚠️ Y cuidado con cómo se escribe esa aserción: la primera medición dio
FALSO NEGATIVO por usar `dispatchEvent('mouseenter')` — **los eventos
sintéticos no disparan `:hover` de CSS**. Hace falta `page.hover()` o
`page.mouse.move()`, con movimiento real.

### 6 · Progreso por objetivo de aprendizaje

Los dos cursos terminados escribieron, cada uno por su lado, el mismo
`marcarObjetivos()`: pips A/B/C en el cajón del índice que se encienden
cuando el alumno llega al resumen de cada unidad. Dos cursos con el mismo
código es el disparador exacto de §4.

Subió **dentro del `refresh()` de `initIndexJumps`**, y no como un
`initObjetivos()` aparte, por una razón concreta: en los dos cursos había
que acordarse de llamar a `marcarObjetivos()` DESPUÉS de cada
`marcarVistas()`. Colgado del `refresh()` que el curso ya llama, no se
puede desincronizar.

El mapeo objetivo → diapositiva viaja en el marcado
(`data-obj-check="resumen1"`), no en una opción: es dato de CONTENIDO,
igual que el `data-goto` de cada ítem del índice, que ya se lee del DOM.

⚠️ **El total se CUENTA, no se escribe.** Los dos cursos tenían "de 3
objetivos cubiertos" a mano: un cuarto objetivo habría mentido en
silencio.

⚠️ Y una lección sobre el test: la primera versión usaba TRES pips, que
es justo el número que **no puede distinguir** contar de tener "de 3"
escrito. La aserción no medía nada — verificado: con el total hardcodeado
el test pasaba igual. Va con CUATRO. Mismo defecto que se le había
corregido a K3 y a K7; **cuando un test verifica "esto se calcula", el
caso de prueba no puede usar el número que estaba hardcodeado.**

### 7 · Panel de Recursos

El cajón de documentos oficiales de "Seguridad de la información" sube
completo: botón en el header (junto al Glosario, misma familia), panel
que reusa el chasis `.modal--drawer-right` + `.d-drawer-r`, y la ficha
`.d-recurso`.

**El botón se muestra o se esconde solo**, leyendo si el panel tiene
fichas (`initRecursos()`). No hay opción que pasar ni bloque que
descomentar: un curso sin documentos no muestra nada y uno con
documentos solo agrega los `<li>`. Así no existe el estado incoherente de
"puse las fichas pero me olvidé de habilitar el botón", que es el cable
suelto de §7.17.

⚠️ **"Ver en el curso" pasa por el MISMO gate que el índice lateral**
(`initIndexJumps` con `selector: '.d-recurso-ir'`, ya cableado en la
plantilla de `curso.js`). Sin eso, Recursos sería el atajo que saltea las
diapositivas —y los gates— del medio, y el curso seguiría "funcionando".

### 8 · Lo que NO subió, y por qué

- **El exportador GIFT de evaluación**: excluido por pedido explícito del
  cliente (*"todos menos lo de exportar en evaluación gift"*).
- **`puntaje-rebalance`**: hardcodea los ids de respuesta y la tabla
  `PUNTOS` de un curso. La regla que protege es **diseño de contenido, no
  un mecanismo del kit**: que ninguna opción del minijuego valga más que
  la suma de las correctas. Queda anotada acá como criterio de diseño
  —revisarla al armar un minijuego nuevo— y no como test.

## 7.34 Minijuego y repaso al kit, y el glosario que venía sin candados (kit-base v1.9.87, parte 1)

Segunda mitad del inventario de dos cursos (§7.33 punto 8). El hilo:
**piezas medio promovidas** — CSS en el kit, máquina en un curso.

### 1 · El minijuego estaba promovido a medias

`coto-minijuego.css` (~120 reglas, 37 clases) vivía en el kit desde
hacía varias versiones. `initMinijuego`, las ~370 líneas que las hacen
funcionar, vivían en el `curso.js` de un curso. Un curso nuevo que
quisiera un minijuego tenía el CSS servido y la máquina para reescribir.

⚠️ **La regla §4 pide DOS cursos antes de generalizar, y minijuego hay
uno solo.** Sube igual, y la salvedad importa: esto no es generalizar
de un caso, es **terminar una promoción a medio hacer**. Medio promovido
es el peor estado posible — paga el costo de mantener el CSS genérico
sin ninguno de los beneficios. Con un solo caso de referencia la API va
a estar sesgada: cuando aparezca el segundo minijuego, esperar tener que
mover cosas. Eso no es deuda, es el segundo caso haciendo su trabajo.

Sube `js/coto-minijuego.js` con la MECÁNICA (mapa de opciones, vidas,
marcador, pista por inactividad, remediación al reintentar, hotspots,
repaso, las tres capas) y `minijuego-boilerplate.html` con el marcado.
El curso pone los DATOS (`opciones`, `fb`) y la ECONOMÍA (`onAcierto`,
`onFin`): el kit no sabe de `PUNTOS`, `award()`, logros ni SCORM, que es
justo el código que cambia de un curso a otro.

⚠️ **`check-globals` agarró un bug al escribirlo**, y es el bug que
este kit persigue: el módulo llamaba a `global.confetti()` —así se
llamaba en el curso de origen— y **el kit no publica ningún
`confetti`**. Su confeti es `celebrate()`, privado de
`initCierreCelebration`. El festejo del minijuego no habría salido
nunca, sin un solo error en consola. Pasó a ser `opts.celebrar`.

Se borró CSS muerto del molde viejo: `.d-mj-line`/`--h`/`--v` (las
líneas de organigrama que el cliente pidió sacar) y `.d-mj-next` (esta
mecánica no avanza de a una pregunta). Tres reglas que ningún curso
podía usar y que igual había que entender cada vez.

### 2 · El repaso rápido tampoco tenía marcado

Mismo caso, más chico: `coto-repaso.css` (~20 clases) y
`initRepasoRapido` estaban desde v1.9.64, y `index-boilerplate.html` no
traía **ningún** `data-repaso`. Ahora sí, documentado.

### 3 · El glosario del boilerplate deshabilitaba su propio módulo

⚠️ **Hallazgo propio, y del peor tipo.** El ejemplo del kit decía:

    <dt>Término</dt><dd>Definición.</dd>

y eso no alcanza. `initGlossaryUnlock()` busca un `[data-goto]` DENTRO
del `<dt>`; sin él sale por la puerta de atrás (`if (!link) return
null`) y el término queda **desbloqueado para siempre**. Un curso que
copiara el ejemplo del kit tenía el módulo de candados enganchado y sin
nada que hacer, sin ningún error.

Los dos cursos terminados escribieron la versión completa por su cuenta,
26 y 27 veces cada uno — la convergencia espontánea es la señal de que
el ejemplo estaba mal, no ellos. Ahora el boilerplate trae las cuatro
piezas (botón con `data-goto`, candado, definición, pista) y
`contrato-cableado` tiene una fila que lo vigila.

### 4 · Panel de Recursos y progreso de objetivos

Ver §7.33 puntos 6 y 7 — subieron en v1.9.86. Acá se sumó el pop-up del
**reproductor de video** (`data-popup="video-player"`), que estaba en la
misma situación: `initVideoPlayer()` en el kit desde siempre, cero
marcado de ejemplo, y `if (!player) return` yéndose en silencio.

### 5 · Cuántas quedan

Las clases con CSS en el kit y ningún ejemplo de marcado pasaron de
**84 a 32**. Las que quedan están en un curso solo o en ninguno; el
corte está medido curso por curso y anotado en el inventario.


## 7.35 "¿Esto tiene una lógica coherente?" — el sistema de íconos del índice (kit-base v1.9.87, parte 2)

Pedido del cliente, textual: *"¿te llegó alguna vez mi pedido de que
esto tenga una lógica coherente? para que en todos los cursos se use el
mismo sistema de íconos para el índice"*.

**Había media respuesta.** Desde v1.9.76 existían la regla §7.21 E (una
diapositiva de CONTENIDO lleva el ícono de su tema; dos temas distintos
nunca comparten ícono) y el test `iconos-indice.mjs` que la hace
cumplir. Pero esa regla mira **un curso por vez**: evita choques
adentro, y no dice nada sobre qué ícono le toca a "Portada".

Medido sobre los dos cursos terminados, el resultado fue el previsible:

| rol | Seg. alimentaria | Seg. de la información |
|---|---|---|
| Portada | `i-flag` | `i-home` |
| Índice de contenidos | `i-grid` | `i-list` |
| Presentación de unidad | `i-layers` | **`i-flag`** ← Portada en el otro |
| Resumen / Repaso | **`i-book`** ← = Introducción | `i-list-check` |

No es solo que el mismo rol se vea distinto: **el mismo dibujo significa
cosas distintas según el curso**, que es peor. El alumno que hace los dos
aprende una convención en el primero y se le rompe en el segundo.

⚠️ Y los dos cursos SÍ habían convergido solos en varios (Introducción =
`i-book`, Últimos consejos = `i-bulb`, Cierre = `i-medal`). Esa
convergencia espontánea es la prueba de que la convención quería existir:
lo único que faltaba era escribirla.

**El catálogo**, en `tools/iconos-tipo.mjs`, única fuente compartida por
el generador y el test:

| `data-icono-tipo` | ícono | por qué |
|---|---|---|
| `portada` | `i-flag` | |
| `introduccion` | `i-book` | los dos cursos ya coincidían |
| `objetivos` | `i-target` | |
| `indice` | `i-grid` | no `i-list`: se confunde con `i-list-check` a tamaño chico |
| `unidad` | `i-layers` | no `i-flag`: ya es la portada, y un curso lo usaba para las dos cosas |
| `resumen` | `i-list-check` | no `i-book`: un curso lo usaba para esto Y para Introducción |
| `minijuego` | `i-game` | |
| `evaluacion` | `i-examen` | |
| `consejos` | `i-bulb` | los dos cursos ya coincidían |
| `cierre` | `i-medal` | los dos cursos ya coincidían |

**TIPO vs TEMA.** El tipo es el rol estructural, igual en todos los
cursos: la portada es la portada acá y en cualquier otro. Son fijos y se
repiten a propósito. El tema es de qué habla la diapositiva, cambia por
curso y **no se canoniza** — ahí sigue valiendo la regla de un ícono
propio por tema, nunca repetido adentro del curso.

`iconos-indice.mjs` gana dos aserciones: el valor de `data-icono-tipo`
tiene que estar en el catálogo y traer SU ícono, y una diapositiva de
contenido no puede quedarse con uno reservado (si un tema lleva
`i-medal`, el alumno lee "cierre" donde no lo hay). Verificado contra
los tres errores reales de los cursos.


## 7.36 Los dos parches de pulido: el fundido que empeoró al arreglarlo (kit-base v1.9.87, parte 3)

Dos relays juntos. Siete cambios aplicados, uno descartado por estar ya
resuelto, y una decisión del cliente que revierte algo mío.

### 1 · El corte directo, y por qué el primer intento lo empeoró

Regla del cliente: *"cada vez que hago clic en una solapa se hace un
fundido, y el cambio debería ser corte directo. Esto pasa en los
carruseles también: siempre corte directo, no fundidos."*

El primer intento sacó la `transition` de `.d-shot-img` (CSS) y dejó el
JS puesto. **El fundido no desapareció: empeoró.** La mecánica era
`.d-shot-img--fade{opacity:0}` más dos timers de 110 ms alrededor del
cambio de `src`; sin la transición que la suavizaba, la opacidad cae a 0
**de golpe** y se queda 220 ms — y como `.d-shot-img` tiene
`background:#fff`, lo que se ve es un **flash blanco duro**. El cliente
lo volvió a reportar, con captura.

⚠️ **REGLA: un efecto vive en DOS archivos** — el CSS que lo dibuja y el
JS que lo dispara. Sacar una sola mitad no lo apaga: lo deja a medias, y
a medias suele ser peor que entero. Antes de dar por muerto un efecto,
`grep` de la clase en los dos lados.

Se fueron `swapSrc()`, `FADE_MS` y `.d-shot-img--fade`.
`data-shot-swap-nofade` y el parámetro `sinFade` quedan aceptados pero
inertes, para no romper cursos que los declaren. El test
`corte-directo.mjs` **no busca la clase ni la regla CSS** —eso es mirar
una mitad— sino el resultado: que el `src` cambie dentro del propio clic
y que la opacidad nunca baje de 1. Verificado que agarra las dos formas
de romperlo.

⚠️ Y una pisada al medirlo: los `srcs` de `initShotSwap` viajan en el
ATRIBUTO `data-shot-swap-srcs`, no en las opciones del init. Pasarlos por
opciones da un falso "el src no cambió".

### 2 · Ningún medio corre con la página oculta

Reporte con foto de la pantalla de bloqueo de un iPad: aparecía el
widget de reproducción del sistema. Eso lo muestra iOS **porque hay un
video reproduciéndose**: al apagar la pantalla el curso seguía corriendo,
y con las diapositivas `[data-autoadvance]` avanzaba solo — el alumno
desbloqueaba tres diapositivas más adelante sin haber visto nada.

`visibilitychange` cubre pantalla bloqueada y app en segundo plano.
Al volver no se reanuda: `sync()` reinicia en `currentTime = 0`, mismo
criterio que al destaparse el cartel de girar. Medido:
reproduciendo → oculto: quieto en 1,7 s → sigue quieto → vuelve: desde 0.

### 3 · Dos modificadores de hitbox

- **`.d-shot-hit--sin-aro`**: si la respuesta de la zona **ya es visible
  en el arte** (cambia la imagen, aparece un cartel), el hitbox no lleva
  además el aro genérico. Reporte: *"este círculo azul no tiene que
  estar"* — una elipse azul perfecta sobre una ilustración orgánica.
- **`.d-shot-hit--tab`**: el aro se dibuja sobre el RECTÁNGULO del
  hitbox, que es fijo, pero **una solapa dibujada cambia de forma según
  su estado** (medido: la activa arranca en 33,6% del alto, las
  inactivas en 35,8%). Los hitboxes se miden contra la activa, así que
  el aro asomaba por arriba de las otras. **No existe un rectángulo que
  sirva para los dos estados.** El realce pasa a ser un lavado blanco al
  25%, que se recorta solo contra el arte.

  ⚠️ REGLA: el aro genérico sirve sobre arte de forma FIJA. Si el arte
  cambia de forma entre estados, el realce se recorta contra el ARTE.

### 4 · El rincón de los FAB es de los FAB

Reporte: *"en el minijuego se superponen las cosas con el curso
reducido"*. No era "el curso reducido": medido con la partida ya
empezada, choca **desde 1366x768 para abajo** —la resolución más común
de una PC de sucursal, a pantalla completa— y a 1024x600 tapa dos
píldoras. Con la pantalla de inicio no pasa, que es por qué la primera
medición dio cero.

`--d-fab-safe: 86px` y la columna que llega al borde lo reserva.
⚠️ Se RESTA el padding que el panel ya tiene: con 86 px planos, a
900x560 la columna se pasaba 23 px. Y va siempre, no bajo una media
query de alto: el choque depende del alto DEL LIENZO, que cambia al
entrar y salir de pantalla completa, con la barra de Safari y dentro del
iframe del LMS.

Verificado en 6 resoluciones: 0 choques con el parche, 1 a 2 sin él.

⚠️ **Tres mediciones falsas antes de esa**, y las tres valen como
advertencia: (a) inyectar el tablero en una `<section data-slide>` que
no es la activa lo deja en `display:none`, así que todo mide 0 y da
"cero choques" con y sin parche; (b) inyectarlo en la diapositiva activa
lo aplasta en la franja que esa diapositiva le deja; (c) `motor.goTo` no
existe —es `gotoId`— así que un `motor.goTo && ...` navega a ningún lado
**en silencio**. Solo la cuarta, sobre la diapositiva real con la
partida empezada, midió algo.

### 5 · El video chico se mira en el pop-up

Reporte con el curso embebido sin pantalla completa: *"mirá qué grande
se ve el botón de play"*. No era el botón del kit sino la **barra de
controles NATIVA**: tiene un tamaño mínimo fijo que el navegador no
achica, y en un recuadro de ~30% del lienzo se come medio recuadro.

⚠️ **No hay CSS que lo arregle**: el shadow DOM de los controles nativos
es cerrado y `zoom`/`scale` achican también la imagen. **Cuando un
control nativo no entra, la respuesta no es CSS — es moverlo a un
contenedor donde entre.**

`data-video-popup` en el wrapper deriva el clip al reproductor en pop-up.
Es opt-in puro: verificado que sin el atributo un curso existente se
comporta exactamente igual que antes.

⚠️ Los dos init van con **el mismo objeto de opciones**: cada
`vistoAPI()` sin `seen`/`markSeen` propios se arma su memoria aparte, así
que con objetos distintos `onFirstPlay` paga los puntos dos veces.

### 6 · La banda del letterbox: vuelta atrás sobre una decisión mía

En v1.9.86 implementé la polaridad **al revés de como llegó**, a
propósito y documentado: banda por default, `data-arte-con-margen` para
sacarla, con el argumento de que el default tiene que ser el lado seguro
porque olvidarse cuesta CONTENIDO recortado y la banda solo cuesta
tamaño.

El argumento sigue siendo cierto y **no manda**, porque el cliente
decidió lo contrario con todas las letras: *"los otros no me importa que
por ahora hagan zoom, así que sacale las franjas"*. Quien conoce el arte
y banca el recorte es él, y la seguridad que ofrecía mi default no era
gratis: cobraba una banda en todas las diapositivas cuyo video ya estaba
bien. Ahora la banda es opt-in con `data-arte-sin-margen`, y
`video-lienzo-tablet.mjs` revisa las dos mitades del contrato.

### 7 · Lo que NO se aplicó

- **La locución que arranca y se corta sola** (la diapositiva que abre un
  pop-up al entrar narraba 130 ms y se cortaba): **ya estaba resuelto en
  el kit desde v1.9.84**, y mejor — el motor publica `introPopup` en el
  detalle de `slidechange`, en vez de una propiedad aparte. Tercera vez
  que un relay llega escrito contra un kit más viejo; la lección de §0.1
  (verificar SIEMPRE contra el código real antes de aplicar) se paga
  sola.
- **El iframe de Moodle que no rota con el iPad**: no es el SCO. Es el
  `<iframe>` donde Moodle lo mete, con alto fijo. Se configura en la
  actividad SCORM — "Mostrar paquete" en ventana nueva, o alto al 100%.
  Queda anotado como **requisito de publicación**, porque le va a pasar
  a todos los cursos por igual.


## 7.37 Medir contra la lámina, no contra la ventana (kit-base v1.9.88, y el punto 4 corregido en v1.9.89)

Tanda de 14 correcciones desde "Seguridad alimentaria". **Tres de los
bugs de iPad son el mismo error**, y conviene enunciarlo antes que los
parches:

> El lienzo es 2:1. En **vertical**, eso significa que la lámina es una
> FRANJA de `ancho/2`, mientras el viewport sigue siendo altísimo.
> Cualquier regla que pregunte por el alto del viewport —`vh`, `@media
> (max-height:…)`— **nunca se entera** de que la lámina quedó baja.

Medido: en un iPad 768×1024 la lámina mide **768×384**. Más baja que un
viewport apaisado de 480 px, que es justo el caso que esas media queries
existen para cubrir. Pero el viewport mide 1024, así que ninguna se
activaba y todo salía con medidas de escritorio sobre un arte de la
mitad de alto.

⚠️ **REGLA: `vh` y `@media (max-height)` responden por la VENTANA. Si lo
que importa es cómo se ve algo AL LADO DEL ARTE, la pregunta va en
`--d-arte-h`, en `cqh`, o en un `@container` sobre `.d-stage`.**

Las dos herramientas, las dos nuevas en esta versión:

- **`--d-arte-h`** — el alto de la lámina, `min(alto-del-lienzo,
  ancho/2)`. Sale de `--d-chrome-top`/`--d-chrome-bot`, que reemplazan
  las cuatro alturas del chrome que vivían hardcodeadas en cuatro
  `grid-template-rows` distintos.
- **`@container (max-aspect-ratio: 1/1)`** sobre `.d-stage`, que ya era
  `container-type:size`. Para preguntar "¿la lámina quedó baja?", que es
  algo que una media query no puede saber.

### 1 · Los pop-ups se veían enormes

Reporte en iPad: *"el pop-up que se abre se ve demasiado grande en
comparación con el tamaño de la diapositiva"*. La medida estaba tomada
contra el viewport (`76vh`). Medido en vertical: lámina 834×417, pop-up
384×366 — el **88% del alto del arte**, apoyado sobre una franja que
ocupa menos de la mitad de la pantalla. Se ve enorme porque lo es, en
relación con lo único con lo que el alumno lo puede comparar.

Ahora se mide contra `--d-arte-h`. Medido después: vertical 266×254,
apaisado 361×345, PC 1440×900 468×446 — o sea **62% del alto del arte en
las tres**, y en PC casi no cambia (venía de 480), que es donde el tamaño
ya estaba bien.

**Bonus del mismo parche**: `showPopup()` enfoca la
`.modal-card[tabindex="-1"]` al abrir, y Chrome trata ese foco
programático como `:focus-visible` — así que el aro genérico dibujaba un
rectángulo azul de 3 px alrededor de una tarjeta de arte que ya trae su
marco y su sombra. Sacarlo no cuesta accesibilidad: el patrón estándar
de diálogo es enfocar el contenedor para que el lector lo anuncie, y el
"dónde estoy" visual lo da el pop-up mismo. Los controles de adentro
conservan su aro.

### 2 · El minijuego en vertical

Reporte: *"los contenedores de las opciones y la consigna se ven
desordenados, y los recuadros de vidas y puntos se ven recortados"*.

El apilado en una columna se activaba por `max-width:600px` y un iPad
vertical mide 768-834 px de ancho: **no entraba por nada**, y se quedaba
con las dos columnas de escritorio metidas en la mitad del ancho.
Ahora lo decide `@container (max-aspect-ratio: 1/1)`. Medido: `column`
en vertical, `row` en apaisado, cero desborde y cero choques con los FAB
en las dos.

Dos cosas que costaron una vuelta cada una:
- **La escena necesita tope `40cqh`.** Con 60 se quedaba con medio
  lienzo y empujaba las dos últimas filas de píldoras 124 px fuera.
- **El rincón de los FAB se reserva IGUAL que en apaisado.** Sacarlo
  devolvió la tuerca tapando la última píldora; reservar por abajo
  tampoco alcanza, porque la última fila sigue entrando en la columna
  del botón.

### 3 · La locución: 1.15x, control doble y `data-narrate-skip`

**El default pasa de 1.0 a 1.15** (*"aumentar levemente la velocidad…
que el cambio sea sutil, sin que suene acelerada"*). 1.0 es la velocidad
natural de la voz, que en las voces de red en español arrastra para leer
un texto que el alumno además está VIENDO. 1.15 es el mismo valor que el
kit usaba hasta v1.9.81 para las voces de calidad, así que no es un
número inventado. Es un DEFAULT, no un piso: a quien ya movió el control
no se le pisa su preferencia. Tope del slider 1.3 → 1.4.

Nuevo `Narrador.getRateDefault()`, **para que nadie vuelva a hardcodear
el número** — que es justo lo que hizo fallar tres tests al cambiarlo.

**El control, en dos lugares**: slider fino en Config y atajo −/valor/+
en el panel de Locución. ⚠️ Dos controles sobre el mismo dato es la
receta clásica de "cambié uno y el otro sigue mostrando lo viejo". Acá no
puede pasar: **ninguno guarda estado propio**. Los dos escriben con
`Narrador.setRateFactor()` y los dos se repintan desde `getRateFactor()`
a través de `avisarRate()`. Verificado en las dos direcciones.

**`data-narrate-skip`**: un nodo marcado así no se narra, pero **sigue
entero en el DOM para un lector de pantalla**, que no pasa por
`textOf()`. Viene de un pedido concreto —que el índice narre solo los
títulos de las unidades y no los 16 puntos— y de la tentación obvia:
borrar el detalle del `.sr-only`. Eso habría "arreglado" la locución
**rompiendo la accesibilidad**, que es exactamente lo que ese bloque
existe para dar.

⚠️ REGLA: la locución y el lector de pantalla tienen públicos y tiempos
distintos. Uno ACOMPAÑA a la lámina que el alumno está mirando; el otro
la REEMPLAZA. `data-narrate-skip` es la costura entre los dos.

### 4 · El micrófono apagado va tachado, y ningún popover abre por hover

**El micrófono.** Reporte: *"al silenciar la locución el audio deja de
reproducirse, pero el ícono no cambia de estado"*. Cambiaba — pero la
diagonal iba al mismo grosor que el resto del dibujo y a tamaño real,
con la etiqueta al lado, no se leía como un cambio de estado. Ahora la
clase `.ic-tachado` la engorda y le da corte, el mismo idioma que
`#d-sound` ya usaba. Se mantiene el micrófono y no un parlante: son dos
controles distintos en la misma barra y darles el mismo ícono sería peor
que el bug original.

**NINGÚN popover abre por hover: los cuatro son solo por clic.** El
pedido vino en dos tiempos — primero los flotantes de Ayuda y
Configuración (*"se abren con solo pasar el mouse por encima; deben
abrirse únicamente al hacer clic"*) y después los de audio, por
consistencia (*"así todos tienen el mismo comportamiento"*).

⚠️ **Salió gratis, y conviene saber por qué**: el clic en
Sonido/Locución **ya abría el panel** además de mutear o narrar, porque
`initPinnedPopover` engancha ese mismo `click`. Medido antes de tocar
nada (clic → `.is-open`, panel visible, y se queda al alejar el mouse).
O sea que sacar el hover no quitó ninguna función; lo único que
desapareció es un camino de más.

Y con eso se fue también **la gracia de hover**: `attachHoverGrace()`,
`GRACIA_HOVER_MS` y la clase `.is-hover`, en JS y en CSS. Existían para
un problema que ya no existe — entre el botón y el panel hay un hueco
real que el `:hover` de CSS no perdona ni un frame, y la gracia daba
1,5 s para cruzarlo. Sin apertura por hover no hay hueco que cruzar.
Dejarlo habría sido código muerto y una clase que el CSS seguiría
prometiendo sin que nadie la ponga.

⚠️ **Dos trampas al aplicarlo**, las dos verificadas:

1. *(avisada por el relay)* Borrando el mecanismo es fácil llevarse
   puesto el `closeAll()` de `initPinnedPopover`. **El síntoma es
   engañoso**: el panel "se abre" igual, pero por `:focus-within` —el
   clic deja el foco en el botón—, no por `.is-open`. Se ve bien y está
   roto.
2. *(propia, del test)* La primera versión de la aserción preguntaba
   solo por `.is-open`, y **daba verde con el bug puesto**: devolverle
   el `:hover` al selector CSS abre el panel al pasar sin que ninguna
   clase aparezca. Ahora el test hace las DOS preguntas —`pineado()` y
   `seVe()`— porque no son intercambiables: una sola deja pasar un bug
   distinto en cada dirección.

### 5 · Vuelve el botón de pantalla completa en iOS

Vuelta atrás sobre §7.33 punto 2, hecha a conciencia. El kit lo había
escondido por dos reportes reales; el cliente pide lo contrario (*"no
aparece el ícono para ampliar la pantalla; debe estar disponible también
en iPad"*) y se hace.

⚠️ **Pero el motivo viejo no era inventado y queda anotado: el cartel de
iOS puede volver.** Lo dispara el sistema cuando un control de
formulario recibe el foco estando en fullscreen, y el curso tiene
sliders que el alumno toca a propósito. No hay forma de suprimirlo desde
la página. Si vuelve a molestar, la conversación es esa, no un bug.

Lo que SÍ se conserva es la **detección por capacidad**: sin
`requestFullscreen` (el iPhone) el botón se sigue escondiendo solo. Por
eso alcanzó con BORRAR el guard de iOS en vez de cambiarlo por otro: el
problema de fondo era "un botón muerto", no el sistema operativo.

### 6 · El chip de audio, convertido en botón de EMPEZAR

Reporte: *"en lugar de empezar con sonido aparece un botón que dice «Tocá
para escuchar»… que ese paso quede integrado a un botón de inicio del
curso para que no se vea como un error"*.

Con todas las letras, porque se va a volver a preguntar:

> **En iOS no hay forma de que el audio arranque solo.** Safari exige un
> gesto del alumno antes de reproducir cualquier cosa con sonido, y eso
> incluye la voz de la locución. No es una limitación del curso ni del
> kit, y no hay permiso, flag ni truco que lo levante.

Lo que sí se puede es que ese gesto **no parezca un error**: en la
primera diapositiva el chip deja de ser un aviso y pasa a ser el botón
de empezar. Se decide por posición en el DOM, no por un id "portada",
para que valga en cualquier curso.

⚠️ **El parche llegó con un bug, y es instructivo.** Rotulaba `inicio`
solo al inicializar — y el reintento mudo de `attempt()` vuelve a
rotular el chip como `sonido` a los milisegundos, que es justamente el
camino que corre en la portada cuando el navegador bloquea el autoplay,
o sea el caso exacto para el que la función existe. Medido: el chip
salía con `data-modo="sonido"` y el "Tocá para comenzar" no lo veía
nadie. **La decisión se movió adentro de `rotularTap()`**, así queda
cubierto todo llamador, el de hoy y el de mañana. `video-tap-chip.mjs`
gana la aserción, verificada contra ese bug exacto.

### 7 · Los tres tests que cambiaron, y la regla

Los tres fijaban **un valor que el producto acaba de decidir cambiar**:
`fab-config` y `locucion-voz-velocidad` hardcodeaban la velocidad 1.0, y
`popover-exclusivo` exigía que los FAB abrieran por hover.

⚠️ **REGLA: cuando un test falla por un cambio de producto, lo que hay
que revisar es QUÉ ESTABA GARANTIZANDO DE VERDAD.** Casi siempre la
garantía sigue siendo válida y lo que sobra es el número. En
`locucion-voz-velocidad` la garantía es que **la velocidad sea la misma
para toda voz** —el bug real era "suena distinto en cada dispositivo"—,
así que ahora lee `getRateDefault()` y además compara los casos entre
sí, que es la garantía de verdad y sobrevive al próximo cambio de
default. En `popover-exclusivo` los FAB pasaron al contrato opuesto y la
prueba de gracia de hover de los popovers de audio **queda intacta**,
porque ahí el contrato no cambió.


## 7.38 Lo que se apoya sobre la lámina escala con la lámina (kit-base v1.9.90)

Segunda revisión desde "Seguridad alimentaria". Nueve reportes, siete
resueltos, y otra vez con un hilo que vale más que los parches: es la
continuación directa de §7.37.

### 1 · La regla grande: `em` de la lámina, nunca `rem`

Tres reportes distintos —un recuadro cortado abajo, una devolución
metida en una caja con scroll, un panel montado sobre el título— y **un
solo origen**.

Un `[data-place]` se posiciona en % de la lámina, así que su **caja
escala sola**. El texto y los espacios de adentro, en `rem`, **no**.
Medido en un curso real: lámina de 810×405 contra los 1440×720 de una
PC — la caja se achica a la mitad, el texto no, y el contenido pasaba a
medir **162 px dentro de un panel de 89**.

⚠️ **REGLA: si algo vive sobre la lámina, se mide en `em` de
`--d-escala-lamina` o en `cqh` — nunca en `rem`. Un `rem` sobre la
lámina es un tamaño que ignora el dispositivo.**

El token nuevo, junto a `--d-arte-h`:

    --d-escala-lamina: min(1rem, calc(var(--d-arte-h) * 0.02222));

720 px de lámina —una PC 1440×900— da **exactamente 1rem**, así que
adoptar la regla **no cambia nada en escritorio**, que es lo que la hace
aplicable sin rehacer los cursos existentes. Verificado: 15,9984 px. El
`min()` impide que crezca en un monitor grande.

Se aplicó al componente del kit que lo necesitaba (`.d-repaso`: panel
con `font-size` de la escala y su caja en `em`), más el cinturón
`max-height:100%; overflow:auto` — si aun así no entrara, scrollea en
vez de cortar, porque cortar es contenido inalcanzable.

⚠️ **Al adoptarla hay que BORRAR las compactaciones por
`@media (max-height:…)` / `@container (max-aspect-ratio:…)` que existan
para esos paneles.** Eran parches sobre este mismo problema, siguen en
`rem`, y ahora pelean con la escala y rompen la proporción.

⚠️ **Y una precisión sobre qué se arregló acá**: el desborde de 4 px que
medí primero estaba en el repaso PROPIO de un curso, que pisa el del kit
con 16 reglas en su `assets.css` — o sea que ese fixture no sirve para
medir el componente del kit. Sobre el componente del kit esto es
corrección de consistencia, no un corte visible. El corte visible es el
que sufren los cursos que escriben sus paneles en `rem`, y para esos la
regla es la respuesta.

`escala-lamina.mjs` protege las tres patas: que el token exista, que en
PC valga 1rem clavado, que en vertical sea menor, y que `.d-repaso` lo
siga de verdad.

### 2 · Un realce que no tapa el arte

Reporte, segunda vuelta sobre lo mismo: *"el resaltado sigue tapando la
parte inferior del círculo… tiene que quedar alineado exactamente al
borde del contenedor y POR DETRÁS de la ilustración"*.

⚠️ **"Por detrás" no existe como opción**: el arte de la diapositiva es
UN bitmap y el hitbox va necesariamente encima. Pero se consigue el
mismo resultado a la vista **perforando** el realce justo donde está la
ilustración: `.d-shot-hit--hueco` con una máscara radial. Visto desde
afuera, el aro pasa por detrás.

Las cuatro variables van en % del PROPIO hitbox, así el recorte lo
acompaña cuando `_initShots` lo reposiciona, sin una línea de JS. Y
`--hueco-rx`/`--hueco-ry` son distintos aunque el círculo sea redondo:
los % de un radial-gradient van contra el ancho y el alto de la caja.

Verificado en píxeles: con las variables, el centro de arriba queda
transparente y el resto pinta; sin variables (radio 0) la máscara es
inerte, así que un curso que ponga la clase y se olvide no pierde el
realce entero.

⚠️ **El hueco es SOLO visual**: `mask` afecta lo que se pinta, no el
hit-testing — `elementFromPoint` en el centro del agujero sigue
devolviendo el hitbox. Está bien que así sea (el alumno que toca el
ícono activa la tarjeta igual), pero no sirve para quitarle área
clickeable a una zona.

⚠️ Trampa al MEDIR el radio, que le costó una vuelta a quien lo hizo: si
el título de la tarjeta comparte color con el círculo, un scan vertical
lo cuenta como parte del círculo y el radio sale ~40% grande. Hay que
buscar la FILA MÁS ANCHA del color, que es el diámetro real.

### 3 · Pantalla completa en iOS: lugar para la ✕ de Safari

Reporte: *"al ampliar la pantalla, la X para salir aparece en la esquina
superior izquierda y tapa el ícono de las 3 líneas del índice, por lo
que no se puede acceder al menú"*.

Esa ✕ la dibuja **Safari**, no el curso, y no se puede mover ni esconder
desde la página. Lo único que está de nuestro lado es **no poner nada
debajo**: `<html class="d-ios d-fullscreen">` y la barra se corre 64 px.
Medido: el ☰ pasa de x=18 a x=66, y no se mueve ni en escritorio ni en
iOS sin pantalla completa.

Nota de continuidad: esta detección de iOS **no es** la que se borró en
§7.37 punto 5. Aquella escondía el botón de pantalla completa y el
cliente pidió lo contrario; esta no esconde nada, solo corre la barra.

### 4 · La portada y el cierre del minijuego, centrados

Reporte: *"la portada del minijuego aparece pegada a la parte superior y
deja mucho espacio vacío debajo"*.

`.d-mj-shot`/`.d-mj-fin` eran `display:block` con `margin:auto` en la
lámina. ⚠️ **En un bloque, los márgenes automáticos VERTICALES se
resuelven a 0** — regla de CSS de siempre — así que centraba solo en
horizontal. Con `display:grid` + `place-content:center` el auto vale en
los dos ejes.

Medido en iPad vertical: de `top:0` con **575 px** vacíos abajo, a
288/288. En apaisado y en PC no cambia nada, porque ahí la lámina ya
llena el lienzo.

### 5 · Los dos que el relay no pudo reproducir

Los dice en vez de darlos por hechos, que es lo correcto:

- *"El botón «Tocá para escuchar» sigue apareciendo"*: en el build
  actual dice **"Tocá para comenzar"**, es color de marca y tamaño de
  CTA. El de la foto es el chip viejo — testeado contra un zip anterior.
  Y vale repetirlo: **el botón no puede desaparecer**, porque en iOS no
  hay audio sin un gesto del alumno.
- *"El repaso del resumen 3 montado sobre el título"*: medido en 8
  resoluciones, el panel queda siempre debajo del texto y dentro del
  arte. La causa más probable era el panel sobredimensionado que arregla
  el punto 1.


## 7.39 Un clic hace una cosa, y un test que venía en verde sin medir nada (kit-base v1.9.91)

Tercera revisión desde "Seguridad alimentaria". Nueve reportes, ocho
resueltos, uno mitigado sin poder garantizarlo.

### 1 · La regresión: un clic hacía DOS cosas

⚠️ **Regresión introducida en v1.9.90**, al pasar los popovers a "solo
por clic". Los botones de Sonido y Locución quedaron abriendo su panel
Y, de paso, muteando o apagando la locución con el mismo gesto. Reporte:
*"para abrirlo tengo que hacer clic pero al abrirlo también lo
desactiva; tenemos que hacerlo en 2 clics"*.

Antes no se notaba porque el panel abría al pasar el mouse: el clic era
SOLO del toggle. Sacado el hover, los dos usos se pisaron — un conflicto
que ya estaba latente y que el cambio de apertura destapó.

Medido antes de arreglar: un clic en Locución la dejaba en `false` y
guardaba `"0"` en localStorage.

Fix: el toggle actúa solo si el panel YA estaba abierto. ⚠️ El orden
importa y está garantizado: `initSoundToggle`/`initNarrateToggle`
registran su listener ANTES que `initAudioPopovers`, así que cuando
corren, `is-open` todavía refleja el estado previo al clic. Si algún día
se reordenan esos init, esto deja de funcionar en silencio.

**Y la preferencia mal guardada sigue ahí**: arreglar el clic no alcanza
si el alumno ya se quedó con la locución apagada en su dispositivo.
`LS_NARRATE` pasa a `-v2`, que la descarta una sola vez. Es la única que
se descarta: voz y velocidad conservan su clave, porque esas nadie las
guardó por accidente.

### 2 · El test que venía en verde sin medir nada

⚠️ **Hallazgo propio, y del peor tipo.** `arrastre-pasos-mobile` exige
que un toque no mueva la barra de pasos… y venía pasando **en falso
desde v1.9.86**.

El test usa un iPhone 12 VERTICAL. Ahí el lienzo queda 390×662 (ratio
0,59), o sea que el kit muestra el cartel "Girá tu dispositivo" — y ese
cartel **se come el toque**. Verificado con `elementFromPoint` sobre el
centro del paso: devuelve `.d-rotate-notice`. El toque nunca llegaba a
la barra, así que "la barra no se movió" daba verde por ausencia.

⚠️ **REGLA: todo test táctil sobre algo dibujado en la LÁMINA tiene que
asegurarse primero de que el curso no esté tapado.** Desde v1.9.86 un
viewport de teléfono vertical no muestra el curso, muestra el cartel.
El test pasó a apaisado y además falla explícitamente si encuentra el
stage en `.is-vertical`.

### 3 · El carrusel que "se tildaba"

Reporte: *"al querer tocar en esas diapos que hay que ir pasando tipo
carrusel se tildó, no pasaba"*.

La marca de "este `click` vino de un puntero" era un **booleano** que se
prendía en CUALQUIER `pointerdown` sobre la diapositiva y se apagaba
SOLO cuando el clic caía sobre un paso. Tocar una flecha, el fondo, o
empezar un gesto que el navegador después cancelaba —algo que iOS hace
seguido— dejaba la marca prendida para siempre, y el siguiente toque
real se lo comía el `return`. Ahora es un sello de tiempo que caduca a
los 700 ms.

**Y en táctil un toque SÍ salta al paso.** La regla de "hay que
arrastrar de verdad" nació para el mouse, donde arrastrar es natural.
Con el dedo no hay equivalente: si el toque no hace nada, el alumno no
tiene forma de saber que tenía que deslizar. Medido en táctil: tres
toques mueven a 3/2/4, incluso después de tocar en otra parte; con mouse
el clic sigue sin saltar y el arrastre sigue andando.

⚠️ Y una aserción que saqué: había agregado un "tras tocar en otra parte
el siguiente toque funciona", y **no puede fallar** — con la excepción
táctil, el camino que mira esa marca ya no corre para `touch`.
Verificado rompiendo el sello de tiempo a propósito: el test seguía en
verde. Una aserción que no puede ponerse roja promete una cobertura que
no existe.

### 4 · Un overlay nunca se dibuja donde sabemos que NO va

Reporte: *"el recuadro del «Repaso rápido» aparece directamente encima
del título y del inicio del texto"*.

Cuando `place()` no puede medir todavía —la diapositiva está oculta, así
que `clientWidth` es 0— el ancla de emergencia dejaba el overlay en
`left:0; top:0`: arriba a la izquierda del arte, exactamente donde lo
fotografiaron. Y un `[data-hit]` ahí además se puede tocar.

⚠️ **Parquear algo en una posición que SABEMOS falsa es el peor default
posible**: se ve como un bug de maquetado y no se corrige solo hasta que
algo dispare otra medición — de ahí el síntoma "volvés a la diapo
anterior, volvés, y se arregla". Ahora queda invisible hasta que se
pueda medir, y se re-mide en cada `slidechange`.

Verificado que aparecen bien: los overlays de la capa de resultado del
minijuego están invisibles mientras su capa está `hidden` y toman
posición real (411/596/597 px) en cuanto se muestra.

### 5 · Sobre un video, el hitbox no dibuja realce

Reporte: *"en el video de portada parece que quedó un botón ahí, se ve
al pasar el mouse"*. No había quedado nada: era el realce del hitbox. Y
sobre un video no puede haber realce estático porque ⚠️ **el arte de
abajo se mueve**: el botón que el hitbox marca aparece recién en cierto
momento de la animación, así que antes de eso el realce flota sobre un
fondo vacío.

⚠️ **Desvío deliberado del parche**: el original apagaba también
`:focus-visible`. Ahí el argumento no aplica — quien navega por teclado
NO TIENE CURSOR, y el aro es su única señal de dónde está. El problema
reportado es del hover, así que se arregla el hover. Verificado con Tab
real: el aro sigue (`solid 3px`, y `:focus-visible` coincide).
⚠️ Y una pisada al medirlo: `.focus()` programático NO dispara
`:focus-visible` en Chromium, así que la primera medición dio un falso
negativo. Hay que tabular de verdad.

### 6 · `narracionfin`, y el número puesto a ojo

`slidenarrationend` filtra por `kind === 'slide'` porque existe para
encadenar el autoplay. Un curso que quiera esperar a que termine de
hablar una devolución (`kind: 'other'`) no tenía de dónde agarrarse.
Ahora hay `narracionfin` para cualquier tipo — se emite ADEMÁS, no en
lugar del otro, para no romper a quien ya lo escucha.

El caso que lo pidió estaba en el kit: `initMinijuego` esperaba **700 ms
fijos** antes del repaso, y la devolución del último hallazgo arrancaba
y se cortaba en seco. 700 ms no alcanzan para leer dos renglones, y la
duración real depende del texto, del dispositivo y de qué voces haya —
o sea que ningún número fijo podía estar bien. Ahora espera el evento.

⚠️ Con red de seguridad: si no hay locución —apagada, sin voces, texto
vacío— ese evento no llega nunca y el repaso no abriría jamás. El timer
de respaldo garantiza que el juego siempre avanza; lo que cambió es que
ya no es LA regla sino el último recurso. Verificado en las dos ramas:
sin locución dispara a 702 ms; con locución sonando, a los 900 ms no
disparó y abrió apenas llegó `narracionfin`.

### 7 · Lo que no se puede garantizar

El cartel *"parece que estás escribiendo"* lo dispara iOS cuando un
control de formulario recibe el foco en pantalla completa, y el curso
tiene tres `<input type="range">`. Un `range` se arrastra con eventos de
puntero, así que se le saca el foco al terminar el gesto — solo en iOS y
solo en pantalla completa, porque en cualquier otro lado sería romper el
teclado por nada.

**Pero el cartel puede asomar igual**: el foco existe DURANTE el
arrastre, y esto no se puede probar sin un iPad real.

Y sobre la alternativa de que "Ampliar" agrande el curso dentro de la
página: **no haría nada**. El curso ya es `position:fixed; inset:0`, o
sea que ya ocupa toda la ventana que tiene; dentro del iframe de Moodle
esa ventana ES el iframe, y agrandarlo requiere que la página de Moodle
coopere — un paquete SCORM no puede pedirle eso. Lo único que agrega la
pantalla completa real es esconder la barra de Safari.

Si el cartel sigue molestando, la decisión es de producto: convivir con
él, o volver a esconder el botón en iPad.

## 7.40 La barra de la locución, en segundos (kit-base v1.9.92)

**Reporte del cliente:** *"Me parece que no está funcionando la barra
para adelantar la locución. Además estaría bueno que esa línea para
adelantar se marque en segundos de locución."*

### 1 · Funcionaba. Y daba igual

El recorrido de la barra eran `total - 1` **fragmentos** (`chunkText`
parte la narración en frases de ~180 caracteres). Medido sobre un curso
real, visitando diapositiva por diapositiva porque `textOf()` filtra lo
que está `[hidden]`:

```
diapositivas con locución : 22
distribución de fragmentos: {1:2, 2:3, 3:8, 4:5, 5:2, 6:1, 8:1}
con recorrido 0 (max=0)   : 2  ← el pulgar NO se puede mover
con recorrido 1 (max=1)   : 3  ← dos posiciones, nada en el medio
```

O sea: **5 de 22 diapositivas (23%) con la barra inmóvil o de dos
posiciones**, y una mediana de 3 fragmentos = 2 pasos de recorrido.
Encima el pulgar solo se movía al CAMBIAR de fragmento — a los saltos,
y muy de vez en cuando.

⚠️ El parche que llegó desde el curso decía "la mayoría". No es la
mayoría, es el 23%. Pero el diagnóstico se sostiene igual: **una barra
de dos pasos se lee como rota**, y para el alumno eso es lo mismo que
estarlo.

### 2 · El límite del que hay que partir

**Web Speech API no dice cuánto dura un texto.** No hay duración total,
no hay posición en segundos, no hay forma de preguntarla antes de
empezar. Lo único que da es el evento de fin de cada fragmento. Los
segundos hay que construirlos.

### 3 · Se estiman, y se corrigen solos

- La duración de un fragmento es `caracteres / (c-por-segundo ×
  velocidad)`. Punto de partida: **13,5 c/s a velocidad 1**.
- Cada fragmento que termina **sin que lo corten** se mide contra lo que
  tardó de verdad y afina la constante con media móvil 70/30. La
  afinación se guarda en el dispositivo (`coto-diapos-cps`), así que a
  partir de la segunda diapositiva ya está calibrada contra la voz real
  del alumno.
- `calibrarCps` descarta sola cualquier medición fuera de 4–40 c/s.

⚠️ **Solo se mide en el `onend` natural** (`gen === speakGen`). Un
fragmento cortado —cambio de diapositiva, mute, seek— duró menos de lo
que le correspondía; usarlo haría creer que la voz es más rápida de lo
que es, y el reloj mentiría en todo el curso.

Medido con un motor de voz falso de c/s conocido: con una voz de 20 c/s
guarda 20; con una de 8 c/s guarda 8. Mide, no adivina.

### 4 · Lo que el parche relayado NO traía, y rompía el gesto que venía a arreglar

El LEEME del parche decía *"`progreso()` suma `seg` y `segTotal`;
`narracionprogreso` los lleva"*. **La primera mitad sí; la segunda no.**
`emitirProgreso()` armaba su propio objeto —`index`, `total`,
`terminado` y nada más— y nadie lo tocó.

Consecuencia, medida arrastrando la barra de verdad y disparando
`change`, no llamando a `seekSeg()` a mano:

```
arrastro al segundo 28.4 → reloj "0:28"   (bien, lo mueve el `input`)
suelto                   → reloj "0:00"   ← y la voz hablando desde 26
```

`seek()` llama a `cancel()`, que emite un `narracionprogreso`. Con el
`detail` sin `segTotal`, `pintar()` tomaba la rama de "no hay locución"
y escribía `0:00` en el reloj y `0.1` en `max`. Se recuperaba al
siguiente tick de 250ms — un parpadeo a cero **justo en el gesto que el
parche venía a arreglar**.

Arreglado dejando **un solo lugar** que arma ese estado:

```js
function emitirProgreso() {
  document.dispatchEvent(new CustomEvent('narracionprogreso', { detail: progreso() }));
}
```

Dos formas de decir lo mismo es una de más: la que se olvida del campo
nuevo.

### 5 · Lo demás

- `seekSeg(segundos)`. **Límite honesto**: el salto cae al comienzo de
  la frase que contiene ese segundo. La API no sabe arrancar desde la
  mitad de una frase, y además es lo que uno querría escuchar.
- El pulgar corre solo con un reloj de 250ms. Sin eso la barra vuelve a
  moverse a los saltos, que es el reporte original.
- Reloj `m:ss` a los dos lados de la barra, con `tabular-nums` para que
  los números no bailen al pasar de 0:09 a 0:10.
- El transcurrido se topea en `segTotal`: si la voz real es más lenta
  que la estimación, el reloj se queda quieto en el total en vez de
  pasarse. Se acomoda en la diapositiva siguiente, ya calibrado.

### 6 · El test, y por qué el primer intento no servía

`tools/tests/locucion-segundos.mjs`. Cinco puntos, los cinco
verificados en las dos direcciones (verde con el código sano, rojo con
la rotura puesta y servida de verdad):

| rotura | resultado |
|---|---|
| `range.max` vuelve a `total - 1` | 🔴 |
| sin el reloj de 250ms | 🔴 |
| el `change` vuelve a `seek()` por índice | 🔴 |
| `narracionprogreso` sin `seg`/`segTotal` | 🔴 |
| se calibra también con un fragmento cortado | 🔴 |

Tres cosas que costaron una conclusión equivocada hasta que se
midieron:

1. **El curso de prueba tiene su PROPIA copia de `js/` y `css/`.**
   Romper el kit y correr el test contra el curso daba verde con la
   rotura puesta, porque el navegador seguía leyendo la copia vieja.
   Va con symlink al kit, o no se está midiendo nada.
2. **Llamar a `Narrador.seekSeg()` a mano no mide el cable.** Con el
   `change` cableado al viejo `seek()` por índice, el test daba verde:
   la pieza estaba y el cable no. Ahora se mueve el `<input>` y se
   disparan `input` y `change` de verdad.
3. **Cortar un fragmento "a los 400ms" no prueba el guard.** Esa
   medición da ~450 c/s, que el rango de cordura de `calibrarCps`
   rechaza igual — el test daba verde con el guard sacado. El corte va
   al **60% de lo que el fragmento iba a durar**: ~1,7× la real,
   perfectamente creíble, dentro del rango, y solo el guard la frena.

## 7.41 El cartel de girar, solo donde se puede girar (kit-base v1.9.93)

**Reporte, probando el curso con el cliente en una PC:** *"Cuando lo
abro en web y achico la pantalla me aparece el cartel de girar
dispositivo."*

### 1 · La forma del lienzo nunca fue la pregunta completa

`initAvisoGirar` decidía por la **forma**: `.d-stage` más alto que ancho
→ "Girá tu dispositivo". En una tablet vertical eso es correcto. En una
PC pasa cada vez que alguien angosta la ventana, o la pone al costado de
otra para tomar notas.

Medido antes de tocar nada, sobre un curso generado del kit:

```
PC 1600×900   → mtp:0  coarse:false  cartel: none   ✓
PC   600×900  → mtp:0  coarse:false  cartel: flex   ← el bug
PC   500×800  → mtp:0  coarse:false  cartel: flex   ← el bug
iPad vertical → mtp:1  coarse:true   cartel: flex   ✓
iPad apaisado → mtp:1  coarse:true   cartel: none   ✓
```

La pregunta real no es qué forma tiene el lienzo, es **si girar el
dispositivo es una acción posible**:

```js
var puedeGirar = !!(navigator.maxTouchPoints > 0) &&
  !!(global.matchMedia && global.matchMedia('(pointer: coarse)').matches);
if (!puedeGirar) return;
```

> **REGLA:** antes de pedirle algo al alumno, preguntarse si puede
> hacerlo. Un aviso que propone una acción imposible en ese dispositivo
> no es un aviso: es un obstáculo — y encima tapa el curso.

### 2 · Cada condición descarta algo distinto, y no lo que parece

El parche que llegó desde el curso justificaba pedir las dos *"porque un
monitor táctil de escritorio responde `coarse` y tampoco rota"*. **Eso
está al revés**: un monitor táctil tiene `maxTouchPoints > 0`, así que
esa condición no lo descarta. El reparto real es:

- **`pointer: coarse`** descarta el escritorio, monitor táctil incluido:
  con un mouse conectado el puntero **primario** es el mouse, así que
  `coarse` da false aunque haya digitalizador. Lo que da true ahí es
  `any-pointer: coarse` — y por eso mismo `any-pointer` NO sirve acá.
- **`maxTouchPoints > 0`** descarta lo que informa puntero grueso **sin
  pantalla táctil que rote**: un navegador de TV o de consola manejado
  con control remoto.

El fix es el mismo; lo que cambia es por qué. Un comentario que explica
mal una condición es el que se borra "porque era redundante".

### 3 · El early `return` no rompe el video de fondo, y se verificó

Con la guarda, en escritorio **nunca se emite `cursotapado`** ni se
agrega `.is-vertical`. Eso podría haber dejado a `initBgVideos` esperando
un evento que no llega — el bug que §7.17 B4 ya había pagado una vez.
No pasa, y no por suerte: `coto-media.js` **lee la clase** (`cursoTapado()`)
en vez de confiar en el evento, precisamente por un bug de orden de
inicialización anterior. Sin clase, lee `false`, que es lo correcto en
escritorio. El evento sigue siendo solo para la TRANSICIÓN destapar →
arrancar, que en escritorio no ocurre.

### 4 · El test que venía en verde con el contrato viejo escrito adentro

`rotate-notice.mjs` ya existía desde v1.9.39 y **daba verde con el bug
puesto**, porque su encabezado declaraba el contrato viejo con todas las
letras: *"sin importar si el viewport es táctil o no"*. Sus cinco casos
eran todos landscape o táctiles: el caso del cliente —vertical y NO
táctil— no estaba.

Ahora son siete, y el contrato del encabezado dice lo que el kit hace.
Verificado en las dos direcciones:

| rotura | resultado |
|---|---|
| sin la guarda `puedeGirar` | 🔴 los dos casos de PC angosta |
| `any-pointer: coarse` en vez de `pointer: coarse` | 🔴 el monitor táctil |
| sin `maxTouchPoints > 0` | 🟢 **no se cubre** (ver abajo) |

⚠️ **Dos límites, escritos porque son límites y no logros:**

1. El **monitor táctil de escritorio** no existe como perfil de
   Playwright: `hasTouch` emula una tablet y responde `pointer: coarse`
   true (medido). Ese caso se arma a mano forzando el `matchMedia` de esa
   consulta. Prueba que la guarda mire el puntero primario; no prueba
   hardware real.
2. **`maxTouchPoints > 0` no está cubierto por ningún test.** Sacarlo
   deja los siete casos en verde, verificado: el dispositivo del que
   protege no se puede emular acá. Queda apoyado en la spec de Media
   Queries 4 y en el comentario del código, no en una medición.

## 7.42 Cuatro hallazgos del kit relevados desde un tercer curso (kit-base v1.9.94)

Primera vuelta que llega desde **"Prevención cardiovascular"**, corriendo
la suite de v1.9.93 contra ese curso y contra el modelo. Los cuatro
hallazgos son **del kit**: tres tests que le fallan o le revientan a
cualquier curso, y un módulo que deja la portada con el rótulo
equivocado. Más un quinto que apareció midiendo esto.

### 1 · Un término de otro curso, hardcodeado en un test del kit

`glosario-orden.mjs` terminaba con:

```js
if (info.secuencia[0].term !== 'Inocuidad') failures.push(…);
```

`Inocuidad` es de "Seguridad alimentaria". **Todo curso que no sea ese
fallaba el test con el glosario perfectamente en orden.** El bucle de
`desordenados`, 20 líneas más arriba, ya verifica el orden ascendente por
índice de diapositiva, que es la regla invariante entre cursos.

⚠️ El parche la llamaba "redundante". No del todo, y conviene decirlo
entero: nombrar el primer término también fijaba que el glosario **no se
saltee el término más temprano** (a una secuencia a la que le falta el
primero le sigue sobrando orden). Esa mitad **no se puede expresar en el
kit**: el glosario ES la única fuente de qué términos existen —se leen de
sus `data-goto`—, así que no hay contra qué comparar; `secuencia[0].idx`
es por construcción el mínimo de los que hay. Se pierde, y es correcto
perderla: una aserción que solo puede cumplir un curso no es del kit.

### 2 · Un test mío que reventaba antes de reportar, en todo curso terminado

`locucion-segundos.mjs` (§7.40, de la vuelta anterior) le agregaba su
párrafo de prueba a la diapositiva **activa**. Al cargar, la activa es la
**portada**, y en un curso terminado la portada es `--bg-video`, que por
diseño **no narra** (`textOf()` devuelve `''`, §5).

Resultado: nunca narraba, `progreso()` quedaba en `null` desde t=0, y el
bloque 3 lo dereferenciaba. `TypeError: Cannot read properties of null
(reading 'segTotal')` — **el proceso moría antes de `report()`**, así que
los fallos que los bloques 1 y 2 ya habían anotado no se imprimían nunca.

Reproducido acá poniéndole al curso de prueba una portada `--bg-video` de
verdad. Con la vuelta atrás puesta y **sin** el guard: el mismo
`TypeError`. Con la vuelta atrás y **con** el guard: seis fallos
impresos, entre ellos el que importa —"el recorrido de la barra es 0"—.
El guard no arregla la medición: hace que el diagnóstico llegue.

⚠️ Por qué no lo vi en §7.40: lo verifiqué sobre un curso **recién
generado**, cuya portada no es de video. El fixture no se parecía al
destino. Tercera variante de la misma trampa en dos vueltas.

### 3 · Dos tests del kit que se contradecían, y ninguno estaba mal

| test | qué exigía en la primera diapositiva |
|---|---|
| `video-tap-chip` (§7.18 K20, mío) | `data-modo="inicio"` |
| `video-autoplay-ios` | `data-modo="sonido"` |

Un curso con la portada en `--bg-video` **no podía pasar los dos**.
Medido: con la vieja aserción, `video-autoplay-ios` da rojo en la misma
portada donde `video-tap-chip` da verde. Lo introduje yo en K20 sin
mirar el otro test.

Ahora `video-autoplay-ios` acepta `sonido` **o** `inicio`: lo que el
escenario mide es que el chip OFREZCA el audio, y los dos modos lo hacen.
El fallo real sigue siendo `reproducir`.

### 4 · El rótulo de la portada cuando el video no arranca

`rotularTap()` traducía a `inicio` solo desde `sonido`. Ahora también
desde `reproducir`.

⚠️ **La justificación del parche no resiste la medición, y el cambio sí.**
Decía *"hoy, si el video no arranca, la portada dice «Tocá para ver el
video»"*, y nombraba como caso más probable el LMS con la red apretada.
Medido, escenario por escenario:

| escenario | chip |
|---|---|
| arranca mudo (camino `sonido`) | visible, "Tocá para comenzar" — ya andaba |
| el video **no decodifica** | **oculto**: `videoUsable()` es false, no hay chip |
| mute global activo | oculto: ya arranca mudo, no hace falta gesto |
| `bgVideoAutoMudo: false` | **visible**, y acá el parche cambia algo |

O sea: en el caso que el parche cita, el alumno no ve ningún chip. El
único estado alcanzable con un chip visible en modo `reproducir` sobre la
portada es el de un curso que apaga el autoplay mudo — una opción que el
kit ofrece, así que el arreglo corresponde. Verificado en las dos
direcciones sobre ese escenario: sin el parche, "Tocá para ver el video"
y `video-tap-chip` en rojo; con el parche, "Tocá para comenzar" y verde.

### 5 · El que apareció midiendo: un chequeo que medía el momento equivocado

`video-fondo.mjs` exigía que el chip **naciera** con `hidden`, pero leía
`tap.hidden` **después** de cargar. Si el video arranca mudo,
`initBgVideos` muestra el chip **a propósito** para ofrecer el audio: el
test acusaba *"nace VISIBLE"* sobre un curso sano.

**Por qué nunca se notó**: ningún fixture de la suite tenía un video de
fondo reproducible. Con un mp4 de 0 bytes nada arranca, el chip se queda
oculto y el chequeo pasaba — verde por ausencia. Apareció recién con un
webm real generado para esta vuelta.

Ahora el atributo se lee del **HTML sin ejecutar** (`fetch` del propio
curso, acotado al bloque de esa diapositiva), que es la única forma de
saber cómo *nace* algo. Verificado en las dos direcciones: sacándole el
`hidden` al chip, rojo.

### Lo que NO pude verificar

El parche dice que en cardio el glosario queda verde con 16 términos. **No
tengo ese curso en este chat**, así que eso queda en su palabra. Lo que sí
medí: que las aserciones de orden siguen mordiendo (11 desórdenes
detectados en el modelo, que todavía tiene el glosario partido en
secciones alfabéticas) y que el hardcodeo ya no está.

## 7.43 Cuatro relays a la vez, y dos que se contradecían con el kit (kit-base v1.9.95)

Llegaron juntos cuatro paquetes: la vuelta de v1.9.94 desde un curso, el
parche "completo" de Prevención cardiovascular, la quinta revisión de
iPad, y **27 hallazgos** de "Surtido sin venta" acumulados en once
vueltas. La consigna fue no dejar nada afuera. Esta sección cubre lo
aplicado; lo que sigue pendiente está al final, con nombre.

⚠️ **Antes de nada, una pérdida que conviene no repetir.** El contenedor
de este chat se recicla si se queda quieto unos días, y se llevó el kit
entero más los 14 zips entregados. Los parches son instrucciones de qué
cambiar: sin el kit no sirven. Hubo que pedir de vuelta el zip de
v1.9.94. **Conviene que el kit viva también en una rama del repo**, no
solo en el disco del chat.

### 1 · `scroll-audit` autorizaba a entregar un curso imposible de terminar

El más caro de los cuatro relays. Sus tres chequeos miraban el
**documento** y `.slide-inner`, que son proxies: si alguien acota
`.slide-inner` con `max-height:100%`, el recorte medido pasa a 0 y el
contenido desborda *hacia adentro*, invisible para una medición de cajas.

Reproducido acá con una diapositiva que copia el caso real —
`.slide-inner` acotado + un botón al final:

| | caso roto |
|---|---|
| `scroll-audit` viejo | ✓ sin fallos |
| `scroll-audit` nuevo | ✗ *"Responder" queda 320–928px fuera del borde de su diapositiva* en los 4 viewports |

El chequeo nuevo mide cada elemento **accionable** contra el borde de SU
diapositiva, e ignora lo que vive dentro de algo que scrollea de verdad.
Eso último no es una concesión: verificado, el mismo botón dentro de un
contenedor con `overflow:auto` da verde, porque se alcanza.

### 2 · Un comentario de CSS que se comía una regla, y el chequeo que faltaba

Apareció aplicando el relay: en `coto-media.css`, el comentario del
título *"3. Video circular…"* cerraba en su propia línea y dejaba **siete
líneas de texto suelto** dentro de la hoja.

Medido en el navegador: el parser **no tira ningún error** y se lleva
puesta la primera regla que sigue. La hoja tenía **36 reglas en vez de
37**, y la que faltaba era `.d-shot-hit--video { cursor: pointer }` — el
video circular que el alumno tiene que tocar no mostraba la manito.

> **REGLA:** un cierre de comentario de más no rompe la hoja. Se lleva la
> regla siguiente, que es peor, porque nada avisa.

⚠️ Y el otro lado del mismo error, que cometí al documentarlo: escribir
la secuencia de cierre DENTRO de un comentario para explicarla lo cierra
igual. El primer intento de este arreglo dejó la hoja en 17 `/*` y 18
cierres.

Nuevo: **`tools/check-comentarios-css.mjs`**, hermano del de HTML, en
`test:kit`. Tres direcciones verificadas: el bug original (rojo), un
comentario que nunca cierra (rojo), y un cierre legítimo dentro de una
cadena `content:"…"` (verde, no es un falso positivo).

### 3 · `check-manifest.mjs`, y la convención que el kit no tenía

`imsmanifest.xml` enumera lo que viaja en el paquete y **nada** lo
mantenía sincronizado; ninguno de los 45 tests lo miraba. Pasó de verdad:
sumarle tres piezas del kit a un curso dejó el manifiesto viejo con la
suite en 45/45.

Al estrenarlo aparecieron dos convenciones conviviendo. ⚠️ Y el relay las
explicaba al revés: decía que *"el generador emite la lista completa"*.
Medido: `new-course.mjs:212` emitía **un solo** `<file href="index.html"/>`,
así que la forma corta era **la que producía el kit**.

**Decisión tomada: el manifiesto enumera todo.** El generador ahora
escribe la lista al final (hay que esperar a que los archivos existan) y
`check-manifest` la vigila. Tres casos verificados: lista al día (verde),
lista que quedó vieja (nombra los que faltan, uno por uno), y un `<file>`
que apunta a algo que no existe. La forma corta se reporta en **una**
línea y no en 48 idénticas — enterrar la pregunta es la forma más rápida
de que nadie la lea.

### 4 · Dos tests del kit que se contradecían, otra vez

`video-tap-chip` exige `data-modo="inicio"` en la primera diapositiva;
`video-autoplay-ios` exigía `"sonido"`. Ya lo había resuelto en v1.9.94
relajando el segundo a "cualquiera de los dos". El relay mandó algo
mejor: **el modo esperado se deriva de si la diapositiva es la primera**.

⚠️ Medido al integrarlo, para no atribuirle más de lo que hace: la rama
`'sonido'` **no es alcanzable hoy**. El escenario mide la diapositiva
activa al cargar, que es siempre la primera — probado con un curso de dos
diapositivas `--bg-video` y entrando por `#slide=`, que no cambia la
activa. Se escribe así igual porque DICE la decisión de producto en vez
de relajarla. Lo que no hay que hacer es confiar en que este test cuida
una diapositiva de video que no sea la portada: no la cuida nadie.

### 5 · K34 · El corte de la barra en tablet

Reporte: *"los botones del menú se ven en distintos tamaños, y falta el
nombre del área"*. El corte estaba en 1180px y los tres anchos reales de
iPad —1024, 1080, 1194— caían del lado compacto. Medido antes de tocar:
a 1080, 1024 y 960 el subtítulo de área y las etiquetas estaban
**apagados**; a 1194, encendidos. De ahí los "distintos tamaños": son dos
componentes distintos conviviendo.

Bajado a 959px, con el saludo escondido entre 960 y 1194. Después:
subtítulo y etiquetas encendidos en los cuatro anchos, sin desborde.

> **REGLA:** un breakpoint se elige midiendo el contenido en su PEOR caso
> real. El saludo vacío mide la mitad que uno con un nombre — y fue
> `scroll-audit` el que lo agarró, con 162px de desborde.

### 6 · K35 · En iOS + pantalla completa no se enfoca nada

Tercera vuelta sobre el cartel *"parece que estás escribiendo"*. Las dos
anteriores atacaron los `<input>`; el cliente lo siguió viendo **al tocar
tarjetas, donde no hay campos**. Queda una sola cosa que hace la página y
que iOS puede leer como "quiere el teclado": **enfocar por código**.

Verificado en los cuatro combos, las dos mitades (abrir y cerrar):

| | enfoca la tarjeta | devuelve el foco al cerrar |
|---|---|---|
| PC | sí | sí |
| PC + pantalla completa | sí | sí |
| iOS | sí | sí |
| **iOS + pantalla completa** | **no** | **no** |

⚠️ La primera medición de la mitad "devolver el foco" no probaba nada: el
disparador ya tenía el foco y nunca lo perdía, así que
`activeElement === disparador` daba true sin que `closePopup` hiciera
nada. Hay que sacarle el foco antes de cerrar.

### 7 · K36 · El pop-up del video

760px fijos venían de una pantalla de escritorio; en un iPad son el 64%
del ancho, y los controles NATIVOS de iOS no achican. Ahora usa el ancho
real con dos topes (94vw y el alto de la lámina por 16/9). Medido: **978px
en iPad apaisado** (82%) contra 760, y entra completo en las 5
resoluciones probadas.

Y `.is-cargando` hasta el primer cuadro real, verificado de punta a punta:
la clase se pone al abrir y se saca en el `playing`.

> **REGLA:** una espera que el alumno no puede distinguir de un cuelgue es
> un bug aunque el código esté bien. Si no se puede acortar, hay que
> mostrarla.

### 8 · K27 · `build-zip.py` rompía el flag UTF-8 que decía arreglar

El encabezado del script mandaba a re-aplicar el flag recorriendo
`z.filelist` después de escribir todo. Eso es **lo que rompía el zip**: a
esa altura los headers locales ya están escritos, así que el bucle solo
alcanza al directorio central, y `unzip` reporta *"mismatch between local
and central GPF bit 11"* una vez por entrada.

Verificado de forma independiente, antes de tocar nada:

| cómo se pone el flag | local | central | `unzip -t` |
|---|---|---|---|
| antes de `writestr` | 0,1,1 | 0,1,1 | ok |
| **después, sobre `filelist`** | 0,1,1 | **1,1,1** | **WARNING** |
| antes y después | 0,1,1 | 1,1,1 | WARNING |
| **sin tocar nada** | 0,1,1 | 0,1,1 | **ok** |

`zipfile` ya pone el flag solo y bien en los dos headers; un nombre ASCII
con el flag en 0 es lo correcto. Y la verificación del script leía
`z.filelist`, que ES el directorio central — justo la mitad que el bucle
acababa de parchear. **Pasaba siempre, por construcción.** Ahora se leen
los headers locales a mano y se comparan: reintroducir el bucle hace
fallar al script, verificado.

### 9 · K25 · Los overlays llegaban sin medidas, y el ancla no alcanzaba a correr

Reporte: *"al iniciar cada diapositiva el contenido aparece y se agranda
un poquito de golpe, como un rebote"*.

Mi primera lectura fue que v1.9.91 ya lo cubría (el ancla provisional deja
el overlay invisible). **Medido, estaba mal**: `place()` arrancaba con
`if (!natW || !natH) return;` y el ancla vive DOS LÍNEAS más abajo, así
que una captura `loading="lazy"` dentro de un `display:none` —que ni se
pide— se iba por ese `return` sin anclar nada. Overlays **visibles, sin
medidas, en el tamaño de su contenido**.

El síntoma no era el ancla: era que el ancla no llegaba a correr.

Y la segunda mitad: una **sonda `Image()`** pide la captura igual, sin
tocar el `loading` del curso. Medido, diapositiva no visitada:
`complete:false, naturalWidth:0` sin la sonda; `complete:true,
naturalWidth:1600` con ella. Además de dar la medida, deja el archivo en
caché, así que al entrar la captura tampoco aparece de golpe.

**No** se tomó la otra parte de la propuesta —que un shot sin medidas use
la caja de otro shot visible—: adivina geometría de un elemento distinto,
y el problema medido se resuelve anclando + calentando la caché.

### 10 · K12 · `layerchange` no recalculaba, y la mitad del test ya no hacía falta

Un `slidechange` disparaba el recálculo; un `layerchange`, no. Medido
sobre una capa `[data-panel]` con overlays adentro, revelándola y
midiendo en el mismo turno: sin el listener quedan en `left:0` invisibles;
con él, en 398.7px y 577.05px, colocados.

⚠️ La otra mitad del hallazgo —que el ancla hacía fallar a
`overlays-colocados` 1 de cada 3 corridas— **ya no puede ocurrir**:
verificado en el código, el test salta los overlays con
`visibility:hidden` (línea 74) y desde v1.9.91 el ancla los deja así. El
curso que lo reportó está en un kit anterior. 8 corridas seguidas en
verde.

Test nuevo dentro de `overlays-colocados`, que **inyecta su propio
marcado** (una capa con overlays es opcional: sin inyectar sería verde por
ausencia) y mide en el mismo turno. Rojo sin el listener, verificado.

### 11 · K3 · El relay tenía razón en el diagnóstico y no en la conclusión

El pop-up "Cómo recorrer el curso" que genera el kit narra **vacío** en
todo curso: medido, `textOf()` de los seis pop-ups de un curso generado
da `(VACÍO)` solo para ése. La causa es correcta: el rediseño v3 movió el
marcado a `h3` + `.d-instr-card > div > b` + `span` y `TEXT_SEL` nunca lo
siguió.

**Pero ese modal no se narra A PROPÓSITO**: decisión de producto tomada
con el cliente en v1.9.86, cuidada por `narracion-ayuda.mjs`, que se pone
rojo si empieza a narrarse. Aplicar el parche habría cambiado la conducta
que el cliente eligió y habría dejado dos tests del kit peleados — otra
vez.

Lo que sí hacía falta arreglar: el silencio era **un accidente**. Salía de
que ningún selector matchea ese marcado, así que bastaba agregarle un
`<p>` para que empezara a narrarse sin que nadie lo decidiera. Ahora el
modal lleva `data-narrate-skip` en el boilerplate. Verificado: sigue
vacío, `narracion-ayuda` verde, y agregarle un `<p>` ya no lo hace narrar.

> **REGLA:** cuando un relay propone cambiar una conducta, buscar si esa
> conducta fue decidida. Un diagnóstico correcto no vuelve correcta a la
> conclusión.

### 12 · K1 · `.d-mj` medía 0 de alto, y dos cursos ya lo habían parchado a mano

`.slide` es `display:flex; align-items:center`, así que `.d-mj` no se
estira: `flex:1 1 auto` gobierna el eje principal, no el transversal.
Después `.d-mj-panel{height:100%}` se resuelve contra `auto` y colapsa.

Medido, inyectando la cáscara en la diapositiva activa:

| | escenario | `.d-mj` | panel | `.d-shot` |
|---|---|---|---|---|
| antes | 780px | **0** | **0** | **0** |
| después | 780px | 780 | 780 | 350 |

Con el hitbox en 0×0, que es exactamente lo que reportaba
`hitbox-click-check`. Mismo mecanismo que el kit ya había corregido un
nivel más abajo en v1.9.61: el contenedor de arriba quedó con la deuda, y
se pagaba en cada curso (dos cursos terminados tenían las mismas cinco
líneas de pegamento escritas por separado). `align-self:stretch` alcanza
y no hace falta tocar `.slide`.

### 13 · K2 · La herramienta no dibujaba lo que §7.3 decía que dibujaba

`verify-hitboxes.mjs` seleccionaba solo `[data-hit]`, mientras §7.3 punto
9 manda a mirar los `[data-place]` en esas mismas capturas. La regla
existía, la herramienta no la cumplía, y es una regla sobre algo que **no
rompe nada** (un `[data-place]` mal puesto solo se superpone al arte), o
sea que mirar la captura era la única forma de verlo. Ahora los dibuja en
cian punteado y los cuenta aparte: verificado, `0 hitbox(es) + 1
[data-place]`.

### 14 · K9 · Un atributo del kit que funcionaba en los pop-ups y no en las diapositivas

`[data-narrate-only]` acota qué se narra. `initPopupNarration()` lo
miraba; la narración de diapositiva, no, porque le pasa la `<section>`
entera a `textOf()`. Los otros dos de la familia
(`[data-narrate-last]`, `[data-narrate-prefix]`) viven DENTRO de
`textOf()` y por eso andan en los dos lados: éste quedó afuera por dónde
se implementó, no por una decisión. Ahora vive adentro también.

Medido: con el atributo, *"Índice de contenidos. Control de surtido sin
venta."*; sin él, eso más los tres ítems. Y los `<li>` siguen en el DOM —
que es el punto: sacar algo de la VOZ sin sacarlo de la accesibilidad.

### 15 · K10 · El motor de voz falso del kit nunca se instalaba

`locucion-control.mjs` instalaba su motor con `window.speechSynthesis = {…}`.
Es un accessor de **solo lectura**, y un `addInitScript` corre en modo
sloppy: la asignación **falla en silencio**. Medido en el mismo Chromium
de la suite: con asignación simple, el motor falso no queda; con
`Object.defineProperty`, sí.

Lo confirmé antes de leer el hallazgo, sin saberlo: mis propias sondas de
esta vuelta necesitaron `defineProperty` por el mismo motivo.

El test pasaba en verde porque sus cuentas de llamadas a
`Narrador.speak()` siguen valiendo contra el motor real. Lo que no se
ejercitaba es el escenario por el que dice existir —*"silenciar a mitad de
la frase"*—, que sin una locución que dure no existe. Arreglado, el motor
recibe emisiones de verdad (medido: 1 emisión, *"Introducción"*) y el test
sigue verde.

### 16 · K11 · "7/6 logros"

Las dos puertas al mismo conjunto aplicaban criterios distintos:
`unlock()` valida contra el catálogo, `restore()` no. Cualquier id de más
infla el numerador contra un denominador fijo. De dónde sale un id que ya
no existe: de probar builds sucesivos sobre el mismo LMS, porque
`scorm-api.js` deriva su clave de la RUTA del paquete.

Reproducido determinísticamente con un id `'fantasma'`: **4/3 con 3
tarjetas** antes, **3/3 con 3 tarjetas** después, más un `console.warn`
que nombra lo descartado.

### 17 · El escalonado de overlays, apagado por default

Decisión del cliente. Un cliente lo pidió (v1.9.51) y otro lo objetó — la
tensión del Ken Burns (§E1). Lo medido que le da la razón al segundo: con
5 paneles, 45ms y 90ms por elemento dejan al último arrancando a los
360ms, después de que la diapositiva terminó su fundido de 300ms.

Ahora es opt-in: `<html data-overlay-stagger>` lo devuelve idéntico.
Verificado: apagado, ni clase ni demoras; prendido, 0/45/90ms. Se apaga
en el JS y no con un token de CSS a propósito — desde la hoja, el JS
seguiría escribiendo `animationDelay` y agregando la clase por nada.

⚠️ **No** toca `staggerReveal()` (los pop-ups): es otra pieza y nadie la
objetó.

### Lo que este arreglo cambia en cursos ya entregados

El escalonado apagado y el corte de la barra en 959px se ven distinto si
un curso viejo se recompila con este kit. Es lo pedido, y conviene
saberlo antes de rearmar un paquete.

### Lo que queda en cola, con nombre

De los 27 hallazgos de "Surtido sin venta" van **9** (K1, K2, K3, K9,
K10, K11, K12, K25, K27). Quedan **18**, y se listan acá para que la
próxima vuelta no arranque de cero:

| K | qué es | por qué no entró todavía |
|---|---|---|
| K4 | el glosario del boilerplate narra las pistas de candado, y pegadas | dos arreglos: el párrafo `data-narrate-only` en el boilerplate y que `initGlossaryUnlock()` use el atributo `hidden` además de la clase |
| K5 | `puntaje-maximo.mjs` no puede medir un mini juego | necesita decidir entre un gancho (`__PUNTAJE_RECORRIDO__`) o documentar que un curso con minijuego declara su máximo en un test propio |
| K6 | los overlays miden la tipografía en `cqw` del escenario, no del arte | PROBADO en el curso, SOSPECHADO en el kit: hay que reproducirlo acá primero |
| K7 | los flotantes de Ayuda/Configuración tapan contenido en pantallas bajas | |
| K8 | documentación que dice algo distinto del código | varios menores, conviene hacerlos juntos |
| K13 | nada avisa si un curso se entrega con el ícono placeholder | PROPUESTA de herramienta, no bug |
| K14 | tope de 5 logros por curso | CONVENCIÓN NUEVA del cliente, no bug |
| K15 | `.d-shot-hit-play` no trae ícono, y su marcado de ejemplo tampoco | |
| K16 | Ayuda y Configuración abren con el mouse encima, sin forma de pedir "solo clic" | ⚠️ revisar contra v1.9.89, que pasó los cuatro popovers a solo clic |
| K17 | el kit dice "el máximo posible del curso" para cualquier puntaje por encima del último nivel | |
| K18 | el kit sabe que un curso no puede usar el recorte de tablet y no da forma de apagarlo | |
| K19 | `showPopup()` enfoca el primer campo de texto | ⚠️ revisar contra K35, que ya cambió el foco en iOS + pantalla completa |
| K20 | el `fullscreen` de video en iOS no emite `fullscreenchange` | PROBADO por síntoma, sin instrumentar el dispositivo |
| K21 | el kit escribe el chrome en `rem` y nunca define el tamaño de raíz | de los más caros: la interfaz no escala en un monitor grande |
| K22 | `initBgVideos()` da por perdido cualquier error que no sea `NotAllowedError` | |
| K23 | no hay forma de saber si el alumno eligió velocidad de locución | |
| K24 | `initBgVideos()` no tiene `onFirstPlay` y `initInlineCircleVideos()` sí | |
| K26 | `video-fondo.mjs` no prevé el "contenedor vacío" | |

Dos de ellos hay que releerlos contra cambios que el kit ya hizo después
de que se escribieran (K16 contra v1.9.89, K19 contra K35 de esta
vuelta): puede que uno de los dos lados ya no aplique, como pasó con la
mitad de K12.

## 7.44 El video negro, y la tercera puerta del cartel de Safari (kit-base v1.9.95)

Dos bugs de iPad más, llegados mientras se aplicaba §7.43. El segundo
corrige el arreglo de esa misma vuelta.

### 1 · K38 · Estaban tapadas 2 de las 3 puertas

§7.43 punto 6 puso `focoBloqueado()` en `showPopup` y `closePopup` —los
dos lugares donde se veía el problema— y dio el tema por cerrado **sin un
test**. El cliente volvió a reportar el cartel *"cada vez que voy
interactuando con el curso"*. Tenía razón, y **el "cada vez" era el
dato**: quedaba abierta la puerta que más corre.

Medido: el kit mueve el foco solo en **cuatro** lugares, no dos.

| dónde | cuándo corre | ¿tenía guard? |
|---|---|---|
| `showPopup` (tarjeta) | al abrir una ficha | sí, §7.43 |
| `closePopup` (vuelta al botón) | al cerrarla | sí, §7.43 |
| **`go()` → `[data-slide-title]`** | **en TODA navegación** | **no** |
| **`coto-quiz.js` → `nBtn.focus()`** | al contestar | **no** |

Los otros dos `focus()` del motor son el ciclo de Tab dentro de un
diálogo: responden a una tecla real del alumno, y si no hay teclado no hay
Tab. No llevan guard a propósito.

Y `focoBloqueado()` **se exporta** en vez de copiarse: con dos
definiciones, arreglar una deja la otra abierta — que es exactamente cómo
este bug sobrevivió dos vueltas.

> **REGLA:** un arreglo sin test no está cerrado, está sin mirar. Las dos
> vueltas anteriores taparon lo que se veía y nadie contó las puertas.

### 2 · El atributo que el motor buscaba y el generador no escribía

Estrenando el test nuevo apareció otra cosa, y es del kit: el test exigía
que **fuera** de pantalla completa el foco SÍ se mueva al título —
accesibilidad real, es lo que le avisa a un lector de pantalla que la
diapositiva cambió— y fallaba en un curso generado.

Medido: `new-course.mjs` emitía `<h2>Título</h2>` **sin**
`data-slide-title`, y `index-boilerplate.html` no lo tenía en ningún lado
(0 ocurrencias). O sea que `Motor.go()` buscaba un atributo que **el
propio generador del kit nunca escribía**: en todo curso generado ese foco
no encontraba nada y la accesibilidad quedaba muda. Los cursos terminados
lo tienen porque se escribió a mano, uno por uno.

La pieza estaba en el motor y el cable no lo ponía nadie. Arreglado en el
generador: un curso nuevo sale con los 7 títulos cableados.

⚠️ **Y el arreglo se llevó algo puesto, que la suite agarró en el acto.**
Cablear el atributo dejó **6 diapositivas del esqueleto MUDAS**, porque
`[data-slide-title]` no se narra por default (decisión de un cliente
anterior: *"solo el contenido explícito"*, §5) y en un curso recién
generado el `<h2>` era el único texto que había. `narracion-completa` lo
reportó una por una, con razón.

Así que el generador ahora emite las dos cosas: el título con su atributo
**y un párrafo de arranque** que el autor reemplaza. No es relleno — es lo
que hace que un curso generado sea coherente con lo que el propio kit
exige, y le da al autor el lugar exacto donde escribir. Verificado: curso
nuevo, `narracion-completa` en verde.

### 3 · K37 · "Lo pausé, se puso todo negro y no arrancó más"

Reporte con foto en iPad, y la foto tenía la respuesta: los controles
nativos marcaban `0:21 / -0:49` sobre un cuadro negro. El `<video>` sabía
su posición y su duración — no había perdido el archivo, **había perdido
la imagen**.

El relay hizo lo correcto antes de arreglar: **descartó culpa propia en
vez de suponerla**. Instrumentó el reproductor y disparó un `pause`;
ningún handler del kit ni del curso lo toca, y el único que vacía la
fuente es el de `popupclose`, con el pop-up abierto. El que soltó el video
fue el navegador: PiP/AirPlay (pegados al botón de pausa en la barra
nativa) o Safari sacándole el decodificador a un video pausado.

**Cura**: `emptied` es la señal de "acá ya no hay video", y es accionable
—se sabe la fuente y el segundo—, así que se vuelve a enganchar el mismo
.mp4 y se busca dónde estaba.

**Prevención**: `disablepictureinpicture` + `controlslist="nodownload
noremoteplayback"`.

⚠️ **La justificación del relay era falsa y el cambio igual corresponde.**
Decía que son *"las mismas dos defensas que el video EN EL LUGAR ya
tenía"*. Medido: `disablepictureinpicture` **no aparecía en ninguna parte
del kit**, y el único `controlslist` estaba dentro de un comentario
contando que una vuelta anterior probó `nofullscreen` y **el cliente pidió
explícitamente que la pantalla completa quedara**. Estos dos atributos no
tocan ese botón: sacan PiP y AirPlay, que son los que se llevan la imagen.

⚠️ **Y el marcado hay que ponerlo en DOS lados.** El relay actualizaba el
ejemplo del encabezado de `coto-media.js` (de donde copia cada curso) pero
no `index-boilerplate.html`, que es el marcado real: sin eso, ningún curso
nuevo salía con las defensas. Verificado en un curso recién generado: 2
ocurrencias.

### 4 · Los dos tests nuevos, y lo que cada uno no cubre

Entran al kit y la suite pasa de 45 a **47**.

`video-rescate` — tres bordes del contrato, verificados uno por uno:

| rotura | resultado |
|---|---|
| sin el flag anti-bucle | 🔴 **4856 re-enganches** con 10 `emptied` |
| sin la cura entera | 🔴 no engancha nada |
| sin apagar la red al cerrar | 🟢 **no lo agarra** |
| sin el guard de `.open` | 🟢 **no lo agarra** |
| **sin los dos** | 🔴 el `<video>` queda con `src` y sigue descargando |

O sea: el kit cuida ese caso **dos veces** y cada guard alcanza solo. Es
redundancia a propósito, y queda escrito en los dos archivos — si alguien
limpia uno "porque está repetido", la suite no se va a quejar.

⚠️ Y el test **llegaba en la forma equivocada para el kit**: se ponía rojo
en todo curso sin video en pop-up (*"ningún curso: no hay
[data-video-play]"*). Un curso puede no tener videos y no está roto por
eso. Pero saltear a secas sería verde por ausencia, justo en un curso
recién generado, que es donde más importa. Ahora **inyecta el marcado que
emite el módulo**, como los otros seis tests de mecanismo opcional.

`foco-ios-fullscreen` — mira las tres puertas del motor a la vez y las dos
mitades (dentro y fuera de pantalla completa). ⚠️ La cuarta, la del
mini-quiz, **no se ejercita**: sacándole el guard el test sigue verde,
porque hace falta un curso con `initMiniQuiz()` y una pregunta contestada.
Queda cubierta por compartir `focoBloqueado()` en vez de copiarla, no por
una medición.

## 7.45 La segunda mitad de los 27, y un PiP que el atributo no frena (kit-base v1.9.96)

Sigue de §7.43/§7.44. Acá entran K39 (llegó mientras se aplicaba lo
anterior) y nueve hallazgos más de "Surtido sin venta".

### 1 · K39 · WebKit ignora `disablepictureinpicture`

La prevención de K37 no alcanzaba, y la segunda foto del cliente lo dice
con todas las letras: el pop-up mostrando *"This video is playing in
picture in picture"*. Eso **confirma** que el cuadro negro de K37 era PiP
y **muestra** que el atributo no sirve en iPad: Safari dibuja su botón en
una capa propia de su shadow DOM, fuera del alcance de `controlslist` y
del CSS.

Lo único que funciona es imperativo: `webkitSetPresentationMode('inline')`
al detectar el cambio de modo. Verificado en los cuatro bordes:

| caso | resultado |
|---|---|
| `disablePictureInPicture` por código (Chrome sí lo respeta) | ✓ puesto |
| entra en PiP | ✓ vuelve a `inline` |
| entra en **pantalla completa** | ✓ **no se toca** (el cliente la pidió) |
| PiP con la página escondida | ✓ no se toca (no se le pelea al sistema) |

⚠️ Segunda vez que un relato de este componente afirma que el video EN EL
LUGAR "ya tenía" `disablepictureinpicture`. Medido otra vez: no lo tenía
— ese atributo no existía en ninguna parte del kit antes de v1.9.95.

> **LECCIÓN:** un fix declarativo que "debería" andar no está verificado
> hasta que lo confirma el navegador real.

### 2 · K22 · El chip que no volvía, y dos regresiones mías que atajó la suite

El video de fondo se recupera de un `AbortError` por dos caminos que el
kit ya tenía (primer gesto y `canplay`), así que el *"no vuelve a intentar
nunca"* del hallazgo no aplica hoy. Lo que sí quedaba: `attempt()` empieza
escondiendo el chip y solo lo reponía el reintento del `catch`. Medido:
video reproduciéndose **mudo** con el chip **escondido** — el alumno mira
la portada sin sonido y sin forma de pedirlo.

Dos cosas que rompí arreglándolo, y las dos las agarró la suite:

1. `p.then(cb)` devuelve una promesa NUEVA: con el `catch` en la original,
   el rechazo quedaba sin manejar y salía por consola. `markup-sanity` lo
   marcó — y tenía razón, un error suelto tapa el próximo de verdad. Va
   en un solo `then(ok, err)`.
2. Reponer el chip **siempre que esté mudo** desobedece al alumno que
   apagó el sonido a propósito. `video-autoplay-ios` lo dijo textual. La
   condición es "mudo CONTRA su preferencia": `v.muted && !muted()`.

### 3 · K21 · La interfaz no escalaba en un monitor grande

Medido antes: raíz en 16px y barras de 56/64 tanto en 1366 como en 2560,
mientras el lienzo pasaba de 1366 a 2560 de ancho. El kit escribe todo el
chrome en `rem` —lo correcto— pero ningún archivo definía
`html{font-size}`.

Ahora la raíz es un `clamp()` y las filas del chrome van en `rem`:

| | raíz | chrome |
|---|---|---|
| 1366×768 | 16px | 56/64 (**sin cambios**) |
| 1920×1080 | 17.7px | 62/71 |
| 2560×1440 | 21px | 74/84 |

⚠️ Y rompió un test, con razón: `chrome-tactil` comparaba contra 120px
hardcodeados. Su intención —que el escritorio no reciba el chrome
TÁCTIL, que es una talla entera más grande— se conserva comparando contra
la proporción. Verificado: con el chrome táctil forzado en escritorio,
sigue rojo en los dos anchos.

También la mitad (b) del hallazgo: `.d-iconbtn--labeled` pasó a
`.d-iconbtn.d-iconbtn--labeled` en las 8 apariciones del archivo, porque
subir solo la regla base dejaba por debajo a los overrides de los media
queries. Verificado en tres anchos, y que una regla de ancho de un curso
ya no lo aplasta.

### 4 · K4 · El glosario narraba las pistas del candado, y el arreglo propuesto no servía

Dos mitades. La primera: el pop-up del glosario no emitía el párrafo
`data-narrate-only` que el addendum ya daba por hecho (Recursos y Logros
sí lo traían). Ahora lo emite.

La segunda es la interesante. El hallazgo proponía marcar la definición y
la pista con el atributo `hidden` además de la clase. **Medido: no cambia
ni una letra de lo narrado.** La causa real es que el filtro de `textOf()`
saca los NODOS dentro de algo `[hidden]`, pero cuando el nodo que matchea
es el contenedor —el `<dd>`— se lee su `textContent` completo, hijos
escondidos incluidos.

El arreglo que sí funciona es un nivel más adentro: al leer un nodo, se
descartan sus descendientes `[hidden]`. Medido, con un término visitado y
otro no:

```
antes:   "Inocuidad. Que el alimento no hace daño.
          Se desbloquea al llegar a «Tema 1». Alérgeno. Sustancia que…"
después: "Inocuidad. Que el alimento no hace daño. Alérgeno.
          Se desbloquea al llegar a «Tema 2»."
```

O sea: el desbloqueado narra su definición, el bloqueado su pista, cada
uno lo suyo. El `hidden` se marca igual —sirve para un lector de pantalla
y para `:has()`— pero lo que resuelve la narración es lo otro.

### 5 · Los demás de la tanda

- **K24** · `initBgVideos()` acepta `seen`/`markSeen`/`onFirstPlay`, igual
  que los otros patrones: mover una diapositiva de patrón ya no hace
  perder los puntos. Escucha `playing` y no `play`, porque `play` también
  se dispara cuando el navegador lo intenta y rechaza. Verificado: paga
  una vez, con la diapositiva y el archivo, y no vuelve a pagar.
- **K26** · `video-fondo` honra `data-sin-poster` para la diapositiva que
  ES el video. Verificado en las tres posiciones.
- **K1** · `.d-mj` medía 0 de alto: `align-self:stretch` + `height:100%`
  en el CSS que ya es su dueño. Medido: 0 → 780, y el hitbox deja de ser
  0×0. Dos cursos tenían las mismas cinco líneas escritas a mano.
- **K2** · `verify-hitboxes` dibuja los `[data-place]` en cian punteado,
  como §7.3 punto 9 ya decía.
- **K17** · "el máximo posible del curso" solo se afirma si el curso
  DECLARA su máximo y el puntaje llega. Los tres casos medidos; el del
  reporte (189 sobre 199) ya no miente.
- **K23** · `hayRateElegido()` y `setRateDefault()`: un curso puede poner
  0.85x en iPad sin pisar al alumno. Verificado que un `1` elegido se
  distingue del default.
- **K15** · el kit dibuja el triángulo de play; el texto del botón pasa a
  `aria-label`. Antes se veía la palabra "Reproducir" adentro del círculo.
- **K18** · `<html data-arte-sin-margen>` apaga el recorte de tablet para
  todo el curso. Medido: el lienzo vuelve a 2:1 exacto en vez de
  estirarse a 2.11.
- **K7** · `--d-fab-canal` reserva el ancho de los flotantes en
  diapositivas que no son captura, en pantallas bajas. ⚠️ La cuenta
  "botón + aire" daba mal: la pila mide 74px con su separación, no 60 —
  con 60 quedaban 14px de superposición, medidos.

### 6 · K16 y K19 · cerrados sin tocar nada

Los dos estaban resueltos por vueltas posteriores a su redacción, y se
verificó midiendo, no por lectura:

- **K16** (los flotantes abren con el mouse encima): con el puntero
  encima del botón, el panel queda `visibility:hidden; opacity:0`.
  `.is-hover` y `attachHoverGrace()` dejaron de existir en v1.9.89.
- **K19** (`showPopup()` enfoca el primer campo de texto): abrir el
  glosario enfoca un `DIV`, la tarjeta. Ya no hay `focusable` en
  `showPopup`.

Es la tercera vez en estas tres secciones que un hallazgo llega pidiendo
algo que el kit ya hizo. No es un problema del relay —escribe contra el
kit que tiene el curso— pero confirma la regla: **verificar contra el
código de hoy antes de aplicar.**

## 7.46 Los últimos seis de los 27, y un número que el kit decía de sí mismo (kit-base v1.9.97)

Cierra la tanda de "Surtido sin venta": **los 27 hallazgos quedan
resueltos o descartados con su medición**.

### 1 · K8 · Cuatro documentos con cuatro cifras del mismo zip

Una familia entera de números desactualizados, y ninguno rompe nada:
todos hacen dudar. Medido al empezar:

| dónde | decía | era |
|---|---|---|
| `PROMPT-CURSO-NUEVO.md` (versión del kit) | v1.9.91 | **v1.9.96** |
| `PROMPT-CURSO-NUEVO.md` ("tiene que dar N/N") | 23 | **47** |
| `README.md` (descripción de la suite) | 23 tests | **47** |
| `README.md` paso 4 / `js/curso.js` (checklist) | "los 7" | **47** |

El de `PROMPT-CURSO-NUEVO.md` es el que más viaja: ese prompt se copia
**tal cual** a cada chat nuevo, así que el número mal escrito arranca
todos los cursos.

> **REGLA (§6.60):** un número que describe el contenido del propio kit no
> se escribe a mano. Se mide.

Nuevo **`tools/check-conteos.mjs`** en `test:kit`: compara cada
afirmación VIVA contra el disco. Verificado que muerde en las dos derivas
que van a pasar de verdad — subir la versión sin tocar el prompt, y
agregar un test sin actualizar el número.

⚠️ Las referencias HISTÓRICAS de las §7 **no se tocan**: dicen qué era
cierto en su momento, y reescribirlas sería falsear la bitácora. Ya pasó
una vez, con un `sed` global de versiones.

### 2 · K14 · El tope de 5 logros, que ahora no se puede olvidar

Convención del cliente para TODOS los cursos. El catálogo es contenido
del curso; el tope no. Anotado en §1 y verificado en
`gamificacion.mjs`: con 6 falla nombrando la regla, con 5 pasa.

### 3 · K13 · El ícono placeholder que nadie veía

`new-course.mjs` deja un WebP de 1×1 transparente, y lo hace bien: un
`src` roto sería un 404 y la suite cuenta cualquier error de consola como
fallo. El costo es que la pastilla del header se ve VACÍA y nada lo nota
— un curso se entregó así una vuelta entera.

Ahora `markup-sanity` lo mira, y **como aviso mientras el curso está en
construcción**: el placeholder es lo correcto hasta que llegue el arte, y
ponerlo en rojo desde el minuto cero entrena a mirar la suite en rojo.
Verificado en las tres posiciones (esqueleto → aviso, con contenido →
fallo, con ícono real → verde).

⚠️ Y costó dos mediciones equivocadas medir "¿tiene contenido?":
`body.innerText` devuelve solo la diapositiva VISIBLE (40 palabras en un
curso lleno) y `Narrador.textOf()` filtra lo `[hidden]`, o sea todas menos
la activa (0 palabras). Va con `textContent` crudo, que no depende de que
nada esté a la vista.

### 4 · K20 · El evento que en iPad no llega

El kit ya tenía el arreglo —volver a correr `_initShots()` al salir de
pantalla completa, porque el `<video>` está posicionado en px sobre la
captura— pero escuchaba `fullscreenchange`, y **Safari de iOS emite
`webkitbeginfullscreen` / `webkitendfullscreen`** sobre el propio
elemento. En el dispositivo donde más se usa esa pantalla completa, el
arreglo no corría nunca. Lo que faltaba no era el arreglo: era el evento
por el que llega.

Verificado que los dos eventos disparan el recálculo. ⚠️ El fullscreen
nativo de iOS no se puede reproducir en el Chromium de la suite: lo
medido es el mecanismo, no el dispositivo.

### 5 · K5 · Un recorrido genérico no puede jugar un juego

`puntaje-maximo` no puede medir un minijuego, y no es un selector que
falte: las respuestas incorrectas cuestan vidas, así que tocarlas todas
tampoco sería "el máximo". La consecuencia era que un curso con minijuego
o declaraba un número inalcanzable (y fallaba) o el que el test mide (y
afirmaba algo falso).

Ahora el curso puede completar el recorrido: `window.__PUNTAJE_RECORRIDO__()`
se llama después del recorrido genérico y antes de medir. Verificado en
las tres posiciones: sin gancho no cambia nada, con gancho el declarado
se alcanza, y si el gancho revienta se reporta con su mensaje.

### 6 · K6 · La sospecha que NO era un defecto visible

El hallazgo venía marcado como *"PROBADO en el curso, SOSPECHADO en el
kit"*: los overlays del panel final del minijuego se dimensionan en `cqw`
de `.d-mj-fin`, y el `.d-shot` de adentro puede ser bastante más angosto.

Medido término por término del `clamp()`, en tres viewports:

| viewport | panel · arte | piso | 2.6cqw panel/arte | gana |
|---|---|---|---|---|
| escritorio 1600×900 | 800 · 800 | 17.6 | 20.8 / 20.8 | cqw |
| teléfono acostado 750×340 | 516 · **339** | 17.6 | 13.4 / 8.8 | **piso** |
| iPad vertical 834×1194 | 417 · 417 | 17.6 | 10.8 / 10.8 | **piso** |

**El desfasaje es real —1.52× en teléfono acostado— y el piso del
`clamp()` lo absorbe**: los dos términos quedan por debajo, así que se
renderiza idéntico. La sospecha sobre el kit **no es un defecto visible
hoy**. Hace falta un panel más ancho que su arte Y un tamaño por encima
del piso.

Se dejó el `.d-shot` como contenedor igual, porque hace que `cqw`
signifique lo que sus autores quisieron —"% del arte"— y porque el día
que alguien suba un tamaño ya está bien. Medido: mismo render.

⚠️ La primera lectura de esta medición fue "confirmado en el kit", y era
leer el piso del `clamp()` como si fuera el `cqw`. Está anotado en el CSS
para que nadie repita la lectura.

### Los 27, cerrados

- **Aplicados (19)**: K1, K2, K4, K5, K7, K8, K9, K10, K11, K12, K13,
  K14, K15, K17, K18, K20, K22, K24, K25, K26, K27.
- **Rechazado con su razón (1)**: K3 — el modal de instrucciones no se
  narra a propósito; lo que se arregló es que el silencio fuera explícito.
- **Cerrados sin tocar nada, verificando (2)**: K16 y K19, ya resueltos
  por vueltas posteriores a su redacción.
- **Medido y descartado (1)**: K6, arriba.
- **Convención documentada (1)**: K14, en §1.

## 7.47 El reproductor propio, y tres tests que daban verde sin mirar (kit-base v1.9.98)

Dos relevos a la vez, los dos escritos contra **v1.9.96** cuando el kit ya
estaba en 1.9.97. Nada se copió encima: se comparó archivo por archivo y
se portó sólo lo nuevo. Vale anotar por qué, porque es el modo de fallar
de esta vuelta: el `coto-media.js` que llegó venía del curso, "adelantado"
a v1.9.98, y copiarlo habría **borrado** cuatro piezas del kit —
`ICONO_PLAY`/`dibujarPlay` (§7.43), `arrancoMudo` (§7.43) y el
`webkitendfullscreen` (§7.46)— y habría revertido el `then(ok, err)` a un
`catch()`, reintroduciendo el rechazo sin manejar que `markup-sanity` ya
había cazado una vez. **Un archivo con número de versión más alto no es un
archivo más nuevo**: es otro archivo.

### 1 · La FAQ de Ayuda, aplastada a 0px en los dos cursos

`.d-fab-pop--ayuda` es un flex column con `max-height`, y el scroll se le
pedía al acordeón. El problema es cuál de los hijos cede: los de arriba
son `flex:0 1 auto` con `min-height:auto` y no bajan de su contenido; el
acordeón era el único con `min-height:0`, así que se llevaba **todo** el
recorte. Medido en el curso generado, bajando el alto de ventana para
forzar el apretón (los cursos reales llegan acá ya a pantalla completa,
porque tienen más contenido arriba):

| ventana | max-h del panel | `.d-fab-acc` | contenido |
|---|---|---|---|
| 900 / 700 / 560 | 410px | 136px | 140px |
| 480 | 330px | 116px | 140px |
| 420 | 270px | 58px | 140px |
| 380 | 230px | **19px** | 140px |
| 340 / 300 | 190/150px | **0px** | 140px |

Fix: scrollea el **panel**, el acordeón pasa a `flex:none`. Es más robusto
que repartir alto entre hermanos — mañana se agrega un bloque arriba y
sigue funcionando.

Y el test que lo tapaba: `fab-config` clickea con `{force:true}`, que
dispara el evento en las coordenadas del elemento **aunque esté
recortado**, así que abría y cerraba preguntas invisibles y daba verde.
⚠️ El chequeo que se le suma mide el **alto**, no la scrolleabilidad: a
0px de alto el acordeón todavía tiene `overflow:auto` y
`scrollHeight > clientHeight`, o sea que preguntarle «¿scrolleás?»
contesta que sí. Verificado en las dos direcciones inyectando contenido
que no se deja achicar: acordeón en **0px → rojo**, parchado **136px →
verde**.

### 2 · El progreso por objetivos contaba por DOCUMENTO

`document.querySelectorAll('[data-obj-pip]')` + `document.querySelector
('[data-obj-lbl]')`: con un grupo funciona, con dos se mezclan. Medido
inyectando un grupo de 3 objetivos y otro de 2: el primer rótulo decía
**"0 de 5 objetivos cubiertos"** y el segundo quedaba en **`''`**. Por eso
su propio test sólo podía aprobar en cursos SIN la funcionalidad. Ahora se
recorre por `.d-obj-progress`, con el documento como único grupo si un
curso no usa el envoltorio.

### 3 · `montarControles()`: se deja de usar la barra nativa

Cuatro vueltas de reportes de iPad sobre el mismo componente —cuadro
negro al pausar, PiP llevándose el video, desalojo de memoria, los
controles desapareciendo solos— tenían la misma causa de fondo: la barra
**nativa** de Safari dentro de un modal. De esa barra no controlamos qué
botones trae (WebKit ignora `disablepictureinpicture`, §7.45), ni cómo se
ve (shadow DOM cerrado), ni cuándo se esconde. La salida no es parchar más
rápido: es no usarla. Se pierden AirPlay y el PiP legítimo — decisión del
cliente, con el mockup a la vista.

Va en los cuatro patrones de video. Las dos barras son `<input
type="range">` de verdad, no divs: teclado, rol, valor para el lector de
pantalla y arrastre táctil vienen gratis. Y el kit deja de **emitir**
`controls`: `index-boilerplate.html` y los tres marcados documentados en
`coto-media.js` salían con el atributo que `montarControles()` acto
seguido borraba — markup que el kit deshace solo.

**Un defecto del parche, encontrado midiendo.** El disparador nuevo del
rescate (`play` con `readyState === 0`) se disparaba en **toda** apertura:
justo después de `player.src = src` el elemento está en
`readyState:0, networkState:3`. Y hay un segundo camino, que ya existía
desde §7.43: cambiar de `src` emite `emptied` — medido, abrir un segundo
video en el mismo pop-up da `emptied, loadstart, error`. Resultado: una
segunda carga del mismo archivo y el cartel equivocado ("Recuperando el
video…" en la primera apertura, medido). Los dos se cierran subiendo
`rescatando` en `abrir()`, que ya significa exactamente eso y lo baja el
`loadstart` de esa misma carga.

**Y el test que el relevo no traía.** 340 líneas nuevas sin una sola
verificación, y el resto de la suite no las toca: `video-rescate` mira la
red de rescate, `video-autoplay-ios` el arranque mudo, `video-fondo` las
diapositivas de fondo. `reproductor-video.mjs` (NUEVO) mide la barra, sus
rótulos, el reloj, el avance, el retroceso de 10s, el mudo, el aviso con
`role="status"` y —sobre todo— que **ningún** `<video>` del curso tenga
los controles nativos prendidos, que es la razón de ser del cambio y no
avisa cuando se rompe, porque las dos barras funcionan. Verificado
rompiendo cada mitad a propósito: sin `montarControles` → rojo; con
`controls` de vuelta → rojo; sin el toggle del clic → rojo; sin
`role="status"` → rojo.

⚠️ El `var(--cat, #1EAADC)` que traía el CSS del curso se sacó: ese hex es
el turquesa de "Seguridad alimentaria", y un fallback con el color de UN
curso es peor que ninguno — si faltara `--cat`, el molde entero saldría
turquesa sin que nada avise. Lo cazó `check-raw-cat-colors`.

### 4 · La cura de raíz del video que se cuelga en iPad

Un `<video>` pausado no es un `<video>` libre: retiene su buffer y, en
iOS, su decodificador. iOS tiene un tope de medios decodificables a la vez
y desaloja el que está pausado, sin avisar — y el primer candidato es el
reproductor del pop-up en el momento en que el alumno toca pausa. De ahí
que el síntoma apareciera **siempre al pausar**, y que ni §7.44 (rescate)
ni §7.45 (PiP) lo taparan: las dos trataban el efecto, no la presión. Al
salir de una diapositiva se le suelta la fuente y se re-engancha al
volver; la fuente se recuerda al **inicializar**, antes de que nada pueda
soltarla.

Y el falso positivo que eso destapó: `video-fondo` leía el `src` del DOM
en vivo, así que acusaba *"el `<video>` no tiene src"* en toda diapositiva
que no fuera la activa — o sea le fallaba justo a los cursos que **sí**
tienen la cura puesta. Ahora mira también `_fuenteBg`.

### 5 · `cancel()` de la locución tiene que insistir

*"cerré el glosario y quedó abierta la locución, incluso hasta cuando
cerré el curso"*. Con una voz **de red** —las que este kit prioriza— la
síntesis vive en el servidor del navegador: `cancel()` es un pedido, no
una garantía. El `speakGen++` evitaba que la cola avanzara, pero el
fragmento en vuelo terminaba de sonar. Ahora se verifica a los
60/180/400ms y se vuelve a pedir mientras `speaking` siga en true.
Verificado con un motor terco, una página por caso: **1** pedido cuando
obedece, **1 + 3** cuando no (medido a 974 / 1035 / 1215 / 1615ms).

⚠️ El guard se cuenta por locuciones **entregadas al motor**, no por
`speakGen`: `speak()` arranca llamando a `cancel()`, así que los
reintentos heredarían la generación de la locución que está POR empezar y
la matarían a los 60ms.

Y la otra mitad: `speechSynthesis` no vive en el documento, vive en el
navegador por origen, así que una voz lanzada desde un iframe que Moodle
descarga sigue sonando y no queda interfaz para callarla. Se suman
`pagehide` y `visibilitychange`.

### 6 · Mini práctica: letras, tres opciones, y un botón para seguir

Los tres eran pedidos del cliente y ahora son default. El botón de
"Continuar" **existía** desde antes pero era opt-in (`opts.nextLabel` +
`opts.onGoNext`) y ningún curso lo pasaba: al terminar, la única salida
visible era "Practicar de nuevo". Misma forma de falla de §7.17 — la pieza
estaba, el cable no. Las letras van con `aria-hidden`: el lector de
pantalla ya numera un grupo de radios solo.

`mini-practica.mjs` (NUEVO) las hace cumplir y tapa un hueco de cobertura
real: `scroll-audit` **nunca responde el cuestionario**, así que jamás
llega a la pantalla de resultado, que es el estado más alto. Verificado en
las dos direcciones: contra el `coto-quiz.js` anterior, rojo por las
letras y por el botón ausente; con el parche, verde.

### 7 · Y lo que ese test destapó: la práctica no entraba en el teléfono

⚠️ **Contra una decisión anterior del propio kit.** §7.17 (v1.9.71) vio
que en un teléfono acostado la tarjeta del quiz es más alta que el lienzo,
y su respuesta fue hacer **usable el scroll**: enunciado `position:sticky`
para que no se fuera de vista "al scrollear para llegar a las opciones".
Medido ahora a 844×390 —la orientación que el kit **pide**, porque en
vertical tapa todo con «Girá tu dispositivo»— eso nunca fue cierto: **no
hay un solo scrollport** arriba de `.d-q`, ni la página ni el `body`
scrollean, y el botón "Responder" quedaba en y=406 cuando la diapositiva
termina en y=340. O sea que el alumno **no podía responder**, y el
`sticky` era una regla muerta — exactamente el modo de falla contra el que
ese mismo comentario advertía, un nivel más arriba de donde miraba.

La regla del molde es que el contenido **entra**. Compactación a
`max-height:560px` de **solo el aire**: ni un tamaño de letra baja, así
que no se toca el contraste (§6.5) y las opciones quedan en 44px, justo el
mínimo de área táctil de las WCAG. Medido: la práctica pasa de **379px a
295px** en un lienzo de **296px**.

⚠️ Y una trampa de cascada en el camino: las primeras declaraciones no
hacían nada porque las reglas base de `.d-opt` y `.d-quiz-actions` vienen
**después** en el archivo, y un `@media` no agrega especificidad. El
bloque va al final de la hoja (§6.14 punto 3: no depender del orden).

Y midiéndolo apareció que el problema era más grande que el aire: a
844×390 había **tres reglas del kit que no caían juntas**.

1. No hay scroll — y no lo dice sólo el test nuevo: `clip-audit` y
   `scroll-audit` ya lo exigían, y estaban verdes nada más porque el curso
   generado no tenía una diapositiva de práctica. Los tres dan el MISMO
   número, que es la mejor confirmación de que el hallazgo es real.
2. La narración de cada diapositiva empieza por su nombre
   (`narracion-titulos`) — y como `textOf()` **excluye** el
   `<h2 data-slide-title>`, eso obliga a una línea de texto visible
   arriba, que es para lo que el generador emite su párrafo de arranque
   (§7.43).
3. La práctica pide 295px en un lienzo de 296.

Medido con el `<h2>` y UNA línea narrable arriba (26 + 26 = 52px, el
mínimo que la regla 2 obliga): la pregunta se pasaba **46px** a 844×390 y
**26px** a 932×430, y el resultado **94px**.

**Se cerró sin tocar una sola tipografía y sin aceptar scroll**, con dos
movidas:

- **La intro de la diapositiva de práctica se esconde en pantalla baja**
  (`.d-slide-quiz > h2, > p`). ⚠️ Con `display:none`, NO con el atributo
  `hidden`, y esa es toda la gracia: `textOf()` filtra el ATRIBUTO
  `[hidden]`, nunca el `display` computado (§7.21 F1), así que la intro
  **sigue narrándose completa** y `narracion-titulos` sigue en verde. Se
  saca de la PANTALLA, no de la VOZ — la misma costura de
  `data-narrate-skip`, en el sentido contrario. La marca `.d-slide-quiz` la
  pone `initMiniQuiz` y no un `:has()` en el CSS, para no depender del
  soporte de `:has()` en los iPad viejos del cliente.
- **La lista de repaso pasa a DOS COLUMNAS** en pantalla baja. Recortar
  aire dejaba 47px sin cerrar, y la salida no era letra más chica: era el
  ANCHO, que es lo que un teléfono acostado tiene de sobra. Con las tres
  preguntas erradas —el peor caso, y el que este estado produce— se pasa
  de tres filas a dos: una fila menos son ~70px. `grid` y no `flex-wrap`,
  así las dos fichas de una fila quedan del mismo alto sin pedirlo.

Estado final, medido: práctica **379 → 295px**, resultado **358 → ~286px**,
lienzo 296. Las opciones quedan en 44px, justo el mínimo de área táctil de
las WCAG, y el contraste no se toca (§6.5). `mini-practica`,
`scroll-audit`, `clip-audit` y `narracion-titulos`, los cuatro en verde.

### 8 · El recuadro de video y el play de la marca, a la capa del kit

Tres reglas que vivían en el `assets.css` **del curso** y no leen nada de
ese curso (§1): `.d-shot-hit--videobox` (tarjeta blanca con aire alrededor
del video), `.d-shot-hit-play--art` (el play con el PNG de la marca, que
apaga el círculo dibujado del kit para no dibujar dos veces el mismo
botón) y el arreglo de encuadre entre carátula y video. Con ellas sube
`img/reproductor-play.webp` (105×104, 714 bytes), y `new-course.mjs` ahora
copia `img/` del kit al curso: si no lo copiara, un curso que use esa
clase quedaría con un `<img>` roto y `markup-sanity` en rojo por un 404 —
otra vez la pieza y el cable.

### Lo que NO se tocó, y por qué

- **El comentario roto de `coto-media.css`.** El relevo lo reportó como
  hallazgo nuevo; el kit **ya lo tiene arreglado desde v1.9.95**. Lo que
  cazó `check-comentarios-css` es la copia del **curso publicado** de
  "Seguridad alimentaria", que sigue con el cierre de más comiéndose
  `.d-shot-hit--video{cursor:pointer}`. Vale avisarlo para ese paquete;
  en el kit no hay nada que hacer.
- **`overlays-colocados` en el curso modelo.** El relevo lo deja abierto y
  dice que el `layerchange` que pide ya está (§7.43). No se pudo reproducir
  sin ese curso; queda como trabajo de ese lado.

## 7.48 "Seguridad alimentaria" como modelo: lo que le faltaba al kit (kit-base v1.9.99)

El pedido: el curso quedó "bastante impecable" y va a ser el modelo de
los próximos; revisar qué le falta hoy al kit. Llegó el curso ENTERO
(no un relevo), así que se comparó código contra código, archivo por
archivo, en vez de leer los 107 ítems de su bitácora.

**Lo primero que mostró la comparación, y vale decirlo de frente: en la
mayoría de los archivos compartidos el que está atrás es el CURSO, no el
kit.** En `coto-ui`, `coto-cierre`, `coto-logros`, `coto-quiz`,
`narrador`, `motor-slides` y las seis hojas de CSS compartidas, todo lo
que difiere son arreglos de v1.9.95–98 que el curso no tiene — entre
ellos el chip de logros "7/6", el "máximo posible" con 189 de 199, las
letras a) b) c) de la práctica y el candado del rescate del reproductor
(el curso dice "Recuperando el video…" en cada apertura). Y el propio
curso lo reconoce en su §9.47: reimplementa a mano `initLogros`,
`initVideoGate`, `initPopupGate`, `initGateHints` e `initMiniQuiz`. Si
el curso se recompila con este kit, esas mejoras le llegan solas.

Lo que SÍ le faltaba al kit, todo medido y verificado en las dos
direcciones:

### 1 · El video del pop-up seguía sonando con el iPad bloqueado

El `visibilitychange` del kit vivía dentro de `initBgVideos` y pausaba
SU lista — los videos de fondo. El reproductor del pop-up quedaba
afuera: el mismo bug que ese handler vino a corregir, en el patrón de
al lado. El curso lo había subido a `initVideoSafetyNet`, que mira TODO
el documento. Verificado con reproducción real (ver punto 3): sin el
arreglo, un video sonando con la página oculta en PC y en iPad; con el
arreglo, ninguno.

### 2 · Regresión MÍA de v1.9.98: con carátula, tocar la imagen no pausaba

Al portar `montarControles()` saqué el guard de `controls` de
`initInlineCircleVideos` y dejé DOS handlers sobre el mismo clic: el
`alternar` de la barra propia y el toggle del patrón. Uno pausaba y el
otro volvía a arrancar. Medido: con el video reproduciendo, tocar la
imagen lo dejaba reproduciendo. El curso tenía el guard
(`poster && is-playing → return`). Ahora está, y lo protege el bloque O
de `reproductor-video`.

### 3 · `reproductor-video.mjs`: el test del curso reemplaza al del kit

El que escribí en v1.9.98 manejaba el `<video>` con `play()` y
`duration` SIMULADOS: comprobaba que el código LLAMA a `play()`. El del
curso (`check-reproductor-video`, el K40 que nunca llegó por relevo)
**fabrica un webm real con MediaRecorder** y lo sirve en lugar de los
.mp4 de 0 bytes, así que comprueba lo que ve el alumno: que el video se
mueve, que pausar no pierde el cuadro, que se recupera de un desalojo,
que cerrar suelta el archivo, que Esc hace lo mismo que la ✕, que la
barra de avance pide el segundo correcto, y ampliar **con el curso ya
en pantalla completa**, el caso exacto del reporte de iPad. Pasa entero
contra el kit, en PC y en iPad. Se le sumó lo que solo tenía el mío
(rótulos accesibles de toda la barra, `role="status"` del aviso) y el
bloque de la carátula del punto 2; y ahora inyecta el disparador si el
curso no tiene uno, en vez de reventar con un TypeError.

### 4 · `sinPiP()` no lo verificaba ningún test

El arreglo de iPad que costó dos vueltas —WebKit ignora
`disablepictureinpicture`— no tenía test en el kit. El del curso probaba
las dos mitades y se sumaron a `video-rescate.mjs`: entrar en PiP vuelve
a la ficha; entrar en PANTALLA COMPLETA no se toca (mismo evento, y esa
función la pidió el cliente). Verificado con una `sinPiP` rota que saca
de cualquier modo: rojo.

### 5 · El minijuego del kit cortaba la última devolución

*"Al tocar la última opción, la retroalimentación empieza pero se corta
porque aparece enseguida el pop-up «¡Encontraste las 6!»"*. El curso lo
había arreglado con `trasLaLocucion()`; el minijuego del kit tenía el
mismo bug. Medido con un motor de voz **asíncrono** (como el real):
devolución en t=8120ms, repaso en t=8821, y la devolución nunca llegaba
a su fin.

La causa: `hablando()` preguntaba "¿está hablando?" justo después de
pedir la última devolución, y `speechSynthesis.speak()` es asíncrono —en
ese instante `speaking` todavía es false—, así que el tope caía en
700ms. Ahora es `Narrador.alTerminar(fn, pausa)`, pública: escucha
`narracionfin` y además sondea el motor (desde los 500ms, pidiendo dos
lecturas seguidas en silencio, porque entre fragmentos hay un instante
en false que no es el final de nada), con un tope de 12s. Después del
arreglo: devolución completa en t=10774, repaso en t=11226. Lo protege
el punto 7 de `minijuego.mjs`, que con el minijuego viejo da rojo.

⚠️ El curso tenía 6000ms de tope en el código y "9s" en el comentario.
Se usó el tope que el kit ya había elegido (12s): 6s cortan una
devolución de dos renglones a velocidad normal.

### 6 · `.d-info-panel`: el kit lo nombraba y no lo definía

`motor-slides.js` lo daba como ejemplo de clase que "ya trae
`position:absolute`" y `narrador.js` lo documentaba con
`[data-narrate-last]`, pero ninguna hoja del kit lo tenía. El curso lo
usa en 7 diapositivas: la consigna ("Tocá el ícono para…") que se
reemplaza por el cartel de lo que reveló `initHotspots`. Sube a
`coto-shot-stage.css` sobre `--d-escala-lamina` —es el caso que originó
esa regla: 162px de contenido en una caja de 89— y `escala-lamina.mjs`
lo protege (en `rem`, rojo).

Y el curso escribía CUATRO veces a mano lo mismo: `onSelect` escondía la
consigna y `onClear` la volvía a mostrar. `initHotspots` ahora lo hace
solo (`opts.hint`, o la `.d-info-hint` del panel donde vive el cartel).
Medido: 16px en PC 1440×900 —no cambia nada en escritorio— y 9px en un
iPad vertical; la consigna se va al tocar y vuelve al soltar.

También suben `.d-shot-hit--circle.is-active` (en tablet el toque no
deja el mouse "encima") y `.d-shot-hit--pop-close`/`--pop-cta`: la ✕ y
el botón horneados en los pop-ups `.modal-card--art`, que con la zona
rectangular por defecto se teñían y enfocaban CUADRADOS.

### 7 · `initPrediccion()`: otra pieza sin cable, desde v1.8

`coto-base-addendum` §20 trae desde v1.8 el componente `.d-pred*` ("una
predicción antes de un video") y el kit nunca tuvo el JS ni el marcado
documentado. El curso se lo escribió con otros nombres y **chocó con el
`.d-pred-fb` del kit**: el padding y el radio de la caja se colaban en
su párrafo — el cliente lo reportó como "desfasado". Ahora es
`initPrediccion()` (coto-ui.js), sin configuración, sobre las clases que
el kit ya tenía; idempotente (llamarla dos veces no ata dos veces ni
narra doble), llamada desde el boot de la plantilla, y con test propio
(`prediccion.mjs`, el 50º).

### 8 · `data-entrada`: las diapositivas genéricas no entran muertas

Pedido del cliente en el curso: introducción, objetivos, índice y
consejos son la misma captura plana en cualquier curso. El curso lo
ataba a una lista de ids escrita a mano; en el kit es declarativo —
`data-entrada` en la `<section>`— y `new-course.mjs` lo pone en las
genéricas que emite. `initEntradaGenerica()` lo re-dispara en cada
`slidechange` (una animación CSS pura corre una sola vez). Respeta
`prefers-reduced-motion`. ⚠️ Cambia de aspecto: un curso nuevo tiene
esas dos diapositivas animadas; se saca borrando el atributo.

### Lo que NO subió, y por qué

- **El repaso rápido v2, el progreso por objetivos, el minijuego con
  vidas/pista/remediación**: ya estaban en el kit (el curso los tiene
  copiados en su `assets.css` y su `curso.js`). El minijuego del kit
  además le pasa `errores` al curso, así que el **bonus por precisión**
  del curso se arma del lado del curso, que es donde va la economía.
- **`initRenarrarTrasIntro`**: es un workaround del curso para la
  locución que cortaba el `data-intro-popup`, que el kit resolvió en
  v1.9.84 (`introPendiente`, coto-player.js). Al recompilarse, el curso
  debería sacarlo.
- **Los tests "de contenido"** (logro del video, puntos del minijuego,
  rebalanceo del puntaje, las dos rotaciones, el repaso como pop-up):
  el propio curso los declara específicos, y lo genérico que protegen ya
  lo cubren `minijuego`, `arrastre-pasos`, `popover-exclusivo` y
  `puntaje-maximo`.
- **`pulido.css` y `diapositivas.css`**: se declaran de este curso y lo
  son (topología de su mapa, sus colores, su cierre).
- **El exportador GIFT** (`build-evaluacion-gift.mjs`): regla fija, no
  va al kit.

## 7.49 Segunda vuelta de cardio: locución, el ícono que mentía y la tira sobre la lámina (kit-base v1.9.100)

Relevo de "Prevención cardiovascular" rotulado "v1.9.99 → v1.9.100". Su
"v1.9.99" es la numeración de ese chat, NO la v1.9.99 del kit (§7.48,
alimentaria): copiar su `narrador.js` y su `coto-media.js` habría
borrado `alTerminar`, el candado del rescate, `dibujarPlay`,
`arrancoMudo`, el `webkitendfullscreen` y parte de `montarControles`.
Se portó hunk por hunk. Otra vez: un número de versión no identifica un
archivo.

### 1 · Locución (narrador.js + coto-player.js)

- **Velocidad por defecto 1.15 → 1.05.** Pedido del cliente. Para un
  default, quedarse corto es más barato que pasarse: el que quiere ir
  rápido lo sube.
- **Los títulos de los pop-ups se narran.** `TEXT_SEL` no tenía ningún
  `h3`, así que `.modal-hd h3` —el título de TODO pop-up de contenido—
  no se decía nunca. Se suma `.modal-hd h3` (no `h3` pelado: hay `h3` de
  chrome que no son locución).
- **Los dos puntos cierran la apertura repetida.** `quitarAperturaRepetida`
  cortaba solo en `.!?`, así que "Últimos consejos: …" repetía el título.
- ⚠️ **Y lo que el relevo no vio, medido al verificar:** sumar el título
  del pop-up sin más hacía que un cuerpo que arranca repitiéndolo lo
  dijera dos veces — `textOf()` devolvía *"Un dato para tener en cuenta:
  Un dato para tener en cuenta: la presión…"*. El filtro de apertura
  repetida solo corría para `data-slide-title` con títulos narrados; ahora
  corre también para el título del pop-up. Un pop-up que no repite
  (*"¿Qué son las ENT? Son enfermedades…"*) queda intacto.
- **`Narrador.desbloquear()`**: Safari habilita la voz solo si el PRIMER
  `speak()` sale dentro del gesto, y el kit narra con 220ms de espera.
  Con una portada de video (que no narra nada) el gesto se gastaba y la
  diapositiva 2 quedaba muda. Se gasta el gesto en una utterance vacía y
  muda, una sola vez, como primera sentencia de `reparar()`. Medido: una
  sola locución con `volume:0` aunque haya dos gestos.

### 2 · El ícono de "Sonido" no puede contradecir al audio

El chip "Tocá para comenzar/escuchar" hacía `v.muted = false` a secas.
Con el curso silenciado desde el panel, tocarlo dejaba el video sonando
y el ícono tachado: dos dueños del mismo dato. Ahora el tap es un PEDIDO
de audio: coto-media.js emite `cotoaudiopedido` y coto-player.js —el
único que escribe la marca de mute— la levanta y redibuja.

`audio-estado.mjs` (nuevo) recorre ese camino. ⚠️ Tal como llegó, en un
curso sin portada `--bg-video` anotaba "no se pudo probar el tap" y daba
✓: contra un curso recién generado habría sido verde SIEMPRE, el mismo
verde por ausencia que su propio comentario denuncia. Ahora, si la
portada no es video de fondo, la vuelve una (reescribe el HTML servido),
llama a `initBgVideos()` y sirve un webm real. Verificado: rojo sin el
arreglo de coto-media, rojo sin el listener de coto-player (las dos
mitades hacen falta), verde con las dos.

⚠️ Hallazgo al pasar, sin arreglar en esta vuelta: **ningún** test de
video de fondo del kit inyecta uno (`video-tap-chip`,
`video-autoplay-ios`, `video-lienzo-tablet`, `narracion-video`…). Contra
un curso generado dicen todos "nada que revisar". `audio-estado` es el
primero que no; el patrón está ahí para los demás.

### 3 · El resumen del cierre, sin "aplanar"

`align-items:start` en `.d-cierre-recap-grid`: las columnas se estiraban
al alto de la más larga y el filete de cada una llegaba hasta abajo.

### 4 · La tira de repaso, colocable sobre una lámina (coto-repaso.css)

Cambia una decisión escrita: la cabecera de coto-repaso.css decía que
NINGUNA regla con `[data-place]` viajaba al kit. Con cardio son dos los
cursos que apoyan la tira sobre la lámina (NOA fue el primero), que es
lo que pide §4, y el traslado destapó dos trampas del propio kit:

1. `.d-repaso` declara `position: relative` y en el kit **no hay** una
   regla genérica `[data-place]{position:absolute}` —cada clase colocable
   trae la suya—. La tira colocada se quedaba en el flujo, 1122px abajo
   de la lámina. (El relevo lo explicaba como un empate de especificidad
   con una regla de coto-shot-stage.css que no existe; el arreglo es el
   mismo.) → `.d-repaso[data-place]{position:absolute}`.
2. El motor escribe `height` sobre lo colocado y la tira, que es flex en
   columna, se estiraba (174px de contenido en 320). →
   `.d-repaso-marco`: la banda declara el espacio, la tira mide lo suyo.

Y `.d-repaso-btns--col`, para opciones múltiples que son frases.

`repaso-tira.mjs` (nuevo). ⚠️ Mismo caso que `audio-estado`: llegó
diciendo "nada que revisar" sin tira en el curso. Ahora arma dos sobre
una lámina de 1440×720 —una colocada directa, otra en un marco— y
contesta mal a propósito (el estado más alto). Verificado: sin el arreglo
1 falla la tira directa (*"relative y no absolute"*, se sale 168px); sin
el marco falla la segunda; con los dos, verde.

### 5 · `clip-audit`: falso positivo dentro de `.sr-only`

`closest('.sr-only')` en vez de `classList.contains`. Verificado con una
lista dentro de un `.sr-only`: la versión vieja da 3 fallos (uno por
viewport, *"ul se sale 108px de .sr-only"*), la nueva ninguno.

## 7.50 Cardio contra el curso modelo, y el play de marca que el kit borraba (kit-base v1.9.101)

Relevo chico de "Prevención cardiovascular" ("v1.9.100 → v1.9.101"),
salido de poner los dos cursos lado a lado. Traía `coto-ui.js` y
`coto-media.css` "completos", pero eran copias de ese chat: pisarlos
habría borrado `initPrediccion` e `initEntradaGenerica` (§7.48) y vuelto
a meter `var(--cat, #1EAADC)` (§7.47). Se portó solo lo nuevo.

### 1 · El contador del índice, con la redacción del modelo

Medido: el kit decía `1 de 20 vistas`; "Seguridad alimentaria", `Viste 1
de 26 secciones`. Se adopta la del modelo, que dice de quién es el
progreso y qué cuenta.

### 2 · `.d-shot-hit-play--horneado` — el arte ya trae el play

Cuando la captura trae el botón de play DIBUJADO, el control se queda
(es el único que da teclado y nombre accesible: el wrapper `data-hit`
no tiene handlers) y se apaga su dibujo: transparente, cubriendo el
círculo entero. Medido: 256×256 sobre un círculo de 256×256.

### 3 · `.d-shot-hit--encuadre` — qué parte del cuadro se ve

`object-position: var(--encuadre, center)` para un video 16:9 en un
círculo, donde `cover` tira el 44% del ancho y recorta siempre por el
centro. Opt-in: sin `--encuadre` computa `50% 50%` como siempre; con
`--encuadre: 68% 40%` computa eso.

### 4 · ⚠️ Lo que el relevo no podía ver: `dibujarPlay()` borraba el play de marca

El kit de cardio no tiene `dibujarPlay()` (§7.43, dibuja el triángulo en
un `.d-shot-hit-play` sin ícono); el nuestro sí. Y solo preguntaba si
había un `<svg>`. MEDIDO en el kit:

- `--art` (§7.47, el PNG de la marca) llevaba un `<img>`, no un `<svg>`:
  `dibujarPlay` le reemplazaba el contenido y quedaba el **triángulo
  genérico en vez del ícono del cliente**. Regresión MÍA de v1.9.98:
  subí `--art` sin mirar esta función.
- `--horneado`, el modificador nuevo, recibía un triángulo dibujado
  encima del play del arte: el play doble que vino a sacar.

Ahora `dibujarPlay` no toca un botón con `<svg>` o `<img>`, ni uno
`--horneado`. Ningún test miraba esta función desde que existe; ahora la
protege el bloque P de `reproductor-video` (los tres casos: sin ícono
recibe triángulo, `--art` conserva su imagen, `--horneado` no recibe
nada). Verificado: con la versión vieja, rojo por `--art` y por
`--horneado`; con la nueva, verde.

## 7.51 Cada curso sabe de qué versión del kit es (kit-base v1.9.102)

Primer paso de la Fase 0 del plan para que el kit sea sostenible: que se
deje de copiar a ciegas. El problema que resuelve está medido en las
rondas anteriores: casi todos los relevos llegaron escritos contra un kit
más viejo; en cuatro, copiar los archivos "completos" habría borrado
arreglos; y el curso modelo tenía 38 archivos del kit distintos de los
del kit sin forma de saber cuáles estaban atrasados y cuáles traían un
arreglo propio (§7.48). Nada registraba de qué versión era cada copia.

### Las cuatro piezas

- **`tools/_kit-archivos.mjs`** — la ÚNICA lista de qué archivos de un
  curso son del kit (121 hoy). La usan el generador, el actualizador y el
  test, así no pueden discrepar. `new-course.mjs` verifica al generar que
  todo lo de la lista haya llegado al curso: si alguien agrega una copia y
  no la anota (o al revés), falla en el momento.
- **`kit-version.json`** — lo escribe `new-course.mjs` en cada curso: la
  versión y una huella (sha256 corto) de cada archivo del kit.
- **`tools/actualizar-kit.mjs`** (`npm run actualizar-kit -- <curso>`) —
  se corre desde el kit NUEVO. Por defecto solo muestra el plan: igual, a
  actualizar, nuevo, quitado del kit, o EDITADO A MANO. Un editado a mano
  frena todo salvo `--forzar`, porque suele ser un arreglo que tiene que
  subir (§0.1). Con `--aplicar` respalda en `.kit-anterior/<fecha>-v<x>/`
  todo lo que reemplaza o saca, y reescribe `kit-version.json`. Además
  avisa qué funciones llama la plantilla de `curso.js` en su arranque que
  el `curso.js` del curso no llama (no lo toca: es del curso).
- **`tests/kit-intacto.mjs`** — pide cada archivo registrado AL CURSO
  SERVIDO y compara la huella. Rojo si alguno se editó, o si el curso no
  tiene registro.

### Verificado

- Curso recién generado → "sin cambios" en los 121.
- Kit simulado v+1 con un archivo cambiado, uno nuevo y uno eliminado, y
  un archivo del kit editado a mano en el curso → el plan lista las cuatro
  cosas; `--aplicar` sin `--forzar` no toca nada (exit 1); con `--forzar`
  aplica, el arreglo manual queda en el respaldo, y una segunda pasada da
  todo igual.
- "Seguridad alimentaria" real (sin registro) → 31 iguales, 53 nuevos, 38
  distintos — los mismos de la auditoría a mano de §7.48 — y la lista de
  funciones que su arranque no llama: `initPrediccion`,
  `initEntradaGenerica`, `initLogros`, `initIndexJumps`, `initStatPopups`.
  Lo que en §7.48 llevó horas de comparar archivos, ahora es un comando.
- `kit-intacto`: verde en un curso recién generado; rojo con `js/fx.js`
  tocado; verde otra vez después de actualizar.
- `build-zip.py` excluye `.kit-anterior/`: el respaldo no viaja al LMS.

### Dos cosas que aparecieron al hacerlo

- `tools/__pycache__/*.pyc` (lo deja Python al correr `build-zip.py`) se
  colaba en la lista del kit y **en la rama de git**. Se excluye en la
  lista, en la copia del generador y en `.gitignore`.
- El arnés de pruebas del kit ahora se pone al día con `actualizar-kit
  --aplicar --forzar` en vez de copiar archivos: cada corrida de la suite
  ejercita también el actualizador.

## 7.52 El play de la marca que reacciona, y el tamaño del pop-up que nadie puede pisar (kit-base v1.9.103)

Relevo de "Prevención cardiovascular" (zip `kitbase-v1.9.102-parche`).
Portado por partes, no copiando archivos: el relevo estaba escrito
contra el kit de ese curso.

### Qué entró

- **`.d-shot-hit-play--marca`** (`coto-media.css`): el play de la marca
  calzado sobre el que viene dibujado en el .webp de la tarjeta. Lo que
  había hecho fracasar el intento anterior era buscar UN valor para todas
  las tarjetas; con tres variables por tarjeta (`--play`, `--play-x`,
  `--play-y`, en % del hitbox) calza. En reposo es el mismo archivo en el
  mismo lugar; el hover se dispara desde toda la zona y se dibuja en el
  play (`scale: 1.12` + sombra). Se escribe con `translate`/`scale` y no
  con `transform`, porque `.is-playing` retira el play con
  `transform: scale(.8)` y el centrado se perdería. `dibujarPlay()` no lo
  toca porque trae `<img>` (el guard de §7.50).
- **`--horneado` queda OBSOLETO, no borrado.** El relevo decía que se
  había ido, pero su propio CSS todavía traía la regla. Un curso que lo
  use no tiene que romperse al actualizar el kit. Para cursos nuevos se
  usa `--marca`.
- **El ESTÁNDAR del pop-up de video** tiene su bloque con título arriba
  de `.modal-card--video`. La fórmula no cambió; lo que faltaba era que
  algo impidiera pisarla (las hojas del curso cargan después y ganan).
  Medido en el kit (el relevo traía números de otro curso, y su tabla
  decía 326px para el teléfono parado mientras un comentario decía 352):

  | viewport | ancho | % | alto del video |
  |---|---|---|---|
  | 1600×900 | 1040 | 65 | 585 |
  | 1366×768 | 1040 | 76 | 585 |
  | 1080×810 | 902 | 84 | 508 |
  | 810×1080 | 677 | 84 | 381 |
  | 844×390 | 495 | 59 | 278 |
  | 390×844 | 326 | 84 | 183 |

- **`tests/popup-video-medida.mjs`** (nuevo, 54 tests). Revisa la CAUSA
  (quién declara el `width`), no recalcula la fórmula en JS: `--d-arte-h`
  no vive en `:root` y `94vw` no es `innerWidth × .94`. Recorre el CSSOM
  mirando cada regla PRIMERO y bajando a `cssRules` después: con CSS
  anidado, una regla común también tiene `cssRules` (vacía pero truthy).
  Adaptado al kit: usa `report`/`requireUrl`, sirve los .mp4 vacíos, si
  el curso no tiene disparador inyecta uno (verde por ausencia, si no), y
  que no exista `#d-video-player` es rojo.
- **`reproductor-video.mjs`, bloque P**, cubre `--marca`: `<img>`
  conservada, sin triángulo, con nombre, transparente, y centro y
  diámetro donde dicen sus variables (±1 punto).
- **`check-globals.mjs`** toma la carpeta por argumento y
  **`check-raw-cat-colors.mjs`** mira el `css/` del cwd si existe.
  Corridos desde un curso sin argumentos, revisaban el KIT y decían ✓.
- **`check-raw-cat-colors`** no reporta un hex que va de fallback de
  `var(--x, #hex)`: un fallback no puede desfasarse del token, que es lo
  único que la regla persigue. Sigue agarrando un hex suelto. El kit
  igual no tiene fallbacks (§7.47): el comentario de `coto-media.css` lo
  dice así ahora.

### Lo que el relevo afirmaba y no era del kit

- "`check-raw-cat-colors` en rojo desde varias vueltas": en el kit
  canónico estaba verde (los fallbacks se sacaron en v1.9.98). Ese rojo
  y el `Player` publicado dos veces son señal de que el curso cardio
  tiene una copia vieja del kit: tiene que correr `actualizar-kit`.

### Verificado

- `popup-video-medida`: verde en el curso de prueba en los 6 viewports;
  rojo con `.modal-card--video{width:min(760px,100%)}` en
  `diapositivas.css` (en los 4 viewports donde el override cambia la
  medida); verde en un curso sin video, inyectando el disparador.
- `--marca` medido: reposo, disco de 47px centrado en 49,8 / 47,0 con
  `<img>` y sin svg; hover en un punto de la zona lejos del play → 52px
  (`scale 1.12`).
- Bloque P: verde con el kit; rojo con `left` del `--marca` fijado en
  50% (no respeta `--play-x`). **La primera versión dio verde con el CSS
  roto**: la zona inyectada medía 0×0, las posiciones daban `NaN` y toda
  comparación con `NaN` es falsa. Verde por ausencia otra vez, ahora en
  un número. Se le da tamaño a la zona y una medida no finita es rojo.
- `check-raw-cat-colors`: `.b{background:#1EAADC}` detectado,
  `.a{background:var(--cat, #1EAADC)}` no.

## 7.53 El Manual del molde: las reglas vigentes, separadas del diario (kit-base v1.9.104)

Fase 0, paso 2. Este archivo tiene más de 14.000 líneas en orden
cronológico, y la regla vigente de cada tema está en la ÚLTIMA sección
que lo tocó, que no siempre es la que uno encuentra primero. Medido al
armar el manual: el checklist de §7 todavía decía "JS (17)", "CSS (13)"
y "23 tests" (hoy 18, 15 y 54), y el prompt de arranque mandaba a
correr `npm test` "los 17".

### Qué es

**`MANUAL-DEL-MOLDE.md`**: ~310 líneas, once secciones por tema (las
siete reglas que no se discuten, arranque, PDF → diapositivas, qué ya
existe para `curso.js`, diseño y CSS, video, locución, mobile, relevo al
kit, entrega y mantenimiento del kit). Cada regla lleva la sección de
este diario que la explica.

- **Manda el manual.** Si una sección vieja de acá dice otra cosa, es
  historia. El manual se REESCRIBE cuando una regla cambia; este diario
  solo se agrega.
- **Viaja con cada curso**: lo copia `new-course.mjs`, está en
  `_kit-archivos.mjs` (así `actualizar-kit` lo lleva a los cursos que
  ya existen, verificado: aparece como "nuevo en el kit") y
  `build-zip.py` lo deja fuera del zip del LMS, igual que el prompt.
  Este diario, en cambio, no viaja con el curso: sin el manual, el chat
  que retoma una carpeta no tenía las reglas a mano.
- **`PROMPT-CURSO-NUEVO.md`** lo pone primero en la lista de lectura.

### Cómo se armó

No se resumió de memoria. Cada regla salió de una sección de este
diario, se buscó la ÚLTIMA versión de esa regla, y se comprobó contra el
código lo que se pudo comprobar: la lista de categorías sale de
`coto-base.css`; los `init*` de la tabla de `curso.js`, de los que
publica `js/*.js`; `--cat-ink`/`--cat-wash`, `--d-arte-h`,
`--d-escala-lamina`, `data-overlay-stagger`, `Narrador.alTerminar` y
`addFixes` existen donde dice el manual. Las referencias § se
verificaron buscando cada frase en este archivo: cinco estaban mal en
el primer borrador (la de iOS apuntaba a §7.33 y es §7.37, por ejemplo)
y se corrigieron.

Un detalle que apareció al verificar: la regla "el índice no deja saltar
a lo no visto" de §7.3 #3 manda a escribir `a.disabled = !visto` en
`curso.js`. Hoy eso lo hace `initIndexJumps` si recibe `visited`; el
manual dice lo de hoy.

### `check-conteos`, dos afirmaciones más

- `PROMPT-CURSO-NUEVO.md`: el número de `npm test   # los N`. Decía 17
  con 54 tests y ningún patrón lo miraba.
- `MANUAL-DEL-MOLDE.md`: "Vigente para **kit-base vX**" contra
  `package.json`. Subir la versión obliga a pasar por el manual. Si ninguna
  regla cambió, se toca solo el número, pero alguien lo miró.

Verificadas las dos: con el prompt en "los 17" y el manual en v1.9.103,
`check-conteos` da rojo en las dos con la frase; restauradas, verde.

### Qué cambia en el mantenimiento

A la lista de §0.1 de lo que lleva cada cambio se suma una línea: **si
el cambio altera una regla, se actualiza el manual en la misma versión.**
Un manual que se queda atrás repite el problema que vino a resolver.

## 7.54 Los dos cursos modelo contra el kit, y el parche de la tira que no tapa el arte (kit-base v1.9.105)

Dos pedidos en la misma vuelta: auditar "Seguridad alimentaria" y
"Prevención cardiovascular" ("dos cursos modelos que supuestamente están
ok e iguales"), para usarlos de base del curso de prueba (Fase 0, paso
3); y un parche de cardio con dos herramientas.

### ¿Iguales? No.

- El zip de alimentaria es **byte a byte el mismo** que se auditó en
  §7.48. Nada nuevo ahí.
- Entre los dos, de los archivos del kit que tienen en común, **14 son
  distintos**. Cardio está mucho más cerca del kit actual (su
  `motor-slides.js`, `coto-base.css`, `coto-logros.js` y
  `coto-cierre.js` son idénticos a los de hoy); alimentaria es de antes
  de v1.9.99. Cardio numera a su manera: su "v1.9.99" es la v1.9.100
  del kit (§7.49).
- Cardio no trae `coto-piezas`, `coto-visor` ni `coto-simulador`
  porque su `index.html` no los carga: es el zip del LMS.

### ¿Tiene cardio algo que el kit no? Se miró SOLO el código

Comparando los archivos sin comentarios (casi todas las diferencias eran
comentarios redactados distinto), cardio tiene muy poco código propio en
archivos del kit. Revisado uno por uno:

- **`v._fuenteBg = fuenteDe(v)` — BUG DEL KIT, desde v1.9.98.** La
  línea que "recuerda la fuente al inicializar" nunca llegó al kit: el
  bloque K46 que se portó en v1.9.98 traía `soltar()` y `reenganchar()`
  pero no la asignación, así que las dos salían en su primera línea y
  la cura del video de fondo negro en iPad **no hizo nada durante seis
  versiones**. El comentario del propio kit decía "la fuente se recuerda
  al INICIALIZAR"; el código no. Lo encontró cardio, que tenía la línea.
  Nadie lo vio porque `video-fondo.mjs` da verde en un curso sin video
  de fondo, y el del arnés no tiene. **Test nuevo
  `video-fondo-soltar.mjs`**: si el curso no tiene video de fondo,
  convierte la segunda diapositiva en una y llama a `initBgVideos()`;
  verifica que la fuente quede guardada, suelta con la diapositiva
  inactiva, enganchada al entrar y suelta al salir. Rojo con el kit de
  v1.9.104 (los tres fallos), verde con la línea.
- **`transform: none` en `.d-shot-hit-play--marca:hover` — BUG DEL KIT,
  de v1.9.103.** `.d-shot-hit-play:hover` trae `transform: scale(1.06)`
  y se multiplica con el `scale: 1.12` de `--marca`. Medido en el kit:
  48px en reposo, 54 con el mouse en la zona, **57 con el mouse encima
  del play**. El cliente de cardio lo reportó como "doble aumento".
  En §7.52 se había verificado el hover solo "en la zona, lejos del
  play", que es justo el lugar donde no se ve. Arreglado y agregado al
  bloque P de `reproductor-video.mjs` (mismo tamaño en la zona y encima
  del play); rojo sin el arreglo (54 contra 57).
- `.d-repaso-marco--abajo`: cardio lo agregó al CSS del kit y no lo usa
  en ningún lado. **No sube**: ni un curso lo necesita.
- Los hex de fallback (`var(--cat, #1EAADC)`) y el corte en 899px son
  cardio atrasado: el kit los cambió a propósito (§7.47, §7.48).
- `--horneado`: cardio lo borró; el kit lo mantiene obsoleto (§7.52).

### La suite actual contra los dos, antes y después de `actualizar-kit`

| curso | tal cual (55 tests) | puesto al día (suite final, 56 tests) |
|---|---|---|
| Seguridad alimentaria | 10 con fallos | **4**, los cuatro del curso (ver abajo); antes de corregir los tests eran 7 |
| Prevención cardiovascular | 5 | **1**: su `curso.js` no llama a `initPrediccion` |
| curso del arnés | — | 56 de 56 |

**Tres de los rojos de alimentaria puesta al día eran de los TESTS, no
del curso ni del kit.** Cada uno se tropezaba con algo que el curso ya
tenía:

- `popup-video-medida` (subido en v1.9.103): hacía clic en el recuadro
  `[data-inline-video][data-video-popup]`, que no abre nada — el
  disparador es su botón de play — y medía la tarjeta CERRADA: "el video
  queda de 0px" en los seis viewports. Ahora toca el play, como el
  alumno, y si el pop-up no se abrió lo dice en vez de medir 0.
- `minijuego`: inyecta su propio tablero pero buscaba los botones en
  todo el documento, y contaba los 16 del minijuego real del curso en
  vez de sus 4. Ahora busca dentro de la sección inyectada.
- `overlays-colocados`: su grupo inyectado tomaba el layout de la
  diapositiva activa, que a esa altura era el cierre de alimentaria (un
  flex donde medía 0 de ancho). Ahora el grupo tiene tamaño propio.

Los tres, verificados en las dos direcciones: verdes en los tres cursos,
y rojos con su bug puesto (override de 760px; listener de `layerchange`
quitado). Regla que queda en `tools/tests/README.md` y en el manual: **un
test que inyecta marcado busca dentro de lo que inyectó y le da tamaño
propio.**

Los cuatro rojos que le quedan a alimentaria son del CURSO y son ciertos:
íconos del índice repetidos o reservados (`iconos-indice`), `curso.js`
sin `initPrediccion`, sin el panel de recursos del boilerplate, y tiras
de repaso de opción múltiple con el ✓ de verdadero/falso
(`repaso-tira`). **Para el curso de prueba, el modelo es cardio.**

### El parche: `bloque-no-tapa-arte.mjs` y `achicar-ilustracion.py`

De la vuelta de cardio en que la tira de repaso se ubicó cinco veces.

- **`bloque-no-tapa-arte.mjs`** (test 56): un bloque con
  `data-no-tapa-arte` no puede caer sobre el dibujo de la lámina, y se
  verifica contando píxeles del .webp dentro del rectángulo renderizado,
  con tolerancia cero. Tal como llegó daba verde sin medir en un curso
  sin bloques marcados (el del arnés): se le agregó un **autochequeo**
  que corre siempre, con una lámina dibujada en canvas y dos bloques (uno
  en el hueco que debe dar 0, otro encima del dibujo que debe
  detectarse). Rojo con el detector roto de las dos formas (no ve nada /
  lee mal el fondo). Adaptado a `report`/`requireUrl`. **Sobre las
  láminas reales de cardio** (en una copia, marcando su tira): 12
  mediciones, 0 píxeles — lo que dice el relevo — y con la tira subida
  al 45%, rojo en las 12.
- **`achicar-ilustracion.py`**: achica y reubica la ilustración horneada
  para hacerle lugar a un bloque. Probado con láminas sintéticas: dos
  láminas con el dibujo a distinta altura quedan en la misma franja
  (15–62%), la columna de texto intacta (3 píxeles de diferencia, ruido
  de recomprimir el WebP) y 0 píxeles de dibujo en la banda limpiada; una
  lámina con fondo ruidoso se RECHAZA sin tocarla (81% < 85%). Al
  subirlo: aviso de dependencias en vez de traceback (como
  `pdf-capa-texto.py`) y documentado que supone una lámina de dos
  columnas. Reescribe el arte del cliente: el manual lo pone como último
  recurso, después de pedirle la lámina al diseñador.

## 7.55 El curso de prueba: cada versión del kit contra un curso real (kit-base v1.9.106)

Fase 0, paso 3. Hasta acá la suite se corría contra UN curso: el del
arnés, generado por `new-course.mjs` y "enriquecido" a mano. Es
sintético, y por eso los tests que no encuentran la pieza tienen que
inyectarla. Funciona, pero los dos bugs de §7.54 muestran el límite: el
kit pasó seis versiones con el video de fondo roto porque el arnés no
tiene video de fondo, y lo encontró un curso real.

### Qué es

**`curso-prueba/`**, en la raíz del kit: los archivos PROPIOS de
"Prevención cardiovascular" (45: `index.html`, sus tres CSS, `curso.js`,
`imsmanifest.xml`, `img/` y los videos placeholder de 0 bytes), y
ninguno del kit. **`curso-prueba/probar.sh`** arma cada vez una copia
fresca, le aplica el kit ACTUAL con `actualizar-kit.mjs --aplicar`, la
sirve y corre la suite entera. Así:

- se prueba siempre el kit de hoy, sin copias del kit que envejezcan
  dentro de la carpeta (y sin duplicar 2 MB en la rama);
- el actualizador queda ejercitado en cada corrida, sobre un curso sin
  registro previo;
- vive en la rama `claude/kit-base` y **no viaja en el zip**
  (`build-zip.py` excluye `curso-prueba/`; `new-course.mjs` y
  `_kit-archivos.mjs` no la ven porque solo miran sus carpetas).

Por qué cardio y no alimentaria: §7.54 — puesta al día, cardio pasa
55 de 56 y alimentaria tiene cuatro pendientes propios.

**Un único cambio respecto del curso entregado:** `curso.js` llama a
`initPrediccion()`, que la plantilla llama en su arranque y el curso
—anterior a esa pieza— no. Queda marcado en el propio `curso.js`.

### Lo que mostró en su primera corrida

- **`puntaje-maximo` en rojo por un 416** de `video/tabaquismo.mp4`: el
  servidor contesta 416 cuando se pide un rango de un archivo vacío, o
  sea un placeholder de 0 bytes — lo que el kit manda a dejar mientras
  faltan los videos (§3.9). Salía rojo o verde según si el navegador
  llegaba a pedir ese video. `_shared.mjs` ahora ignora el 416 de un
  archivo de video, con el mismo criterio que el `favicon.ico`.
  Verificado: con el placeholder, verde; con el archivo borrado (404),
  rojo con la URL.
- **La prueba de que sirve:** con la línea de `_fuenteBg` quitada otra
  vez del kit, `video-fondo-soltar` da rojo en el curso de prueba sobre
  su diapositiva REAL "unidad1", sin inyectar nada. Restaurada, verde.

### Regla

Cada versión se entrega con las DOS suites en verde: la del arnés y
`sh curso-prueba/probar.sh`. Está en §0.1 y en el manual.

## 7.56 Los tres cursos hechos con kits anteriores, cinco tests que acusaban al curso, y el registro de la mini práctica (kit-base v1.9.107)

Fase 0, paso 4: auditar los cursos que ya estaban terminados con kits
viejos —"Pedidos de PLU set a Compras" (kit ~v1.9.81), "Seguridad de la
información" (~v1.9.71) y "Uso de Sucursales 3 - NOA" (~v1.9.67)— para
decidir qué hacer con cada uno. En la misma vuelta llegó un relevo de
"Prevención cardiovascular" con dos bugs del kit.

### ¿Tienen arreglos propios dentro del kit? No.

Comparando solo código (sin comentarios) y descartando toda línea que
aparezca en dos o más de los cinco cursos (eso es kit viejo, no edición
propia), quedaron pocas candidatas y las tres resultaron versiones viejas
del kit: el certificado imprimible de NOA (el kit lo sacó a propósito en
v1.9.64), las filas fijas del chrome en teléfono de PLU (pasaron a tokens
después) y vocabulario de locución (`plu`, `nfc`) que el kit ya tiene.
NOA pone su vocabulario donde corresponde (`addFixes` en su `curso.js`).

### El riesgo de actualizarlos es bajo, con UNA trampa

- Los tres tienen el MISMO `scorm-api.js` que el kit actual, y el estado
  que retoma el alumno lo escribe su `curso.js`, que `actualizar-kit` no
  toca: el formato del progreso guardado no cambia.
- **La trampa: NOA narra cada diapositiva DOS veces al actualizarlo.**
  Su `curso.js` (anterior a v1.9.71) tiene su propio `slidechange` →
  `speakSlide()`, y desde v1.9.71 `initPlayer()` también narra. Medido
  (`locucion-control`: dos locuciones encimadas al entrar); sacada esa
  línea, verde. **`actualizar-kit` ahora lo avisa**, con la línea, antes
  de aplicar. Heurística: busca `speakSlide(` en las 15 líneas siguientes
  a cada `addEventListener('slidechange'`, salvo que el curso ya pase
  `speakOnSlideChange: false`, y blanqueando antes los comentarios de
  bloque (la primera versión avisaba en "Seguridad alimentaria", que
  tiene `speakSlide()` dentro de un comentario que explica justamente por
  qué NO llamarla). Probado en los siete cursos: avisa solo en NOA.

### Cinco tests acusaban al CURSO por un defecto propio

Cada uno, verificado después en las dos direcciones (verde en el curso,
rojo con el bug del kit puesto):

- **`locucion-segundos` reventaba** con un TypeError en un header anterior
  a la barra en segundos (PLU, Seguridad, NOA) en vez de decirlo. Ahora
  reporta "el header no trae `#d-narr-time`".
- **`repaso-tira` inyectaba su tira de prueba "en la cuarta
  diapositiva"**, y en PLU la cuarta es un video de fondo: "la tira se sale
  1118px" de una tira que el curso ni tiene. Ahora elige una diapositiva
  común. Rojo en PLU con `es-la-correcta` quitado del kit.
- **`mini-practica` clickeaba respuestas invisibles** cuando la práctica
  vive en una capa que se habilita después (la parte 2 de la práctica de
  PLU). Ahora muestra la capa como lo hace el motor. Con eso mide lo que
  sí es real en PLU: cuatro opciones que no entran en un teléfono acostado
  y sin botón "Continuar".
- **`video-rescate` reventaba** (`defineProperty called on non-object`) en
  los cursos sin reproductor en pop-up, que es justo el caso que su propio
  comentario prometía revisar. Y una vez arreglado, acusaba "el <video>
  quedó con src": el motor engancha los `[data-popup-close]` al arrancar,
  y la ✕ del pop-up que inyecta el test llegaba después y no hacía nada.
  Ahora, si el clic no cerró, cierra por el motor. Rojo con el
  `removeAttribute('src')` del cierre quitado del kit.
- `video-fondo` y `minijuego` ya se habían corregido en §7.54/§7.55.

### Lo que queda en cada curso, puesto al día (todo del CURSO)

Suite de v1.9.107 sobre una copia de cada uno con `actualizar-kit`
aplicado. Ninguno de estos rojos es del kit.

**Pedidos de PLU set (6 de 57).** Sin `initPrediccion`; sin el panel de
recursos ni su botón; header anterior a la barra de locución en segundos;
íconos del índice repetidos; la mini práctica con 4 opciones (el molde son
3: no entra en teléfono acostado y queda sin "Continuar"); la actividad
"¿es un PLU set?" con botones fuera de pantalla en teléfono acostado. **Y
al actualizar, pasar su `onFinish` a `onResult`** (si no, pierde el
veredicto y el logro "Aprobado"; `actualizar-kit` lo avisa).
**En producción hoy le pega el bug de la mini práctica**: quien contesta
las cuatro y no pulsa "Ver resultado" queda con "Te falta el quiz final",
sin los puntos ni el logro.

**Seguridad de la información (11 de 57).** Sin `initPrediccion`; sin el
botón de recursos en el header; header anterior a la barra en segundos;
íconos del índice; sin el reproductor de video en pop-up del molde (no lo
usa: sin efecto para el alumno); tiras de repaso en el formato viejo (sin
colocar); los botones "1" y "2" de las tandas de "uso responsable" al
94–99% de la lámina, que con el tamaño de toque del kit actual se salen
por abajo; la barra superior desborda en iPad 10"; la flecha de "página
siguiente" del visor (convenio, contraseñas) cae en la franja que se
recorta en tablet.

**Uso de Sucursales 3 - NOA (16 de 57).** **Al actualizar, sacar la
línea 1427 de `curso.js`** (`speakSlide(motor.current());`) o la
locución sale doble (`actualizar-kit` lo avisa). Además: sin
`initPrediccion`; sin panel de recursos ni botón; header viejo; íconos del
índice; sin reproductor en pop-up (no lo usa); puntos y logros con
implementación propia en vez de `initLogros` (funcionan, fuera del
estándar); glosario partido en dos listas; tiras de repaso de opción
múltiple con el ✓/✕ de verdadero/falso (con el CSS del kit actual,
SEÑALAN la correcta antes de contestar); la tira no escala con la lámina
en iPad vertical; el minijuego recortado en teléfono acostado; dos frases
pegadas en "objetivos"; la portada sin `poster` (negro mientras carga);
los botones de los videos de fondo sin texto visible.

**Seguridad alimentaria** (de §7.54): íconos del índice, sin
`initPrediccion`, sin panel de recursos, tiras de opción múltiple con el
✓ de verdadero/falso.

**Los cuatro usan video de fondo**, la pieza que más arreglos de iPad
recibió después de sus versiones (el último recién funciona desde
v1.9.105). Es el motivo más fuerte para actualizar si hay alumnos con
iPad.

### El relevo de cardio (su "v1.9.107"): portado por partes

El relevo traía `coto-quiz.js`, `coto-repaso.css`, `_shared.mjs`,
`build-zip.py` y `bloque-no-tapa-arte.mjs` COMPLETOS, escritos contra la
copia del kit de cardio. Copiarlos habría borrado: la marca
`d-slide-quiz` de v1.9.98, la explicación corregida de §7.48 en
`coto-repaso.css`, el filtro del 416 de §7.55, la exclusión de
`curso-prueba/` del zip y el autochequeo de §7.54. Se portó cada cambio:

- **`coto-quiz.js` — la práctica no se registraba (BUG DEL KIT, grave).**
  `setState({done})`, `onFirstFinish()` y `onFinish()` vivían en
  `finish()`, que corre solo al pulsar "Ver resultado". Quien contestaba
  las tres y seguía con el "Siguiente" del curso dejaba el cierre con
  candado, sin puntos ni logro. Ahora `registrar()` (idempotente) corre al
  contestar la última. Y al contestar se narra la devolución, que corta la
  lectura de la pregunta. **Test nuevo `mini-practica-registro.mjs`** (57
  tests): arma su propia práctica con espías, contesta las tres sin tocar
  "Ver resultado". Rojo con el kit anterior (0 registros, 0 devoluciones
  narradas), verde con el arreglo; pulsar "Ver resultado" después no
  registra de nuevo.
- **Y el arreglo, tal como vino, le rompía la pantalla de resultado a
  PLU.** "Pedidos de PLU set" usa `onFinish` para DECORAR la pantalla de
  resultado (un veredicto, y ahí mismo otorga el logro "Aprobado"), con un
  `setTimeout(0)`. Con `onFinish` corriendo al contestar la última, esa
  pantalla todavía no existe y su función sale sin hacer nada. MEDIDO en
  la copia de PLU puesta al día: sin veredicto. Cardio, en cambio, usa
  `onFinish` como "práctica completa" (desbloquea el cierre). Los dos
  significados son válidos, así que se separaron: `onFinish` = práctica
  completa (al contestar la última, una vez) y **`onResult` nuevo** = la
  pantalla de resultado ya dibujada (recibe la caja, corre cada vez que se
  ve). `actualizar-kit` avisa si el curso toca `.d-quiz-result` sin usar
  `onResult` (solo PLU, de los siete). Verificado en PLU: con su línea
  pasada a `onResult`, el veredicto vuelve y el aviso desaparece. El test
  cubre que `onResult` no corra antes y corra con la caja dibujada (rojo
  sin la llamada).
- **`coto-repaso.css`**: `--suelto` (la tira sale del lienzo a la franja
  libre en pantallas verticales) y **`--abajo`**, que en §7.54 había
  quedado afuera porque ningún curso lo usaba: ahora cardio usa los dos, y
  cardio es el curso de prueba.
- **`bloque-no-tapa-arte.mjs` mide en seis tamaños** (a 1600x900 daba
  verde con el bug del iPad vertical) y mapea contra `.d-shot-img`. Se
  conservó el autochequeo, y se corrigió que sin bloques marcados hacía
  `process.exit(0)` adentro del loop, salteando el autochequeo. Sobre el
  cardio nuevo: 72 mediciones en verde (teléfono apaisado como aviso, que
  es la excepción declarada); con `--suelto` quitado del kit, rojo en las
  12 de iPad vertical.
- **`_shared.mjs`**: `openCourse(url, ctx)` opcional, sin perder el 416.
- **`build-zip.py`** rechaza un zip con el `imsmanifest.xml` fuera de la
  raíz (el cliente no podía subir un paquete con una carpeta de más).
  Agregado al subirlo: el zip rechazado SE BORRA — quedaba en disco y se
  podía subir igual. Probado: carpeta contenedora → exit 1 y sin zip;
  carpeta del curso → zip bien; el propio kit (sin manifiesto) → pasa.

**`curso-prueba/` pasa a ser el cardio nuevo** (45 archivos propios, el
mismo único cambio: llamar a `initPrediccion()`).

## 7.57 Las animaciones del repaso, que faltaban desde v1.9.64 (kit-base v1.9.108)

Relevo de "Prevención cardiovascular" rotulado "v1.9.109" (numeración
de ese chat; "reemplaza al 108", que nunca llegó acá). De sus siete
archivos, cuatro eran los mismos de §7.56, ya portados, solo con el
número de versión cambiado en los comentarios. Lo nuevo:

- **Tres `@keyframes` que nunca estuvieron.** `coto-repaso.css` anima
  `d-repaso-in`, `d-repaso-shake` y `d-repaso-celebrate`, y ninguno estaba
  declarado en el kit: se quedaron en el `assets.css` de "Seguridad
  alimentaria" cuando la tira subió, en **v1.9.64** (§7.12). El relevo lo
  atribuía al traslado de §7.48 (v1.9.99); MEDIDO que es anterior: "Pedidos
  de PLU set" (~v1.9.81) y "Seguridad de la información" (~v1.9.71) tienen
  el mismo hueco. O sea que en todo curso salvo alimentaria la pregunta
  entraba sin animación, y errar o acertar no temblaba ni festejaba. Sin
  error, sin aviso: nadie lo reporta porque nadie sabe qué tendría que
  haber visto. Los tres se agregaron, idénticos a los de alimentaria.
- **`tools/check-keyframes.mjs`** (nuevo, en `npm run test:kit`): toda
  `animation` tiene que apuntar a un `@keyframes` que exista. Lee el CSS
  sin comentarios, salta las palabras del atajo (`ease`, `infinite`…) y
  los tiempos, y lista como aviso —no como fallo— los `@keyframes`
  declarados y sin usar. Verificado: rojo en el kit de v1.9.107 con los
  tres nombres, verde con el arreglo. Al subirla se le agregó leer el
  nombre del fallback de `var(--x, nombre …)`; `d-ken-burns` sigue
  listado como "sin usar", y es correcto: el kit lo trae apagado
  (`var(--d-ken-burns, none)`) y lo prende el curso. Pasada sobre los
  cursos: PLU y Seguridad tal cual, rojo con los tres; los tres puestos al
  día y el cardio nuevo, verdes.
- **`achicar-ilustracion.py`**: solo documentación — cómo calcular
  `--fin` y `--arriba` (el bloque mide los mismos píxeles en toda
  pantalla mientras la lámina se encoge, así que manda la pantalla
  apaisada más chica) y dos trampas medidas.
- **`curso-prueba/`** pasa al cardio de esta vuelta (cambiaron `curso.js`,
  `diapositivas.css` y seis láminas, achicadas con `achicar-ilustracion.py`). Ese cardio llegó **sin `kit-version.json`**: su
  chat nunca corrió `actualizar-kit`, así que su copia del kit sigue
  vieja (sin, por ejemplo, el arreglo del video de fondo de §7.54).

## 7.58 La forma de trabajar, escrita: retomar un curso y relevar al kit (kit-base v1.9.109)

Cierre de la Fase 0. Lo que más costó en las vueltas de §7.54–§7.57 no
fueron los bugs sino el circuito: relevos escritos contra copias viejas
del kit (el chat de cardio nunca había corrido `actualizar-kit`), y con
números de versión propios que chocaban con los del kit ("v1.9.107" y
"v1.9.109" de cardio contra la v1.9.107 y v1.9.108 de acá). Copiar sus
archivos completos habría borrado cinco arreglos en una sola vuelta.

Queda escrito así:

- **Cada curso se trabaja en su chat; este chat es solo del kit.**
- **Cada sesión sobre un curso existente empieza con `actualizar-kit`**
  y los pasos que avise. El texto para arrancar ese chat es
  **`PROMPT-RETOMAR-CURSO.md`** (nuevo): se adjuntan el zip del curso y el
  del kit más nuevo, sirve en el chat viejo o en uno nuevo. Viaja con cada
  curso (generador + `_kit-archivos.mjs`), queda fuera del zip del LMS, y
  `check-conteos` vigila la versión que dice.
- **Los relevos se rotulan por curso y fecha**, dicen de qué versión del
  kit partieron (`kit-version.json`), y separan lo probado de lo supuesto.
  Las versiones las pone solo este chat. En `PROMPT-CURSO-NUEVO.md`, en el
  nuevo prompt y en el manual (§9).
- **En este chat**, cada relevo se porta por partes, con test en las dos
  direcciones, las dos suites en verde (arnés y `curso-prueba`), diario +
  manual + changelog, un commit en `claude/kit-base` y el zip de vuelta,
  que los cursos toman con `actualizar-kit`.

Verificado: el generador copia el prompt nuevo, `actualizar-kit` lo
ofrece como "nuevo en el kit" a un curso existente, `build-zip.py` lo deja
fuera del zip del LMS, y `check-conteos` da rojo con la versión cambiada.

## 7.59 Los tres pendientes del kit (kit-base v1.9.110)

### 1 · `video-fondo.mjs`: el chequeo del arranque en mudo no podía fallar

El punto 5 (con el autoplay CON SONIDO rechazado, el video tiene que
arrancar igual en mudo, §7.18 K10) tenía dos agujeros encimados:

- **Se salteaba siempre.** Miraba los .mp4 del curso, que en producción
  son placeholders de 0 bytes (`readyState` 0 → "el archivo no está",
  sin medir), y en un curso sin video de fondo el test terminaba sin
  hacer nada. El arnés no tiene video de fondo y el curso de prueba los
  tiene en placeholder: nunca se midió.
- **La política de autoplay no existía.** El test lanzaba Chromium con
  `--autoplay-policy=document-user-activation-required`; MEDIDO: en este
  Chromium un `play()` con sonido y sin gesto se ACEPTA. Con el reintento
  en mudo arrancado del kit, el test daba verde igual.

Ahora: sirve el webm real que fabrica `reproductor-video` en lugar de todo
.mp4, inyecta una diapositiva de video de fondo y llama a `initBgVideos()`
si el curso no tiene (los puntos 1-4, que son del marcado del curso, no
aplican en ese caso), y simula la política con un `play()` interceptado
que rechaza con `NotAllowedError` si el video no está mudo y no hubo
gesto. Verificado en los dos cursos: verde con el kit, ROJO con el
reintento en mudo quitado ("el video está cargado y NO se reproduce"),
en la diapositiva inyectada del arnés y en la portada real de cardio.

`video-autoplay-ios` (que ya simulaba el rechazo a mano) se saltea a
propósito los cursos sin video de fondo (decisión de v1.9.82); en el
curso de prueba sí mide, y con el reintento quitado da rojo. Queda así.

### 2 · `visual-regress.mjs`: un cambio de color de todo el curso pasaba

Con `filter: hue-rotate(90deg)` sobre todo el curso del arnés, la
herramienta daba verde: el cambio movía entre 0,40% y 0,85% de los
píxeles (las láminas son casi todo blanco y gris, y un gris rotado sigue
siendo gris) y el umbral era 1%. Bajarlo sin más daba falsas alarmas en
el curso de prueba (0,84% y 0,67% en corridas idénticas): eran los
AVISOS pasajeros ("Desbloqueaste ENT del glosario", "Logro: Unidad 2
completa"), que aparecen o no según el milisegundo de la captura. Ahora
se esconden avisos y confeti antes de capturar, y el umbral es 0,2%.
Medido en los dos cursos: tres corridas sin cambios en verde (ruido
máximo 0,09%), y con el tono rotado, rojo.

### 3 · Clases `.d-*` sin uso: no había restos

De las 314 clases `.d-*` del CSS del kit, 9 no aparecen ni en el kit ni
en el marcado o el CSS propio de los siete cursos (arnés, curso de
prueba y los cinco auditados). Las nueve están en
`coto-base-addendum-v1.8.css` y son piezas del CATÁLOGO, con su sección y
su marcado de ejemplo: `.d-hit-ring` (resaltar el ícono, §6.10.3),
`.d-ticks` (tildes de avance), `.d-hotspot-card` (cartel de una zona),
`.d-steps-body` (cuerpo de la barra de pasos) y `.d-instr-note` (nota del
pop-up de instrucciones, cuyo contrato sigue vigente). Que ningún curso
las haya usado no las vuelve restos. No se borra nada; si alguna vez se
quiere adelgazar el catálogo, esta es la lista.

## 7.60 Fase 1, primera parte: el curso como datos (kit-base v1.9.111)

### Qué es

Un curso puede describirse en DOS archivos en vez de un `index.html`
escrito a mano:

- **`curso.json`**: el CONTENIDO. Diapositivas (tipo, título, imagen o
  video, zonas tocables con sus coordenadas, requisitos para avanzar,
  locución), índice lateral, glosario y fichas (los pop-ups de contenido
  con título oscuro).
- **`marco.html`**: todo el resto del index (barra superior, botones
  flotantes, ventanas fijas, scripts) con huecos `<!--{{DIAPOSITIVAS}}-->`,
  `<!--{{INDICE}}-->`, `<!--{{GLOSARIO}}-->`, `<!--{{FICHAS}}-->` y
  `{{TOTAL}}`.

`tools/armar-curso.mjs <curso>` junta los dos y escribe el `index.html`.
`tools/extraer-curso.mjs <curso>` hace el camino inverso desde un curso
hecho a mano. El formato y el armado viven en `tools/curso-datos.mjs`:
son funciones puras que usa el armador en Node y el extractor dentro del
navegador. Es la base del editor visual (Fase 2): el editor no va a ser
más que una pantalla que edita `curso.json`.

Tipos de diapositiva modelados: `lamina` (captura con zonas encima) y
`video-fondo`. Tipos de zona: `popup`, `video` (abre el reproductor),
`video-circulo` (video en el círculo, con play de marca) y `boton`
(cualquier `.d-shot-hit` con sus `data-*`). Lo que el formato todavía no
modela viaja como `{ "tipo": "html" }` y se reproduce tal cual: es lo que
permite convertir un curso entero sin perder nada, y lo que cada versión
de la Fase 1 va a ir achicando.

### Cómo se sabe que no pierde nada

**El extractor verifica cada pieza antes de aceptarla.** Lee una zona,
una locución, una diapositiva, el índice, el glosario o una ficha, la
vuelve a armar con el MISMO código del armador y la compara con la
original (`huellaDom`: misma estructura, mismos atributos, mismo texto;
ignora comentarios, sangría, orden de atributos y de clases, espacios en
`style`, y "70.00" contra "70" en coordenadas). Si no da igual, la pieza
queda como `html`. Al final arma el index entero y lo compara con el
original; si no da igual, sale con error y no escribe nada.

Probado al revés con dos sabotajes al armador:
- perder la clase extra de las zonas `popup` → el extractor deja esas
  cuatro zonas de "¿Qué son las ENT?" como `html` y el curso sigue igual;
- no reemplazar `{{TOTAL}}` → el extractor se niega y no escribe nada.

### Cardio convertido

De "Prevención cardiovascular" pasaron a datos 20 piezas: 15 de las 20
diapositivas (con sus zonas y locución), el índice con sus objetivos, el
glosario (16 términos) y 6 fichas. Quedan como `html` cinco: tres piezas
propias de cardio (el cartel de las barras de "ent-americas", la torta de
"fallecimiento-ent" y las pestañas de "factores-riesgo") y dos que van en
la próxima versión ("evaluacion" y "cierre"). Index de 1.632 líneas →
`curso.json` de 880 y `marco.html` de 744 (el marco conserva sus
comentarios; los de las partes que pasaron a datos no viajan).

Medido sobre el cardio armado desde los datos, contra el original:
- `visual-regress`: las 20 diapositivas sin cambios, tres corridas; y con
  la imagen de "consejos" cambiada en `curso.json`, 45,72% → rojo;
- la suite entera: 57/57;
- extraer el index armado devuelve EXACTAMENTE el mismo `curso.json` y
  `marco.html`, byte a byte, dos vueltas seguidas.

### El curso de prueba ahora se guarda como datos

`curso-prueba/` ya no tiene `index.html`: guarda `curso.json` +
`marco.html`, y `probar.sh` arma el index en cada corrida. Antes de la
suite comprueba que extraer ese index devuelva los mismos dos archivos:
si el armador y el extractor dejan de ser inversos, corta ahí. El index
original de cardio queda en la historia de la rama (v1.9.110).

### Lo que acompaña

- **`actualizar-kit` avisa** si un curso con `curso.json` + `marco.html`
  tiene un `index.html` que no es el que sale de los datos: alguien lo
  editó a mano y ese cambio se pierde la próxima vez que se arme.
  Probado: sin aviso con el index recién armado; con un acento cambiado
  a mano en el index, avisa.
- **`build-zip.py`** deja afuera `curso.json` y `marco.html` en el zip de
  un curso: el LMS solo necesita el index armado.

### `visual-regress` daba falsas alarmas con la mini práctica

Al comparar el cardio armado apareció 1,19% de diferencia en
"evaluacion". No era el armado: el index ORIGINAL contra su propia
baseline daba lo mismo 2 de cada 5 corridas. `coto-quiz.js` baraja el
banco y las opciones con `Math.random()`, así que cada carga muestra
otras preguntas detrás de la ventana de "Antes de empezar". Ahora
`visual-regress` reemplaza `Math.random` por un generador de semilla fija
(mulberry32) antes de cargar la página. Con eso: 6 de 6 corridas en
verde con el original.

**Corrección a §7.59:** las "tres corridas sin cambios en verde" que se
contaron ahí para el curso de prueba fueron suerte: la práctica pudo
haber caído distinto en cualquiera de ellas.

### Lo que NO cambia todavía

Los cursos se siguen armando como siempre (`new-course.mjs` y el index
a mano) hasta que el formato cubra evaluación y cierre. Convertir un
curso existente con `extraer-curso.mjs` es opcional y seguro; nadie
está obligado a migrar.

## 7.61 Una sola voz a la vez, y el botón ▶/■ de la locución (kit-base v1.9.112)

Relevo de "Prevención cardiovascular" (zip `b8b1d11c`, rotulado por el
chat del curso como "parche v1.9.106 → v1.9.110"; esos números son del
chat del curso, no del kit). Reemplaza a los relevos 108 y 109: siete de
sus archivos son idénticos al 109 (`25dbc411`), ya portado en v1.9.108,
y no se tocaron.

### 1 · Una sola voz (`narrador.js`)

Regla del cliente: *"siempre hay que ver que haya 1 sola locución en
acción"*, en todo el curso. La coordinación iba en un solo sentido: los
patrones de `coto-media.js` cortan la locución al arrancar un video,
pero una locución que arrancaba no pausaba el video. Tres puertas:
abrir algo que se narra con un video sonando, el "Repetir" del panel
(habla por `seek()`, no por `speak()`), y un video que arranca por sus
controles NATIVOS (no pasa por ningún `silenciarLocucion()`).

Portado por partes:
- `callarVideos()`: pausa los videos AUDIBLES; se llama desde `speak()`
  (después del "¿hay texto?", así una diapositiva sin locución, como un
  video de fondo, no pausa nada) y desde `seek()`. Una locución en
  volumen 0 no pausa nada.
- Escucha `play` y `volumechange` en captura en todo el documento: un
  video que se vuelve audible corta la locución.
- `detener()` / `reproducir()` y `progreso().detenido`; `segActual()`
  deja la barra en el comienzo de la frase cortada.

**No se portó** lo que el `narrador.js` del relevo traía de una copia
vieja: le faltaba `alTerminar` (v1.9.99, lo usa el minijuego) y el
recorte del título repetido en pop-ups (v1.9.100). Copiarlo entero los
borraba.

Verificado que no pausa videos que no compiten: el pop-up del
reproductor está excluido de `initPopupNarration`, y los videos de fondo
arrancan en mudo.

### 2 · El botón ▶/■ (`coto-player.js`, `coto-player-chrome.css`, `header-boilerplate.html`)

Pedido: *"estaría bueno que el menú de la locución tenga un botón de
play y stop"*. Un botón redondo que alterna, a la izquierda de la barra.
Detener corta y deja la barra donde iba ("Locución detenida");
Reproducir sigue desde esa frase, o empieza de nuevo si había terminado;
con la locución apagada queda deshabilitado. Es opcional: un curso sin
`#d-narr-toggle` en su index queda como estaba (`actualizar-kit` no toca
el index, así que los cursos existentes lo ganan solo si se agrega el
marcado).

Probado en un curso recién generado (el arnés y el curso de prueba no
tienen el marcado nuevo): los cuatro estados de arriba, y con clic real
de mouse sobre el panel abierto.

**No se portó** el `@media (max-width: 899px)` del CSS del relevo: es
cardio atrasado, el kit lo cambió a propósito (§7.56).

### 3 · `tests/una-sola-voz.mjs` (nuevo, 58 tests)

Recorre el curso: arranca cada video que el alumno puede arrancar y
dispara cada cosa que se narra (pop-ups, etapas, "Repetir", el ▶ si
está), en los dos órdenes, con un muestreador cada 50ms. Vigila también
que los videos de fondo NO queden pausados al entrar.

Adaptado al portarlo:
- el webm con audio se fabrica al vuelo en `$TMPDIR` (como
  `reproductor-video`) en vez de viajar en el kit (327 KB a cada curso);
  no se portaron `media/prueba-con-audio.webm` ni `media/generar.mjs`;
- **no da verde por ausencia**: en un curso sin videos agrega un
  `<video>` con controles nativos a la primera diapositiva que se narra
  y mide ese par; y si no pudo probar ninguna combinación, falla;
- usa `report()`/`requireUrl()` de `_shared.mjs`.

Las dos direcciones:
| curso | kit arreglado | sin `callarVideos` ni la escucha de `play` |
|---|---|---|
| arnés (2 combinaciones) | verde | 1 fallo ("Repetir" con el video sonando) |
| cardio (26) | verde | 15 fallos |
| arnés sin videos (inyectado) | verde | 2 fallos (los dos órdenes con el play nativo) |

## 7.62 Fase 1, segunda parte: la mini práctica, los logros y las medallas como datos (kit-base v1.9.113)

### El canal: datos para `curso.js` dentro del index

Hasta acá `curso.json` describía MARCADO. Pero el contenido de una mini
práctica —sus preguntas, opciones, explicaciones— no está en el HTML:
estaba escrito dentro de `curso.js` (`QUIZ_BANK`), igual que el catálogo
de logros (`BADGES`) y los umbrales de medalla (`MEDALLAS`).

Ahora `curso.json` puede traer tres claves más —`practica` (`banco`,
`porIntento`, `mensajes.bien|racha|error`), `logros` y `medallas`— y el
armador las escribe en el index como
`<script type="application/json" id="d-curso-datos">`, en el hueco
`<!--{{DATOS}}-->` del marco (antes del primer script). El navegador no
lo ejecuta. `curso.js` los lee con **`datosDelCurso(clave, porDefecto)`**
(nuevo en `coto-ui.js`): sin el bloque o sin la clave devuelve
`porDefecto`, así un curso puede pasar a datos de a una pieza; un JSON
roto queda en consola en vez de tragarse.

Por qué un bloque dentro del index y no un `curso.json` que se baje con
`fetch`: un `fetch` de un archivo local no anda si el curso se abre
desde el disco, y el index ya es el único archivo que el armador
escribe. El `<` del JSON va escapado (`<`) para que un texto con
`</script>` no cierre el bloque.

Un marco anterior a v1.9.113 no tiene el hueco: sigue armando igual
mientras el curso no tenga datos; si los tiene, el armador lo pide. El
extractor deja el hueco siempre (y si el index ya trae el bloque, lo lee).

### El tipo `practica`

La diapositiva de la mini práctica pasa a ser un tipo:
`antetitulo`, `titulo` (visible, no `sr-only`), `bajada` (no se narra),
`aviso` (un elemento de HTML libre entre la bajada y las preguntas; cardio
pone ahí "esto no es la evaluación") y el `<div data-quiz>`, que arma el
kit. Las preguntas no van en la diapositiva: son `practica.banco`.

### Cardio

- "evaluacion" pasó de `html` a `practica`. Quedan como `html` las tres
  piezas propias (barras, torta, factores) y "cierre".
- Su `curso.js` ya no trae el banco (9 preguntas), los mensajes, los 4
  logros ni las 3 medallas: los lee de `curso.json`. Bajó de 1.375 a
  1.325 líneas, y lo que queda es lógica. Los arreglos se pasaron
  EVALUÁNDOLOS desde el código (no copiándolos a mano).

Verificado contra el cardio de v1.9.112 (banco dentro de `curso.js`):
- `visual-regress`: 20 diapositivas sin cambios, tres corridas;
- la práctica, con el azar fijo: las mismas tres preguntas en el mismo
  orden con las mismas opciones, las mismas devoluciones, el mismo
  resultado; 4 logros en el panel y el mismo contador;
- armar y extraer sigue siendo ida y vuelta exacta;
- al revés: cardio armado SIN `practica` → `mini-practica` da rojo ("la
  pregunta tiene 0 opciones"). Un banco que no llega no pasa callado.

### Lo que falta de la Fase 1

El cierre (con el resumen imprimible y los rangos de medalla, que hoy se
escriben a mano y repiten los umbrales de `medallas`), y después que
`new-course.mjs` arranque los cursos directamente como datos.

## 7.63 Fase 1, tercera parte: el cierre como datos (kit-base v1.9.114)

### Un tipo que vale para cinco cursos, no para uno

Antes de modelar el cierre se miró si era un patrón o una pieza de
cardio. Los cinco cursos auditados (cardio, alimentaria, PLU, NOA,
Seguridad de la información) tienen el MISMO esqueleto: la lámina final
(`data-cierre-step="shot"`, con su locución) y el resumen
(`data-cierre-step="summary"`) con medalla, rangos, números del alumno,
nota, los dos botones y un repaso del curso. Cambia el contenido de cada
parte, no la forma. Así que entra como tipo `cierre`:

`titulo`, `imagen`, `narracion`, `bloqueo` (el "🔒 Hacé la mini
práctica…"), `saludo` (el "¡Hola, …!"), `rotuloMedalla` (el "Medalla de"
envuelto en `data-medalla-lbl`), `rangos` + `rangosEtiqueta`, `numeros`
(`[{id, rotulo}]` de `.d-cert-stats`), `nota`, `imprimir` (el rótulo del
botón, si no es "Imprimir resumen 📄"), `repaso` (HTML libre: varía mucho
entre cursos, columnas, flujos de pasos) y `confeti`.

### Los rangos de medalla salen de `medallas`

"130 puntos o más · de 115 a 129 · menos de 115" repetía a mano los
umbrales de `medallas`: cambiar uno obligaba a acordarse del otro. Si el
cierre no trae `rangos`, se calculan (`rangosPorDefecto`) con ícono y
nombre de cada medalla. El extractor solo los guarda si NO coinciden con
el cálculo: PLU los cuenta en logros ("los 5 de 5 logros"), alimentaria
y NOA con otros textos. Probado: subir el umbral de plata a 120 en
`curso.json` cambia los dos rangos que dependen de él.

### El extractor contra los cuatro cursos que no son cardio

Corrido sobre los index de alimentaria, PLU, NOA y Seguridad de la
información (copias de la auditoría de v1.9.107): **en los cuatro, el
curso armado desde los datos da idéntico al original**. Lo que cambia es
cuánto modela:

| curso | piezas a datos | como HTML | cierre |
|---|---|---|---|
| Prevención cardiovascular | 22 | 3 (piezas propias) | `cierre` |
| Seguridad alimentaria | 16 | 28 | `cierre` (rangos propios) |
| Pedidos de PLU set | 13 | 6 | `cierre` (rangos propios) |
| Uso de Sucursales 3 - NOA | 9 | 22 | `cierre` (rangos propios) |
| Seguridad de la información | 2 | 22 | `html` |

Seguridad de la información queda casi entera como HTML por UN detalle:
sus imágenes llevan `loading="lazy"`. Es la próxima cosa a sumar, junto
con lo que este relevamiento muestra que se repite (la ilustración
colocada `img.d-ilustracion[data-place]`, variantes de zona). Esa tabla
es la medida de avance de la Fase 1 de acá en adelante.

### Cardio

"cierre" pasó de `html` a `cierre`; quedan como HTML solo sus tres
piezas propias. Verificado contra el cardio de v1.9.113: las 20
diapositivas sin cambios en `visual-regress` (dos corridas), ida y vuelta
exacta, y las dos suites en verde.

## 7.64 Fase 1: el formato crece con lo que los cursos repiten (kit-base v1.9.115)

### `extraer-curso.mjs --porque`

Para cada pieza que queda como HTML, el extractor dice por qué: "forma
no reconocida" (con la estructura que encontró) o la PRIMERA diferencia
entre la original y la que arma el formato. Corrido sobre los cinco
cursos, agrupado por causa, es la lista de trabajo de la Fase 1: se
suma al formato lo que se repite, no lo que tiene un curso solo.

### Lo que se sumó (todo medido en al menos dos cursos)

- **Atributos extra en la lámina**: `atributosShot` (lo que el curso le
  cuelga al `.d-shot`: `data-doc-slide`, `data-shot-swap`…) y
  `atributosImagen` (`loading="lazy"`, un `id`). Seguridad de la
  información tenía TODAS sus láminas con `loading="lazy"`.
- **Variantes del video de fondo**: `precarga` (`preload="auto"`, anterior
  a v1.9.99), `oculto: false` (sin `aria-hidden`), póster opcional,
  `atributosVideo`, y el botón de audio con rótulo o contenido propios
  (`atributosTap`, `contenidoTap`: marcado anterior a v1.9.83).
- **Zonas**: `datos` también en `popup` (NOA: `data-ficha-trigger`) y
  `adorno` (HTML después del texto: el tilde de "ya lo viste").
- **Índice**: el objetivo sin `diapo` (progreso contado por grupo,
  v1.9.98). Tres cursos quedaban con el índice entero como HTML por eso.
- **Fichas**: encabezado claro (`claro`), `claseModal`, `claseTarjeta`.
  Las ventanas del chrome del kit (índice, glosario, logros, recursos,
  reproductor) se excluyen por nombre: son del marco.

### Cobertura

| curso | diapositivas | zonas | índice | v1.9.114 → v1.9.115 |
|---|---|---|---|---|
| Prevención cardiovascular | 20/20 | 22/25 | sí | 19 → 20 diapositivas |
| Seguridad alimentaria | 21/26 | 6/22 | no | 17 → 21 |
| Pedidos de PLU set | 11/14 | 12/14 | sí | igual |
| Uso de Sucursales 3 - NOA | 11/12 | 10/16 | sí (antes no) | 7 → 11 |
| Seguridad de la información | 16/21 | 23/62 | sí (antes no) | 0 → 16 |

En los cinco, armar desde los datos sigue dando el mismo curso.

Lo que queda como HTML es, en su mayoría, pieza PROPIA de cada curso:
las piezas que se revelan de Seguridad de la información (28 de sus
zonas), los paneles de información y los repasos de alimentaria, los
minijuegos, las 10 ventanas con lámina de NOA (`modal-card--shot`, un
patrón de un solo curso). Esas no se modelan hasta que un segundo curso
las use.

### Cardio

La diapositiva de factores (que tiene `data-shot-swap` en el `.d-shot`)
pasa de `html` a `lamina`, con sus pestañas como zona `html`: cardio
queda con las 20 diapositivas en datos. El `curso.json` del curso de
prueba se actualizó con el extractor nuevo; el marco no cambió.

## 7.65 Cierre de la Fase 1: los cursos nacen como datos (kit-base v1.9.116)

### `new-course.mjs` arma el curso como `curso.json` + `marco.html`

Después de generar el index como siempre, lo pasa por
`extraer-curso.mjs` (que verifica que armar desde los datos dé el mismo
curso) y vuelve a escribir el index con `armar-curso.mjs`, así es
literalmente el archivo armado y `actualizar-kit` no lo toma por editado
a mano. Si el paso falla (por ejemplo, una máquina sin Chromium), el
curso queda con el index a mano de siempre y se avisa con la línea del
error. `--sin-datos` lo saltea a propósito. Probado las tres cosas: con
datos (7/7 diapositivas en datos, sin aviso de `actualizar-kit`), sin
Chromium (`CHROMIUM_PATH` inexistente → aviso y curso a mano) y con
`--sin-datos`.

Para que un curso recién generado no quede como HTML tal cual, el formato
suma el tipo **`texto`**: título VISIBLE y párrafos (más el confeti del
cierre provisorio), que es lo que arma el generador en cada diapositiva
antes de que tenga contenido real.

La plantilla de `curso.js` lee los logros con `datosDelCurso('logros', [])`
y el ejemplo de la práctica muestra `datosDelCurso('practica', {})`.

El prompt de curso nuevo y el manual dicen ahora: el contenido se
escribe en `curso.json`, y el index se arma.

### Bug del kit encontrado al correr la suite sobre un curso nuevo

Un curso recién generado daba ROJO en `reproductor-video`: "el
reproductor del pop-up no tiene barra propia: `montarControles()` no se
está llamando". También con `--sin-datos`, o sea que no era del formato:
la plantilla de `curso.js` traía `initVideoPlayer()` COMENTADO ("solo si
el curso tiene video"), pero el `#d-video-player` está en el chrome de
TODO curso. Un curso nuevo que sumaba su primer video quedaba con el
reproductor sin controles propios hasta que alguien se acordara. El
arnés no lo mostraba porque su script de armado (`enriquecer.py`) le
agrega esa llamada a mano: el verde del arnés escondía el hueco de la
plantilla. Es la falla de siempre: la pieza está y el cable no.

Arreglado en dos partes:
- la plantilla llama `initVideoPlayer({})` siempre;
- `initVideoPlayer` (coto-media.js) tolera una SEGUNDA llamada: no monta
  otra barra ni otro juego de escuchas, solo engancha los disparadores
  nuevos. Sin esto, con la plantilla llamándola y el test llamándola de
  nuevo al inyectar su disparador, quedaban dos barras y el aviso de
  "Recuperando el video…" se prendía en la que nadie mira (rojo en el
  punto M10 del test, medido). Con el arreglo: verde en el curso nuevo y
  en el arnés.

**Regla nueva para el kit:** la suite se corre también sobre un curso
RECIÉN GENERADO, no solo sobre el arnés (que está enriquecido a mano) y
el curso de prueba. Es la única forma de ver lo que la plantilla deja
sin cablear.

### Estado de la Fase 1

Cerrada: el formato cubre diapositivas de lámina, video de fondo,
práctica, cierre y texto; zonas, locución, índice, glosario, fichas,
práctica, logros y medallas; el extractor convierte los cinco cursos sin
perder nada; los cursos nuevos nacen como datos. Lo que queda como HTML
son piezas propias de un solo curso. Lo siguiente es la Fase 2: el
editor visual sobre `curso.json`.

## 7.66 Relevo de "Prevención cardiovascular", 2026-10-05: el primer curso real puesto al día y pasado a datos (kit-base v1.9.117)

El chat de cardio actualizó el curso a v1.9.116, lo pasó a datos (20 de
20 diapositivas) y mandó un relevo de seis puntos, cada uno con síntoma,
causa medida y cómo lo verificó. Se verificaron uno por uno contra el
kit antes de portar nada.

### R1 · "Retomá donde dejaste" no aparecía NUNCA — bug del kit, en todo curso

La plantilla de `curso.js` registra `slidechange → SCORM.setLocation()`
antes de crear el motor; el motor arranca en la portada y ese primer
evento escribe `portada` en `cmi.core.lesson_location`. Recién después
`initResume()` lee la ubicación… y encuentra la portada. **Reproducido en
el kit**, en un curso recién generado y en el arnés, con el test nuevo.

Arreglo en el kit (no en cada curso, como propuso el relevo):
`SCORM.init()` guarda la ubicación con la que el LMS ABRIÓ el curso
(`getLocationInicial()`), y `initResume()` lee esa. El parche local de
cardio (una bandera en su `curso.js`) puede quedar: no choca.

**Test nuevo `retomar.mjs` (59 tests):** un LMS SCORM 1.2 en memoria con
un alumno guardado en una diapositiva del medio; exige el cartel y que
"Continuar" lleve ahí. Rojo con el kit de v1.9.116 en los dos cursos
("escrituras de ubicación antes de mirar: …=portada"), verde con el
arreglo; `scorm-tracking` sigue verde. Nadie lo había visto porque
`scorm-tracking` verifica que la ubicación SE GUARDE, no que al reabrir
el cartel aparezca.

### R2 · El zip del LMS arrastraba 92 archivos de trabajo

`actualizar-kit` copia al curso todo lo del kit (lo necesita `npm test`),
y `build-zip.py` solo excluía los prompts, el manual y los boilerplates.
Medido en un curso nuevo: 139 entradas, 87 de `tools/`. Ahora, en el zip
de un CURSO (no del kit) quedan fuera `tools/`, `package.json`,
`package-lock.json`, `spec-motor-slides.md` y
`minijuego-boilerplate.html`: 50 entradas. El zip del kit no cambia.

### R3 · `check-manifest` y `kit-intacto` tiraban para lados opuestos

`actualizar-kit` agregaba los módulos nuevos del kit (coto-piezas,
coto-visor, coto-simulador, coto-gescom) sin declararlos en
`imsmanifest.xml`: `check-manifest` rojo; sacarlos, `kit-intacto` rojo.
**Reproducido** con el cardio de v1.9.110: con el `actualizar-kit`
anterior, rojo con exactamente los 7 del relevo. Ahora `actualizar-kit`
declara todo archivo DEL KIT de una carpeta servida que el manifiesto no
nombra, y quita los que el kit sacó (los propios del curso no se tocan):
83 archivos, los mismos a los que llegó a mano el chat de cardio, y una
segunda corrida no duplica nada. Se eligió declarar y no relajar
`kit-intacto`, porque la convención es que el manifiesto enumera todo.

### R4 · Pasar a datos borraba los comentarios — campo `notas`

Diapositivas, fichas y el índice tienen `notas`: el extractor junta los
comentarios de adentro de la pieza y los que tiene justo encima (salvo
los rótulos de una línea "N · título", que el armador escribe solo), y
el armador los vuelve a escribir al principio de la pieza. Medido en el
index de cardio de v1.9.110: 95 comentarios → 36 notas, 47 que ya vivían
en el marco y 12 rótulos. Ida y vuelta exacta. Lo que se pierde es la
POSICIÓN exacta adentro de la pieza (todas quedan arriba), no el texto.

### R5 · Los datos no viajaban en el zip del curso

`build-zip.py` dejaba fuera `curso.json` y `marco.html` (v1.9.111), y el
zip del LMS es "el zip del curso" que pide `PROMPT-RETOMAR-CURSO.md`: un
curso en datos volvía sin sus datos. Ahora viajan adentro (unos 100 KB
que el LMS ignora). El prompt de retomar lo dice.

### R6 · Tres piezas sin modelar (informativo)

Torta, cartel de barras y pestañas de `initShotSwap`. Quedan como HTML;
las pestañas son un patrón del kit, así que se modelan cuando un segundo
curso las use.

### El curso de prueba es ahora el cardio entregado

`curso-prueba/` pasa a ser el cardio que devolvió el chat (sus 45
archivos propios, sus `curso.json` y `marco.html`), con dos agregados
de este chat para que el curso de prueba siga ejercitando el formato:
las 36 notas recuperadas del index de v1.9.110 (mismos ids) y la
práctica, logros y medallas pasados de su `curso.js` a `curso.json`
(como en v1.9.113; el curso real todavía los tiene en su `curso.js`).

## 7.67 Relevo de "Seguridad alimentaria", 2026-10-06 (kit-base v1.9.118)

El chat del curso lo puso al día desde v1.9.117 (no tenía
`kit-version.json`), lo pasó a datos y mandó nueve puntos con evidencia,
separando lo probado de lo supuesto. Verificados contra el kit:

### R1 · `package-lock.json` en 1.9.94 → `kit-intacto` rojo en todo curso

Confirmado: el lock decía 1.9.94 en sus dos lugares desde hacía 23
versiones; `npm install` en un curso lo sincroniza con el `package.json`
y `kit-intacto` lo acusaba como editado. Arreglado, y **`check-conteos`
vigila ahora las dos versiones del lock** (rojo con "1.9.94", verde con
la versión real). Cada versión del kit sube también el lock.

### R2 · `repaso-tira` contaba los botones de la TIRA, no los de cada pregunta

Confirmado y probado en las dos direcciones. Una tira con dos preguntas
V/F tiene 4 botones y el test la tomaba por opción múltiple. Ahora se
mira POR PREGUNTA y TODAS las preguntas (el relevo advertía que con el
arreglo de una línea solo se miraba la primera). Alimentaria: rojo con
el test viejo, verde con el nuevo; una pregunta de opción múltiple
inyectada que marca la correcta con `true` bajo `--vf`: rojo.

**Corrección a la auditoría de NOA (§7.56):** "las tiras de opción
múltiple usan el ✓/✕ y señalan la correcta antes de contestar" salió de
este mismo bug: las tiras de NOA son V/F de dos botones. Era un falso
positivo. Lo que sí falla en NOA, y sigue marcado, es que al contestar
mal la tira no señala cuál era la correcta (su repaso es anterior).

### R8 · `build-zip` perdía los tests propios del curso

Confirmado: v1.9.117 excluía `tools/` entera, y ahí viven también los
tests que escribe cada curso, que `actualizar-kit` no repone. Ahora de
`tools/` sale solo lo que lista el `kit-version.json` del curso; lo
propio viaja, y `build-zip` lo lista ("van N archivo(s) propios").
Alimentaria: 12 tests y su exportador propio, adentro. Sin registro
(curso viejo), se excluye todo como antes. El zip del kit no cambia.

### R3 · El repaso del kit no tenía lo que el cliente pidió en alimentaria

Portado a `initRepasoRapido` (coto-ui.js), por partes y con opciones:
- cambiar de pregunta con las flechas CORTA la voz y narra SOLO la
  pregunta nueva (`textOf(item)`, 220 ms, misma diapositiva);
- `seenMal(id)` / `markMal(id, eligio)`: las respuestas erradas se
  guardan y se restauran marcando cuál eligió y cuál era la buena;
- `onAnswer(id, acerto, eligio)`: cada respuesta (xAPI, por ejemplo);
- al entrar, la primera pregunta SIN contestar;
- y restaurar ya no narra la devolución al cargar la página.
Test nuevo **`repaso-navegacion.mjs` (60 tests)**: arma su tira, simula
una respuesta errada de otra sesión y espía la locución. Seis fallos con
el kit anterior, verde con el nuevo.

### R4 · Los rótulos de sección escritos a mano

Si el rótulo que precede a una diapositiva no coincide con el que
escribiría el armador (`rotuloDe`, ahora compartido por los dos), el
extractor lo guarda como nota. Medido sobre el index original de
alimentaria: los 7 rótulos distintos quedan como notas; ida y vuelta
estable.

### R5 · El comentario de Recursos invitaba a un choque

`index-boilerplate.html`: si el curso tiene índice propio, migrarlo
entero a `initIndexJumps` antes de sumar Recursos; no llamarla solo para
ese botón.

### R6 · Repaso en `rem` sobre la lámina — MEDIDO: es a propósito

A 1600x900 la tira mide 16px de base y a 820x1180, 9px; los botones
quedan en 12px y sus márgenes en 13,6px. No es un descuido: los textos
de la tira tienen un piso en píxeles por legibilidad
(`clamp(.78rem, …)`, documentado en `coto-repaso.css`), y pasarlos a
`em` los llevaría a 7px en un iPad vertical. Los desbordes los vigilan
`bloque-no-tapa-arte` (seis tamaños) y `repaso-tira`. No se cambia.

### R7 · Rojo en la devolución de `initPrediccion`

Pregunta de diseño, consultada al cliente por el chat del curso. Sin
cambio hasta que conteste.

### R9 · Los 23 tests del curso

Recibidos. Los 11 que el curso borró los cubre el kit. De los 12 propios,
los candidatos a subir (hechos genéricos) para la próxima versión: el
glosario narra solo su intro; tocar un término desbloqueado navega y
cierra; ninguna diapositiva dice el título dos veces seguidas;
reintentar el minijuego no vuelve a premiar. La herramienta
`retomar-entre-versiones.mjs` del relevo (retomar entre la versión
vieja y la nueva de un curso, que hoy se hace a mano) también queda
para la próxima: hay que sacarle los ids de alimentaria.

## 7.68 Segundo relevo de "Prevención cardiovascular", 2026-10-06: lo que el curso resolvió solo, y la regla para que no vuelva a pasar (kit-base v1.9.119)

Después de entregar, el chat de cardio mandó un archivo con doce cosas
que había resuelto DENTRO del curso "porque creí que eran propias de
él". Entre ellas estaba el cierre trabado sin salida que el cliente
había reportado con foto. El chat no las ocultó: nadie le había pedido
separar lo propio de lo general, así que decidió solo. Lo verificado y
lo aplicado en esta versión:

### A1 · La práctica no trababa el avance → cierre con candado sin salida

Confirmado: la plantilla no gateaba la diapositiva de `[data-quiz]` y
`coto-quiz.js` no ofrecía `faltan()`. Se apretaba "Siguiente" sin
contestar y se llegaba al cierre con "🔒 Hacé la mini práctica…", el pie
en "Fin" y ninguna salida. **`initMiniQuiz` devuelve ahora un gate**
(`faltan(slideEl)` da `['practica']` en la diapositiva de la práctica
sin completar; se exige completarla, no acertar). Sin `[data-quiz]` o
con el banco vacío devuelve un gate que no traba, para que el
`canAdvance` no se caiga. Al registrar emite `gatechange`. La plantilla
lo suma a `canAdvance` y a `initGateHints`, y dice que con práctica no es
opcional. **Test nuevo `practica-gate.mjs` (61)**: el módulo con una
práctica propia (contesta mal a propósito), el recorrido del curso y los
`related` del banco. Dos direcciones: con el `coto-quiz.js` de v1.9.118,
3 fallos; el arnés con práctica sin gate, 1 fallo ("Siguiente" llevó de
"repaso" a "cierre"); con el gate cableado (`enriquecer.py`), verde.

### A5 · "Repasar en …" no hacía nada si el `related` era un pop-up

Confirmado: el ejemplo era `motor.gotoId(id)`. **`irARelacionado(id)`
es ahora el `goToRelated` por defecto** (y es global): si el id es una
diapositiva, va; si es un pop-up, va a la diapositiva que lo dispara
(`data-gate-popup`, `data-require-popups`, `data-popup-trigger`) y lo abre
a los 420 ms. `practica-gate` falla si un `related` no es ni diapositiva
ni pop-up, y si hay un pop-up con disparador prueba que llegue y lo abra.

### A8 · `_syncNav()` privado, usado desde 8 lugares

Seis eran del kit mismo (cierre, media, minijuego, player). **Nuevo
`motor.refrescarGate()`** y el evento **`gatechange`** en `document`:
cualquier módulo o curso avisa así que un gate cambió. Los módulos del
kit ya no llaman a `_syncNav()`.

### A9 · El margen seguro de tablet (12,22%) vivía solo en un test

**Publicado como `--d-margen-seguro` en `coto-shot-stage.css`.** El
número sale de la geometría (iPad Pro 12,9": stage 1366×904, lienzo de
1808, (1 − 1366/1808)/2), y `video-lienzo-tablet` ahora lo calcula y
exige que el publicado coincida, también en cursos sin video de fondo
(probado: 12.5% → rojo; sin la variable → rojo).

### A10 · El marco de Moodle es más ANCHO que el curso

Apartado nuevo en el README ("Requisitos de publicación"): ~2,9:1 contra
el techo de 2,38:1; alto mínimo `ancho / 2,38 + 120`; se cambia en
`scorm | frameheight` (sitio, 500 de fábrica) o con "ventana nueva". No
se sube el techo del CSS.

### A11 · `check-css-duplicates` y `check-globals` con la carpeta del curso

Reproducido: el primero se caía con `EISDIR`; el segundo daba 18 falsos
positivos. Los dos aceptan ahora la carpeta del curso y buscan solos
`css/` y `js/`.

### La regla nueva: todo lo que se resuelve en el curso va al relevo

El problema no era este chat: era que el proceso dejaba la decisión
"¿es del kit?" en el curso, que ve un solo curso. Desde v1.9.119:

- **Regla en los dos prompts y en el manual (§9):** todo lo que se
  resuelva en el curso va al relevo; decide el kit.
- **Sección "Relevo al kit" obligatoria** en el `README-CURSO.md` antes
  de entregar, aunque quede vacía.
- **`tools/revisar-curso.mjs <curso>`** la arma: lista lo propio del
  curso que puede ser del kit (uso de `motor._algo` con lo que hay en su
  lugar, números copiados de los tests o de variables publicadas,
  funciones que escuchan al motor, miden la pantalla o tocan el marcado
  del molde, `!important` sobre clases del kit, las clases del kit más
  reescritas). No falla nunca: es una lista para el relevo, no un test.
  Sobre cardio entregado marca los cuatro `_syncNav`, el 12.22,
  `initGates`, `acomodarTiras` y `syncQuizRunning`, que son justamente
  A2, A6 y A8–A9 del relevo; sobre un curso recién generado, nada.

### Lo que queda para v1.9.120

A2 (`acomodarTiras` / `--suelto`), A3 (`data-place` quitado), A4 (repaso
de una pregunta con gate), A6 (`.is-quiz-running` y la práctica en el
marco de Moodle), A7 (`introPopup`), A12 (comentarios que nombran
funciones que ya no existen), los candidatos de tests de R9 de §7.67 y
las decisiones B1–B3, que son del cliente.

Cardio y alimentaria no necesitan cambios ahora: cardio sigue con su
`faltaPractica` propio (equivalente) y sus `_syncNav` siguen andando. Se
limpian la próxima vez que se toquen.

## 7.69 Relevo de "Seguridad de la información", 2026-10-06: el primero con la regla nueva (kit-base v1.9.120)

El curso venía de v1.9.71 sin registro, se puso al día con v1.9.119, se
pasó a datos (19 piezas) y se entregó con su suite en 62/62. Es el primer
relevo escrito con la regla de §7.68 —todo lo que se resuelve va al
relevo, decide el kit— y se nota: quince hallazgos, cada uno con lo
probado separado de lo leído, la salida de `revisar-curso` y el inventario
completo de lo que cambió en el curso. Verificados contra el kit:

### A1 · El auto-avance de un video de fondo cerraba el panel abierto

Confirmado: `initBgVideos` llamaba `motor._advance(1)` al `ended` sin
mirar nada, y el motor cierra todo pop-up al navegar. Ahora el avance
queda pendiente mientras haya un pop-up abierto y se hace al cerrar el
último; si el alumno navegó por su cuenta, se descarta. Test nuevo
**`autoavance-panel.mjs`**: si ninguna diapositiva con video de fondo es
`[data-autoadvance]`, se lo pone antes del arranque. Rojo con el
`coto-media.js` de v1.9.119 (portada → introducción con el Índice
cerrado); verde ahora, y sin pop-up el auto-avance sigue igual.

### A2 · `puntaje-maximo` buscaba en todo el documento

Confirmado: el prefijo `[data-slide="x"] ` en una lista con comas acota
solo la primera alternativa. En "Seguridad alimentaria" el test viejo
tocaba **947** elementos y el nuevo 42; en SI medía 145 de un máximo real
de 200. Ahora busca con `slide.querySelectorAll(SEL)`.

### A3 · La devolución doble del repaso se veía doble

Confirmado: `.d-repaso-fb[hidden]{display:flex !important}` más
`.is-answered .d-repaso-fb{opacity:1}` mostraban la escondida. Regla
nueva con más especificidad. `repaso-navegacion` mide ahora una pregunta
con devolución doble (rojo antes, verde después).

### A4 · La barra superior no entraba en iPad con Recursos

Confirmado y medido de nuevo, táctil y mouse, con el nombre largo: 43px
afuera a 1024, 87 a 980, 107 a 960 y 18 a 820 (iPad 10" vertical). El
corte de 959 se había medido sin Recursos. Arreglo sin sacar etiquetas
(las pidió el cliente): relleno y espacios más chicos en 960–1194, el
nombre del curso con elipsis a 17vw en 960–1023, y el saludo a 9vw en
800–959. Medido: 0px de 800 a 1366 en tres cursos. `chrome-tactil` mide
ahora con Recursos y nombre largo, suma el iPad 10" vertical (820×1180) y
una ventana de 960 con mouse (rojo con el CSS de v1.9.119).

### A6 · Lo que `actualizar-kit` no avisaba

Avisa ahora (probado sobre la copia v1.9.71 de SI, sin falsos positivos
en los cursos al día): el pop-up `#d-video-player` que falta, las tiras
`d-repaso-btns` sin `--vf`/`--col`, y los tests del curso que `--forzar`
pisaría con el genérico. **Y de paso apareció un bug del kit**: el
ejemplo de tira de `index-boilerplate.html` seguía con `d-repaso-btns` a
secas, así que todo curso nuevo nacía sin ✓/✕. Corregido.

### A7 · `initPasosRepaso` (y `initSalidaRepaso`) tomaban solo la primera

Ahora toman todas, cada una contra su diapositiva, con la misma API.
`repaso-navegacion` arma dos listas (2 y 3 preguntas): con v1.9.119
salían 2 y 0 pasos.

### A10 · Archivos propios del curso fuera del manifiesto

`actualizar-kit` sigue sin tocar lo del curso, pero ahora lo avisa
(sobre la copia v1.9.71: 61 archivos sin declarar).

### A11 y A15 · El zip

`build-zip` excluye `verify-hitboxes-out/` y `visual-diff-out/`. Y A15
destapó algo más grande que lo relevado: **todos** los zips de
`build-zip` guardaban las entradas con permisos 0o600 (medido: 144 de 144
en el de v1.9.119), porque `writestr` con un nombre suelto los pone así.
Moodle los ignora al descomprimir; un servidor que los respete no podría
servir el curso. Ahora van en 644.

### A12 · Margen seguro vertical

Publicado como `--d-margen-seguro-v: 4.55%`: en un stage más ancho que
2:1 el lienzo llena y recorta arriba y abajo hasta 2,2:1, donde el
recorte es (1 − 2/2,2)/2. `video-lienzo-tablet` lo calcula, exige que
coincida y marca los `[data-hit]` que caen ahí (solo lo tocable: un
`[data-place]` es un contenedor y su borde no es contenido).

### A13 · Agrandar la caja de un control dibujado

Nota en el manual (§5): agrandarla hacia ADENTRO cuando el dibujo está
cerca del borde, no centrada.

### Cardio A2 · La tira suelta

`acomodarTirasSueltas()` (coto-ui.js) sube del `curso.js` de cardio: la
llama `initRepasoRapido` sola (`suelto: false` la apaga) y se recalcula
en `slidechange` y `resize`. Test nuevo **`tira-suelta.mjs`** (63): en
iPad vertical, con v1.9.119, 211px de scroll dentro de la banda; ahora
sale a la franja libre. En escritorio se queda sobre la lámina.

### Lo que no se toma (todavía)

- **A5, la tira en teléfono acostado** sobre una lámina que es solo
  decoración: el parche del curso funciona, pero es un caso de un curso.
  Si aparece en un segundo, se generaliza.
- **A8** (`aria-label` del grupo de ayuda) y **A9** (catálogo de íconos):
  anotados; sin cambio.
- **A14** (los rótulos de diapositiva que cambian al armar desde datos):
  conocido desde §7.67; el contenido no cambia.
- `reproductor-video` ya no revienta con un `TimeoutError`: falla con
  nombre y con lo juntado hasta ahí.

Sigue para v1.9.121 lo que queda de §7.68: A3 (`data-place` quitado), A4
(repaso de una pregunta con gate), A6 (práctica en el marco de Moodle),
A7 (`introPopup`), A12 (comentarios que nombran funciones inexistentes) y
las decisiones B1–B3 de cardio.

## 7.70 Lo que quedaba del relevo de cardio, y dos decisiones del cliente (kit-base v1.9.121)

### Decisiones (B1 y B2 de §7.68, tomadas por el cliente el 2026-10-06)

- **B1 · Sin scroll, nunca, tampoco la tira de repaso.** En teléfono
  apaisado el escenario mide ~170px y la tira ~213: no hay geometría. En
  vez de aceptar el scroll como excepción, la tira se vuelve un botón en
  su marco y se abre ENTERA en una capa (`.d-repaso-capa`, en el `<body>`
  porque `container-type: size` del `.d-stage` contiene todo `fixed`). Se
  cierra con "Listo", Escape, tocando afuera o al cambiar de diapositiva.
  Solo en teléfono (lado corto ≤ 480) y solo con `.d-repaso-marco`. Ya eran
  dos cursos (cardio B1 y SI A5). `tira-suelta` suma iPhone apaisado: con
  v1.9.120, 27px de scroll dentro del marco; ahora abre y vuelve.
- **B2 · El "Siguiente" con gate pendiente no se pone gris.** Se atenúa,
  tiembla y avisa (`initGateHints`): con `disabled` un lector de pantalla
  no dice por qué no reacciona. Queda escrito en el manual (§8).

### A3 · `place()` respeta un `data-place` quitado

El motor captura sus `hits` una vez y los sigue escribiendo desde el
ResizeObserver, el `load` y `remedir`. Ahora saltea el que ya no tiene
`data-place`/`data-hit` o salió del `.d-shot`. `tira-suelta` lo mide
(registra la lámina antes de soltar la tira, cambia el tamaño, se va y
vuelve): con v1.9.120, `left: 437.4px` reescrito en línea; ahora nada.
Los `!important` de `--suelto` quedan, ya sin ser imprescindibles.

### A6 · La práctica en el marco de Moodle (1655×690)

`mini-practica` suma ese tamaño: la pantalla de resultado se recortaba
11px en el arnés y 13 en cardio. Tramo nuevo en coto-quiz.css (≤ 760px de
alto) que recorta solo aire, y mientras se responde
(`.is-quiz-running`, lo pone ahora `initMiniQuiz`) saca la intro de la
pantalla, no de la voz. Eventos nuevos `quizstart` (`detail.reintento`) y
`quizretry`: cardio escuchaba clics en `[data-retry]` porque no había
otra forma.

### A7 · "Esto no es la evaluación"

`initMiniQuiz({ introPopup: 'id' })` pone `data-intro-popup` mientras la
práctica no esté hecha (el motor ya lo abre sin pisar la locución) y lo
saca al completarla; `[data-pracintro-go]` lo cierra. CSS de
`.d-aviso-practica` y `.d-pracintro` en coto-quiz.css, y marcado de ejemplo
en index-boilerplate.html. `practica-gate` mide clase, eventos y aviso
(rojo con v1.9.120 en los cuatro).

### A4 · Repaso que traba: `data-require-repaso`

`initRepasoRapido` devuelve un gate: en una diapositiva con
`data-require-repaso`, "Siguiente" espera a que se contesten sus
preguntas. Participar, no acertar; una errada de otra sesión cuenta.
Emite `gatechange` al contestar. Sin el atributo no traba nada.
`repaso-navegacion` lo mide (rojo con v1.9.120).

### A12 · `check-comentarios-funciones` (aviso, no test)

Lista los comentarios del CSS propio y de `curso.js` que nombran una
`función()` que no existe ni en el curso ni en el kit. Sobre cardio
entregado marca `initSlideGates()`, `countUpStat()` y
`mostrarResumenCierre()`; sobre los cursos al día, nada. Sale con 0: no
cuenta los `//` (código comentado de la plantilla), los comodines
(`init*Videos()`) ni las notas históricas ("acá había…", "se fue…"), que
nombran a propósito lo que ya no está —medido: con esas excepciones bajó
de 4 falsos positivos en un curso recién generado a 0—.

Con esto el relevo de cardio queda cerrado, salvo B3 (`.d-ent-pop`), que
espera a un segundo curso.

## 7.71 El relevo se vuelve una condición del zip, y el relevo de "Uso de Sucursales 3 - NOA", 2026-10-06 (kit-base v1.9.122)

### El problema que trajo el usuario

Los chats de curso devolvían solo el zip del curso. El relevo era, desde
§7.68, una sección obligatoria del `README-CURSO.md`… que viaja ADENTRO
de ese zip: quien recibía la entrega no la veía, y nada impedía entregar
sin escribirla. Una regla escrita que hay que acordarse de cumplir.

### Ahora es una condición de la herramienta

- **`build-zip.py` no arma el zip de un curso sin el relevo.** Si el
  `README-CURSO.md` no tiene "## Relevo al kit", o dice "pendiente", o
  tiene menos de 30 caracteres, sale con error y explica cómo armarlo.
  El zip del kit no cambia.
- **Con el relevo, arma DOS zips**: el del curso y, al lado,
  `RELEVO-AL-KIT_<curso>_<fecha>.zip` con el relevo (con encabezado:
  curso, fecha, versión del kit, zip que acompaña), la salida de
  `revisar-curso` y de `check-comentarios-funciones`, y los archivos
  PROPIOS del curso (`js/`, `css/`, `tools/` que no lista
  `kit-version.json`, más `curso.json`, `marco.html`, `README-CURSO.md`,
  `kit-version.json` e `imsmanifest.xml`). Termina diciendo "ENTREGAR LOS
  DOS ZIPS".
- **`new-course` crea la sección "pendiente"** y **`actualizar-kit` se la
  agrega** a un curso que viene de antes, con aviso.
- Los dos prompts y el manual (§9, §10) dicen que la entrega son dos zips
  y que el mensaje final los nombra.
Probado sobre un curso recién generado: con "pendiente", exit 1 y ningún
zip; con la sección escrita, los dos zips (12 entradas en el del relevo,
la sección cortada en el siguiente título); sobre el kit, igual que antes.

### Relevo de NOA (partió de v1.9.56 sin registro → v1.9.120)

El relevo llegó con lo probado separado de lo supuesto. Verificado:

- **A · `narracion-completa` y "iPad".** Confirmado: una minúscula y una
  mayúscula juntas contaban como dos frases pegadas. Ahora hacen falta dos
  minúsculas antes ("cursoLa" sí, "iPad", "iPhone", "eCommerce" no).
- **B · `reproductor-video` con varias barras.** Confirmado: los
  `.d-vp-*` de la batería no estaban acotados al reproductor del pop-up
  (NOA: 11 barras → strict mode violation), y M3 cliqueaba con la barra
  auto-oculta. Acotados a `[data-popup="video-player"]` y `despertar()`
  antes de cada clic de M3/M4.
- **C · Los videos de ficha retenían el archivo, por el kit.**
  `initPopupVideos` dejaba el `src` puesto en todos. Ahora lo mueve a
  `data-src` al iniciar, lo repone al abrir SU ficha y lo saca al cerrarla
  (`soltarAlCerrar: false` lo apaga). La trampa de NOA queda escrita: un
  video sin fuente da `networkState 3` y `videoUsable()` lo toma por roto;
  para exigir verlo, `initVideoGate`, que usa su sonda. Bloque nuevo en
  `reproductor-video` (tres fichas de prueba): con v1.9.121, 3 retenían
  con todo cerrado; ahora 0, 1 al abrir, 0 al cerrar.
- **D · `rotularTap` con ícono propio.** Confirmado: con svg y sin span
  quedaba sin texto. Ahora suma el `<span>`. `video-tap-chip` pone un
  ícono propio al botón de la portada antes del arranque (rojo con
  v1.9.121 en alimentaria: sin texto y chip "").
- **E · El aviso de girar sin salida.** `actualizar-kit` avisa si hay
  `.d-rotate-notice` sin `data-rotate-seguir` (sí en la copia vieja de SI,
  no en los cursos al día).
- **F · `minijuego-landscape` salteaba un minijuego sin `data-mj-start`.**
  Ahora falla diciendo qué agregar (verificado con una copia del arnés:
  el test viejo daba "no tiene minijuego", verde).
- **G · Candado del repaso.** `initRepasoRapido({ bloqueada })`: lo
  escribieron a mano NOA y cardio. Bloqueada, ninguna pregunta visible ni
  narrable y el texto de `data-candado`; al destrabarse (`gatechange`,
  `slidechange` o `refrescarCandado()`), solo la actual.
  `repaso-navegacion` lo mide (rojo con v1.9.121).
- **L · `check-manifest --arreglar`.** Rehace la lista de `<file>` desde
  el disco (copia vieja de SI: de 1 declarado a 92, y verde). El aviso de
  `actualizar-kit` lo sugiere.
- **H (tira plegable en teléfono acostado):** el kit lo resuelve desde
  v1.9.121 con el modo `--pop`; NOA puede pasarse la próxima vez.
- **J (reparación propia de la primera locución):** anotado; un aviso en
  `actualizar-kit` necesita un patrón confiable que todavía no hay.
- **I, K:** contenido o sin cambio.

## 7.72 Segundos relevos de NOA y de "Seguridad de la información", 2026-10-07 (kit-base v1.9.123)

Llegaron juntos: NOA con un parche (`kit-propuesta-2026-10-07.diff`,
contra v1.9.120) y SI con su relevo en zip (A16–A21, contra v1.9.119).
Del parche de NOA, A, B, D, F y L ya estaban en v1.9.122 (escritos acá,
no copiados: los portamos de su relevo anterior); se portaron por partes
M, N y P. Verificado:

### Los dos cursos, el mismo bug: el video de fondo queda pausado (NOA N, SI A16)

"Una sola voz" pausa el video audible cuando un panel narra y no lo
reanuda, a propósito, porque un video arrancado por el alumno vuelve a su
botón de play. El de fondo no tiene botón. `initBgVideos` anota en
`popupopen` (captura, antes de que la voz lo pause) el video de fondo que
estaba andando, y al cerrar el ÚLTIMO pop-up, si sigue en la misma
diapositiva y pausado, `play()` a los 300 ms (deja pasar el `cancel()` y
el auto-avance pendiente de §7.69). Portado del parche de NOA.
`autoavance-panel` suma la parte 3 con el webm con audio de `una-sola-voz`
servido en lugar de los .mp4: con v1.9.122, "portada" quedó pausada tras
cerrar el panel; ahora vuelve.

### `revisar-curso` corrido desde la copia del curso escondía la mitad (SI A21)

Confirmado: desde la copia, `KIT` es el curso y "los CSS del kit" eran
todos los de la carpeta; el informe salía sin "!important" ni "Clases que
el curso reescribe" (alimentaria: 5 secciones desde el kit, 3 desde la
copia). Grave porque `build-zip` corre justamente la copia para el zip del
relevo. Ahora, si hay `kit-version.json` junto al script, los archivos del
kit salen del registro: 5 y 5.

### `initPopupVideos()` sin selector tomaba el reproductor del kit (NOA M)

Al cerrar el pop-up del reproductor le ponía `d-vp-virgen` al contenedor:
barra invisible y sin clics para siempre. El default excluye
`#d-video-player`. `reproductor-video` lo mide llamándolo sin selector
(rojo con v1.9.122: barra apagada).

### Cierre: pasar al resumen corta la voz (SI A17)

`mostrarResumen()` y `volverAlShot()` llaman a `Narrador.cancel()`: es un
cambio de paso dentro de la diapositiva, sin `slidechange`.
`locucion-control` mide si la frase de antes sigue sonando tras el cambio.
Con v1.9.122 en alimentaria solo da rojo el camino de vuelta: ahí el paso
al resumen ya cortaba por cómo cierra ese curso. En SI no cortaba en
ninguno de los dos (medido por su chat con un `speechSynthesis` falso; acá
no se reprodujo, no tenemos ese curso armado).

### Minijuego ganado (NOA P)

Ganado, salir ya no lo devuelve a la bienvenida, y `yaGanado()` pinta el
final al entrar en otra sesión. NOA no lo había podido correr con el
minijuego del kit; `minijuego.mjs` lo mide ahora con el del kit (rojo con
v1.9.122 en los dos casos).

### Objetivos que no se cumplen visitando (NOA Q)

`initIndexJumps({ objetivoCumplido(id, check, pip) })`: true/false decide
el curso, `undefined` deja el criterio de siempre. `objetivos-progreso`
lo mide (rojo con v1.9.122).

### Más chicos

- **NOA R:** `build-zip` deja afuera los `.mjs/.cjs/.py/.sh` sueltos en la
  raíz de un curso (scripts de trabajo) y lo avisa.
- **SI A18:** `.d-zona--circulo`. **SI A19:** `.d-shot-hit--tinte`, entre el
  realce por defecto y `--sin-aro` (NOA pedía lo mismo con sus burbujas).
- **SI A20.3:** `armar-curso` avisa al armar las zonas en la franja que se
  recorta (12,22% a los costados; 4,55% arriba y abajo para lo tocable).
  Cardio: ningún aviso; con una zona movida al 3%, el aviso.

### No se toma (todavía)

- **NOA O** (pulso `.d-nudge` con forma): es CSS de cada forma.
- **SI A20.1** (variables para que la regla compacta del repaso no pierda
  por especificidad) y **A20.2** (corte de 260 a 360 px): el modo `--pop`
  de v1.9.121 cubre el teléfono acostado para `.d-repaso-marco`; si un
  segundo curso pelea con la especificidad, se hacen las variables.
- **NOA, pendientes sin reproducir** (locución de pop-up que sigue tras
  cerrar, videos que se congelan): falta navegador y equipo.

## 7.73 Lo que quedaba de los relevos del 2026-10-07: tests que medían de menos, y erradas que no se guardaban (kit-base v1.9.124)

Llegaron como "tema aparte" desde los chats de cursos: el resto del parche
de NOA (`kit-propuesta-2026-10-07_3.diff`) y los puntos A22–A25 del relevo
de "Seguridad de la información". Del parche, todo lo de código ya estaba en
v1.9.123; quedaban tres tests. Cada uno se verificó rojo con v1.9.123 y verde
con esta, contra un curso armado para el caso.

### Tres tests que daban verde sin medir (NOA)

- **`popup-video-medida`**: el ▶ puede vivir DENTRO de un pop-up (las fichas
  de reporte de NOA). Sin `[data-slide]` arriba, el test decía "no hay
  `#d-video-player`", que era falso. Ahora va a la diapositiva que abre ese
  pop-up (`[data-popup-trigger]`) y toca el disparador marcado. Rojo con
  v1.9.123 (6 viewports "no hay `#d-video-player`"), verde ahora.
- **`una-sola-voz`**: suma los `[data-video-play]` de los pop-ups que se
  abren desde la diapositiva. Un curso con todos sus videos en fichas daba
  "ningún video arrancó". Mismo curso de prueba: 2 combinaciones medidas con
  v1.9.123, 6 ahora (las del video de la ficha).
- **`minijuego-landscape`**: v1.9.122 ya fallaba con un minijuego sin
  `data-mj-start`, pero solo lo reconocía por `.d-mj-opt`/`.d-mj-escena`.
  Suma `.d-mj-play`, `.d-mj-panel` y `[data-mj-grid]` (lo que trae el de
  NOA). Con un `.d-mj-play` suelto: verde con v1.9.123, rojo ahora.

### El cartel "Girá tu dispositivo" sin salida (SI A24, NOA E)

Dos cursos con el marcado de v1.9.71: cartel sin `[data-rotate-seguir]` y,
con el bloqueo de rotación puesto, el curso tapado para siempre.
`rotate-notice` solo miraba CUÁNDO aparecía. Ahora, en tablet vertical,
exige el botón, visible, y que tocarlo saque el cartel. Sin el botón: verde
con v1.9.123, rojo ahora; el curso de referencia, verde.

### Pagar dos veces (SI A25)

En SI, reabrir un número ya revelado volvía a pagar (140 → 180 con solo
pasar de nuevo; al retomar, +70). `puntaje-maximo` tocaba cada cosa UNA vez,
así que no podía verlo. Ahora instala un LMS en memoria que sobrevive la
recarga y recorre el curso tres veces: la normal, otra igual y otra tras
recargar. Las tres tienen que dar el mismo total, y al recargar el puntaje
tiene que volver igual. Curso de prueba con dos botones mal cableados (uno
paga siempre, otro guarda "ya pagué" solo en memoria): verde con v1.9.123,
rojo ahora con los dos casos por separado. Alimentaria: 145 / 145 / 145.
El gancho `__PUNTAJE_RECORRIDO__` corre solo en la primera pasada.

### Logros imposibles con una errada (SI A22)

El cliente terminó SI con 1/4 logros: los de unidad pedían las preguntas del
repaso ACERTADAS (`markSeen` corre solo al acertar) y cada una se contesta
una vez. Tres cambios:

- **Plantilla de `js/curso.js`:** `estado` trae `repaso` y `repasoMal`;
  `persistir()`/`restaurar()` los guardan (`rp`, `rm`, solo si hay algo) y el
  bloque de `initRepasoRapido` trae `seenMal`/`markMal`. **Hallazgo:** el
  bloque viejo, descomentado tal cual, tiraba `TypeError` porque
  `estado.repaso` no existía. Curso nuevo con el repaso activo: con la
  plantilla de v1.9.123, error de consola y las erradas en blanco al
  retomar; con esta, verde.
- **Test nuevo `repaso-errada`:** dos alumnos con LMS en memoria, uno
  contesta todo bien y otro todo mal. Exige los mismos logros en los dos y
  que, al recargar, las erradas vuelvan contestadas. Alimentaria, verde (2 y
  2 logros, 6/6). Copia con las erradas sin guardar y un logro que pide
  acertar: los dos fallos.
- **Manual §4:** un logro nunca depende de ACERTAR algo que se contesta una
  sola vez. Los logros miden recorrido, la medalla mide desempeño.

### Para la v1.9.125 (el rediseño)

- **SI A23, "siempre 5 logros":** el cliente dice que pidió exactamente 5
  y el kit dice "máximo 5". Va con el rediseño, que trae el catálogo de 5
  por defecto (+20 cada uno) y la grilla pensada para 5. Ahí
  `gamificacion` pasa a exigir exactamente 5.
- **SI A20.1/A20.2:** son del layout de dos columnas que armó SI, el mismo
  de la diapositiva de repaso del rediseño. Las variables de tamaño y el
  corte compacto van con ese marcado.

## 7.74 El rediseño: el canvas aprobado por el cliente, llevado al kit y a los cursos (kit-base v1.9.125)

El rediseño se diseñó con el cliente en un canvas (tableros "Main", "Índice",
"Glosario", "Instrucciones", "Recursos", "Config", "Barra", "Repaso",
"RepasoDiapo", "Quiz", "QuizResultado", "PracticaIntro", "Predicción",
"Avisos", "Video", "Resumen", "Salida", "Toasts", "Efectos", "Íconos").
Todo se hizo editando las reglas del kit EN SU LUGAR —`check-css-duplicates`
no admite una hoja que pise a otra—, así que los cursos reciben el aspecto
nuevo con `actualizar-kit`, sin tocar su HTML. Lo que vive escrito en el HTML
del curso lo migra `actualizar-kit` (abajo).

### Decisiones del cliente (2026-10-07/08)

- **Cabeceras:** azul de marca en los paneles del kit (índice, glosario,
  recursos, logros, instructivo, ayuda, ajustes); los pop-ups de CONTENIDO
  conservan el color de su categoría, con la forma nueva (barra de 50px,
  título en Faible 24px, ✕ centrada a la derecha).
- **Reintentar no suma** (práctica y repaso).
- **Índice:** solo el punto de estado, sin íconos por tema (el marcado de
  los ítems se conserva; `iconos-indice` sigue cuidando que no haya
  símbolos sin uso).
- **Logros:** 5 por defecto (Puntería, En racha, Curioso, Segunda mirada,
  Impecable), +20 cada uno, ninguno se gana con lo mínimo. Medallas por
  defecto: plata = 85 % del máximo redondeado a 5, oro = máximo + 40.
- **Efectos, por escalón:** chicos siempre (tilde, sacudida, "+N", contador);
  medianos solo en logros (destellos, sello); grandes en el oro y al
  terminar (fuegos, lluvia y serpentinas). Todos se apagan con "reducir
  movimiento".

### Lo que NO se hizo, y por qué

- Los interruptores "Subtítulos de la voz" y "Sonidos de los logros" del
  tablero Config: son funciones nuevas, no aspecto. Quedan para una versión
  propia.
- La barra de título del tablero Video: choca con la decisión §6.12 (el
  pop-up de video sin cabecera, pedido del cliente). Se respetó §6.12.

### Fases

- **A · base:** tokens de la paleta del manual, la cabecera unificada de los
  paneles, banco de íconos, arcos de fondo, modales centrados.
- **B · logros y medallas:** `coto-logros.js` reescrito. El catálogo acepta
  ids del kit como texto (`logros: ['punteria', …]`, que `new-course`
  escribe en `curso.json`); `pts` por logro (`data-bono` en `#d-points`);
  detectores por eventos de las piezas (`cotorespuesta`, `cotopractica`,
  `cotominijuego`, `cotoglosario`, `slidechange`) con su estado en
  suspend_data (`lg`). Anillo de logros en el chip, bloque de medalla con
  rangos, tarjetas nuevas. `gamificacion` exige exactamente 5 (SI A23).
- **C · paneles:** índice (puntos, resumen con anillo, avance por unidad),
  glosario ("Descubriste N de M", consulta que suma a Curioso), instructivo
  v4 (cuatro pasos sobre un camino), recursos (tarjetas con miniatura y
  cuenta), ayuda/ajustes (FAB), barra (pastillas de Sonido y Locución,
  toasts por tono).
- **D · contenido:** repaso (tarjeta con barra azul, diapositiva
  `.d-repaso-diapo`, variables `--repaso-c-*` y bloques compactos de SI
  A20.1/A20.2), práctica (pregunta en caja azul, opciones-pastilla, resultado
  en dos columnas con "Repasemos tus respuestas:"), aviso de la práctica,
  predicción, cierre, salida ("Curso finalizado:" con el tilde verde y la
  nota dorada) y la forma nueva de la cabecera de los pop-ups de contenido.
- **E · efectos y reintentar:** en `fx.js` + `coto-fx.css`, que todos los
  cursos ya cargan. Escuchan `logroganado`, `medallasube` (nuevo, de
  `coto-logros.js`, solo en vivo: nunca al restaurar) y `courseend`. La
  tarjeta "¡Nuevo logro!" es `aria-hidden` (el toast ya lo anuncia), deja
  pasar los clics y se va sola o con cualquier toque. "↺ Reintentar" en el
  repaso lo arma `coto-ui.js`: la pregunta queda `data-ya-contestada` (el
  gate y la barra de pasos la siguen contando), el reintento no paga, no
  guarda y llega a los logros como `repetida`. En la práctica, "Practicar de
  nuevo" pasó a "↺ Reintentar" (mismo `[data-retry]`).
- **F · migración:** `tools/_migrar-marcado.mjs`, llamado por
  `actualizar-kit`. Cambia solo lo que reconoce como escrito por el kit
  anterior: títulos con ":" de los paneles (el del índice, SOLO dentro de
  `.d-sidenav-hd`), el instructivo v3 → v4 conservando los textos propios
  de cada tarjeta, el aviso de la práctica conservando la cantidad de
  preguntas, el texto de "Mis logros" si es el de fábrica, "Repaso rápido:"
  (también dentro de `curso.json`) y `#i-play` si nadie lo usa. En un curso
  armado desde datos migra marco + curso.json y vuelve a ARMAR el index; si
  el index ya estaba desviado, lo migra también para no perder lo hecho a
  mano. Respaldo en `.kit-anterior/`, y correrlo dos veces no cambia nada.

### Lo que se encontró en el camino

- **Un comentario dentro de un comentario** en `index-boilerplate.html`
  (una nota `<!-- -->` dentro del bloque de referencia de la práctica)
  cerraba el comentario antes: el resto del bloque se volvía marcado real
  y las diapositivas de un curso NUEVO quedaban fuera de `.d-app`.
  Lo detectan dos chequeos que ya existían —`check-comentarios-html` (en
  `test:kit`) y `markup-sanity` sobre un curso nuevo—; ninguno se había
  corrido todavía. Lo vio `scroll-audit` (26px de scroll en cada
  diapositiva). Lección: `test:kit` después de CADA edición del boilerplate.
- **`.modal-hd` en columna:** la forma nueva de la cabecera de contenido
  (columna, por las bajadas) la heredaron las reglas de los paneles, que
  decían `display:flex` sin dirección: título arriba, ✕ abajo. Se vio en
  una foto. Test nuevo `cabecera-paneles`.
- **La tira de repaso de alimentaria scrolleaba** con la barra del título
  nueva, un borde de 4px del "Repaso completo" escondido y un `min-height`
  en "Siguiente". `repaso-tira` lo marcó; se ajustaron los tres.
- **La barra superior con Recursos** se pasaba 21px a 1280 y 17 a 960 con
  las pastillas nuevas: el saludo cede con elipsis (1195–1365), se esconde
  con Recursos entre 1195 y 1279, y el chip y el nombre se achican en
  960–1023. Medido de 800 a 1440.
- **Seguridad alimentaria** tiene su propio `initRepasoRapido` y no llama a
  `initLogros`: el reintento del repaso y los 5 logros del kit no le llegan
  hasta que su `curso.js` use los del kit (va a su ficha; `repaso-reintentar`
  lo marca en rojo, con razón).

### Lo que encontró el curso de prueba (cardio, `probar.sh`)

- **"↺ Reintentar" va en la barra del título** de la tira, uno por tira,
  sobre la pregunta en pantalla. En el cuerpo sumaba una fila y las tiras
  de factor de cardio, colocadas sobre la lámina, crecían sobre el dibujo
  (`bloque-no-tapa-arte`). Sin barra de título, va al final de la pregunta.
- **El repaso conserva los TAMAÑOS de v1.9.124** (letra, interlineado,
  margen, relleno de los botones): el rediseño los había agrandado 13px y
  las tiras colocadas se midieron con los de antes. Y los botones V/F se
  reparten por contenido (`flex: 1 1 auto`): repartidos por igual, el
  "← esta era" partía el texto en dos líneas en iPad. El rediseño del
  repaso es de color y forma, no de tamaño.
- **El resultado de la práctica en pantallas bajas:** con el resultado en
  pantalla, la diapositiva lleva `.is-quiz-resultado` y la intro se va
  igual que mientras se responde (≤760px de alto); en teléfono acostado
  se van también las barritas de avance y la línea "Respuesta correcta"
  (ya se mostró la explicación al contestar). La fila del repaso se alinea
  a la izquierda aunque el curso tenga `text-align:center`.
- **Lo de cardio, en su copia del kit:** su CSS achicaba la práctica con
  medidas del diseño anterior (con el nuevo la agrandaban: "Responder"
  6px afuera) y una grilla para la lista de repaso que descolocaba las
  filas nuevas; se sacaron. Su `curso.js` filtraba los logros a restaurar
  con `BADGES.map(… .id)`, que pierde un logro del kit (va como texto, sin
  `.id`): ahora usa `Logros.catalogo()` y pasa `lg`. `actualizar-kit` avisa
  ese patrón en cualquier curso. Y tenía 4 logros: se le sumó "segunda"
  para llegar a 5; cuáles quedan es del chat del curso.

### Tests (64 → 68)

`logros-kit`, `repaso-reintentar`, `efectos` y `cabecera-paneles`, cada uno
verificado rojo con el código anterior (o con el defecto reintroducido) y
verde con este. Más `tools/check-migracion.mjs` en `test:kit`, sin
navegador, con un HTML de v1.9.124 y trampas (una diapositiva "Índice de
contenidos", una tarjeta con texto propio, un `#i-play` en uso): rojo con el
primer borrador de la migración, verde ahora.
