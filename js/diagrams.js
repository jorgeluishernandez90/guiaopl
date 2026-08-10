// Diagramas SVG con estilo propio (tokens de color vía CSS variables inline)
// Cada función devuelve el markup SVG + caption.

const DIAGRAMS = {
  "diagrama-division-poderes": {
    caption: "Los dos ejes del modelo constitucional mexicano",
    svg: `
    <svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama de la división vertical y horizontal del poder en México">
      <style>
        .lbl { font: 600 13px 'Space Grotesk', sans-serif; fill: #1C1420; }
        .lbl-eje { font: 700 11px 'IBM Plex Mono', monospace; fill: #921257; letter-spacing:.04em; text-transform:uppercase; }
        .box { fill: #FFFFFF; stroke: #EBDCE4; stroke-width: 1.5; }
        .box-fill { fill: #FFE3F0; stroke: #D6127F; stroke-width: 1.5; }
      </style>
      <!-- Eje horizontal: separación de poderes -->
      <text x="20" y="24" class="lbl-eje">Eje horizontal · separación de poderes</text>
      <rect x="20" y="36" width="200" height="70" rx="10" class="box-fill"/>
      <text x="120" y="66" text-anchor="middle" class="lbl">Ejecutivo</text>
      <text x="120" y="86" text-anchor="middle" font-size="11" fill="#55414C">Presidencia</text>
      <rect x="260" y="36" width="200" height="70" rx="10" class="box-fill"/>
      <text x="360" y="66" text-anchor="middle" class="lbl">Legislativo</text>
      <text x="360" y="86" text-anchor="middle" font-size="11" fill="#55414C">Congreso de la Unión</text>
      <rect x="500" y="36" width="200" height="70" rx="10" class="box-fill"/>
      <text x="600" y="66" text-anchor="middle" class="lbl">Judicial</text>
      <text x="600" y="86" text-anchor="middle" font-size="11" fill="#55414C">SCJN · TEPJF · Juzgados</text>

      <!-- Eje vertical: federalismo -->
      <text x="20" y="150" class="lbl-eje">Eje vertical · federalismo</text>
      <rect x="20" y="162" width="660" height="46" rx="10" class="box"/>
      <text x="350" y="190" text-anchor="middle" class="lbl">Federación</text>

      <rect x="20" y="222" width="320" height="46" rx="10" class="box"/>
      <text x="180" y="250" text-anchor="middle" class="lbl">32 Entidades federativas</text>

      <rect x="360" y="222" width="340" height="46" rx="10" class="box"/>
      <text x="530" y="250" text-anchor="middle" class="lbl">Municipios / demarcaciones</text>

      <line x1="350" y1="208" x2="350" y2="222" stroke="#D6127F" stroke-width="2"/>
    </svg>`
  }
};
