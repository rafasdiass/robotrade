
import { API_KEYS } from './api-keys';  

export const environment = {
  production: false,
  firebase: API_KEYS.firebase,
  apiEnv: {
    apiKey: API_KEYS.alphaVantage,
    baseUrl: 'https://www.alphavantage.co'
  }
};
