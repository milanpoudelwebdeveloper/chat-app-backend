const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const morgan = require("morgan");
require("dotenv").config();

//app

const app = express();

//db

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB is connected successfully"))
  .catch((e) => console.log("Error occured while connecting to database", e));

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

//prefixing all the routes with "/api"
// e.g. app.use("/api", anyRoutes)

//reading all routes synchronously and loading

fs.readdirSync("./routes").map((r) =>
  app.use("/api", require(`./routes/${r}`))
);

//port

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
