const { Model,DataTypes,Sequelize} = require('sequelize');
const sequelize = new Sequelize('grobdb', 'alexdediu', 'progettopa', {
    host: 'localhost',
    dialect: 'postgres'
  });

class users extends Model{}

export const user = users.init({
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    pwd:{
        type: DataTypes.STRING,
        allowNull: false
    },
    credits:{
        type: DataTypes.INTEGER,
    },
    wins:{
        type: DataTypes.INTEGER,
    },
    losses:{
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
