import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilePickerComponent } from './file-picker.component'; 

const routes: Routes = [
  {
    path: 'picker',
    component: FilePickerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilePickerRoutingModule { }