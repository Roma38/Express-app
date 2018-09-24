const path = require("path");
const fs = require("fs");

const tokensTablePath = path.join(__dirname, "./tokens.json");

if (!fs.existsSync(tokensTablePath)) {
  fs.writeFileSync(tokensTablePath, "[]");
}

let tokens = JSON.parse(fs.readFileSync(tokensTablePath));

module.exports = {
  read() {
    return tokens;
  },
  create(record) {
    tokens.push(record);

    return this;
  },
  update(index, record) {
    tokens[index] = { ...tokens[index], ...record};

    return this;
  },
  delete(index) {
    tokens.splice(index, 1);
    
    return this;
  },
  save() {
    fs.writeFileSync(tokensTablePath, JSON.stringify(tokens));

    return this;
  }
};