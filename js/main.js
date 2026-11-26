/* =========================================================
   MAYA Pinturas · Prototipo del Inicio
   JS sin dependencias, salvo Three.js (CDN) para la cubeta 3D.
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hoverFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var WHATSAPP = '523331606585'; // provisorio: teléfono de planta hasta confirmar el número de ventas

  /* ---------- Datos: Vinílicas (de las etiquetas finales, 24/11) ---------- */
  var TINTA = '#1A1714';
  var BENEF_BASE = ['Alto poder cubriente', 'Resistente al fregado', 'Seca entre 30 y 60 min'];
  var VINILICAS = [
    { id: '01', nombre: 'MAYAVIN',         sub: 'Terpolímero · Interior y exterior', ben: BENEF_BASE, bg: '#188651', tapa: '#12643C', ink: '#FFFFFF' },
    { id: '02', nombre: 'SUPER MAYA 2000', sub: 'Terpolímero · Acabado satín',       ben: BENEF_BASE, bg: '#594785', tapa: '#3E3160', ink: '#FFFFFF' },
    { id: '03', nombre: 'PROFESIONAL',     sub: 'Vinil-acrílica · Resistente',       ben: BENEF_BASE, bg: '#C2364D', tapa: '#8C2335', ink: '#FFFFFF' },
    { id: '04', nombre: 'CONTRATO',        sub: 'Terpolímero · Resistente',          ben: BENEF_BASE, bg: '#1B6599', tapa: '#13476C', ink: '#FFFFFF' },
    { id: '05', nombre: 'IMPERMAYA',       sub: 'Resina 100% acrílica · 3 y 5 años', ben: ['Refleja el sol, baja el calor', 'Flexible, evita grietas', 'Ideal para techos'], bg: '#A21F35', tapa: '#701526', ink: '#FFFFFF' },
    { id: '06', nombre: 'RESIDENCIAL',     sub: 'Línea Residencial · Alto satín',    ben: ['Alto poder cubriente', 'Para climas rigurosos', 'Resistente al fregado'], bg: '#CBB898', tapa: '#5A4535', ink: TINTA },
    { id: '07', nombre: 'SELLADOR 9X1',    sub: 'Acetato de polivinilo · Rinde 9 a 1', ben: ['Excelente adherencia', 'Resiste la intemperie', 'Seca en 30 minutos'], bg: '#C0C0C0', tapa: '#4A3E35', ink: TINTA }
  ];

  /* ---------- Toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('visible');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('visible'); }, 3200);
  }
  $$('[data-pronto]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      toast('Esta sección llega en la siguiente fase del prototipo.');
    });
  });

  /* =========================================================
     NAVBAR fija: transparente sobre el hero, sólida después
     ========================================================= */
  var nav = $('#nav'), hero = $('.hero'), burger = $('#burger');
  function navEstado() {
    var limite = hero.offsetHeight - nav.offsetHeight - 10;
    nav.classList.toggle('is-solida', window.scrollY > limite);
  }
  window.addEventListener('scroll', navEstado, { passive: true });
  navEstado();
  burger.addEventListener('click', function () {
    var abierto = nav.classList.toggle('menu-abierto');
    burger.setAttribute('aria-expanded', abierto);
    burger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('#menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('menu-abierto');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* =========================================================
     HERO: titular letra por letra
     ========================================================= */
  (function () {
    var titulo = $('[data-split]');
    if (!titulo) return;
    if (!titulo.getAttribute('aria-label')) titulo.setAttribute('aria-label', titulo.textContent.replace(/\s+/g, ' ').trim());
    var n = 0;
    $$('.hero__linea', titulo).forEach(function (linea) {
      var txt = linea.textContent;
      linea.textContent = '';
      linea.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < txt.length; i++) {
        var s = document.createElement('span');
        s.className = 'letra';
        s.textContent = txt[i] === ' ' ? ' ' : txt[i];
        s.style.animationDelay = (0.25 + n * 0.035) + 's';
        linea.appendChild(s);
        n++;
      }
    });
  })();

  /* =========================================================
     Revelado al hacer scroll
     ========================================================= */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  /* =========================================================
     LA MARCA: palabras que suben solas en bucle
     ========================================================= */
  (function () {
    var cont = $('#bucle'), lista = $('.bucle__lista', cont);
    var PALABRAS = ['Hecho en México', 'Eco friendly', 'Calidad', 'Durabilidad', 'Mayorista', 'Confianza', 'Innovación', 'Sostenibilidad'];
    var n = PALABRAS.length, html = '';
    for (var c = 0; c < 3; c++) PALABRAS.forEach(function (p) { html += '<li><span>' + p + '</span></li>'; });
    lista.innerHTML = html;
    var items = $$('li', lista);
    items.forEach(function (li, i) { if (i < n || i >= 2 * n) li.setAttribute('aria-hidden', 'true'); });
    var i = n, timer = null, pausado = false;

    function itemH() { return items[0].getBoundingClientRect().height; }
    function pintar() {
      var h = itemH();
      lista.style.transform = 'translateY(' + (cont.clientHeight / 2 - h / 2 - i * h) + 'px)';
      items.forEach(function (li, k) { li.classList.toggle('activa', k === i); });
    }
    function paso() {
      if (pausado) return;
      i++;
      pintar();
      if (i >= 2 * n) {
        setTimeout(function () {
          lista.classList.add('sin-transicion');
          i -= n;
          pintar();
          lista.offsetHeight; // fuerza reflow
          lista.classList.remove('sin-transicion');
        }, 500);
      }
    }
    pintar();
    window.addEventListener('resize', pintar);
    if (!reduce) {
      timer = setInterval(paso, 1150);
      cont.addEventListener('mouseenter', function () { pausado = true; });
      cont.addEventListener('mouseleave', function () { pausado = false; });
    }
  })();

  /* =========================================================
     FAMILIAS: miniatura circular junto al cursor
     ========================================================= */
  (function () {
    var bola = $('#cursorBola'), cols = $('.cols');
    if (!hoverFino || !bola) return;
    var x = 0, y = 0, tx = 0, ty = 0, raf = null;
    function loop() {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      bola.style.translate = x + 'px ' + y + 'px';
      raf = (Math.abs(tx - x) + Math.abs(ty - y) > 0.3) ? requestAnimationFrame(loop) : null;
    }
    cols.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!bola.classList.contains('visible')) { x = tx; y = ty; }
      bola.classList.add('visible');
      if (!raf) raf = requestAnimationFrame(loop);
    });
    cols.addEventListener('pointerleave', function () { bola.classList.remove('visible'); });
    window.addEventListener('scroll', function () {
      if (!bola.classList.contains('visible')) return;
      var r = cols.getBoundingClientRect();
      if (ty < r.top || ty > r.bottom) bola.classList.remove('visible');
    }, { passive: true });
  })();

  /* =========================================================
     POR QUÉ MAYA: círculo que crece desde el punto de entrada
     ========================================================= */
  $$('.card').forEach(function (card) {
    var fill = $('.card__fill', card);
    function situar(e) {
      var r = card.getBoundingClientRect();
      fill.style.setProperty('--d', (2 * Math.hypot(r.width, r.height)) + 'px');
      fill.style.left = (e.clientX - r.left) + 'px';
      fill.style.top = (e.clientY - r.top) + 'px';
    }
    card.addEventListener('pointerenter', function (e) { situar(e); requestAnimationFrame(function () { card.classList.add('activa'); }); });
    card.addEventListener('pointerleave', function (e) { situar(e); card.classList.remove('activa'); });
  });

  /* =========================================================
     DE LA PLANTA A TU TIENDA: 3 fases ligadas al scroll (todas en "pantallas")
     1) collage: las fotos sueltas suben a distintas velocidades
     2) la foto del centro se abre a pantalla completa
     3) los títulos pasan de derecha a izquierda y cambia el párrafo
     Al terminar, la sección queda fija una pantalla más mientras sube Contacto.
     ========================================================= */
  (function () {
    var sec = $('#obra'), pin = $('#abrePin');
    if (!sec || !pin) return;
    var sueltas = $$('[data-vel]', pin), foto = $('#abreFoto'), img = $('img', foto);
    var textos = $('#abreTextos'), pista = $('#abrePista'), titulos = $$('.abre__t', pista);
    var parrafo = $('.abre__parrafo', textos), elP = $('#abreP'), elNum = $('#abreNum');
    var TEXTOS = [
      'Desarrollamos y mezclamos cada producto en nuestra planta de El Salto, Jalisco, cuidando que cubra, rinda y conserve su color.',
      'Llenamos y sellamos cada cubeta de 19 L en línea, lista para estibar y transportar.',
      'Armamos tu tarima combinando productos y familias, según lo que necesita tu tienda u obra.',
      'Cargamos tu pedido y te damos seguimiento por WhatsApp, del andén a tu mostrador.',
      'Pintura que cubre a la primera, se lava y mantiene su color. Eso es lo que tu cliente nota.'
    ];
    var N = titulos.length;
    var A = 1.0, B = 0.8, PASO = 0.75, FIN = 0.6;        // largo de cada fase, en pantallas
    var C0 = A + B, TOTAL = C0 + PASO * (N - 1) + FIN;  // scroll fijo total
    var vh = 0, caja = null, raf = null, actual = -1;
    var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

    function medir() {
      vh = window.innerHeight;
      var vw = window.innerWidth, movil = vw < 860;
      // +1 pantalla al final: la sección sigue fija mientras Contacto sube encima
      sec.style.height = (vh * (1 + TOTAL + 1)) + 'px';
      var w = movil ? vw * 0.4 : Math.min(vw * 0.26, vh * 0.42);
      var h = w * 1.25, cx = vw / 2, cy = vh * (movil ? 0.56 : 0.58);
      caja = { t: cy - h / 2, r: vw - (cx + w / 2), b: vh - (cy + h / 2), l: cx - w / 2 };
      pintar();
    }
    function pintar() {
      raf = null;
      var y = -sec.getBoundingClientRect().top / vh;   // pantallas recorridas dentro de la sección
      if (y < -1 || y > TOTAL + 1.2) return;           // fuera de vista: no hace falta pintar

      // Fase 1 (y continúa en la 2): las sueltas suben y se desvanecen al abrirse la foto
      var pA = clamp(y / C0, 0, 1), pB = ease(clamp((y - A) / B, 0, 1));
      sueltas.forEach(function (el) {
        var v = +el.getAttribute('data-vel');
        var dy = reduce ? 0 : -pA * v * 0.55 * vh;
        el.style.transform = 'translate3d(0,' + dy + 'px,0)';
        el.style.opacity = 1 - clamp((y - A) / (B * 0.6), 0, 1);
      });

      // Fase 2: la caja central se abre a pantalla completa
      var k = 1 - pB;
      foto.style.clipPath = 'inset(' + (caja.t * k) + 'px ' + (caja.r * k) + 'px ' + (caja.b * k) + 'px ' + (caja.l * k) + 'px)';
      img.style.transform = 'scale(' + (1 + 0.18 * k) + ')';
      textos.style.opacity = clamp((y - (A + B * 0.7)) / (B * 0.3), 0, 1);

      // Fase 3: los títulos pasan; el activo en blanco, los demás atenuados
      var c = clamp((y - C0) / PASO, 0, N - 1);
      var slot = titulos[0].offsetWidth;
      pista.style.transform = 'translate3d(' + (-c * slot) + 'px,0,0)';
      titulos.forEach(function (t, i) {
        var d = i - c;
        t.style.opacity = d < 0 ? Math.max(0, 1 + d * 1.6) : 1 - Math.min(1, d) * 0.65;
      });
      var i = Math.round(c);
      if (i !== actual) {
        var primera = actual === -1;
        actual = i;
        elNum.textContent = '0' + (i + 1);
        if (primera || reduce) { elP.textContent = TEXTOS[i]; }
        else {
          parrafo.classList.add('cambia');
          setTimeout(function () { elP.textContent = TEXTOS[actual]; parrafo.classList.remove('cambia'); }, 300);
        }
      }
    }
    window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(pintar); }, { passive: true });
    window.addEventListener('resize', medir);
    window.addEventListener('load', medir);
    medir();
  })();

  /* =========================================================
     CIERRE: formulario que arma el mensaje de WhatsApp
     ========================================================= */
  (function () {
    var form = $('#form'), err = $('#formError');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var nombre = (d.get('nombre') || '').trim();
      var ciudad = (d.get('ciudad') || '').trim();
      var tel = (d.get('telefono') || '').trim();
      if (!nombre || !ciudad || !tel) { err.textContent = 'Completa tu nombre, ciudad y teléfono.'; return; }
      if (tel.replace(/\D/g, '').length < 10) { err.textContent = 'Revisa tu teléfono: deben ser 10 dígitos.'; return; }
      err.textContent = '';
      var msg = 'Hola, soy ' + nombre + ' de ' + ciudad + ' (' + d.get('perfil') + '). ' +
        'Me interesa recibir precios de mayoreo de MAYA Pinturas. Mi teléfono es ' + tel + '.';
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });

    // Footer: solo el número, abre WhatsApp con el pedido de precios
    var ff = $('#footerForm');
    if (ff) ff.addEventListener('submit', function (e) {
      e.preventDefault();
      var tel = ($('#footerTel').value || '').trim();
      if (tel.replace(/\D/g, '').length < 10) { toast('Escribe tu WhatsApp a 10 dígitos.'); return; }
      var msg = 'Hola, quiero vender MAYA. Me interesa recibir precios de mayoreo. Mi WhatsApp es ' + tel + '.';
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  })();

  /* =========================================================
     LÍNEA: la cubeta gira con el scroll y cambia de producto
     ========================================================= */
  var seccion = $('#vinilicas'), escena = $('#escena');
  var elNum = $('#lnNum'), elTit = $('#lnTitulo'), elSub = $('#lnSub'), elBen = $('#lnBen');
  var elCta = $('#lnCta'), elCtaNom = $('#lnCtaNom'), elVivo = $('#lnVivo'), elFallback = $('#fallback');
  var pildora = $('#pildora');
  var TOTAL = VINILICAS.length, TRAMOS = TOTAL - 1 + 0.6; // 6 cambios + respiro final
  var actual = -1;

  VINILICAS.forEach(function (p, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = p.nombre;
    b.setAttribute('aria-label', 'Ver ' + p.nombre);
    b.addEventListener('click', function () { irA(i); });
    pildora.appendChild(b);
  });
  var botones = $$('button', pildora);

  function rangoSeccion() {
    var top = seccion.getBoundingClientRect().top + window.scrollY;
    return { top: top, largo: seccion.offsetHeight - window.innerHeight };
  }
  function irA(i) {
    var r = rangoSeccion();
    window.scrollTo({ top: r.top + (i / TRAMOS) * r.largo + 2, behavior: reduce ? 'auto' : 'smooth' });
  }

  function ajustarTitulo() {
    elTit.style.fontSize = '200px';
    var ancho = elTit.scrollWidth;
    var maxW = window.innerWidth * (window.innerWidth < 860 ? 0.92 : 0.9);
    var maxH = window.innerHeight * 0.3;
    elTit.style.fontSize = Math.min(200 * maxW / ancho, maxH) + 'px';
  }

  function mostrar(i) {
    if (i === actual) return;
    var p = VINILICAS[i];
    actual = i;
    escena.style.setProperty('--bg', p.bg);
    escena.style.setProperty('--ink', p.ink);
    elNum.textContent = p.id;
    elTit.classList.add('cambia');
    setTimeout(function () {
      elTit.textContent = p.nombre;
      ajustarTitulo();
      elTit.classList.remove('cambia');
    }, reduce ? 0 : 180);
    elSub.textContent = p.sub;
    elBen.innerHTML = p.ben.map(function (b) { return '<li>' + b + '</li>'; }).join('');
    elCtaNom.textContent = p.nombre;
    elFallback.src = 'assets/img/mock-' + p.id + '.jpg';
    elFallback.alt = 'Cubeta de 19 L de ' + p.nombre;
    elVivo.textContent = p.id + ' de 07: ' + p.nombre + '. ' + p.sub + '.';
    botones.forEach(function (b, k) { b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    var activo = botones[i];
    if (activo && pildora.scrollWidth > pildora.clientWidth) {
      pildora.scrollTo({ left: activo.offsetLeft - pildora.clientWidth / 2 + activo.offsetWidth / 2, behavior: 'smooth' });
    }
  }

  // Posición continua: k = producto, s = avance del giro hacia el siguiente (0..1)
  var estado = { k: 0, s: 0 };
  function leerScroll() {
    var r = rangoSeccion();
    var prog = clamp((window.scrollY - r.top) / r.largo, 0, 1);
    var x = prog * TRAMOS, k = Math.min(Math.floor(x), TOTAL - 1), s = 0;
    if (k < TOTAL - 1) {
      var t = x - k;                     // 0..1 dentro del tramo
      s = clamp((t - 0.35) / 0.65, 0, 1); // primero se queda quieta, luego gira
      s = s < 0.5 ? 4 * s * s * s : 1 - Math.pow(-2 * s + 2, 3) / 2; // easeInOutCubic
      if (reduce) s = t > 0.5 ? 1 : 0;
    }
    estado.k = k; estado.s = s;
    mostrar(s > 0.5 ? k + 1 : k);
  }
  window.addEventListener('scroll', leerScroll, { passive: true });
  window.addEventListener('resize', function () { ajustarTitulo(); leerScroll(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarTitulo);
  leerScroll();

  var visible = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible) arrancar();
    }).observe(escena);
  } else { visible = true; }

  /* ---------- Greca que se dibuja con el cursor ---------- */
  var greca = (function () {
    var cv = $('#grecaCanvas'), ctx = cv.getContext('2d');
    var mask = document.createElement('canvas'), mctx = mask.getContext('2d');
    // La greca no se ve hasta que pasa el cursor: se revela suave y se vuelve a apagar.
    var TILE = 560;          // ancho de un módulo de greca en px
    var REALCE = 0.32;       // opacidad máxima de la greca revelada
    var img = new Image(), patron = null, w = 0, h = 0, dpr = 1;
    var px = null, py = null, lx = null, ly = null, quietos = 999;
    img.onload = function () { crearPatron(); };
    img.src = 'assets/svg/greca.svg';

    function crearPatron() {
      if (!img.width) return;
      patron = ctx.createPattern(img, 'repeat');
      if (patron && patron.setTransform && window.DOMMatrix) patron.setTransform(new DOMMatrix().scale((TILE / img.width) * dpr));
    }
    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = escena.clientWidth; h = escena.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      mask.width = Math.ceil(w / 3); mask.height = Math.ceil(h / 3); // máscara a un tercio de resolución
      crearPatron();
    }
    medir();
    window.addEventListener('resize', medir);
    if (hoverFino && !reduce) {
      escena.addEventListener('pointermove', function (e) {
        var r = escena.getBoundingClientRect();
        px = e.clientX - r.left; py = e.clientY - r.top; quietos = 0;
      });
      escena.addEventListener('pointerleave', function () { lx = ly = null; px = py = null; });
    }

    function frame() {
      if (!patron) return;
      // Sin movimiento del cursor por ~2,5 s la máscara ya se apagó: no hay nada que dibujar
      if (quietos > 220) return;
      quietos++;
      if (quietos > 220) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); return; }
      // 1. la máscara se desvanece poco a poco
      mctx.globalCompositeOperation = 'destination-out';
      mctx.fillStyle = 'rgba(0,0,0,0.03)';
      mctx.fillRect(0, 0, mask.width, mask.height);
      // 2. el cursor pinta la máscara (interpolando el trazo)
      if (px !== null) {
        mctx.globalCompositeOperation = 'source-over';
        var x = px / 3, y = py / 3, sx = lx === null ? x : lx, sy = ly === null ? y : ly;
        var dist = Math.hypot(x - sx, y - sy), pasos = Math.max(1, Math.ceil(dist / 5)), R = 85;
        for (var i = 1; i <= pasos; i++) {
          var cx = sx + (x - sx) * i / pasos, cy = sy + (y - sy) * i / pasos;
          var g = mctx.createRadialGradient(cx, cy, 0, cx, cy, R);
          g.addColorStop(0, 'rgba(0,0,0,0.22)');
          g.addColorStop(1, 'rgba(0,0,0,0)');
          mctx.fillStyle = g;
          mctx.fillRect(cx - R, cy - R, R * 2, R * 2);
        }
        lx = x; ly = y;
      }
      // 3. realce = patrón ∩ máscara, con opacidad tope
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.globalAlpha = REALCE;
      ctx.fillStyle = patron;
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(mask, 0, 0, cv.width, cv.height);
      ctx.globalCompositeOperation = 'source-over';
    }
    return { frame: frame };
  })();

  /* ---------- Cubeta 3D (cilindro con la etiqueta plana como textura) ---------- */
  var cubeta = (function () {
    var canvas = $('#cubeta');
    var ok = !!(window.THREE && window.MAYA_LABELS);
    if (ok) {
      try {
        var prueba = document.createElement('canvas');
        ok = !!(prueba.getContext('webgl') || prueba.getContext('experimental-webgl'));
      } catch (e) { ok = false; }
    }
    if (!ok) { seccion.classList.add('sin-3d'); return null; }

    var T = window.THREE;
    var renderer = new T.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputEncoding = T.sRGBEncoding;
    var scene = new T.Scene();
    var camara = new T.PerspectiveCamera(28, 1, 0.1, 100);

    // Luces
    scene.add(new T.HemisphereLight(0xffffff, 0x777777, 0.95));
    var key = new T.DirectionalLight(0xffffff, 0.85); key.position.set(-3, 4, 6); scene.add(key);
    var rim = new T.DirectionalLight(0xffffff, 0.45); rim.position.set(4, 2, -4); scene.add(rim);

    var grupo = new T.Group();
    var cuerpo = new T.Group(); // gira
    grupo.add(cuerpo);
    scene.add(grupo);

    var H = 2.3, R_TOP = 1.0, R_BOT = 0.88, Y0 = -H / 2;
    function radio(y) { return R_BOT + ((y - Y0) / H) * (R_TOP - R_BOT); }

    var plastico = new T.MeshStandardMaterial({ color: 0xf4f4f1, roughness: 0.42, metalness: 0, side: T.DoubleSide });
    var tapaMat = new T.MeshStandardMaterial({ color: new T.Color(VINILICAS[0].tapa).convertSRGBToLinear(), roughness: 0.4 });
    var metal = new T.MeshStandardMaterial({ color: 0xc9c9c9, roughness: 0.3, metalness: 0.55 });

    cuerpo.add(new T.Mesh(new T.CylinderGeometry(R_TOP, R_BOT, H, 96, 1, true), plastico));
    var fondo = new T.Mesh(new T.CircleGeometry(R_BOT, 64), plastico);
    fondo.rotation.x = Math.PI / 2; fondo.position.y = Y0; cuerpo.add(fondo);

    // Anillos de refuerzo y labio
    [[H / 2 - 0.02, 0.05], [0.9, 0.035], [0.72, 0.035]].forEach(function (a) {
      var t = new T.Mesh(new T.TorusGeometry(radio(a[0]) + 0.005, a[1], 12, 120), plastico);
      t.rotation.x = Math.PI / 2; t.position.y = a[0]; cuerpo.add(t);
    });

    // Tapa
    var tapa = new T.Mesh(new T.CylinderGeometry(1.05, 1.05, 0.16, 96), tapaMat);
    tapa.position.y = H / 2 + 0.07; cuerpo.add(tapa);
    var tapaBorde = new T.Mesh(new T.TorusGeometry(1.05, 0.04, 10, 120), tapaMat);
    tapaBorde.rotation.x = Math.PI / 2; tapaBorde.position.y = H / 2 + 0.0; cuerpo.add(tapaBorde);

    // Asa de alambre con agarre
    var puntos = [];
    for (var i = 0; i <= 40; i++) {
      var a = Math.PI * i / 40;
      puntos.push(new T.Vector3(Math.cos(a) * 1.08, 0.84 + Math.sin(a) * 1.12, 0));
    }
    cuerpo.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(puntos), 80, 0.022, 8), metal));
    var agarre = new T.Mesh(new T.CylinderGeometry(0.075, 0.075, 0.6, 24), tapaMat);
    agarre.rotation.z = Math.PI / 2; agarre.position.y = 0.84 + 1.12; cuerpo.add(agarre);
    [-1, 1].forEach(function (lado) {
      var oreja = new T.Mesh(new T.BoxGeometry(0.06, 0.22, 0.16), plastico);
      oreja.position.set(lado * 1.0, 0.84, 0); cuerpo.add(oreja);
    });

    // Etiqueta: dos capas para el fundido entre productos
    var Y_ETQ_BAJO = -1.0, Y_ETQ_ALTO = 0.55, ALTO = Y_ETQ_ALTO - Y_ETQ_BAJO;
    function capa(extra) {
      return new T.CylinderGeometry(radio(Y_ETQ_ALTO) + extra, radio(Y_ETQ_BAJO) + extra, ALTO, 160, 1, true);
    }
    var matA = new T.MeshStandardMaterial({ roughness: 0.55 });
    var matB = new T.MeshStandardMaterial({ roughness: 0.55, transparent: true, opacity: 0, depthWrite: false });
    var etqA = new T.Mesh(capa(0.006), matA), etqB = new T.Mesh(capa(0.009), matB);
    etqA.position.y = etqB.position.y = (Y_ETQ_ALTO + Y_ETQ_BAJO) / 2;
    etqB.renderOrder = 2;
    cuerpo.add(etqA); cuerpo.add(etqB);

    // Texturas de las etiquetas (embebidas en labels.js)
    var FRENTE = 0.47; // centro del frente de la etiqueta plana
    var texturas = VINILICAS.map(function (p) {
      var img = new Image();
      var tex = new T.Texture(img);
      tex.wrapS = T.RepeatWrapping;
      tex.offset.x = FRENTE;
      tex.encoding = T.sRGBEncoding;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      img.onload = function () { tex.needsUpdate = true; pedirFrame(); };
      img.src = window.MAYA_LABELS[p.id];
      return tex;
    });
    var colTapa = VINILICAS.map(function (p) { return new T.Color(p.tapa).convertSRGBToLinear(); });
    matA.map = texturas[0]; matB.map = texturas[1];

    function medir() {
      var w = escena.clientWidth, h = escena.clientHeight;
      renderer.setSize(w, h, false);
      camara.aspect = w / h;
      var visH = 5.5, mitad = Math.tan(T.MathUtils.degToRad(camara.fov / 2));
      var necesario = Math.max(visH, 3.4 / camara.aspect);
      camara.position.set(0, 0.5, necesario / (2 * mitad));
      camara.lookAt(0, 0.35, 0);
      camara.updateProjectionMatrix();
      grupo.position.y = w < 860 ? 0.05 : -0.15;
      grupo.scale.setScalar(w < 860 ? 0.82 : 1);
    }
    medir();
    window.addEventListener('resize', function () { medir(); pedirFrame(); });

    // Inclinación leve con el cursor
    var tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    if (hoverFino && !reduce) {
      escena.addEventListener('pointermove', function (e) {
        var r = escena.getBoundingClientRect();
        tilt.tx = ((e.clientY - r.top) / r.height - 0.5) * 0.25;
        tilt.ty = ((e.clientX - r.left) / r.width - 0.5) * 0.35;
      });
    }

    var rot = 0, pend = true, ultimo = '';
    function pedirFrame() { pend = true; }
    function frame() {
      var k = estado.k, s = estado.s;
      var objetivo = reduce ? 0 : -(k + s) * Math.PI * 2;
      // Solo se vuelve a dibujar si algo se mueve: ahorra GPU cuando la cubeta está quieta
      var quieta = Math.abs(objetivo - rot) < 0.0005 && Math.abs(tilt.tx - tilt.x) < 0.0005 && Math.abs(tilt.ty - tilt.y) < 0.0005;
      var clave = k + '|' + s.toFixed(3);
      if (quieta && !pend && clave === ultimo) return;
      pend = false; ultimo = clave;
      rot += (objetivo - rot) * 0.14;
      tilt.x += (tilt.tx - tilt.x) * 0.08; tilt.y += (tilt.ty - tilt.y) * 0.08;
      cuerpo.rotation.y = rot;
      grupo.rotation.x = tilt.x; grupo.rotation.y = tilt.y;

      var sig = Math.min(k + 1, TOTAL - 1);
      if (matA.map !== texturas[k]) { matA.map = texturas[k]; matA.needsUpdate = true; }
      if (matB.map !== texturas[sig]) { matB.map = texturas[sig]; matB.needsUpdate = true; }
      var f = clamp((s - 0.3) / 0.4, 0, 1);
      matB.opacity = f;
      tapaMat.color.copy(colTapa[k]).lerp(colTapa[sig], f);
      renderer.render(scene, camara);
    }
    return { frame: frame };
  })();

  var corriendo = false;
  function arrancar() {
    if (corriendo) return;
    corriendo = true;
    (function tick() {
      if (!visible) { corriendo = false; return; }
      greca.frame();
      if (cubeta) cubeta.frame();
      requestAnimationFrame(tick);
    })();
  }
})();
