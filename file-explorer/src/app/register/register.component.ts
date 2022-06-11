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
  private form: FormGroup;
  private validation: {} = {};
  private registerResponse: Observable<any>;
  private loading = false;
  private submitted = false;

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
      username: ['', Validators.required, Validators.minLength(6)],
      email: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      accountType: [ AccountTypes, [Validators.required]]
    });
  }


  /**
   * Get form fields
   * 
   * @returns 
   */
  public getFormFields() {
    return this.form.controls;
  }


  /**
   * Create user via registration view
   */
  public createUser() {

    // Set user property & sanity check
    this.user = new User(
      { 
        username: this.form.get("username"), 
        email: this.form.get("email"), 
        password: this.form.get("password"),
        accountType: this.form.get("AccountType"),
      }
    );
    console.dir(this.user.toString(), {depth: null});


    // Validate input
    this.validation = this.user.validate();
    console.dir(this.validation, {depth: null});
    return this.validation;
  }


  /**
   * 
   * @returns 
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
    this.registerResponse = this.accountServ.register(this.user.getUsername(), this.user.getEmail(), this.user.getPassword());
    this.registerResponse.subscribe(
      data => {
        console.dir(data, {depth: null});
      },
    );
  }
}
