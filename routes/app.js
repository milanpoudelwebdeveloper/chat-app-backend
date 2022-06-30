const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hey you are welcome guys");
});

module.exports = router;
