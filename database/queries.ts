

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
    return board.create({
        player1 : map.get('player1'),
        color1 : map.get('color1'),
        player2 : map.get('plater2'),
        color2 : map.get('color2'),
        history : map.get('history'),
        config : map.get('config')






    })
}
