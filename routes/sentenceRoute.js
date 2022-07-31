import express from "express";
import { authenticateToken } from "../middleware/jwt-authenticate.js";
import { UsersSentence } from "../models/sentence-model";
import { getMongoDbConnection } from "../utilities/mongoUtil";
import { errorResponse } from "../models/errorResponse-model";

const sentenceRoute = express.Router();
let dumpySentenceDataStorage = [];

async function saveUsersSentence(req, res, next) {
  try {
    //save the sentence to mongodb
    const usersSentence = new UsersSentence(req.body);
    await usersSentence.save();
    dumpySentenceDataStorage.push(req.body.sentence);
    res.send({ message: "success" });
  } catch (error) {
    console.log(error);
    errorResponse.message = error;
    res.send(errorResponse);
  }
}

async function getListOfSentences(req, res, next) {
  try {
    //get the list of all the saved sentences from mongodb
    let db = getMongoDbConnection();
    await db
      .collection("userssentences")
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

sentenceRoute.post("/add", authenticateToken, saveUsersSentence);
sentenceRoute.get("/list", authenticateToken, getListOfSentences);

export default sentenceRoute;
