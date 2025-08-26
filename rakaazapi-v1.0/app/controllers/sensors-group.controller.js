const sensorsModel = require('../models/sensors-group.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all sensor groups
    getAllSensorGroups: async (req, res) => {
        try {
            sensorsModel.getAllSensorGroups((error, results) => {
                if (error) {
                    errorlog.error('Error fetching sensor groups:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensor groups',
                        error: error.message
                    });
                }
                successlog.info('Sensor groups fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Sensor groups fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllSensorGroups:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get sensor group by ID
    getSensorGroupById: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group ID is required'
                });
            }

            sensorsModel.getSensorGroupById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching sensor group by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensor group',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Sensor group not found'
                    });
                }

                successlog.info(`Sensor group fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor group fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSensorGroupById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get sensor groups by type
    getSensorGroupsByType: async (req, res) => {
        try {
            const { sensor_type } = req.params;
            
            if (!sensor_type) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group type is required'
                });
            }

            sensorsModel.getSensorGroupsByType(sensor_type, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching sensor groups by type:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensor groups by type',
                        error: error.message
                    });
                }
                successlog.info(`Sensor groups fetched for type: ${sensor_type}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor groups fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSensorGroupsByType:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get sensor groups by status
    getSensorGroupsByStatus: async (req, res) => {
        try {
            const { status } = req.params;
            
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group status is required'
                });
            }

            sensorsModel.getSensorGroupsByStatus(status, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching sensor groups by status:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensor groups by status',
                        error: error.message
                    });
                }
                successlog.info(`Sensor groups fetched for status: ${status}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor groups fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSensorGroupsByStatus:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new sensor group
    createSensorGroup: async (req, res) => {
        try {
            const {
                sensor_group_name,
                sensor_type, status, created_by, parameters
            } = req.body;
            
            if (!sensor_type || !created_by) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group type and created_by are required'
                });
            }

            const sensorData = {
                sensor_group_name,
                sensor_type,
                status: status || 'active',
                created_by
            };

            // If parameters are provided, create sensor with parameters
            if (parameters && Array.isArray(parameters)) {
                sensorsModel.createSensorGroupWithParameters(sensorData, parameters, (error, result) => {
                    if (error) {
                        errorlog.error('Error creating sensor group with parameters:', error);
                        return res.status(500).json({
                            success: false,
                            message: 'Error creating sensor group with parameters',
                            error: error.message
                        });
                    }
                    successlog.info(`Sensor group created with ID: ${result.sensorId} and parameters`);
                    return res.status(201).json({
                        success: true,
                        message: 'Sensor group created successfully with parameters',
                        data: {
                            id: result.sensorId,
                            ...sensorData,
                            parameters: parameters
                        }
                    });
                });
            } else {
                // Create sensor without parameters
                sensorsModel.createSensorGroup(sensorData, (error, insertId) => {
                    if (error) {
                        errorlog.error('Error creating sensor group:', error);
                        return res.status(500).json({
                            success: false,
                            message: 'Error creating sensor group',
                            error: error.message
                        });
                    }
                    successlog.info(`Sensor group created with ID: ${insertId}`);
                    return res.status(201).json({
                        success: true,
                        message: 'Sensor group created successfully',
                        data: { id: insertId, ...sensorData, parameters: [] }
                    });
                });
            }
        } catch (error) {
            errorlog.error('Exception in createSensorGroup:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update sensor group
    updateSensorGroup: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                sensor_type, status, modified_by, sensor_group_name, parameters
            } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group ID is required'
                });
            }

            if (!sensor_type || !modified_by) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group type and modified_by are required'
                });
            }

            const sensorData = {
                sensor_group_name,
                sensor_type,
                status: status || 'active',
                modified_by
            };

            // If parameters are provided, update sensor with parameters
            if (parameters && Array.isArray(parameters)) {
                sensorsModel.updateSensorGroupWithParameters(id, sensorData, parameters, (error, result) => {
                    if (error) {
                        errorlog.error('Error updating sensor group with parameters:', error);
                        return res.status(500).json({
                            success: false,
                            message: 'Error updating sensor group with parameters',
                            error: error.message
                        });
                    }
                    
                    if (!result.updated) {
                        return res.status(404).json({
                            success: false,
                            message: 'Sensor group not found'
                        });
                    }

                    successlog.info(`Sensor group updated with ID: ${id} and parameters`);
                    return res.status(200).json({
                        success: true,
                        message: 'Sensor group updated successfully with parameters',
                        data: {
                            id: parseInt(id),
                            ...sensorData,
                            parameters: parameters
                        }
                    });
                });
            } else {
                // Update sensor without parameters
                sensorsModel.updateSensorGroup(id, sensorData, (error, updated) => {
                    if (error) {
                        errorlog.error('Error updating sensor group:', error);
                        return res.status(500).json({
                            success: false,
                            message: 'Error updating sensor group',
                            error: error.message
                        });
                    }
                    
                    if (!updated) {
                        return res.status(404).json({
                            success: false,
                            message: 'Sensor group not found'
                        });
                    }

                    successlog.info(`Sensor group updated with ID: ${id}`);
                    return res.status(200).json({
                        success: true,
                        message: 'Sensor group updated successfully',
                        data: { id: parseInt(id), ...sensorData, parameters: [] }
                    });
                });
            }
        } catch (error) {
            errorlog.error('Exception in updateSensorGroup:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete sensor group
    deleteSensorGroup: async (req, res) => {
        try {
            const { id } = req.params;
            const { modified_by } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group ID is required'
                });
            }

            if (!modified_by) {
                return res.status(400).json({
                    success: false,
                    message: 'modified_by is required'
                });
            }

            sensorsModel.deleteSensorGroup(id, modified_by, (error, deleted) => {
                if (error) {
                    errorlog.error('Error deleting sensor group:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting sensor group',
                        error: error.message
                    });
                }
                
                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'Sensor group not found'
                    });
                }

                successlog.info(`Sensor group deleted with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor group deleted successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteSensorGroup:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update sensor group status
    updateSensorGroupStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, modified_by } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group ID is required'
                });
            }

            if (!status || !modified_by) {
                return res.status(400).json({
                    success: false,
                    message: 'Status and modified_by are required'
                });
            }

            sensorsModel.updateSensorGroupStatus(id, status, modified_by, (error, updated) => {
                if (error) {
                        errorlog.error('Error updating sensor group status:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating sensor group status',
                        error: error.message
                    });
                }
                
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'Sensor group not found'
                    });
                }

                successlog.info(`Sensor group status updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor group status updated successfully',
                    data: { id: parseInt(id), status, modified_by }
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateSensorGroupStatus:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}; 