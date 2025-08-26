const currenciesModel = require('../models/Currency.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get currencies
    getCurrencies: async (req, res) => {
        try {
            currenciesModel.getCurrencies((error, results) => {
                if (error) {
                    errorlog.error('Error fetching currencies:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching currencies',
                        error: error.message
                    });
                }
                successlog.info('Currencies fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Currencies fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllCurrencies:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}; 