const users = require("../models/users");
const { getVectorDB } = require("../vectordb");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function generateNewsSummary(userId, question) {
  if (!userId) throw { status: 401, message: "Unauthorized" };
  if (!question) throw { status: 400, message: "Missing question" };

  // Fetch user
  const user = await users.findOne({ userid: userId }).lean();
  if (!user) throw { status: 404, message: "User not found" };

  const { preference } = user;

  // Get vector search results
  const vectorStore = getVectorDB();
  const results = await vectorStore.similaritySearch(question, 4);
  const context = results.map((r) => r.pageContent).join("\n\n");

  // Generate response using Google Gemini AI
  const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
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

  return {
    answer,
    retrievedDocs: results.map((r) => r.metadata),
  };
}

async function generateNewsSummaryMock(userId, question) {
  if (!userId) throw { status: 401, message: "Unauthorized" };
  if (!question) throw { status: 400, message: "Missing question" };

 
  const preference = { language: "en", scope: "global" };

  
  const sampleAnswers = [
    "The news today covers important global events.",
    "Here's a summary of the latest developments.",
    "This is a mock answer generated for testing purposes.",
    "Today's headlines include economic and political updates.",
    "A concise news summary for your question."
  ];
  
  
  const randomAnswer = sampleAnswers[Math.floor(Math.random() * sampleAnswers.length)];

  
  const retrievedDocs = [
    { title: "Doc1", url: "http://example.com/1" },
    { title: "Doc2", url: "http://example.com/2" },
    { title: "Doc3", url: "http://example.com/3" },
  ];

  return {
    answer: randomAnswer,
    retrievedDocs,
    preference
  };
}
module.exports = { generateNewsSummary ,generateNewsSummaryMock};
