import { boardConstants } from "../constants/constants";

const { Op } = require("sequelize");

var { user } = require('../models/users.ts');
var { board } = require('../models/boards.ts');
let today = new Date().toLocaleDateString()

/**
 * Crea una nuova utenza.
 * @param req 
 */
export const addNewAccount = async (req) => {
    await user.create({
        email: req.body.email,
        pwd: req.body.pwd,
        credits: 1,
        wins: 0,
        defeats: 0
    })
}

/**
 * Restituisce un utente in base alla e-mail.
 * @param email 
 * @returns 
 */
export const findUser = async (email) => {
    return await user.findAll({
        where: {
            email: email
        }
    });
}
/**
 * Restituisce tutti gli utenti presenti nel database
 * @returns 
 */
export const findAllUsers = async () => {
    return await user.findAll()
}
/**
 * Aggiungi una nuovo partita nel database.
 * @param map 
 * @returns 
 */
export const addNewGame = async (map) => {
    return await board.create({
        player: map.get(boardConstants.PLAYER),
        color: map.get(boardConstants.COLOR),
        history: map.get(boardConstants.BOARD_HISTORY),
        config: map.get(boardConstants.BOARD_CONFIGURATION),
        startdate: today,
        level: map.get(boardConstants.GAME_LEVEL),
        state : map.get(boardConstants.GAME_STATE)
    })
}
/**
 * Aggiorna configuraizone e storico di una partita.
 * @param config 
 * @param history 
 * @param id 
 */
export const updateBoard = async (config, history, id) => {
     return await board.update({ config: JSON.stringify(config), history: JSON.stringify(history) }, {
        where: {
            id: id
        }
    })

}
/**
 * Aggiorna il numero di vittorie di un utente
 * @param id 
 */
export const updateUserWin = async (id) =>{
    var data = await findUserById(id)
    var val = data[0].dataValues.wins
    await user.update({ wins : Number(val) + 1 },{
        where : {
            id : id
        }
    })
}
/**
 * Aggiorna il numero di sconfitte di un utente
 * @param id 
 */
export const updateUserDef = async (id) => {
    var data = await findUserById(id)
    var val = data[0].dataValues.defeats
    await user.update({ wins : Number(val) + 1 },{
        where : {
            id : id
        }
    })
}
/**
 * Funzione che restituisce un utente in base al suo Id.
 * @param id 
 * @returns 
 */
export const findUserById = async (id) =>{
    return await user.findAll({
        where: {
            id: id
        }
    });
}
/**
 * Aggiorna i crediti di un utente.
 * @param credits 
 * @param id 
 * @returns 
 */
export const updateUserCredits = async (credits,id) =>{
    return await user.update({credits : credits },{
        where : {
            id : id 
        }
    }) 
}
/**
 * Aggiorna lo stato di una partita.
 * @param state 
 * @param id 
 */
export const updateBoardState = async (state,id) =>{
    return await board.update({state : state },{ where : { id : id} })
}
/**
 * Restituisce le partitai in base alla data di inizio.
 * @param req 
 * @returns 
 */
export const findGamesByDate = async (req) => {
    return await board.findAll({
        where: { startdate: req.body.date }
    })
}
/**
 * Restituisce le partite in base all' ID della partita
 * @param boardId 
 * @param userId 
 * @returns 
 */
export const findGameByBoardId = async (boardId, userId) => {
    return await board.findAll({
        where: {
            id: boardId,
            player: userId,
        }
    })
}
/**
 * Restituisce le partite in base all' ID del utente.
 * @param userId 
 * @returns 
 */
export const findGamesByUserId = async (userId) => {
    return await board.findAll({
        where: {
            player: userId,
        }
    })
}
/**
 * Funzione utilizzata per abbandonare una partita.
 * Effettua il set dello stato nel database
 * @param boardid 
 * @param userid 
 * @returns 
 */
export const abandonedGame = async (boardid,userid) =>{
    var games = await findGameByBoardId(boardid,userid)
   var config = JSON.parse(games[0].dataValues.config)
   config.isFinished=true
    return await board.update({ state : boardConstants.STATE_ABANDONED,config : JSON.stringify(config)},{ where : { id : boardid}})
}
/**
 * Funzione che restituisce le partite attive di un giocatore
 * @param player 
 * @returns 
 */
export const findActiveGames = async (player)=>{
    return await board.findAll({
        where : {
            player : player,
            state : boardConstants.STATE_IN_PROGRESS
        }
    })
}
