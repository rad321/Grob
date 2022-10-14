import { databaseConstants } from "../constants/constants";

const { Model,DataTypes,Sequelize} = require('sequelize');
var path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME,process.env.DB_PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DB_DIALECT
});

class users extends Model{}
/**
 * Model della tabella users
 */
export const user = users.init({
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    pwd:{
        type: DataTypes.STRING,
        allowNull: false
    },
    credits:{
        type: DataTypes.NUMERIC,
    },
    wins:{
        type: DataTypes.INTEGER,
    },
    defeats:{
        type: DataTypes.INTEGER,
    },
    draw:{
        type: DataTypes.INTEGER,

    }
},{
    
    sequelize,
    timestamps:false,
    createdAt: false,
    updatedAt: false,
    modelName: databaseConstants.USERS_TABLE 
  }
   
  )
