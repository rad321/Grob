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
         if ( user.length == 0) res.json(exceptionMsg.UTENTE_INESISTENTE).status(404)
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
     * 
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
            else if( item == boardConstants.GAME_STATE) map.set(item,boardConstants.STATE_STOPPED)
            else map.set(item, req.body[item])
        })
        return map
    }
/**
 * 
 * @param board 
 * @returns 
 */
 static createJsonGameInfo(board) {
    var games: Array<object> = new Array<object>
        var game = {
            boardId: board.id,
            player: board.player,
            nMoves: Object.keys(JSON.parse(board.history)).length,
            state : board.state
        }
        games.push(game)
    return games
}
/**
 * 
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
 * 
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
static getReasonPhrase(statusCode, phrase){
    return { msg : statusCode+", "+ phrase}
}
static async getCredits(id){
    let user = await findUserById(id)
     return user[0].dataValues.credits
}
static greaterOrEqual(a,b){
    if ( a >= b ) return true
    else return false
}

}
