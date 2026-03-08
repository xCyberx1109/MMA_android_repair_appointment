const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {

    // Authorization: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(token, "secret123");

    req.user = verified;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token"
    });

  }

};
