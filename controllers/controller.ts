import { addNewGame } from "../database/queries";
import { Utils } from "../utils/utils";

var chessEngine = require('js-chess-engine');
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

export const createNewGame= (request) =>{
    var game = chessEngine.Game();
    addNewGame(Utils.createGameMap(request,game))
    
    
}




