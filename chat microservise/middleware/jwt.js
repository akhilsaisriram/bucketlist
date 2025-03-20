const JWT = require("jsonwebtoken");

// router level middleware function
const jwtAuth = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.header('Authorization');
    console.log(authHeader);
    
    if (!authHeader ) {
      return res.status(400).json({ success: false, message: "NOT authorized" });
    }
  
    // Extract the actual token from the Bearer token
    const token = authHeader;
  
    try {
      // Verify the token and extract the payload
      const payload = JWT.verify(token, 'jwtSecret');
      req.user = payload.user; // Attach the user object to req.user
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
    
    // Call the next middleware in the stack
    next();
  };
  
  module.exports = jwtAuth;
  

module.exports = jwtAuth;
