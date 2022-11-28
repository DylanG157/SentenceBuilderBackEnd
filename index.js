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
import authenticationRouter from "./routes/authentication";
import productListRouter from "./routes/productRoute";
import { connectToMongoDbServer } from "./utilities/mongoUtil";
import { getListOfAllProducts } from "./utilities/productRetrieval";

//Setup/initialize environment variables
dotenv.config();

//Setup mongoDb connection
connectToMongoDbServer().then((response) => {
  try {
    console.log("Getting list of products");
    //getListOfAllProducts();
  } catch (error) {
    console.log(`Something went wrong with the product retrieval ${error}`);
  }
});

//Used to get a list of all products, will run on a set timer and update the MongoDB with a list of all products
// setInterval(function () {
//   try {
//     console.log("Getting list of products");
//     getListOfAllProducts();
//   } catch (error) {
//     console.log(`Something went wrong with the product retrieval ${error}`);
//   }
// }, 30000);

const PORT = process.env.SERVER_PORT;
const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(httpLogger); //Http logging middleware

//Routes
app.use("/authentication/", authenticationRouter);
app.use("/products/", productListRouter);

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
