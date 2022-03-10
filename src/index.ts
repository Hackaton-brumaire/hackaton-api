import {config} from "dotenv";
import bodyParser from "body-parser";
import express, {Express} from "express";
import {createConnection} from "typeorm";
import {logger} from "./config/logging.config";

config();
createConnection().then(() => {

}).catch((err) => logger.error(err));
