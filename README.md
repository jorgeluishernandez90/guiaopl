# Guía SPEN·OPLE 2026

Guía de estudio y simulacro tipo CENEVAL para el **Examen de Conocimientos** de ingreso al
Servicio Profesional Electoral Nacional del sistema de los Organismos Públicos Locales
Electorales — Concurso Público 2026. Preparada para la plaza de **Titular de Órgano
Desconcentrado**.

Sitio 100% estático (HTML/CSS/JS sin build), pensado para publicarse en GitHub Pages, con
inicio de sesión opcional con Google (Firebase) para sincronizar tu progreso entre dispositivos.

## Estructura

```
index.html
css/tokens.css      → paleta, tipografía, espaciado (design tokens)
css/main.css        → componentes (nav, tarjetas, quiz tipo "hoja óptica")
js/app.js           → router + render de lecciones/quizzes + progreso
js/diagrams.js       → diagramas SVG reutilizables
js/firebase-config.js → credenciales de tu proyecto Firebase (edítalo)
data/modules.json    → índice de módulos y temas del examen
data/lecciones/*.json → contenido de cada lección
data/quizzes/*.json   → banco de reactivos por tema
```

Cada tema nuevo son **dos archivos JSON** (lección + quiz) más una línea en `data/modules.json`
apuntando a ellos — no hay que tocar el motor de la app para agregar contenido.

## 1. Probar en local

Como usa `fetch()` para leer los JSON, necesitas servirlo (no basta con abrir `index.html`
directo desde el disco). Con Python instalado:

```bash
cd ople-guia
python3 -m http.server 8000
```

Y abre `http://localhost:8000`.

## 2. Publicar en GitHub Pages

1. Crea un repositorio nuevo (por ejemplo `guia-ople-2026`) y sube todo el contenido de esta
   carpeta a la rama `main`.
2. En GitHub → **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / `(root)`.
3. En un par de minutos tu sitio estará en `https://<tu-usuario>.github.io/guia-ople-2026/`.

## 3. Activar el login con Google (Firebase)

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) y crea un proyecto
   (puedes usar el plan gratuito **Spark**, igual que en el proyecto de la guía IEEG).
2. **Authentication → Sign-in method** → activa **Google**.
3. **Authentication → Settings → Authorized domains** → agrega tu dominio de GitHub Pages
   (ej. `tu-usuario.github.io`).
4. **Firestore Database** → crea la base de datos (modo producción) y pega estas reglas en
   la pestaña **Reglas**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /usuarios/{uid}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

5. **Configuración del proyecto (⚙️) → Tus apps → Web (`</>`)** → registra una app y copia el
   objeto `firebaseConfig` que te da Firebase.
6. Pega esos valores en `js/firebase-config.js`, reemplazando los de ejemplo.
7. Sube el cambio a GitHub. Listo — el botón "Iniciar sesión con Google" del encabezado ya
   guardará tu progreso (lecciones vistas y mejores puntajes) en Firestore.

> Si no configuras Firebase, la app sigue funcionando normal: el progreso simplemente se
> guarda en el `localStorage` de tu navegador (no se sincroniza entre dispositivos).

## Estado del contenido

- ✅ **Módulo C · Tema 1** — Sistema Político Mexicano (lección + simulacro parcial de 7 reactivos)
- ⏳ Resto de temas del módulo C, y módulos A y B — en construcción, siguiendo el orden acordado:
  C → A → B, con un simulacro parcial por tema/módulo y un simulacro final de 130 reactivos
  cronometrado (3h30) al terminar todo el temario.
