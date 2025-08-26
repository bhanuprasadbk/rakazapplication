const db = require('../config/db');

module.exports = {
    // Get all countries
    getCurrencies: (callback) => {
        const query = 'SELECT * FROM tbl_currency ORDER BY country';
        db.query(query, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    }
}; 