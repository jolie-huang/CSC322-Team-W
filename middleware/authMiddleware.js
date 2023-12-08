const jwt = require("jsonwebtoken");

// Middleware for authenticating user using JSON Web Token (JWT)
module.exports = (req, res, next) => {
  try {
    // Check if the Authorization header is present in the request
    if (!req.headers.authorization) {
      // If not present, respond with Unauthorized status and message
      return res.status(401).send("Unauthorized!");
    }
    // Extract the userId from the JWT token in the Authorization header
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.jwtSecret
    );
    // Attach the userId to the request object for future use in route handlers
    req.userId = userId;
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send("Unauthorized!");
  }
};
