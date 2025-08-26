const db = require('../config/db');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
module.exports = {
    // Get all customers with related data
    getAllCustomers: (body, callback) => {
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
           OR c.customer_name LIKE ?
           OR cat.cust_type LIKE ?
           OR c.address LIKE ?
           OR co.name LIKE ?
           OR s.name LIKE ?
           OR ci.name LIKE ?
           AND c.is_deleted = 0
    `;

        const searchParams = Array(10).fill(`%${search}%`); // 10 LIKE placeholders

        const query = `
        SELECT c.*, 
               cat.customer_type as customer_type_name,
               co.name as country_name,
               s.name as state_name,
               ci.name as city_name,
               sub.plan_name as plan_name
        FROM tbl_customers c
        LEFT JOIN tbl_customer_type cat ON c.customer_type = cat.id
        LEFT JOIN tbl_countries co ON c.country_id = co.id
        LEFT JOIN tbl_states s ON c.state_id = s.id
        LEFT JOIN tbl_cities ci ON c.city_id = ci.id
        LEFT JOIN tbl_subscriptions sub ON c.plan_id =  sub.id
        ${search ? searchCondition : 'WHERE c.is_deleted = 0 AND c.role_id = 3'}
        ORDER BY c.organization_name
        LIMIT ? OFFSET ?`;

        console.log(query);

        db.query(query, [...(search ? searchParams : []), limit, offset], (error, results) => {
            if (error) {
                return callback(error, null);
            }

            // Count query with same search filter
            const countQuery = `
            SELECT COUNT(*) as total 
            FROM tbl_customers c
            LEFT JOIN tbl_customer_type cat ON c.customer_type = cat.id
            LEFT JOIN tbl_countries co ON c.country_id = co.id
            LEFT JOIN tbl_states s ON c.state_id = s.id
            LEFT JOIN tbl_cities ci ON c.city_id = ci.id
            LEFT JOIN tbl_subscriptions sub ON c.plan_id =  sub.id
            ${search ? searchCondition : 'WHERE c.is_deleted = 0 AND c.role_id = 3'}
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
    // Get customer by ID with related data
    getCustomerById: (id, callback) => {
        const query = `
            SELECT c.*, 
                   cat.customer_type as customer_type_name,
                   co.name as country_name,
                   s.name as state_name,
                   ci.name as city_name
            FROM tbl_customers c
            LEFT JOIN tbl_customer_type cat ON c.customer_type = cat.id
            LEFT JOIN tbl_countries co ON c.country_id = co.id
            LEFT JOIN tbl_states s ON c.state_id = s.id
            LEFT JOIN tbl_cities ci ON c.city_id = ci.id
            WHERE c.id = ?
        `;
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    // Get customer by email
    getCustomerByEmail: (email, callback) => {
        const query = 'SELECT * FROM tbl_customers WHERE email = ?';
        db.query(query, [email], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        });
    },

    createCustomer: (customerData, callback) => {
        const prefix = customerData.roleid === 2 ? 'CA' : customerData.roleid === 3 ? 'CUS' : 'GEN';

        const getLastCustomerIdQuery = `
        SELECT customer_id FROM tbl_customers 
        WHERE customer_id LIKE '${prefix}%' 
        ORDER BY id DESC LIMIT 1
    `;

        db.query(getLastCustomerIdQuery, async (err, results) => {
            if (err) {
                return callback(err, null);
            }

            let nextNumber = 1;

            if (results.length > 0) {
                const lastId = results[0].customer_id; // e.g., CA00012
                const numberPart = parseInt(lastId.replace(prefix, '')) || 0;
                nextNumber = numberPart + 1;
            }

            const newCustomerId = `${prefix}${nextNumber.toString().padStart(5, '0')}`;

            const customerQuery = `
            INSERT INTO tbl_customers (
                customer_id, organization_name, contact_person_name, customer_name, 
                email, contact_number, contact_object ,customer_type, currency,plan_id,
                address, country_id, state_id, city_id, created_by,role_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

            const customerValues = [
                newCustomerId,
                customerData.organization_name,
                customerData.contact_person_name,
                customerData.customer_name,
                customerData.email,
                customerData.contact_number,
                customerData.contact_object || '',
                customerData.customer_type,
                customerData.currency || 'USD',
                customerData.plan_id || 1,
                customerData.address,
                customerData.country_id,
                customerData.state_id,
                customerData.city_id,
                customerData.created_by,
                customerData.roleid
            ];

            db.query(customerQuery, customerValues, (customerErr, customerResults) => {
                if (customerErr) {
                    return callback(customerErr, null);
                }
                const customerId = customerResults.insertId;

                const userQuery = `
                INSERT INTO tbl_users (
                    name, email, username, password_hash, role_id, customer_id, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
                const userValues = [
                    customerData.customer_name,
                    customerData.email,
                    customerData.username,
                    customerData.password, // hash beforehand
                    customerData.roleid,
                    customerId,
                    customerData.created_by
                ];

                db.query(userQuery, userValues, (userErr, userResults) => {
                    if (userErr) {
                        return callback(userErr, null);
                    }

                    const getCustomerData = `
                    SELECT 
                        c.customer_id, c.organization_name, c.contact_person_name, c.customer_name, 
                        c.email, c.contact_number, c.address, 
                        country.name AS country_name, 
                        state.name AS state_name, 
                        city.name AS city_name 
                    FROM tbl_customers c 
                    LEFT JOIN tbl_countries country ON country.id = c.country_id
                    LEFT JOIN tbl_states state ON state.id = c.state_id
                    LEFT JOIN tbl_cities city ON city.id = c.city_id
                    WHERE c.customer_id = ?
                `;

                    db.query(getCustomerData, [newCustomerId], (getCustomerErr, customerResponse) => {
                        if (getCustomerErr) {
                            return callback(getCustomerErr, null);
                        }

                        if (customerResponse.length === 0) {
                            return callback(new Error('Customer not found'), null);
                        }

                        return callback(null, {
                            customer_id: newCustomerId,
                            user_id: userResults.insertId,
                            customerResponse: customerResponse[0]
                        });
                    });
                });
            });
        });
    },

    // Update customer
    updateCustomer: (id, customerData, callback) => {
        const query = `
            UPDATE tbl_customers SET 
                organization_name = ?, contact_person_name = ?, customer_name = ?,plan_id = ?,
                email = ?, contact_number = ?, customer_type = ?, currency = ?,
                address = ?, country_id = ?, state_id = ?, city_id = ?, modified_by = ?,
                vat_id = ?, trade_license_id = ?
            WHERE id = ?
        `;
        const values = [
            customerData.organization_name,
            customerData.contact_person_name,
            customerData.customer_name,
            customerData.plan_id,
            customerData.email,
            customerData.contact_number,
            customerData.customer_type,
            customerData.currency,
            //customerData.password,
            customerData.address,
            customerData.country_id,
            customerData.state_id,
            customerData.city_id,
            customerData.modified_by,
            customerData.vat_id,
            customerData.trade_license_id,
            id
        ];
        console.log(values);

        db.query(query, values, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },
    // Delete customer
    deleteCustomer: (id, callback) => {
        const query = 'update tbl_customers set is_deleted = 1 WHERE id = ?';
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },
    // Get customers by customer type
    getCustomersByCustomerType: (customerTypeId, callback) => {
        const query = `
            SELECT c.*, 
                   cat.customer_type as customer_type_name,
                   co.name as country_name,
                   s.name as state_name,
                   ci.name as city_name
            FROM tbl_customers c
            LEFT JOIN tbl_customer_type cat ON c.customer_type = cat.id
            LEFT JOIN tbl_countries co ON c.country_id = co.id
            LEFT JOIN tbl_states s ON c.state_id = s.id
            LEFT JOIN tbl_cities ci ON c.city_id = ci.id
            WHERE c.customer_type = ?
            ORDER BY c.organization_name
        `;
        db.query(query, [customerTypeId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    }
}; 