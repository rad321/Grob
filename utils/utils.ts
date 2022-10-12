import { findUser } from "../database/queries";

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
         if ( user.length == 0) res.json("Utente inesistente, verifica le credenziali inserite")
         else{
         var token =  jwt.sign({ email: req.body.email, password: req.body.pwd, userid : user[0].dataValues.id}, process.env.SECRET_KEY)
         res.json(token)
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
    static createGameMap(req, game) {
        var map = new Map()
        const keys = ['player', 'color', 'history', 'config', 'level']
        keys.forEach(item => {
            if (item == 'history') {
                map.set(item, JSON.stringify(game.getHistory()))
            }
            else if (item == 'config') {
                map.set(item, JSON.stringify(game.exportJson()))
            } else if (item == 'level') {
                map.set(item, req.params.level)

            } else {
                map.set(item, req.body[item])
            }
        })
        console.log(map)
        return map
    }

 static createJsonGameInfo(board, user) {
    var games: Array<object> = new Array<object>
        var game = {
            boardId: board.id,
            player: board.player,
            nMoves: Object.keys(JSON.parse(board.history)).length
        }
        games.push(game)
    
    var info = {
        boards: games,
        wins: user.wins,
        defeats: user.losses,
        draw: user.draw
    }
    return info
}
static getUser(token){
    
    var jwtDecode = this.decodeJwt(token)
    console.log(jwtDecode)
    return jwtDecode
}
}
