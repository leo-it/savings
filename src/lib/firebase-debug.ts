import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDEYApj_fR893ERtdvl9sQIfdzLBpNZIDc",
  authDomain: "savings-app-widget.firebaseapp.com",
  projectId: "savings-app-widget",
  storageBucket: "savings-app-widget.firebasestorage.app",
  messagingSenderId: "924625588531",
  appId: "1:924625588531:web:20a8a45a8ac8519563ae46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Debug: Verificar configuración
console.log('🔥 Firebase config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKey: firebaseConfig.apiKey ? '✅ Configurado' : '❌ Faltante'
});

console.log('🔐 Firebase Auth inicializado:', auth ? '✅' : '❌');
console.log('📊 Firestore inicializado:', db ? '✅' : '❌');

export default app; 