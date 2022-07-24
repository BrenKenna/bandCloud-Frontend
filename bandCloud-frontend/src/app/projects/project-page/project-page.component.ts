import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AudioContext } from 'angular-audio-context';
import { Subject } from 'rxjs';
import { BandCloudAudioService } from 'src/app/services/audio/band-cloud-audio.service';
import { BandCloudRestProjectsService } from 'src/app/services/backend/band-cloud-rest-projects.service';
import { ProjectModel } from '../model/project-model';

import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { Track } from 'src/app/services/audio/models/services/audio/models/track';
import { Tracks } from 'src/app/services/audio/models/services/audio/models/tracks';
import { MOCK_META } from '../model/mock-data/mock-meta';
@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit {

  // Attributes
  public readonly projectName: string = "project1";
  public project: ProjectModel;
  private audioCtx: AudioContext;

  // Microphone recording
  public mikeRecord: any;
  public recording: boolean = false;
  public recordingBlob: Blob;
  public mikeRecordURL: string;

  // Track related
  public track: Track;
  public tracks: Tracks = new Tracks(); // Would three, 2 editable
  public mockMeta = MOCK_META;
  public mixedTrack: Track;


  // Set mixed track properties
  public mixedBlob: Blob;
  public mixedURL: string;


  /**
   * 
   * @param bandServ 
   */
  constructor(
    private bandServ: BandCloudRestProjectsService,
    private audioServ: BandCloudAudioService,
    private http: HttpClient,
    private domSanitizer: DomSanitizer
  )
  {
    this.audioCtx = audioServ.getAudioCtx();
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
   * Fetch and add track
   * 
   * @param trackName 
   * @param trackURL 
   */
   public fetchTrack(trackName: string, trackURL: string) {
    let track = new Track(this.audioServ, {name: trackName, url: trackURL} );
    track.setAudioBuffer();
    console.log(`\nAdded '${track.getName()}' = ${this.tracks.addTrack(track)}`);
  }


  /**
   * Handle playing track
   */
   public playTrack(track: Track) {

    // Pass if playing
    if ( track.getPlayingState() ) {
      console.log("Nope playing it again, soz :)");
      return false;
    }
    this.audioServ.manageState();

    // Update playing state & configure audio node
    track.setPlaying();
    const trackSource = this.audioCtx.createBufferSource();
    trackSource.buffer = track.getAudioBuffer();
    trackSource.connect(this.audioCtx.destination);

    // Logic for playing
    trackSource.start();
    trackSource.onended = () => {
      track.setStop();
      trackSource.disconnect();
      this.audioCtx.suspend();
    };

    // Happy days
    return true;
  }


  /**
   * Method to play a track from tracks list
   *  => Needs to be syncronized
   * 
   * @param trackName 
   * @returns 
   */
  public playFromTracks(trackName: string) {

    // Try fetch track
    console.dir(this.tracks);
    let track = this.tracks.getTrackByName(trackName);
    if( track == null ) {
      console.log(`\nError, track '${trackName}' not found`);
      return false;
    }

    // Manage playing state
    if ( track.getPlayingState() ) {
      console.log(`\nError, track '${track.getName()}' already playing`);
      return false;
    }
    this.audioServ.manageState();
    
    // Update playing state & configure audio node
    track.setPlaying();
    const trackSource = this.audioCtx.createBufferSource();
    trackSource.buffer = track.getAudioBuffer();
    trackSource.connect(this.audioCtx.destination);

    // Logic for playing
    trackSource.start();
    trackSource.onended = () => {
      track.setStop();
      trackSource.disconnect();
      this.audioCtx.suspend(); // None can stop
    };

    // Return true
    return true;
  }


  /**
   * Drop a track by their name
   * 
   * @param trackName 
   */
  public dropFromTracks(trackName: string) {
    this.tracks.dropTrackByName(trackName);
  }


  /**
   * Sort tracks ascendingly by size
   */
  public sortTracks() {
    console.dir(this.tracks.getTrackNames());
    this.tracks.bubbleSort();
    console.dir(this.tracks.getTrackNames());
  }


  /**
   * Method to syncronize playing multiple tracks
   * 
   * @param trackName 
   * @returns 
   */
  public tracks_MultiPlay(trackName: string) {

    // Try fetch track
    console.dir(this.tracks);
    let track = this.tracks.getTrackByName(trackName);
    if( track == null ) {
      console.log(`\nError, track '${trackName}' not found`);
      return false;
    }
    
    // Manage playing state
    if ( track.getPlayingState() ) {
      console.log(`\nError, track '${track.getName()}' already playing`);
      return false;
    }
    this.audioServ.manageState();
    
    // Update playing state & configure audio node
    track.setPlaying();
    const trackSource = this.audioCtx.createBufferSource();
    trackSource.buffer = track.getAudioBuffer();
    trackSource.connect(this.audioCtx.destination);

    // Logic for playing
    let whereInTrack = this.tracks.getSyncedTime(this.audioCtx.currentTime);
    trackSource.start(0, whereInTrack);
    trackSource.onended = () => {
      track.setStop();
      trackSource.disconnect();
      this.audioCtx.suspend(); // None can stop
    };

    // Return true
    return true;
  }


  /**
   * Method to mix all tracks in tracks.
   *  Sets the this.mixedTrack attribute
   * 
   * @param tracks 
   * @returns 
   */
  public tracksMixer(tracks: Tracks) {
    
    // Get mixed audio signal
    let mix: Float32Array = this.tracks.mixTracks();
    console.log(`I just an array of size = ${mix.length}`);

    // Create buffer based on largest track & copy data into channels
    let buffer = this.audioCtx.createBuffer(2, mix.length, this.tracks.getLargest().getTrackData().samplingRate);
    buffer.copyToChannel(mix, 0);
    buffer.copyToChannel(mix, 1);

    // Connect & play
    this.audioServ.manageState();
    const trackSource = this.audioCtx.createBufferSource();
    trackSource.buffer = buffer;
    trackSource.connect(this.audioCtx.destination);
    //trackSource.start();

    // Handle on ended
    trackSource.onended = () => {
      trackSource.disconnect();
      this.audioCtx.suspend(); // None can stop
    };

    // Convert to blob
    const mixBlob = this.bufferSourceToBlog(trackSource.buffer);
    this.mixedBlob = mixBlob.blob;
    this.mixedURL = mixBlob.url;
    console.dir(this.mixedBlob);
    // console.log(this.mixedURL);

    // Convert to track
    let sanitURL = this.sanitize(this.mixedURL);
    this.mixedTrack = new Track(this.audioServ, {name: 'mixedTrack', url: this.mixedURL});
    this.mixedTrack.setAudioFromBlob(this.mixedBlob);
    console.dir(this.mixedTrack);
  }



  /**
   * Convert buffer array to blob and its url
   * 
   * @param bufferArray 
   * @returns { 'blob': Blob, 'url': Blob-URL }
   */
  private bufferSourceToBlog(audioBuffer: AudioBuffer ) {


    // interleaved
    const [leftChan, rightChan] = [audioBuffer.getChannelData(0), audioBuffer.getChannelData(1)]
    const interleaved = new Float32Array(leftChan.length + rightChan.length)
    for (let src = 0, dst = 0; src < leftChan.length; src++, dst += 2) {
      interleaved[dst] = leftChan[src]
      interleaved[dst + 1] = rightChan[src];
    }

    // get WAV file bytes and audio params of your audio source
    const wavBytes = this.audioServ.getWavBytes(interleaved.buffer, {
      isFloat: true,       // floating point or 16-bit integer
      numChannels: 2,
      sampleRate: audioBuffer.sampleRate,
    })
    const wavBuffer = new Blob([wavBytes], { type: 'audio/wav' })
    let blobURL = URL.createObjectURL(wavBuffer);
    return {'blob': wavBuffer, 'url': blobURL};
  }


  /**
   * 
   * Last bits
   * 
   * Manage recording (ie Recording -> Track)
   *          +
   * Track/Audio-Buffer -> Blob
   *          +
   * Mixed audio -> Track
   * 
   */


  /**
   * 
   * @returns 
   */
  public recordMicoPhone() {

    // Log unavailable if media devices is not supported
    if ( !navigator.mediaDevices) {
      console.log("Get user media not supported by browser");
      return false;
    }

    // Get user media stream
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(this.recordSuccessCallBack.bind(this));
    return true;
  }


  /**
   * 
   * @param stream 
   */
  public recordSuccessCallBack(stream: MediaStream) {

    // Record mike
    this.recording = true;
    this.mikeRecord = new RecordRTC.StereoAudioRecorder(stream);
    this.mikeRecord.record();
  }


  /**
   * 
   */
  public stopRecording() {
    this.recording = false;
    this.mikeRecord.stop(this.processRecording.bind(this));
  }


  /**
   * 
   * @param blob 
   */
  public processRecording(blob: Blob) {
    this.recordingBlob = blob;
    this.mikeRecordURL = URL.createObjectURL(blob);
  }


  /**
   * 
   * @param url 
   * @returns 
   */
  public sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }


  /**
   * 
   * @returns 
   */
  public postTrack() {
    if ( this.mikeRecordURL == null ) {
      console.log("Recording data not yet available");
      return false;
    }

    // Read blob
    let reader = new FileReader();
    reader.readAsDataURL(this.recordingBlob);
    reader.onloadend = () => {
      console.log(`Blob-64 Size = ${reader.result.toString().length}`);
      this.bandServ.postAudio(reader.result).subscribe(
        (data) => {
            console.dir(data);
      });
    }
    return true;
  }
}
