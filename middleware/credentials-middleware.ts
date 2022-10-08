import { findUser } from "../database/queries"
import { Utils } from "../utils/utils"
var validator = require('email-validator')
/**
 * Verifica il formato dell'email inserita dall'utente e riporta un valore booleano.
 * @param email 
 * @returns 
 */
export const validateEmail = function (email) : boolean{
     return validator.validate(email)


}
/**
 * Middleware che verifica la validità delle credenziali inserite dall'utente
 * @param req 
 * @param res 
 * @param next 
 */
export const checkEmailFormat = function(req,res,next){

    if(validateEmail(req.body.email)){
        console.log("Email Valida!")
        next()
    
    }else{
        res.json("Email non valida")
        
    }


}
/**
 * Middleware che verifica se le credenziali sono presenti nel database.
 * Utilizzato in fase di registrazione.
 * @param req
 * @param res 
 * @param next 
 */
export const checkIfUserExist = function (req,res,next){

    findUser(req.body.email).then((user)=>{
        if(typeof user != 'undefined') res.json("L'email " + req.body.email + " è già stata utilizzata per creare un account")
        else next()

    })
}

/**
 * Middleware che verifica se le credenziali sono presenti nel database.
 * Utilizzato durante il login.
 * @param req 
 * @param res 
 * @param next 
 */
export const checkUserEmail = function (req,res,next){

    findUser(req.body.email).then((user)=>{
        if(typeof user == 'undefined') res.json("Non esiste un account associato all'email " + req.body.email)
        else next()

    })
}
