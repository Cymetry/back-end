import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import * as errorhandler from "strong-error-handler";
import {accountRouter} from "../routes/account";
import {authRouter} from "../routes/auth";
import {flowRouter} from "../routes/flow";
import {skillLearning} from "../routes/skillLearning";
import {testingRouter} from "../routes/testing";
import {userRouter} from "../routes/user";
import {videoRouter} from "../routes/video";

export const app = express();

// middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// middleware for json body parsing
app.use(bodyParser.json({limit: "5mb"}));

app.use(cors());
app.use(helmet());

// enable corse for all origins
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers", "x-total-count");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type,authorization");

    next();
});

app.use("/skillLearning", skillLearning);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/", flowRouter);
app.use("/", videoRouter);
app.use("/account", accountRouter);
app.use("/testing", testingRouter);

app.use(
    errorhandler(
        {
            debug: process.env.ENV !== "prod",
            log: true,
        },
    ),
);
