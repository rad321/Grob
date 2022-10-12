const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize('grobdb', 'alexdediu', 'progettopa', {
    host: 'localhost',
    dialect: 'postgres'
});

export class boards extends Model {}
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
        type: DataTypes.INTEGER,
    },
  
    history: {
        type: DataTypes.STRING,
    },
    startdate: {
        type: DataTypes.DATE,

    },

    config: {
        type: DataTypes.STRING,

    },
    level: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize,
    timestamps:false,
    createdAt: false,
    updatedAt: false,
    modelName: 'boards' 
  
})