const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path"); // Make sure to import path for handling 404 page
const { register } = require("./controllers/register");
const { login } = require("./controllers/login");
const { logout } = require("./controllers/logout");
const { refreshToken } = require("./controllers/refreshToken");
const { fetchLocationData } = require("./controllers/fetchLocationData");
const verifyJWT = require("./middleware/verifyJWT");
const { addPet } = require("./controllers/api/addPet");
const { listPets } = require("./controllers/api/listPet");
const { getPet } = require("./controllers/api/getPet");
const { getUser } = require("./controllers/api/getUser");
const { updateUser } = require("./controllers/api/updateUser");
const { toggleLikePet } = require("./controllers/api/toggleLikePet");
const { getLikedPetsByUser } = require("./controllers/api/likedByUserPets");
const { client } = require("./constants/client");
const { appLogger } = require("./config/logger");
const connectDB = require("./config/dbConn");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "Set-Cookie");
  next();
});

const options = {
  key: fs.readFileSync("localhost.key"),
  cert: fs.readFileSync("localhost.crt"),
};

async function run() {
  console.log("Starting the server...");
  try {
    connectDB();

    https.createServer(options, app).listen(443, function () {
      appLogger.info("\nServer is listening on port 443!");
    });

    appLogger.info("\nAttempting to connect to the database...");
    await client.connect();
    appLogger.info("\nConnected to the database");

    app.post("/api/register", register);
    app.post("/api/login", login);
    app.post("/api/logout", logout);
    app.post("/api/refreshToken", refreshToken);
    app.get("/api/fetchLocationData", fetchLocationData);

    app.use(verifyJWT);
    console.log("passed JWT verification");
    app.get("/api/listPets", listPets);
    app.get("/api/getPet/:id", getPet);
    app.get("/api/getLikedPets", getLikedPetsByUser);
    app.put("/api/addPet", addPet);
    app.get("/api/getUser/:id", getUser);
    app.patch("/api/getUser/:id", updateUser);
    app.post("/api/likePet", toggleLikePet);

    app.all("*", (req, res) => {
      console.log("error!");
      res.status(404);
      appLogger.error("\n404 Error", req.body);
      if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
      } else if (req.accepts("json")) {
        res.json({ error: "404 Not Found" });
      } else {
        res.type("txt").send("404 Not Found");
      }
    });
  } catch (err) {
    console.error("Error with Initialising DB! Exiting...");
    console.error(err.stack);
    process.exit(1); // Exit the process with a failure code
  } finally {
    // Uncomment if you want to close the connection after server stops
    // console.log("Connection Closing ...");
    // await client.close();
  }
}

run().catch((err) => {
  console.error("An error occurred while running the server:", err);
});
