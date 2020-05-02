import {Sequelize} from "sequelize-typescript";

export const sequelize = (): Sequelize => {
    if (process.env.NODE_ENV === "production") {
        // @ts-ignore
        return new Sequelize({
            database: process.env.DATABASE,
            dialect: process.env.DIALECT,
            host: process.env.HOST,
            models: [__dirname + "/models"],
            password: process.env.PASSWORD,
            port: process.env.PSQLPORT,
            storage: process.env.STORAGE,
            username: process.env.USERNAME,
        });
    } else {
        // @ts-ignore
        return new Sequelize({
            database: process.env.DATABASE,
            dialect: process.env.DIALECT,
            models: [__dirname + "/models"],
            password: process.env.PASSWORD,
            storage: process.env.STORAGE,
            username: process.env.USERNAME,
        });
    }
};

