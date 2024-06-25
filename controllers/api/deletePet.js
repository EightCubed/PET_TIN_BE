const { appLogger } = require("../../config/logger");
const Pet = require("../../model/Pet");

async function deletePet(req, res) {
  try {
    const petId = req.params.id;

    const pet = await Pet.deleteOne({ _id: petId });
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.status(200).json({ message: "Pet deleted!" });
  } catch (error) {
    console.error("Error fetching pets:", error);
    appLogger.error("Error fetching pets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  deletePet,
};
