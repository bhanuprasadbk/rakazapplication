const countriesModel = require('../models/countries.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all countries
    getAllCountries: async (req, res) => {
        try {
            countriesModel.getAllCountries((error, results) => {
                if (error) {
                    errorlog.error('Error fetching countries:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching countries',
                        error: error.message
                    });
                }
                successlog.info('Countries fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Countries fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllCountries:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get country by ID
    getCountryById: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Country ID is required'
                });
            }

            countriesModel.getCountryById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching country by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching country',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Country not found'
                    });
                }

                successlog.info(`Country fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Country fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getCountryById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get country by shortname
    getCountryByShortname: async (req, res) => {
        try {
            const { shortname } = req.params;
            
            if (!shortname) {
                return res.status(400).json({
                    success: false,
                    message: 'Country shortname is required'
                });
            }

            countriesModel.getCountryByShortname(shortname, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching country by shortname:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching country',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Country not found'
                    });
                }

                successlog.info(`Country fetched with shortname: ${shortname}`);
                return res.status(200).json({
                    success: true,
                    message: 'Country fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getCountryByShortname:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new country
    createCountry: async (req, res) => {
        try {
            const { shortname, name, phonecode } = req.body;
            
            if (!shortname || !name || !phonecode) {
                return res.status(400).json({
                    success: false,
                    message: 'Shortname, name, and phonecode are required'
                });
            }

            const countryData = { shortname, name, phonecode };
            
            countriesModel.createCountry(countryData, (error, insertId) => {
                if (error) {
                    errorlog.error('Error creating country:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error creating country',
                        error: error.message
                    });
                }
                successlog.info(`Country created with ID: ${insertId}`);
                return res.status(201).json({
                    success: true,
                    message: 'Country created successfully',
                    data: { id: insertId, ...countryData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in createCountry:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update country
    updateCountry: async (req, res) => {
        try {
            const { id } = req.params;
            const { shortname, name, phonecode } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Country ID is required'
                });
            }

            if (!shortname || !name || !phonecode) {
                return res.status(400).json({
                    success: false,
                    message: 'Shortname, name, and phonecode are required'
                });
            }

            const countryData = { shortname, name, phonecode };
            
            countriesModel.updateCountry(id, countryData, (error, updated) => {
                if (error) {
                    errorlog.error('Error updating country:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating country',
                        error: error.message
                    });
                }
                
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'Country not found'
                    });
                }

                successlog.info(`Country updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Country updated successfully',
                    data: { id, ...countryData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateCountry:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete country
    deleteCountry: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Country ID is required'
                });
            }

            countriesModel.deleteCountry(id, (error, deleted) => {
                if (error) {
                    errorlog.error('Error deleting country:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting country',
                        error: error.message
                    });
                }
                
                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'Country not found'
                    });
                }

                successlog.info(`Country deleted with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Country deleted successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteCountry:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}; 