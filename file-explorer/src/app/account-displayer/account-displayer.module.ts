import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountDisplayerComponent } from './account-displayer.component'; 
import { AccountDisplayerRoutingModule } from './account-displayer-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AccountDisplayerRoutingModule
  ],
  declarations: [  ]
})
export class AccountDisplayerModule { }