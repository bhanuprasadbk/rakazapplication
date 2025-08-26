const db = require('../config/db');

module.exports = {
    // Get all users with related data
    getAllUsers: (callback) => {
        const query = `
            SELECT u.*, 
                   r.name as role_name,
                   c.organization_name as customer_name
            FROM tbl_users u
            LEFT JOIN tbl_roles r ON u.role_id = r.id
            LEFT JOIN tbl_customer_admins c ON u.customer_id = c.id
            ORDER BY u.name
        `;
        db.query(query, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get user by ID with related data
    getUserById: (id, callback) => {
        const query = `
            SELECT u.*, 
                   r.name as role_name,
                   c.organization_name as customer_name
            FROM tbl_users u
            LEFT JOIN tbl_roles r ON u.role_id = r.id
            LEFT JOIN tbl_customer_admins c ON u.customer_id = c.id
            WHERE u.id = ?
        `;
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Get user by email
    getUserByEmail: (email, callback) => {
        const query = 'SELECT * FROM tbl_users WHERE email = ?';
        db.query(query, [email], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Get user by username
    getUserByUsername: (username, callback) => {
        const query = 'SELECT * FROM tbl_users WHERE username = ?';
        db.query(query, [username], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Get users by role
    getUsersByRole: (roleId, callback) => {
        const query = `
            SELECT u.*, 
                   r.name as role_name,
                   c.organization_name as customer_name
            FROM tbl_users u
            LEFT JOIN tbl_roles r ON u.role_id = r.id
            LEFT JOIN tbl_customer_admins c ON u.customer_id = c.id
            WHERE u.role_id = ?
            ORDER BY u.name
        `;
        db.query(query, [roleId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get users by customer
    getUsersByCustomer: (customerId, callback) => {
        const query = `
            SELECT u.*, 
                   r.name as role_name,
                   c.organization_name as customer_name
            FROM tbl_users u
            LEFT JOIN tbl_roles r ON u.role_id = r.id
            LEFT JOIN tbl_customer_admins c ON u.customer_id = c.id
            WHERE u.customer_id = ?
            ORDER BY u.name
        `;
        db.query(query, [customerId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Create new user
    createUser: (userData, callback) => {
        const query = `
            INSERT INTO tbl_users (
                name, email, username, password_hash, role_id, customer_id, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            userData.name,
            userData.email,
            userData.username,
            userData.password_hash,
            userData.role_id,
            userData.customer_id,
            userData.is_active !== undefined ? userData.is_active : 1
        ];
        
        db.query(query, values, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Update user
    updateUser: (id, userData, callback) => {
        const query = `
            UPDATE tbl_users SET 
                name = ?, email = ?, username = ?, password_hash = ?, 
                role_id = ?, customer_id = ?, is_active = ?
            WHERE id = ?
        `;
        const values = [
            userData.name,
            userData.email,
            userData.username,
            userData.password_hash,
            userData.role_id,
            userData.customer_id,
            userData.is_active,
            id
        ];
        
        db.query(query, values, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Delete user
    deleteUser: (id, callback) => {
        const query = 'DELETE FROM tbl_users WHERE id = ?';
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Update user status
    updateUserStatus: (id, isActive, callback) => {
        const query = 'UPDATE tbl_users SET is_active = ? WHERE id = ?';
        db.query(query, [isActive, id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    }
}; 