var jwt = require('jsonwebtoken');
var path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });

export class Utils{
    /**
     * Creazione della stringa JWT
     * @param email 
     * @param pwd 
     * @returns 
     */
    static createJwt(email,pwd){
         return jwt.sign({email : email,password : pwd}, process.env.SECRET_KEY)

    }
    /**
     * Decodifica del json  web token per ottenere e verificare le credenziali dell'utente
     * @param token 
     * @returns 
     */
    static decodeJwt(token){
        return jwt.verify(token,process.env.SECRET_KEY);
    }
}