import {createServer} from 'http';
import {app} from './app';
import {sequelize} from './db/postgresSQL/sequalize';
import connect from "./db/mongoDb/connect";

const port = process.env.PORT || 3000;

(async () => {
    await sequelize.sync({force: true});
    await connect({db: 'mongodb://localhost:27017/cymetry'});


    createServer(app)
        .listen(
            port,
            () => console.info(`Server running on port ${port}`)
        );
})();