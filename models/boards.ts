import { databaseConstants } from "../constants/constants";
const { Model, DataTypes, Sequelize } = require('sequelize');
var path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME,process.env.DB_PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DB_DIALECT
});

export class boards extends Model {}
/**
 * Model della tabella boards
 */
export const board = boards.init({
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    player: {
        type: DataTypes.INTEGER,
    },
    color: {
        type: DataTypes.STRING,
    },
  
    history: {
        type: DataTypes.STRING,
    },
    startdate: {
        type: DataTypes.STRING,

    },

    config: {
        type: DataTypes.STRING,

    },
    level: {
        type: DataTypes.INTEGER,
    },
    state: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    timestamps:false,
    createdAt: false,
    updatedAt: false,
    modelName: databaseConstants.BOARDS_TABLE
  
})