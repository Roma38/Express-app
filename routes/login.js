var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
var UIDGenerator = require("uid-generator");
var uidgen = new UIDGenerator();


var dbHandler = require("../modules/dbHandler");

const usersTablePath = path.join(__dirname, "../public/database/users.json");
const tokensTablePath = path.join(__dirname, "../public/database/tokens.json")
let users;

dbHandler.checkJSONexistence(usersTablePath);

users = JSON.parse(fs.readFileSync(usersTablePath));

router.post('/', (req, res, next) => {
  const{ email, password } = req.body;
  const userIndex = users.findIndex(user => user.email === email);

  if (userIndex === -1 || users[userIndex].password != password) {
    return res.status(401).send([{ message: "Wrong Email or password" }]);
  }

  const userId = users[userIndex].id;
  const expires = 2592000000 + Date.now();  
  const token = uidgen.generateSync();

  dbHandler.checkJSONexistence(tokensTablePath);

  let tokensTable = JSON.parse(fs.readFileSync(tokensTablePath));
  tokensTable.push({ token, expires: new Date(expires).toJSON(), userId });
  fs.writeFileSync(tokensTablePath, JSON.stringify(tokensTable));
  res.status(200).cookie("token", token, { maxAge: expires }).send("cookie set");  
});

module.exports = router;