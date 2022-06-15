import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from "@angular/material/divider";
import { MatRadioModule } from '@angular/material/radio';
import { HttpClientModule } from '@angular/common/http';

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
import { ProjectsComponent } from './projects/projects.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProjectsViewerComponent } from './projects/projects-viewer/projects-viewer.component';
import { ProjectsViewerModule } from './projects/projects-viewer/projects-viewer.module';

@NgModule({
  declarations: [
    AppComponent,
    FilePickerComponent,
    FileDropzoneComponent,
    ReadModePipe,
    AccountManagerComponent,
    AccountDisplayerComponent,
    ProjectsComponent,
    RegisterComponent,
    LoginComponent,
    ProjectsViewerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTabsModule,
    MatToolbarModule,
    AppRoutingModule,
    NgxFileHelpersModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatRadioModule,
    CdkAccordionModule,
    MatExpansionModule,
    ProjectsViewerModule
  ],
  providers: [ HttpClientModule ],
  bootstrap: [AppComponent]
})
export class AppModule { }
