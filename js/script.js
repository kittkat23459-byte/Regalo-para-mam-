// Limpia la consola del navegador para empezar con un entorno limpio
console.clear();

// Declaración de variables con referencias a elementos del DOM
var doc = document;                              // Referencia al objeto document para acceder al DOM
var flower = doc.querySelector('.flower');       // Selecciona el elemento con clase 'flower' (contenedor de la flor)
var range = doc.querySelector('.range');         // Selecciona el elemento con clase 'range' (control deslizante)

// Plantilla HTML para cada parte/pétalo (marca la estructura de cada pieza)
var petalPartMarkup = '<div class="box"> \
                    <div class="shape"></div> \
                </div>';

// Configuración de la geometría de la flor
var maxParts = 20;          // Número máximo de partes/capas por cada pétalo
var maxPetalsDef = 6;       // Número definido de pétalos (6 por defecto)
var maxPetals = maxPetalsDef; // Asigna el valor por defecto a la variable activa

// Variables para el tamaño de fuente escalonado
var partsFontStepDef = 25 / maxParts;  // Paso definido: 25 dividido entre número de partes (1.25)
var partsFontStep = partsFontStepDef;   // Asigna el paso calculado
var huetStep = 150 / maxParts;          // Paso para variación de tono (no usado actualmente)

// Llama a la función principal para crear la flor 3D
createFlower();

// Función principal que crea la estructura completa de la flor
function createFlower() {
    
    // Calcula el ángulo entre cada pétalo (360 grados / número de pétalos)
    var angle = 360 / maxPetals;
    
    // Bucle: crea cada pétalo individualmente
    for (var i = 0; i < maxPetals; i++) {
        var petal = createPetal();           // Crea un pétalo completo
        var currAngle = angle * i + 'deg';   // Ángulo actual para este pétalo (en grados)
        
        // Construye la transformación 3D: rota en Y, inclina en X, y desplaza en Z
        var transform = 'transform: rotateY(' + currAngle + ') rotateX(-30deg) translateZ(9vmin)';
        
        petal.setAttribute('style', transform);  // Aplica la transformación CSS al pétalo
        
        flower.appendChild(petal);               // Agrega el pétalo al contenedor principal
    }
}

// Función que crea un pétalo completo con todas sus capas
function createPetal() {
    
    // Crea la primera caja (parte más interna) con posición 0
    var box = createBox(null, 0);
    
    // Crea el elemento contenedor del pétalo
    var petal = doc.createElement('div');
    petal.classList.add('petal');  // Agrega la clase 'petal' para estilos CSS
    
    // Bucle: crea las capas sucesivas del pétalo (desde 1 hasta maxParts)
    for (var i = 1; i <= maxParts; i++) {
        newBox = createBox(box, i);  // Crea una nueva caja que envuelve a la anterior
        box = newBox;                 // Actualiza la referencia para la siguiente iteración
    }
    
    petal.appendChild(box);  // Agrega la estructura completa al pétalo
    
    return petal;  // Devuelve el pétalo listo para ser añadido a la flor
}

// Función que crea una caja individual (una capa del pétalo)
function createBox(box, pos) {
    
    // Calcula el tamaño de fuente base según la posición (efecto escalonado)
    var fontSize = partsFontStep * (maxParts - pos) + 'vmin';  // Tamaño decreciente para capas externas
    var half = maxParts / 2;  // Punto medio del pétalo (10 cuando maxParts=20)
    
    var bright = '50';  // Brillo inicial (50%)
    
    // Ajusta el tamaño de fuente para la mitad interior (efecto de crecimiento)
    if (pos < half + 1) {
        fontSize = partsFontStep * pos + 'vmin';  // Tamaño creciente para capas internas
    }
    else {
        // Para capas externas, ajusta el brillo (más oscuro hacia afuera)
        bright = 10 + 40 / half * (maxParts - pos);
    }
    
    // Configuración de color: rosa pastel con variación
    var baseHue = 320;                              // Tono base: rosa (320 grados en HSL)
    var hueVariation = 30;                          // Variación máxima de tono (±30 grados)
    var saturation = 70 + (20 * pos / maxParts);    // Saturación: aumenta gradualmente con la posición
    // Construye el color HSL con variación de tono según la posición
    var color = 'hsl(' + (baseHue + (hueVariation * pos / maxParts)) + ', ' + saturation + '%, ' + bright + '%)';
    
    // Crea el elemento 'shape' (forma visual dentro de la caja)
    var newShape = doc.createElement('div');
    newShape.classList.add('shape');
    
    // Crea el elemento 'box' (contenedor de la capa)
    var newBox = doc.createElement('div');
    newBox.classList.add('box');
    
    // Construye el estilo CSS inline para esta caja
    var boxStyle = [
        'color: ' + color,        // Color del texto/forma
        'font-size: ' + fontSize  // Tamaño de fuente (controla el tamaño de la capa)
    ].join(';');  // Une las propiedades con ';'
    newBox.setAttribute('style', boxStyle);  // Aplica el estilo
    
    // Si existe una caja anterior, la anida dentro de la nueva (estructura jerárquica)
    if (box) {
        newBox.appendChild(box);
    }
    
    // Agrega la forma visual a la nueva caja
    newBox.appendChild(newShape);
    
    return newBox;  // Devuelve la caja creada
}

