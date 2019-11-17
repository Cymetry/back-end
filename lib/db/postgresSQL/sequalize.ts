import {Sequelize} from "sequelize-typescript";

export const sequelize = new Sequelize({
    database: "cymetry",
    dialect: "postgres",
    models: [__dirname + "/models"],
    storage: ":memory:",
});
