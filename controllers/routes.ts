import { checkEmailFormat, checkIfUserExist, checkUserEmail } from "../middleware/credentials-middleware";
import { checkEmailJwt } from "../middleware/jwt-middleware";
import { checkBoardId, checkGameLevel, checkGameState, checkOptionalBoardId, checkPieceMove, checkPlayerColor, checkReqLength, checkReqTypes, isReqUndefined } from "../middleware/game-middleware";
import { abandoned, createNewGame, findGame, findGames, getHistory, getRanking, login, pieceMove, setBoardState, updateCredits } from "./controller";
import { checkSortType, dateValidator, isAdmin } from "../middleware/middleware";
import { abandonedGame, updateUserCredits } from "../database/queries";
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
app.post('/signIn', jsonParser, checkEmailFormat, checkUserEmail, (req, res) => {
    login(req, res);
})
/**
 * Rotta per creare una nuova partita, specificando il livello di difficoltà
 * 
 */

app.post('/newGame/:level', jsonParser, checkGameLevel, checkEmailJwt, checkPlayerColor, checkReqLength, checkReqTypes, isReqUndefined, (req, res) => {
    createNewGame(req, res)
})
/**
 * Rotta per effettuare un movimento sulla scacchiera (nuova partita o partita sospesa)
 */
app.post('/move/:boardid', jsonParser, checkEmailJwt, checkBoardId, checkGameState, checkPieceMove, (req, res) => {
    pieceMove(req, res)
})
/**
 * Rotta per ottenere lo storico di una partita
 */
app.get('/history/:boardid', checkEmailJwt, (req, res) => {
    getHistory(req, res)




})
/**
 * Rotta che restituisce lo stato di una partita
 */

app.post('/games/:boardid?', jsonParser, checkEmailJwt,dateValidator,checkOptionalBoardId, (req, res) => {
    findGames(req, res)
})
/**
 * 
 */

app.get('/game/:boardid', jsonParser, checkEmailJwt, (req, res) => {
    findGame(req, res)
})
/**
 * 
 */
app.get('/abandoned/:boardid', checkEmailJwt, (req, res) => {
    abandoned(req, res)
})

/**
 * 
 * 
 */
app.post('/ranking', jsonParser, checkSortType, (req, res) => {
    getRanking(req, res)

})
/**
 * 
 */
app.get('/stopped/:boardid',checkEmailJwt,checkBoardId,(req, res) => {
    setBoardState(req,res)

})
/**
 * 
 */
app.post('/admin',isAdmin, (req, res) => {
    updateCredits(req,res)

})


app.listen(process.env.PORT, process.env.HOST);
console.log("Partiti!");





