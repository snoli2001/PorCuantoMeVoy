import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../pages/models/user.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url ='https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = 'AIzaSyDKp_9AsLYa6ApwdElw71oeSrK55HOLbFE'

  userToken: string;
  // create a new user
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http: HttpClient) {
    this.readToken();
  }

  logout(){
    localStorage.removeItem('token');
  }

  login(user: UserModel){
    const authData = {
      email: user.email,
      password: user.password,
      name: user.name,
      returnSecureToken: true
    };
    return this.http.post(`${this.url}signInWithPassword?key=${this.apiKey}`,
      authData
    ).pipe(
      map( response =>{

        this.saveToken( response['idToken']);

        return response;
      })
    );

  }

  newUser(user: UserModel){
    const authData = {
      email: user.email,
      password: user.password,
      name: user.name,
      returnSecureToken: true
    };

    return this.http.post(`${this.url}signUp?key=${this.apiKey}`,
      authData
      ).pipe(
        map( response =>{
          this.saveToken( response['idToken']);
          // console.log(response.UID)
          return response;
        })
    );
  }

  private saveToken(idToken: string){
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let today = new Date();
    today.setSeconds( 3600 );
    localStorage.setItem('expires', today.getTime().toString() )
  }

  readToken() {
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  isAuthenticated(){
    if( this.userToken.length < 2 ){
      return false;
    }

    const expires = Number(localStorage.getItem('expires'));
    const expiresDate = new Date();

    expiresDate.setTime(expires);
    if ( expiresDate > new Date()){
      return true;
    }else {
      return false;
    }

  }

}
