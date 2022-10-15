import { boardConstants, constants, exceptionMsg, successMsg } from "../constants/constants"
import { findGameByBoardId } from "../database/queries"
import { Utils } from "../utils/utils"
import { StatusCodes } from "http-status-codes"
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkGameLevel = (req, res, next) => {
    if (req.params.level >= 0 && req.params.level < 5)
        next()
    else
        res.status(StatusCodes.UNAUTHORIZED).json(Utils.getReasonPhrase(StatusCodes.UNAUTHORIZED, exceptionMsg.ERR_LIVELLO_INESISTENTE))
}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const isReqUndefined = (req, res, next) => {
    if (Object.is(req.body.color, undefined))
        res.status(StatusCodes.BAD_REQUEST).json(Utils.getReasonPhrase(StatusCodes.BAD_REQUEST, exceptionMsg.ERR_REQUEST_COLOR))
    else
        next()
}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkPlayerColor = (req, res, next) => {
    if (!Object.is(req.body.color, boardConstants.PIECE_COLOR_WHITE) && !Object.is(req.body.color, boardConstants.PIECE_COLOR_BLACK))
        res.status(StatusCodes.BAD_REQUEST).json(Utils.getReasonPhrase(StatusCodes.BAD_REQUEST, exceptionMsg.ERR_CAMPO_COLOR))
    else
        next()
}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkReqTypes = (req, res, next) => {
    if (!isNaN(req.body.color)) res.status(StatusCodes.BAD_REQUEST).json(Utils.getReasonPhrase(StatusCodes.BAD_REQUEST, exceptionMsg.ERR_CAMPO_COLOR_TIPO))
    else
        next()
}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkBoardId = async (req, res, next) => {
    if (req.params.boardid != constants.EMPTY_PARAM_BOARDID) {
        let data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
        if (data.length == 0)
            res.status(StatusCodes.NOT_FOUND).json(Utils.getReasonPhrase(StatusCodes.NOT_FOUND, exceptionMsg.PARTITA_INESISTENTE_BY_ID))
        else
            next()
    } else
        res.status(StatusCodes.NOT_FOUND).json(Utils.getReasonPhrase(StatusCodes.NOT_FOUND, exceptionMsg.ERR_PARAM_BOARDID))
}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkOptionalBoardId = async (req, res, next) => {
    var data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    if (data.length == 0) res.status(StatusCodes.NOT_FOUND).json(Utils.getReasonPhrase(StatusCodes.NOT_FOUND, exceptionMsg.PARTITA_INESISTENTE_BY_ID))
    else
        next()
}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkPieceMove = async (req, res, next) => {
    var data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    let moves = JSON.parse(data[0].dataValues.config).moves
    if (req.body.from in moves && moves[req.body.from].includes(req.body.to))
        next()
    else
        res.status(StatusCodes.BAD_REQUEST).json(Utils.getReasonPhrase(StatusCodes.BAD_REQUEST, exceptionMsg.ERR_MOSSA_NON_VALIDA))
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkGameState = async (req, res, next) => {
    var data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    if (data[0].dataValues.state == boardConstants.STATE_ABANDONED || data[0].dataValues.config.isFinished)
        res.status(StatusCodes.BAD_REQUEST).json(Utils.getReasonPhrase(StatusCodes.BAD_REQUEST, exceptionMsg.PARTITA_ABBANDONATA))
    else
        next()
}


