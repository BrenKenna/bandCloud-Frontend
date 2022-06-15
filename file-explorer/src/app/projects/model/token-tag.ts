/**
 * Interface to support token tag construction
 */
interface TokenTagInterface {
    url: any,
    expireDate: any
}


/**
 * Class to support token tag interactions
 */
export class TokenTag {

    // Attributes
    public readonly url: string;
    public readonly expireDate: string;


    /**
     * Construct file tag from interface
     * 
     * @param tokenTag 
     */
    constructor(tokenTag: TokenTagInterface) {
        this.url = tokenTag?.url ?? '';
        this.expireDate = tokenTag?.expireDate ?? '';
    }


    /**
     * Get userID of person who created file
     * 
     * @returns 
     */
    public getUrl() {
        return this.url;
    }


    /**
     * Get the last editor of the file
     * 
     * @returns 
     */
    public getExpireDate() {
        return this.expireDate;
    }
}
