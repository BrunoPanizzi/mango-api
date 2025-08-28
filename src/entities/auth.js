export class LoginCredentials {
    /**
     * 
     * @param {string} email 
     * @param {string} password 
     * @param {string} role
     */
    constructor(email, password, role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    /**
     * Cria uma instância de LoginCredentials a partir de um objeto
     * 
     * @param {Object} obj
     * @param {string} obj.email
     * @param {string} obj.password
     * @param {string} obj.role
     * 
     * @returns {LoginCredentials}
     */
    static fromObj(obj) {
        return new LoginCredentials(
            obj.email,
            obj.password,
            obj.role
        );
    }
}