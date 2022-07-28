import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { UserDisplay } from 'src/app/user_model/user-display/user-display';
import { UserDisplayUpdate } from 'src/app/user_model/user-display/user-display-update';

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
  // private _rootPath = "http://bandcloudapp.com:8080";
  private _rootPath = "https://bandcloudapp.com";
  private _paths = {
    "account": {

      "manager": {
        "Requests": ["POST"],
        "root" : this._rootPath + "/account/manage",
        "register": this._rootPath + "/account/manage/register",
        "login": this._rootPath + "/account/manage/login",
        "degregister": this._rootPath + "/account/manage/deregister"
      },

      "display": {
        "Requests": ["GET", "POST"],
        "root" : this._rootPath + "/account/display",
        "view": this._rootPath + "/account/display/view",
        "update": {
          "Requests": ["POST"],
          "paramTypes": [ "boolean" ],
          "params": [ "updateName", "updateEmail", "updateAuth" ],
          "path": this._rootPath + "/account/display/update"
        }
      }
    }
  };


  /**
   * Construct service with http client, methods returns observables
   * 
   * @param http
   *
   */
  constructor(private http: HttpClient) {}


  /**
   * Return observable for posting registration data
   * 
   * @param username
   * @param email 
   * @param password
   *
   */
  public register(username: String, email: String, password: String, accountHolder: String) {
    console.log("A Registration request has being sent");
    let msg = JSON.stringify({
      "username": username,
      "email": email,
      "password": password,
      "accountHolder": accountHolder
    });
    return this.http.post(this._paths.account.manager.register, msg, {"headers": this._requestHeaders});
  }


  /**
   * Return observable for posing login
   * 
   * @param username
   * @param email 
   * @param password
   * 
   */
   public login(username: String, email: String, password: String) {
    console.log("A Login request has being sent");
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
   * 
   */
   public deregister(username: String, email: String, password: String) {
    console.log("A Deregistration post request has being sent");
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
    console.log("A get UserDisplay request has being sent");
    return this.http.get<UserDisplay>(this._paths.account.display.view)
  }


  /**
   * Post user account updates
   * 
   * @param userData 
   * @param name 
   * @param email 
   * @param pass
   * 
   * @returns 
   */
  public update(userData: UserDisplayUpdate, name: boolean, email: boolean, pass: boolean, account: boolean) {

    // Manage request data
    let msg = JSON.stringify(userData);
    let uri = `${this._paths.account.display.update.path}?updateName=${name}&updateEmail=${email}&updateAuth=${pass}&updateAccount=${account}`;

    // Santy check request data
    console.log(`
      	Sending Message: ${msg},\n
        To URI: ${uri}
    `);

    // Send request
    return this.http.post(
      uri,
      msg,
      {"headers": this._requestHeaders}
      );
  }
}
