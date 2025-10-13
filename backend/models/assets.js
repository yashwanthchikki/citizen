const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  assetid: { type: String, required: true, unique: true },
  creator: { type: String, required: true },
  title: { type: String, required: true },
  vector: { type: [Number], default: [] }, 
  likes: { type: Number, default: 0 }, 
  dislikes: { type: Number, default: 0 },
  upload_date: { type: Date, default: Date.now },
  article: { type: String, default: "" } 
});

module.exports = mongoose.model("Asset", assetSchema);
