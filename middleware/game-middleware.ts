import { addNewAccount, findBoardId } from "../database/queries"

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
