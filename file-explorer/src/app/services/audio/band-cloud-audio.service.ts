import { Injectable } from '@angular/core';
import { AudioContext } from 'angular-audio-context';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
    // "../../../assets/site_audio_acoustic.mp3"
    let subject = new Subject<AudioBuffer>();
    this.http.get(urlStr, {"responseType": "arraybuffer"}).subscribe(
      async (data) => {
        let audioBuffProm = await this.audioCtx.decodeAudioData(data);
        subject.next(audioBuffProm);
    });
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
}
