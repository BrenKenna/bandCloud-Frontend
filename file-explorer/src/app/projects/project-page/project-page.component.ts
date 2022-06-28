import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AudioContext } from 'angular-audio-context';
import { defer, from, Observable, Subject } from 'rxjs';
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
  public activeTrackEdit: string = '';
  public started = false;
  private audioCtx: AudioContext;
  private counter: number = 0;

  // Recorded elements
  public whiteNoiseBlob_URL: any;
  public whiteNoiseBlob: Blob;
  public chunks: any[] = [];
  public recorder: MediaRecorder;
  public whtNoise: any;
  public recorderState: boolean = false;
  public playingRecord: boolean = false;
  public fetchedAudio: AudioBuffer;
  public activeAudio: AudioBuffer[] = [];


  // Button map
  public buttonMap: Map<string, boolean> = new Map();


  /**
   * 
   * @param bandServ 
   */
  constructor(private bandServ: BandCloudRestProjectsService, private audioServ: BandCloudAudioService, private http: HttpClient) {
    this.audioCtx = audioServ.getAudioCtx();
    this.buttonMap.set('whiteNoise1', false);
    this.buttonMap.set('whiteNoise2', false);
    this.buttonMap.set('recordWhtNoise', false);
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
    let whiteNoiseBuffer = this.audioServ.whiteNoiseTest(1);

    // Attach
    let soundSrc = this.audioCtx.createBufferSource();
    soundSrc.buffer = whiteNoiseBuffer;
    soundSrc.connect(this.audioCtx.destination);


    // Disconnect when done, play and stop after 5 seconds
    soundSrc.onended =
      () => { 
        soundSrc.disconnect();
        this.buttonMap.set(theButton, false);
      };
    soundSrc.start();
    soundSrc.stop(this.audioCtx.currentTime + 1.5);
    console.log(`${theButton} clicks = ${this.counter++}`);
    console.dir(this.audioCtx, {depth: null});
    return true;
  }



  /**
   * 
   * @returns 
   */
  private recWhiteNoise() {

    // Manage state
    this.audioServ.manageState();

    // Attach
    let dest = this.audioCtx.createMediaStreamDestination();
    this.whtNoise = this.audioCtx.createBufferSource();
    this.whtNoise.buffer = this.audioServ.whiteNoiseTest(1);
    console.log("Checking white noise buffer");
    console.dir(this.whtNoise, { depth: null });


    // Attach recorder to destination stream
    this.recorder = new MediaRecorder(dest.stream);
    this.whtNoise.connect(dest);


    // Push captured stream to array
    this.recorder.ondataavailable = ( audioEvt ) => {
      console.log("Pushing audio array");
      this.chunks.push(audioEvt.data)
    };


    // Push captured to: whiteNoiseBlob_URL
    this.recorder.onstop = ( ) => {
      this.whiteNoiseBlob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
      this.whiteNoiseBlob_URL = URL.createObjectURL(this.whiteNoiseBlob);
      console.log("White blob generated");
      console.dir(this.whiteNoiseBlob_URL, {depth: null });
      this.buttonMap.set('recordWhtNoise', false);
    };
    console.log(`The private recording state: ${this.recorder}`);
  }


  /**
   * 
   * @returns 
   */
  public manageWhtNoise_Record() {

    // Manage state
    if (!this.recorderState) {
      this.recWhiteNoise();
      this.recorder.start();
      this.whtNoise.start(0);
      console.log(`Recorder state: ${this.recorder.state}`);
      this.recorderState = true;
    }
    
    else {
      console.log(`Recorder state: ${this.recorder.state}`);
      console.dir(this.recorder, { depth: null });
      console.dir(this.whiteNoiseBlob_URL, {depth: null} );
      this.recorder.requestData();
      this.recorder.stop();
      this.whtNoise.stop();
      this.recorderState = false;
      console.dir(this.whiteNoiseBlob_URL, {depth: null} );
      this.buttonMap.set('recordWhtNoise', false);
      return this.whiteNoiseBlob_URL;
    }
    return null;
  }


  /**
   * Fetch an audio buffer  from blob
   * 
   * @returns audioBuffer
   */
  private async getRecordingBuffer() {

    // Manage state
    if (this.chunks.length == 0) {
      console.log("Recording in progress");
      return null;
    }


    // Fetch buffer
    const buffer = await this.chunks[0].arrayBuffer();
    const audioBuffer = await this.audioCtx.decodeAudioData(buffer);
    return audioBuffer;
  }


  /**
   * 
   */
  public playRecording() {

    if (this.playingRecord) {
      return false;
    }

    // Fetch track
    this.getRecordingBuffer().then( track => {
      this.playingRecord = true;
      const trackSource = this.audioCtx.createBufferSource();
      trackSource.buffer = track;
      trackSource.connect(this.audioCtx.destination);
      trackSource.start();
      trackSource.onended = () => {
        this.playingRecord = false;
        trackSource.disconnect();
        this.audioCtx.suspend();
      };
    });
    return true;
  }


  /**
   * Return an observable for an audio buffer from get request
   * 
   * @returns 
   */
  private getAudio() {
    let subject = new Subject<AudioBuffer>();
    this.http.get("../../../assets/site_audio_acoustic.mp3", {"responseType": "arraybuffer"}).subscribe(
      async (data) => {
        // console.log("\nRunning get audio");
        let audioBuffProm = await this.audioCtx.decodeAudioData(data);
        // console.dir(audioBuffProm);
        subject.next(audioBuffProm);
    });
    return subject.asObservable();
  }



  /**
   * Fetch related audio buffer and play it
   */
  public playFetchedAudio() {
    this.audioServ.manageState();
    this.getAudio().subscribe( ( track ) => {
      
      // Configure audio node
      const trackSource = this.audioCtx.createBufferSource();
      trackSource.buffer = track;
      trackSource.connect(this.audioCtx.destination);


      // Play audio and define onended
      trackSource.start();
      trackSource.onended = () => {
        this.playingRecord = false;
        trackSource.disconnect();
        this.audioCtx.suspend();
      };
    });
    //console.log("Hello");
  }


  public postRecording() {

    // Related vars
    // this.whiteNoiseBlob
    // this.whiteNoiseBlob_URL
    // this.chunks
    if ( this.whiteNoiseBlob_URL == null ) {
      console.log("Recording data not yet available");
      return false;
    }

    // Read blob
    let reader = new FileReader();
    reader.readAsDataURL(this.whiteNoiseBlob);
    reader.onloadend = () => {
      console.log(`Blob-64 Size = ${reader.result.toString().length}`);
      this.bandServ.postAudio(reader.result).subscribe(
        (data) => {
            console.dir(data);
      });
    }
    return true;
  }

  /**
   * 
   * @param input 
   */
   public setActiveTrackEdit(input: string) {
    this.activeTrackEdit = input;
  }



  /**
   * 
   */
  public multiTrackPlay() {

    // Manage state
    this.audioServ.manageState();

    // Fetch buffer
    let whtBuff_a = this.audioServ.whiteNoiseTest(2);
    let whtBuff_b = this.audioServ.whiteNoiseTest(5);

    // Configure audio node
    const trackSourceA = this.audioCtx.createBufferSource();
    trackSourceA.buffer = whtBuff_a;
    trackSourceA.connect(this.audioCtx.destination);

    // Configure audio node
    const trackSourceB = this.audioCtx.createBufferSource();
    trackSourceB.buffer = whtBuff_b;
    trackSourceB.connect(this.audioCtx.destination);

    // Scope out
    console.log("\nChecking audio context\n");
    console.dir(this.audioCtx.destination, {depth: null});
    console.dir(this.audioCtx, {depth: null});

    // Play tracks
    trackSourceA.start();
    trackSourceB.start(this.audioCtx.currentTime + 6);
    console.dir(trackSourceA, {depth: null});
    console.dir(trackSourceB, {depth: null});

    // Stop tracks at different times
    trackSourceB.stop(this.audioCtx.currentTime + 12 + 2);


    //
    trackSourceA.onended = () => {
      console.log("Track-A ended");
      this.playingRecord = false;
      trackSourceA.disconnect();
    };
    trackSourceB.onended = () => {
      console.log("Track-B ended");
      this.playingRecord = false;
      trackSourceB.disconnect();
    };
  }


  /**
   * Mix two white noise tracks
   */
  public mixTracks() {

    // Manage state
    this.audioServ.manageState();

    // Create first node
    const trackSourceA = this.audioCtx.createBufferSource();
    trackSourceA.buffer = this.audioServ.whiteNoiseTest(1);

    // Create second node
    const trackSourceB = this.audioCtx.createBufferSource();
    trackSourceB.buffer = this.audioServ.whiteNoiseTest(2);

    // Mix & connecy audio signals
    /*
    console.log("\nCreating a new mixed audio signal");
    console.log("\nSummarizin tracks");
    console.log(`
      Biggest = ${this.audioServ.sumAudioBuffer(trackSourceA.buffer)},
      Smallest = ${this.audioServ.sumAudioBuffer(trackSourceB.buffer)}`
    );
    */
    const trackPlaying = this.audioCtx.createBufferSource();
    const trackData = this.audioServ.mixTracks(trackSourceA, trackSourceB);
    trackPlaying.buffer = trackData;
    trackPlaying.connect(this.audioCtx.destination);

    // Play track
    console.log(`\nAttempting to play mixed track, length = ${trackPlaying.buffer.getChannelData(0).length}`);
    trackPlaying.start();
    trackPlaying.onended =
    () => {
        console.log(`Mixed track has ended`);
        //console.log(`Sum track-mixed = ${this.audioServ.sumAudioBuffer(trackPlaying.buffer)}`);
        trackPlaying.disconnect();
    };
    
    // Play main track
    console.log(`\nAttempting to play biggest track, length = ${trackSourceA.buffer.getChannelData(0).length}`);
    trackSourceA.connect(this.audioCtx.destination);
    trackSourceA.start();
    trackSourceA.onended =
    () => {
        console.log(`Biggest track has ended`);
        //console.log(`Sum track-biggest = ${this.audioServ.sumAudioBuffer(trackSourceA.buffer)}`);
        trackSourceA.disconnect();
    };
  }
}
