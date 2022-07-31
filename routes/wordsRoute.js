import express from "express";
import { authenticateToken } from "../middleware/jwt-authenticate.js";
import { getMongoDbConnection } from "../utilities/mongoUtil";

const wordsRoute = express.Router();

async function getListOfWords(req, res, next) {
  let db = getMongoDbConnection();
  await db
    .collection("listofwordtypes")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.send(result);
    });

  //let listOfWords = [listOfNouns, listOfVerbs, listOfAdjectives, listOfAdverbs];
}

wordsRoute.get("/list", authenticateToken, getListOfWords);

export default wordsRoute;
