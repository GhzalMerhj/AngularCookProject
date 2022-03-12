import { Subscription } from 'rxjs';
import { ShoppingListService } from './../shopping-list.service';
import { Ingredient } from './../../shared/ingredient.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit ,OnDestroy{
  //dealing with the form using local reference
  // @ViewChild('nameInput') nameInputRef :ElementRef;
  // @ViewChild('amountInput') amountInputRef :ElementRef;
 // const nameInputVal = this.nameInputRef.nativeElement.value;
 // const amountInputVal = this.amountInputRef.nativeElement.value;
  // @Output() ingredientAdded = new  EventEmitter<Ingredient>();
  @ViewChild('f') slForm :NgForm;
  subscription : Subscription;
  editMode = false;
  editItemIndex: number;
  editedItem: Ingredient;
  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription =this.slService.startedEditing.subscribe(
      (index: number) =>{
         this.editItemIndex = index;
         this.editMode = true;
         this.editedItem = this.slService.getIngredient(index);
         this.slForm.setValue({
           name: this.editedItem.name,
           amount: this.editedItem.amount
         })
      }
    );
  }
  onSubmit(form: NgForm){
    const value = form.value;
    const newIngredient = new Ingredient(value.name,value.amount);
    //this.ingredientAdded.emit(newIngredient);
    if(this.editMode){
      this.slService.updateIngredient(this.editItemIndex,newIngredient);
    }
    else{
       this.slService.addIngredient(newIngredient);
    }
     this.editMode = false;
     form.reset();
  }
  onClear(){
    this.slForm.reset();
    this.editMode = false;
  }
  onDelete(){
    this.slService.deleteIngredient(this.editItemIndex);
    this.onClear();
  }
  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
