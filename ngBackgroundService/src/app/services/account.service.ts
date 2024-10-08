import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

const CONNECTION_LOCALSTORAGE_KEY = "connected";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = "https://localhost:7056/";
  apiBaseUrl = this.baseUrl + "api/"
  accountBaseUrl = this.apiBaseUrl + "Account/";

  username = "test";
  motDePasse = "Passw0rd!";

  constructor(public http: HttpClient) { }

  async register(){
    let registerData = {
      username: this.username,
      email : this.username + "@test.com",
      password : this.motDePasse,
      passwordConfirm : this.motDePasse,
    }
    await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Register', registerData));
  }

  async login(){
    let registerData = {
      username : this.username,
      password : this.motDePasse
    }
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Login', registerData));
    localStorage.setItem(CONNECTION_LOCALSTORAGE_KEY, registerData.username);
    localStorage.setItem("token", result.token);
  }

  async logout(){
    await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'Logout'));
    localStorage.removeItem(CONNECTION_LOCALSTORAGE_KEY);
    localStorage.removeItem("token");
  }

  isLoggedIn() : Boolean{
    return localStorage.getItem(CONNECTION_LOCALSTORAGE_KEY) != null;
  }

}
