var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");

const usersTablePath = path.join(__dirname, "../public/database/users.json");
const users = JSON.parse(fs.readFileSync(usersTablePath));

router.get('/', (req, res, next) => {
  if (res.$meta.isLoggedIn) {
    const user = users.find( user => user.id === res.$meta.userId);
    const { firstName, lastName, gender, birthDate, country, city, phoneNumber } = user;
    const userProfileInfo = { firstName, lastName, gender, birthDate, country, city, phoneNumber };
    return res.send(userProfileInfo);
  } else {
    return res.status(401).send([{ message: "Login first" }]);
  }
});

module.exports = router;