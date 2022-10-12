const { Model,DataTypes,Sequelize} = require('sequelize');
const sequelize = new Sequelize('grobdb', 'alexdediu', 'progettopa', {
    host: 'localhost',
    dialect: 'postgres'
  });

class users extends Model{}

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
    modelName: 'users' 
  }
   
  )
