/**
 * Interface to support construction of file tag
 */
interface FileTagInterface{
    owner: any,
    lastEditor: any;
}


/**
 * Class to support file tag interactions
 */
export class FileTag {

    // Attributes
    public readonly owner: string;
    public readonly lastEditor: string;


    /**
     * Construct file tag from interface
     * 
     * @param fileTag 
     */
    constructor(fileTag: FileTagInterface) {
        this.owner = fileTag?.owner ?? '';
        this.lastEditor = fileTag?.lastEditor ?? '';
    }


    /**
     * Get userID of person who created file
     * 
     * @returns 
     */
    public getOwner() {
        return this.owner;
    }


    /**
     * Get the last editor of the file
     * 
     * @returns 
     */
    public getLastEditor() {
        return this.lastEditor;
    }
}
