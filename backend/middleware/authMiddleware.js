const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {

    const verified = jwt.verify(token, "secret123");

    req.user = verified;

    next();

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }

};
