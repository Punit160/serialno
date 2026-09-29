import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) return res.status(401).json({ message: "No token Provided" });

    if (!bearerHeader.startsWith("Bearer ")) 
      return res.status(403).json({ message: "Invalid token format" });

    const token = bearerHeader.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    res.status(403).json({ message: "Invalid or expired Token" });
  }
};
