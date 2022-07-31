import mongoose from "mongoose";

const SentenceSchema = new mongoose.Schema({
  sentence: {
    type: String,
    required: true,
  },
});

const UsersSentence = mongoose.model("UsersSentence", SentenceSchema);

export { UsersSentence };
