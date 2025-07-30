const sonidos = {
  confeti: new Audio('sonidos/sonido_confeti.mp3'),
  alerta: new Audio('sonidos/sonido_alerta.mp3'),
  gay: new Audio('sonidos/sonido_gay.mp3'),
  martian: new Audio('sonidos/sonido_martian.mp3'),
  oscurosecreto: new Audio('sonidos/sonido_oscurosecreto.mp3')
};

// Volúmenes individuales
sonidos.confeti.volume = 1;         // Suave, alegre
sonidos.alerta.volume = 0.5;          // Un poco más bajo para no asustar
sonidos.gay.volume = 0.5;            // Ligeramente más fuerte, efecto divertido
sonidos.martian.volume = 0.50;        // Medio
sonidos.oscurosecreto.volume = 1;   // Misterioso, equilibrado

function irAPantalla2() {
  const hex = document.getElementById('hexInput').value.trim().toLowerCase();
  if (!/^#?[0-9a-f]{3,6}$/i.test(hex)) {
    alert("Introduce un código HEX válido.");
    return;
  }

  document.getElementById('pantalla1').style.display = 'none';
  document.getElementById('pantalla2').style.display = 'block';
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function colorDistance(c1, c2) {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

function esColorHumano(rgb, hex) {
  const hexLower = hex.toLowerCase();
  if (hexLower === "ffffff" || hexLower === "#ffffff") return true;
  if (hexLower === "000000" || hexLower === "#000000") return true;

  const minDistancia = Math.min(...tonosPiel.map(t => colorDistance(rgb, t.rgb)));

  const intensidad = Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b);
  const brillo = (rgb.r + rgb.g + rgb.b) / 3;

  const esNatural = intensidad < 80 && brillo > 40 && brillo < 220;

  return minDistancia < 100 && esNatural;
}

const tonosPiel = [
  { tono: "claro", rgb: { r: 240, g: 215, b: 190 } },
  { tono: "medio", rgb: { r: 198, g: 134, b: 66 } },
  { tono: "oscuro", rgb: { r: 110, g: 60, b: 40 } }
];

const paises = {
  claro: {
    claros: ["Suecia", "Noruega", "Finlandia", "Rusia"],
    oscuros: ["España", "Italia", "Argentina", "Chile", "USA"],
    asiaticos: ["Japón", "Corea del Sur", "China"]
  },
  medio: {
    claros: ["Portugal", "Turquía", "Uzbekistán"],
    oscuros: ["México", "Colombia", "Perú", "Brasil", "India", "USA"],
    asiaticos: ["Vietnam", "Tailandia", "Filipinas", "Malasia"]
  },
  oscuro: {
    claros: ["Sudáfrica"],
    oscuros: ["Nigeria", "Angola", "Etiopía", "Camerún", "Kenia"],
    asiaticos: ["Papúa Nueva Guinea", "Indonesia"]
  }
};

const coloresBroma = [
  { 
    nombre: "Springfield", 
    test: ({ r, g, b }) => r > 200 && g > 200 && b < 100 
  },
  { 
    nombre: "Tenemos al mismísimo Shrek",
    test: ({ r, g, b }) => g > 120 && r < 100,
    mensaje: "Ah perro, eres Shrek.",
    imagen: "martianmanhunter.jpg",
    sonido: "martian"
  },
  { 
    nombre: "Pandora", 
    test: ({ r, g, b }) => b > 160 && r < 100 
  }
];

function analizarColor() {
  const hexRaw = document.getElementById('hexInput').value.trim().toLowerCase();
  const ojos = document.querySelector('input[name="ojos"]:checked');

  if (!/^#?[0-9a-f]{3,6}$/i.test(hexRaw)) {
    alert("Introduce un código HEX válido.");
    return;
  }
  if (!ojos) {
    alert("Selecciona un tipo de ojos.");
    return;
  }

  const hex = hexRaw.replace("#", "");
  const ojosTipo = ojos.value;
  const rgb = hexToRgb(hex);

  // Colores broma tienen prioridad
for (const broma of coloresBroma) {
  if (broma.test(rgb)) {
    // Reproducir sonido si tiene
    if (broma.sonido && sonidos[broma.sonido]) {
      sonidos[broma.sonido].currentTime = 0;
      sonidos[broma.sonido].play();
    }

    const titulo = broma.mensaje || `Bro tu gente se encuentra en ${broma.nombre}.`;
    const imagen = broma.imagen || `${broma.nombre.toLowerCase()}.jpg`;
    mostrarResultado(broma.nombre, titulo, imagen, false);
    return;
  }
}

  if (!esColorHumano(rgb, hex)) {
    mostrarResultado(
      "Color sospechoso",
      "Bro no mientas, si de verdad eres de ese color busca un médico.",
      "nohumano.jpg",
      false,
      sonidos.alerta
    );
    return;
  }

  // Determinar tono específico
  let tonoCercano;
  if (hex === "ffffff") {
    tonoCercano = tonosPiel.find(t => t.tono === "claro");
  } else if (hex === "000000") {
    tonoCercano = tonosPiel.find(t => t.tono === "oscuro");
  } else {
    tonoCercano = tonosPiel[0];
    let menorDistancia = Infinity;
    for (const t of tonosPiel) {
      const dist = colorDistance(rgb, t.rgb);
      if (dist < menorDistancia) {
        menorDistancia = dist;
        tonoCercano = t;
      }
    }
  }

  // Easter egg especial solo para "oscuro"
if (tonoCercano.tono === "oscuro" && Math.random() < 0.25) {
  sonidos.oscurosecreto.currentTime = 0;
  sonidos.oscurosecreto.play();

  mostrarResultado(
    "Alto ahí caballero",
    "Esto es un chequeo de rutina, por favor entregue su ID para comprobar que todo está en orden e intente de nuevo.",
    "sombras.jpg",
    false
  );
  return;
}

  // Easter egg global
  if (Math.random() < 0.25) {
    mostrarResultado(
      "Gaylandia",
      "ERES GAY! FELICIDADES EN 2025 PUEDES SER GAY SIN PROBLEMAS.",
      "gaylandia.jpg",
      true,
      sonidos.gay
    );
    return;
  }

  // País normal
  const posibles = paises[tonoCercano.tono][ojosTipo];
  const elegido = posibles[Math.floor(Math.random() * posibles.length)];

  mostrarResultado(
    elegido,
    `Tu tono de piel y tipo de ojos es común en ${elegido}.`,
    `${quitarTildes(elegido.toLowerCase())}.jpg`,
    true,
    sonidos.confeti
  );
}

function mostrarResultado(tituloTexto, descripcionTexto, imagenArchivo, confettiActivo = true) {
  const pantalla3 = document.getElementById('pantalla3');
  const titulo = document.getElementById('titulo');
  const descripcion = document.getElementById('descripcion');
  const imagen = document.getElementById('imagen');

  // Limpia la imagen anterior antes de mostrar algo nuevo
  imagen.src = '';

  // Mostrar pantalla final
  document.getElementById('pantalla1').style.display = 'none';
  document.getElementById('pantalla2').style.display = 'none';
  pantalla3.style.display = 'block';

  // Asignar contenido
  titulo.textContent = tituloTexto;
  descripcion.textContent = descripcionTexto;
  imagen.src = `imagenes/${imagenArchivo}`;

  // Sonidos según el título del resultado
  if (tituloTexto === "Gaylandia") {
    sonidos.gay.play();
    lanzarEfectoGay(); // si decides añadirlo
  } else if (tituloTexto === "Reino de las Sombras") {
    sonidos.oscurosecreto.play();
    lanzarEfectoOscuro(); // si decides añadirlo
  } else if (tituloTexto === "martian") {
    sonidos.martian.play();
    lanzarEfectoMartian(); // si decides añadirlo
  } else if (confettiActivo) {
    sonidos.confeti.play();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}


function reiniciar() {
  document.getElementById('hexInput').value = '';
  document.querySelectorAll('input[name="ojos"]').forEach(input => input.checked = false);

  document.getElementById('pantalla3').style.display = 'none';
  document.getElementById('pantalla1').style.display = 'block';

  // Limpiar imagen y detener sonidos si se están reproduciendo
  document.getElementById('imagen').src = '';

  for (const sonido of Object.values(sonidos)) {
    sonido.pause();
    sonido.currentTime = 0;
  }
}


function quitarTildes(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").replace(/ /g, "_");
}