const db = require('../config/db');

module.exports = {
    // Get all units
    getAllUnits: (callback) => {
        const query = 'SELECT * FROM tbl_units where is_deleted=0  ORDER BY unit_name';
        db.query(query, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get Unit by ID
    getUnitById: (id, callback) => {
        const query = 'SELECT * FROM tbl_units WHERE id = ?';
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Get unit by name
    getUnitByName: (name, callback) => {
        const query = 'SELECT * FROM tbl_units WHERE unit_name = ?';
        db.query(query, [name], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Create new unit
    createUnit: (unit, callback) => {
        const checkQuery = `
        SELECT id FROM tbl_units 
        WHERE unit_name = ? LIMIT 1
    `;

        db.query(checkQuery, [unit.unitname], (error, results) => {
            if (error) return callback(error, null);

            if (results.length > 0) {
                const existingId = results[0].id;

                // If exists, update is_delete = 0
                const updateQuery = `
                UPDATE tbl_units 
                SET is_deleted = 0 
                WHERE id = ?
            `;
                db.query(updateQuery, [unit.created_by,existingId], (err, updateResult) => {
                    if (err) return callback(err, null);
                    return callback(null, existingId); // return existing ID
                });
            } else {
                // Insert new record
                const insertQuery = `
                INSERT INTO tbl_units (unit_name, created_by) 
                VALUES (?,?)
            `;
                db.query(insertQuery, [unit.unitname,unit.created_by], (err, insertResult) => {
                    if (err) return callback(err, null);
                    return callback(null, insertResult.insertId);
                });
            }
        });
    },


    // Update unit
    updateUnit: (id, unit, callback) => {
        const query = 'UPDATE tbl_units SET unit_name = ? WHERE id = ?';
        db.query(query, [unit.unitname, id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Delete unit
    deleteUnit: (ids, callback) => {
        if (!Array.isArray(ids) || ids.length === 0) {
            return callback(new Error('Invalid or empty ID list'), null);
        }

        //const query = `DELETE FROM tbl_customer_admin_type WHERE id IN (?)`;
        const query = 'update tbl_units set is_deleted = 1 where id IN (?)';
        db.query(query, [ids], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    }

}; 