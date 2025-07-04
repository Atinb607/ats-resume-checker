import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if Authorization header is present
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // 2. Check if it starts with "Bearer "
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Invalid authorization format" });
  }

  // 3. Extract token
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next(); // Proceed to next middleware or route
  } catch (err) {
    console.error("JWT Error:", err.message); // Optional: for debugging
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};