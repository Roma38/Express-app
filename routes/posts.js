var express = require('express');
var router = express.Router();

const postsDB = require("../public/database/posts/controller.js");
const usersDB = require("../public/database/users/controller.js");

router.get('/', function (req, res, next) {
  res.send({ posts: postsDB.read(), isLoggedIn: res.$meta.isLoggedIn });
});

router.post('/', (req, res, next) => {
  if (!res.$meta.isLoggedIn){
    return res
      .status(401)
      .send([{ message: "Login first" }]);
  }

  const { postTitle, postBody } = req.body;
  const userId = res.$meta.userId;
  const author = usersDB.read().find(user => user.id === userId).firstName;
  const postDate = new Date();
  const id = postsDB.getBiggestId();

  postsDB
    .create({ id, postTitle, postBody, author, postDate, userId })
    .save();
  res.send(postsDB.read());
});

module.exports = router;
