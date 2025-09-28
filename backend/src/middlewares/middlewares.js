const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const middlewares = {
  verifyToken: (req, res, next) => {
    const authHeader = req.headers.token;
    if (!authHeader) return res.status(401).json({ message: "You're not logged in" });

    const accessToken = authHeader.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: "Token is not valid" });

      req.user = user; // <-- đúng chỗ
      next();
    });
  },

  // Middleware kiểm tra quyền "user"
  verifyCRUDUser: async (req, res, next) => {
    try {
      const dbUser = await User.findById(req.user.id).select("modules");
      if (!dbUser) return res.status(404).json({ message: "User not found" });

      if (dbUser.modules.includes("all") || dbUser.modules.includes("user")) {
        return next();
      }

      return res.status(403).json({ message: "No permission to CRUD user" });
    } catch (error) {
      return res.status(500).json({ message: "Auth check failed" });
    }
  },
  // Middleware kiểm tra quyền "store"
  verifyCRUDStore: async (req, res, next) => {
    try {
      const dbUser = await User.findById(req.user.id).select("modules");
      if (!dbUser) return res.status(404).json({ message: "User not found" });

      if (dbUser.modules.includes("all") || dbUser.modules.includes("store")) {
        return next();
      }

      return res.status(403).json({ message: "No permission to CRUD user" });
    } catch (error) {
      return res.status(500).json({ message: "Auth check failed" });
    }
  }
};

module.exports = middlewares;