import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root"})

export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router){}

  getToken(){
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email,password};
    this.http.post("http://localhost:3000/api/user/signup", authData)
    .subscribe(response=>{
      console.log(response);
      this.router.navigate(['/login']);
    });
  }

  loginUser (email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
    .subscribe(response=>{
      const token = response.token;
      this.token = token;
      if (this.token){
        const expiresInDuration = response.expiresIn;
        console.log(response.expiresIn);
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.authStatusListner.next(true);
        const now = new Date();
        const expirationDate = new Date (now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token,expirationDate);
        this.router.navigate(['/']);
      }
    });
  }

  autoAuthUser(){
    const authInfo = this.getAuthData();
    if (!authInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListner.next(true);
    }
}

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.authStatusListner.next(false);
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate){
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }
}
