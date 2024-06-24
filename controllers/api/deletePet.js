const { appLogger } = require("../../config/logger");
const Pet = require("../../model/Pet");

async function deletePets(req, res) {
  try {
    const petId = req.params.id;

    const pet = await Pet.deleteOne(petId);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.status(200).json({ message: "Pet deleted!" });
  } catch (err) {
    console.error("Error fetching pets:", error);
    appLogger.error("Error fetching pets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  deletePets,
};
