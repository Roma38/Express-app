var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

const emailTablePath = path.join(__dirname, '../public/database/emails.json');
let emails;

if (!fs.existsSync(emailTablePath)) {
  fs.writeFileSync(emailTablePath, '[]');
}

emails = JSON.parse(fs.readFileSync(emailTablePath));

function validation(email, password, confirmPass) {
  let errors = [];
  const regEx1 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regEx2 = /[0-9]/;
  const regEx3 = /[a-z]/;

  String(email).toLowerCase().match(regEx1) ? true : errors.push('Invalid email');
  password === confirmPass ? true : errors.push("Password doesn't match confirmation");
  String(password).length > 7 ? true : errors.push("Password must be longer");
  String(password).match(regEx2) ? true : errors.push('Password must contain numbers too');
  String(password).toLowerCase().match(regEx3) ? true : errors.push('Password must contain letters too')
  if (errors.length < 1) {
    return 'ok';
  } else {
    return errors;
  }
}

router.post('/', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPass = req.body.confirmPass;

  if (emails.includes(req.body.email)) {
    return res.send('Email is registrated already');    
  } else {
    const valid = validation(email, password, confirmPass);
    if (valid == 'ok') {
      emails.push({ email: email, password: password });
      return res.send({ email: email, password: password });
    } else {
      return res.send(valid.toString());
    }
  }
});

module.exports = router;