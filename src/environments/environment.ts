import { API_KEYS } from './api-keys'; // Importa as chaves do seu arquivo api-keys.ts

export const environment = {
  production: false,
  firebase: {
    projectId: API_KEYS.firebase.projectId,
    appId: API_KEYS.firebase.appId,
    storageBucket: API_KEYS.firebase.storageBucket,
    locationId: 'southamerica-east1',
    apiKey: API_KEYS.firebase.apiKey,
    authDomain: API_KEYS.firebase.authDomain,
    messagingSenderId: API_KEYS.firebase.messagingSenderId,
  },
  apiEnv: {
    apiKey: API_KEYS.alphaVantage,
    baseUrl: 'https://www.alphavantage.co/query'  // Atualizado aqui
  }
};
