const fs = require("node:fs");

function readStore(store_path) {
    try {
        return JSON.parse(fs.readFileSync(store_path, "utf8"));
    } catch {
        return {};
    }
}

function writeStore(store_path, data) {
    fs.writeFileSync(store_path, JSON.stringify(data, null, 2));
}

module.exports = {
    readStore,
    writeStore,
};
