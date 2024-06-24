const Pet = require("../../model/Pet");
const { appLogger } = require("../../config/logger");
const { v4: uuidv4 } = require("uuid");
const { fetchUser } = require("../../template/fetchUser");

async function addPet(req, res) {
  try {
    const { petDetails, userId, petLocationDetails } = req.body;

    const { petName, petAge, petGender, petSpecies, petBreed, description } =
      petDetails;

    const {
      city: { name: cityName },
      state: { name: stateName },
      country: { name: countryName },
    } = petLocationDetails;

    const responseID = uuidv4();

    const newPet = new Pet({
      PetName: petName,
      Age: petAge,
      Gender: petGender,
      Species: petSpecies,
      Breed: petBreed,
      Owner: userId,
      Location: {
        City: cityName,
        State: stateName,
        Country: countryName,
      },
      ImageUrl: responseID,
      EmailId: "",
      Description: description,
    });

    await newPet.save();

    appLogger.info("New pet added successfully", newPet);

    res.status(201).json({ responseID });
  } catch (error) {
    appLogger.error("Error adding pet:", error);
    res
      .status(500)
      .json({ errorDetails: error, message: "Internal Server Error" });
  }
}

module.exports = { addPet };
