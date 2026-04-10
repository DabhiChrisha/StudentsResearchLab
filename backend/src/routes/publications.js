const express = require("express");
const { getPublications, submitPublication } = require("../controllers/publicationsController");

const router = express.Router();

// GET /api/publications
// Query params: ?search=   ?event_type=Conference   ?year=2025   ?category=Scopus
router.get("/publications", getPublications);

router.post("/submit-publication", submitPublication);

module.exports = router;
