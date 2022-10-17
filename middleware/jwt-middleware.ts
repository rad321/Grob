import { StatusCodes } from "http-status-codes"
import { constants, exceptionMsg } from "../constants/constants"
import { findUser } from "../database/queries"
import { Utils } from "../utils/utils"
/**
 * Verifica se l'email presente nel payload esiste a db.
 * @param req 
 * @param res 
 * @param next 
 */
export const checkEmailJwt = (req, res, next) => {
    const token = req.headers.authorization
    const jwtDecode = token == undefined ? Utils.decodeJwt(token) : res.status(StatusCodes.BAD_REQUEST).json(Utils.getReasonPhrase(StatusCodes.BAD_REQUEST,exceptionMsg.ERR_JWT))
    if (jwtDecode != null) {
        findUser(jwtDecode.email).then((user) => {
            if (typeof user == constants.UNDEFINED) res.status(StatusCodes.UNAUTHORIZED).json(Utils.getReasonPhrase(StatusCodes.UNAUTHORIZED, exceptionMsg.ERR_JWT_EMAIL + req.body.email))
            else next()
        })
    } else res.status(StatusCodes.UNAUTHORIZED).json(Utils.getReasonPhrase(StatusCodes.UNAUTHORIZED, exceptionMsg.ERR_JWT))
}

