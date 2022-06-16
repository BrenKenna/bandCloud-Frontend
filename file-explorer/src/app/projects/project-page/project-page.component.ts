import { Component, OnInit } from '@angular/core';
import { BandCloudRestProjectsService } from 'src/app/services/backend/band-cloud-rest-projects.service';
import { ProjectModel } from '../model/project-model';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit {

  // Attributes
  public readonly projectName: string = "project1";
  public project: ProjectModel;
  public activeTrackEdit: string = '';


  /**
   * 
   * @param bandServ 
   */
  constructor(private bandServ: BandCloudRestProjectsService) {}


  /**
   * 
   */
  ngOnInit() {
    console.log("\nGetting project for the workbench");
    this.bandServ.get_singleProject(this.projectName).subscribe(
      data => {
        console.log("\nChecking response for workbench");
        console.dir(data, { depth: null });
        this.project = new ProjectModel(data);
      }
    );
  }


  /**
   * 
   * @param input 
   */
  public setActiveTrackEdit(input: string) {
    this.activeTrackEdit = input;
  }
}
