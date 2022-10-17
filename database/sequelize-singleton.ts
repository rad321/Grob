import { Sequelize } from "sequelize";
var path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });

export class SequelizeSingleton {
    private static instance: SequelizeSingleton;
    private sequelize: Sequelize;
    private constructor() {
        this.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: 'postgres'
        });
    }
    public static getConnection(): Sequelize {
        if (!SequelizeSingleton.instance) {
            this.instance = new SequelizeSingleton();
        }
        return SequelizeSingleton.instance.sequelize;
    }
}
