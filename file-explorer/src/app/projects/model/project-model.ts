import { FileMetadata } from "./file-metadata";

/**
 * Interface to support project construction
 */
interface ProjectModelInterface {
    projectName: any,
    projectSize: number;
    rawAudio: any;
    mixed: any;
}


/**
 * Class to support representing a project
 */
export class ProjectModel {

    // Attributes
    public readonly projectName: string;
    public readonly projectSize: number;
    public readonly rawAudio: FileMetadata[];
    public readonly mixed: FileMetadata;


    /**
     * 
     * @param params 
     */
    constructor(params:ProjectModelInterface) {
        this.projectName = params?.projectName ?? '';
        this.projectSize = params?.projectSize ?? -1;
        this.rawAudio = params?.rawAudio ?? null;
        this.mixed = params?.mixed ?? null;
    }


    /**
     * 
     * @returns 
     */
    public getProjectName() {
        return this.projectName;
    }


    /**
     * 
     * @returns 
     */
     public getProjectSize() {
        return this.projectSize;
    }


    /**
     * 
     * @returns 
     */
     public getRawAudio() {
        return this.rawAudio;
    }


    /**
     * 
     * @returns 
     */
     public getMixed() {
        return this.mixed;
    }
}
