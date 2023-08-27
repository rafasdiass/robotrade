import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarPageModule } from './components/navbar/navbar.module';
import { RoboService } from './services/robo.service'; 
import { ApiService } from './services/api.service';  
import { CurrencyPairService } from './services/currency-pair.service';
import { UtilService } from './services/util.service';



// AngularFire
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage'; // Adicionado
import { environment } from '../environments/environment';
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';

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
   
    
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),

    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()), // Adicionado
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    RoboService,  
    ApiService,
    CurrencyPairService,
    UtilService,
    ScreenTrackingService,
    UserTrackingService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
