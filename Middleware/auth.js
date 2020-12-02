const jwt = require("jsonwebtoken");
const jwtSecret = require("../Config/db");

// Middleware parameters = (req, res, next)
function auth(req, res, next) {
  // Temporarily bypass backend auth protection until the frontend embeds a JWT in the header
  // return next();  //TODO remove this when the frontend is passing the token
  const token = req.cookies.token;

  // Check for token
  if (!token) {
    return  res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // Add from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
}

module.exports = auth;
