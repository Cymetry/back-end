import * as bodyParser from "body-parser";
import * as express from "express";
import * as errorhandler from "strong-error-handler";
import {procedures} from "../routes/procedure";

export const app = express();

// middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// middleware for json body parsing
app.use(bodyParser.json({limit: "5mb"}));

// enable corse for all origins
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers", "x-total-count");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type,authorization");

    next();
});

app.use("/skillLearning", procedures);

app.use(errorhandler({
    debug: process.env.ENV !== "prod",
    log: true,
}));