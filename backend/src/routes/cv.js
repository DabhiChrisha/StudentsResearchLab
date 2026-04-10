const express = require("express");
const { getCvProfile } = require("../controllers/cvController");

const router = express.Router();

router.get("/cv/:enrollment_no", getCvProfile);

module.exports = router;
