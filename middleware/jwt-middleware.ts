import { constants, exceptionMsg } from "../constants/constants"
import { findUser } from "../database/queries"
import { Utils } from "../utils/utils"
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkEmailJwt = (req, res, next) => {
    const token= req.headers.authorization
    var jwtDecode = Utils.decodeJwt(token)
    if (jwtDecode != null) {
        findUser(jwtDecode.email).then((user) => {
            if (typeof user == constants.UNDEFINED) res.json(exceptionMsg.ERR_JWT_EMAIL + req.body.email).status(401)
            else next()
        })
    } else res.json(exceptionMsg.ERR_JWT)
}

