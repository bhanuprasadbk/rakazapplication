const citiesModel = require('../models/cities.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all cities
    getAllCities: async (req, res) => {
        try {
            citiesModel.getAllCities((error, results) => {
                if (error) {
                    errorlog.error('Error fetching cities:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching cities',
                        error: error.message
                    });
                }
                successlog.info('Cities fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Cities fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllCities:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get cities by state
    getCitiesByState: async (req, res) => {
        try {
            const { stateId } = req.params;
            
            if (!stateId) {
                return res.status(400).json({
                    success: false,
                    message: 'State ID is required'
                });
            }

            citiesModel.getCitiesByState(stateId, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching cities by state:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching cities by state',
                        error: error.message
                    });
                }
                successlog.info(`Cities fetched for state ${stateId}`);
                return res.status(200).json({
                    success: true,
                    message: 'Cities fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getCitiesByState:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get city by ID
    getCityById: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'City ID is required'
                });
            }

            citiesModel.getCityById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching city by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching city',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'City not found'
                    });
                }

                successlog.info(`City fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'City fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getCityById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new city
    createCity: async (req, res) => {
        try {
            const { name, state_id } = req.body;
            
            if (!name || !state_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and state_id are required'
                });
            }

            const cityData = { name, state_id };
            
            citiesModel.createCity(cityData, (error, insertId) => {
                if (error) {
                    errorlog.error('Error creating city:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error creating city',
                        error: error.message
                    });
                }
                successlog.info(`City created with ID: ${insertId}`);
                return res.status(201).json({
                    success: true,
                    message: 'City created successfully',
                    data: { id: insertId, ...cityData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in createCity:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update city
    updateCity: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, state_id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'City ID is required'
                });
            }

            if (!name || !state_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and state_id are required'
                });
            }

            const cityData = { name, state_id };
            
            citiesModel.updateCity(id, cityData, (error, updated) => {
                if (error) {
                    errorlog.error('Error updating city:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating city',
                        error: error.message
                    });
                }
                
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'City not found'
                    });
                }

                successlog.info(`City updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'City updated successfully',
                    data: { id, ...cityData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateCity:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete city
    deleteCity: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'City ID is required'
                });
            }

            citiesModel.deleteCity(id, (error, deleted) => {
                if (error) {
                    errorlog.error('Error deleting city:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting city',
                        error: error.message
                    });
                }
                
                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'City not found'
                    });
                }

                successlog.info(`City deleted with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'City deleted successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteCity:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}; 