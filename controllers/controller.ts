import { addNewGame, findBoardId } from "../database/queries";
import { Utils } from "../utils/utils";

var chessEngine = require('js-chess-engine');
var path = require("path")
var {addNewAccount} = require("../database/queries.ts");
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Creazione di un nuovo account
 * @param email 
 * @param pwd 
 */
export function signUp (email,pwd){
    addNewAccount(email,pwd);
}
/**
 * Autenticazione e creazione della stringa JWT
 * @param email 
 * @param pwd 
 * @returns 
 */
export const login = (email,pwd) =>{
    return  Utils.createJwt(email,pwd);
}

export const createNewGame= (req) =>{
    var game = new chessEngine.Game();
    addNewGame(Utils.createGameMap(req,game))
    
    
}
export const pieceMove = (req) => {
    
    findBoardId(req.params.boardId).then((data) =>{
       var board = data.dataValues
       var game =  new chessEngine.Game(JSON.parse(board.config))
       console.log('turn => ' + JSON.parse(board.config).turn)
       console.log('player => ' + board.color)
       if(JSON.parse(board.config).turn == board.color)//game.move(req.body.from,req.body.to)
       {
        if(Utils.validMove(board.config,req.body)) game.move(req.body.from,req.body.to)
       }
       else game.aiMove()
    })

}




