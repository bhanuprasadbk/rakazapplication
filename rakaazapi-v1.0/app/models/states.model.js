const db = require('../config/db');

module.exports = {
    // Get all states
    getAllStates: (callback) => {
        const query = 'SELECT * FROM tbl_states ORDER BY name';
        db.query(query, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get states by country
    getStatesByCountry: (countryId, callback) => {
        const query = 'SELECT * FROM tbl_states WHERE country_id = ? ORDER BY name';
        db.query(query, [countryId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get state by ID
    getStateById: (id, callback) => {
        const query = 'SELECT * FROM tbl_states WHERE id = ?';
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Create new state
    createState: (stateData, callback) => {
        const query = 'INSERT INTO tbl_states (name, country_id) VALUES (?, ?)';
        db.query(query, [stateData.name, stateData.country_id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Update state
    updateState: (id, stateData, callback) => {
        const query = 'UPDATE tbl_states SET name = ?, country_id = ? WHERE id = ?';
        db.query(query, [stateData.name, stateData.country_id, id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Delete state
    deleteState: (id, callback) => {
        const query = 'DELETE FROM tbl_states WHERE id = ?';
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    }
}; 