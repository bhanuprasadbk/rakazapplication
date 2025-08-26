const db = require('../config/db');

module.exports = {
    // Get all countries
    getAllCountries: (callback) => {
        const query = 'SELECT * FROM tbl_countries ORDER BY name';
        db.query(query, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get country by ID
    getCountryById: (id, callback) => {
        const query = 'SELECT * FROM tbl_countries WHERE id = ?';
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Get country by shortname
    getCountryByShortname: (shortname, callback) => {
        const query = 'SELECT * FROM tbl_countries WHERE shortname = ?';
        db.query(query, [shortname], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Create new country
    createCountry: (countryData, callback) => {
        const query = 'INSERT INTO tbl_countries (shortname, name, phonecode) VALUES (?, ?, ?)';
        db.query(query, [countryData.shortname, countryData.name, countryData.phonecode], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Update country
    updateCountry: (id, countryData, callback) => {
        const query = 'UPDATE tbl_countries SET shortname = ?, name = ?, phonecode = ? WHERE id = ?';
        db.query(query, [countryData.shortname, countryData.name, countryData.phonecode, id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Delete country
    deleteCountry: (id, callback) => {
        const query = 'DELETE FROM tbl_countries WHERE id = ?';
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    }
}; 