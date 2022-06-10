import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";

// File explorer
import { NgxFileHelpersModule } from 'ngx-file-helpers';


// Application
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilePickerComponent } from './file-picker/file-picker.component';
import { FileDropzoneComponent } from './file-dropzone/file-dropzone.component';
import { ReadModePipe } from './read-mode-pipe.pipe';
import { AccountManagerComponent } from './account-manager/account-manager.component';
import { AccountDisplayerComponent } from './account-displayer/account-displayer.component';
import { ProjectComponent } from './project/project.component';

@NgModule({
  declarations: [
    AppComponent,
    FilePickerComponent,
    FileDropzoneComponent,
    ReadModePipe,
    AccountManagerComponent,
    AccountDisplayerComponent,
    ProjectComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTabsModule,
    MatToolbarModule,
    AppRoutingModule,
    NgxFileHelpersModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
