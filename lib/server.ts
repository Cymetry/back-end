import {createServer} from "http";
import {app} from "./app";
import connect from "./db/mongoDb/connect";
import {sequelize} from "./db/postgresSQL/sequalize";
import "./env";


const port = process.env.PORT || 3000;

(async () => {

    await sequelize.sync({force: true});
    await connect({db: process.env.MONGO_URL});


    createServer(app)
        .listen(
            port,
            () => {
                console.info(`Server running on port ${port}`);
            },
        );
})();
