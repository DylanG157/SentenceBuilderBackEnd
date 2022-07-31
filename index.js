import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import httpLogger from "./middleware/httpLogger.js";
import { haltOnTimedout, timeout120 } from "./middleware/timeout-handler.js";
import {
  errorLogger,
  errorResponder,
  failSafeHandler,
} from "./middleware/error-handler.js";
import logger from "./middleware/logger.js";
import bodyParser from "body-parser";
import wordsRoute from "./routes/wordsRoute";
import authenticationRouter from "./routes/authentication";
import sentence from "./routes/sentenceRoute";
import { connectToMongoDbServer } from "./utilities/mongoUtil";

//Setup/initialize environment variables
dotenv.config();

//Setup mongoDb connection
connectToMongoDbServer();

const PORT = process.env.SERVER_PORT;
const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(httpLogger); //Http logging middleware

//Routes
app.use("/authentication/", authenticationRouter);
app.use("/words/", wordsRoute);
app.use("/sentence/", sentence);

//Error logging middleware
app.use(errorLogger);
app.use(errorResponder);
app.use(failSafeHandler);
//Timeout Middleware
app.use(timeout120);
app.use(haltOnTimedout);

app.get("/", function (req, res) {
  console.log(req.body);
  res.send("Its working");
});

app.listen(PORT, () => {
  logger.info(`Server running on port: ${PORT}`);
});
