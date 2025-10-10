const express = require("express");
const router = express.Router();
const connectdb = require("../mangodb");
const users = require("../models/users");
const assets = require("../models/assets");
const { getVectorDB } = require("../vectordb");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

router.post("/newspaper", async (req, res, next) => {
  try {
    await connectdb(); 

    const userId = req.user?.userid;
    const { question } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!question) return res.status(400).json({ message: "Missing question" });

    
    const user = await users.findOne({ userid: userId }).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const { preference } = user;

    
    const vectorStore = getVectorDB();
    const results = await vectorStore.similaritySearch(question, 4);
    const context = results.map((r) => r.pageContent).join("\n\n");

    const genAI = new GoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a helpful news summarizer.  
User preferences: ${JSON.stringify(preference)}  
Question: ${question}  

Relevant articles:
${context}

Now provide a clear, factual, and concise summary or answer based on the above content.
    `;

    const response = await model.generateContent(prompt);
    const answer = response.response.text();

    res.status(200).json({
      success: true,
      answer,
      retrievedDocs: results.map((r) => r.metadata),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
