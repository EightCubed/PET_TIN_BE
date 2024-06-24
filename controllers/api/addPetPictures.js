const { appLogger } = require("../../config/logger");

async function addPetPictures(req, res) {
  try {
    const responseID = req.body;

    appLogger.info("New pet pictures added successfully");

    res.status(201).json({ message: "New pet pictures added successfully" });
  } catch (error) {
    appLogger.error("Error adding pet pictures:", error);
    res
      .status(500)
      .json({ errorDetails: error, message: "Internal Server Error" });
  }
}

module.exports = { addPetPictures };
