const mongoose = require("mongoose");
const logger = require("./helpers/logger");

module.exports = (init) => {
  const MONGODB_URL = process.env.MONGODB_URL;
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;

  db.on("error", logger.error.bind(logger, "DB connection error:"));
  db.once("open", () => {
    logger.info(`DB Connected to ${MONGODB_URL}`);
    init();
  });
};
