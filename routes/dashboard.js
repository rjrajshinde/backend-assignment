var express = require("express");
var router = express.Router();

//route to get the dashboard Page
router.get("/", function (req, res, next) {
  res.render("dashboard", { title: "Dashboard" });
});

module.exports = router;
