import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { toast } from 'react-toastify';

// Verificar variáveis de ambiente
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(
  varName => !import.meta.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error('Variáveis de ambiente do Firebase ausentes:', missingEnvVars);
  toast.error('Erro na configuração do Firebase');
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
const auth = getAuth(app);
auth.useDeviceLanguage();
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Configurar provedor Google
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configurar persistência offline
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Múltiplas abas abertas, persistência offline disponível apenas em uma aba.');
    } else if (err.code === 'unimplemented') {
      console.warn('O navegador não suporta persistência offline.');
    }
  });
} catch (err) {
  console.warn('Erro ao configurar persistência offline:', err);
}

// Monitorar estado da conexão
if (typeof window !== 'undefined') {
  let isOnline = true;
  window.addEventListener('online', () => {
    if (!isOnline) {
      toast.success('Conexão restaurada!');
      isOnline = true;
    }
  });
  
  window.addEventListener('offline', () => {
    toast.warning('Você está offline. Algumas funcionalidades podem estar limitadas.');
    isOnline = false;
  });
}

export { auth, db, storage, googleProvider };
export default app;