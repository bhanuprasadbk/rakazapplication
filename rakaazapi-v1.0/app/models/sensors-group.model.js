const db = require('../config/db');

module.exports = {
    // Get all sensors with parameters
    getAllSensorGroups: (callback) => {
        const query = `
            SELECT s.*, 
                   GROUP_CONCAT(
                       JSON_OBJECT(
                           'id', sp.id,
                           'sensor_group_id', sp.sensor_group_id,
                           'sensor_parameter_name',sep.sensorParameter,
                           'sensor_parameter', sp.sensor_parameter,
                           'unit', sp.unit,
                           'min_threshold_limit', sp.min_threshold_limit,
                           'max_threshold_limit', sp.max_threshold_limit
                       )
                   ) as parameters
            FROM tbl_sensor_group s
            LEFT JOIN tbl_sensor_group_parameters sp ON s.id = sp.sensor_group_id
            LEFT JOIN tbl_sensor_parameters sep ON sp.sensor_parameter = sep.id
            WHERE s.is_deleted = 0
            GROUP BY s.id
            ORDER BY s.created_on DESC
        `;
        db.query(query, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            
            // Parse parameters JSON for each sensor
            results.forEach(sensor => {
                if (sensor.parameters) {
                    sensor.parameters = JSON.parse(`[${sensor.parameters}]`);
                } else {
                    sensor.parameters = [];
                }
            });
            
            return callback(null, results);
        });
    },

    // Get sensor by ID with parameters
    getSensorById: (id, callback) => {
        const query = `
            SELECT s.*, 
                   GROUP_CONCAT(
                       JSON_OBJECT(
                           'id', sp.id,
                           'sensor_group_id', sp.sensor_group_id,
                           'sensor_parameter_name',sep.sensorParameter,
                           'sensor_parameter', sp.sensor_parameter,
                           'unit', sp.unit,
                           'min_threshold_limit', sp.min_threshold_limit,
                           'max_threshold_limit', sp.max_threshold_limit
                       )
                   ) as parameters
            FROM tbl_sensor_group s
            LEFT JOIN tbl_sensor_group_parameters sp ON s.id = sp.sensor_group_id
            LEFT JOIN tbl_sensor_parameters sep ON sp.sensor_parameter = sep.id
            WHERE s.id = ? AND s.is_deleted = 0
            GROUP BY s.id
        `;
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            
            if (results.length === 0) {
                return callback(null, null);
            }
            
            const sensor = results[0];
            if (sensor.parameters) {
                sensor.parameters = JSON.parse(`[${sensor.parameters}]`);
            } else {
                sensor.parameters = [];
            }
            
            return callback(null, sensor);
        });
    },

    // Get sensors by type
    getSensorsByType: (sensorType, callback) => {
        const query = `
            SELECT s.*, 
                   GROUP_CONCAT(
                       JSON_OBJECT(
                           'id', sp.id,
                           'sensor_group_id', sp.sensor_group_id,
                           'sensor_parameter_name',sep.sensorParameter,
                           'sensor_parameter', sp.sensor_parameter,
                           'unit', sp.unit,
                           'min_threshold_limit', sp.min_threshold_limit,
                           'max_threshold_limit', sp.max_threshold_limit
                       )
                   ) as parameters
            FROM tbl_sensor_group s
            LEFT JOIN tbl_sensor_group_parameters sp ON s.id = sp.sensor_group_id
            LEFT JOIN tbl_sensor_parameters sep ON sp.sensor_parameter = sep.id
            WHERE s.sensortype = ? AND s.is_deleted = 0
            GROUP BY s.id
            ORDER BY s.created_on DESC
        `;
        db.query(query, [sensorType], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            
            // Parse parameters JSON for each sensor
            results.forEach(sensor => {
                if (sensor.parameters) {
                    sensor.parameters = JSON.parse(`[${sensor.parameters}]`);
                } else {
                    sensor.parameters = [];
                }
            });
            
            return callback(null, results);
        });
    },

    // Get sensors by status
    getSensorsByStatus: (status, callback) => {
        const query = `
            SELECT s.*, 
                   GROUP_CONCAT(
                       JSON_OBJECT(
                           'id', sp.id,
                           'sensor_group_id', sp.sensor_group_id,
                           'sensor_parameter_name',sep.sensorParameter,
                           'sensor_parameter', sp.sensor_parameter,
                           'unit', sp.unit,
                           'min_threshold_limit', sp.min_threshold_limit,
                           'max_threshold_limit', sp.max_threshold_limit
                       )
                   ) as parameters
            FROM tbl_sensor_group s
            LEFT JOIN tbl_sensor_group_parameters sp ON s.id = sp.sensor_group_id
            LEFT JOIN tbl_sensor_parameters sep ON sp.sensor_parameter = sep.id
            WHERE s.status = ? AND s.is_deleted = 0
            GROUP BY s.id
            ORDER BY s.created_on DESC
        `;
        db.query(query, [status], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            
            // Parse parameters JSON for each sensor
            results.forEach(sensor => {
                if (sensor.parameters) {
                    sensor.parameters = JSON.parse(`[${sensor.parameters}]`);
                } else {
                    sensor.parameters = [];
                }
            });
            
            return callback(null, results);
        });
    },

    // Create new sensor group
    createSensorGroup: (sensorData, callback) => {
        const query = `
            INSERT INTO tbl_sensor_group (
                sensor_type,sensor_group_name, status, created_by, created_on
            ) VALUES (?, ?, ?, ?, NOW())
        `;
        const values = [
            sensorData.sensor_type,
            sensorData.sensor_group_name,
            sensorData.status || 'active',
            sensorData.created_by
        ];
        
        db.query(query, values, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Create sensor parameters
    createSensorGroupParameters: (sensorGroupId, parameters, callback) => {
        if (!parameters || parameters.length === 0) {
            return callback(null, []);
        }

        const query = `
            INSERT INTO tbl_sensor_group_parameters (
                sensor_group_id, sensor_parameter, unit, min_threshold_limit, max_threshold_limit
            ) VALUES ?
        `;
        
        const values = parameters.map(param => [
            sensorGroupId,
            param.sensorParameter,
            param.unit,
            param.minThreshold,
            param.maxThreshold
        ]);
        
        db.query(query, [values], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Create sensor group with parameters (transaction)
    createSensorGroupWithParameters: (sensorData, parameters, callback) => {
        db.getConnection((error, connection) => {
            if (error) {
                return callback(error, null);
            }

            connection.beginTransaction(async (error) => {
                if (error) {
                    connection.release();
                    return callback(error, null);
                }

                try {
                    // Create sensor group
                    const sensorGroupQuery = `
                        INSERT INTO tbl_sensor_group (
                            sensor_type, sensor_group_name, status, created_by, created_on
                        ) VALUES (?, ?, ?, ?, NOW())
                    `;
                    const sensorValues = [
                        sensorData.sensor_type,
                        sensorData.sensor_group_name,
                        sensorData.status || 'active',
                        sensorData.created_by
                    ];

                    connection.query(sensorGroupQuery, sensorValues, (error, sensorResults) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                return callback(error, null);
                            });
                        }

                        const sensorGroupId = sensorResults.insertId;

                        // If no parameters, just return the sensor
                        if (!parameters || parameters.length === 0) {
                            connection.commit((error) => {
                                connection.release();
                                if (error) {
                                    return callback(error, null);
                                }
                                return callback(null, { sensorGroupId, parameters: [] });
                            });
                            return;
                        }

                        // Create parameters
                        const paramQuery = `
                            INSERT INTO tbl_sensor_group_parameters (
                                sensor_group_id, sensor_parameter, unit, min_threshold_limit, max_threshold_limit
                            ) VALUES ?
                        `;
                        
                        const paramValues = parameters.map(param => [
                            sensorGroupId,
                            param.sensorParameter,
                            param.unit,
                            param.minThreshold,
                            param.maxThreshold
                        ]);

                        connection.query(paramQuery, [paramValues], (error, paramResults) => {
                            if (error) {
                                return connection.rollback(() => {
                                    connection.release();
                                    return callback(error, null);
                                });
                            }

                            connection.commit((error) => {
                                connection.release();
                                if (error) {
                                    return callback(error, null);
                                }
                                return callback(null, { sensorGroupId, parameters: paramResults.insertId });
                            });
                        });
                    });
                } catch (error) {
                    connection.rollback(() => {
                        connection.release();
                        return callback(error, null);
                    });
                }
            });
        });
    },

    // Update sensor group
    updateSensorGroup: (id, sensorData, callback) => {
        const query = `
            UPDATE tbl_sensor_group SET 
                sensor_type = ?, sensor_group_name = ?, status = ?, modified_by = ?, modified_on = NOW()
            WHERE id = ? AND is_deleted = 0
        `;
        const values = [
            sensorData.sensor_type,
            sensorData.sensor_group_name,
            sensorData.status,
            sensorData.modified_by,
            id
        ];
        
        db.query(query, values, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Update sensor group parameters
    updateSensorGroupParameters: (sensorGroupId, parameters, callback) => {
        // First delete existing parameters
        const deleteQuery = 'DELETE FROM tbl_sensor_group_parameters WHERE sensor_group_id = ?';
        
        db.query(deleteQuery, [sensorGroupId], (error) => {
            if (error) {
                return callback(error, null);
            }

            // If no new parameters, just return success
            if (!parameters || parameters.length === 0) {
                return callback(null, true);
            }

            // Insert new parameters
            const insertQuery = `
                INSERT INTO tbl_sensor_group_parameters (
                    sensor_group_id, sensor_parameter, unit, min_threshold_limit, max_threshold_limit
                ) VALUES ?
            `;
            
            const values = parameters.map(param => [
                sensorGroupId,
                param.sensorParameter,
                param.unit,
                param.minThreshold,
                param.maxThreshold
            ]);
            
            db.query(insertQuery, [values], (error, results) => {
                if (error) {
                    return callback(error, null);
                }
                return callback(null, results.insertId);
            });
        });
    },

    // Update sensor group with parameters (transaction)
    updateSensorGroupWithParameters: (id, sensorData, parameters, callback) => {
        db.getConnection((error, connection) => {
            if (error) {
                return callback(error, null);
            }

            connection.beginTransaction(async (error) => {
                if (error) {
                    connection.release();
                    return callback(error, null);
                }

                try {
                    // Update sensor group
                    const sensorGroupQuery = `
                        UPDATE tbl_sensor_group SET 
                            sensor_type = ?, sensor_group_name = ?, status = ?, modified_by = ?, modified_on = NOW()
                        WHERE id = ? AND is_deleted = 0
                    `;
                    const sensorValues = [
                        sensorData.sensor_type,
                        sensorData.sensor_group_name,
                        sensorData.status,
                        sensorData.modified_by,
                        id
                    ];

                    connection.query(sensorGroupQuery, sensorValues, (error, sensorResults) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                return callback(error, null);
                            });
                        }

                        if (sensorResults.affectedRows === 0) {
                            return connection.rollback(() => {
                                connection.release();
                                return callback(new Error('Sensor group not found'), null);
                            });
                        }

                        // Delete existing parameters
                        const deleteQuery = 'DELETE FROM tbl_sensor_group_parameters WHERE sensor_group_id = ?';
                        connection.query(deleteQuery, [id], (error) => {
                            if (error) {
                                return connection.rollback(() => {
                                    connection.release();
                                    return callback(error, null);
                                });
                            }

                            // If no new parameters, just commit
                            if (!parameters || parameters.length === 0) {
                                connection.commit((error) => {
                                    connection.release();
                                    if (error) {
                                        return callback(error, null);
                                    }
                                    return callback(null, { updated: true, parameters: [] });
                                });
                                return;
                            }

                            // Insert new parameters
                            const paramQuery = `
                                INSERT INTO tbl_sensor_group_parameters (
                                    sensor_group_id, sensor_parameter, unit, min_threshold_limit, max_threshold_limit
                                ) VALUES ?
                            `;
                            
                            const paramValues = parameters.map(param => [
                                id,
                                param.sensorParameter,
                                param.unit,
                                param.minThreshold,
                                param.maxThreshold
                            ]);

                            connection.query(paramQuery, [paramValues], (error, paramResults) => {
                                if (error) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        return callback(error, null);
                                    });
                                }

                                connection.commit((error) => {
                                    connection.release();
                                    if (error) {
                                        return callback(error, null);
                                    }
                                    return callback(null, { updated: true, parameters: paramResults.insertId });
                                });
                            });
                        });
                    });
                } catch (error) {
                    connection.rollback(() => {
                        connection.release();
                        return callback(error, null);
                    });
                }
            });
        });
    },

    // Delete sensor group (soft delete)
    deleteSensorGroup: (id, modifiedBy, callback) => {
        const query = `
            UPDATE tbl_sensor_group SET 
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

    // Update sensor group status
    updateSensorGroupStatus: (id, status, modifiedBy, callback) => {
        const query = `
            UPDATE tbl_sensor_group SET 
                status = ?, modified_by = ?, modified_on = NOW()
            WHERE id = ? AND is_deleted = 0
        `;
        db.query(query, [status, modifiedBy, id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    }
}; 