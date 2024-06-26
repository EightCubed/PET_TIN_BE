const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  City: {
    type: String,
    required: true,
  },
  State: {
    type: String,
    required: true,
  },
  Country: {
    type: String,
    required: true,
  },
});

const petSchema = new mongoose.Schema({
  PetName: {
    type: String,
    required: true,
  },
  Age: {
    type: Number,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  Owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OwnerId",
    required: true,
  },
  Location: {
    type: locationSchema,
    required: true,
  },
  ImageUrl: {
    type: String,
    // required: true,
  },
  Species: {
    type: String,
    required: true,
  },
  Breed: {
    type: String,
    required: true,
  },
  EmailId: {
    type: String,
    // required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Create the Pet model
const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
