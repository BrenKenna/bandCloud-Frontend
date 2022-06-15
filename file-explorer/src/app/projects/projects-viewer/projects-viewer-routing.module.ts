import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsViewerComponent } from './projects-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsViewerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsViewerRoutingModule { }
