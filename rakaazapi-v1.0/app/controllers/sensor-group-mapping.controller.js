const sensorGroupMappingModel = require('../models/sensor-group-mapping.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all sensor group mappings
    getAllSensorGroupMappings: async (req, res) => {
        try {
            sensorGroupMappingModel.getAllSensorGroupMappings((error, results) => {
                if (error) {
                    errorlog.error('Error fetching sensor group mappings:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensor group mappings',
                        error: error.message
                    });
                }
                successlog.info('Sensor group mappings fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Sensor group mappings fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllSensorGroupMappings:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get sensor group mapping by ID
    getSensorGroupMappingById: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group mapping ID is required'
                });
            }

            sensorGroupMappingModel.getSensorGroupMappingById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching sensor group mapping by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensor group mapping',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Sensor group mapping not found'
                    });
                }

                successlog.info(`Sensor group mapping fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor group mapping fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSensorGroupMappingById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get sensor group mappings by customer ID
    getSensorGroupMappingsByCustomer: async (req, res) => {
        try {
            const { customerId } = req.params;
            
            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer ID is required'
                });
            }

            sensorGroupMappingModel.getSensorGroupMappingsByCustomer(customerId, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching sensor group mappings by customer:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensor group mappings by customer',
                        error: error.message
                    });
                }

                successlog.info(`Sensor group mappings fetched for customer ID: ${customerId}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor group mappings fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSensorGroupMappingsByCustomer:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get sensor group mappings by device ID
    getSensorGroupMappingsByDevice: async (req, res) => {
        try {
            const { deviceId } = req.params;
            
            if (!deviceId) {
                return res.status(400).json({
                    success: false,
                    message: 'Device ID is required'
                });
            }

            sensorGroupMappingModel.getSensorGroupMappingsByDevice(deviceId, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching sensor group mappings by device:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensor group mappings by device',
                        error: error.message
                    });
                }

                successlog.info(`Sensor group mappings fetched for device ID: ${deviceId}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor group mappings fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSensorGroupMappingsByDevice:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get sensor group mappings by sensor group ID
    getSensorGroupMappingsBySensorGroup: async (req, res) => {
        try {
            const { sensorGroupId } = req.params;
            
            if (!sensorGroupId) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group ID is required'
                });
            }

            sensorGroupMappingModel.getSensorGroupMappingsBySensorGroup(sensorGroupId, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching sensor group mappings by sensor group:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensor group mappings by sensor group',
                        error: error.message
                    });
                }

                successlog.info(`Sensor group mappings fetched for sensor group ID: ${sensorGroupId}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor group mappings fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSensorGroupMappingsBySensorGroup:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get sensor group mappings by status
    getSensorGroupMappingsByStatus: async (req, res) => {
        try {
            const { status } = req.params;
            
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            sensorGroupMappingModel.getSensorGroupMappingsByStatus(status, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching sensor group mappings by status:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching sensor group mappings by status',
                        error: error.message
                    });
                }

                successlog.info(`Sensor group mappings fetched for status: ${status}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor group mappings fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSensorGroupMappingsByStatus:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new sensor group mapping
    createSensorGroupMapping: async (req, res) => {
        try {
            const { sensor_type, sensor_group, customer_id, device_id, status } = req.body;
            const created_by = req.user ? req.user.id : req.body.created_by;

            // Validation
            if (!sensor_type || !sensor_group || !customer_id || !device_id) {
                return res.status(400).json({
                    success: false,
                    message: 'sensor_type, sensor_group, customer_id, and device_id are required'
                });
            }

            // Check if mapping already exists for the same combination
            sensorGroupMappingModel.checkMappingExists(sensor_type, sensor_group, customer_id, device_id, (error, exists) => {
                if (error) {
                    errorlog.error('Error checking mapping existence:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error creating sensor group mapping',
                        error: error.message
                    });
                }

                if (exists) {
                    return res.status(409).json({
                        success: false,
                        message: 'Sensor group mapping already exists for this combination'
                    });
                }

                // Check if sensor group is already mapped to any other customer
                sensorGroupMappingModel.checkSensorGroupCustomerMapping(sensor_group, customer_id, (customerError, existingMappings) => {
                    if (customerError) {
                        errorlog.error('Error checking sensor group customer mapping:', customerError);
                        return res.status(500).json({
                            success: false,
                            message: 'Error creating sensor group mapping',
                            error: customerError.message
                        });
                    }

                    if (existingMappings && existingMappings.length > 0) {
                        const conflictingCustomers = existingMappings.map(m => m.customer_id).join(', ');
                        return res.status(409).json({
                            success: false,
                            message: `Sensor group is already mapped to other customer(s): ${conflictingCustomers}. A sensor group can only be mapped to one customer.`
                        });
                    }

                    // Create the mapping
                    const mappingData = {
                        sensor_type,
                        sensor_group,
                        customer_id,
                        device_id,
                        status: status || 'active',
                        created_by
                    };

                    sensorGroupMappingModel.createSensorGroupMapping(mappingData, (createError, insertId) => {
                        if (createError) {
                            errorlog.error('Error creating sensor group mapping:', createError);
                            return res.status(500).json({
                                success: false,
                                message: 'Error creating sensor group mapping',
                                error: createError.message
                            });
                        }

                        successlog.info(`Sensor group mapping created with ID: ${insertId}`);
                        return res.status(201).json({
                            success: true,
                            message: 'Sensor group mapping created successfully',
                            data: { id: insertId }
                        });
                    });
                });
            });
        } catch (error) {
            errorlog.error('Exception in createSensorGroupMapping:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update sensor group mapping
    updateSensorGroupMapping: async (req, res) => {
        try {
            const { id } = req.params;
            const { sensor_type, sensor_group, customer_id, device_id, status } = req.body;
            const modified_by = req.user ? req.user.id : req.body.modified_by;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group mapping ID is required'
                });
            }

            if (!sensor_type || !sensor_group || !customer_id || !device_id) {
                return res.status(400).json({
                    success: false,
                    message: 'sensor_type, sensor_group, customer_id, and device_id are required'
                });
            }

            // Check if sensor group is already mapped to any other customer (excluding current mapping)
            sensorGroupMappingModel.checkSensorGroupCustomerMapping(sensor_group, customer_id, (customerError, existingMappings) => {
                if (customerError) {
                    errorlog.error('Error checking sensor group customer mapping:', customerError);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating sensor group mapping',
                        error: customerError.message
                    });
                }

                if (existingMappings && existingMappings.length > 0) {
                    const conflictingCustomers = existingMappings.map(m => m.customer_id).join(', ');
                    return res.status(409).json({
                        success: false,
                        message: `Sensor group is already mapped to other customer(s): ${conflictingCustomers}. A sensor group can only be mapped to one customer.`
                    });
                }

                const updateData = {
                    sensor_type,
                    sensor_group,
                    customer_id,
                    device_id,
                    status: status || 'active',
                    modified_by
                };

                sensorGroupMappingModel.updateSensorGroupMapping(id, updateData, (error, updated) => {
                    if (error) {
                        errorlog.error('Error updating sensor group mapping:', error);
                        return res.status(500).json({
                            success: false,
                            message: 'Error updating sensor group mapping',
                            error: error.message
                        });
                    }

                    if (!updated) {
                        return res.status(404).json({
                            success: false,
                            message: 'Sensor group mapping not found or could not be updated'
                        });
                    }

                    successlog.info(`Sensor group mapping updated with ID: ${id}`);
                    return res.status(200).json({
                        success: true,
                        message: 'Sensor group mapping updated successfully'
                    });
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateSensorGroupMapping:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update sensor group mapping status
    updateSensorGroupMappingStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const modified_by = req.user ? req.user.id : req.body.modified_by;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group mapping ID is required'
                });
            }

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            sensorGroupMappingModel.updateSensorGroupMappingStatus(id, status, modified_by, (error, updated) => {
                if (error) {
                    errorlog.error('Error updating sensor group mapping status:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating sensor group mapping status',
                        error: error.message
                    });
                }

                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'Sensor group mapping not found or could not be updated'
                    });
                }

                successlog.info(`Sensor group mapping status updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor group mapping status updated successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateSensorGroupMappingStatus:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete sensor group mapping (soft delete)
    deleteSensorGroupMapping: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted_by = req.user ? req.user.id : req.body.deleted_by;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group mapping ID is required'
                });
            }

            sensorGroupMappingModel.deleteSensorGroupMapping(id, deleted_by, (error, deleted) => {
                if (error) {
                    errorlog.error('Error deleting sensor group mapping:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting sensor group mapping',
                        error: error.message
                    });
                }

                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'Sensor group mapping not found or could not be deleted'
                    });
                }

                successlog.info(`Sensor group mapping deleted with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Sensor group mapping deleted successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteSensorGroupMapping:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Check sensor group availability for mapping
    checkSensorGroupAvailability: async (req, res) => {
        try {
            const { sensorGroupId, customerId } = req.params;
            
            if (!sensorGroupId || !customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor group ID and customer ID are required'
                });
            }

            sensorGroupMappingModel.checkSensorGroupAvailability(sensorGroupId, customerId, (error, result) => {
                if (error) {
                    errorlog.error('Error checking sensor group availability:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error checking sensor group availability',
                        error: error.message
                    });
                }

                let message = '';
                let available = false;

                switch (result.status) {
                    case 'available':
                        message = 'Sensor group is available for mapping';
                        available = true;
                        break;
                    case 'mapped_to_same_customer':
                        message = 'Sensor group is already mapped to this customer';
                        available = false;
                        break;
                    case 'mapped_to_other_customer':
                        message = `Sensor group is already mapped to other customer(s): ${result.mapped_customers}`;
                        available = false;
                        break;
                    default:
                        message = 'Unknown status';
                        available = false;
                }

                successlog.info(`Sensor group availability checked for sensor group ID: ${sensorGroupId} and customer ID: ${customerId}`);
                return res.status(200).json({
                    success: true,
                    message: message,
                    data: {
                        sensor_group_id: parseInt(sensorGroupId),
                        customer_id: parseInt(customerId),
                        available: available,
                        status: result.status,
                        mapped_customers: result.mapped_customers ? result.mapped_customers.split(',') : []
                    }
                });
            });
        } catch (error) {
            errorlog.error('Exception in checkSensorGroupAvailability:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};
