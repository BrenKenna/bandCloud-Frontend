import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

//
import { BandCloudRestAccountService } from '../services/backend/band-cloud-rest-account.service';
import { User } from '../user_model/user';
import { UserValidation } from '../user_model/user-validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Attributes
  user: User;
  private validation: {} = {};
  private loginResponse: Observable<any>;
  submitted = false;
  loading = false;
  form: FormGroup;


  /**
   * 
   * @param formBuilder 
   * @param accountServ 
   */
  constructor(private formBuilder: FormBuilder, private accountServ: BandCloudRestAccountService) { }


  /**
   * Initalize component with a form
   */
  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [ Validators.required, Validators.minLength(6) ] ],
      email: ['', [ Validators.required, Validators.minLength(6) ] ],
      password: ['', [ Validators.required, Validators.minLength(6) ] ]
    });
  }


  /**
   * Create user via registration view
   */
   private createUser() {

    // Set user property & sanity check
    this.user = new User(
      { 
        username: this.form.controls['username'].value, 
        email: this.form.controls['email'].value, 
        password: this.form.controls['password'].value,
        accountType: ""
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

    // Post user
    this.submitted, this.loading = true;
    this.loginResponse = this.accountServ.login(
      this.user.getUsername(),
      this.user.getEmail(),
      this.user.getPassword()
    );
    this.loginResponse.subscribe(
      data => {
        console.dir(data, {depth: null});
        return UserValidation.VALID;
      }
    );
    this.loading, this.submitted = false;
    return UserValidation.INVALID_FORM;
  }


  /**
   * Get form fields
   * 
   * @returns 
   */
   get getFormFields() {
    return this.form.controls;
  }

}
