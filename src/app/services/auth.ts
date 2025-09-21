import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private isAuthenticated = false;

  private authSecretKey = 'Bearer Token' ;

  login(email: string, password: string): boolean{
    if(email == 'tempuser@gmail.com' && password == "Temp123"){
      const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpheWRlZXAgUGF0aWwiLCJpYXQiOjE1MTYyMzkwMjJ9.yt3EOXf60R62Mef2oFpbFh2ihkP5qZ4fM8bjVnF8YhA'; // Generate or receive the token from your server
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
