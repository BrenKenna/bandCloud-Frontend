import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    'path': '',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
  },

  {
    'path': 'picker',
    loadChildren: () => import('./file-picker/file-picker.module').then(m => m.FilePickerModule)
  },

  {
    'path': 'dropzone',
    loadChildren: () => import('./file-dropzone/file-dropzone.module').then(m => m.FileDropzoneModule)
  },

  {
    'path': 'account-display',
    loadChildren: () => import('./account-displayer/account-displayer.module').then(m => m.AccountDisplayerModule)
  },

  {
    'path': 'account-login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },

  {
    'path': 'projects-viewer',
    loadChildren: () => import('./projects/projects-viewer/projects-viewer.module').then( m => m.ProjectsViewerModule)
  },

  {
    'path': 'project-page',
    loadChildren: () => import('./projects/project-page/project-page.module').then( m => m.ProjectPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
