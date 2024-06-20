const { appLogger } = require("../../config/logger");
const Pet = require("../../model/Pet");
const User = require("../../model/User");
const mongoose = require("mongoose");

require("dotenv").config();

async function getUser(req, res) {
  try {
    const userId = req.params.id;

    const foundUser = await User.findOne({ _id: userId }).exec();

    const { emailId, firstName, lastName, gender, age } = foundUser;

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
  getUser,
};
