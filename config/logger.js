const log4js = require("log4js");
const jsonLayout = require("log4js-json-layout");

log4js.addLayout("json", jsonLayout);
log4js.configure({
  appenders: {
    out: { type: "stdout" },
    app: { type: "file", filename: "app.log", layout: { type: "json" } },
  },
  categories: {
    default: { appenders: ["out"], level: "info" },
    app: { appenders: ["app"], level: "debug" },
  },
});

// const defaultLogger = log4js.getLogger();

const appLogger = log4js.getLogger("app");

module.exports = {
  //   defaultLogger,
  appLogger,
};
