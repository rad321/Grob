import { checkEmailFormat, checkIfUserExist} from "../middleware/credentials-middleware";
const {signUp} = require ('./controller.ts');
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
app.post('/signUp',jsonParser,checkEmailFormat,checkIfUserExist, (req,res) =>{
    try{
    signUp(req.body.email,req.body.pwd)
     res.json("SignUp OK!")
    }catch{
     res.json("Errore")
    }


    

})
/**
 * Login con con verifica della stringa jwt
 */
app.post('/signIn',(req,res) =>{

})
/**
 * Rotta per creare una nuova partita, specificando il livello di difficoltà
 */

app.post('/newGame/:level',jsonParser, (req,res) =>{


   



})
/**
 * Rotta per ottenere lo storico di una partita
 */
app.post('/history/:id', (req,res) =>{
    
    
})
/**
 * Rotta per effettuare un movimento sulla scacchiera (nuova partita o partita sospesa)
 */
app.post('/move/:boardId', (req,res) =>{

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