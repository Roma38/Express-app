const path = require("path");
const fs = require("fs");

const usersTablePath = path.join(__dirname, "./users.json");

if (!fs.existsSync(usersTablePath)) {
  fs.writeFileSync(usersTablePath, "[]");
}

let users = JSON.parse(fs.readFileSync(usersTablePath));

module.exports = {
  read() {
    return users;
  },
  create(record) {
    users.push(record);

    return this;
  },
  update(index, record) {
    users[index] = { ...users[index], ...record };

    return this;
  },
  delete(index) {
    users.splice(index, 1);

    return this;
  },
  save() {
    fs.writeFileSync(usersTablePath, JSON.stringify(users));

    return this;
  },
  getBiggestId(collection) {
    if (collection.length < 1) {
      return 1;
    }

    const idArray = collection.map(({ id }) => id);
    return (Math.max(...idArray) + 1);
  }
};
