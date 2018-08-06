var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
var UIDGenerator = require("uid-generator");
var uidgen = new UIDGenerator();

var dbHandler = require("../modules/dbHandler");

const usersTablePath = path.join(__dirname, "../public/database/users.json");
const tokensTablePath = path.join(__dirname, "../public/database/tokens.json");
dbHandler.checkJSONexistence(usersTablePath);
dbHandler.checkJSONexistence(tokensTablePath);

let users = JSON.parse(fs.readFileSync(usersTablePath));
let tokensTable = JSON.parse(fs.readFileSync(tokensTablePath));

router.post("/", (req, res, next) => {
  const { email, password } = req.body;
  const userIndex = users.findIndex(user => user.email === email);

  if (userIndex === -1 || users[userIndex].password !== password) {
    return res.status(401).send([{ message: "Wrong Email or password" }]);
  }

  const userId = users[userIndex].id;
  const expires = new Date(2592000000 + Date.now());
  const token = uidgen.generateSync();

  tokensTable.push({ token, expires, userId });
  fs.writeFileSync(tokensTablePath, JSON.stringify(tokensTable));
  return res
    .status(201)
    .cookie("token", token, { expires, httpOnly: true })
    .send({});
});

module.exports = router;
