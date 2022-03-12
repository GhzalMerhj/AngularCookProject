import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { DataStorageService } from './../shared/data-storage.service';
import { Component, OnDestroy, OnInit} from "@angular/core";

@Component({
   selector : 'app-header',
   templateUrl : './header.component.html',
   styles: [`ul li a{ cursor: pointer;  }`]
})

export class HeaderComponent implements OnInit , OnDestroy{
  isAuthenticated = false;
  private userSub: Subscription;
  // @Output() featureSelected = new EventEmitter<string>();
  constructor(private dataStorage: DataStorageService , private authService: AuthService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   this.userSub = this.authService.user.subscribe(user=>{
         this.isAuthenticated = !user ? false : true; // or we can use !!user

         // user: false => isAuthenticated : false;
         // user: true => isAuthenticated : true;
   });
  }
  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(): void {
      this.userSub.unsubscribe();
  }
  onSaveData(){
     this.dataStorage.storeRecipes();
  }
  onFetchData(){
    this.dataStorage.fetchRecipes();
  }
}
