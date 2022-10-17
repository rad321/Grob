import { StatusCodes } from "http-status-codes"
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
    else res.status(StatusCodes.BAD_REQUEST).json(Utils.getReasonPhrase(StatusCodes.BAD_REQUEST,exceptionMsg.ERR_EMAIL_NON_VALIDA))
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
    if (user.length != 0) res.status(StatusCodes.CONFLICT).json(Utils.getReasonPhrase(StatusCodes.CONFLICT,exceptionMsg.ERR_CREAZIONE_UTENZA))
    else next()
}
/**
 * Verifica se l'email è presente nel database.
 * @param req 
 * @param res 
 * @param next 
 */
export const checkEmail = async function (req, res, next) {
    var user = await findUser(req.body.email)
    if (user.length == 0) res.status(StatusCodes.CONFLICT).json(Utils.getReasonPhrase(StatusCodes.CONFLICT,exceptionMsg.ERR_JWT_EMAIL))
    else next()
}

