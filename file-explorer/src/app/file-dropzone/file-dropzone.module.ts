import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileDropzoneComponent } from './file-dropzone.component';
import { FileDropzoneRoutingModule } from './file-dropzone-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FileDropzoneRoutingModule
  ],
  declarations: [  ]
})
export class FileDropzoneModule { }