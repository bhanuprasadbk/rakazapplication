const db = require('../config/db');

module.exports = {

    getDeviceReport: (body, callback) => {
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
               OR d.deviceName LIKE ?
               OR d.devicemake LIKE ? 
               OR d.devicemodel LIKE ?
               OR s.sensortype LIKE ?
               OR d.status LIKE ?
               OR sp.sensorParameter LIKE ?)
               AND d.is_deleted = 0
        `;
    
        const searchParams = Array(7).fill(`%${search}%`);
    
        const query = `
            SELECT 
                d.id,
                d.deviceId,
                d.deviceName,
                d.devicemake,
                d.devicemodel,
                CASE WHEN c.customer_admin_name IS NULL THEN '--' ELSE c.customer_admin_name END AS customer_admin_name,
                d.status,
                d.created_on,
                s.sensortype AS sensor_type_name,
                CASE WHEN d.customeradmin IS NULL THEN 'Unassigned' ELSE 'Assigned' END AS Status,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'parameter', sp.sensorParameter,
                        'unit', sp.unit,
                        'min_threshold', sp.min_threshold_limit,
                        'max_threshold', sp.max_threshold_limit,
                        'index_start', sp.index_start,
                        'index_end', sp.index_end
                    )
                ) AS parameters
            FROM tbl_devices d
            LEFT JOIN tbl_customer_admins c ON d.customeradmin = c.id
            LEFT JOIN tbl_sensors s ON d.sensortype = s.id
            LEFT JOIN tbl_sensor_parameters sp ON d.sensortype = sp.sensor_id
            ${search ? searchCondition : 'WHERE d.is_deleted = 0'}
            GROUP BY d.id
            ORDER BY d.created_on DESC
            LIMIT ? OFFSET ?
        `;
    
        db.query(query, [...(search ? searchParams : []), limit, offset], (error, results) => {
            if (error) {
                return callback(error, null);
            }
    
            // Count query (no JSON aggregation needed)
            const countQuery = `
                SELECT COUNT(DISTINCT d.id) AS total 
                FROM tbl_devices d
                LEFT JOIN tbl_sensors s ON d.sensortype = s.id
                LEFT JOIN tbl_sensor_parameters sp ON d.sensortype = sp.sensor_id
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
    }
    
    
    ,

    getCustomerAdminReport: (body, callback) => {
        const limit = body.limit || 10;
        const page = body.page || 1;
        const offset = (page - 1) * limit;
        const search = body.search || '';

        if (isNaN(offset) || isNaN(limit) || offset < 0 || limit <= 0) {
            return callback(new Error('Invalid pagination parameters'), null);
        }

        // Build search condition
        const searchCondition = `
        WHERE c.customer_id LIKE ? 
           OR c.organization_name LIKE ? 
           OR c.email LIKE ? 
           OR c.contact_number LIKE ?
           OR c.customer_admin_name LIKE ?
           OR cat.cust_admin_type LIKE ?
           OR c.address LIKE ?
           OR co.name LIKE ?
           OR s.name LIKE ?
           OR ci.name LIKE ?
           AND c.is_deleted = 0
    `;

        const searchParams = Array(10).fill(`%${search}%`); // 10 LIKE placeholders

        const query = `
        SELECT c.*, 
               cat.cust_admin_type,
               co.name as country_name,
               s.name as state_name,
               ci.name as city_name
        FROM tbl_customer_admins c
        LEFT JOIN tbl_customer_admin_type cat ON c.customer_admin_type = cat.id
        LEFT JOIN tbl_countries co ON c.country_id = co.id
        LEFT JOIN tbl_states s ON c.state_id = s.id
        LEFT JOIN tbl_cities ci ON c.city_id = ci.id
        ${search ? searchCondition : 'WHERE c.is_deleted = 0'}
        ORDER BY c.organization_name
        LIMIT ? OFFSET ?`;

        db.query(query, [...(search ? searchParams : []), limit, offset], (error, results) => {
            if (error) {
                return callback(error, null);
            }

            // Count query with same search filter
            const countQuery = `
            SELECT COUNT(*) as total 
            FROM tbl_customer_admins c
            LEFT JOIN tbl_customer_admin_type cat ON c.customer_admin_type = cat.id
            LEFT JOIN tbl_countries co ON c.country_id = co.id
            LEFT JOIN tbl_states s ON c.state_id = s.id
            LEFT JOIN tbl_cities ci ON c.city_id = ci.id
            ${search ? searchCondition : 'WHERE c.is_deleted = 0'}
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
    }
}