import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

/**
 * Class to support requests to the backend account endpoints
 */
export class BandCloudRestAccountService {

  // Attribute to hold request headers
  private _requestHeaders = {
    "content-type": "application/json"
  };

  // Attribute to hold endpoints etc
  private _rootPath = "http://localhost:8080";
  private _paths = {
    "account": {

      "manager": {
        "Requests": ["POST"],
        "root" : this._rootPath + "/account/manager",
        "register": this._rootPath + "/account/manager/register",
        "login": this._rootPath + "/account/manager/login",
        "degregister": this._rootPath + "/account/manager/deregister"
      },

      "display": {
        "Requests": ["GET", "POST"],
        "root" : this._rootPath + "/account/display",
        "view": this._rootPath + "/account/display/view",
        "update": {
          "Requests": ["POST"],
          "paramTypes": [ "boolean" ],
          "params": [ "updateName", "updateEmail", "updatePass"  ],
          "path": this._rootPath + "/account/display/update"
        }
      }
    }
  };


  /**
   * Construct service with http client, methods returns observables
   * 
   * @param http 
   */
  constructor(private http: HttpClient) {}


  /**
   * Return observable for posting registration data
   * 
   * @param username
   * @param email 
   * @param password 
   */
  public register(username: String, email: String, password: String) {
    let msg = JSON.stringify({
      "username": username,
      "email": email,
      "password": password
    });
    return this.http.post(this._paths.account.manager.register, msg, {"headers": this._requestHeaders});
  }


  /**
   * Return observable for posing login
   * 
   * @param username
   * @param email 
   * @param password 
   */
   public login(username: String, email: String, password: String) {
    let msg = JSON.stringify({
      "username": username,
      "email": email,
      "password": password
    });
    return this.http.post(this._paths.account.manager.login, msg, {"headers": this._requestHeaders});
  }


  /**
   * Return observable for posting deregistring an account
   * 
   * @param username
   * @param email 
   * @param password 
   */
   public deregister(username: String, email: String, password: String) {
    let msg = JSON.stringify({
      "username": username,
      "email": email,
      "password": password
    });
    return this.http.post(this._paths.account.manager.register, msg, {"headers": this._requestHeaders});
  }

  /**
   * Return observable for getting account data
   * 
   */
   public view() {
    return this.http.get(this._paths.account.display.view);
  }
}
