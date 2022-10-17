import { DataTypes, Model } from "sequelize";
import { databaseConstants } from "../constants/constants";
import { SequelizeSingleton } from "../database/sequelize-singleton";

const sequelize = SequelizeSingleton.getConnection();
class users extends Model { }
/**
 * Model della tabella users
 */
export const user = users.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pwd: {
        type: DataTypes.STRING,
        allowNull: false
    },
    credits: {
        type: DataTypes.FLOAT,
    },
    wins: {
        type: DataTypes.INTEGER,
    },
    defeats: {
        type: DataTypes.INTEGER,
    },
    admin: {
        type: DataTypes.BOOLEAN,
    }
}, {
    sequelize,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    modelName: databaseConstants.USERS_TABLE
}

)
