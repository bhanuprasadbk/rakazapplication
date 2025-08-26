const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    // Authenticate user login
    authenticateUser: (username, password, callback) => {
        const query = `
            SELECT u.*, r.name as role_name, c.organization_name as customer_name
            FROM tbl_users u
            LEFT JOIN tbl_roles r ON u.role_id = r.id
            LEFT JOIN tbl_customer_admins c ON u.customer_id = c.id
            WHERE u.username = ? AND u.is_active = 1
        `;
        
        db.query(query, [username], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            
            if (results.length === 0) {
                return callback(null, null); // User not found
            }
            
            const user = results[0];
            
            // Compare password
            bcrypt.compare(password, user.password_hash, (err, isMatch) => {
                if (err) {
                    return callback(err, null);
                }
                
                if (!isMatch) {
                    return callback(null, null); // Invalid password
                }
                
                // Remove password from user object
                delete user.password_hash;
                return callback(null, user);
            });
        });
    },

    // Authenticate customer login
    authenticateCustomer: (username, password, callback) => {
        const query = `
            SELECT c.*, cat.cust_admin_type
            FROM tbl_customer_admins c
            LEFT JOIN tbl_customer_admin_type cat ON c.customer_admin_type = cat.id
            WHERE c.username = ?
        `;
        
        db.query(query, [username], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            
            if (results.length === 0) {
                return callback(null, null); // Customer not found
            }
            
            const customer = results[0];
            
            // Compare password (assuming password is stored as plain text for customers)
            // In production, you should hash customer passwords too
            if (customer.password !== password) {
                return callback(null, null); // Invalid password
            }
            
            // Remove password from customer object
            delete customer.password;
            return callback(null, customer);
        });
    },

    // Validate JWT token
    validateToken: (tokenData, callback) => {
        const query = `
            SELECT u.id, u.email, u.name, u.role_id, u.customer_id, u.is_active,
                   r.name as role_name, c.organization_name as customer_name
            FROM tbl_users u
            LEFT JOIN tbl_roles r ON u.role_id = r.id
            LEFT JOIN tbl_customer_admins c ON u.customer_id = c.id
            WHERE u.id = ? AND u.is_active = 1
        `;
        
        db.query(query, [tokenData.user_id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            
            if (results.length === 0) {
                return callback(null, []); // User not found or inactive
            }
            
            return callback(null, results);
        });
    },

    // Get user by ID for token validation
    getUserById: (userId, callback) => {
        const query = `
            SELECT u.id, u.email, u.name, u.role_id, u.customer_id, u.is_active,
                   r.name as role_name, c.organization_name as customer_name
            FROM tbl_users u
            LEFT JOIN tbl_roles r ON u.role_id = r.id
            LEFT JOIN tbl_customer_admins c ON u.customer_id = c.id
            WHERE u.id = ? AND u.is_active = 1
        `;
        
        db.query(query, [userId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            
            return callback(null, results[0] || null);
        });
    },

    // Hash password
    hashPassword: (password, callback) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, hash);
        });
    },

    // Update user password
    updatePassword: (userId, hashedPassword, callback) => {
        const query = 'UPDATE tbl_users SET password_hash = ? WHERE id = ?';
        db.query(query, [hashedPassword, userId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Create refresh token record (optional - for token refresh functionality)
    createRefreshToken: (userId, refreshToken, callback) => {
        const query = 'INSERT INTO user_refresh_tokens (user_id, refresh_token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))';
        db.query(query, [userId, refreshToken], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Validate refresh token
    validateRefreshToken: (refreshToken, callback) => {
        const query = 'SELECT user_id FROM user_refresh_tokens WHERE refresh_token = ? AND expires_at > NOW()';
        db.query(query, [refreshToken], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0] || null);
        });
    },

    // Delete refresh token
    deleteRefreshToken: (refreshToken, callback) => {
        const query = 'DELETE FROM user_refresh_tokens WHERE refresh_token = ?';
        db.query(query, [refreshToken], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    }
};