const reportsModel = require('../models/reports.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {

    getDeviceReport: async (req, res) => {
        try {
            reportsModel.getDeviceReport(req.body, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching device report:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching device report',
                        error: error.message
                    });
                }
                successlog.info('Device report fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Device report fetched successfully',
                    result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getDeviceReport:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    getCustomerAdminReport: async (req, res) => {
        try {
            reportsModel.getCustomerAdminReport(req.body, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching customer admin report:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching customer admin report',
                        error: error.message
                    });
                }
                successlog.info('Customer admin report fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Customer admin report fetched successfully',
                    result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getCustomerAdminReport:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}