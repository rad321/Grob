import { pieceMove } from "../controllers/controller"
import { addNewAccount, findBoardId, updateBoard } from "../database/queries"
var chessEngine = require('js-chess-engine');
export const checkGameLevel = (req,res,next) =>{
    console.log(req.params.level)
    if(req.params.level >= 0 && req.params.level < 5) next()
    else res.json("Il livello inserito è insistente, inserire un livello compreso tra 0 e 4")
}
export const checkBoardId = (req,res,next) => {
     findBoardId(req.params.boardId).then((data)=>{
        if (data == null) res.json("Partita inesistente")
        else next()
     })
}
export const checkPieceMove = async (req,res,next)=>{
    findBoardId(req.params.boardId).then((data) =>{
        var board = data.dataValues
        var game =  new chessEngine.Game(JSON.parse(board.config))
        var moves = JSON.parse(board.config).moves
        console.log("movimento : " + req.body.from in moves)
         if(req.body.from in moves && moves[req.body.from].includes(req.body.to)) next()
         else  res.json("mossa non valida, modificare lo spostamento")     
   
})
}

