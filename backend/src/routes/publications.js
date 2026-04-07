const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

// GET /api/publications
// Query params: ?search=   ?event_type=Conference   ?year=2025   ?category=Scopus
router.get("/publications", async (req, res, next) => {
  try {
    const { search, event_type, year, category } = req.query;

    let query = supabase
      .from("publications")
      .select("*")
      .order("year", { ascending: false })
      .order("id", { ascending: false });

    if (year) {
      query = query.eq("year", parseInt(year));
    }

    if (event_type) {
      query = query.ilike("event_type", event_type);
    }

    if (category) {
      query = query.ilike("category", `%${category}%`);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,student_authors.ilike.%${search}%,venue.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      const msg = (error.message || "").toLowerCase();
      // Table doesn't exist yet — return empty list so the frontend doesn't crash.
      // Fix: run migrations/create_publications_table.sql in Supabase SQL Editor.
      if (
        error.code === "42P01" ||
        msg.includes("does not exist") ||
        msg.includes("relation") ||
        msg.includes("undefined table")
      ) {
        console.warn("[publications] Table not found — migration not yet run. Returning empty list.");
        return res.json({ publications: [] });
      }
      throw error;
    }

    res.json({ publications: data || [] });
  } catch (err) {
    next(err);
  }
});

router.post("/submit-publication", async (req, res, next) => {
  try {
    const {
      first_author,
      co_authors,
      department,
      institution,
      title,
      event_type,
      is_srl_member,
      paper_link,
      date,
      summary,
    } = req.body;

    const { data: newSubmission, error } = await supabase
      .from("publications_submissions")
      .insert([
        {
          first_author,
          co_authors: co_authors || "",
          department,
          institution,
          title,
          event_type,
          is_srl_member: is_srl_member === "yes" || is_srl_member === true,
          paper_link: paper_link || "",
          date, 
          summary,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({ detail: error.message });
    }

    res.json({ data: newSubmission });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
