var fs = require('fs');

function checkJSONexistence(path) {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '[]');
  }
}

module.exports.checkJSONexistence = checkJSONexistence;