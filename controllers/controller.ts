import { StatusCodes } from "http-status-codes";
import { boardConstants, constants, exceptionMsg, successMsg } from "../constants/constants";
import { abandonedGame, addNewGame, findAllUsers, findGameByBoardId, findGamesByDate, findGamesByUserId, findUser, findUserById, updateBoard, updateBoardState, updateUserCredits, updateUserDef, updateUserWin } from "../database/queries";
import { Utils } from "../utils/utils";
import { updateCredits } from "./admin-controller";
var chessEngine = require('js-chess-engine');
var path = require("path")
var { addNewAccount } = require("../database/queries.ts");
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });
let games: Array<object> = new Array
let totCost = boardConstants.DECR_CREATE_BOARD + boardConstants.DECR_MOVE

/**
 * Creazione di un nuovo account.
 * @param req 
 * @param res 
 */
export function signUp(req, res) {
    addNewAccount(req).then(() => res.json(Utils.getReasonPhrase(StatusCodes.OK, successMsg.SIGNUP_EFFETTUATO))).catch((err) => res.json(Utils.getReasonPhrase(StatusCodes.CONFLICT, err)))
}
/**
 * Autenticazione e creazione della stringa JWT.
 * @param req
 * @param res 
 * @returns 
 */
export const login = (req, res) => {
    return Utils.createJwt(req, res);
}
/**
 * Creazione di una nuova partita.
 * @param req 
 */
export const createNewGame = async (req, res) => {
    const game = new chessEngine.Game();
    const userid = Utils.decodeJwt(req.headers.authorization).userid
    checkPlayerColor(userid, game, req, res)

}
/**
 * Verifica il credito da sottrarre in base al colore scelto dall'utente.
 * @param userid 
 * @param game 
 * @param req 
 * @param res 
 */
async function checkPlayerColor(userid, game, req, res) {
    if (req.body.color == boardConstants.PIECE_COLOR_BLACK) {
        await updateUserCredits(parseFloat(await Utils.getCredits(userid)) - totCost, userid)
        game.aiMove(req.params.level)
    }
    else
        await updateUserCredits(parseFloat(await Utils.getCredits(userid)) - boardConstants.DECR_CREATE_BOARD, userid)
    await addNewGame(Utils.createGameMap(req, game)).then(() => res.status(StatusCodes.OK).json(Utils.getReasonPhrase(StatusCodes.OK, successMsg.PARTITA_INIZIATA))).catch((err) =>
        res.status(StatusCodes.CONFLICT).json(Utils.getReasonPhrase(StatusCodes.CONFLICT, exceptionMsg.ERR_CREAZIONE_PARTITA + err))
    )
}
/**
 * Effettua un movimento ammissibile.
 * Per ogni movimento viene verificato lo stato della partita, così da concluderla in caso di scacco matto o ritiro.
 * Per ogni movimento vengono ridotti i crediti disponibili dell'utente.
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
        //verifica lo stato della partita
        if (checkState(board, board.color, userid)) {
            game.move(req.body.from, req.body.to)
            await updateUserCredits(parseFloat(await Utils.getCredits(userid)) - boardConstants.DECR_MOVE, userid)
            if (checkState(board, board.color, userid)) {
                let aiMove = game.aiMove(board.level)
                await updateUserCredits(parseFloat(await Utils.getCredits(userid)) - boardConstants.DECR_MOVE, userid).catch((err) => err)
                res.json(aiMove)
            }
        } else res.status(StatusCodes.UNAUTHORIZED).json(Utils.getReasonPhrase(StatusCodes.UNAUTHORIZED, successMsg.PARTITA_CONCLUSA))
    }
    await updateBoard(game.exportJson(), JSON.parse(board.history).concat(game.getHistory()), req.params.boardid)
}
/**
 * Verifica se una partita è stata interrotta.
 * @param board 
 * @param userid 
 * @returns 
 */
function isStopped(board, userid) {
    if (board.state == boardConstants.STATE_STOPPED) return true
    else return false
}
/**
 * Verifica lo stato di una partita.
 * Assegna la vittoria o la sconfitta in base a chi ha fatto scacco matto.
 * @param board 
 * @param color 
 * @param id 
 * @returns 
 */
async function checkState(board, color, id) {
    if (JSON.parse(board.config).checkMate && JSON.parse(board.config).turn == color) {
        updateUserState(boardConstants.STATE_WIN, id)
        updateBoardState(boardConstants.STATE_WIN, id)
        updateUserCredits(parseFloat(await Utils.getCredits(id)), id)
        return false
    }
    else if (JSON.parse(board.config).checkMate && JSON.parse(board.config).turn != color) {
        updateUserState(boardConstants.STATE_DEFEAT, id)
        updateBoardState(boardConstants.STATE_DEFEAT, id)
        return false
    }
    else return true;
}

