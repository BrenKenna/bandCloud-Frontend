
// Get user validation enum
import { UserValidation } from './user-validation';


/**
 * Interface to support overloading constructor
 */
interface UserInterface {    
    username: any;
    password: any;
    email: any;
    accountType: any;
}

/**
 * Class to support creating user objects from form data for validation
 */
export class User {
    
    // Attributes
    private username: string;
    private password: string;
    private email: string;
    private accountType: string;

    // Holder for validation enum
    private _values: string[] = [];
    private validation = {
        "state": true,
        "values": this._values
    };


    /**
     * Constructor from login view
     * @param loginView 
     */
    constructor(loginView: UserInterface);


    /**
     * Constructor from registration view
     * 
     * @param registrationView 
     */
    constructor(registrationView?: UserInterface) {
        this.username = registrationView?.username ?? "";
        this.password = registrationView?.password ?? "";
        this.email = registrationView?.email ?? "";
        this.accountType = registrationView?.accountType ?? "";
    }

    /**
     * Get username
     * 
     * @returns 
     */
    public getUsername() {
        return this.username;
    }


    /**
     * Get email
     * 
     * @returns 
     */
    public getEmail() {
        return this.email;
    }


    /**
     * Get password
     * 
     * @returns 
     */
    public getPassword() {
        return this.password;
    }


    /**
     * Get account type
     * 
     * @returns 
     */
    public getAccountType() {
        return this.accountType
    }


    /**
     * Validate properties
     * 
     * @returns 
     */
    public validate() {

        // Check lengths
        console.dir(this, {depth:null});
        if ( this.username.length < 6 || this.password.length < 8 ) {
            this.validation.values.push( UserValidation.LENGTHS );
			this.validation.state = false;
		}

        // Spaces
        let regexp = new RegExp(' ');
		if (this.username.match(regexp) || this.email.match(regexp)) {
			this.validation.values.push( UserValidation.SPACES );
			this.validation.state = false;
		}
		
		// Email format
        regexp = new RegExp(".*@[A-Za-z]+.[a-zA-z]+");
		if ( !this.email.match(regexp) ) {
			this.validation.values.push( UserValidation.EMAIL );
			this.validation.state = false;
		}
		
		// Password capital letter, numbers & special characters
        regexp = new RegExp(".*[a-zA-Z0-9].*");
        let charRegExp = new RegExp("^[a-zA-Z0-9]+$");
		if ( !this.password.match(regexp) || this.password.match(charRegExp) ) {
			this.validation.values.push( UserValidation.PASSWORD );
			this.validation.state = false;
		}

        // Return validation
        if (this.validation.values.length == 0) {
            this.validation.values.push( UserValidation.VALID );
			this.validation.state = true;
        }

        // Return validation map
        return this.validation;
    }


    /**
     * Represent object as string
     */
    public toString() {
        let output = `User(
            "username" = ${this.username},
            "email" = ${this.email},
            "password" = ${this.password},
            "accountType" = ${this.accountType}
            )`;
    }
}
