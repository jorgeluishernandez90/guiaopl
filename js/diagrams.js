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
  },

  "diagrama-etapas-proceso-electoral": {
    caption: "Etapas del proceso electoral federal",
    svg: `
    <svg viewBox="0 0 760 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Línea de tiempo con las cuatro etapas del proceso electoral federal">
      <style>
        .n-lbl { font: 700 13px 'Space Grotesk', sans-serif; fill: #1C1420; }
        .n-sub { font: 400 11px 'Inter', sans-serif; fill: #55414C; }
        .n-num { font: 700 15px 'IBM Plex Mono', monospace; fill: #FFFFFF; }
      </style>
      <line x1="60" y1="40" x2="700" y2="40" stroke="#EBDCE4" stroke-width="4"/>
      <line x1="60" y1="40" x2="700" y2="40" stroke="#D6127F" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/>

      <g>
        <circle cx="90" cy="40" r="20" fill="#921257"/>
        <text x="90" y="45" text-anchor="middle" class="n-num">1</text>
        <text x="90" y="82" text-anchor="middle" class="n-lbl">Preparación</text>
        <text x="90" y="98" text-anchor="middle" class="n-sub">de la elección</text>
      </g>
      <g>
        <circle cx="290" cy="40" r="20" fill="#C4177A"/>
        <text x="290" y="45" text-anchor="middle" class="n-num">2</text>
        <text x="290" y="82" text-anchor="middle" class="n-lbl">Jornada</text>
        <text x="290" y="98" text-anchor="middle" class="n-sub">electoral</text>
      </g>
      <g>
        <circle cx="490" cy="40" r="20" fill="#D6127F"/>
        <text x="490" y="45" text-anchor="middle" class="n-num">3</text>
        <text x="490" y="82" text-anchor="middle" class="n-lbl">Resultados y</text>
        <text x="490" y="98" text-anchor="middle" class="n-sub">declaraciones de validez</text>
      </g>
      <g>
        <circle cx="690" cy="40" r="20" fill="#EA4FA0"/>
        <text x="690" y="45" text-anchor="middle" class="n-num">4</text>
        <text x="690" y="82" text-anchor="middle" class="n-lbl">Constancias</text>
        <text x="690" y="98" text-anchor="middle" class="n-sub">de mayoría / RP</text>
      </g>
    </svg>`
  },

  "diagrama-organos-ine": {
    caption: "Órganos centrales y órganos desconcentrados del INE",
    svg: `
    <svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama de los órganos centrales y desconcentrados del Instituto Nacional Electoral">
      <style>
        .o-lbl { font: 700 13px 'Space Grotesk', sans-serif; fill: #1C1420; }
        .o-sub { font: 400 10.5px 'Inter', sans-serif; fill: #55414C; }
        .o-tag { font: 700 10px 'IBM Plex Mono', monospace; fill: #921257; letter-spacing:.04em; text-transform:uppercase; }
        .o-central { fill: #FFE3F0; stroke: #D6127F; stroke-width: 1.5; }
        .o-desc { fill: #FFFFFF; stroke: #1C1420; stroke-width: 1.5; stroke-dasharray: 5 4; }
      </style>
      <text x="20" y="22" class="o-tag">Órganos centrales</text>
      <rect x="20" y="34" width="210" height="60" rx="10" class="o-central"/>
      <text x="125" y="60" text-anchor="middle" class="o-lbl">Consejo General</text>
      <text x="125" y="78" text-anchor="middle" class="o-sub">Máximo órgano de dirección</text>

      <rect x="255" y="34" width="210" height="60" rx="10" class="o-central"/>
      <text x="360" y="60" text-anchor="middle" class="o-lbl">Junta General Ejecutiva</text>
      <text x="360" y="78" text-anchor="middle" class="o-sub">Órgano ejecutivo central</text>

      <rect x="490" y="34" width="210" height="60" rx="10" class="o-central"/>
      <text x="595" y="60" text-anchor="middle" class="o-lbl">Direcciones Ejecutivas</text>
      <text x="595" y="78" text-anchor="middle" class="o-sub">Áreas técnicas especializadas</text>

      <line x1="360" y1="94" x2="360" y2="130" stroke="#D6127F" stroke-width="2"/>

      <text x="20" y="150" class="o-tag">Órganos desconcentrados</text>
      <rect x="120" y="162" width="230" height="66" rx="10" class="o-desc"/>
      <text x="235" y="188" text-anchor="middle" class="o-lbl">Juntas y Consejos Locales</text>
      <text x="235" y="204" text-anchor="middle" class="o-sub">32 entidades federativas</text>
      <text x="235" y="220" text-anchor="middle" class="o-sub">Ámbito estatal</text>

      <rect x="370" y="162" width="230" height="66" rx="10" class="o-desc"/>
      <text x="485" y="188" text-anchor="middle" class="o-lbl">Juntas y Consejos Distritales</text>
      <text x="485" y="204" text-anchor="middle" class="o-sub">300 distritos electorales</text>
      <text x="485" y="220" text-anchor="middle" class="o-sub">Ámbito distrital</text>
    </svg>`
  },

  "diagrama-estructura-texto-expositivo": {
    caption: "Arquitectura de un texto expositivo (ámbito de estudio)",
    svg: `
    <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama de la estructura de un texto expositivo: introducción, desarrollo y conclusión">
      <style>
        .t-lbl { font: 700 15px 'Space Grotesk', sans-serif; fill: #FFFFFF; }
        .t-sub { font: 400 11px 'Inter', sans-serif; fill: #55414C; }
        .t-box { stroke-width: 1.5; }
      </style>
      <rect x="20" y="20" width="200" height="52" rx="10" fill="#921257"/>
      <text x="120" y="52" text-anchor="middle" class="t-lbl">Introducción</text>
      <rect x="20" y="80" width="200" height="70" rx="10" fill="#FFFFFF" stroke="#EBDCE4" class="t-box"/>
      <text x="120" y="105" text-anchor="middle" font-size="11" fill="#1C1420" font-weight="700">Contiene:</text>
      <text x="120" y="122" text-anchor="middle" class="t-sub">Tema del texto</text>
      <text x="120" y="138" text-anchor="middle" class="t-sub">Tesis / idea principal</text>

      <rect x="260" y="20" width="200" height="52" rx="10" fill="#C4177A"/>
      <text x="360" y="52" text-anchor="middle" class="t-lbl">Desarrollo</text>
      <rect x="260" y="80" width="200" height="70" rx="10" fill="#FFFFFF" stroke="#EBDCE4" class="t-box"/>
      <text x="360" y="105" text-anchor="middle" font-size="11" fill="#1C1420" font-weight="700">Contiene:</text>
      <text x="360" y="122" text-anchor="middle" class="t-sub">Argumentos y datos</text>
      <text x="360" y="138" text-anchor="middle" class="t-sub">Ejemplos, evidencias</text>

      <rect x="500" y="20" width="200" height="52" rx="10" fill="#D6127F"/>
      <text x="600" y="52" text-anchor="middle" class="t-lbl">Conclusión</text>
      <rect x="500" y="80" width="200" height="70" rx="10" fill="#FFFFFF" stroke="#EBDCE4" class="t-box"/>
      <text x="600" y="105" text-anchor="middle" font-size="11" fill="#1C1420" font-weight="700">Contiene:</text>
      <text x="600" y="122" text-anchor="middle" class="t-sub">Síntesis o cierre</text>
      <text x="600" y="138" text-anchor="middle" class="t-sub">Postura del autor</text>

      <path d="M 220 46 L 258 46" stroke="#921257" stroke-width="2" marker-end="url(#arrow)"/>
      <path d="M 460 46 L 498 46" stroke="#C4177A" stroke-width="2" marker-end="url(#arrow)"/>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#55414C"/>
        </marker>
      </defs>
      <text x="360" y="185" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="10" fill="#921257">Idea principal → argumentos → cierre</text>
    </svg>`
  }
};
