const express = require("express");
const cors = require("cors");
const path = require("path"); // Make sure to import path for handling 404 page
const { register } = require("./controllers/register");
const { login } = require("./controllers/login");
const { addPet } = require("./controllers/api/addPet");
const { listPets } = require("./controllers/api/listPet");
const { client } = require("./constants/client");
const { appLogger } = require("./config/logger");
const connectDB = require("./config/dbConn");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

async function run() {
  console.log("Starting the server...");
  try {
    connectDB();

    app.listen(3000, function () {
      appLogger.info("\nServer is listening on port 3000!");
    });

    appLogger.info("\nAttempting to connect to the database...");
    await client.connect();
    appLogger.info("\nConnected to the database");

    app.post("/api/register", register);
    app.post("/api/login", login);
    app.get("/api/listPets", listPets);
    app.put("/api/addPet", addPet);

    app.all("*", (req, res) => {
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
