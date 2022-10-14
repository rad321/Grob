import { boardConstants, constants, exceptionMsg, successMsg } from "../constants/constants";
import { abandonedGame, addNewGame, findAllUsers, findGameByBoardId, findGamesByDate, findGamesByUserId, findUser, findUserById, updateBoard, updateBoardState, updateUserCredits, updateUserDef, updateUserWin } from "../database/queries";
import { Utils } from "../utils/utils";

var chessEngine = require('js-chess-engine');
var path = require("path")
var { addNewAccount } = require("../database/queries.ts");
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });
var games: Array<object> = new Array<object>

/**
 * Creazione di un nuovo account
 * @param email 
 * @param pwd 
 */
export function signUp(req, res) {
    try {
        addNewAccount(req);
        res.json(successMsg.SIGNUP_EFFETTUATO)
    } catch (err) {
        console.log("errore : " + err)
    }
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
    var game = new chessEngine.Game();
    if (req.body.color == boardConstants.PIECE_COLOR_BLACK) game.aiMove(req.params.level)
    await addNewGame(Utils.createGameMap(req, game)).then(() => { res.json(successMsg.PARTITA_INIZIATA) }).catch((err) => {
        res.json(exceptionMsg.ERR_CREAZIONE_PARTITA + err)
    })
}
/**
 * 
 * @param req 
 * @param res 
 */
export const pieceMove = async (req, res) => {
    var data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    var userid = Utils.decodeJwt(req.headers.authorization).userid
    var board = data[0].dataValues
    var game = new chessEngine.Game(JSON.parse(board.config))
    // verifica se è il turno del player
    if (JSON.parse(board.config).turn == board.color) {
        if (checkState(board, board.color, userid)) {
            game.move(req.body.from, req.body.to)
            if (checkState(board, board.color, userid)) {
                var aiMove = game.aiMove(board.level)
                res.json(aiMove)
            }
        } else res.json(successMsg.PARTITA_CONCLUSA)
    }
    // merge dello storico presente a db e dello storico delle mosse recenti
    var merge: Array<Object> = JSON.parse(board.history).concat(game.getHistory())
    updateBoard(game.exportJson(), merge, req.params.boardid)
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
    if (req.params.boardid == undefined) {
        if (req.body.date != undefined) {
            var gamesByDate = await findGamesByDate(req)
            if (gamesByDate.length == 0) res.json(exceptionMsg.PARTITE_INESISTENTI_BY_DATE).status(404)
            else res.json(setResponseItems(games, gamesByDate))
        }
        else {
            var data = await findGamesByUserId(Utils.decodeJwt(req.headers.authorization).userid)
            res.json(setResponseItems(games, data))
        }
    } else {
        var data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
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
    var game = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
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
    var moves: Array<object> = new Array<object>()
    var data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    var history = JSON.parse(data[0].dataValues.history)
    history.forEach(item => {
        var info = {
            from: item.from,
            to: item.to
        }
        moves.push(info)
    })
    res.json(moves)

}
/**
 * 
 * @param req 
 * @param res 
 */
export const getRanking = async (req, res) => {
    var ranking = new Array()
    var users = await findAllUsers()
    if (users.length != 0) {
        users.forEach(item => {
            var info = {
                id: item.dataValues.id,
                email: item.dataValues.email,
                wins: item.dataValues.wins
            }
            ranking.push(info)
        })
    }
    res.json(sortUsers(ranking, req.body.sort))
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
    var data = await findGameByBoardId(req.params.boardid, Utils.decodeJwt(req.headers.authorization).userid)
    console.log(data)
    if (data[0].dataValues.state != boardConstants.STATE_STOPPED){

        var userid = Utils.decodeJwt(req.headers.authorization).userid
        var user = await findUserById(userid)
        var cost: number = 0.40
        var credits: number = Number(user[0].dataValues.credits) - cost
        await updateUserCredits(credits, userid)
        await updateBoardState(boardConstants.STATE_STOPPED, req.params.boardid)
    } else res.json(exceptionMsg.ERR_STATO_STOPPED)
}



