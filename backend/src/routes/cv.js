const express = require("express");
const { getCvProfile } = require("../controllers/cvController");

const router = express.Router();

// Use the controller to ensure students_details and patents are included
router.get("/api/cv/:enrollment_no", getCvProfile);

module.exports = router;
