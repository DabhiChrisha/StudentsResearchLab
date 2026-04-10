const express = require("express");
const { getResearchers, syncResearchers } = require("../controllers/researchersController");

const router = express.Router();

/**
 * GET /api/researchers
 * Returns all students listed in srlStudents.json logic but fetched from DB.
 * Merges students_details and member_cv_profiles.
 */
router.get("/researchers", getResearchers);

/**
 * POST /api/researchers/sync
 */
router.post("/researchers/sync", syncResearchers);

module.exports = router;
