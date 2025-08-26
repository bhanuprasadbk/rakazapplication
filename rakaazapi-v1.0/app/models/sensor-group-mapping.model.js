const db = require('../config/db');

module.exports = {
    // Get all sensor group mappings
    getAllSensorGroupMappings: (callback) => {
        const query = `
            SELECT sgm.*, 
                   s.sensortype as sensor_type_name,
                   sg.group_name as sensor_group_name,
                   c.customer_name,
                   d.device_name
            FROM tbl_sensor_group_mapping sgm
            LEFT JOIN tbl_sensors s ON sgm.sensor_type = s.id
            LEFT JOIN tbl_sensor_group sg ON sgm.sensor_group = sg.id
            LEFT JOIN tbl_customer c ON sgm.customer_id = c.id
            LEFT JOIN tbl_devices d ON sgm.device_id = d.id
            WHERE sgm.is_deleted = 0
            ORDER BY sgm.created_on DESC
        `;
        db.query(query, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get sensor group mapping by ID
    getSensorGroupMappingById: (id, callback) => {
        const query = `
            SELECT sgm.*, 
                   s.sensortype as sensor_type_name,
                   sg.group_name as sensor_group_name,
                   c.customer_name,
                   d.device_name
            FROM tbl_sensor_group_mapping sgm
            LEFT JOIN tbl_sensors s ON sgm.sensor_type = s.id
            LEFT JOIN tbl_sensor_group sg ON sgm.sensor_group = sg.id
            LEFT JOIN tbl_customer c ON sgm.customer_id = c.id
            LEFT JOIN tbl_devices d ON sgm.device_id = d.id
            WHERE sgm.id = ? AND sgm.is_deleted = 0
        `;
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            
            if (results.length === 0) {
                return callback(null, null);
            }
            
            return callback(null, results[0]);
        });
    },

    // Get sensor group mappings by customer ID
    getSensorGroupMappingsByCustomer: (customerId, callback) => {
        const query = `
            SELECT sgm.*, 
                   s.sensortype as sensor_type_name,
                   sg.group_name as sensor_group_name,
                   c.customer_name,
                   d.device_name
            FROM tbl_sensor_group_mapping sgm
            LEFT JOIN tbl_sensors s ON sgm.sensor_type = s.id
            LEFT JOIN tbl_sensor_group sg ON sgm.sensor_group = sg.id
            LEFT JOIN tbl_customer c ON sgm.customer_id = c.id
            LEFT JOIN tbl_devices d ON sgm.device_id = d.id
            WHERE sgm.customer_id = ? AND sgm.is_deleted = 0
            ORDER BY sgm.created_on DESC
        `;
        db.query(query, [customerId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get sensor group mappings by device ID
    getSensorGroupMappingsByDevice: (deviceId, callback) => {
        const query = `
            SELECT sgm.*, 
                   s.sensortype as sensor_type_name,
                   sg.group_name as sensor_group_name,
                   c.customer_name,
                   d.device_name
            FROM tbl_sensor_group_mapping sgm
            LEFT JOIN tbl_sensors s ON sgm.sensor_type = s.id
            LEFT JOIN tbl_sensor_group sg ON sgm.sensor_group = sg.id
            LEFT JOIN tbl_customer c ON sgm.customer_id = c.id
            LEFT JOIN tbl_devices d ON sgm.device_id = d.id
            WHERE sgm.device_id = ? AND sgm.is_deleted = 0
            ORDER BY sgm.created_on DESC
        `;
        db.query(query, [deviceId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get sensor group mappings by sensor group ID
    getSensorGroupMappingsBySensorGroup: (sensorGroupId, callback) => {
        const query = `
            SELECT sgm.*, 
                   s.sensortype as sensor_type_name,
                   sg.group_name as sensor_group_name,
                   c.customer_name,
                   d.device_name
            FROM tbl_sensor_group_mapping sgm
            LEFT JOIN tbl_sensors s ON sgm.sensor_type = s.id
            LEFT JOIN tbl_sensor_group sg ON sgm.sensor_group = sg.id
            LEFT JOIN tbl_customer c ON sgm.customer_id = c.id
            LEFT JOIN tbl_devices d ON sgm.device_id = d.id
            WHERE sgm.sensor_group = ? AND sgm.is_deleted = 0
            ORDER BY sgm.created_on DESC
        `;
        db.query(query, [sensorGroupId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get sensor group mappings by status
    getSensorGroupMappingsByStatus: (status, callback) => {
        const query = `
            SELECT sgm.*, 
                   s.sensortype as sensor_type_name,
                   sg.group_name as sensor_group_name,
                   c.customer_name,
                   d.device_name
            FROM tbl_sensor_group_mapping sgm
            LEFT JOIN tbl_sensors s ON sgm.sensor_type = s.id
            LEFT JOIN tbl_sensor_group sg ON sgm.sensor_group = sg.id
            LEFT JOIN tbl_customer c ON sgm.customer_id = c.id
            LEFT JOIN tbl_devices d ON sgm.device_id = d.id
            WHERE sgm.status = ? AND sgm.is_deleted = 0
            ORDER BY sgm.created_on DESC
        `;
        db.query(query, [status], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Create new sensor group mapping
    createSensorGroupMapping: (data, callback) => {
        const query = `
            INSERT INTO tbl_sensor_group_mapping 
            (sensor_type, sensor_group, customer_id, device_id, status, created_by, created_on)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const values = [
            data.sensor_type,
            data.sensor_group,
            data.customer_id,
            data.device_id,
            data.status || 'active',
            data.created_by
        ];
        
        db.query(query, values, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Update sensor group mapping
    updateSensorGroupMapping: (id, data, callback) => {
        const query = `
            UPDATE tbl_sensor_group_mapping 
            SET sensor_type = ?, 
                sensor_group = ?, 
                customer_id = ?, 
                device_id = ?, 
                status = ?, 
                modified_by = ?, 
                modified_on = NOW()
            WHERE id = ? AND is_deleted = 0
        `;
        const values = [
            data.sensor_type,
            data.sensor_group,
            data.customer_id,
            data.device_id,
            data.status,
            data.modified_by,
            id
        ];
        
        db.query(query, values, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Update sensor group mapping status
    updateSensorGroupMappingStatus: (id, status, modifiedBy, callback) => {
        const query = `
            UPDATE tbl_sensor_group_mapping 
            SET status = ?, modified_by = ?, modified_on = NOW()
            WHERE id = ? AND is_deleted = 0
        `;
        
        db.query(query, [status, modifiedBy, id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Soft delete sensor group mapping
    deleteSensorGroupMapping: (id, deletedBy, callback) => {
        const query = `
            UPDATE tbl_sensor_group_mapping 
            SET is_deleted = 1, modified_by = ?, modified_on = NOW()
            WHERE id = ? AND is_deleted = 0
        `;
        
        db.query(query, [deletedBy, id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Check if mapping already exists for the same combination
    checkMappingExists: (sensorType, sensorGroup, customerId, deviceId, callback) => {
        const query = `
            SELECT id FROM tbl_sensor_group_mapping 
            WHERE sensor_type = ? AND sensor_group = ? AND customer_id = ? AND device_id = ? AND is_deleted = 0
        `;
        
        db.query(query, [sensorType, sensorGroup, customerId, deviceId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.length > 0);
        });
    },

    // Check if sensor group is already mapped to any other customer
    checkSensorGroupCustomerMapping: (sensorGroup, customerId, callback) => {
        const query = `
            SELECT id, customer_id, device_id FROM tbl_sensor_group_mapping 
            WHERE sensor_group = ? AND customer_id != ? AND is_deleted = 0
        `;
        
        db.query(query, [sensorGroup, customerId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Check if sensor group is already mapped to any customer (for global validation)
    checkSensorGroupAnyCustomerMapping: (sensorGroup, callback) => {
        const query = `
            SELECT id, customer_id, device_id FROM tbl_sensor_group_mapping 
            WHERE sensor_group = ? AND is_deleted = 0
        `;
        
        db.query(query, [sensorGroup], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Check if sensor group is available for mapping to a specific customer
    checkSensorGroupAvailability: (sensorGroup, customerId, callback) => {
        const query = `
            SELECT 
                CASE 
                    WHEN COUNT(*) = 0 THEN 'available'
                    WHEN COUNT(*) > 0 AND customer_id = ? THEN 'mapped_to_same_customer'
                    ELSE 'mapped_to_other_customer'
                END as status,
                GROUP_CONCAT(DISTINCT customer_id) as mapped_customers
            FROM tbl_sensor_group_mapping 
            WHERE sensor_group = ? AND is_deleted = 0
        `;
        
        db.query(query, [customerId, sensorGroup], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    }
};
