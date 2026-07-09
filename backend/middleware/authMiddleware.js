// Library used to create and verify JSON Web Tokens (JWT)
const jwt = require("jsonwebtoken");

// =====================================
// JWT Authentication Middleware
// Protects private routes by verifying
// the user's authentication token
// =====================================
const authenticateToken = (req, res, next) => {

    // Read Authorization header from the incoming request
    const authHeader = req.headers["authorization"];

    // Check whether Authorization header is present
    if (!authHeader) {

        return res.status(401).json({

            message: "Access Denied"

        });

    }

    // Extract JWT token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Ensure token exists
    if (!token) {

        return res.status(401).json({

            message: "Token Missing"

        });

    }

    // Verify JWT using the secret key
    jwt.verify(

        token,

        process.env.JWT_SECRET,

        (err, user) => {

            // Token is invalid or expired
            if (err) {

                return res.status(403).json({

                    message: "Invalid Token"

                });

            }

            // Store authenticated user information for later use
            req.user = user;

            // Pass control to the next middleware or route handler
            next();

        }

    );

};

module.exports = authenticateToken;