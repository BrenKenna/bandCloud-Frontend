import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { BandCloudRestAccountService } from '../services/backend/band-cloud-rest-account.service';
import { UserDisplay } from '../user_model/user-display/user-display';

@Component({
  selector: 'app-account-displayer',
  templateUrl: './account-displayer.component.html',
  styleUrls: ['./account-displayer.component.scss']
})
export class AccountDisplayerComponent implements OnInit {

  user: UserDisplay;
  // user: any;

  constructor(private accountServ: BandCloudRestAccountService) {}


  ngOnInit() {
    this.accountServ.view().subscribe(
      data => {
        this.user = data;
    });
  }

  /**
   * 
   * @returns 
   */
  public getUserID() {
    return this.user.getUserID();
  }


  /**
   * 
   * @returns 
   */
   public getUserName() {
    return this.user.getUserName();
  }


  /**
   * 
   * @returns 
   */
   public getEmail() {
    return this.user.getEmail();
  }


  /**
   * 
   * @returns 
   */
  public getAccountType() {
    return this.user.getAccountType();
  }
}
