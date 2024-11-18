import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, initializeFirestore, enableIndexedDbPersistence, addDoc, collection, serverTimestamp, getDocs, updateDoc } from 'firebase/firestore';
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

// Função para adicionar dados de teste
export const seedTestData = async () => {
  try {
    console.log('Iniciando seed de dados de teste...');

    // Array com lugares de teste
    const testPlaces = [
      {
        type: 'igreja',
        name: 'Igreja Nossa Senhora da Glória',
        images: ['https://images.unsplash.com/photo-1577164213863-69dd2a20cda8'],
        description: 'Uma bela igreja histórica no coração da cidade',
        address: 'Rua da Igreja, 123 - Centro',
        latitude: -23.550520,
        longitude: -46.633308,
        status: 'active',
        phone: '(11) 3333-4444',
        email: 'contato@igreja.com',
        hours: 'Segunda a Domingo: 8h às 20h',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'templo',
        name: 'Templo Zen Budista',
        images: ['https://images.unsplash.com/photo-1580834341580-8c17a3a630ca'],
        description: 'Templo tradicional com jardim zen',
        address: 'Rua do Templo, 456 - Jardim Oriental',
        latitude: -23.557890,
        longitude: -46.639910,
        status: 'active',
        phone: '(11) 5555-6666',
        email: 'contato@templo.com',
        hours: 'Terça a Domingo: 9h às 18h',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'capela',
        name: 'Capela Santa Rita',
        images: ['https://images.unsplash.com/photo-1548277687-13c34c51d076'],
        description: 'Pequena capela histórica',
        address: 'Rua da Capela, 789 - Vila Santa',
        latitude: -23.545678,
        longitude: -46.627890,
        status: 'active',
        phone: '(11) 7777-8888',
        email: 'contato@capela.com',
        hours: 'Todos os dias: 7h às 19h',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Adicionar cada lugar ao Firestore
    for (const place of testPlaces) {
      const docRef = await addDoc(collection(db, 'places'), {
        ...place,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Lugar adicionado com ID:', docRef.id);
    }

    console.log('Seed de dados concluído com sucesso!');
    toast.success('Dados de teste adicionados com sucesso!');
  } catch (error) {
    console.error('Erro ao fazer seed dos dados:', error);
    toast.error('Erro ao adicionar dados de teste');
  }
};

// Função para atualizar documentos existentes
export const updateExistingPlaces = async () => {
  try {
    console.log('Iniciando atualização dos lugares existentes...');
    
    // Buscar todos os documentos da coleção places
    const querySnapshot = await getDocs(collection(db, 'places'));
    
    console.log(`Encontrados ${querySnapshot.size} documentos para atualizar`);
    
    // Atualizar cada documento
    const updatePromises = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      
      // Dados a serem atualizados/adicionados
      const updates = {
        status: 'active', // Tornar todos ativos para aparecer no painel
        type: data.type || 'igreja', // Definir tipo padrão se não existir
        images: data.images || [], // Manter imagens existentes ou array vazio
        description: data.description || 'Local religioso',
        address: data.address || 'Endereço a confirmar',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        updatedAt: serverTimestamp()
      };
      
      // Atualizar o documento
      await updateDoc(doc.ref, updates);
      console.log(`Documento ${doc.id} atualizado com sucesso`);
    });
    
    // Aguardar todas as atualizações
    await Promise.all(updatePromises);
    
    console.log('Todos os documentos foram atualizados com sucesso!');
    toast.success('Lugares atualizados com sucesso!');
    
  } catch (error) {
    console.error('Erro ao atualizar lugares:', error);
    toast.error('Erro ao atualizar lugares');
  }
};

export { auth, db, storage, googleProvider };
export default app;