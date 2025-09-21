import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class Auth {

  private isAuthenticated = false;

  private authSecretKey = 'Bearer Token' ;

  login(email: string, password: string): boolean{
    if(email == environment.email && password == environment.password){
      const authToken = environment.token; // Generate or receive the token from your server
      localStorage.setItem(this.authSecretKey, authToken);
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  signup(email: string, password: string): boolean{
    // Implement signup logic here (e.g., call to backend API)
    // For demonstration, we'll just return true
    return true;
  }

  isAuthenticatedUser(): boolean {  
    return this.isAuthenticated;
  }

  logout(): void {
    localStorage.removeItem(this.authSecretKey);
    this.isAuthenticated = false;
  }
}
