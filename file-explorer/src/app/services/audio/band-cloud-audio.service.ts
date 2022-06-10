import { Injectable } from '@angular/core';
import {AUDIO_CONTEXT} from '@ng-web-apis/audio';

@Injectable({
  providedIn: 'root'
})
export class BandCloudAudioService {

  constructor(private readonly audioCtx: AudioContext) { }


  public test() {
    
    // Create an empty 2 second buffer at the sampling rate of AC
    let channels = 2;
    let frameCount = this.audioCtx.sampleRate * 2.0;
    let whiteNoiseBuffer = this.audioCtx.createBuffer(channels, frameCount, this.audioCtx.sampleRate);
    
    // Fill each channel with white noise
    for( let channel = 0; channel < 1; channel++) {
        
        // Get the buffer array and populate it with random data
        let chanBuff = whiteNoiseBuffer.getChannelData(channel);
        for(let i = 0; i < frameCount; i++) {
            chanBuff[i] = (Math.random() * 2) - 1;
        }
    }

    // Connect to audio graph
    let soundSrc = this.audioCtx.createBufferSource();
    soundSrc.buffer = whiteNoiseBuffer;
    soundSrc.connect(this.audioCtx.destination);
  }
}
