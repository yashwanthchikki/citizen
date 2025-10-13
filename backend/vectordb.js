// vectorDB.js
const Asset = require("./models/assets");
const connectdb = require("./mangodb");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { FaissStore } = require("@langchain/community/vectorstores/faiss");

let vectorStore = null; 

async function initVectorDB(req, res, next) {
  try {
    await createVectorDB();
    console.log(" Vector DB ready");
    next(); 
  } catch (err) {
    next(err); 
  }
}

async function createVectorDB() {
  await connectdb(); 
  console.log("MongoDB connected for vector DB creation");

  const assets = await Asset.find({ article: { $ne: "" } });
  if (!assets.length) {
    console.log("No assets found with articles");
    return;
  }

  const texts = assets.map((a) => a.article);
  const metadata = assets.map((a) => ({
    assetid: a.assetid,
    title: a.title,
    creator: a.creator,
  }));

  console.log(` Creating embeddings for ${texts.length} assets...`);

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004", 
  });

  vectorStore = await FaissStore.fromTexts(texts, metadata, embeddings);

  console.log(" Vector DB built successfully");
  return vectorStore;
}

function getVectorDB() {
  if (!vectorStore) throw new Error("Vector DB not initialized yet!");
  return vectorStore;
}

module.exports = { createVectorDB, getVectorDB ,initVectorDB};

