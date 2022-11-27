import express from "express";
import { authenticateToken } from "../middleware/jwt-authenticate.js";
import { getMongoDbConnection } from "../utilities/mongoUtil";
import { errorResponse } from "../models/errorResponse-model";

const productListRouter = express.Router();

async function getListOfProducts(req, res, next) {
  try {
    //get the list of all the saved sentences from mongodb
    let db = getMongoDbConnection();
    await db
      .collection("productschemas")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.send([result]);
      });
  } catch (error) {
    console.log(error);
    errorResponse.message = error;
    res.send(errorResponse);
  }
}
productListRouter.get("/list", authenticateToken, getListOfProducts);

export default productListRouter;
