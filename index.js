const express = require("express");
const http = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const logger = require("./helpers/logger");
const initializeDb = require("./db");
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const apiResponse = require("./helpers/apiResponse");

const app = express();
app.server = http.createServer(app);

app.use(cors());
app.use(helmet());

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("combined"));

const PORT = process.env.PORT || "5000";

initializeDb(() => {
  app.use("/", indexRouter);
  app.use("/api/", apiRouter);
  app.all("*", function (req, res) {
    return apiResponse.notFoundResponse(res, "Page not found");
  });
  app.use((err, req, res) => {
    if (err.name == "UnauthorizedError") {
      return apiResponse.unauthorizedResponse(res, err.message);
    }
  });

  app.server.listen(PORT);

  logger.info(`Started on PORT ${app.server.address().port}...`);
});

module.exports = app;
