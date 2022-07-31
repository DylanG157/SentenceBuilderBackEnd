import mongoose from "mongoose";

let db = "";
function connectToMongoDbServer() {
  mongoose.connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.nl7w7.mongodb.net/sentenceApplicationDB`
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
