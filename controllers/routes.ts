import { checkEmailFormat, checkIfUserExist } from "../middleware/credentials-middleware";
import { checkEmailJwt } from "../middleware/jwt-middleware";
import { checkBoardId, checkGameLevel, checkGameState, checkOptionalBoardId, checkPieceMove, checkPlayerColor, checkReqTypes, isReqUndefined } from "../middleware/game-middleware";
import { abandoned, createNewGame, findGame, findGames, getHistory, getRanking, login, pieceMove, setBoardState } from "./controller";
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
app.post('/signIn', jsonParser, checkEmailFormat, checkIfUserExist, (req, res) => {
    login(req, res);
})
/**
 * Rotta per creare una nuova partita, specificando il livello di difficoltà
 * 
 */

app.post('/boards/newboard/:level', jsonParser, checkGameLevel, checkEmailJwt, checkPlayerColor, checkReqTypes, isReqUndefined, (req, res) => {
    createNewGame(req, res)
})
/**
 * Rotta per effettuare un movimento sulla scacchiera (nuova partita o partita sospesa)
 */
app.post('/boards/:boardid/move', jsonParser, checkEmailJwt, checkBoardId, checkGameState, checkPieceMove, (req, res) => {
    pieceMove(req, res)
})
/**
 * Rotta per ottenere lo storico di una partita
 */
app.get('/boards/:boardid/history', checkEmailJwt, (req, res) => {
    getHistory(req, res)
})
/**
 * Rotta che restituisce lo stato di una partita
 */

app.post('/boards/:boardid?', jsonParser, checkEmailJwt, dateValidator, checkOptionalBoardId, (req, res) => {
    findGames(req, res)
})
/**
 * 
 */

app.get('/board/:boardid/info', jsonParser, checkEmailJwt, (req, res) => {
    findGame(req, res)
})
/**
 * 
 */
app.get('/boards/:boardid/abandoned', checkEmailJwt,checkGameState, (req, res) => {
    abandoned(req, res)
})
/**
 * 
 * 
 */
app.post('/users/ranking', jsonParser, checkSortType, (req, res) => {
    getRanking(req, res)
})
/**
 * 
 */
app.get('/boards/:boardid/stopped', checkEmailJwt, checkBoardId, (req, res) => {
    setBoardState(req, res)
})
/**
 * 
 */
app.post('/admin',checkEmailJwt,isAdmin, (req, res) => {
    updateCredits(req, res)
})


app.listen(process.env.PORT, process.env.HOST);
console.log("Partiti!");





