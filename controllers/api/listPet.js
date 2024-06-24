const { appLogger } = require("../../config/logger");
const Pet = require("../../model/Pet");
const User = require("../../model/User");
const { searchInFile } = require("../../template/fetchImage");

require("dotenv").config();

async function listPets(req, res) {
  try {
    const pets = await Pet.find();

    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res
        .status(400)
        .json({ error: "You must login before you can perform this action" });
    }

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();

    const modifiedPetList = await Promise.all(
      pets.map(async (pet) => {
        const petObject = pet.toObject();
        const numberOfLikes = petObject.likedBy.length;
        const isLikedByUser = petObject.likedBy.some(
          (likedByObj) => likedByObj.toString() === foundUser._id.toString()
        );
        delete petObject.likedBy;

        const ImageArray = await searchInFile(
          "../uploads/",
          pet.ImageUrl ?? ""
        );
        console.log(ImageArray);

        return {
          ...petObject,
          numberOfLikes,
          isLikedByUser,
          ImageArray,
        };
      })
    );

    res.status(200).json({ data: modifiedPetList });
  } catch (error) {
    console.error("Error fetching pets:", error);
    appLogger.error("Error fetching pets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  listPets,
};
