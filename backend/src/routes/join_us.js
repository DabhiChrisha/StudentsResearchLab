const express = require("express");
const { submitJoinUs } = require("../controllers/joinUsController");

const router = express.Router();

router.post("/join-us", submitJoinUs);

module.exports = router;
