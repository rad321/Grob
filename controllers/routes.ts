import { checkEmail, checkEmailFormat, checkIfUserExist } from "../middleware/credentials-middleware";
import { checkEmailJwt } from "../middleware/jwt-middleware";
import { checkActiveBoards, checkBoardId, checkGameLevel, checkGameState, checkOptionalBoardId, checkPieceMove, checkPlayerColor, checkReqTypes, isReqUndefined } from "../middleware/game-middleware";
import { abandoned, createNewGame, findBoardInfo, findBoards,getHistory, getRanking, login, pieceMove, setBoardState } from "./controller";
import { checkCredits, checkSortType, dateValidator, isAdmin } from "../middleware/middleware";
import { updateCredits } from "./admin-controller";
const { signUp } = require('./controller.ts');
var express = require('express');
var body = require('body-parser');
var path = require('path');
var jsonParser = body.json()
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });
var app = express();

/**
 * Registrazione con email e pwd
 */
app.post('/signUp', jsonParser, checkEmailFormat, checkIfUserExist, (req, res) => {
    signUp(req, res)
})
/**
 * Login con con verifica della stringa jwt
 */
app.post('/signIn', jsonParser, checkEmailFormat, checkEmail, (req, res) => {
    login(req, res);
})
/**
 * Rotta per creare una nuova partita, specificando il livello di difficoltà
 * 
 */

app.post('/boards/newboard/:level', jsonParser,checkEmailJwt,checkCredits,checkGameLevel,checkPlayerColor, checkReqTypes, isReqUndefined, (req, res) => {
    createNewGame(req, res)
})
/**
 * Rotta per effettuare un movimento sulla scacchiera (nuova partita o partita sospesa)
 */
app.post('/boards/:boardid/move', jsonParser, checkEmailJwt, checkBoardId,checkActiveBoards, checkGameState, checkPieceMove, (req, res) => {
    pieceMove(req, res)
})
/**
 * Rotta per ottenere lo storico di una partita
 */
app.get('/boards/:boardid/history', checkEmailJwt, (req, res) => {
    getHistory(req, res)
})
/**
 * Rotta che restituisce informazioni su una o più partite
 */

app.post('/boards/:boardid?', jsonParser, checkEmailJwt,checkBoardId, dateValidator,(req, res) => {
    findBoards(req, res)
})
/**
 * Rotta che restituisce lo stato di una partita
 */

app.get('/board/:boardid/info', jsonParser, checkEmailJwt,checkBoardId, (req, res) => {
    findBoardInfo(req, res)
})
/**
 * Rotta utilizzata per abbandonare una partita
 */
app.get('/boards/:boardid/abandoned', checkEmailJwt,checkGameState, (req, res) => {
    abandoned(req, res)
})
/**
 * Rotta che restituisce la classifica dei giocatori
 * 
 */
app.post('/users/ranking', jsonParser, checkSortType, (req, res) => {
    getRanking(req, res)
})
/**
 * Rotta utilizzata per interrompere una partita
 */
app.get('/boards/:boardid/stopped', checkEmailJwt,checkCredits, checkBoardId,checkGameState, (req, res) => {
    setBoardState(req, res)
})
/**
 * Rotta utilizzata per agiornare il credito di un utente
 */
app.put('/users/admin',jsonParser,checkEmailJwt,isAdmin, (req, res) => {
    updateCredits(req, res)
})


app.listen(process.env.PORT, process.env.HOST);
console.log("Partiti!");





