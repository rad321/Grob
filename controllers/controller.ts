import { addNewGame, findAllGames, findAllUsers, findBoardId, findGamesByDate, updateBoard } from "../database/queries";
import { Utils } from "../utils/utils";

var chessEngine = require('js-chess-engine');
var path = require("path")
var { addNewAccount } = require("../database/queries.ts");
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Creazione di un nuovo account
 * @param email 
 * @param pwd 
 */
export function signUp(email, pwd) {
    addNewAccount(email, pwd);
}
/**
 * Autenticazione e creazione della stringa JWT
 * @param email 
 * @param pwd 
 * @returns 
 */
export const login = (email, pwd) => {
    return Utils.createJwt(email, pwd);
}
/**
 * Creazione di una nuova partita
 * @param req 
 */
export const createNewGame = (req) => {
    var game = new chessEngine.Game();
    addNewGame(Utils.createGameMap(req, game))
}
/**
 * 
 * @param req 
 * @param res 
 */
export const pieceMove = (req, res) => {
    findBoardId(req.params.boardId).then((data) => {
        var board = data.dataValues
        var game = new chessEngine.Game(JSON.parse(board.config))
        if (JSON.parse(board.config).turn == board.color) {
            game.move(req.body.from, req.body.to)
            var aiMove = game.aiMove()
            res.json(aiMove)
        }
        // merge dello storico presente a db e dello storico dell mosse recenti
        var merge: Array<Object> = JSON.parse(board.history).concat(game.getHistory())
        console.log(merge)
        updateBoard(game.exportJson(), merge, req.params.boardId)
    })
}
/**
 * Ricerca di una partita per ottenere informazioni come il numero di mosse totali.
 * Possibilità di filtrare le partite per data.
 * @param req 
 * @param res 
 */
export const findGames = async (req, res) => {
    if (req.body.date != undefined && req.params.boardId == undefined) findGamesByDate(req)
    else {
        var infoGames: Array<object> = new Array<object>
        // contiene tutti i dati presenti nella tabella boards
        var data = await findAllGames()
        // contiene tutti i dati presenti nella tabella users
        var users = await findAllUsers()
        users.forEach(user => {
            data.forEach(item => {
                infoGames.push(Utils.createJsonGameInfo(item, user))
            })
            res.json(infoGames)
        })
    }
}
