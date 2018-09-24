const path = require("path");
const fs = require("fs");

const postsTablePath = path.join(__dirname, "./posts.json");

if (!fs.existsSync(postsTablePath)) {
  fs.writeFileSync(postsTablePath, "[]");
}

let posts = JSON.parse(fs.readFileSync(postsTablePath));

module.exports = {
  read() {
    return posts;
  },
  create(record) {
    posts.push(record);

    return this;
  },
  update(index, record) {
    posts[index] = { ...posts[index], ...record};

    return this;
  },
  delete(index) {
    posts.splice(index, 1);
    
    return this;
  },
  save() {
    fs.writeFileSync(postsTablePath, JSON.stringify(posts));

    return this;
  },
  getBiggestId() {
    if (this.read().length < 1) {
      return 1;
    }

    const idArray = this.read().map(({ id }) => id);
    return (Math.max(...idArray) + 1);
  }
};