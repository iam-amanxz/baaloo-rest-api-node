const winston = require("winston");

const options = {
  level: process.env.LOG_LEVEL || "info",
  prettyPrint: true,
  colorize: true,
  humanReadableUnhandledException: true,
};

const logger = winston.createLogger({
  transports: [new winston.transports.Console(options)],
});

module.exports = logger;
