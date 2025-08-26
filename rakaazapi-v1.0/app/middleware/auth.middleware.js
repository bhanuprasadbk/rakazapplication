const jwt = require('jsonwebtoken');
const loginModel = require('../models/login.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token is required'
        });
    }

    jwt.verify(token, process.env.SECRET_KEY || 'your-secret-key', (err, decoded) => {
        if (err) {
            errorlog.error('JWT verification failed:', err);
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Validate token against database
        const tokenData = {
            user_id: decoded.id,
            user_token: token
        };

        loginModel.validateToken(tokenData, (error, results) => {
            if (error) {
                errorlog.error('Error validating token:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Token validation error',
                    error: error.message
                });
            }

            if (results.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid token - user not found or inactive'
                });
            }

            // Add user data to request object
            req.user = {
                id: decoded.id,
                email: decoded.email,
                username: decoded.username, // Added username
                name: decoded.name,
                role_id: decoded.role_id,
                role_name: decoded.role_name,
                customer_id: decoded.customer_id,
                customer_name: decoded.customer_name,
                type: decoded.type
            };

            next();
        });
    });
};

// Role-based authorization middleware
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!allowedRoles.includes(req.user.role_name)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

// Customer authorization middleware
const authorizeCustomer = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (req.user.type !== 'customer') {
        return res.status(403).json({
            success: false,
            message: 'Customer access required'
        });
    }

    next();
};

// User authorization middleware
const authorizeUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (req.user.type !== 'user') {
        return res.status(403).json({
            success: false,
            message: 'User access required'
        });
    }

    next();
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.SECRET_KEY || 'your-secret-key', (err, decoded) => {
        if (err) {
            req.user = null;
            return next();
        }

        const tokenData = {
            user_id: decoded.id,
            user_token: token
        };

        loginModel.validateToken(tokenData, (error, results) => {
            if (error || results.length === 0) {
                req.user = null;
                return next();
            }

            req.user = {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                role_id: decoded.role_id,
                role_name: decoded.role_name,
                customer_id: decoded.customer_id,
                customer_name: decoded.customer_name,
                type: decoded.type
            };

            next();
        });
    });
};

module.exports = {
    authenticateToken,
    authorizeRole,
    authorizeCustomer,
    authorizeUser,
    optionalAuth
}; 