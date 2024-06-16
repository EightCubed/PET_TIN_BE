const Pet = require("../../model/Pet");
const User = require("../../model/User");
const { appLogger } = require("../../config/logger");

async function toggleLikePet(req, res) {
  try {
    const { id } = req.body.data;

    if (!id) {
      return res.status(400).json({ error: "Pet ID is required" });
    }

    const cookies = req.cookies;
    if (!cookies?.jwt)
      return res
        .status(400)
        .json({ error: "You must login before you can perform this action" });
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();

    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    const likedIndex = pet.likedBy.indexOf(foundUser._id);
    if (likedIndex > -1) {
      pet.likedBy.splice(likedIndex, 1);
    } else {
      pet.likedBy.push(foundUser._id);
    }

    await pet.save();

    appLogger.info(`User ${foundUser.name} liked pet ${id}`);

    res.status(200).json({
      message: "Pet " + likedIndex > -1 ? "liked" : "unliked" + " successfully",
      pet,
    });
  } catch (error) {
    appLogger.error("Error liking pet:", error);
    res
      .status(500)
      .json({ errorDetails: error, message: "Internal Server Error" });
  }
}

module.exports = { toggleLikePet };
