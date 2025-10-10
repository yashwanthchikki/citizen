const mongoose = require("mongoose");
require("dotenv").config();

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
     
    });
    
  } catch (err) {
    
    throw err; 
  }
};

module.exports = connectdb;
