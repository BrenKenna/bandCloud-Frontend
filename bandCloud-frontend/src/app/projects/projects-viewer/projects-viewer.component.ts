import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { BandCloudRestProjectsService } from 'src/app/services/backend/band-cloud-rest-projects.service'; 
import { ProjectModel } from '../model/project-model';


@Component({
  selector: 'app-projects-viewer',
  templateUrl: './projects-viewer.component.html',
  styleUrls: ['./projects-viewer.component.scss']
})
export class ProjectsViewerComponent implements OnInit {

  // Attributes
  public projects: ProjectModel[] = [];
  // public projectsList: ProjectsModel;


  /**
   * 
   * @param bandServ 
   */
  constructor(private bandServ: BandCloudRestProjectsService) { }


  /**
   * 
   */
  ngOnInit() {
    console.log("\nGetting data for Projects Viewer Page");
    this.bandServ.getProjects().subscribe(
      data => {
        for(let project of data) {
          this.projects.push(project);
          // console.dir(project, {depth: null});
        }
        //this.projectsList = data;
        //console.dir(this.projectsList, { depth: null })
      }
    );
  }

}
