import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector : 'app-auth',
  templateUrl : './auth.component.html'
})
export class AuthComponent{
  isLoginMode = true;
  isLoading = false;
  errorMessage: string = '';

  constructor(private authService: AuthService,private router: Router){}
  onSwitchMode(){
    this.isLoginMode = ! this.isLoginMode;
  }
  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    let authObs : Observable<AuthResponseData>
    this.isLoading = true;
    if(this.isLoginMode){
     authObs = this.authService.login(email,password);  }
    else {
     authObs =  this.authService.signup(email,password);  }
     authObs.subscribe(
     resData => {
       console.log(resData);
       this.isLoading = false;
       this.router.navigate(['/recipes']);
     },
     errorMessage => {
       console.log(errorMessage);
       this.errorMessage = errorMessage ;
       this.isLoading = false;
     }
   );

    //console.log(form.value);

    form.reset();
  }
}
