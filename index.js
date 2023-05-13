const mongoose = require("mongoose");
const util = require("util");
const debug = require("debug")("node-server:index");

const config = require("./src/config");
const server = require("./src/server");
const app = require("express")();

Promise = require("bluebird");

mongoose.Promise = Promise;

const mongoUri = config.mongo.host;
console.log("mongo:::", mongoUri);
mongoose.connect(mongoUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  promiseLibrary: Promise,
  useFindAndModify: false,
});

mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

if (config.mongooseDebug) {
  mongoose.set("debug", (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

app.get("/", function (req, res) {
  res.json({ message: "hooray! welcome to our api!" });
});

if (!module.parent) {
  server.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);
  });
}

module.exports = server;
