import User from "../models/user.model.js"
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // console.log("Token received:", token); // Server data throughput testing
      
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded JWT:", decoded);  // Server data throughput testing


      req.user = await User.findById(decoded.id).select("-password");
      // console.log("User found:", req.user);  // Server data throughput testing

       if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      console.log("✅ Authenticated user:", req.user);
      return next();
    } catch (error) {
      console.error("Token verfication failed: ", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  return res.status(401).json({ message: "Not authorized, token failed" });
};