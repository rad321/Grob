import { StatusCodes } from "http-status-codes";
import { boardConstants, constants, exceptionMsg, successMsg } from "../constants/constants";
import { abandonedGame, addNewGame, findAllUsers, findGameByBoardId, findGamesByDate, findGamesByUserId, findUser, findUserById, updateBoard, updateBoardState, updateUserCredits, updateUserDef, updateUserWin } from "../database/queries";
import { Utils } from "../utils/utils";

var chessEngine = require('js-chess-engine');
var path = require("path")
var { addNewAccount } = require("../database/queries.ts");
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });
let games: Array<object> = new Array
let totCost = boardConstants.DECR_CREATE_BOARD + boardConstants.DECR_MOVE

/**
 * Creazione di un nuovo account
 * @param email 
 * @param pwd 
 */
export function signUp(req, res) {
    addNewAccount(req).then(() => res.json(Utils.getReasonPhrase(StatusCodes.OK,successMsg.SIGNUP_EFFETTUATO))) .catch((err) => res.json(Utils.getReasonPhrase(StatusCodes.CONFLICT,err)) )       
}
/**
 * Autenticazione e creazione della stringa JWT
 * @param email 
 * @param pwd 
 * @returns 
 */
export const login = (req, res) => {
    return Utils.createJwt(req, res);
}
/**
 * Creazione di una nuova partita
 * @param req 
 */
export const createNewGame = async (req, res) => {
    const game = new chessEngine.Game();
    const userid = Utils.decodeJwt(req.headers.authorization).userid
    if (req.body.color == boardConstants.PIECE_COLOR_BLACK) {
        checkMinCredits(userid,game,req,res)
    }
}
/**
 * 
 * @param userid 
 * @param game 
 * @param req 
 * @param res 
 */
async function checkMinCredits(userid,game,req,res){
    if (Utils.greaterOrEqual(Number(Utils.getCredits(userid)), totCost)) {
        updateUserCredits(userid, Number(Utils.getCredits(userid)) - totCost)
        game.aiMove(req.params.level)
        await addNewGame(Utils.createGameMap(req, game)).then(() => { res.status(StatusCodes.OK).json(Utils.getReasonPhrase(StatusCodes.OK, successMsg.PARTITA_INIZIATA)) }).catch((err) => {
            res.status(StatusCodes.CONFLICT).json(Utils.getReasonPhrase(StatusCodes.CONFLICT, exceptionMsg.ERR_CREAZIONE_PARTITA + err))
        })
    } else
         res.status(StatusCodes.UNAUTHORIZED).json(Utils.getReasonPhrase(StatusCodes.UNAUTHORIZED, exceptionMsg.CREDITO_INSUFFICIENTE))
}
/**
 * 
 * @param req 
 * @param res 
 */
export const pieceMove = async (req, res) => {
    let data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    let userid = Utils.decodeJwt(req.headers.authorization).userid
    let board = data[0].dataValues
    let game = new chessEngine.Game(JSON.parse(board.config))
    if (isStopped(board, userid))
        updateBoardState(boardConstants.STATE_IN_PROGRESS, board.id)
    // verifica se è il turno del player
    if (JSON.parse(board.config).turn == board.color) {
        makeMovement(board,userid,game,req,res)
    }
    updateBoard(game.exportJson(), JSON.parse(board.history).concat(game.getHistory()), req.params.boardid)
}
/**
 * 
 * @param board 
 * @param userid 
 * @param game 
 * @param req 
 * @param res 
 */
function makeMovement(board,userid,game,req,res){
    if (checkState(board, board.color, userid)) {
        game.move(req.body.from, req.body.to)
        updateUserCredits(Number(Utils.getCredits(userid)) - boardConstants.DECR_MOVE, userid)
        if (checkState(board, board.color, userid)) {
            let aiMove = game.aiMove(board.level)
            res.json(aiMove)
        }
    } else res.json(successMsg.PARTITA_CONCLUSA)
}
/**
 * 
 * @param board 
 * @param userid 
 * @returns 
 */

function isStopped(board, userid) {
    if (board.state == boardConstants.STATE_STOPPED) return true
    else return false

}
/**
 * 
 * @param board 
 * @param color 
 * @param id 
 * @returns 
 */
function checkState(board, color, id) {
    if (JSON.parse(board.config).checkMate && JSON.parse(board.config).turn == color) {
        updateConfig(boardConstants.STATE_WIN, id)
        updateBoardState(boardConstants.STATE_WIN, id)
        return false
    }
    else if (JSON.parse(board.config).checkMate && JSON.parse(board.config).turn != color) {
        updateConfig(boardConstants.STATE_DEFEAT, id)
        updateBoardState(boardConstants.STATE_DEFEAT, id)
        return false
    }
    else return true;
}