// Función que crea una galaxia animada de puntos rosados (fondo dinámico)
function drawGalaxy() {
    // Busca el elemento canvas en el documento
    var canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return;  // Si no existe, sale de la función
    
    var ctx = canvas.getContext('2d');  // Obtiene el contexto 2D para dibujar
    
    // Función para redimensionar el canvas al tamaño de la ventana
    function resize() {
        canvas.width = window.innerWidth;    // Ancho = ancho de la ventana
        canvas.height = window.innerHeight;  // Alto = alto de la ventana
    }
    resize();  // Aplica el tamaño inicial
    
    // Escucha el evento de redimensionamiento para ajustar el canvas
    window.addEventListener('resize', resize);
    
    var stars = [];      // Array para almacenar las estrellas/partículas
    var numStars = 120;  // Número total de partículas en la galaxia
    
    // Bucle: crea cada estrella con propiedades aleatorias
    for (var i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,      // Posición X aleatoria
            y: Math.random() * canvas.height,     // Posición Y aleatoria
            r: Math.random() * 1.5 + 0.5,        // Radio entre 0.5 y 2.0 píxeles
            dx: (Math.random() - 0.5) * 0.7,      // Velocidad X: entre -0.35 y 0.35
            dy: (Math.random() - 0.5) * 0.7,      // Velocidad Y: entre -0.35 y 0.35
            alpha: Math.random() * 0.5 + 0.5      // Opacidad entre 0.5 y 1.0
        });
    }
    
    // Función de animación (se llama recursivamente)
    function animate() {
        // Limpia todo el canvas en cada fotograma
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Recorre todas las estrellas para dibujarlas y actualizarlas
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];  // Obtiene la estrella actual
            
            ctx.save();                 // Guarda el estado actual del contexto
            ctx.globalAlpha = s.alpha;  // Aplica la opacidad individual
            
            ctx.beginPath();            // Comienza un nuevo trazado
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);  // Dibuja un círculo (estrella)
            ctx.fillStyle = 'rgba(255,182,193,0.9)'; // Color rosa claro (baby pink)
            ctx.shadowColor = '#ffb6d5';              // Color de la sombra (rosa más claro)
            ctx.shadowBlur = 2;                       // Difuminado de sombra (bajo para rendimiento)
            ctx.fill();                 // Rellena el círculo
            
            ctx.restore();              // Restaura el estado del contexto
            
            // Actualiza la posición según la velocidad
            s.x += s.dx;
            s.y += s.dy;
            
            // Rebote en los bordes: invierte velocidad si toca los límites
            if (s.x < 0 || s.x > canvas.width) s.dx *= -1;
            if (s.y < 0 || s.y > canvas.height) s.dy *= -1;
        }
        
        requestAnimationFrame(animate);  // Solicita el siguiente fotograma (animación continua)
    }
    
    animate();  // Inicia la animación
}

// Escucha el evento 'DOMContentLoaded' (cuando el DOM está completamente cargado)
document.addEventListener('DOMContentLoaded', drawGalaxy);

// Función de utilidad para mostrar mensajes en consola (más corto que console.log)
function out(content) {
    console.log(content);  // Imprime el contenido en la consola
}