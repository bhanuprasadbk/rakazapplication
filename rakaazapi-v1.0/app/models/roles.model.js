const db = require('../config/db');

module.exports = {
    // Get all roles
    getAllRoles: (callback) => {
        const query = 'SELECT * FROM tbl_roles ORDER BY name';
        db.query(query, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get role by ID
    getRoleById: (id, callback) => {
        const query = 'SELECT * FROM tbl_roles WHERE id = ?';
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Get role by name
    getRoleByName: (name, callback) => {
        const query = 'SELECT * FROM tbl_roles WHERE name = ?';
        db.query(query, [name], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Create new role
    createRole: (roleData, callback) => {
        const query = 'INSERT INTO tbl_roles (name) VALUES (?)';
        db.query(query, [roleData.name], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Update role
    updateRole: (id, roleData, callback) => {
        const query = 'UPDATE tbl_roles SET name = ? WHERE id = ?';
        db.query(query, [roleData.name, id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Delete role
    deleteRole: (id, callback) => {
        const query = 'DELETE FROM tbl_roles WHERE id = ?';
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    }
}; 