// ⚠️ Reemplaza estos valores con los de TU proyecto de Firebase.
// Firebase Console → ⚙️ Configuración del proyecto → Tus apps → SDK setup and configuration.
// Estos valores no son secretos (son públicos por diseño en apps web), pero deben
// coincidir con un proyecto donde ya hayas activado:
//   1. Authentication → Sign-in method → Google
//   2. Firestore Database (modo producción, con las reglas de abajo)

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxxxxxxxxxx"
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
