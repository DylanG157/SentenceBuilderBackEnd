import express from "express";
import { authenticateToken } from "../middleware/jwt-authenticate.js";
import { getMongoDbConnection } from "../utilities/mongoUtil";
import { errorResponse } from "../models/errorResponse-model";

const wordsRoute = express.Router();

async function getListOfWords(req, res, next) {
  try {
    //Get the list of word types from the mongodb server
    let db = getMongoDbConnection();
    await db
      .collection("listofwordtypes")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
      });
  } catch (error) {
    console.log(error);
    errorResponse.message = error;
    res.send(errorResponse);
  }
}

wordsRoute.get("/list", authenticateToken, getListOfWords);

export default wordsRoute;
