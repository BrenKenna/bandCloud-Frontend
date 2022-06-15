import { FileTag } from "./file-tag";
import { TokenTag } from "./token-tag";


/**
 * Interface to support metadata construction
 */
interface FileMetaDataInterface {
    path: any,
	fileSize: any,
	fileTag: any,
	tokenTag: any
}


/**
 * Class to support representing metadata of audio files
 * 
 */
export class FileMetadata {

    // Attributes
    public readonly path: string;
	public readonly fileSize: number;
	public fileTag: FileTag;
	public readonly tokenTag: TokenTag;


    /**
     * Construct from metadata interface
     * 
     * @param metaData
     */
    constructor(metaData: FileMetaDataInterface) {
        this.path = metaData?.path ?? '';
        this.fileSize = metaData?.fileSize ?? -1;
        this.fileTag = metaData?.fileTag ?? null;
        this.path = metaData?.tokenTag ?? null;
    }


    /**
     * 
     * @returns 
     */
    public getPath() {
        return this.path;
    }


    /**
     * 
     * @returns 
     */
    public getFileSize() {
        return this.fileSize;
    }
    

    /**
     * 
     * @returns 
     */
    public getFileTag() {
        return this.fileTag;
    }


    /**
     * 
     * @returns 
     */
    public getTokenTag() {
        return this.fileTag;
    }
}
