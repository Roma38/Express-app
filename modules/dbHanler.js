function checkJSONexistence(path) {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '[]');
  }
}

function setId(collection) {
  if (collection.length < 1) {
    return 1;
  }

  const idArray = collection.map(({ id }) => id);
  return (Math.max(...idArray) + 1);
}

module.exports.checkJSONexistence = checkJSONexistence;
module.exports.setId = setId;

