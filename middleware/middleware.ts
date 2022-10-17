import { StatusCodes } from "http-status-codes"
import { boardConstants, constants, exceptionMsg } from "../constants/constants"
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
    if (!Object.is(reqDate, undefined)) {
        if (!Utils.dateValidator(reqDate))
            res.status(StatusCodes.BAD_REQUEST).json(Utils.getReasonPhrase(StatusCodes.BAD_REQUEST, exceptionMsg.ERR_RANGE_DATE))
        else next()
    } else next()

}
/**
 * Funzione utilizzata per validare il body della request
 * @param req 
 * @param res 
 * @param next 
 */
export const checkSortType = (req, res, next) => {
    if (req.body.sort != constants.ORD_ASCENDENTE && req.body.sort != constants.ORD_DISCENDENTE)
        res.status(StatusCodes.BAD_REQUEST).json(Utils.getReasonPhrase(StatusCodes.BAD_REQUEST, exceptionMsg.ERR_CAMPO_SORT))
    else next()
}
/**
 * Funzione utilizzata per validare il campo credits del body
 * @param req 
 * @param res 
 * @param next 
 */
export const checkCredits = async (req, res, next) => {
    const user = Utils.decodeJwt(req.headers.authorization)
    var data = await findUser(user.email)
    if (data[0].dataValues.credits <= 0 && !req.path.includes(constants.PATH_NEWBOARD))
        res.status(StatusCodes.UNAUTHORIZED).json(Utils.getReasonPhrase(StatusCodes.UNAUTHORIZED, exceptionMsg.CREDITO_INSUFFICIENTE))

    else if (req.path.includes(constants.PATH_NEWBOARD) && req.body.color == boardConstants.PIECE_COLOR_BLACK
        && !Utils.greaterOrEqual(parseFloat( await Utils.getCredits(user.userid)), boardConstants.DECR_CREATE_BOARD + boardConstants.DECR_MOVE))
        res.status(StatusCodes.UNAUTHORIZED).json(Utils.getReasonPhrase(StatusCodes.UNAUTHORIZED, exceptionMsg.CREDITO_INSUFFICIENTE))
    else if (req.path.includes(boardConstants.STATE_STOPPED) && !Utils.greaterOrEqual(parseFloat(await Utils.getCredits(user.userid)), boardConstants.DECR_STOPPED))
        res.status(StatusCodes.UNAUTHORIZED).json(Utils.getReasonPhrase(StatusCodes.UNAUTHORIZED, exceptionMsg.CREDITO_INSUFFICIENTE))
    else
        next()
}
/**
 * Verifica se l'utente è un amministratore.
 * @param req 
 * @param res 
 * @param next 
 */
export const isAdmin = async (req, res, next) => {
    var data = await findUserById(Utils.decodeJwt(req.headers.authorization).userid)
    if (!data[0].dataValues.admin)
        res.status(StatusCodes.UNAUTHORIZED).json(Utils.getReasonPhrase(StatusCodes.UNAUTHORIZED, exceptionMsg.ERR_ADMIN))
    else next()

}
