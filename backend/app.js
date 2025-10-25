const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import your routers
const authRouter = require("./auth service/index");
const recRouter = require("./section_B,C/section_b/index");
const commenRouter = require("./section_B,C/commen relationship/index");
const newspaperRouter = require("./newspaper/index");

// Authentication middleware
const authentication = require("./middlewheres/authntication.js");
const errorHandler = require("./middlewheres/errhandaling.js");

// API routes
app.get("/verifytoken", authentication, (req, res) => {
  res.status(200).json({ message: "token valid" });
});

app.use("/auth", authRouter);
app.use("/recc", authentication, recRouter);
app.use("/commen", authentication, commenRouter);
app.use("/newspaper", authentication, newspaperRouter);

// Serve React SPA
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
