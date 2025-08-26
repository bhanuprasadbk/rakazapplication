const db = require('../config/db');

module.exports = {
    // Get all devices with sensor information and pagination
    getAllDevices: (body, callback) => {
        const limit = body.limit || 10;
        const page = body.page || 1;
        const offset = (page - 1) * limit;
        const search = body.search || '';

        if (isNaN(offset) || isNaN(limit) || offset < 0 || limit <= 0) {
            return callback(new Error('Invalid pagination parameters'), null);
        }

        // Build search condition
        const searchCondition = `
        WHERE (d.deviceId LIKE ? 
           OR d.devicemake LIKE ? 
           OR d.devicemodel LIKE ?
           OR d.sensorparameters LIKE ?
           OR d.status LIKE ?
           OR s.sensortype LIKE ?)
           AND d.is_deleted = 0
    `;

        const searchParams = Array(6).fill(`%${search}%`); // 6 LIKE placeholders

        const query = `
            SELECT d.*, s.sensortype as sensor_type_name
            FROM tbl_devices d
            LEFT JOIN tbl_sensors s ON d.sensortype = s.id
            ${search ? searchCondition : 'WHERE d.is_deleted = 0'}
            ORDER BY d.created_on DESC
            LIMIT ? OFFSET ?
        `;

        db.query(query, [...(search ? searchParams : []), limit, offset], (error, results) => {
            if (error) {
                return callback(error, null);
            }

            // Count query with same search filter
            const countQuery = `
            SELECT COUNT(*) as total 
            FROM tbl_devices d
            LEFT JOIN tbl_sensors s ON d.sensortype = s.id
            ${search ? searchCondition : 'WHERE d.is_deleted = 0'}
        `;

            db.query(countQuery, search ? searchParams : [], (countErr, countResults) => {
                if (countErr) {
                    return callback(countErr, null);
                }

                const total = countResults[0].total;
                const totalPages = Math.ceil(total / limit);

                return callback(null, {
                    data: results,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages
                    }
                });
            });
        });
    },

    // Get device by ID with sensor information
    getDeviceById: (id, callback) => {
        const query = `
            SELECT d.*, s.sensortype as sensor_type_name
            FROM tbl_devices d
            LEFT JOIN tbl_sensors s ON d.sensortype = s.id
            WHERE d.id = ? AND d.is_deleted = 0
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

    // Get devices by sensor type
    getDevicesBySensorType: (sensorType, callback) => {
        const query = `
            SELECT d.*, s.sensortype as sensor_type_name
            FROM tbl_devices d
            LEFT JOIN tbl_sensors s ON d.sensortype = s.id
            WHERE d.sensortype = ? AND d.is_deleted = 0
            ORDER BY d.created_on DESC
        `;
        db.query(query, [sensorType], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get devices by status
    getDevicesByStatus: (status, callback) => {
        const query = `
            SELECT d.*, s.sensortype as sensor_type_name
            FROM tbl_devices d
            LEFT JOIN tbl_sensors s ON d.sensortype = s.id
            WHERE d.status = ? AND d.is_deleted = 0
            ORDER BY d.created_on DESC
        `;
        db.query(query, [status], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Get device by deviceId
    getDeviceByDeviceId: (deviceId, callback) => {
        const query = `
            SELECT d.*, s.sensortype as sensor_type_name
            FROM tbl_devices d
            LEFT JOIN tbl_sensors s ON d.sensortype = s.id
            WHERE d.deviceId = ? AND d.is_deleted = 0
        `;
        db.query(query, [deviceId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            
            if (results.length === 0) {
                return callback(null, null);
            }
            
            return callback(null, results[0]);
        });
    },

    // Create new device
    createDevice: (deviceData, callback) => {
        const query = `
            INSERT INTO tbl_devices (
                deviceId, devicename, sensortype, sensorparameters, devicemake, devicemodel, 
                status, created_by, created_on
            ) VALUES (?, ?, ?, ?, ?, ?,?, ?, NOW())
        `;
        const values = [
            deviceData.deviceId,
            deviceData.devicename,
            deviceData.sensortype,
            deviceData.sensorparameters,
            deviceData.devicemake,
            deviceData.devicemodel,
            deviceData.status || 'Active',
            deviceData.created_by
        ];
        
        db.query(query, values, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Update device
    updateDevice: (id, deviceData, callback) => {
        const query = `
            UPDATE tbl_devices SET 
                deviceId = ?, devicename = ?, sensortype = ?, sensorparameters = ?, devicemake = ?, 
                devicemodel = ?, status = ?, modified_by = ?, modified_on = NOW()
            WHERE id = ? AND is_deleted = 0
        `;
        const values = [
            deviceData.deviceId,
            deviceData.devicename,
            deviceData.sensortype,
            deviceData.sensorparameters,
            deviceData.devicemake,
            deviceData.devicemodel,
            deviceData.status,
            deviceData.modified_by,
            id
        ];
        
        db.query(query, values, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Delete device (soft delete)
    deleteDevice: (id, modifiedBy, callback) => {
        const query = `
            UPDATE tbl_devices SET 
                is_deleted = 1, modified_by = ?, modified_on = NOW()
            WHERE id = ? AND is_deleted = 0
        `;
        db.query(query, [modifiedBy, id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Update device status
    updateDeviceStatus: (id, status, modifiedBy, callback) => {
        const query = `
            UPDATE tbl_devices SET 
                status = ?, modified_by = ?, modified_on = NOW()
            WHERE id = ? AND is_deleted = 0
        `;
        db.query(query, [status, modifiedBy, id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Check if deviceId already exists
    checkDeviceIdExists: (deviceId, excludeId = null, callback) => {
        let query = `
            SELECT COUNT(*) as count
            FROM tbl_devices 
            WHERE deviceId = ? AND is_deleted = 0
        `;
        let values = [deviceId];

        if (excludeId) {
            query += ' AND id != ?';
            values.push(excludeId);
        }

        db.query(query, values, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0].count > 0);
        });
    },


    /* Start Device Mapping to customer */

    DeviceMappingToCustomer: (body, callback) => {
        const { device_ids, customer_id } = body; // device_ids is an array
    
        if (!Array.isArray(device_ids) || device_ids.length === 0) {
            return callback(new Error('No devices provided'), null);
        }
    
        const placeholders = device_ids.map(() => '?').join(',');
    
        // Step 1: Check if devices are already assigned
        const checkQuery = `
            SELECT id, deviceId
            FROM tbl_devices 
            WHERE id IN (${placeholders}) 
            AND customeradmin IS NOT NULL
        `;
    
        db.query(checkQuery, device_ids, (checkError, assignedDevices) => {
            if (checkError) {
                return callback(checkError, null);
            }
    
            if (assignedDevices.length > 0) {
                const alreadyAssignedIds = assignedDevices.map(d => d.deviceId);
                return callback(
                    new Error(`Devices already mapped: ${alreadyAssignedIds.join(', ')}`),
                    null
                );
            }
    
            // Step 2: Update only if not already assigned
            const updateQuery = `
                UPDATE tbl_devices 
                SET customeradmin = ? 
                WHERE id IN (${placeholders})
            `;
    
            const values = [customer_id, ...device_ids];
    
            db.query(updateQuery, values, (updateError, results) => {
                if (updateError) {
                    return callback(updateError, null);
                }
                return callback(null, results.affectedRows > 0);
            });
        });
    },
    DeviceMappingList: (body, callback) => {
        const limit = body.limit || 10;
        const page = body.page || 1;
        const offset = (page - 1) * limit;
        const search = body.search || '';
    
        if (isNaN(offset) || isNaN(limit) || offset < 0 || limit <= 0) {
            return callback(new Error('Invalid pagination parameters'), null);
        }
    
        const searchTerm = `%${search}%`;
    
        const dataQuery = `
            SELECT 
                c.customer_admin_name,c.id,
                COUNT(*) AS device_count
            FROM tbl_devices d
            LEFT JOIN tbl_customer_admins c 
                ON d.customeradmin = c.id
            WHERE d.is_deleted = 0 
              AND c.customer_admin_name LIKE ?
            GROUP BY d.customeradmin, c.customer_admin_name
            ORDER BY MAX(d.created_on) DESC
            LIMIT ? OFFSET ?;
        `;
    
        const countQuery = `
            SELECT COUNT(*) AS total_count
            FROM (
                SELECT d.customeradmin
                FROM tbl_devices d
                LEFT JOIN tbl_customer_admins c 
                    ON d.customeradmin = c.id
                WHERE d.is_deleted = 0 
                  AND c.customer_admin_name LIKE ?
                GROUP BY d.customeradmin
            ) AS grouped;
        `;
    
        db.query(dataQuery, [searchTerm, limit, offset], (error, results) => {
            if (error) return callback(error, null);
    
            db.query(countQuery, [searchTerm], (countError, countResult) => {
                if (countError) return callback(countError, null);
    
                return callback(null, {
                    data: results,
                    total_count: countResult[0].total_count
                });
            });
        });
    },

    DeviceMappingListByCustomerId: (customer_id, callback) => {
        const query = `
            SELECT 
    s.id AS sensor_id,
    s.sensortype,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', d.id,
            'device_id',d.deviceId,
            'device_name', d.deviceName,
            'device_make', d.devicemake,
            'device_model', d.devicemodel,
            'sensortype',d.sensortype,
            'customer_name', c.customer_admin_name
        )
    ) AS devices,
    JSON_ARRAYAGG(
        JSON_OBJECT(
	    'sensortype',sp.sensor_id,
            'parameter', sp.sensorParameter,
            'unit', sp.unit,
            'min_threshold', sp.min_threshold_limit,
            'max_threshold', sp.max_threshold_limit,
            'index_start', sp.index_start,
            'index_end', sp.index_end
        )
    ) AS parameters
FROM tbl_sensors s
JOIN tbl_devices d 
    ON FIND_IN_SET(s.id, d.sensortype) > 0
JOIN tbl_customer_admins c 
    ON d.customeradmin = c.id
JOIN tbl_sensor_parameters sp
    ON sp.sensor_id = s.id
WHERE d.is_deleted = 0
AND c.id = ? -- Pass customer ID if needed
GROUP BY s.id
ORDER BY s.id
        `;
        db.query(query, [customer_id], (error, results) => {
            if (error) return callback(error, null);
            return callback(null, {data: results});
        });
    },

    /* End Device Mapping to customer */
    
};
