import { checkEmailFormat, checkIfUserExist, checkUserEmail } from "../middleware/credentials-middleware";
import { checkEmailJwt } from "../middleware/jwt-middleware";
import {checkBoardId, checkGameLevel, checkPieceMove} from "../middleware/game-middleware";
import { Utils } from "../utils/utils";
import { createNewGame, findGames, login, pieceMove } from "./controller";
const { signUp } = require('./controller.ts');
var express = require('express');
var fs = require('fs');
var body = require('body-parser');
var path = require('path');
const jsChessEngine = require('js-chess-engine')
var jsonParser = body.json()
var urlencodedParser = body.urlencoded({ extended: false })
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });
var app = express();

/**
 * Registrazione con email e pwd
 */
app.post('/signUp', jsonParser, checkEmailFormat, checkIfUserExist, (req, res) => {
  
        signUp(req,res)
        
})
/**
 * Login con con verifica della stringa jwt
 */
app.post('/signIn',jsonParser,checkEmailFormat,checkUserEmail,(req, res) => {

    login(req,res);

})
/**
 * Rotta per creare una nuova partita, specificando il livello di difficoltà
 * 
 */

app.post('/newGame/:level', jsonParser,checkGameLevel,checkEmailJwt,(req, res) => {
   createNewGame(req)
})
/**
 * Rotta per effettuare un movimento sulla scacchiera (nuova partita o partita sospesa)
 */
 app.post('/move/:boardId',jsonParser,checkPieceMove,checkEmailJwt,checkBoardId,(req, res) => {
    pieceMove(req,res)
})
/**
 * Rotta per ottenere lo storico di una partita
 */
app.post('/history/:id', (req, res) => {



})
/**
 * Rotta che restituisce lo stato di una partita
 */

app.post('/games/:boardId?',jsonParser,checkEmailJwt,(req,res)=>{
    console.log(req.header.authorization)
 findGames(req,res)


})





app.listen(process.env.PORT, process.env.HOST);
console.log("Partiti!");



