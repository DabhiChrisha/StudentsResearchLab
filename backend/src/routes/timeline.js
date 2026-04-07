const express = require('express');
const supabase = require('../supabase');

const router = express.Router();

router.get('/timeline', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('timeline_entries')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;