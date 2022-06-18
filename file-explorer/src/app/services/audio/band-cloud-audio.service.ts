import { Injectable } from '@angular/core';
import { AudioContext } from 'angular-audio-context';

@Injectable({
  providedIn: 'root'
})
export class BandCloudAudioService {

  private audioCtx: AudioContext = new (window['AudioContext'] || window['webkitAudioContext'])();
  constructor() { }


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
  public whiteNoiseTest() {
    
    // Create an empty 2 second buffer at the sampling rate of AC
    let channels = 2;
    let frameCount = this.audioCtx.sampleRate * 10.0;
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

    /*
    // Connect to audio graph
    console.dir(whiteNoiseBuffer, {depth: null});
    let soundSrc = this.audioCtx.createBufferSource();
    soundSrc.buffer = whiteNoiseBuffer;
    soundSrc.connect(this.audioCtx.destination);
    */
  }
}
