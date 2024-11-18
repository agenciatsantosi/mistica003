import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, initializeFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
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

console.log('Inicializando Firebase...'); // Debug

const app = initializeApp(firebaseConfig);
console.log('Firebase inicializado com sucesso!'); // Debug
console.log('Projeto ID:', firebaseConfig.projectId); // Debug

// Inicializar serviços
const auth = getAuth(app);
auth.useDeviceLanguage();
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  cache: {
    persistenceEnabled: true,
    persistenceSettings: {
      synchronizeTabs: true
    }
  }
});
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Habilitar persistência offline
enableIndexedDbPersistence(db)
  .then(() => {
    console.log('Persistência offline habilitada com sucesso!'); // Debug
  })
  .catch((err) => {
    console.error('Erro ao habilitar persistência:', err); // Debug
    if (err.code === 'failed-precondition') {
      console.warn('Múltiplas abas abertas. Persistência disponível em apenas uma aba.');
    } else if (err.code === 'unimplemented') {
      console.warn('O navegador não suporta persistência offline.');
    }
  });

// Configurar provedor Google
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

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