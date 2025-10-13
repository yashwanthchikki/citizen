const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userid: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },

  preference: {
    language: { type: String, default: "en" },
    scope: { type: String, default: "global" }
  },

  following: { type: [String], default: [] },
  followingCount: { type: Number, default: 0 },

  followers: { type: [String], default: [] },
  followersCount: { type: Number, default: 0 },

  uploads: { type: [String], default: [] },

  
  vector: { type: [Number], default: Array(384).fill(0) },  
  n_value: { type: Number, default: 0 },

  watched_assets: { type: [String], default: [] }
});

module.exports = mongoose.model("User", UserSchema);
