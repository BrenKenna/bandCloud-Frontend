/**
 * 
 * Rational is that a track can be constructed from the FileMetaData objects.
 * That data can be used to here to hold audio data.
 * I want to avoid having higher level classes having to handle obervables as much
 * as possible. Main reason this is here tbh
 * 
 * I was going for the route that the audio-workbench could have three track lists:
 *  1. An immutable project: Track[]
 *  2. Editable multiTrack: Track[], toMix: Track[] / Tracks
 * 
 * The second attributes can hold references to the project, allowing
 * new references to be added/dropped from muliTrack & toMix based on what
 * the user does
 * 
 */


// Modules to support track
import { HttpClient, HttpHandler  } from "@angular/common/http";
import { IAudioContext } from "angular-audio-context";
import { Subject } from "rxjs";
import { BandCloudAudioService } from "src/app/services/audio/band-cloud-audio.service";


/**
 * Interface to support constructing track
 */
interface TrackInterface {
    name: string;
    url: string;
};


/**
 * 
 * Class to model track data
 * 
 */
export class Track {

    // Core attributes
    private name: string;
    private url: string;
    private isLoaded: boolean = false;
    private isPlaying: boolean = false;
    private audioBuffer: AudioBuffer = null;
    private audioCtx: IAudioContext;

    // Track data
    private trackData = {
        "frameCount": 0,
        "samplingRate": 0,
        "trackDuration": 0,
        "nChannels": 0
    };


    // An idea not yet not fully formed
    //  Could/should a track be responsible for posting itself
    private dataBlob: Blob = null;
    private blobURL: URL = null;


    /**
     * Construct track from metadata
     * 
     * @param track 
     */
    constructor(private audioServ: BandCloudAudioService, track: TrackInterface ) {
        this.name = track?.name ?? "";
        this.url = track?.url ?? "";
        console.dir(this);
    }


    /**
     * Get name of track
     * 
     * @returns string-name 
     */
    public getName() {
        return this.name;
    }


    /**
     * Get url of track
     * 
     * @returns string-url 
     */
     public getUrlString() {
        return this.url;
    }


    /**
     * Return the audio buffer
     * 
     * @returns 
     */
    public getAudioBuffer() {
        return this.audioBuffer;
    }


    /**
     * Return whether track has loaded
     * 
     * @returns 
     */
    public getLoadedState() {
        return this.isLoaded
    }


    /**
     * Return track summary data
     * 
     * @returns 
     */
    public getTrackData() {
        return this.trackData;
    }


    /**
     * Get an audio signal from a channel
     * 
     * @param channel 
     * @returns arraybuffer
     */
    public getAudioSignal(channel: number) {
        return this.audioBuffer.getChannelData(channel);
    }


    /**
     * Get size of audio signal
     * 
     * @returns 
     */
    public getTrackSize() {
        return this.trackData.frameCount;
    }


    /**
     * Get duration of track
     * 
     * @returns 
     */
    public getTrackDuration() {
        return this.trackData.trackDuration;
    }


    /**
     * Get sample rate of track
     * 
     * @returns 
     */
    public getTrackSampleRate() {
        return this.trackData.samplingRate;
    }


    /**
     * Get channel count of audio buffer
     * 
     * @returns 
     */
    public getChannelCount() {
        return this.trackData.nChannels;
    }


    /*
    public fetchAudio() {
        console.log("\nGet audio started");
        let subject = new Subject<AudioBuffer>();
        this.http.get(this.url, {"responseType": "arraybuffer"}).subscribe(
            async (data) => {
            console.log(data.byteLength);
            let audioBuffProm = await this.audioCtx.decodeAudioData(data);
            console.log(`\nI got this back ${audioBuffProm}`);
            subject.next(audioBuffProm);
        });
        console.log(`\nAnd I will return this ${subject}`);
        return subject.asObservable();
    }
    */

    /**
     * Use the audio service to fetch an audio buffer for this track
     *  and note that it is loaded
     */
    public setAudioBuffer() {
        console.log(`URL to use is ${this.url}`);
        this.audioServ.getAudio(this.url).subscribe( 
            (data) => {

                // Update audio buffer
                this.audioBuffer = data;
                this.isLoaded = true;

                // Update track metadata
                this.trackData.frameCount = data.length;
                this.trackData.nChannels = data.numberOfChannels;
                this.trackData.samplingRate = data.sampleRate;
                this.trackData.trackDuration = data.duration
        });
    }


    /**
     * Get current playing state
     * 
     * @returns playing-boolean
     */
    public getPlayingState() {
        return this.isPlaying;
    }


    /**
     * Set playing state to true
     */
    public setPlaying() {
        this.isPlaying = true;
    }


    /**
     * Set playing state to false
     */
    public setStop() {
        this.isPlaying = false;
    } 


    /**
     * Method to compare tracks by their name
     * 
     * @param track 
     * @returns boolean
     */
    public isTrack (track: Track) {
        return this.name === track.getName();
    }
}
