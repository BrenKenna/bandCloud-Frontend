import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountDisplayerComponent } from './account-displayer.component'; 

const routes: Routes = [
  {
    path: 'display-view',
    component: AccountDisplayerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountDisplayerRoutingModule { }