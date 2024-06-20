const Pet = require("../../model/Pet");
const { appLogger } = require("../../config/logger");
const { v4: uuidv4 } = require("uuid");
const { fetchUser } = require("../../template/fetchUser");

async function addPet(req, res) {
  try {
    const { petDetails, userId, petLocationDetails } = req.body;

    const { petName, petAge, petGender, petSpecies, petBreed, description } =
      petDetails;

    const { city, state, country } = petLocationDetails;

    const OwnerDetails = await fetchUser(userId);

    const newPet = new Pet({
      PetName: petName,
      Age: petAge,
      Gender: petGender,
      Species: petSpecies,
      Breed: petBreed,
      Owner: userId,
      Location: {
        City: city,
        State: state,
        Country: country,
      },
      ImageUrl: "",
      EmailId: "",
      Description: description,
    });

    await newPet.save();

    appLogger.info("New pet added successfully", newPet);

    // Send response
    res.status(201).json({});
  } catch (error) {
    appLogger.error("Error adding pet:", error);
    res
      .status(500)
      .json({ errorDetails: error, message: "Internal Server Error" });
  }
}

module.exports = { addPet };
