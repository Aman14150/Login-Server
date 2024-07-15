const UserModel = require('../models/users');
const { verifyToken } = require('../config/utils');

const authHandler = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];  // Extract token from header
        const decodedToken = verifyToken(token); // Verify token
        const user = await UserModel.findById(decodedToken.userId); // Find user by decoded token
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

const adminAuth = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    } else {
        res.status(400).json({ message: 'Unauthorized' });
    }
};

module.exports = { authHandler, adminAuth };
