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

  constructor(private accountServ: BandCloudRestAccountService) {}

  ngOnInit() {
    this.accountServ.view().subscribe(
      data => {
        this.user = new UserDisplay(data.getUserID(), data.getUsername(), data.getEmail(), data.getAccountType());
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

  public getAccountType() {
    return this.user.getAccountType();
  }
}
