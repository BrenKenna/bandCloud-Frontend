import { Component, OnInit } from '@angular/core';

import { BandCloudRestAccountService } from '../services/backend/band-cloud-rest-account.service';
import { UserDisplay } from '../user_model/user-display/user-display';

@Component({
  selector: 'app-account-displayer',
  templateUrl: './account-displayer.component.html',
  styleUrls: ['./account-displayer.component.scss']
})
export class AccountDisplayerComponent implements OnInit {

  user: UserDisplay;

  constructor(private accountServ: BandCloudRestAccountService) {};
  ngOnInit() {};

  /*
  ngOnInit() {
    this.accountServ.view().subscribe(
      data => {
        this.user = data;
    });
  }
  */


  /**
   * Fetch user display data
   * 
   */
  public fetch() {
    this.accountServ.view().subscribe(
      data => {
        this.user = data;
        console.dir(this.user, {depth: null});
    });
  }
}
