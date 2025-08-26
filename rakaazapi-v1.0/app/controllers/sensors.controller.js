const sensorsModel = require('../models/sensors.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all sensors
    getAllSensors: async (req, res) => {
        try {
            sensorsModel.getAllSensors((error, results) => {
                if (error) {
                    errorlog.error('Error fetching sensors:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensors',
                        error: error.message
                    });
                }
                successlog.info('Sensors fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Sensors fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllSensors:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get sensor by ID
    getSensorById: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor ID is required'
                });
            }

            sensorsModel.getSensorById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching sensor by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensor',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Sensor not found'
                    });
                }

                successlog.info(`Sensor fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSensorById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get sensors by type
    getSensorsByType: async (req, res) => {
        try {
            const { sensortype } = req.params;
            
            if (!sensortype) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor type is required'
                });
            }

            sensorsModel.getSensorsByType(sensortype, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching sensors by type:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensors by type',
                        error: error.message
                    });
                }
                successlog.info(`Sensors fetched for type: ${sensortype}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensors fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSensorsByType:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get sensors by status
    getSensorsByStatus: async (req, res) => {
        try {
            const { status } = req.params;
            
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor status is required'
                });
            }

            sensorsModel.getSensorsByStatus(status, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching sensors by status:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensors by status',
                        error: error.message
                    });
                }
                successlog.info(`Sensors fetched for status: ${status}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensors fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSensorsByStatus:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new sensor
    createSensor: async (req, res) => {
        try {
            const {
                sensortype, status, created_by, parameters
            } = req.body;
            
            if (!sensortype || !created_by) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor type and created_by are required'
                });
            }

            const sensorData = {
                sensortype,
                status: status || 'active',
                created_by
            };

            // If parameters are provided, create sensor with parameters
            if (parameters && Array.isArray(parameters)) {
                sensorsModel.createSensorWithParameters(sensorData, parameters, (error, result) => {
                    if (error) {
                        errorlog.error('Error creating sensor with parameters:', error);
                        return res.status(500).json({
                            success: false,
                            message: 'Error creating sensor with parameters',
                            error: error.message
                        });
                    }
                    successlog.info(`Sensor created with ID: ${result.sensorId} and parameters`);
                    return res.status(201).json({
                        success: true,
                        message: 'Sensor created successfully with parameters',
                        data: {
                            id: result.sensorId,
                            ...sensorData,
                            parameters: parameters
                        }
                    });
                });
            } else {
                // Create sensor without parameters
                sensorsModel.createSensor(sensorData, (error, insertId) => {
                    if (error) {
                        errorlog.error('Error creating sensor:', error);
                        return res.status(500).json({
                            success: false,
                            message: 'Error creating sensor',
                            error: error.message
                        });
                    }
                    successlog.info(`Sensor created with ID: ${insertId}`);
                    return res.status(201).json({
                        success: true,
                        message: 'Sensor created successfully',
                        data: { id: insertId, ...sensorData, parameters: [] }
                    });
                });
            }
        } catch (error) {
            errorlog.error('Exception in createSensor:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update sensor
    updateSensor: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                sensortype, status, modified_by, parameters
            } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor ID is required'
                });
            }

            if (!sensortype || !modified_by) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor type and modified_by are required'
                });
            }

            const sensorData = {
                sensortype,
                status: status || 'active',
                modified_by
            };

            // If parameters are provided, update sensor with parameters
            if (parameters && Array.isArray(parameters)) {
                sensorsModel.updateSensorWithParameters(id, sensorData, parameters, (error, result) => {
                    if (error) {
                        errorlog.error('Error updating sensor with parameters:', error);
                        return res.status(500).json({
                            success: false,
                            message: 'Error updating sensor with parameters',
                            error: error.message
                        });
                    }
                    
                    if (!result.updated) {
                        return res.status(404).json({
                            success: false,
                            message: 'Sensor not found'
                        });
                    }

                    successlog.info(`Sensor updated with ID: ${id} and parameters`);
                    return res.status(200).json({
                        success: true,
                        message: 'Sensor updated successfully with parameters',
                        data: {
                            id: parseInt(id),
                            ...sensorData,
                            parameters: parameters
                        }
                    });
                });
            } else {
                // Update sensor without parameters
                sensorsModel.updateSensor(id, sensorData, (error, updated) => {
                    if (error) {
                        errorlog.error('Error updating sensor:', error);
                        return res.status(500).json({
                            success: false,
                            message: 'Error updating sensor',
                            error: error.message
                        });
                    }
                    
                    if (!updated) {
                        return res.status(404).json({
                            success: false,
                            message: 'Sensor not found'
                        });
                    }

                    successlog.info(`Sensor updated with ID: ${id}`);
                    return res.status(200).json({
                        success: true,
                        message: 'Sensor updated successfully',
                        data: { id: parseInt(id), ...sensorData, parameters: [] }
                    });
                });
            }
        } catch (error) {
            errorlog.error('Exception in updateSensor:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete sensor
    deleteSensor: async (req, res) => {
        try {
            const { id } = req.params;
            const { modified_by } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor ID is required'
                });
            }

            if (!modified_by) {
                return res.status(400).json({
                    success: false,
                    message: 'modified_by is required'
                });
            }

            sensorsModel.deleteSensor(id, modified_by, (error, deleted) => {
                if (error) {
                    errorlog.error('Error deleting sensor:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting sensor',
                        error: error.message
                    });
                }
                
                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'Sensor not found'
                    });
                }

                successlog.info(`Sensor deleted with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor deleted successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteSensor:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update sensor status
    updateSensorStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, modified_by } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor ID is required'
                });
            }

            if (!status || !modified_by) {
                return res.status(400).json({
                    success: false,
                    message: 'Status and modified_by are required'
                });
            }

            sensorsModel.updateSensorStatus(id, status, modified_by, (error, updated) => {
                if (error) {
                    errorlog.error('Error updating sensor status:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating sensor status',
                        error: error.message
                    });
                }
                
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'Sensor not found'
                    });
                }

                successlog.info(`Sensor status updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor status updated successfully',
                    data: { id: parseInt(id), status, modified_by }
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateSensorStatus:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}; 