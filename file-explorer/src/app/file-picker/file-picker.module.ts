import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilePickerComponent } from './file-picker.component';
import { FilePickerRoutingModule } from './file-picker-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FilePickerRoutingModule
  ],
  declarations: [  ]
})
export class FilePickerModule { }