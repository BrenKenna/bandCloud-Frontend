import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectModel } from 'src/app/projects/model/project-model';
import { ProjectsModel } from 'src/app/projects/model/projects-model';

@Injectable({
  providedIn: 'root'
})
export class BandCloudRestProjectsService {

  // Attribute to hold request headers
  private _requestHeaders = {
    "content-type": "application/json"
  };

  // Attribute to hold endpoints etc
  private _rootPath = "http://localhost:8080";
  private _paths = {
    "projects": {
        "Requests": ["GET"],
        "root" : this._rootPath + "/projects",
        "projects-viewer": this._rootPath + "/projects/listProjects",
        "project-viewer": this._rootPath + "/projects/listProject"
    }
  };


  /**
   * 
   * @param http 
   */
  constructor(private http: HttpClient) { }


  /**
   * 
   * @returns 
   */
  public getProjects() {
    return this.http.get<ProjectsModel>(this._paths.projects['projects-viewer'], {"headers": this._requestHeaders});
  }


  /**
   * 
   * @param projectName 
   * @returns 
   */
  public get_singleProject(projectName: string) {
    let url = `${this._paths.projects['project-viewer']}/?projectName=${projectName}`;
    return this.http.get<ProjectModel>(url, {"headers": this._requestHeaders});
  }
}
