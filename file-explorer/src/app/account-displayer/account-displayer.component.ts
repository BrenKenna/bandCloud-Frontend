import { Component, OnInit } from '@angular/core';

import { BandCloudRestAccountService } from '../services/backend/band-cloud-rest-account.service';
import { UserDisplay } from '../user_model/user-display/user-display';
import { AccountTypes } from '../user_model/account-types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDisplayUpdate } from '../user_model/user-display/user-display-update';
import { UserValidation } from '../user_model/user-validation';

@Component({
  selector: 'app-account-displayer',
  templateUrl: './account-displayer.component.html',
  styleUrls: ['./account-displayer.component.scss']
})
export class AccountDisplayerComponent implements OnInit {

  // Attributes
  user: UserDisplay;
  accountTypes: Array<any> = [
    { name: AccountTypes.SILVER, value: "Silver" },
    { name: AccountTypes.GOLD, value: "Gold" },
    { name: AccountTypes.PLATINUM, value: "Platnium" }
  ]
  
  // Manage user updates
  updates: FormGroup;
  userUpdates: UserDisplayUpdate;

  /**
   * 
   * @param accountServ 
   */
  constructor(private accountServ: BandCloudRestAccountService, private formBuilder: FormBuilder) {};


  /**
   * 
   */
  ngOnInit() {
    this.updates = this.formBuilder.group({
      username: ['', [ Validators.required, Validators.minLength(6) ] ],
      email: ['', [ Validators.required, Validators.minLength(6) ] ],
      newPass: ['', [ Validators.required, Validators.minLength(6) ] ],
      oldPass: ['', [ Validators.required, Validators.minLength(6) ] ],
      accountType: [ this.accountTypes, [ Validators.required] ]
    });
  };


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


  /**
   * Send user data updates
   */
  public sendUpdates() {

    // Fetch data from form fields & sanity check
    this.userUpdates = new UserDisplayUpdate({
      username: this.updates.controls['username'].value,
      email: this.updates.controls['email'].value,
      password: this.updates.controls['newPass'].value
    });
    console.dir(this.userUpdates, {depth: null});


    // Check data
    let updateMap = {
      "username": this.userUpdates.updateFor_Name(),
      "email": this.userUpdates.updateFor_Email(),
      "password": this.userUpdates.updateFor_Pass()
    }
    console.dir(updateMap, {depth: null});


    // Post update
    let updateResponse = this.accountServ.update(
      this.userUpdates,
      updateMap.username,
      updateMap.email,
      updateMap.password
    );


    // Manage response
    updateResponse.subscribe(
      data => {
        console.dir(data, {depth: null});
        return UserValidation.VALID;
      }
    );
  }

/**
 * username = billyJoel
 * email = billyJoel@BillyJole.com
 * password = cdFGDf&*crtf768y%^9u0ipokjhD
 */
}
