const jwt = require('jsonwebtoken');
const secretKey = 'my-secret-key';

const authMiddleware = async (req, res, next) => {
    try {
        const raw_token = req.headers.authorization;
        if (!raw_token || !raw_token.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, msg: 'Unauthorized: Missing or invalid token' });
        }

        const token = raw_token.substring(8, raw_token.length-1); // Remove 'Bearer ' prefix
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach the user object to the request for later use
        next(); // Call the next middleware or route handler
    } catch (error) {
        res.status(401).json({ success: false, msg: 'Unauthorized: Invalid token' });
    }
};  

module.exports = authMiddleware;