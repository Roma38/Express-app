var express = require("express");
var router = express.Router();
var path = require("path");
var UIDGenerator = require("uid-generator");
var uidgen = new UIDGenerator();

const dbHandler = require("../modules/dbHandler");
const tokensDB = require("../public/database/tokens/controller.js");
const usersDB = require("../public/database/users/controller.js");

dbHandler.checkJSONexistence(path.join(__dirname, '../public/database/tokens/tokens.json'));
dbHandler.checkJSONexistence(path.join(__dirname, '../public/database/users/users.json'));

router.post("/", (req, res, next) => {
  const { email, password } = req.body;
  const user = usersDB.read().find(user => user.email === email);

  if (user === undefined || user.password !== password) {
    return res.status(401).send([{ message: "Wrong Email or password" }]);
  }

  // TODO если в базе токенов уже хранится токен для этого пользователя, то мы его обновляем вместо того чтоб добавлять новый токен

  const expires = new Date(2592000000 + Date.now());
  const token = uidgen.generateSync();
  const tokensIndex = tokensDB.read().findIndex(item => item.userId === user.id);

  if (tokensIndex === -1) {
    tokensDB.create({ token, expires, userId: user.id }).save();
  } else {
    tokensDB.update(tokensIndex, { token, expires }).save();
  }
  
  return res
    .status(201)
    .cookie("token", token, {
      expires,
      httpOnly: process.env.ENV === "dev" ? false : true
    })
    .send({});
});

module.exports = router;
