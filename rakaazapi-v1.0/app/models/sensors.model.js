const db = require('../config/db');

module.exports = {
    // Get all sensors with parameters
    getAllSensors: (callback) => {
        const query = `
            SELECT s.*, 
                   GROUP_CONCAT(
                       JSON_OBJECT(
                           'id', sp.id,
                           'sensorParameter', sp.sensorParameter,
                           'unit', sp.unit,
                           'min_threshold_limit', sp.min_threshold_limit,
                           'max_threshold_limit', sp.max_threshold_limit,
                           'index_start', sp.index_start,
                           'index_end', sp.index_end
                       )
                   ) as parameters
            FROM tbl_sensors s
            LEFT JOIN tbl_sensor_parameters sp ON s.id = sp.sensor_id
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
                           'sensorParameter', sp.sensorParameter,
                           'unit', sp.unit,
                           'min_threshold_limit', sp.min_threshold_limit,
                           'max_threshold_limit', sp.max_threshold_limit,
                           'index_start', sp.index_start,
                           'index_end', sp.index_end
                       )
                   ) as parameters
            FROM tbl_sensors s
            LEFT JOIN tbl_sensor_parameters sp ON s.id = sp.sensor_id
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
                           'sensorParameter', sp.sensorParameter,
                           'unit', sp.unit,
                           'min_threshold_limit', sp.min_threshold_limit,
                           'max_threshold_limit', sp.max_threshold_limit,
                           'index_start', sp.index_start,
                           'index_end', sp.index_end
                       )
                   ) as parameters
            FROM tbl_sensors s
            LEFT JOIN tbl_sensor_parameters sp ON s.id = sp.sensor_id
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
                           'sensorParameter', sp.sensorParameter,
                           'unit', sp.unit,
                           'min_threshold_limit', sp.min_threshold_limit,
                           'max_threshold_limit', sp.max_threshold_limit,
                           'index_start', sp.index_start,
                           'index_end', sp.index_end
                       )
                   ) as parameters
            FROM tbl_sensors s
            LEFT JOIN tbl_sensor_parameters sp ON s.id = sp.sensor_id
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

    // Create new sensor
    createSensor: (sensorData, callback) => {
        const query = `
            INSERT INTO tbl_sensors (
                sensortype, status, created_by, created_on
            ) VALUES (?, ?, ?, NOW())
        `;
        const values = [
            sensorData.sensortype,
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
    createSensorParameters: (sensorId, parameters, callback) => {
        if (!parameters || parameters.length === 0) {
            return callback(null, []);
        }

        const query = `
            INSERT INTO tbl_sensor_parameters (
                sensor_id, sensorParameter, unit, min_threshold_limit, max_threshold_limit, 
                index_start, index_end
            ) VALUES ?
        `;
        
        const values = parameters.map(param => [
            sensorId,
            param.sensorParameter,
            param.unit,
            param.min_threshold_limit,
            param.max_threshold_limit,
            param.index_start,
            param.index_end
        ]);
        
        db.query(query, [values], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Create sensor with parameters (transaction)
    createSensorWithParameters: (sensorData, parameters, callback) => {
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
                    // Create sensor
                    const sensorQuery = `
                        INSERT INTO tbl_sensors (
                            sensortype, status, created_by, created_on
                        ) VALUES (?, ?, ?, NOW())
                    `;
                    const sensorValues = [
                        sensorData.sensortype,
                        sensorData.status || 'active',
                        sensorData.created_by
                    ];

                    connection.query(sensorQuery, sensorValues, (error, sensorResults) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                return callback(error, null);
                            });
                        }

                        const sensorId = sensorResults.insertId;

                        // If no parameters, just return the sensor
                        if (!parameters || parameters.length === 0) {
                            connection.commit((error) => {
                                connection.release();
                                if (error) {
                                    return callback(error, null);
                                }
                                return callback(null, { sensorId, parameters: [] });
                            });
                            return;
                        }

                        // Create parameters
                        const paramQuery = `
                            INSERT INTO tbl_sensor_parameters (
                                sensor_id, sensorParameter, unit, min_threshold_limit, max_threshold_limit, 
                                index_start, index_end
                            ) VALUES ?
                        `;
                        
                        const paramValues = parameters.map(param => [
                            sensorId,
                            param.sensorParameter,
                            param.unit,
                            param.min_threshold_limit,
                            param.max_threshold_limit,
                            param.index_start,
                            param.index_end
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
                                return callback(null, { sensorId, parameters: paramResults.insertId });
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

    // Update sensor
    updateSensor: (id, sensorData, callback) => {
        const query = `
            UPDATE tbl_sensors SET 
                sensortype = ?, status = ?, modified_by = ?, modified_on = NOW()
            WHERE id = ? AND is_deleted = 0
        `;
        const values = [
            sensorData.sensortype,
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

    // Update sensor parameters
    updateSensorParameters: (sensorId, parameters, callback) => {
        // First delete existing parameters
        const deleteQuery = 'DELETE FROM tbl_sensor_parameters WHERE sensor_id = ?';
        
        db.query(deleteQuery, [sensorId], (error) => {
            if (error) {
                return callback(error, null);
            }

            // If no new parameters, just return success
            if (!parameters || parameters.length === 0) {
                return callback(null, true);
            }

            // Insert new parameters
            const insertQuery = `
                INSERT INTO tbl_sensor_parameters (
                    sensor_id, sensorParameter, unit, min_threshold_limit, max_threshold_limit, 
                    index_start, index_end
                ) VALUES ?
            `;
            
            const values = parameters.map(param => [
                sensorId,
                param.sensorParameter,
                param.unit,
                param.min_threshold_limit,
                param.max_threshold_limit,
                param.index_start,
                param.index_end
            ]);
            
            db.query(insertQuery, [values], (error, results) => {
                if (error) {
                    return callback(error, null);
                }
                return callback(null, results.insertId);
            });
        });
    },

    // Update sensor with parameters (transaction)
    updateSensorWithParameters: (id, sensorData, parameters, callback) => {
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
                    // Update sensor
                    const sensorQuery = `
                        UPDATE tbl_sensors SET 
                            sensortype = ?, status = ?, modified_by = ?, modified_on = NOW()
                        WHERE id = ? AND is_deleted = 0
                    `;
                    const sensorValues = [
                        sensorData.sensortype,
                        sensorData.status,
                        sensorData.modified_by,
                        id
                    ];

                    connection.query(sensorQuery, sensorValues, (error, sensorResults) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                return callback(error, null);
                            });
                        }

                        if (sensorResults.affectedRows === 0) {
                            return connection.rollback(() => {
                                connection.release();
                                return callback(new Error('Sensor not found'), null);
                            });
                        }

                        // Delete existing parameters
                        const deleteQuery = 'DELETE FROM tbl_sensor_parameters WHERE sensor_id = ?';
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
                                INSERT INTO tbl_sensor_parameters (
                                    sensor_id, sensorParameter, unit, min_threshold_limit, max_threshold_limit, 
                                    index_start, index_end
                                ) VALUES ?
                            `;
                            
                            const paramValues = parameters.map(param => [
                                id,
                                param.sensorParameter,
                                param.unit,
                                param.min_threshold_limit,
                                param.max_threshold_limit,
                                param.index_start,
                                param.index_end
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

    // Delete sensor (soft delete)
    deleteSensor: (id, modifiedBy, callback) => {
        const query = `
            UPDATE tbl_sensors SET 
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

    // Update sensor status
    updateSensorStatus: (id, status, modifiedBy, callback) => {
        const query = `
            UPDATE tbl_sensors SET 
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