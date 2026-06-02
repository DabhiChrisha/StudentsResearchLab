let app;
let startupError;

try {
  app = require("../src/index");
} catch (error) {
  startupError = error;
  console.error("[Vercel startup error]", error);
}

module.exports = (req, res) => {
  if (startupError) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({
      error: "Backend startup failed",
      name: startupError.name,
      message: startupError.message,
    }));
  }

  return app(req, res);
};
