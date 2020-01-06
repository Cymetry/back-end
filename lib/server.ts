import {createServer} from "http";
import * as WebSocket from "ws";
import {WsHandler} from "../ws/WsHandler";
import {app} from "./app";
import connect from "./db/mongoDb/connect";
import {sequelize} from "./db/postgresSQL/sequalize";


import {WsMessage} from "../ws/types/WsMessage";
import {WsTestMessage} from "../ws/types/WsTestMessage";
import "./env";


const port = process.env.PORT || 3000;

(async () => {

    await sequelize.sync({force: false});
    await connect({db: process.env.MONGO_URL || "mongodb://localhost:27017/cymetry"});


    const server = createServer(app);

    const wss = new WebSocket.Server({server});

    wss.on("connection", async (ws: WebSocket) => {
        const wsHandler = new WsHandler(ws);
        ws.on("message", async (message: any) => {
            const parsed = JSON.parse(message);
            if (parsed.type === "testing") {
                const wsMessage = new WsTestMessage(parsed.userId, parsed.topicId, parsed.content);
                const response = await wsHandler.insertOrUpdateTestSubmission(wsMessage);
                ws.send(response.toString());
            } else {
                const wsMessage = new WsMessage(parsed.userId, parsed.skillId, parsed.content);
                const response = await wsHandler.insertOrUpdate(wsMessage);
                ws.send(response.toString());
            }
        });
    });

    await server.listen(
        port,
        () => {
            console.info(`Server running on port ${port}`);
        },
    );


})();
