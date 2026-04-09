const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env"), override: true });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (SUPABASE_URL === 'https://placeholder.supabase.co' || SUPABASE_KEY === 'placeholder') {
  console.warn(
    "⚠️ Supabase credentials missing. Using placeholders to prevent crash. " +
    "Ensure SUPABASE_URL and SUPABASE_KEY are set in the backend/.env file."
  );
}


const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
