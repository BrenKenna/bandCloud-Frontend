import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

/**
 * Class to support requests to backend project endpoints
 */
export class BandCloudRestProjectService {

  // Attribute to hold request headers
  private _requestHeaders = {
    "content-type": "application/json"
  };

  // Attribute to hold endpoints etc
  private _rootPath = "http://localhost:8080";
  private _paths = {};

  constructor(private http: HttpClient) { }
}
