// auth, isOwner, isTenant

const jwt = require('jsonwebtoken');
require('dotenv').config();


// Authentication middleware
exports.auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if Authorization header exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token is missing'
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            // Store user information in request
            req.user = payload;

        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        next();

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while verifying the token!',
            error: err.message
        });
    }
};


// Owner authorization middleware
exports.isOwner = async (req, res, next) => {
    try {
        if (req.user.role !== 'owner') {
            return res.status(403).json({
                success: false,
                message: 'Access denied, only owner can access this route!'
            });
        }

        next();

    } catch (err) {
        return res.status(403).json({
            success: false,
            message: 'Your role does not match the required role!',
            error: err.message
        });
    }
};


// Tenant authorization middleware
exports.isTenant = async (req, res, next) => {
    try {
        if (req.user.role !== 'tenant') {
            return res.status(403).json({
                success: false,
                message: 'Access denied, only tenant can access this route!'
            });
        }

        next();

    } catch (err) {
        return res.status(403).json({
            success: false,
            message: 'Your role does not match the required role!',
            error: err.message
        });
    }
};