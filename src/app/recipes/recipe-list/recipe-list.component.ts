import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { RecipeService } from './../recipe.service';
import {Recipe} from '../recipe.model';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit , OnDestroy{
  recipes: Recipe[];
  recipeChangedSub: Subscription;
  // @Output() recipeWasSelected = new EventEmitter<Recipe>();

  // onRecipeSelected(recipeItem:Recipe){
  //      this.recipeWasSelected.emit(recipeItem);
  // }
  constructor(private recipeService:RecipeService ,
              private router :Router ,
              private route: ActivatedRoute   ) { }

  ngOnInit(): void {
    this.recipeChangedSub = this.recipeService.recipeChanged.subscribe((recipes: Recipe[]) => {
      this.recipes =  recipes;
    });

    this.recipes = this.recipeService.getRecipes();
  }
  ngOnDestroy(): void {
    this.recipeChangedSub.unsubscribe();
  }
  onNewRecipe(){
      this.router.navigate(['new'],{relativeTo: this.route});
  }
}
