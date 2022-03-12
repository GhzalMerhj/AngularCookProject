import { DataStorageService } from './../shared/data-storage.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipesResolverService{
  constructor(private dataStorageService : DataStorageService){}

}
