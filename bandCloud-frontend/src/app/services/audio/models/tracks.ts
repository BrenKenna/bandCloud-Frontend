import { Track } from "./track";


/**
 * Class to encapsulate a collection of tracks
 * 
 */
export class Tracks {

    // Attributes
    public tracks: Track[] = [];
    public offset: number = 0;
    public mixedTrack: Track;

    /**
     * Empty to constructor because a track can be added/dropped
     */
    constructor(){};


    /**
     * Return list of tracks
     * @returns 
     */
    public getTracks() {
        return this.tracks;
    }


    /**
     * Get the mixed track
     * 
     * @returns 
     */
    public getMix() {
        return this.mixedTrack;
    }


    /**
     * Internal method to handle mixing process
     * 
     * @returns Float32Array/null
     */
    public mixTracks() {

        // Return null if no tracks
        if ( this.tracks.length == 0 ) {
            return null;
        }  

        // Sort tracks ascendingly
        let
            audioData = [],
            output
        ;
        this.bubbleSort();

        // Add each audio signal to output
        let trackIter = 0, sum = 0;
        for ( let track of this.getTracks() ) {

            // Either push and add the data
            let elmIter = 0;
            for( const elm of track.getAudioBuffer().getChannelData(0) ) {

                // Push if first track
                if(trackIter == 0) {
                    audioData.push(elm);
                }

                // Add if second
                else {
                    audioData[elmIter] = (elm + audioData[elmIter]);
                    elmIter++;
                }

                // Add to running sum for sanity checking
                sum += elm;
            }

            // Increment track
            trackIter++;
        }

        // Return output
        output = new Float32Array(audioData);
        console.dir(output);
        console.log(`Output array size = ${output.length}, Audio Signal Sum = ${sum}`);
        return output;
    }

    /**
     * Get offset for multi-track playing
     * 
     * @returns - number
     */
    public getOffset() {
        return this.offset;
    }


    /**
     * Update offset based on time from audio-context
     * 
     * @param currentTime 
     */
    public setOffset(currentTime: number) {
        this.offset = currentTime;
    }


    /**
     * Reset the offest
     */
    public reset_offset() {
        let active = false;
        for( let track of this.tracks ) {
            active = track.getPlayingState();
        }

        if (active) {
            console.log(`Error, track from set is still active`);
            return false;
        }
        else {
            this.offset = 0;
            console.log(`Track offset has been reset to zero`);
            return true;
        }
    }

    /**
     * Method to handle syncronizing play time, at 0 or however long now
     *  - Offset equally 0
     * 
     * @param currentTime 
     * @returns 
     */
    public getSyncedTime(currentTime: number) {
        if( this.offset == 0) {
            this.offset = currentTime;
            return 0;
        }
        return ( currentTime - this.offset );
    }

    /**
     * Return list of track names
     * 
     * @returns 
     */
    public getTrackNames() {
        
        // Handle empty list
        let output: string[] = [];
        if ( this.tracks.length == 0 ) {
            return output;
        }

        // Add track names
        for( let track of this.tracks ) {
            output.push(track.getName());
        }
        return output;
    }


    /**
     * List track names by their playing state
     * 
     * @param state - true = playing, false = not
     * @returns - list of track names
     */
    public getTracksByState(state: boolean) {

        // Handle empty list
        let output: string[] = [];
        if ( this.tracks.length == 0 ) {
            return output;
        }

        // Add track names
        for( let track of this.tracks ) {
            if( state ) {
                if( track.getPlayingState() ) {
                    output.push(track.getName());
                }
            }
            else {
                if( !track.getPlayingState() ) {
                    output.push(track.getName());
                }
            }
        }
        return output;
    }


    /**
     * Check if track exists
     * 
     * @param track 
     * @returns - boolean
     */
    public hasTrack(track: Track) {
        for(let i of this.tracks) {
            if( i.isTrack(track) ) {
                return true;
            }
        }
        return false;
    }


    /**
     * Check if track exists
     * 
     * @param track 
     * @returns - boolean
     */
     public hasTrackName(trackName: string) {
        for(let i of this.tracks) {
            if( i.getName() === trackName ) {
                return true;
            }
        }
        return false;
    }


    /**
     * Return index of track -1 = null
     * 
     * @param query 
     * @returns - number
     */
    public indexOfTrack(query: Track) {

        // Initialize serarch params
        let index = -1, counter = 0;
        for( let track of this.tracks ) {

            // Update index if match
            if ( track.isTrack(query) ) {
                index = counter;
            }
            counter++;
        }

        // Return result
        return index;
    }


    /**
     * Get track
     * 
     * @param query 
     * @returns - track/null
     */
    public getTrack(query: Track) {
        let index = this.indexOfTrack(query);
        if ( index >= 0 ) {
            return this.tracks[index];
        }
        return null;
    }


    /**
     * Return track matching name or null
     * 
     * @param query 
     * @returns - Track/null
     */
    public getTrackByName(query: string) {

        // Return track matching name
        for(let track of this.tracks) {
            if( track.getName() === query ) {
                return track;
            }
        }

        // Otherwise null
        return null;
    }

    /**
     * Sort tracks by ascending size
     * 
     */
    private sizeSort() {

        // Initalize parameters
        let swap = false;
        let counter = 0, nextIter = 1;
        for( let track of this.tracks ) {

            // Operate within bounds of list
            if(nextIter < this.tracks.length) {

                // Hold reference for next & swap if smaller
                const holder = this.tracks[nextIter];
                if( track.getTrackSize() > holder.getTrackSize() ) {
                    this.tracks[nextIter] = track;
                    this.tracks[counter] = holder;
                    swap = true;
                }
            }

            // Increment parameters
            counter++; 
            nextIter++;
        }

        // Return whether or not swap occurred
        return swap;
    }


    /**
     * Bubble sort tracks by increasing size
     */
    public bubbleSort() {
        let sorting = true;
        while( sorting ) {
            sorting = this.sizeSort();
        }
    }


    /**
     * Add a track
     * 
     * @param track 
     * @returns boolean
     */
    public addTrack(track: Track) {
        if ( this.indexOfTrack(track) == -1 ) {
            this.tracks.push(track);
            return true;
        }
        return false;
    }


    /**
     * Drop a track
     * 
     * @param track 
     */
    public dropTrack(track: Track) {

        // Drop track if in list
        let index = this.indexOfTrack(track);
        if ( index > -1 ) {

            // Set index null and resolve
            this.tracks[index] = null;
            this.resolveNull();
        }
    }


    /**
     * Resolve null entries in track list
     */
    private resolveNull() {

        // Drop null if tracks are in list
        if ( this.tracks.length >= 1 ) {

            // Initialize new array
            let output: Track[] = [];
            for( let track of this.tracks ) {

                // Add to new list if not null
                if(track != null) {
                    output.push(track);
                }
            }

            // Update tracks
            this.tracks = output;
        }
    }


    /**
     * Drop a track by their name
     * 
     * @param trackName 
     */
    public dropTrackByName(trackName: string) {
        let track: Track = this.getTrackByName(trackName);
        if ( track != null ) {
            this.dropTrack(track);
        }
    }


    /**
     * Fetch largest track
     * 
     * @returns Track
     */
    public getLargest() {
        this.bubbleSort();
        return this.tracks[ this.tracks.length -1 ];
    }


    /**
     * Set mixed track
     * 
     * @param mix 
     */
    public setMixedTrack(mix: Track) {
        this.mixedTrack = mix;
    }

    /**
     * Fetch the track data of largest track
     * 
     */
    public getLargest_TrackData () {
        this.getLargest().getTrackData();
    }     
}