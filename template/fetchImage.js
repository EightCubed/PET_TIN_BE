const fs = require("fs");
const path = require("path");

async function searchInFile(directoryPath, imageUrl) {
  try {
    const fullPath = path.join(__dirname, directoryPath);
    const files = await fs.promises.readdir(fullPath);
    let imageArr = [];
    for (let file of files) {
      const filePath = path.join(directoryPath, file);
      if (filePath.includes(imageUrl)) {
        imageArr.push("https://localhost:443" + filePath.slice(2));
      }
    }
    return imageArr;
  } catch (error) {
    console.error("Error searching in file:", error);
    throw error;
  }
}

module.exports = {
  searchInFile,
};
