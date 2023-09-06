import { Injectable, Inject } from '@angular/core';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { Firestore, setDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<FirebaseUser | null>;

  constructor(@Inject(Auth) public auth: Auth, private userService: UserService, private db: Firestore) {
    this.user$ = new Observable((subscriber) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => subscriber.next(user));
      return unsubscribe;
    });
  }

  async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const firebaseUser = userCredential.user;
      if (firebaseUser) {
        await this.userService.updateUserOnlineStatus(firebaseUser.uid, true);
      }
      return firebaseUser;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  async register(email: string, password: string, displayName: string): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const firebaseUser = userCredential.user;
      if (firebaseUser && firebaseUser.email) {
        await updateProfile(firebaseUser, { displayName });
        const user = new User(firebaseUser.uid, firebaseUser.email, displayName, true);
        await setDoc(doc(this.db, 'users', firebaseUser.uid), user.toFirestore());
      }
      return firebaseUser;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (user) {
        await this.userService.updateUserOnlineStatus(user.uid, false);
      }
      await signOut(this.auth);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  async socialSignIn(platform: string): Promise<FirebaseUser> {
    let provider: any;

    if (platform === 'google') {
      provider = new GoogleAuthProvider();
    } else {
      return Promise.reject(new Error('Plataforma não suportada'));
    }

    try {
      const userCredential = await signInWithPopup(this.auth, provider);
      return userCredential.user;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  getUser(): Observable<FirebaseUser | null> {
    return this.user$;
  }

  async updateProfile(user: FirebaseUser, displayName: string): Promise<void> {
    try {
      await updateProfile(user, { displayName });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }
}
