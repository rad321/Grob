import { Utils } from "../utils/utils";

var path = require("path")
var {addNewAccount} = require("../database/queries.ts");
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Creazione di un nuovo account
 * @param email 
 * @param pwd 
 */
export function signUp (email,pwd){
    addNewAccount(email,pwd);
}
/**
 * Autenticazione e creazione della stringa JWT
 * @param email 
 * @param pwd 
 * @returns 
 */
export const login = (email,pwd) =>{
    return  Utils.createJwt(email,pwd);
}





