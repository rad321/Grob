import { findUser } from "../database/queries"

var validator = require('email-validator')
export const validateEmail = function (email) : boolean{
     return validator.validate(email)


}
export const checkEmailFormat = function(req,res,next){

    if(validateEmail(req.body.email)){
        console.log("Email Valida!")
        next()
    
    }else{
        res.json("Email non valida")
        
    }


}
export const checkIfUserExist = function (req,res,next){

    findUser(req.body.email).then((user)=>{
        if(typeof user != 'undefined') res.json("L'email "+ req.body.email + " è già stata utilizzata per creare un account")
        else next()

    })
}
