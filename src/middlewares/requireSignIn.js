// requireSignIn.js (Middleware)
import jwt from "jsonwebtoken";
export async function requireSignIn(req) {
  try {
    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader) return null;

    const token = authorizationHeader.startsWith("Bearer ") ? authorizationHeader.split(" ")[1] : authorizationHeader;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { id: decoded.id, email: decoded.email };
  } catch (error) {
    console.error("Authentication Error:", error);
    return null;
  }
}