
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userRoles = req.user.roles || [""];
    
    // Check if user has at least one role from allowedRoles
    const hasRole = userRoles.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: "Insufficient role: Please reach out to Admin or Owner" });
    }
    next();
  };
};