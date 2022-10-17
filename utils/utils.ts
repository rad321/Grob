import { StatusCodes } from "http-status-codes";
import moment from "moment";
import { boardConstants, dateConstants, exceptionMsg } from "../constants/constants";
import { findUser, findUserById } from "../database/queries";
var jwt = require('jsonwebtoken');
var path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });

export class Utils {
    /**
     * Creazione della stringa JWT
     * @param email 
     * @param pwd 
     * @returns 
     */
    static async createJwt(req, res) {
         var user = await findUser(req.body.email)
         if ( user.length == 0) res.status(StatusCodes.UNAUTHORIZED).json(Utils.getReasonPhrase(StatusCodes.UNAUTHORIZED,exceptionMsg.UTENTE_INESISTENTE))
         else{
         var token =  jwt.sign({ email: req.body.email, password: req.body.pwd, userid : user[0].dataValues.id}, process.env.SECRET_KEY)
         res.json({ jwt :token })
         }
    }
    /**
     * Decodifica del json  web token per ottenere e verificare le credenziali dell'utente
     * @param token 
     * @returns 
     */
    static decodeJwt(auth) {
        const token = auth.split(" ")[1]
        return jwt.verify(token, process.env.SECRET_KEY);
    }
    /**
     * Funzione che crea una mappa con i dati della partita.
     * I dati saranno utilizzati per creare e memorizzare una nuova partita.
     * @param req 
     * @param game 
     * @returns 
     */
    static createGameMap(req, game) {
        var map = new Map()
        const keys = [boardConstants.PLAYER, boardConstants.COLOR, boardConstants.BOARD_HISTORY, boardConstants.BOARD_CONFIGURATION, boardConstants.GAME_LEVEL,boardConstants.GAME_STATE]
        keys.forEach(item => {
            if (item == boardConstants.BOARD_HISTORY) map.set(item, JSON.stringify(game.getHistory()))
            else if (item == boardConstants.BOARD_CONFIGURATION) map.set(item, JSON.stringify(game.exportJson()))
            else if (item == boardConstants.GAME_LEVEL) map.set(item, req.params.level)
            else if (item == boardConstants.PLAYER) map.set(item, this.decodeJwt(req.headers.authorization).userid)
            else if( item == boardConstants.GAME_STATE) map.set(item,boardConstants.STATE_IN_PROGRESS)
            else map.set(item, req.body[item])
        })
        return map
    }
/**
 * Funzione che genera un oggetto  con le caratteristiche delle partite di un determinato utente.
 * @param board 
 * @returns 
 */
 static createJsonGameInfo(board) {
    var games: Array<object> = new Array<object>
        var game = {
            boardId: board.id,
            player: board.player,
            nMoves: Object.keys(JSON.parse(board.history)).length,
            state : board.state,
            startDate : board.startdate
        }
        games.push(game)
    return games
}
/**
 * Funzione per la validazione di una data.
 * La validazione avviene con una verifica del formato ed una verifica del range di date ammissibile 
 * @param date 
 * @returns 
 */
static dateValidator(date : string ) : boolean{
   const regex = new RegExp('^(3[01]|[12][0-9]|0[1-9])/(1[0-2]|0[1-9])/[0-9]{4}$')
   if(regex.test(date)){
    var compareDate = moment(date, dateConstants.DATE_FORMAT);
    var startDate = moment(dateConstants.START_DATE, dateConstants.DATE_FORMAT);
    var endDate = moment(dateConstants.END_DATE, dateConstants.DATE_FORMAT);
    if(compareDate.isBetween(startDate, endDate)) return true
    else return false
   } else return false
}
/**
 * Funzione che genera un oggetto che contiene i dati dei giocatori.
 * @param ranking 
 * @param type 
 * @returns 
 */
static createRanking(ranking,type) {
    var list = new Array()
    Object.keys(ranking).forEach(key =>{
        var info = {
            position : Number(key)+1,
            player : ranking[key]
        }
        list.push(info)
    })
    return list
}
/**
 * Funzione che crea un json.
 * Questa funzione è stata utilizzata per generare i messaggi di errore/successo.
 * @param statusCode 
 * @param phrase 
 * @returns 
 */
static getReasonPhrase(statusCode, phrase){
    return { msg : statusCode+", "+ phrase}
}
/**
 * Funzione che ritorna il credito residuo di un utente
 * @param id 
 * @returns 
 */
static async getCredits(id){
    let user = await findUserById(id)
     return user[0].dataValues.credits
}
/**
 * Funzione che verifica se un numero e maggiore o uguale di un altro
 * @param a 
 * @param b 
 * @returns 
 */
static greaterOrEqual(a,b){
    if ( a >= b ) return true
    else return false
}
static userPoints(a,b){
    return (new Array).push(a.wins-a.defeats)


}
}


