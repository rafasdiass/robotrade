import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { GoogleAuthProvider, signInWithPopup, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(this.auth, provider);
  }

  async signOut() {
    return await signOut(this.auth);
  }
}