/**
 * Aggiorna il numero di vittorie o sconfitte di un utente
 * @param state 
 * @param id 
 */
async function updateUserState(state, id) {
    if (Object.is(state, boardConstants.STATE_WIN)) await updateUserWin(id)
    else await updateUserDef(id)
}
/**
 * Ricerca di una partita per ottenere informazioni come il numero di mosse totali.
 * Possibilità di filtrare le partite per data.
 * @param req 
 * @param res 
 */
export const findBoards = async (req, res) => {
    if (req.params.boardid == constants.EMPTY_PARAM_BOARDID) {
        if (req.body.date != undefined) {
            let gamesByDate = await findGamesByDate(req)
            if (gamesByDate.length == 0) res.status(StatusCodes.NOT_FOUND).json(Utils.getReasonPhrase(StatusCodes.NOT_FOUND, exceptionMsg.PARTITE_INESISTENTI_BY_DATE))
            else res.status(StatusCodes.OK).json(setResponseItems(games, gamesByDate))
        } else {
            var data = await findGamesByUserId(Utils.decodeJwt(req.headers.authorization).userid)
            res.status(StatusCodes.OK).json(setResponseItems(games, data))
        }
    } else {
        let data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
        res.status(StatusCodes.OK).json(Utils.createJsonGameInfo(data[0].dataValues))
    }
}
/**
 * Genera json da passare come response
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
 * Trova la partita cercata.
 * Come response vengono passate le informazioni della partita
 * @param req 
 * @param res 
 */
export const findBoardInfo = async (req, res) => {
    let game = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    res.json(createGameJsonResponse(game, res))
}
/**
 * Creazione di json da passare come response
 * @param game 
 * @returns 
 */
function createGameJsonResponse(game, res) {
        var config = JSON.parse(game[0].dataValues.config)
        return {
            isOver: config.isFinished,
            checkMate: config.checkMate,
            check: config.check,
            turn: config.turn,
            abandoned: (game[0].dataValues.state == boardConstants.STATE_ABANDONED ? true : false)
        }
}
/**
 * Abbandona una partita.
 * Viene effettuato un set dello stato della partita scelta.
 * @param req 
 * @param res 
 */
export const abandoned = async (req, res) => {
    abandonedGame(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
        .then(() => { res.json(Utils.getReasonPhrase(StatusCodes.OK, successMsg.PARTITA_ABBANDONATA)) })
        .catch((err) => res.status(StatusCodes.CONFLICT).json(Utils.getReasonPhrase(StatusCodes.CONFLICT, exceptionMsg.ERR_PARTITA_ABBANDONATA + err)))
}
/**
 * Funzione che riporta lo storico delle mosse di una partita.
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
 * Funzione che riporta la classifica dei giocatori,ordinata in base al parametro inserito dall'utente.
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
 * Creazione del json da passare come response
 * @param item 
 * @returns 
 */
function createInfoJson(item) {
    return { id: item.dataValues.id, email: item.dataValues.email, wins: item.dataValues.wins, defeats: item.dataValues.defeats }
}
/**
 * Funzione che ordina gli utenti da inserire in classifica.
 * Il dato preso in considerazione per l'ordinamento è la differenza tra vittorie e sconfitte.
 * @param ranking 
 * @param sortType 
 * @returns 
 */
function sortUsers(ranking, sortType) {
    if (Object.is(sortType, constants.ORD_ASCENDENTE)) ranking.sort((a, b) => (a.wins - a.defeats) - (b.wins - b.defeats))
    else if (Object.is(sortType, constants.ORD_DISCENDENTE)) ranking.sort((a, b) => (b.wins - b.defeats) - (a.wins - a.defeats))
    return Utils.createRanking(ranking, sortType)
}
/**
 * Aggiornamento dello stato di una partita
 * @param req 
 * @param res 
 */
export const setBoardState = async (req, res) => {
    let userid = Utils.decodeJwt(req.headers.authorization).userid
    let user = await findUserById(userid)
    let credits: number = Number(user[0].dataValues.credits) - boardConstants.DECR_STOPPED
    await updateUserCredits(credits, userid)
    await updateBoardState(boardConstants.STATE_STOPPED, req.params.boardid)
    res.status(StatusCodes.OK).json(Utils.getReasonPhrase(StatusCodes.OK, successMsg.PARTITA_INTERROTTA))
}



