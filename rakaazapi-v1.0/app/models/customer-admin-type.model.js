const db = require('../config/db');

module.exports = {
    // Get all customer admin types
    getAllCustomerAdminTypes: (callback) => {
        const query = 'SELECT * FROM tbl_customer_admin_type where is_deleted=0 ORDER BY cust_admin_type';
        db.query(query, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get customer admin type by ID
    getCustomerAdminTypeById: (id, callback) => {
        const query = 'SELECT * FROM tbl_customer_admin_type WHERE id = ?';
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Get customer admin type by name
    getCustomerAdminTypeByName: (name, callback) => {
        const query = 'SELECT * FROM tbl_customer_admin_type WHERE cust_admin_type = ?';
        db.query(query, [name], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Create new customer admin type
    createCustomerAdminType: (adminTypeData, callback) => {
        const checkQuery = `
        SELECT id FROM tbl_customer_admin_type 
        WHERE cust_admin_type = ? LIMIT 1
    `;

        db.query(checkQuery, [adminTypeData.cust_admin_type], (error, results) => {
            if (error) return callback(error, null);

            if (results.length > 0) {
                const existingId = results[0].id;

                // If exists, update is_delete = 0
                const updateQuery = `
                UPDATE tbl_customer_admin_type 
                SET is_deleted = 0, created_by = ? 
                WHERE id = ?
            `;
                db.query(updateQuery, [adminTypeData.created_by, existingId], (err, updateResult) => {
                    if (err) return callback(err, null);
                    return callback(null, existingId); // return existing ID
                });
            } else {
                // Insert new record
                const insertQuery = `
                INSERT INTO tbl_customer_admin_type (cust_admin_type, created_by) 
                VALUES (?, ?)
            `;
                db.query(insertQuery, [adminTypeData.cust_admin_type, adminTypeData.created_by], (err, insertResult) => {
                    if (err) return callback(err, null);
                    return callback(null, insertResult.insertId);
                });
            }
        });
    },


    // Update customer admin type
    updateCustomerAdminType: (id, adminTypeData, callback) => {
        const query = 'UPDATE tbl_customer_admin_type SET cust_admin_type = ? WHERE id = ?';
        db.query(query, [adminTypeData.cust_admin_type, id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Delete customer admin type
    deleteCustomerAdminType: (ids, callback) => {
        if (!Array.isArray(ids) || ids.length === 0) {
            return callback(new Error('Invalid or empty ID list'), null);
        }

        //const query = `DELETE FROM tbl_customer_admin_type WHERE id IN (?)`;
        const query = 'update tbl_customer_admin_type set is_deleted = 1 where id IN (?)';
        db.query(query, [ids], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    }
}; 