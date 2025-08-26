const customersModel = require('../models/customeradmin.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all customer admins
    getAllCustomerAdmins: async (req, res) => {
        try {
            customersModel.getAllCustomerAdmins(req.body, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching customer admins:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching customer admins',
                        error: error.message
                    });
                }
                successlog.info('Customer admins fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Customer admins fetched successfully',
                    results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllCustomerAdmins:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get customer admin by ID
    getCustomerAdminById: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer admin ID is required'
                });
            }

            customersModel.getCustomerAdminById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching customer by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching customer admin',
                        error: error.message
                    });
                }

                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Customer admin not found'
                    });
                }

                successlog.info(`Customer admin fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Customer admin fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getCustomerAdminById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get customer admin by email
    getCustomerAdminByEmail: async (req, res) => {
        try {
            const { email } = req.params;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer admin email is required'
                });
            }

            customersModel.getCustomerAdminByEmail(email, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching customer admin by email:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching customer admin',
                        error: error.message
                    });
                }

                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Customer admin not found'
                    });
                }

                successlog.info(`Customer admin fetched with email: ${email}`);
                return res.status(200).json({
                    success: true,
                    message: 'Customer admin fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getCustomerAdminByEmail:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new customer admin
    createCustomerAdmin: async (req, res) => {
        try {
            const {
                organization_name, contact_person_name, customer_admin_name, username,
                email, contact_number, contact_object, customer_admin_type, roleid, currency,
                password, address, country_id, state_id, city_id, created_by
            } = req.body;

            if (!organization_name || !customer_admin_name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Organization name, customer admin name, email, and password are required'
                });
            }

            const customerData = {
                organization_name,
                contact_person_name,
                customer_admin_name,
                username,
                email,
                contact_number,
                contact_object,
                customer_admin_type,
                roleid,
                currency,
                password,
                address,
                country_id,
                state_id,
                city_id,
                created_by
            };

            customersModel.createCustomerAdmin(customerData, (error, insertId) => {
                if (error) {
                    errorlog.error('Error creating customer admin:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error creating customer admin',
                        error: error.message
                    });
                }
                successlog.info(`Customer Admin created with ID: ${insertId}`);


                return res.status(201).json({
                    success: true,
                    message: 'Customer Admin created successfully',
                    data: insertId
                });
            });
        } catch (error) {
            errorlog.error('Exception in createCustomerAdmin:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update customer admin
    updateCustomerAdmin: async (req, res) => {
        try {
            const {
                customer_id, // required for update
                organization_name, contact_person_name, customer_admin_name, username,
                email, contact_number, contact_object, customer_admin_type, roleid, currency,
                address, country_id, state_id, city_id, updated_by
            } = req.body;

            if (!customer_id || !organization_name || !customer_admin_name || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer ID, organization name, customer admin name, and email are required'
                });
            }

            const customerData = {
                organization_name,
                contact_person_name,
                customer_admin_name,
                username,
                email,
                contact_number,
                contact_object,
                customer_admin_type,
                roleid,
                currency,
               // password,
                address,
                country_id,
                state_id,
                city_id,
                updated_by
            };

            customersModel.updateCustomerAdmin(customer_id, customerData, (error, result) => {
                if (error) {
                    errorlog.error('Error updating customer admin:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating customer admin',
                        error: error.message
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Customer Admin not found'
                    });
                }

                successlog.info(`Customer Admin updated with ID: ${customer_id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Customer Admin updated successfully'
                });
            });

        } catch (error) {
            errorlog.error('Exception in updateCustomerAdmin:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
    ,

    // Delete customer admin
    deleteCustomerAdmin: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer ID is required'
                });
            }

            customersModel.deleteCustomerAdmin(id, (error, deleted) => {
                if (error) {
                    errorlog.error('Error deleting customer:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting customer',
                        error: error.message
                    });
                }

                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'Customer not found'
                    });
                }

                successlog.info(`Customer deleted with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Customer deleted successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteCustomerAdmin:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get customer admins by admin type
    getCustomerAdminsByAdminType: async (req, res) => {
        try {
            const { adminTypeId } = req.params;

            if (!adminTypeId) {
                return res.status(400).json({
                    success: false,
                    message: 'Admin type ID is required'
                });
            }

            customersModel.getCustomerAdminsByAdminType(adminTypeId, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching customer admins by admin type:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching customer admins by admin type',
                        error: error.message
                    });
                }
                successlog.info(`Customer admins fetched for admin type: ${adminTypeId}`);
                return res.status(200).json({
                    success: true,
                    message: 'Customer admins fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getCustomerAdminsByAdminType:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}; 