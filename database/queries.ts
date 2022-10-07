

var {user}= require('../models/users.ts');
var boards = require('../models/boards.ts');

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
