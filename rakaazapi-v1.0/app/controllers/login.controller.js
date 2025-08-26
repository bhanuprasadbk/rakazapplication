const loginModel = require('../models/login.model');
const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;
const bcrypt = require('bcryptjs');

module.exports = {
    // User login
    userLogin: async (req, res) => {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username and password are required'
                });
            }

            loginModel.authenticateUser(username, password, (error, user) => {
                if (error) {
                    errorlog.error('Error in user authentication:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Authentication error',
                        error: error.message
                    });
                }

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid username or password'
                    });
                }

                // Generate JWT token
                const tokenPayload = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    role_id: user.role_id,
                    role_name: user.role_name,
                    customer_id: user.customer_id,
                    customer_name: user.customer_name,
                    type: 'user'
                };

                const token = jwt.sign(tokenPayload, process.env.SECRET_KEY || 'your-secret-key', {
                    expiresIn: '24h'
                });

                // Generate refresh token
                const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET_KEY || 'refresh-secret-key', {
                    expiresIn: '7d'
                });

                successlog.info(`User logged in successfully: ${username}`);
                return res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    data: {
                        user: {
                            id: user.id,
                            name: user.name,
                            username: user.username,
                            email: user.email,
                            role_name: user.role_name,
                            customer_name: user.customer_name
                        },
                        token: token,
                        refreshToken: refreshToken,
                        expiresIn: '24h'
                    }
                });
            });
        } catch (error) {
            errorlog.error('Exception in userLogin:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Customer login
    customerLogin: async (req, res) => {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username and password are required'
                });
            }

            loginModel.authenticateCustomer(username, password, (error, customer) => {
                if (error) {
                    errorlog.error('Error in customer authentication:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Authentication error',
                        error: error.message
                    });
                }

                if (!customer) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid username or password'
                    });
                }

                // Generate JWT token
                const tokenPayload = {
                    id: customer.id,
                    username: customer.username,
                    email: customer.email,
                    organization_name: customer.organization_name,
                    customer_admin_name: customer.customer_admin_name,
                    customer_admin_type: customer.cust_admin_type,
                    type: 'customer'
                };

                const token = jwt.sign(tokenPayload, process.env.SECRET_KEY || 'your-secret-key', {
                    expiresIn: '24h'
                });

                // Generate refresh token
                const refreshToken = jwt.sign({ id: customer.id }, process.env.REFRESH_SECRET_KEY || 'refresh-secret-key', {
                    expiresIn: '7d'
                });

                successlog.info(`Customer logged in successfully: ${username}`);
                return res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    data: {
                        customer: {
                            id: customer.id,
                            organization_name: customer.organization_name,
                            customer_admin_name: customer.customer_admin_name,
                            username: customer.username,
                            email: customer.email,
                            cust_admin_type: customer.cust_admin_type
                        },
                        token: token,
                        refreshToken: refreshToken,
                        expiresIn: '24h'
                    }
                });
            });
        } catch (error) {
            errorlog.error('Exception in customerLogin:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Refresh token
    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body;
            
            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token is required'
                });
            }

            jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY || 'refresh-secret-key', (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid refresh token'
                    });
                }

                // Get user data
                loginModel.getUserById(decoded.id, (error, user) => {
                    if (error) {
                        errorlog.error('Error getting user for refresh token:', error);
                        return res.status(500).json({
                            success: false,
                            message: 'Error refreshing token',
                            error: error.message
                        });
                    }

                    if (!user) {
                        return res.status(401).json({
                            success: false,
                            message: 'User not found'
                        });
                    }

                    // Generate new access token
                    const tokenPayload = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        name: user.name,
                        role_id: user.role_id,
                        role_name: user.role_name,
                        customer_id: user.customer_id,
                        customer_name: user.customer_name,
                        type: 'user'
                    };

                    const newToken = jwt.sign(tokenPayload, process.env.SECRET_KEY || 'your-secret-key', {
                        expiresIn: '24h'
                    });

                    successlog.info(`Token refreshed for user: ${user.username}`);
                    return res.status(200).json({
                        success: true,
                        message: 'Token refreshed successfully',
                        data: {
                            token: newToken,
                            expiresIn: '24h'
                        }
                    });
                });
            });
        } catch (error) {
            errorlog.error('Exception in refreshToken:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Change password
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id; // From JWT middleware
            
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password and new password are required'
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'New password must be at least 6 characters long'
                });
            }

            // Get current user to verify current password
            loginModel.getUserById(userId, (error, user) => {
                if (error) {
                    errorlog.error('Error getting user for password change:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error changing password',
                        error: error.message
                    });
                }

                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                // Verify current password
                bcrypt.compare(currentPassword, user.password_hash, (err, isMatch) => {
                    if (err) {
                        errorlog.error('Error comparing passwords:', err);
                        return res.status(500).json({
                            success: false,
                            message: 'Error changing password',
                            error: err.message
                        });
                    }

                    if (!isMatch) {
                        return res.status(401).json({
                            success: false,
                            message: 'Current password is incorrect'
                        });
                    }

                    // Hash new password
                    loginModel.hashPassword(newPassword, (hashError, hashedPassword) => {
                        if (hashError) {
                            errorlog.error('Error hashing new password:', hashError);
                            return res.status(500).json({
                                success: false,
                                message: 'Error changing password',
                                error: hashError.message
                            });
                        }

                        // Update password
                        loginModel.updatePassword(userId, hashedPassword, (updateError, updated) => {
                            if (updateError) {
                                errorlog.error('Error updating password:', updateError);
                                return res.status(500).json({
                                    success: false,
                                    message: 'Error changing password',
                                    error: updateError.message
                                });
                            }

                            successlog.info(`Password changed for user: ${user.user}`);
                            return res.status(200).json({
                                success: true,
                                message: 'Password changed successfully'
                            });
                        });
                    });
                });
            });
        } catch (error) {
            errorlog.error('Exception in changePassword:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Logout
    logout: async (req, res) => {
        try {
            const { refreshToken } = req.body;
            
            if (refreshToken) {
                // Delete refresh token from database
                loginModel.deleteRefreshToken(refreshToken, (error, deleted) => {
                    if (error) {
                        errorlog.error('Error deleting refresh token:', error);
                    }
                });
            }

            successlog.info(`User logged out: ${req.user?.username || 'unknown'}`);
            return res.status(200).json({
                success: true,
                message: 'Logout successful'
            });
        } catch (error) {
            errorlog.error('Exception in logout:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get current user profile
    getProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            
            loginModel.getUserById(userId, (error, user) => {
                if (error) {
                    errorlog.error('Error getting user profile:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error getting profile',
                        error: error.message
                    });
                }

                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: 'Profile retrieved successfully',
                    data: {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        role_name: user.role_name,
                        customer_name: user.customer_name
                    }
                });
            });
        } catch (error) {
            errorlog.error('Exception in getProfile:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};