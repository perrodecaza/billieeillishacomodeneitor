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
  { nombre: "Springfield", test: ({ r, g, b }) => r > 200 && g > 200 && b < 100 },
  { nombre: "Ma'aleca'andra", test: ({ r, g, b }) => g > 120 && r < 100 },
  { nombre: "Pandora", test: ({ r, g, b }) => b > 160 && r < 100 }
];

function esColorHumano(rgb, hex) {
  if (hex === "000000" || hex === "ffffff") return true;
  const distanciaMinima = Math.min(
    ...tonosPiel.map(t => colorDistance(rgb, t.rgb))
  );
  return distanciaMinima < 100; // umbral de similitud
}

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

  if (!esColorHumano(rgb, hex)) {
    mostrarResultado(
      "Color sospechoso",
      "Bro no mientas, si de verdad eres de ese color busca un médico.",
      "nohumano.jpg"
    );
    return;
  }

  if (Math.random() < 0.25) {
    mostrarResultado("Gaylandia", "Un lugar mágico donde todo es posible.", "gaylandia.jpg");
    return;
  }

  for (const broma of coloresBroma) {
    if (broma.test(rgb)) {
      mostrarResultado(broma.nombre, `Bro tu gente se encuentra en ${broma.nombre}.`, `${broma.nombre.toLowerCase()}.jpg`);
      return;
    }
  }

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

  mostrarResultado(
    elegido,
    `Tu tono de piel y tipo de ojos es común en ${elegido}.`,
    `${elegido.toLowerCase().replace(/ /g, "_")}.jpg`
  );
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

  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function reiniciar() {
  document.getElementById('hexInput').value = '';
  document.querySelectorAll('input[name="ojos"]').forEach(input => input.checked = false);

  document.getElementById('pantalla3').style.display = 'none';
  document.getElementById('pantalla1').style.display = 'block';
}



