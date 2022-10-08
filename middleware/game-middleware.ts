
const checkGameLevel = (req,res,next) =>{
    if(req.params.level >= 0 && req.param.level < 5) next()
    else req.json("Il livello inserito è insistente, inserire un livello compreso tra 0 e 4")
}