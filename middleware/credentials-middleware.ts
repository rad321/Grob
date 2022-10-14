import { constants, exceptionMsg } from "../constants/constants"
import { findUser } from "../database/queries"
import { Utils } from "../utils/utils"
var validator = require('email-validator')
/**
 * Verifica il formato dell'email inserita dall'utente e riporta un valore booleano.
 * @param email 
 * @returns 
 */
export const validateEmail = function (email): boolean {
    return validator.validate(email)


}
/**
 * Middleware che verifica la validità delle credenziali inserite dall'utente
 * @param req 
 * @param res 
 * @param next 
 */
export const checkEmailFormat = function (req, res, next) {

    if (validateEmail(req.body.email)) next()
    else res.json("Email non valida")




}
/**
 * Middleware che verifica se le credenziali sono presenti nel database.
 * Utilizzato in fase di registrazione.
 * @param req
 * @param res 
 * @param next 
 */
export const checkIfUserExist = async function (req, res, next) {

    var user = await findUser(req.body.email)
    if (user.length != 0) res.json(exceptionMsg.ERR_CREAZIONE_UTENZA)
    else next()
}

/**
 * Middleware che verifica se le credenziali sono presenti nel database.
 * Utilizzato durante il login.
 * @param req 
 * @param res 
 * @param next 
 */
export const checkUserEmail = function (req, res, next) {
    findUser(req.body.email).then((user) => {
        if (typeof user == constants.UNDEFINED) res.json(exceptionMsg.ERR_JWT_EMAIL + req.body.email)
        else next()

    })
}
