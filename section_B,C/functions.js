const mongoose = require("mongoose");
const Asset = require("../models/assets"); 
const connectdb = require("../mangodb");
const user = require("../models/users"); 
const w1=1
const w2=1
const w3=1
const w4=1

// Compute cosine similarity between two vectors
function cosineSimilarity(vec1, vec2) {
    if (vec1.length !== vec2.length) throw new Error("Vector lengths must match");
    console.log("a")
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vec1.length; i++) {
        dot += vec1[i] * vec2[i];
        normA += vec1[i] ** 2;
        normB += vec2[i] ** 2;
    }

    if (normA === 0 || normB === 0) return 0; 

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function recc( user_vector) { 
    if (!user_vector || user_vector.length === 0) {
        throw new Error("User vector is empty");
    }
    console.log("recc has been hit")
    try {
        await connectdb();

        
        const assets = await Asset.find({}, "assetid vector");
        console.log("1")

        // Filter out assets with empty vectors
        const filteredAssets = assets.filter(asset => asset.vector && asset.vector.length > 0);
        console.log("2")
        // Compute cosine similarity for each asset
        const similarities = filteredAssets.map(asset => ({
            assetid: asset.assetid,
            similarity: cosineSimilarity(user_vector, asset.vector)
        }));
        console.log("3")

        // Sort by similarity descending and return only asset IDs
        const rankedAssetIds = similarities
            .sort((a, b) => b.similarity - a.similarity)
            .map(item => item.assetid);
        console.log("4")
        return rankedAssetIds;

    } catch (err) {
        throw err;
    }
}



async function remove_watched(list, user_id) {
  try {
    await connectdb();

    

    // query by userid (not id)
    const userDoc = await user.findOne({ userid: user_id }, "watched_assets");
    if (!userDoc) throw new Error("User not found");

    const watchedSet = new Set(userDoc.watched_assets);
    console.log("remove_watched has been hit");

    // filter out watched asset IDs
    const filteredList = list.filter(assetId => !watchedSet.has(assetId));

    return filteredList;
  } catch (err) {
    throw err;
  }
}

function weightedVectorSum(v1, v2, v3, v4) {
  const len = v1.length;
  const result = new Array(len);
  console.log("jhvjhvjhvjf")

  // weighted sum
  for (let i = 0; i < len; i++) {
    let sum = w1 * v1[i] + w2 * v2[i] + w3 * v3[i];
    if (v4) sum += w4 * v4[i];
    result[i] = sum;
  }
  console.log("this has been done too")

  // normalize to unit length
  const magnitude = Math.sqrt(result.reduce((acc, val) => acc + val * val, 0));
  if (magnitude === 0) return result; 
  console.log("this too")
  return result.map(val => val / magnitude);
}



module.exports={recc,remove_watched,weightedVectorSum}

