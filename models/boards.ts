import { databaseConstants } from "../constants/constants";
import { SequelizeSingleton } from "../database/sequelize-singleton";
const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize  = SequelizeSingleton.getConnection();

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