import { Track } from "./track";


/**
 * Class to encapsulate a collection of tracks
 * 
 */
export class Tracks {

    // Attributes
    private tracks: Track[] = [];
    public offset: number = 0;

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
}
