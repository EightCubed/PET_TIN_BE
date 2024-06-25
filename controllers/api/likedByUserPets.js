const Pet = require("../../model/Pet");
const User = require("../../model/User");
const { searchInFile } = require("../../template/fetchImage");

const getLikedPetsByUser = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt)
      return res
        .status(400)
        .json({ error: "You must login before you can perform this action" });
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();

    const likedPets = await Pet.find({ likedBy: foundUser._id }).exec();

    const modifiedPetList = await Promise.all(
      likedPets.map(async (pet) => {
        const ImageArray = await searchInFile(
          "../uploads/",
          pet.ImageUrl ?? ""
        );
        const petObject = pet.toObject();
        const numberOfLikes = petObject.likedBy.length;
        const isLikedByUser = petObject.likedBy.some(
          (likedByObj) => likedByObj.toString() === foundUser._id.toString()
        );
        delete petObject.likedBy;
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
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLikedPetsByUser };
