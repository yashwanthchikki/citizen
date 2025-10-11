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

    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vec1.length; i++) {
        dot += vec1[i] * vec2[i];
        normA += vec1[i] ** 2;
        normB += vec2[i] ** 2;
    }

    if (normA === 0 || normB === 0) return 0; // avoid division by zero

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function recc( user_vector) { 
    if (!user_vector || user_vector.length === 0) {
        throw new Error("User vector is empty");
    }

    try {
        await connectdb();

        // Fetch all assets with assetid and vector
        const assets = await Asset.find({}, "assetid vector");

        // Filter out assets with empty vectors
        const filteredAssets = assets.filter(asset => asset.vector && asset.vector.length > 0);

        // Compute cosine similarity for each asset
        const similarities = filteredAssets.map(asset => ({
            assetid: asset.assetid,
            similarity: cosineSimilarity(user_vector, asset.vector)
        }));

        // Sort by similarity descending and return only asset IDs
        const rankedAssetIds = similarities
            .sort((a, b) => b.similarity - a.similarity)
            .map(item => item.assetid);

        return rankedAssetIds;

    } catch (err) {
        throw err;
    }
}



async function remove_watched(list, user_id) {
    try {
        await connectdb();

        // Fetch the user's watched_assets array
        const user = await User.findOne({ userid: user_id }, "watched_assets");
        if (!user) throw new Error("User not found");

        const watchedSet = new Set(user.watched_assets); // use a Set for faster lookups

        // Filter the list to remove watched asset IDs
        const filteredList = list.filter(assetId => !watchedSet.has(assetId));

        return filteredList;

    } catch (err) {
        throw err;
    }
}
function weightedVectorSum(v1, v2, v3, v4) {
  const len = v1.length;
  const result = new Array(len);

  // weighted sum
  for (let i = 0; i < len; i++) {
    let sum = w1 * v1[i] + w2 * v2[i] + w3 * v3[i];
    if (v4) sum += w4 * v4[i];
    result[i] = sum;
  }

  // normalize to unit length
  const magnitude = Math.sqrt(result.reduce((acc, val) => acc + val * val, 0));
  if (magnitude === 0) return result; // avoid division by zero
  return result.map(val => val / magnitude);
}



module.exports={recc,remove_watched,weightedVectorSum}

