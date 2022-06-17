import { Component, OnInit, Inject } from '@angular/core';
import { AudioContext } from 'angular-audio-context';
import { BandCloudAudioService } from 'src/app/services/audio/band-cloud-audio.service';
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
  private audioCtx: AudioContext;
  private counter: number = 0;

  // Button map
  public buttonMap: Map<string, boolean> = new Map();

  /**
   * 
   * @param bandServ 
   */
  constructor(private bandServ: BandCloudRestProjectsService, private audioServ: BandCloudAudioService) {
    this.audioCtx = audioServ.getAudioCtx();
    this.buttonMap.set('whiteNoise1', false);
    this.buttonMap.set('whiteNoise2', false);
  }


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
    
    // Resume context if suspended & create oscilliator node
    this.audioServ.manageState();
    const oscillatorNode = this.audioCtx.createOscillator();
    
    // Attach to audio context
    oscillatorNode.connect(this.audioCtx.destination);
    
    
    // Disconnect when done, play and stop after 5 seconds
    oscillatorNode.onended = () => oscillatorNode.disconnect();
    oscillatorNode.start();
    oscillatorNode.stop(this.audioCtx.currentTime + 0.4);
  }


  /**
   * 
   */
  public whiteNoiseGen( theButton: string ) {
    
    // Handle state
    console.dir(this.audioCtx, {depth: null});
    if ( this.buttonMap.get(theButton)) {
      console.log("Nope not playing");
      return false;
    }
    else {
      this.buttonMap.set(theButton, true);
    }

    // Manage state
    this.audioServ.manageState();

    // Fetch buffer
    let whiteNoiseBuffer = this.audioServ.whiteNoiseTest();

    // Attach
    let soundSrc = this.audioCtx.createBufferSource();
    soundSrc.buffer = whiteNoiseBuffer;
    soundSrc.connect(this.audioCtx.destination);


    // Disconnect when done, play and stop after 5 seconds
    soundSrc.onended =
      () => { 
        soundSrc.disconnect();
        this.buttonMap.set(theButton, false);
      }
    soundSrc.start();
    soundSrc.stop(this.audioCtx.currentTime + 0.5);
    console.log(`${theButton} clicks = ${this.counter++}`);
    console.dir(this.audioCtx, {depth: null});
    return true;
  }

  /**
   * 
   * @param input 
   */
   public setActiveTrackEdit(input: string) {
    this.activeTrackEdit = input;
  }
}
