const connectdb = require("../../mangodb");
const users=require("../../models/users")
const Asset=require("../../models/assets")
const express=require("express")
const router=express.Router()


router.get("/like", async (req, res) => {
    try {
        const userId = req.user.id;
        const assetId = req.query.assetid; 
        if (!assetId) return res.status(400).json({ message: "Asset ID required" });

        console.log("User ID:", userId);
        console.log("Asset ID:", assetId);

        const userDoc = await users.findOne({ userid: userId });
        const assetDoc = await Asset.findOne({ assetid: assetId.trim() });


        console.log("userDoc found:", !!userDoc);
        console.log("assetDoc found:", !!assetDoc);

        if (!userDoc || !assetDoc) {
            return res.status(404).json({ message: "User or Asset not found" });
        }

        const oldVector = userDoc.vector;
        const n = userDoc.n_value;

        if (oldVector.length === 0) {
            userDoc.vector = assetDoc.vector;
        } else {
            const newVector = oldVector.map((val, idx) => (
                ((val * n) + (assetDoc.vector[idx] || 0)) / (n + 1)
            ));
            userDoc.vector = newVector;
        }

        userDoc.n_value = n + 1;
        await userDoc.save();

        assetDoc.likes += 1;
        await assetDoc.save();

        res.status(200).json({ message: "Liked successfully", });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/dislike", async (req, res) => {
    try {
        const userId = req.user.id;
        const assetId = req.query.assetid;
        if (!assetId) return res.status(400).json({ message: "Asset ID required" });

        console.log("User ID:", userId);
        console.log("Asset ID:", assetId);

        // Fetch user and asset with correct model names
        const userDoc = await users.findOne({ userid: userId });
        const assetDoc = await Asset.findOne({ assetid: assetId.trim() });

        console.log("userDoc found:", !!userDoc);
        console.log("assetDoc found:", !!assetDoc);

        if (!userDoc || !assetDoc) {
            return res.status(404).json({ message: "User or Asset not found" });
        }

        const oldVector = userDoc.vector;
        const n = userDoc.n_value;

        if (oldVector.length === 0) {
            // Initialize as negative asset vector if user vector empty
            userDoc.vector = assetDoc.vector.map(v => -v);
        } else {
            // Compute new vector using subtraction
            const newVector = oldVector.map((val, idx) => (
                ((val * n) - (assetDoc.vector[idx] || 0)) / (n + 1)
            ));
            userDoc.vector = newVector;
        }

        userDoc.n_value = n + 1;
        await userDoc.save();

        assetDoc.dislikes += 1;
        await assetDoc.save();

        res.status(200).json({ message: "Disliked successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Subscribe to an asset
router.get("/subscribe", async (req, res) => {
    try {
        const userId = req.user.id;
        const assetId = req.query.assetid;
        if (!assetId) return res.status(400).json({ message: "Asset ID required" });

        console.log("User ID:", userId);
        console.log("Asset ID:", assetId);

        const userDoc = await users.findOne({ userid: userId });
        const assetDoc = await Asset.findOne({ assetid: assetId.trim() });

        console.log("userDoc found:", !!userDoc);
        console.log("assetDoc found:", !!assetDoc);

        if (!userDoc || !assetDoc) {
            return res.status(404).json({ message: "User or Asset not found" });
        }

        if (userDoc.following.includes(assetId)) {
            return res.status(400).json({ message: "Already subscribed to this asset" });
        }

        // Add asset to user's following
        userDoc.following.push(assetId);
        userDoc.followingCount = userDoc.following.length;
        await userDoc.save();

        // Add user to creator's followers
        const creatorDoc = await users.findOne({ userid: assetDoc.creator });
        if (creatorDoc && !creatorDoc.followers.includes(userId)) {
            creatorDoc.followers.push(userId);
            creatorDoc.followersCount = creatorDoc.followers.length;
            await creatorDoc.save();
        }

        res.status(200).json({ message: "Subscribed successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Unsubscribe from an asset
router.get("/unsubscribe", async (req, res) => {
    try {
        const userId = req.user.id;
        const assetId = req.query.assetid;
        if (!assetId) return res.status(400).json({ message: "Asset ID required" });

        console.log("User ID:", userId);
        console.log("Asset ID:", assetId);

        const userDoc = await users.findOne({ userid: userId });
        const assetDoc = await Asset.findOne({ assetid: assetId.trim() });

        console.log("userDoc found:", !!userDoc);
        console.log("assetDoc found:", !!assetDoc);

        if (!userDoc || !assetDoc) {
            return res.status(404).json({ message: "User or Asset not found" });
        }

        if (!userDoc.following.includes(assetId)) {
            return res.status(400).json({ message: "You are not subscribed to this asset" });
        }

        // Remove asset from user's following
        userDoc.following = userDoc.following.filter(id => id !== assetId);
        userDoc.followingCount = userDoc.following.length;
        await userDoc.save();

        // Remove user from creator's followers
        const creatorDoc = await users.findOne({ userid: assetDoc.creator });
        if (creatorDoc && creatorDoc.followers.includes(userId)) {
            creatorDoc.followers = creatorDoc.followers.filter(id => id !== userId);
            creatorDoc.followersCount = creatorDoc.followers.length;
            await creatorDoc.save();
        }

        res.status(200).json({ message: "Unsubscribed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
