const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "admin-secret-key-change-in-production";

/**
 * Middleware to verify admin authentication
 * Checks for valid JWT token in Authorization header
 * In development mode, allows bypass with x-dev-token header
 */
const adminAuthMiddleware = (req, res, next) => {
  try {
    // Development mode bypass (if not explicitly production)
    const isProduction = process.env.NODE_ENV === "production";
    const isDev = !isProduction;
    
    if (isDev && req.headers["x-dev-token"] === "dev-bypass") {
      req.admin = {
        email: "adminsrl@gmail.com",
        enrollmentNo: "Admin@SRL",
        name: "Admin",
        isAdmin: true,
      };
      console.log("[AUTH] Development bypass activated");
      return next();
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Missing or invalid authorization header",
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if token is valid and user is admin
    if (!decoded.isAdmin || !decoded.email) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Admin access required",
      });
    }

    // Attach user info to request
    req.admin = {
      email: decoded.email,
      enrollmentNo: decoded.enrollmentNo,
      name: decoded.name,
      isAdmin: decoded.isAdmin,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  adminAuthMiddleware,
  JWT_SECRET,
};
