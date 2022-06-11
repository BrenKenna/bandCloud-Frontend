import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component'; 
import { FilePickerComponent } from './file-picker/file-picker.component';
import { FileDropzoneComponent } from './file-dropzone/file-dropzone.component';

const routes: Routes = [
  {
    'path': '', component: RegisterComponent
  },

  {
    'path': 'picker', component: FilePickerComponent
  },

  {
    'path': 'dropzone', component: FileDropzoneComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
