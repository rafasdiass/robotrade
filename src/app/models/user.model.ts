export class User {
    constructor(
      public uid: string,
      public email: string,
      public displayName: string = '',
      public online: boolean = false
    ) {}
  
    toFirestore(): any {
      return {
        uid: this.uid,
        email: this.email,
        displayName: this.displayName,
        online: this.online
      };
    }
  }
  