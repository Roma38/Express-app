var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var dbHandler = require('../modules/dbHandler');

const usersTablePath = path.join(__dirname, '../public/database/users.json'); 
let users;

dbHandler.checkJSONexistence(usersTablePath);

users = JSON.parse(fs.readFileSync(usersTablePath));

function validate(email, password, confirmPass) {
  let errors = [];
  const regEx1 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regEx2 = /[0-9]/;
  const regEx3 = /[a-z]/;

  String(email).toLowerCase().match(regEx1) ? true : errors.push({ message: 'Invalid email' });

  if (password !== confirmPass) {
    errors.push({ message: "Password doesn't match confirmation" });
    return { isValid: false, errors };
  } 
  
  String(password).length > 7 ? true : errors.push({ message: "Password must be longer" });
  String(password).match(regEx2) ? true : errors.push({ message: 'Password must contain numbers too' });
  String(password).toLowerCase().match(regEx3) ? true : errors.push({ message: 'Password must contain letters too' })
  
  if (errors.length < 1) {
    return { isValid: true, errors };
  }

  return { isValid: false, errors };
}

router.post('/', (req, res, next) => {
  const {email, password, confirmPass} = req.body;

  if (users.find(user => user.email === email)) {
    return res.status(400).send({message: 'Email is registrated already'});  
  }

  const valid = validate(email, password, confirmPass);
  if (valid.isValid !== true) {
    return res.status(400).send(valid.errors);
  }

  const id = dbHandler.setId(users);
  users.push({ id, email, password });

  fs.writeFileSync(usersTablePath, JSON.stringify(users));
  return res.status(201).send({ id, email });
});

module.exports = router;