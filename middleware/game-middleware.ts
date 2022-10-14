import { boardConstants, constants, exceptionMsg, successMsg } from "../constants/constants"
import { findGameByBoardId } from "../database/queries"
import { Utils } from "../utils/utils"
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkGameLevel = (req, res, next) => {
    if (req.params.level >= 0 && req.params.level < 5) next()
    else res.json("Il livello inserito è insistente, inserire un livello compreso tra 0 e 4").status(401)
}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const isReqUndefined = (req, res, next) => {

    if (Object.is(req.body.color, undefined)) res.json("Request errata, può contenere solo il campo 'color'").status(401)
    else next()
}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkReqLength = (req, res, next) => {
    if (Object.keys(req.body).length > 1) { res.json("Request errata, può contenere solo il campo 'color'").status(401) }
    else next()
}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkPlayerColor = (req, res, next) => {
    if (!Object.is(req.body.color, 'white') && !Object.is(req.body.color, 'black')) { res.status(401).json(exceptionMsg.ERR_CAMPO_COLOR) }
    else next()
}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkReqTypes = (req, res, next) => {
    if (!isNaN(req.body.color)) { res.status(400).json(exceptionMsg.ERR_CAMPO_COLOR_TIPO) }
    else next()
}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkBoardId = async (req, res, next) => {
    if (req.params.boardid != constants.EMPTY_PARAM_BOARDID) {
        var data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
        if (data.length == 0) res.json(exceptionMsg.PARTITA_INESISTENTE_BY_ID).status(404)
        else next()
    } else res.json(exceptionMsg.ERR_PARAM_BOARDID).status(400)
}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkOptionalBoardId= async  (req,res,next) =>{
    var data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    if(data.length == 0) res.json(exceptionMsg.BOARD_INESISTENTE)
    else next()


}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkPieceMove = async (req, res, next) => {
    var data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    if (data.length == 0) res.json(exceptionMsg.PARTITA_INESISTENTE_BY_ID)
    else {
        var moves = JSON.parse(data[0].dataValues.config).moves
        if (req.body.from in moves && moves[req.body.from].includes(req.body.to)) next()
        else res.json(exceptionMsg.ERR_MOSSA_NON_VALIDA).status(401)
    }
}
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkGameState = async (req, res, next) => {
    var data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    if (data[0].dataValues.state == boardConstants.STATE_ABANDONED || data[0].dataValues.config.isFinished) res.json(exceptionMsg.PARTITA_ABBANDONATA).status(401)
    else next()
}


