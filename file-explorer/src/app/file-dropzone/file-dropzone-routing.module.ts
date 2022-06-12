import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FileDropzoneComponent } from './file-dropzone.component'; 

const routes: Routes = [
  {
    path: '',
    component: FileDropzoneComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileDropzoneRoutingModule { }