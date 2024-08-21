const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Token is not valid");
      if (user.userType == "doctor")
        return res.status(403).json("You are not allowed to do that");
      return next();
    });
  } else {
    return res.status(401).json("you're not authenticated");
  }
};

module.exports = {
  verifyAdmin,
};
