/**
 * Class to support representing user account profiles
 */
export class UserDisplay {

    // Attributes
    private userID: string
    private username: string;
    private email: string;
    private accountType: string;
    
    /**
     * Construct user display from main data
     * 
     * @param username 
     * @param email 
     * @param accountType 
     */
    constructor(userID: string, username: string, email: string, accountType: string) {
        this.userID = userID;
        this.username = username;
        this.email = email;
        this.accountType = accountType;
    }

    /**
     * 
     * @returns 
     */
    public getUserID() {
        return this.userID;
    }

    /**
     * 
     * @returns 
     */
    public getUserName() {
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
     public getAccountType() {
        return this.accountType;
    }
}
