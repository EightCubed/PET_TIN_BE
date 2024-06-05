const { appLogger } = require("../../config/logger");
const Pet = require("../../model/Pet");

require("dotenv").config();

async function listPets(_, res) {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    appLogger.error("Error fetching pets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  listPets,
};
