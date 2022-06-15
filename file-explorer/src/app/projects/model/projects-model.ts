import { ProjectModel } from "./project-model";

interface ProjectsModelInterface {
    projects: any;
}

export class ProjectsModel {

    public readonly projects: ProjectModel[];
    constructor(data: ProjectsModelInterface) {
        this.projects = data?.projects ?? [];
    }
}
