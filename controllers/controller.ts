var path = require("path")
var {addNewAccount} = require("../database/queries.ts");
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });

export function signUp (email,pwd){

    addNewAccount(email,pwd);
}





