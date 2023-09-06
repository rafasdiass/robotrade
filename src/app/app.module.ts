import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarPageModule } from './components/navbar/navbar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';  // Corrigido aqui

// AngularFire
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';
import { provideStorage, getStorage } from '@angular/fire/storage';

// Services
import { RoboService } from './services/robo.service';
import { ApiService } from './services/api.service';
import { CurrencyPairService } from './services/currency-pair.service';
import { UtilService } from './services/util.service';
import { DecisionService } from './services/decision.service';
import { AuthService } from './services-login/auth-service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    NavbarPageModule,
    ReactiveFormsModule,
    FormsModule,
    NgChartsModule, 
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    RoboService,
    ApiService,
    CurrencyPairService,
    UtilService,
    DecisionService,
    AuthService,
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
