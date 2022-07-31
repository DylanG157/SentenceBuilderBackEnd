import mongoose from "mongoose";

const WordListSchema = new mongoose.Schema({
  wordType: {
    type: String,
    required: true,
  },
  FullWordList: [String],
});

const WordList = mongoose.model("WordList", WordListSchema);

export { WordList };
