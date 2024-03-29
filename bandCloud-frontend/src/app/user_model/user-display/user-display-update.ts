
/**
 * Class to represent user display 
 */

interface UserDisplayInterface {
    username: any;
    email: any;
    password: any;
    accountHolder: any;
}

export class UserDisplayUpdate {

    // Attributes
    private username: string;
    private email: string;
    private password: string;
    private accountHolder: string;

    
    /**
     * 
     * @param username 
     * @param email 
     * @param accountType 
     */
    constructor(userUpdates: UserDisplayInterface) {
        this.username = userUpdates?.username ?? "";
        this.email = userUpdates?.email ?? "";
        this.password = userUpdates?.password ?? "";
        this.accountHolder = userUpdates?.accountHolder ?? "";
    }

    /**
     * 
     * @returns 
     */
    public getUsername() {
        return this.username;
    }


    /**
     * 
     * @returns 
     */
    public getEmail() {
        return this.email;
    }


    /**
     * 
     * @returns 
     */
     public getPassword() {
        return this.password;
    }


    /**
     * 
     * @returns 
     */
    public getAccountType() {
        return this.accountHolder;
    }


    /**
     * 
     * @returns 
     */
    public updateFor_Name() {
        return this.username !== '';
    }


    /**
     * 
     * @returns 
     */
     public updateFor_Email() {
        return this.email !== '';
    }


    /**
     * 
     * @returns 
     */
     public updateFor_Pass() {
        return this.password !== '';
    }


    /**
     * 
     * @returns 
     */
     public updateFor_Account() {
        return this.accountHolder !== '';
    }
}
