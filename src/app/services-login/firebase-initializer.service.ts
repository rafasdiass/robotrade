import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseInitializerService {
  constructor() {
    initializeApp(environment.firebaseConfig); // Usando firebaseConfig aqui
  }
}
