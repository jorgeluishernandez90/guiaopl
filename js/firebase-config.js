// ⚠️ Reemplaza estos valores con los de TU proyecto de Firebase.
// Firebase Console → ⚙️ Configuración del proyecto → Tus apps → SDK setup and configuration.
// Estos valores no son secretos (son públicos por diseño en apps web), pero deben
// coincidir con un proyecto donde ya hayas activado:
//   1. Authentication → Sign-in method → Google
//   2. Firestore Database (modo producción, con las reglas de abajo)

const firebaseConfig = {
  apiKey: "AIzaSyC9_6ed1Ry1fZ-eJVEhgG1eMdQwOyoxn9A",
  authDomain: "guiaopl26.firebaseapp.com",
  projectId: "guiaopl26",
  storageBucket: "guiaopl26.firebasestorage.app",
  messagingSenderId: "644606811349",
  appId: "1:644606811349:web:19c975b20e94fc375d165c"
};

/*
Reglas de Firestore sugeridas (Firestore → Reglas):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
*/
