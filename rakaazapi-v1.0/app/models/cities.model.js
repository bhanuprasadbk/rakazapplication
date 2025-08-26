const db = require('../config/db');

module.exports = {
    // Get all cities
    getAllCities: (callback) => {
        const query = 'SELECT * FROM tbl_cities ORDER BY name';
        db.query(query, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get cities by state
    getCitiesByState: (stateId, callback) => {
        const query = 'SELECT * FROM tbl_cities WHERE state_id = ? ORDER BY name';
        db.query(query, [stateId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get city by ID
    getCityById: (id, callback) => {
        const query = 'SELECT * FROM tbl_cities WHERE id = ?';
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Create new city
    createCity: (cityData, callback) => {
        const query = 'INSERT INTO tbl_cities (name, state_id) VALUES (?, ?)';
        db.query(query, [cityData.name, cityData.state_id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Update city
    updateCity: (id, cityData, callback) => {
        const query = 'UPDATE tbl_cities SET name = ?, state_id = ? WHERE id = ?';
        db.query(query, [cityData.name, cityData.state_id, id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Delete city
    deleteCity: (id, callback) => {
        const query = 'DELETE FROM tbl_cities WHERE id = ?';
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    }
}; 