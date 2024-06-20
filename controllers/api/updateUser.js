const { appLogger } = require("../../config/logger");
const Pet = require("../../model/Pet");
const User = require("../../model/User");
const mongoose = require("mongoose");

require("dotenv").config();

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const { emailId, firstName, lastName, gender, age } = updatedUser;

    res.status(200).json({
      emailId,
      firstName,
      lastName,
      gender,
      age,
    });
  } catch (error) {
    console.error("Error fetching pets:", error);
    appLogger.error("Error fetching pets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  updateUser,
};
