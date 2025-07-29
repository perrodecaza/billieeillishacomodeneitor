function irAPantalla2() {
  const hex = document.getElementById('hexInput').value.trim().toLowerCase();
  if (!/^#?[0-9a-f]{3,6}$/i.test(hex)) {
    alert("Introduce un código HEX válido.");
    return;
  }

  // Mostrar pantalla 2
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

// Tonos aproximados de piel humanos
const tonosPiel = [
  { tono: "claro", rgb: { r: 240, g: 215, b: 190 } },
  { tono: "medio", rgb: { r: 198, g: 134, b: 66 } },
  { tono: "oscuro", rgb: { r: 110, g: 60, b: 40 } }
];

// Países por tono y tipo de ojos
const paises = {
  claro: {
    claros: ["Noruega", "Suecia", "Polonia"],
    oscuros: ["Italia", "España", "Argentina"],
    asiaticos: ["Kazajistán", "Uzbekistán"]
  },
  medio: {
    claros: ["Portugal", "Turquía"],
    oscuros: ["Brasil", "México", "India"],
    asiaticos: ["China", "Vietnam", "Corea del Sur"]
  },
  oscuro: {
    claros: ["Sudáfrica"],
    oscuros: ["Nigeria", "Etiopía", "Angola"],
    asiaticos: ["Filipinas", "Indonesia"]
  }
};

// Colores de broma
const coloresBroma = [
  { nombre: "Springfield", test: ({ r, g, b }) => r > 200 && g > 200 && b < 100 },
  { nombre: "Ma'aleca'andra", test: ({ r, g, b }) => g > 120 && r < 100 },
  { nombre: "Pandora", test: ({ r, g, b }) => b > 160 && r < 100 }
];

function analizarColor() {
  const hex = document.getElementById('hexInput').value.trim().toLowerCase();
  const ojos = document.querySelector('input[name="ojos"]:checked');

  if (!/^#?[0-9a-f]{3,6}$/i.test(hex)) {
    alert("Introduce un código HEX válido.");
    return;
  }
  if (!ojos) {
    alert("Selecciona un tipo de ojos.");
    return;
  }

  const ojosTipo = ojos.value;
  const rgb = hexToRgb(hex);

  const resultadoDiv = document.getElementById('resultado');
  const titulo = document.getElementById('titulo');
  const descripcion = document.getElementById('descripcion');
  const imagen = document.getElementById('imagen');

  // 1 de cada 4 veces: Gaylandia
  if (Math.random() < 0.25) {
    mostrarResultado("Gaylandia", "Un lugar mágico donde todo es posible.", "gaylandia.jpg");
    return;
  }

  // Colores broma
  for (const broma of coloresBroma) {
    if (broma.test(rgb)) {
      mostrarResultado(broma.nombre, `Bro tu gente se encuentra en ${broma.nombre}.`, `${broma.nombre.toLowerCase()}.jpg`);
      return;
    }
  }

  // Determinar tono más cercano
  let tonoCercano = tonosPiel[0];
  let menorDistancia = Infinity;
  for (const t of tonosPiel) {
    const dist = colorDistance(rgb, t.rgb);
    if (dist < menorDistancia) {
      menorDistancia = dist;
      tonoCercano = t;
    }
  }

  const posibles = paises[tonoCercano.tono][ojosTipo];
  const elegido = posibles[Math.floor(Math.random() * posibles.length)];
if (elegido === "Gaylandia") {
  mostrarResultado(
    "Gaylandia",
    "Una tierra mística donde los unicornios votan, los árboles susurran cuentos y todo el mundo sabe bailar salsa.",
    "gaylandia.jpg"
  );
} else {
  mostrarResultado(
    elegido,
    `Tu tono de piel y tipo de ojos es común en ${elegido}.`,
    `${elegido.toLowerCase().replace(/ /g, "_")}.jpg`
  );
}

}

function mostrarResultado(tituloTexto, descripcionTexto, imagenArchivo) {
  document.getElementById('pantalla1').style.display = 'none';
  document.getElementById('pantalla2').style.display = 'none';
  document.getElementById('pantalla3').style.display = 'block';

  const titulo = document.getElementById('titulo');
  const descripcion = document.getElementById('descripcion');
  const imagen = document.getElementById('imagen');

  titulo.textContent = tituloTexto;
  descripcion.textContent = descripcionTexto;
  imagen.src = `imagenes/${imagenArchivo}`;

  // Lanza el confeti 🎉
confetti({
  particleCount: 150,
  spread: 70,
  origin: { y: 0.6 }
});

}

function reiniciar() {
  // Limpiar datos
  document.getElementById('hexInput').value = '';
  document.querySelectorAll('input[name="ojos"]').forEach(input => input.checked = false);

  // Mostrar pantalla inicial
  document.getElementById('pantalla3').style.display = 'none';
  document.getElementById('pantalla1').style.display = 'block';
}


