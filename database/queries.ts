

var {user}= require('../models/users.ts');
var {board} = require('../models/boards.ts');

export const addNewAccount = async (email,pwd) =>{

     await  user.create({
        email : email,
        pwd : pwd,
        credits : 10,
        wins : 1,
        losses: 1,
        draw : 1
     })

  }

export const findUser =  async (email)=>{
    const account =  await user.findAll({
        where : {
            email : email
        }
    });
    console.log(account.length)
    return    !account.length ? undefined : account
}

export const addNewGame = async (map) =>{
       await board.create({
        player : map.get('player'),
        color : map.get('color'),
        history : map.get('history'),
        config : map.get('config'),
        level : map.get('level')

    })
    
}
export const findBoardId = async (id) =>{
    console.log(id)
    const data = await board.findByPk(id)
    return data

}
