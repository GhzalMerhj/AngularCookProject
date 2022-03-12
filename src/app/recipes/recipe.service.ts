import { Subject } from 'rxjs';
import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService{
  recipeChanged =  new Subject<Recipe[]>();
  constructor(private slService:ShoppingListService){}


  private recipes: Recipe[] = [
    new Recipe('First Recipe' , 'The description of the First recipe ','assets/img/recipe1.jpg',[
      new Ingredient('meat',1),
      new Ingredient('French Fries',10),

    ]),
    new Recipe('Second Recipe' , 'The description of the Second recipe ','assets/img/recipe2.jpg',[
      new Ingredient('meat',1),
      new Ingredient('Buns',2),
    ]),

  ] ;
  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }
  getRecipes(){
    return this.recipes.slice();
  }
  getRecipe(id: number){
    return this.recipes[id];
  }
  addIngredientsToShoppingList(ingredients: Ingredient[]){
     this.slService.addIngredients(ingredients);
  }
  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }
  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }
  deleteRecipe(index: number){
    this.recipes.splice(index,1);
    this.recipeChanged.next(this.recipes.slice());
  }
}
