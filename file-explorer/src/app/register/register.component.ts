import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../user_model/user';
import { UserValidation } from '../user_model/user-validation';
import { AccountTypes } from '../user_model/account-types';
import { BandCloudRestAccountService } from '../services/backend/band-cloud-rest-account.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

/**
 * Class to support account registration
 */
export class RegisterComponent implements OnInit {

  // Attributes
  private user: User;
  form: FormGroup;
  private validation: {} = {};
  private registerResponse: Observable<any>;
  loading = false;
  submitted = false;
  accountTypes: Array<any> = [
    { name: AccountTypes.SILVER, value: "Silver" },
    { name: AccountTypes.GOLD, value: "Gold" },
    { name: AccountTypes.PLATINUM, value: "Platnium" }
  ];

  /**
   * 
   * @param formBuilder 
   * @param accountServ 
   */
  constructor(private formBuilder: FormBuilder, private accountServ: BandCloudRestAccountService) {}


  /**
   * Initalize page with form
   */
  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [ Validators.required, Validators.minLength(6) ] ],
      email: ['', [ Validators.required, Validators.minLength(6) ] ],
      password: ['', [ Validators.required, Validators.minLength(6) ] ],
      accountType: [ this.accountTypes, [ Validators.required] ]
    });
  }


  /**
   * Get form fields
   * 
   * @returns 
   */
  get getFormFields() {
    return this.form.controls;
  }


  /**
   * Create user via registration view
   */
  public createUser() {

    // Set user property & sanity check
    this.user = new User(
      { 
        username: this.form.controls['username'].value, 
        email: this.form.controls['email'].value, 
        password: this.form.controls['password'].value,
        accountType: this.form.controls['accountType'].value
      }
    );
    console.log(this.user.toString());


    // Validate input
    this.validation = this.user.validate();
    console.dir(this.validation, {depth: null});
    return this.validation;
  }


  /**
   * 
   */
  public submitForm() {

    // Block submission of empty form
    this.createUser();
    if ( this.user == null) {
      return UserValidation.EMPTY;
    }
    
    // Update properites
    if (this.form.invalid) {
      return UserValidation.INVALID_FORM;
    }

    // Post user
    this.submitted, this.loading = true;
    this.registerResponse = this.accountServ.register(
      this.user.getUsername(),
      this.user.getEmail(),
      this.user.getPassword(),
      this.user.getAccountType()
    );
    this.registerResponse.subscribe(
      data => {
        console.dir(data, {depth: null});
        return UserValidation.VALID;
      }
    );
    this.loading, this.submitted = false;
    return UserValidation.INVALID_FORM;
  }
}
