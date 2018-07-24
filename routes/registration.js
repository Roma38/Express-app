var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var dbHandler = require('../modules/dbHanler');

const usersTablePath = path.join(__dirname, '../public/database/users.json'); 
let users;

// TODO move to separate module
/* if (!fs.existsSync(usersTablePath)) {
  fs.writeFileSync(usersTablePath, '[]');
} */
dbHandler.checkJSONexistence(usersTablePath);

users = JSON.parse(fs.readFileSync(usersTablePath));

/* TODO
 * Переименовать функцию в validate.
 * {
 *  isValid: false,
 *  error: [
 *   { message: 'Invalid email' },
 *   { message: 'Password doesn\'t match confirmation' },
 *  ]
 * }
 *
 * {
 *  isValid: true,
 *  error: []
 * }
 */
function validate(email, password, confirmPass) {
  let errors = [];
  const regEx1 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regEx2 = /[0-9]/;
  const regEx3 = /[a-z]/;

  String(email).toLowerCase().match(regEx1) ? true : errors.push({ message: 'Invalid email' });
  password === confirmPass ? true : errors.push({ message: "Password doesn't match confirmation" });
  String(password).length > 7 ? true : errors.push({ message: "Password must be longer" });
  String(password).match(regEx2) ? true : errors.push({ message: 'Password must contain numbers too' });
  String(password).toLowerCase().match(regEx3) ? true : errors.push({ message: 'Password must contain letters too' })
  
  if (errors.length < 1) {
    return { isValid: true, errors };
  }

  return { isValid: false, errors };
}

// TODO: вынести функцию в отдельный модуль. Не копировать эту функцию до того как вынесем её
/* function setId(collection) {
  if (collection.length < 1) {
    return 1;
  }
  
  const idArray = collection.map(({ id }) => id);
  return (Math.max(...idArray) + 1);
} */

router.post('/', (req, res, next) => {
  const {email, password, confirmPass} = req.body;

  if (users.find(user => user.email === email)) { //TODO нужно искать не в массиве имейлов а в массивве пользователей
    return res.status(400).send({message: 'Email is registrated already'});  
  }

  const valid = validate(email, password, confirmPass);
  if (valid !== true) {
    return res.status(400).send(valid.toString());
  }

  const id = dbHandler.setId(users);
  users.push({ id, email, password }); // TODO сохранить файл в базу

  fs.writeFileSync(usersTablePath, JSON.stringify(users));
  return res.status(201).send({ id, email });
});

module.exports = router;