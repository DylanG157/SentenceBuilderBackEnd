import express from "express";
import {
  listOfNouns,
  listOfVerbs,
  listOfAdjectives,
  listOfAdverbs,
} from "../models/wordList";
import { authenticateToken } from "../middleware/jwt-authenticate.js";

const wordsRoute = express.Router();

async function getListOfWords(req, res, next) {
  let listOfWords = [listOfNouns, listOfVerbs, listOfAdjectives, listOfAdverbs];
  res.send(listOfWords);
}

wordsRoute.get("/list", authenticateToken, getListOfWords);

export default wordsRoute;
