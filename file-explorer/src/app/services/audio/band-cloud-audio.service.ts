
// Core modules
import { Injectable } from '@angular/core';
import { AudioContext } from 'angular-audio-context';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Track } from './models/services/audio/models/track';


// App related


/**
 * Class to encapsulate interacting with MDN Web Audio for app specific things.
 *  Trying to keep it high level, which means a lot thought + work in figuring
 *   out encapsulating reptitive tasks + their models & how data/logic is exchanged
 *   between them :(
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class BandCloudAudioService {

  private audioCtx: AudioContext = new (window['AudioContext'] || window['webkitAudioContext'])();
  constructor(private http: HttpClient) { }


  /**
   * 
   * @returns 
   */
  public getAudioCtx() {
    return this.audioCtx;
  }


  /**
   * 
   */
  public async manageState() {
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
  }


  /**
   * 
   */
  public whiteNoiseTest(trackLength: number) {
    
    // Create an empty 2 second buffer at the sampling rate of AC
    let channels = 2;
    let frameCount = this.audioCtx.sampleRate * (4.0 / trackLength );
    let whiteNoiseBuffer = this.audioCtx.createBuffer(channels, frameCount, this.audioCtx.sampleRate);

    // Fill each channel with white noise
    for( let channel = 0; channel < 1; channel++) {
        
        // Get the buffer array and populate it with random data
        let chanBuff = whiteNoiseBuffer.getChannelData(channel);
        for(let i = 0; i < frameCount; i++) {
            chanBuff[i] = (Math.random() * 2) - 1;
        }
    }

    // Return white noise buffer
    return whiteNoiseBuffer;
  }


  /**
   * Attach an audio buffer to main dest
   * 
   * @param track 
   */
  public attachTrackToMain(track: AudioBuffer) {

    // Configure audio node
    const trackSource = this.audioCtx.createBufferSource();
    trackSource.buffer = track;
    trackSource.connect(this.audioCtx.destination);
  }



  /**
   * Return an observable for a an audio buffer from a url string
   * 
   * @param path 
   * @returns 
   */
  public getAudio(urlStr: string) {

    //
    console.log("\nGet audio started");
    let subject = new Subject<AudioBuffer>();
    this.http.get(urlStr, {"responseType": "arraybuffer"}).subscribe(
      async (data) => {
        let audioBuffProm = await this.audioCtx.decodeAudioData(data);
        console.log(`\nI got this back ${audioBuffProm}`);
        subject.next(audioBuffProm);
    });
    console.log(`\nAnd I will return this ${subject}`);
    return subject.asObservable();
  }


  /**
   * Fetch an audio buffer from a blob
   * 
   * @param arr 
   * @returns 
   */
  public async getRecordingBuffer(arr: Blob) {

    // Manage state
    if (arr.size == 0) {
      console.log("Recording in progress");
      return null;
    }

    // Fetch buffer
    const buffer = await arr.arrayBuffer();
    const audioBuffer = await this.audioCtx.decodeAudioData(buffer);
    return audioBuffer;
  }



  /**
   * 
   * @param trackA 
   * @param trackB 
   * @returns 
   */
  public mixTracks(trackA: any, trackB: any) {

    // Initalize
    let indexOfBiggest, outputBuffer: AudioBuffer;
    let holder = [ trackA, trackB ];

    // Manage size
    if ( trackA.buffer.length > trackB.buffer.length) {
      // console.log(`Chose track-1 = ${trackA.buffer.length}, over track-2 = ${trackB.buffer.length}`);
      outputBuffer = this.audioCtx.createBuffer(trackA.buffer.numberOfChannels, trackA.buffer.length, trackA.buffer.sampleRate);
      indexOfBiggest = 1;
      holder[0] = trackB;
      holder[1] = trackA;
    } else if ( trackB.buffer.length > trackA.buffer.length ) {
      // console.log(`Chose track-2 = ${trackB.buffer.length}, over track-1=  ${trackA.buffer.length}`);
      outputBuffer = this.audioCtx.createBuffer(trackB.buffer.numberOfChannels, trackB.buffer.length, trackB.buffer.sampleRate);
      indexOfBiggest = 1;
    }
    else {
      console.log(`Tracks are same length: ${trackA.buffer.length == trackB.buffer.length}`);
      outputBuffer = this.audioCtx.createBuffer(trackA.buffer.numberOfChannels, trackA.buffer.length, trackA.buffer.sampleRate);
      indexOfBiggest = 0;
    }

    // Populate each output channel with a 32Float array
    for(let chan = 0; chan < outputBuffer.numberOfChannels; chan++){
                    
      // Initalize the new audio array
      let counter = 0;
      let audioData = [];
      
      // Populate from the smallest: Hardcoded for now
      let sum = 0;
      for( const smallest of holder[0].buffer.getChannelData(chan).values() ) {
                        
        // Add two elements
        const elm = ( (smallest*1.75) + (holder[1].buffer.getChannelData(chan)[counter] * 1.5)); // Mixing adds, Multiplying & Dividing sounds mad, polynomials are daft and one swamps the other
        audioData.push(elm);
        // holder[1].buffer.getChannelData(chan)[counter] = elm; // Mix on the fly
        counter++;
        sum = (sum + elm); // Sanity check data has being recieved and just a bunch of zeros
      }

      // Finish populating the channel with data from the largest array
      for (let i = counter; i < holder[1].buffer.getChannelData(chan).length; i++) {
        const elm = holder[1].buffer.getChannelData(chan).values()[i];
        audioData.push(elm);
        counter++;
        sum = (sum + elm);
      }

      // Copy data into channel
      let newChanAudio = new Float32Array(audioData);
      outputBuffer.copyToChannel(newChanAudio, chan);
      // console.log(`Audio data size = ${newChanAudio.length}, sum = ${sum}`);
    }

    // Return buffer
    return outputBuffer;
  }


  /**
   * Sum data in an audio buffer
   * 
   * @param audioBuffer 
   * @returns sum
   */
  public sumAudioBuffer(audioBuffer: any) {
    let sum = 0;
    for ( let i of audioBuffer.getChannelData(0).values()) {
      sum += i;
    }
    return sum;
  }


  /**
   * Sum the value in an array buffer
   * 
   * @param arr 
   * @returns 
   */
  public sumArrayBuffer(arr: Float32Array) {
    let sum = 0;
    for ( let i of arr.values()) {
      sum += i;
    }
    return sum;
  }

  /**
   * Generate a distortion curve from user prompt and length of audio track
   * 
   * @param amount 
   * @param trackLength 
   * @returns 
   */
  public distortionCurve(amount: number, trackLength: number) {

    // Initalize output curve
    const curve = new Float32Array(trackLength),
      deg = Math.PI / 180;
    
    // Populate distortion curve
    for ( let i = 0 ; i < trackLength; ++i ) {
      let elmNorm = (i * 2) / (trackLength - 1);
      curve[i] = ( (3 + amount) * (elmNorm * 20 * deg) ) / ( (Math.PI + amount) * Math.abs(elmNorm) );
    }

    // Return distortion curve
    return curve;
  };



  /**
   * Handle playing a track
   * 
   *  Code runs fine but track does not play
   *    Things look to be order, so hard to figure out
   *      Maybe it should return it and the page standardizes logic.
   * 
   *  Thinking that a promise should be returned, because doesn't work
   *   on page in one button but does in two
   * 
   * @param track 
   * @returns 
   */
  public playTrack(track: Track) {
    
    // Manage context + track state
    if( track.getPlayingState() ) {
      console.log(`\nError, track '${track.getName()}' is already playing`);
      return false;
    }
    this.manageState();
    console.log(this.audioCtx.state);
    // console.dir(track); // Is fine here

    // Update playing state & configure audio node
    console.log(`\nConfiguring track '${track.getName()}' to play`);
    track.setPlaying();
    const trackSource = this.audioCtx.createBufferSource();
    trackSource.buffer = track.getAudioBuffer();
    trackSource.connect(this.audioCtx.destination);

    // Logic for playing
    console.log("\nPlaying track");
    trackSource.start();
    // console.dir(trackSource); // Looks ok
    trackSource.onended =
      () => {
        track.setStop();
        trackSource.disconnect();
        // this.audioCtx.suspend(); // Want to work this in more
        console.log(`Track '${track.getName()}' is finished playing`);
      };

    // Return operation state
    console.log("Done");
    return true;
  }
}
