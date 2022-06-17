import { Component, OnInit, Inject } from '@angular/core';
import { AudioContext } from 'angular-audio-context';
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
  public activeTrackEdit: string = '';;
  public started = false;

  /**
   * 
   * @param bandServ 
   */
  constructor(private bandServ: BandCloudRestProjectsService, private audioCtx: AudioContext) {}


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
   */
  public async beep() {
    if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
    }

    const oscillatorNode = this.audioCtx.createOscillator();

    oscillatorNode.onended = () => oscillatorNode.disconnect();
    oscillatorNode.connect(this.audioCtx.destination);

    oscillatorNode.start();
    oscillatorNode.stop(this.audioCtx.currentTime + 0.5);
  }


  /**
   * 
   * @param input 
   */
   public setActiveTrackEdit(input: string) {
    this.activeTrackEdit = input;
  }
}
