const express = require("express");
const { getActivities } = require("../controllers/activitiesController");

const router = express.Router();

router.get("/activities", getActivities);

module.exports = router;
