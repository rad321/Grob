

var {user}= require('../models/users.ts');
var {board} = require('../models/boards.ts');
let today = new Date().toLocaleDateString()

export const addNewAccount = async (req) =>{
    console.log(req.body.credits)
     await  user.create({
        email : req.body.email,
        pwd : req.body.pwd,
        credits : req.body.credits,
        wins : 1,
        defeats : 1,
        draw : 1
     })

  }

export const findUser =  async (email)=>{
    return await user.findAll({
        where : {
            email : email
        }
    });
    
}
export const  findAllUsers = async () =>{
    return await user.findAll()
}

export const addNewGame = async (map) =>{
       await board.create({
        player : map.get('player'),
        color : map.get('color'),
        history : map.get('history'),
        config : map.get('config'),
        startDate : today,
        level : map.get('level')

    })
    
}
export const findBoardId = async (id) =>{
    console.log(id)
    const data = await board.findByPk(id)
    return data

}
export const updateBoard = async (config,history,id) => {
    await board.update({config:JSON.stringify(config),history:JSON.stringify(history)},{
        where : {
            id : id
        }
    })

}
export const findGamesByDate= async (req) =>{
    return await board.findAll({
        where :{
            startdate : req.body.startDate,
            
        }
    })
}
export const findGamesByUserId = async (id) => {
    return await board.findAll({ where : { player : id }})
}
