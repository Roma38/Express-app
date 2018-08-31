var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");

const usersDB = require("../public/database/users/controller.js");

/* const usersTablePath = path.join(__dirname, "../public/database/users.json");
const users = JSON.parse(fs.readFileSync(usersTablePath)); */



module.exports = router;