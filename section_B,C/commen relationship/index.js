const connectdb = require("../../mangodb");
const user=require("../../models/users")
const asset=require("../../models/assets")
const express=require("express")
const router=express.Router()


router.get("/like", async (req, res) => {
    try {
        const userId = req.user.userid;
        const assetId = req.query.assetid; // assuming assetid is sent as query param

        if (!assetId) return res.status(400).json({ message: "Asset ID required" });

        // Fetch user and asset
        const userDoc = await user.findOne({ userid: userId });
        const assetDoc = await asset.findOne({ assetid: assetId });

        if (!userDoc || !assetDoc) {
            return res.status(404).json({ message: "User or Asset not found" });
        }

        // Update user's vector
        const oldVector = userDoc.vector;
        const n = userDoc.n_value;

        if (oldVector.length === 0) {
            // If user vector is empty, just copy asset vector
            userDoc.vector = assetDoc.vector;
        } else {
            // Compute new vector
            const newVector = oldVector.map((val, idx) => {
                return ((val * n) + (assetDoc.vector[idx] || 0)) / (n + 1);
            });
            userDoc.vector = newVector;
        }

        // Increment n_value
        userDoc.n_value = n + 1;

        // Save updated user
        await userDoc.save();

        // Optionally, increment asset likes
        assetDoc.likes += 1;
        await assetDoc.save();

        res.status(200).json({ message: "Liked successfully", userVector: userDoc.vector });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/dislike", async (req, res) => {
    try {
        const userId = req.user.userid;
        const assetId = req.query.assetid; // assuming assetid is sent as query param

        if (!assetId) return res.status(400).json({ message: "Asset ID required" });

        // Fetch user and asset
        const userDoc = await user.findOne({ userid: userId });
        const assetDoc = await asset.findOne({ assetid: assetId });

        if (!userDoc || !assetDoc) {
            return res.status(404).json({ message: "User or Asset not found" });
        }

        // Update user's vector
        const oldVector = userDoc.vector;
        const n = userDoc.n_value;

        if (oldVector.length === 0) {
            // If user vector is empty, initialize as negative asset vector
            userDoc.vector = assetDoc.vector.map(v => -v);
        } else {
            // Compute new vector using subtraction
            const newVector = oldVector.map((val, idx) => {
                return ((val * n) - (assetDoc.vector[idx] || 0)) / (n + 1);
            });
            userDoc.vector = newVector;
        }

        // Increment n_value
        userDoc.n_value = n + 1;

        // Save updated user
        await userDoc.save();

        // Optionally, increment asset dislikes
        assetDoc.dislikes += 1;
        await assetDoc.save();

        res.status(200).json({ message: "Disliked successfully", userVector: userDoc.vector });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/subscribe", async (req, res) => {
    try {
        const userId = req.user.userid;
        const assetId = req.query.assetid; // asset id sent as query param

        if (!assetId) return res.status(400).json({ message: "Asset ID required" });

        // Fetch user and asset
        const userDoc = await user.findOne({ userid: userId });
        const assetDoc = await asset.findOne({ assetid: assetId });

        if (!userDoc || !assetDoc) return res.status(404).json({ message: "User or Asset not found" });

        // Prevent duplicate subscription
        if (userDoc.following.includes(assetId)) {
            return res.status(400).json({ message: "Already subscribed to this asset" });
        }

        // Add asset ID to user's following array
        userDoc.following.push(assetId);
        userDoc.followingCount = userDoc.following.length;
        await userDoc.save();

        // Add subscriber to the creator's followers array
        const creatorDoc = await user.findOne({ userid: assetDoc.creator });
        if (creatorDoc && !creatorDoc.followers.includes(userId)) {
            creatorDoc.followers.push(userId);
            creatorDoc.followersCount = creatorDoc.followers.length;
            await creatorDoc.save();
        }

        res.status(200).json({ message: "Subscribed successfully", following: userDoc.following });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/unsubscribe", async (req, res) => {
    try {
        const userId = req.user.userid;
        const assetId = req.query.assetid; // asset id sent as query param

        if (!assetId) return res.status(400).json({ message: "Asset ID required" });

        // Fetch user and asset
        const userDoc = await user.findOne({ userid: userId });
        const assetDoc = await asset.findOne({ assetid: assetId });

        if (!userDoc || !assetDoc) return res.status(404).json({ message: "User or Asset not found" });

        // Check if user is actually following the asset
        if (!userDoc.following.includes(assetId)) {
            return res.status(400).json({ message: "You are not subscribed to this asset" });
        }

        // Remove asset ID from user's following array
        userDoc.following = userDoc.following.filter(id => id !== assetId);
        userDoc.followingCount = userDoc.following.length;
        await userDoc.save();

        // Remove user from creator's followers array
        const creatorDoc = await user.findOne({ userid: assetDoc.creator });
        if (creatorDoc && creatorDoc.followers.includes(userId)) {
            creatorDoc.followers = creatorDoc.followers.filter(id => id !== userId);
            creatorDoc.followersCount = creatorDoc.followers.length;
            await creatorDoc.save();
        }

        res.status(200).json({ message: "Unsubscribed successfully", following: userDoc.following });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
