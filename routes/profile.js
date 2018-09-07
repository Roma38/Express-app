var express = require("express");
var router = express.Router();

const usersDB = require("../public/database/users/controller.js");

router.get("/", (req, res, next) => {
  if (res.$meta.isLoggedIn) {
    const user = usersDB.read().find(user => user.id === res.$meta.userId);
    console.log(user);
    console.log(res.$meta.userId);
    const {
      firstName,
      lastName,
      gender,
      birthDate,
      country,
      city,
      phoneNumber
    } = user;
    
    return res.send({
      firstName,
      lastName,
      gender,
      birthDate,
      country,
      city,
      phoneNumber
    });
  } else {
    return res.status(401).send([{ message: "Login first" }]);
  }
});

router.put("/", (req, res, next) => {
  const { firstName, lastName, gender, birthDate, country, city, phoneNumber } = req.body;

  if (res.$meta.isLoggedIn) {
    const userIndex = usersDB.read().findIndex(user => user.id === res.$meta.userId);
    usersDB.update(userIndex, {
      firstName,
      lastName,
      gender,
      birthDate,
      country,
      city,
      phoneNumber
    }).save();
  } else {
    res.status(401).send([{ message: "Login first" }]);
  }

  res.send();
});

module.exports = router;