import { Recipe } from './../recipes/recipe.model';
import { RecipeService } from './../recipes/recipe.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class DataStorageService{
  constructor(
    private http:HttpClient ,
    private recipeService: RecipeService ,
    private authService: AuthService){ }

  storeRecipes(){
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://ng-recipe-book-237fd-default-rtdb.firebaseio.com/recipes.json',recipes)
    .subscribe( response => {
      console.log(response);
    });
  }
  fetchRecipes(){
    return this.authService.user.pipe(take(1),
    exhaustMap( user => {
     return  this.http.get<Recipe[]>(
       'https://ng-recipe-book-237fd-default-rtdb.firebaseio.com/recipes.json?auth='+user?.token);
    }),
    map(recipes => {
      return recipes.map(
        recipe => {
        return {...recipe , ingredients : recipe.ingredients ? recipe.ingredients : [] };
      });
    })
    );
    // this.http.get<Recipe[]>('https://ng-recipe-book-237fd-default-rtdb.firebaseio.com/recipes.json')
    // .pipe(map(recipes => {
    //   return recipes.map( recipe => {
    //     return {...recipe , ingredients : recipe.ingredients ? recipe.ingredients : [] }
    //   })
    // }))
    // .subscribe(recipes => {
    //   this.recipeService.setRecipes(recipes);
    //   console.log(recipes);
    // })




  }
}
