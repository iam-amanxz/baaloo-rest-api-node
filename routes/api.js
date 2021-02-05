const express = require("express");
const authRouter = require("./auth");
const postRouter = require("./post");

const app = express();

app.use("/auth/", authRouter);
app.use("/posts/", postRouter);

module.exports = app;
