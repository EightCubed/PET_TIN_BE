const Pet = require("../../model/Pet");
const { appLogger } = require("../../config/logger");

async function addPet(req, res) {
  try {
    const {
      PetName,
      Age,
      Gender,
      Owner,
      Location,
      ImageUrl,
      Species,
      Breed,
      EmailId,
    } = req.body;

    if (
      !PetName ||
      !Age ||
      !Gender ||
      !Owner ||
      !Location ||
      !ImageUrl ||
      !Species ||
      !Breed ||
      !EmailId
    ) {
      console.log(req.body);
      return res.status(400).json({ error: "All fields are required" });
    }

    const newPet = new Pet({
      PetName,
      Age,
      Gender,
      Owner,
      Location,
      ImageUrl,
      Species,
      Breed,
      EmailId,
    });

    await newPet.save();

    appLogger.info("New pet added successfully", newPet);

    // Send response
    res.status(201).json(newPet);
  } catch (error) {
    appLogger.error("Error adding pet:", error);
    res
      .status(500)
      .json({ errorDetails: error, message: "Internal Server Error" });
  }
}

module.exports = { addPet };
