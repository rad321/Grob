import { constants, exceptionMsg } from "../constants/constants"
import { findUser, findUserById } from "../database/queries"
import { Utils } from "../utils/utils"

/**
 * Funzione utilizzata per validare il formato della data e il range di date ammissibile
 * @param req 
 * @param res 
 * @param next 
 */
export const dateValidator = (req, res, next) => {
    const reqDate = req.body.date
    console.log(Object.is(reqDate, undefined))
  
    if (!Object.is(reqDate, undefined)) {
        if (!Utils.dateValidator(reqDate)) res.json(exceptionMsg.ERR_RANGE_DATE).status(400)
        else next()
    }else next()

}
/**
 * Funzione utilizzata per validare il body della request
 * @param req 
 * @param res 
 * @param next 
 */
export const checkSortType = (req, res, next) => {
    if (req.body.sort != constants.ORD_ASCENDENTE && req.body.sort != constants.ORD_DISCENDENTE) res.json(exceptionMsg.ERR_CAMPO_SORT).status(400)
    else next()

}
/**
 * Funzione utilizzata per validare il campo credits del body
 * @param req 
 * @param res 
 * @param next 
 */
export const checkCredits = async (req, res, next) => {
    var data = await findUser(Utils.decodeJwt(req.headers.authorization).email)
    if (data[0].dataValues.credits <= 0) res.json(exceptionMsg.CREDITO_INSUFFICIENTE).status(401)
    else next()
}
export const isAdmin = async (req,res,next) =>{
    var data = await findUserById(Utils.decodeJwt(req.headers.authorization).userid)
    if(!data[0].dataValues.admin) res.json(exceptionMsg.ERR_ADMIN).status(401)
    else next()

}