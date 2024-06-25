const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { appLogger } = require("../config/logger");
const {
  BEARER_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES_SHORT,
  REFRESH_TOKEN_EXPIRES_LONG,
  REFRESH_TOKEN_EXPIRE_TIME_SHORT,
  REFRESH_TOKEN_EXPIRE_TIME_LONG,
} = require("../constants/client");

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  const foundUser = await User.findOne({ refreshToken }).exec();
  // Detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); // Forbidden
        console.error("attempted refresh token reuse!");
        const hackedUser = await User.findOne({
          username: decoded.username,
        }).exec();
        if (hackedUser) {
          await User.findOneAndUpdate(
            { username: decoded.username },
            { $set: { refreshToken: [] } },
            { new: true, upsert: true }
          );
          appLogger.fatal("Detected refresh token reuse!", hackedUser);
        }
      }
    );
    return res.sendStatus(403); // Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  // Evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        console.error("expired refresh token");
        await User.findOneAndUpdate(
          { _id: foundUser._id },
          { $set: { refreshToken: newRefreshTokenArray } },
          { new: true, upsert: true }
        );
        return res.sendStatus(403); // Forbidden
      }

      if (foundUser.username !== decoded.username) return res.sendStatus(403);

      // Refresh token was still valid
      const roles = Object.values(foundUser.roles).filter((role) => role);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: BEARER_TOKEN_EXPIRES }
      );

      const rememberMe = cookies?.rememberMe;
      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: rememberMe
            ? REFRESH_TOKEN_EXPIRES_LONG
            : REFRESH_TOKEN_EXPIRES_SHORT,
        }
      );

      // Saving refreshToken with current user
      await User.findOneAndUpdate(
        { _id: foundUser._id },
        { $set: { refreshToken: [...newRefreshTokenArray, newRefreshToken] } },
        { new: true, upsert: true }
      );

      // Creates Secure Cookie with refresh token
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: rememberMe
          ? REFRESH_TOKEN_EXPIRE_TIME_LONG
          : REFRESH_TOKEN_EXPIRE_TIME_SHORT,
      });

      const { _id, username } = foundUser;

      res.json({ roles, accessToken, username, _id });
    }
  );
};

module.exports = { refreshToken };
