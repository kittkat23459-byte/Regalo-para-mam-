// Espera a que todo el contenido HTML termine de cargarse antes de ejecutar el código
window.addEventListener('DOMContentLoaded', function() {
  
  // Declara variables: doc es una referencia al documento HTML, flower selecciona el elemento con clase .flower
  // petalPartMarkup es un template HTML para los pétalos (no se usa directamente)
  // maxParts = 20 (número de partes que tendrá cada pétalo)
  // maxPetals = 6 (número de pétalos que tendrá la flor)
  // partsFontStep calcula el incremento de tamaño entre cada parte del pétalo
  var doc = document, flower = doc.querySelector('.flower'), petalPartMarkup = '<div class="box"><div class="shape"></div></div>', maxParts = 20, maxPetals = 6, partsFontStep = 25 / maxParts;
  
  // Llama a la función que crea la flor
  createFlower();
  
  // FUNCIÓN: Crea la flor completa con todos sus pétalos
  function createFlower() {
    // Calcula el ángulo entre cada pétalo (360° / 6 pétalos = 60°)
    var angle = 360 / maxPetals;
    
    // Bucle que se repite por cada pétalo (6 veces)
    for (var i = 0; i < maxPetals; i++) {
      // Crea un nuevo pétalo llamando a la función createPetal()
      var petal = createPetal();
      
      // Calcula el ángulo actual para este pétalo (0°, 60°, 120°, 180°, 240°, 300°)
      var currAngle = angle * i + 'deg';
      
      // Crea la transformación 3D para posicionar el pétalo en círculo
      // rotateY: rota alrededor del eje Y, rotateX: inclina el pétalo, translateZ: lo aleja del centro
      var transform = 'transform: rotateY(' + currAngle + ') rotateX(-30deg) translateZ(9vmin)';
      
      // Aplica el estilo de transformación al pétalo
      petal.setAttribute('style', transform);
      
      // Agrega el pétalo como hijo de la flor
      flower.appendChild(petal);
    }
  }
  
  // FUNCIÓN: Crea un pétalo individual con todas sus partes
  function createPetal() {
    // Crea la primera caja (box) con posición 0 (la más interna)
    var box = createBox(null, 0);
    
    // Crea el elemento div que será el pétalo
    var petal = doc.createElement('div');
    
    // Agrega la clase 'petal' al div para darle estilos CSS
    petal.classList.add('petal');
    
    // Bucle que crea las 20 partes del pétalo (desde la 1 hasta maxParts)
    for (var i = 1; i <= maxParts; i++) {
      // Crea una nueva caja, pasando la caja anterior como base y la posición actual
      box = createBox(box, i);
    }
    
    // Agrega la última caja (la más externa) al pétalo
    petal.appendChild(box);
    
    // Devuelve el pétalo completo
    return petal;
  }
  
  // FUNCIÓN: Crea una caja que forma parte de un pétalo (como un segmento)
  // box: la caja anterior (para anidarlas), pos: posición actual (0 = centro, 20 = borde)
  function createBox(box, pos) {
    // Calcula el tamaño de fuente (vmin = unidad relativa a la pantalla)
    var fontSize = partsFontStep * (maxParts - pos) + 'vmin';
    var half = maxParts / 2; // Calcula la mitad de las partes (10)
    var bright = '50'; // Brillo inicial (50%)
    
    // Si la posición está en la primera mitad del pétalo
    if (pos < half + 1) {
      // Aumenta el tamaño progresivamente (más grande hacia afuera)
      fontSize = partsFontStep * pos + 'vmin';
    } else {
      // En la segunda mitad, el brillo disminuye progresivamente
      bright = 10 + 40 / half * (maxParts - pos);
    }
    
    // Configuración de colores para los pétalos (tonos rosados)
    var baseHue = 320;        // Tono base rosa (en HSL: 0-360)
    var hueVariation = 30;    // Variación de tono entre partes
    var saturation = 70 + (20 * pos / maxParts); // Saturación (70% a 90%)
    
    // Crea el color HSL con los valores calculados
    var color = 'hsl(' + (baseHue + (hueVariation * pos / maxParts)) + ', ' + saturation + '%, ' + bright + '%)';
    
    // Crea un nuevo div que será la forma geométrica
    var newShape = doc.createElement('div');
    newShape.classList.add('shape'); // Agrega clase CSS 'shape'
    
    // Crea un nuevo div que será la caja contenedora
    var newBox = doc.createElement('div');
    newBox.classList.add('box'); // Agrega clase CSS 'box'
    
    // Aplica el color y tamaño de fuente a la caja
    newBox.setAttribute('style', 'color: ' + color + ';font-size: ' + fontSize);
    
    // Si existe una caja anterior, la agrega como hija (anidamiento)
    if (box) newBox.appendChild(box);
    
    // Agrega la forma geométrica a la caja
    newBox.appendChild(newShape);
    
    // Devuelve la caja creada
    return newBox;
  }
  
  // FUNCIÓN: Dibuja el fondo de galaxia con estrellas
  function drawGalaxy() {
    // Obtiene el elemento canvas del HTML
    var canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return; // Si no existe, sale de la función
    
    // Obtiene el contexto 2D para dibujar en el canvas
    var ctx = canvas.getContext('2d');
    
    // FUNCIÓN: Ajusta el tamaño del canvas al tamaño de la ventana
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resize(); // Ejecuta el redimensionamiento inicial
    window.addEventListener('resize', resize); // Redimensiona al cambiar el tamaño de la ventana
    
    // Array para almacenar las estrellas y cantidad total
    var stars = [], numStars = 120;
    
    // Crea 120 estrellas con propiedades aleatorias
    for (var i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,      // Posición X aleatoria
        y: Math.random() * canvas.height,     // Posición Y aleatoria
        r: Math.random() * 1.5 + 0.5,        // Radio aleatorio (0.5 a 2.0)
        dx: (Math.random() - 0.5) * 0.7,     // Velocidad horizontal aleatoria
        dy: (Math.random() - 0.5) * 0.7,     // Velocidad vertical aleatoria
        alpha: Math.random() * 0.5 + 0.5     // Opacidad aleatoria (0.5 a 1.0)
      });
    }
    
    // FUNCIÓN DE ANIMACIÓN: Mueve y dibuja las estrellas continuamente
    function animate() {
      // Limpia todo el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Recorre todas las estrellas
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        
        ctx.save();                     // Guarda el estado actual del contexto
        ctx.globalAlpha = s.alpha;      // Aplica la opacidad de la estrella
        ctx.beginPath();                // Comienza un nuevo trazado
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); // Dibuja un círculo (la estrella)
        ctx.fillStyle = 'rgba(255,182,193,0.9)'; // Color rosa claro
        ctx.shadowColor = '#ffb6d5';    // Color de la sombra
        ctx.shadowBlur = 2;             // Difuminado de la sombra
        ctx.fill();                     // Rellena el círculo con el color
        ctx.restore();                  // Restaura el estado anterior del contexto
        
        // Mueve la estrella sumando su velocidad
        s.x += s.dx;
        s.y += s.dy;
        
        // Si la estrella sale por un borde, invierte su dirección (rebote)
        if (s.x < 0 || s.x > canvas.width) s.dx *= -1;
        if (s.y < 0 || s.y > canvas.height) s.dy *= -1;
      }
      
      // Solicita el siguiente frame de animación (crea un bucle infinito)
      requestAnimationFrame(animate);
    }
    
    animate(); // Inicia la animación
  }
  
  // Ejecuta la función drawGalaxy cuando el DOM esté completamente cargado
  document.addEventListener('DOMContentLoaded', drawGalaxy);
  
  // Obtiene el contenido principal y asegura que sea visible
  var mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.style.display = '';
  
  // Oculta el contenedor del botón de inicio inmediatamente
  var container = document.getElementById('start-btn-container');
  if (container) container.style.display = 'none';
  
  // Muestra el wrapper que contiene la flor
  var wrapper = document.querySelector('.wrapper');
  if (wrapper) wrapper.style.display = '';
  
  // Reproducir música automáticamente
  var music = document.getElementById('bg-music');
  if (music) {
    music.currentTime = 0;                // Reinicia la música al inicio
    var playPromise = music.play();       // Intenta reproducir
    
    // Si la reproducción automática falla (política del navegador)
    if (playPromise !== undefined) {
      playPromise.catch(function(error) {
        console.log('No se pudo reproducir la música automáticamente:', error);
      });
    }
  }
  
  // Mostrar canvas de galaxia después de 2 segundos
  setTimeout(function() {
    var galaxyCanvas = document.getElementById('galaxy-canvas');
    if (galaxyCanvas) {
      galaxyCanvas.style.display = '';    // Muestra el canvas
      galaxyCanvas.width = window.innerWidth;   // Ajusta ancho
      galaxyCanvas.height = window.innerHeight; // Ajusta alto
      
      var ctx = galaxyCanvas.getContext('2d'); // Obtiene contexto para dibujar
      
      // Detecta si es dispositivo móvil (pantalla <= 600px)
      var isMobile = window.innerWidth <= 600;
      var numDots = isMobile ? 3 : 60;    // Menos puntos en móvil para rendimiento
      var dots = [];      // Array para almacenar los puntos
      var dotsToAdd = 0;  // Contador de puntos añadidos
      var minDotSize = isMobile ? 0.5 : 0.7;  // Tamaño mínimo de punto
      var maxDotSize = isMobile ? 1.1 : 1.7;  // Tamaño máximo de punto
      
      // Web Audio API para analizar el volumen de la música
      var audio = document.getElementById('bg-music');
      var audioCtx, analyser, dataArray;
      
      // Verifica si el navegador soporta Web Audio y si existe el elemento de audio
      if (window.AudioContext && audio) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // Crea contexto de audio
        var source = audioCtx.createMediaElementSource(audio); // Conecta el elemento audio
        analyser = audioCtx.createAnalyser(); // Crea analizador de frecuencias
        source.connect(analyser);            // Conecta la fuente al analizador
        analyser.connect(audioCtx.destination); // Conecta el analizador a los altavoces
        analyser.fftSize = 64;               // Tamaño de la transformada de Fourier
        dataArray = new Uint8Array(analyser.frequencyBinCount); // Array para datos de frecuencia
      }
      
      // FUNCIÓN: Añade un punto luminoso a la galaxia
      function addDot() {
        if (dotsToAdd < numDots) {
          let angle = Math.random() * 2 * Math.PI;        // Ángulo aleatorio
          let radius = Math.random() * (galaxyCanvas.width / 2.2); // Radio aleatorio
          let x = galaxyCanvas.width / 2 + Math.cos(angle) * radius; // Posición X (circular)
          let y = galaxyCanvas.height / 2 + Math.sin(angle) * radius; // Posición Y (circular)
          let speed = 0.2 + Math.random() * 0.7;         // Velocidad aleatoria
          let dir = Math.random() * 2 * Math.PI;          // Dirección aleatoria
          let dotSize = minDotSize + Math.random() * (maxDotSize - minDotSize); // Tamaño
          
          // Agrega el punto al array con todas sus propiedades
          dots.push({ x: x, y: y, r: dotSize, dx: Math.cos(dir) * speed, dy: Math.sin(dir) * speed, alpha: 0.5 + Math.random() * 0.5 });
          dotsToAdd++; // Incrementa el contador
          setTimeout(addDot, 10); // Llama a la función nuevamente después de 10ms
        }
      }
      addDot(); // Inicia la creación de puntos
      
      // FUNCIÓN DE ANIMACIÓN: Mueve y dibuja los puntos de la galaxia
      function animateGalaxy() {
        ctx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height); // Limpia el canvas
        
        let hue = 55;          // Tono amarillo para los puntos
        let speedFactor = 1;   // Factor de velocidad inicial
        
        // Si hay analizador de audio, ajusta la velocidad según el volumen de la música
        if (analyser && dataArray) {
          analyser.getByteFrequencyData(dataArray); // Obtiene datos de frecuencia
          let avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length; // Promedio de volumen
          speedFactor = 0.7 + (avg / 255) * 2.5; // Calcula factor de velocidad (0.7 a 3.2)
        }
        
        // Recorre todos los puntos
        for (let dot of dots) {
          ctx.beginPath();      // Comienza nuevo trazado
          ctx.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI); // Dibuja el punto
          ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${dot.alpha})`; // Color amarillo brillante
          ctx.shadowColor = `hsla(${hue},80%,70%,0.5)`; // Color de sombra
          ctx.shadowBlur = 1;   // Difuminado de sombra
          ctx.fill();           // Rellena el punto
          
          // Mueve el punto según su velocidad y el factor de la música
          dot.x += dot.dx * speedFactor;
          dot.y += dot.dy * speedFactor;
          
          // Teletransporta el punto si sale de la pantalla (aparece del otro lado)
          if (dot.x < 0) dot.x = galaxyCanvas.width;
          if (dot.x > galaxyCanvas.width) dot.x = 0;
          if (dot.y < 0) dot.y = galaxyCanvas.height;
          if (dot.y > galaxyCanvas.height) dot.y = 0;
        }
        requestAnimationFrame(animateGalaxy); // Solicita el siguiente frame
      }
      
      // Hace visible el canvas gradualmente después de 50ms
      setTimeout(function() {
        galaxyCanvas.style.opacity = '1';
      }, 50);
      
      animateGalaxy(); // Inicia la animación de la galaxia
    }
  }, 2000); // Espera 2 segundos antes de mostrar la galaxia
  
  // Mostrar mensajes de la flor (texto que aparece en pantalla)
  var msg = document.querySelector('.flower-message');
  
  // Array con los mensajes que aparecerán uno tras otro
  const messages = [
    'Esta flor es para ti',
    'Te amo mucho',
    'Gracias por todo',
    '¡Eres la mejor!',
    '¡Feliz dia mami!'
  ];
  
  // Si existe el elemento para mensajes
  if (msg) {
    msg.style.display = '';     // Muestra el elemento
    msg.style.opacity = 1;      // Lo hace completamente visible
    let current = 0;            // Índice del mensaje actual
    
    // FUNCIÓN: Escribe el texto letra por letra (efecto máquina de escribir)
    // text: el texto a escribir, cb: función a ejecutar cuando termina
    function typeText(text, cb) {
      msg.textContent = '';     // Limpia el mensaje actual
      let i = 0;                // Contador de letras
      
      // FUNCIÓN INTERNA: Escribe una letra y programa la siguiente
      function type() {
        if (i < text.length) {
          msg.textContent += text.charAt(i); // Agrega una letra
          i++;                               // Incrementa el contador
          setTimeout(type, 90);              // Espera 90ms y escribe la siguiente
        } else if (cb) {
          setTimeout(cb, 1000);              // Espera 1 segundo y ejecuta el callback
        }
      }
      type(); // Inicia el efecto de escritura
    }
    
    // FUNCIÓN: Muestra el siguiente mensaje de la lista
    function showNext() {
      if (current < messages.length) {
        // Muestra el mensaje actual y cuando termina pasa al siguiente
        typeText(messages[current], function() {
          current++;        // Incrementa el índice
          showNext();       // Llama a la función para el siguiente mensaje
        });
      } else {
        // Si ya mostró todos los mensajes y existe la función animateHeart, la ejecuta
        if (typeof animateHeart === 'function') animateHeart();
      }
    }
    
    showNext(); // Inicia la secuencia de mensajes
  }
});