import {config} from "dotenv";
import bodyParser from "body-parser";
import express, {Express} from "express";
import {createConnection} from "typeorm";
import {logger} from "./config/logging.config";
import {buildRoutes} from "./routes/index.route";

config();
createConnection().then(() => {
    const app: Express = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(require('cookie-parser')());
    app.use("/api", buildRoutes());
    const port = process.env.PORT || 4500;
    app.listen(port, function () {
        logger.info(`Listening on port ${port}...`);
    });
}).catch((err) => logger.error(err));
