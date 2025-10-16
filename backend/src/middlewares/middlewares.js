const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const userModel = require('../Models/userModel');

const middlewares = {
  verifyToken: async (req, res, next) => {
    try {
      const header =  req.headers.token;
      if (!header) return res.status(401).json({ message: "You're not logged in" });

      // Hỗ trợ cả "Bearer xxx" hoặc raw token
      const accessToken = header.split(" ")[1];

      // verify (sync) để dùng try/catch
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);

      // Tìm user và lấy các field cần so sánh
      const user = await User.findById(decoded.id).select("token isActive modules");
      if (!user) return res.status(404).json({ message: "User not found" });

      // So sánh với token lưu trong DB
      if (!user.token || user.token !== accessToken) {
        return res.status(403).json({ message: "Token mismatch or expired" });
      }

      if (user.isActive === false) {
        return res.status(403).json({ message: "Account is disabled" });
      }

      // Gắn thông tin vào req để middleware sau dùng
      req.user = { id: decoded.id };
      return next();
    } catch (err) {
      return res.status(403).json({ message: "Token is not valid" });
    }
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
  verifyCRUDAdmin: async (req, res, next) => {
    try {
      const dbUser = await User.findById(req.user.id).select("modules");
      if (!dbUser) return res.status(404).json({ message: "User not found" });

      if (dbUser.modules.includes("all")) {
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
  },
  verifyCRUDProduct: async (req, res, next) => {
    try {
      const dbUser = await User.findById(req.user.id).select("modules");
      if (!dbUser) return res.status(404).json({ message: "User not found" });

      if (dbUser.modules.includes("all") || dbUser.modules.includes("product")) {
        return next();
      }

      return res.status(403).json({ message: "No permission to CRUD user" });
    } catch (error) {
      return res.status(500).json({ message: "Auth check failed" });
    }
  },
  verifyCRUDCate: async (req, res, next) => {
    try {
      const dbUser = await User.findById(req.user.id).select("modules");
      if (!dbUser) return res.status(404).json({ message: "User not found" });

      if (dbUser.modules.includes("all") || dbUser.modules.includes("category")) {
        return next();
      }

      return res.status(403).json({ message: "No permission to CRUD user" });
    } catch (error) {
      return res.status(500).json({ message: "Auth check failed" });
    }
  }
};

module.exports = middlewares;