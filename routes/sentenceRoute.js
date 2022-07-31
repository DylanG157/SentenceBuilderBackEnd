import express from "express";
import { authenticateToken } from "../middleware/jwt-authenticate.js";
import { UsersSentence } from "../models/sentence-model";

const sentenceRoute = express.Router();
let dumpySentenceDataStorage = [];

async function saveUsersSentence(req, res, next) {
  const usersSentence = new UsersSentence(req.body);
  await usersSentence.save();
  dumpySentenceDataStorage.push(req.body.sentence);
  res.send({ message: "success" });
}

async function getListOfSentences(req, res, next) {
  let responseObj = [dumpySentenceDataStorage];
  res.send(responseObj);
}

sentenceRoute.post("/add", authenticateToken, saveUsersSentence);
sentenceRoute.get("/list", authenticateToken, getListOfSentences);

export default sentenceRoute;
