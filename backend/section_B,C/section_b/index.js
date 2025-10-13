const { recc, remove_watched, weightedVectorSum } = require("../functions.js");
const express = require("express");
const router = express.Router();
const {getSentenceVector} = require("../vector.js");
const connectdb = require("../../mangodb.js");
const users = require("../../models/users.js"); 
const Asset = require("../../models/assets.js");
const {generateSignedUrl,generateSigned} = require("../s3.js");


connectdb();

router.get('/sectionbimages', async (req, res, next) => {
  console.log("sectionb started")
  try {
    const search = req.query.search || ""; 
    const userid = req.user.id;
    
    console.log("search param:", JSON.stringify(search));

    if (search) {
      const user = await users.findOne({ userid }).lean();
      const { preference: { language, scope }, vector } = user;

      const languageVector = await getSentenceVector(language);
      const scopeVector = await getSentenceVector(scope);
      const searchVector = await getSentenceVector(search);
      console.log("got all vectors")

      const result = weightedVectorSum(languageVector, scopeVector, vector, searchVector);
      console.log("got result")
      const images = await recc(result);

      const topImages = images.slice(0, 8);

      
      const assetsMeta = await Asset.find({ assetid: { $in: topImages } }).lean();

      
      const response = await Promise.all(
        assetsMeta.map(async asset => {
          const url = await generateSigned(asset.assetid, "image");
          return {
            assetid: asset.assetid,
            title: asset.title,
            creator: asset.creator,
            url
          };
        })
      );

      res.json({ success: true, assets: response });
    } else {
        
      const user = await users.findOne({ userid }).lean();
      const { preference: { language, scope }, vector } = user;

      const languageVector = await getSentenceVector(language);
      const scopeVector = await getSentenceVector(scope);
      console.log("else has been hit")
      const result = weightedVectorSum(languageVector, scopeVector, vector);
      console.log("else has been 2")
      const images = await recc(result);
      console.log(images)

      const newimages=await remove_watched(images,userid)
       console.log("else has been 3")

      const topImages = newimages.slice(0, 8);

      
      const assetsMeta = await Asset.find({ assetid: { $in: topImages } }).lean();

      // generate signed URLs
      const response = await Promise.all(
        assetsMeta.map(async asset => {
          const url = await generateSigned(asset.assetid, "image");
          return {
            assetid: asset.assetid,
            title: asset.title,
            creator: asset.creator,
            url
          };
        })
      );

      res.status(200).json({ success: true, assets: response });
    } 
      
    

  } catch (err) {
    next(err);  
  }
});

router.get('/tiktok/:assetid', async (req, res, next) => {
  try {
    const userid = req.user.id; 
    const assetid = req.params.assetid;  

    // fetch user
    const user = await users.findOne({ userid }).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const { preference: { language, scope }, vector, following } = user;

    // fetch asset vector
    const assetDoc = await Asset.findOne({ assetid }).lean();
    if (!assetDoc) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
    const assetVector = assetDoc.vector;

    // sentence vectors
    const languageVector = await getSentenceVector(language);
    const scopeVector = await getSentenceVector(scope);
    

    // combine
    const result = weightedVectorSum(languageVector, scopeVector, vector, assetVector);

    // 
    const images = await recc(result);
    const newimages=await remove_watched(images,userid)
    const topImages = newimages.slice(0, 8);

    // fetch metadata 
    const assetsMeta = await Asset.find({ assetid: { $in: topImages } }).lean();

    //  response
    const response = await Promise.all(
      assetsMeta.map(async asset => {
        const url = await generateSigned(asset.assetid, "video");

        return {
          assetid: asset.assetid,
          title: asset.title,
          creator: asset.creator,
          url,
          likes: asset.likes,
          dislikes: asset.dislikes,
          article: asset.article,
          isSubscribed: following.includes(asset.creator) 
        };
      })
    );

    res.json({ success: true, assets: response });
  } catch (err) {
    next(err);
  }
});

router.get('/tiktok', async (req, res, next) => {
  try {
    const userid = req.user.id; 
     

    // fetch user
    const user = await users.findOne({ userid }).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const { preference: { language, scope }, vector, following } = user;

    

    // sentence vectors
    const languageVector = await getSentenceVector(language);
    const scopeVector = await getSentenceVector(scope);
    

    // combine
    const result = weightedVectorSum(languageVector, scopeVector, vector);

    // 
    const images = await recc(result);
    const newimages=await remove_watched(images,userid)
    const topImages = newimages.slice(0, 8);

    // fetch metadata 
    const assetsMeta = await Asset.find({ assetid: { $in: topImages } }).lean();

    //  response
    const response = await Promise.all(
      assetsMeta.map(async asset => {
        const url = await generateSigned(asset.assetid, "video");

        return {
          assetid: asset.assetid,
          title: asset.title,
          creator: asset.creator,
          url,
          likes: asset.likes,
          dislikes: asset.dislikes,
          article: asset.article,
          isSubscribed: following.includes(asset.creator) 
        };
      })
    );

    res.json({ success: true, assets: response });
  } catch (err) {
    next(err);
  }
});



module.exports = router;
