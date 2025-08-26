const devicesModel = require('../models/devices.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all devices
    getAllDevices: async (req, res) => {
        try {
            devicesModel.getAllDevices(req.body, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching devices:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching devices',
                        error: error.message
                    });
                }
                successlog.info('Devices fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Devices fetched successfully',
                    results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllDevices:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get device by ID
    getDeviceById: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Device ID is required'
                });
            }

            devicesModel.getDeviceById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching device by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching device',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Device not found'
                    });
                }

                successlog.info(`Device fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Device fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getDeviceById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get devices by sensor type
    getDevicesBySensorType: async (req, res) => {
        try {
            const { sensortype } = req.params;
            
            if (!sensortype) {
                return res.status(400).json({
                    success: false,
                    message: 'Sensor type is required'
                });
            }

            devicesModel.getDevicesBySensorType(sensortype, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching devices by sensor type:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching devices by sensor type',
                        error: error.message
                    });
                }

                successlog.info(`Devices fetched by sensor type: ${sensortype}`);
                return res.status(200).json({
                    success: true,
                    message: 'Devices fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getDevicesBySensorType:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get devices by status
    getDevicesByStatus: async (req, res) => {
        try {
            const { status } = req.params;
            
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            // Validate status
            const validStatuses = ['Active', 'InActive'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be either "Active" or "InActive"'
                });
            }

            devicesModel.getDevicesByStatus(status, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching devices by status:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching devices by status',
                        error: error.message
                    });
                }

                successlog.info(`Devices fetched by status: ${status}`);
                return res.status(200).json({
                    success: true,
                    message: 'Devices fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getDevicesByStatus:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get device by deviceId
    getDeviceByDeviceId: async (req, res) => {
        try {
            const { deviceId } = req.params;
            
            if (!deviceId) {
                return res.status(400).json({
                    success: false,
                    message: 'Device ID is required'
                });
            }

            devicesModel.getDeviceByDeviceId(deviceId, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching device by deviceId:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching device',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Device not found'
                    });
                }

                successlog.info(`Device fetched with deviceId: ${deviceId}`);
                return res.status(200).json({
                    success: true,
                    message: 'Device fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getDeviceByDeviceId:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new device
    createDevice: async (req, res) => {
        try {
            const {
                deviceId,
                sensortype,
                sensorparameters,
                devicename,
                devicemake,
                devicemodel,
                status
            } = req.body;

            // Validation
            if (!deviceId || !sensortype || !devicemake || !devicemodel) {
                return res.status(400).json({
                    success: false,
                    message: 'deviceId, sensortype, devicemake, and devicemodel are required'
                });
            }

            // Check if deviceId already exists
            devicesModel.checkDeviceIdExists(deviceId, null, (error, exists) => {
                if (error) {
                    errorlog.error('Error checking deviceId existence:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error checking device ID',
                        error: error.message
                    });
                }

                if (exists) {
                    return res.status(400).json({
                        success: false,
                        message: 'Device ID already exists'
                    });
                }

                // Create device
                const deviceData = {
                    deviceId,
                    devicename,
                    sensortype,
                    sensorparameters: sensorparameters || '',
                    devicemake,
                    devicemodel,
                    status: status || 'Active',
                    created_by: req.user.id || req.user.userId
                };

                devicesModel.createDevice(deviceData, (error, result) => {
                    if (error) {
                        errorlog.error('Error creating device:', error);
                        return res.status(500).json({
                            success: false,
                            message: 'Error creating device',
                            error: error.message
                        });
                    }

                    successlog.info(`Device created with ID: ${result}`);
                    return res.status(201).json({
                        success: true,
                        message: 'Device created successfully',
                        data: { id: result }
                    });
                });
            });
        } catch (error) {
            errorlog.error('Exception in createDevice:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update device
    updateDevice: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                deviceId,
                devicename,
                sensortype,
                sensorparameters,
                devicemake,
                devicemodel,
                status
            } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Device ID is required'
                });
            }

            // Check if device exists
            devicesModel.getDeviceById(id, (error, existingDevice) => {
                if (error) {
                    errorlog.error('Error checking device existence:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error checking device',
                        error: error.message
                    });
                }

                if (!existingDevice) {
                    return res.status(404).json({
                        success: false,
                        message: 'Device not found'
                    });
                }

                // Check if deviceId already exists (if being updated)
                if (deviceId && deviceId !== existingDevice.deviceId) {
                    devicesModel.checkDeviceIdExists(deviceId, id, (error, exists) => {
                        if (error) {
                            errorlog.error('Error checking deviceId existence:', error);
                            return res.status(500).json({
                                success: false,
                                message: 'Error checking device ID',
                                error: error.message
                            });
                        }

                        if (exists) {
                            return res.status(400).json({
                                success: false,
                                message: 'Device ID already exists'
                            });
                        }

                        // Update device
                        updateDeviceData();
                    });
                } else {
                    // Update device
                    updateDeviceData();
                }

                function updateDeviceData() {
                    const deviceData = {
                        deviceId: deviceId || existingDevice.deviceId,
                        devicename: devicename || existingDevice.devicename,
                        sensortype: sensortype || existingDevice.sensortype,
                        sensorparameters: sensorparameters !== undefined ? sensorparameters : existingDevice.sensorparameters,
                        devicemake: devicemake || existingDevice.devicemake,
                        devicemodel: devicemodel || existingDevice.devicemodel,
                        status: status || existingDevice.status,
                        modified_by: req.user.id || req.user.userId
                    };

                    devicesModel.updateDevice(id, deviceData, (error, result) => {
                        if (error) {
                            errorlog.error('Error updating device:', error);
                            return res.status(500).json({
                                success: false,
                                message: 'Error updating device',
                                error: error.message
                            });
                        }

                        successlog.info(`Device updated with ID: ${id}`);
                        return res.status(200).json({
                            success: true,
                            message: 'Device updated successfully'
                        });
                    });
                }
            });
        } catch (error) {
            errorlog.error('Exception in updateDevice:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete device
    deleteDevice: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Device ID is required'
                });
            }

            devicesModel.deleteDevice(id, req.user.id || req.user.userId, (error, result) => {
                if (error) {
                    errorlog.error('Error deleting device:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting device',
                        error: error.message
                    });
                }

                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Device not found'
                    });
                }

                successlog.info(`Device deleted with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Device deleted successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteDevice:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update device status
    updateDeviceStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Device ID is required'
                });
            }

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            // Validate status
            const validStatuses = ['Active', 'InActive'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be either "Active" or "InActive"'
                });
            }

            devicesModel.updateDeviceStatus(id, status, req.user.id || req.user.userId, (error, result) => {
                if (error) {
                    errorlog.error('Error updating device status:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating device status',
                        error: error.message
                    });
                }

                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Device not found'
                    });
                }

                successlog.info(`Device status updated with ID: ${id} to ${status}`);
                return res.status(200).json({
                    success: true,
                    message: 'Device status updated successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateDeviceStatus:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Device Mapping to customer
    DeviceMappingToCustomer: async (req, res) => {
        try {           
            devicesModel.DeviceMappingToCustomer(req.body, (error, result) => {
                if (error) {
                    errorlog.error('Error mapping device to customer:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error mapping device to customer',
                        error: error.message
                    });
                }
                successlog.info(`Device mapped to customer with ID: ${result}`);
                return res.status(200).json({
                    success: true,
                    message: 'Device mapped to customer successfully'
                });
            });
        } catch (error) {   
            errorlog.error('Exception in DeviceMappingToCustomer:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Device Mapping List
    DeviceMappingList: async (req, res) => {
        try {
            devicesModel.DeviceMappingList(req.body, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching device mapping list:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching device mapping list',
                        error: error.message
                    });
                }
                successlog.info('Device mapping list fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Device mapping list fetched successfully',
                    result: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in DeviceMappingList:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Device Mapping List By Customer ID
    DeviceMappingListByCustomerId: async (req, res) => {
        try {
            devicesModel.DeviceMappingListByCustomerId(req.params.customer_id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching device mapping list by customer ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching device mapping list by customer ID',
                        error: error.message
                    });
                }
                successlog.info('Device mapping list by customer ID fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Device mapping list by customer ID fetched successfully',
                    result: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in DeviceMappingListByCustomerId:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};
