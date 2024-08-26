const jwt = require("jsonwebtoken");
const UserDoctor = require("../models/UserDoctor");

const verifyCanEditUser = async (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    let userId;
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Token is not valid");
      userId = user.id;
    });

    const user = await UserDoctor.findById(userId);

    if (!user) {
      return res.status(403).json("You are not allowed to do that");
    }

    if (!user.permission?.canEditUser) {
      return res.status(403).json("You are not allowed to do that");
    }

    return next();
  } else {
    return res.status(401).json("you're not authenticated");
  }
};

module.exports = {
  verifyCanEditUser,
};
