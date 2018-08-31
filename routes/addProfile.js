var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");

var dbHandler = require("../modules/dbHandler");

const usersTablePath = path.join(__dirname, "../public/database/users.json");
const tokensTablePath = path.join(__dirname, "../public/database/tokens.json");
let users = JSON.parse(fs.readFileSync(usersTablePath));
let tokensTable = JSON.parse(fs.readFileSync(tokensTablePath));

router.put("/", (req, res, next) => {
  let errors = [];
  const { firstName, lastName, gender, birthDate, country, city, phoneNumber } = req.body;

  if (res.$meta.isLoggedIn) {
    const userIndex = users.findIndex(user => user.id === res.$meta.userId);
    users[userIndex] = { ...users[userIndex], firstName, lastName, gender, birthDate, country, city, phoneNumber };
    fs.writeFileSync(usersTablePath, JSON.stringify(users));
  }

  console.log(req.body, req.cookies);
  res.send();
});

module.exports = router;