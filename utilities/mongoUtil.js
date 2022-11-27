import mongoose from "mongoose";

let db = "";
async function connectToMongoDbServer() {
  await mongoose
    .connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.nl7w7.mongodb.net/chefHelper`
    )
    .then((response) => {
      db = mongoose.connection;
      db.on("error", console.error.bind(console, "connection error: "));
      db.once("open", function () {
        console.log("Connected successfully to mongoDB");
      });
    });
}

function getMongoDbConnection() {
  return db;
}

export { connectToMongoDbServer, getMongoDbConnection };
