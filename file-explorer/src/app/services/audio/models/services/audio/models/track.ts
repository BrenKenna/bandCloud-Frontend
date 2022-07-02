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

    // Attributes
    private name: string;
    private url: string;
    private isLoaded: boolean = false;
    private audioBuffer: AudioBuffer = null;
    private dataBlob: Blob = null;
    private blobURL: URL = null;


    /**
     * Construct track from metadata
     * 
     * @param track 
     */
    constructor( track: TrackInterface ) {
        this.name = track?.name ?? "";
        this.url = track?.url ?? "";
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
}
