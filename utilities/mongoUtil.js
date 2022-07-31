import mongoose from "mongoose";

let db = "";
function connectToMongoDbServer() {
  //Setting connection to our mongoDB database
  const username = "sentenceBuilderAdmin";
  const password = "runningHill123";

  mongoose.connect(
    `mongodb+srv://${username}:${password}@cluster0.nl7w7.mongodb.net/sentenceApplicationDB`
  );

  db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
    console.log("Connected successfully");
  });
}

function getMongoDbConnection() {
  return db;
}

export { connectToMongoDbServer, getMongoDbConnection };
