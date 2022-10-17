import { boardConstants, constants, exceptionMsg, successMsg } from "../constants/constants"
import { findActiveGames, findGameByBoardId } from "../database/queries"
import { Utils } from "../utils/utils"
import { StatusCodes } from "http-status-codes"
/**
 * Verifica se il livello di difficoltà inserito è ammissibile.
 * @param req 
 * @param res 
 * @param next 
 */
export const checkGameLevel = (req, res, next) => {
    console.log(req.baseUrl)
    if (req.params.level >= 0 && req.params.level < 5)
        next()
    else
        res.status(StatusCodes.UNAUTHORIZED).json(Utils.getReasonPhrase(StatusCodes.UNAUTHORIZED, exceptionMsg.ERR_LIVELLO_INESISTENTE))
}
/**
 * Verifica se i campi della request sono definiti.
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
 * Verifica se il colore inserito nella request è ammissibile.
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
 * Verifica se il tipo inserito è ammissibile.
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
 * Verifica se la partita esiste nel database.
 * La ricerca viene fatta per Id.
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
 *  Verifica se la partita esiste nel database.
 * La ricerca viene fatta per Id.
 * Il parametro boardid è facoltativo.
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
 * Verifica sei il movimento effettuato dall'utente è ammissibile.
 * La verifica viene fatta utilizzando la board-configuration presente a db.
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
 * Verifica lo stato della partita.
 * Genera messaggio di errore in caso di partita già conclusa
 * @param req 
 * @param res 
 * @param next 
 */
export const checkGameState = async (req, res, next) => {
    var data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    if (data[0].dataValues.state == boardConstants.STATE_ABANDONED || data[0].dataValues.state == boardConstants.STATE_WIN
        || data[0].dataValues.state == boardConstants.STATE_DEFEAT || JSON.parse(data[0].dataValues.config).isFinished)
        res.status(StatusCodes.CONFLICT).json(Utils.getReasonPhrase(StatusCodes.CONFLICT, exceptionMsg.PARTITA_CONCLUSA))
    else if (req.path.includes(boardConstants.STATE_STOPPED) && data[0].dataValues.state == boardConstants.STATE_STOPPED)
        res.status(StatusCodes.CONFLICT).json(Utils.getReasonPhrase(StatusCodes.CONFLICT, exceptionMsg.ERR_PARTITA_INTERROTTA))
    else
        next()
}
/**
 * Verifica che l'utente non abbia più di una partita attiva.
 * @param req 
 * @param res 
 * @param next 
 */
export const checkActiveBoards = async (req,res,next) =>{
    var boards = await findActiveGames(Utils.decodeJwt(req.headers.authorization).userid)
    if(boards.length > 1) res.status(StatusCodes.UNAUTHORIZED).json(Utils.getReasonPhrase(StatusCodes.UNAUTHORIZED,exceptionMsg.ERR_NUMERO_PARTITE_INIZIATE))
    else next()

}


