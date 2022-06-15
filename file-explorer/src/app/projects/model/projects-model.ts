import { ProjectModel } from "./project-model";

interface ProjectsModelInterface {
    projects: any;
}

export class ProjectsModel {

    public projects: ProjectModel[] = [];

    /**
     * 
     * @param data 
     */
    constructor(data: ProjectsModelInterface) {
        this.projects = data?.projects ?? [];
    }


    /**
     * 
     * @returns 
     */
    public getList() {
        return this.projects;
    }
}
