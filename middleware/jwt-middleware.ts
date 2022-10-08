import { findUser } from "../database/queries"
import { Utils } from "../utils/utils"

export const checkEmailJwt = (req, res, next) => {
    var token = Utils.decodeJwt(req.headers.authorization)
    if (token != null) {
        findUser(token.email).then((user) => {
            if (typeof user == 'undefined') res.json("Non esiste un account associato all'email " + req.body.email)
            else next()

        })
    } else res.json("Jwt Errato!")

}