/**
 * 
 * @param state 
 * @param id 
 */
async function updateConfig(state, id) {
    if (Object.is(state, boardConstants.STATE_WIN)) await updateUserWin(id)
    else await updateUserDef(id)
}
/**
 * Ricerca di una partita per ottenere informazioni come il numero di mosse totali.
 * Possibilità di filtrare le partite per data.
 * @param req 
 * @param res 
 */
export const findGames = async (req, res) => {
    if (req.params.boardid == constants.EMPTY_PARAM_BOARDID) {
        if (req.body.date != undefined) {
            let gamesByDate = await findGamesByDate(req)
            if (gamesByDate.length == 0) res.json(exceptionMsg.PARTITE_INESISTENTI_BY_DATE).status(404)
            else res.status(StatusCodes.OK).json(setResponseItems(games, gamesByDate))
        }
        else {
            var data = await findGamesByUserId(Utils.decodeJwt(req.headers.authorization).userid)
            res.status(StatusCodes.OK).json(setResponseItems(games, data))
        }
    } else {
        let data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
        res.json(Utils.createJsonGameInfo(data[0].dataValues))
    }
}
/**
 * 
 * @param items 
 * @param data 
 * @returns 
 */
function setResponseItems(items: Array<object>, data) {
    items = []
    Object.keys(data).forEach(key => {
        items.push(Utils.createJsonGameInfo(data[key].dataValues))
    })
    return items
}
/**
 * 
 * @param req 
 * @param res 
 */
export const findGame = async (req, res) => {
    let game = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    res.json(createGameJsonResponse(game))
}
/**
 * 
 * @param game 
 * @returns 
 */
function createGameJsonResponse(game) {
    if (game.length == 0) return exceptionMsg.PARTITA_INESISTENTE_BY_ID
    else {
        var config = JSON.parse(game[0].dataValues.config)
        return {
            isOver: config.isFinished,
            checkMate: config.checkMate,
            check: config.check,
            turn: config.turn,
            abandoned: (game[0].dataValues.state == boardConstants.STATE_ABANDONED ? true : false)
        }
    }
}
/**
 * 
 * @param req 
 * @param res 
 */
export const abandoned = async (req, res) => {
    abandonedGame(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
        .then(() => { res.json(successMsg.PARTITA_ABBANDONATA) }).catch((err) => res.json(exceptionMsg.ERR_PARTITA_ABBANDONATA + err))
}
/**
 * 
 * @param req 
 * @param res 
 */
export const getHistory = async (req, res) => {
    let moves: Array<object> = new Array<object>()
    let data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    JSON.parse(data[0].dataValues.history).forEach(item => { moves.push({ from: item.from, to: item.to }) })
    res.status(StatusCodes.OK).json(moves)
}

/**
 * 
 * @param req 
 * @param res 
 */
export const getRanking = async (req, res) => {
    let ranking = new Array()
    let users = await findAllUsers()
    if (users.length != 0) users.forEach(item => { ranking.push(createInfoJson(item)) })
    res.status(StatusCodes.OK).json(sortUsers(ranking, req.body.sort))
}
/**
 * 
 * @param item 
 * @returns 
 */
function createInfoJson(item) {
    return { id: item.dataValues.id, email: item.dataValues.email, wins: item.dataValues.wins }
}
/**
 * 
 * @param ranking 
 * @param sortType 
 * @returns 
 */
function sortUsers(ranking, sortType) {
    if (Object.is(sortType, constants.ORD_ASCENDENTE)) ranking.sort((a, b) => a.wins - b.wins)
    else if (Object.is(sortType, constants.ORD_DISCENDENTE)) ranking.sort((a, b) => b.wins - a.wins)
    return Utils.createRanking(ranking, sortType)
}
/**
 * 
 * @param req 
 * @param res 
 */
export const setBoardState = async (req, res) => {
    let userid = Utils.decodeJwt(req.headers.authorization).userid
    var data = await findGameByBoardId(req.params.boardid, userid)
    if (data[0].dataValues.state != boardConstants.STATE_STOPPED) {
        let user = await findUserById(userid)
        let credits: number = Number(user[0].dataValues.credits) - boardConstants.DECR_STOPPED
        await updateUserCredits(credits, userid)
        await updateBoardState(boardConstants.STATE_STOPPED, req.params.boardid)
    } else res.status(StatusCodes.CONFLICT).json(Utils.getReasonPhrase(StatusCodes.CONFLICT, exceptionMsg.ERR_STATO_STOPPED))
}



