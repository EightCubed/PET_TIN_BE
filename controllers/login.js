const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  BEARER_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES_SHORT,
  REFRESH_TOKEN_EXPIRES_LONG,
  REFRESH_TOKEN_EXPIRE_TIME_SHORT,
  REFRESH_TOKEN_EXPIRE_TIME_LONG,
} = require("../constants/client");

async function login(req, res) {
  const cookies = req.cookies;
  const { user, pwd, rememberMe } = req.body;
  let rememberMeVal = Boolean(rememberMe | (cookies?.rememberMe === "true"));
  const REFRESH_TOKEN_EXPIRES = rememberMeVal
    ? REFRESH_TOKEN_EXPIRES_LONG
    : REFRESH_TOKEN_EXPIRES_SHORT;
  const REFRESH_TOKEN_EXPIRES_TIME = rememberMeVal
    ? REFRESH_TOKEN_EXPIRE_TIME_LONG
    : REFRESH_TOKEN_EXPIRE_TIME_SHORT;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401);
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          emailId: foundUser.emailId,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: BEARER_TOKEN_EXPIRES }
    );
    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES,
      }
    );

    // Changed to let keyword
    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      // Detected refresh token reuse!
      if (!foundToken) {
        console.error("attempted refresh token reuse at login!");
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: REFRESH_TOKEN_EXPIRES_TIME,
    });

    if (rememberMeVal)
      res.cookie("rememberMe", true, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: REFRESH_TOKEN_EXPIRES_TIME,
      });

    const { _id, username } = foundUser;

    res.json({ roles, accessToken, username, _id });
  } else {
    res.sendStatus(401);
  }
}

module.exports = { login };
