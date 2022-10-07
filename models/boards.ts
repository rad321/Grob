const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize('grobdb', 'alexdediu', 'progettopa', {
    host: 'localhost',
    dialect: 'postgres'
});

export class boards extends Model {


}
export const board = boards.init({

    player1: {
        type: DataTypes.INTEGER,
    },
    color1: {
        type: DataTypes.INTEGER,
    },
    player2: {
        type: DataTypes.INTEGER,
    },
    color2: {
        type: DataTypes.INTEGER,
    },
    history: {
        type: DataTypes.INTEGER,
    },
    config: {
        type: DataTypes.STRING,

    }



}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'boards' // We need to choose the model name
})