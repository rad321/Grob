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
    try {
        signUp(req.body.email, req.body.pwd)
        res.json("SignUp OK!")
    } catch {
        res.json("Errore")
    }
})
/**
 * Login con con verifica della stringa jwt
 */
app.post('/signIn',jsonParser,checkEmailFormat,checkUserEmail,(req, res) => {
try{
    let token = login(req.body.email,req.body.pwd);
    console.log(token)
    res.json(token);
    
}catch{
    res.json("Errore")
}



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
 findGames(req,res)


})





app.listen(process.env.PORT, process.env.HOST);
console.log("Partiti!");



/**
 * 
 * 
 *    const game = new jsChessEngine.Game();
    console.log(req.body)
    console.log(Object.keys(req.body)[0])
    console.log(Object.values(req.body)[0])
    var m1 =game.aiMove();
    var m2 = game.move(Object.keys(req.body)[0],Object.values(req.body)[0])
    console.log(m1)
    var m2 = game.aiMove();
    console.log(m2)
    //game.exportJson();
    res.send(game.getHistory());
 */