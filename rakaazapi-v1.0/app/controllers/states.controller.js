const statesModel = require('../models/states.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all states
    getAllStates: async (req, res) => {
        try {
            statesModel.getAllStates((error, results) => {
                if (error) {
                    errorlog.error('Error fetching states:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching states',
                        error: error.message
                    });
                }
                successlog.info('States fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'States fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllStates:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get states by country
    getStatesByCountry: async (req, res) => {
        try {
            const { countryId } = req.params;
            
            if (!countryId) {
                return res.status(400).json({
                    success: false,
                    message: 'Country ID is required'
                });
            }

            statesModel.getStatesByCountry(countryId, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching states by country:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching states by country',
                        error: error.message
                    });
                }
                successlog.info(`States fetched for country: ${countryId}`);
                return res.status(200).json({
                    success: true,
                    message: 'States fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getStatesByCountry:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get state by ID
    getStateById: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'State ID is required'
                });
            }

            statesModel.getStateById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching state by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching state',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'State not found'
                    });
                }

                successlog.info(`State fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'State fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getStateById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new state
    createState: async (req, res) => {
        try {
            const { name, country_id } = req.body;
            
            if (!name || !country_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and country_id are required'
                });
            }

            const stateData = { name, country_id };
            
            statesModel.createState(stateData, (error, insertId) => {
                if (error) {
                    errorlog.error('Error creating state:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error creating state',
                        error: error.message
                    });
                }
                successlog.info(`State created with ID: ${insertId}`);
                return res.status(201).json({
                    success: true,
                    message: 'State created successfully',
                    data: { id: insertId, ...stateData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in createState:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update state
    updateState: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, country_id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'State ID is required'
                });
            }

            if (!name || !country_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and country_id are required'
                });
            }

            const stateData = { name, country_id };
            
            statesModel.updateState(id, stateData, (error, updated) => {
                if (error) {
                    errorlog.error('Error updating state:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating state',
                        error: error.message
                    });
                }
                
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'State not found'
                    });
                }

                successlog.info(`State updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'State updated successfully',
                    data: { id, ...stateData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateState:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete state
    deleteState: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'State ID is required'
                });
            }

            statesModel.deleteState(id, (error, deleted) => {
                if (error) {
                    errorlog.error('Error deleting state:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting state',
                        error: error.message
                    });
                }
                
                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'State not found'
                    });
                }

                successlog.info(`State deleted with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'State deleted successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteState:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}; 