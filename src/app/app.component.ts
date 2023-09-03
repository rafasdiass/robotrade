// app.component.ts

import { Component } from '@angular/core';
import { FirebaseInitializerService } from './services-login/firebase-initializer.service'; // Importe o serviço aqui

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private firebaseInitializer: FirebaseInitializerService) { // Injete o serviço aqui
    // O construtor vazio garante que o FirebaseInitializerService seja instanciado
  }
}
