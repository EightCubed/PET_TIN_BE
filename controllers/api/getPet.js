const { appLogger } = require("../../config/logger");
const Pet = require("../../model/Pet");
const User = require("../../model/User");
const mongoose = require("mongoose");
const { searchInFile } = require("../../template/fetchImage");

require("dotenv").config();

async function getPet(req, res) {
  try {
    const petId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return res.status(400).json({ error: "Invalid Pet ID" });
    }

    const cookies = req.cookies;
    if (!cookies?.jwt)
      return res
        .status(400)
        .json({ error: "You must login before you can perform this action" });
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();

    const pet = await Pet.findById(petId).populate("likedBy", "username");
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    const ImageArray = await searchInFile("../uploads/", pet.ImageUrl ?? "");

    const isLikedByUser = pet.likedBy.some((id) => id.equals(foundUser._id));

    res.status(200).json({
      ...pet.toObject(),
      likedBy: undefined,
      numberOfLikes: pet.likedBy.length,
      isLikedByUser,
      OwnerDetails: {
        FirstName: foundUser.firstName,
        LastName: foundUser.lastName,
        Age: foundUser.age,
        Gender: foundUser.gender,
      },
      ImageArray,
    });
  } catch (error) {
    console.error("Error fetching pets:", error);
    appLogger.error("Error fetching pets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getPet,
};
