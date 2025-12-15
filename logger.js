const fs = require("fs");

function log(msg) {
  fs.appendFileSync(
    "logs.txt",
    JSON.stringify({ ts: new Date().toISOString(), msg }) + "\n"
  );
}

module.exports = { log };
