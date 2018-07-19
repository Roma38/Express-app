var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

const postsTablePath = path.join(__dirname, '../public/database/posts.json');
let posts;

if (!fs.existsSync(postsTablePath)) {
  fs.writeFileSync(postsTablePath, '[]');
}

posts = JSON.parse(fs.readFileSync(postsTablePath));

router.get('/', function (req, res, next) {
  res.send(posts);
});

router.post('/', (req, res, next) => {
  posts.push(req.body);
  fs.writeFileSync(postsTablePath, JSON.stringify(posts));
  res.send(req.body);
});

module.exports = router;
