import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken : string;
    expiresIn : string;
    localId: string;
    registered? :boolean
}

@Injectable({
  providedIn : 'root' //the alternative way is to add it in the providers array in app.module.ts
})
export class AuthService
{
  user = new BehaviorSubject<User | null>(null);
  constructor(private http: HttpClient , private router: Router){};
  private tokenExpirationTimer : any;
   //start signup method
   signup(email: string , password: string){
    return  this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA-Wp3Dlge29dGniIpT6W1VafxgMBOqZD8',{
        email : email,
        password : password,
        returnSecureToken : true
      })
      .pipe(
        catchError( this.handleError),
        tap(resData =>{
           this.handleAuthentication(resData.email,resData.localId,resData.idToken,+ resData.expiresIn); })
      );
   }
   //end signup method
   //start signin method
   login(email: string , password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA-Wp3Dlge29dGniIpT6W1VafxgMBOqZD8',{
      email : email,
      password : password,
      returnSecureToken : true
    }).pipe(
      catchError( this.handleError),
      tap(resData =>{
        this.handleAuthentication(resData.email,resData.localId,resData.idToken,+ resData.expiresIn); })
  ); }
   //end signin method
   //start the autologin method : for loging the user immediately if he was logged in and relaod the page
   autoLogin(){

     if(! localStorage.getItem('userData') ){
       return;
     }
     else{
      const userData: {
      email: string ,
      id: string ,
      _token: string,
      _tokenExpirationDate: string
     }
     = { email: '  ' , id: 'vv' , _token : 'nnnnnnnnnnnnnnnn' , _tokenExpirationDate: '102224443'}
     //JSON.parse(localStorage.getItem('userData'));

     const loggedUser = new User(
       userData.email,userData.id,
       userData._token,new Date(userData._tokenExpirationDate)
      );
      if(loggedUser.token){
        this.user.next(loggedUser);
        const expirationDuration =new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
      }
     }

  }
   //end the autologin method
   //start logout method
   logout(){
     this.user.next(null);
       //redirect after we logged out
     this.router.navigate(['/auth']);
       //clear all the data after logging out
      // localStorage.clear(); this option clear all the data another option is
      localStorage.removeItem('userData');
      if(this.tokenExpirationTimer){
        clearTimeout(this.tokenExpirationTimer);
      }
      this.tokenExpirationTimer = null;
   }
   //end logout method
   autoLogout(expirationDuration: number){
      this.tokenExpirationTimer = setTimeout( () =>{
        this.logout()
      },expirationDuration
      )
   }
  //start handling user authentication
  private handleAuthentication(email:string, userId: string , token: string, expiresIn: number){
      //getTime : returns the time in milliseconds so we multiply the expiresIn because itis in seconds
    const expirationDate = new Date (new Date().getTime() + expiresIn * 1000);
    //create our user object
    const user = new User(email,userId,token,expirationDate);
    //emitt it to the application
    this.user.next(user);
    //autologout the user we get after the token expires
    this.autoLogout(expiresIn * 1000);
    //store the user data in the local storage so we donot lose the token on reload
    localStorage.setItem('userData',JSON.stringify(user));
    }
  //end handling user authentication

   //start error handler for handling the http respnses from the firebase api
    private handleError(errorRes: HttpErrorResponse){
      let errorMessage ='unknown error occurred';
      if(! errorRes.error || !errorRes.error.error){
        return throwError(errorMessage);
      }
  switch(errorRes.error.error.message){
    case 'EMAIL_EXISTS' :
                    errorMessage = 'The email address is already in use by another account.'; break;
    case 'OPERATION_NOT_ALLOWED' :
                    errorMessage = 'The email address is already in use by another account.';break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER' :
                    errorMessage = 'The email address is already in use by another account.';break;
    case 'EMAIL_NOT_FOUND' :
                    errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';break;
    case 'INVALID_PASSWORD' :
                    errorMessage = 'The password is invalid or the user does not have a password.';break;
    case 'USER_DISABLED' :
                    errorMessage = 'The user account has been disabled by an administrator.';break;
   }
   return throwError(errorMessage);
    }

}
