const User = require("../model/User");

const fetchUser = async (userId) => {
  const { emailId, firstName, lastName, gender, age } = await User.findOne({
    _id: userId,
  }).exec();

  return { emailId, firstName, lastName, gender, age };
};

module.exports = {
  fetchUser,
};
