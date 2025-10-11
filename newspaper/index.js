const express = require("express");
const router = express.Router();
const connectdb = require("../mangodb");
const { generateNewsSummary,generateNewsSummaryMock } = require("../services/newspaperService");

router.post("/newspaper", async (req, res, next) => {
  try {
    await connectdb();

    const userId = req.user?.userid;
    const { question } = req.body;

    const result = await generateNewsSummaryMock(userId, question);

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
});

module.exports = router;
