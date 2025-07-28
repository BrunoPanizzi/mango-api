export class LoginCredentials {
    /**
     * 
     * @param {string} email 
     * @param {string} password 
     */
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    /**
     * Cria uma instância de LoginCredentials a partir de um objeto
     * 
     * @param {Object} obj
     * @param {string} obj.email
     * @param {string} obj.password
     * 
     * @returns {LoginCredentials}
     */
    static fromObj(obj) {
        return new LoginCredentials(
            obj.email,
            obj.password,
        );
    }
}