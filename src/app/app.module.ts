import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarPageModule } from './components/navbar/navbar.module';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// AngularFire
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';

// Services
import { RoboService } from './services/robo.service'; 
import { ApiService } from './services/api.service';  
import { CurrencyPairService } from './services/currency-pair.service';
import { UtilService } from './services/util.service';
import { DecisionService } from './services/decision.service';
import { AuthService } from './services-login/auth-service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    NavbarPageModule,
    ReactiveFormsModule,
    FormsModule,

    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAnalytics(() => getAnalytics())
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    RoboService,  
    ApiService,
    CurrencyPairService,
    UtilService,
    ScreenTrackingService,
    UserTrackingService,
    DecisionService,
    AuthService
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
