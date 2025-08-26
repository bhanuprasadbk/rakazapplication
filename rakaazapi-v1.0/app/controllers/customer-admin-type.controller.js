const customerAdminTypeModel = require('../models/customer-admin-type.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all customer admin types
    getAllCustomerAdminTypes: async (req, res) => {
        try {
            customerAdminTypeModel.getAllCustomerAdminTypes((error, results) => {
                if (error) {
                    errorlog.error('Error fetching customer admin types:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching customer admin types',
                        error: error.message
                    });
                }
                successlog.info('Customer admin types fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Customer admin types fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllCustomerAdminTypes:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get customer admin type by ID
    getCustomerAdminTypeById: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer admin type ID is required'
                });
            }

            customerAdminTypeModel.getCustomerAdminTypeById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching customer admin type by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching customer admin type',
                        error: error.message
                    });
                }

                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Customer admin type not found'
                    });
                }

                successlog.info(`Customer admin type fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Customer admin type fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getCustomerAdminTypeById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get customer admin type by name
    getCustomerAdminTypeByName: async (req, res) => {
        try {
            const { name } = req.params;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer admin type name is required'
                });
            }

            customerAdminTypeModel.getCustomerAdminTypeByName(name, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching customer admin type by name:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching customer admin type',
                        error: error.message
                    });
                }

                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Customer admin type not found'
                    });
                }

                successlog.info(`Customer admin type fetched with name: ${name}`);
                return res.status(200).json({
                    success: true,
                    message: 'Customer admin type fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getCustomerAdminTypeByName:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new customer admin type
    createCustomerAdminType: async (req, res) => {
        try {
            const { cust_admin_type,created_by } = req.body;
            if (!cust_admin_type) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer admin type name is required'
                });
            }

            const adminTypeData = { cust_admin_type,created_by };

            customerAdminTypeModel.createCustomerAdminType(adminTypeData, (error, insertId) => {
                if (error) {
                    errorlog.error('Error creating customer admin type:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error creating customer admin type',
                        error: error.message
                    });
                }
                successlog.info(`Customer admin type created with ID: ${insertId}`);
                return res.status(201).json({
                    success: true,
                    message: 'Customer admin type created successfully',
                    data: { id: insertId, ...adminTypeData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in createCustomerAdminType:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update customer admin type
    updateCustomerAdminType: async (req, res) => {
        try {
            const { id } = req.params;
            const { cust_admin_type } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer admin type ID is required'
                });
            }

            if (!cust_admin_type) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer admin type name is required'
                });
            }

            const adminTypeData = { cust_admin_type };

            customerAdminTypeModel.updateCustomerAdminType(id, adminTypeData, (error, updated) => {
                if (error) {
                    errorlog.error('Error updating customer admin type:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating customer admin type',
                        error: error.message
                    });
                }

                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'Customer admin type not found'
                    });
                }

                successlog.info(`Customer admin type updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Customer admin type updated successfully',
                    data: { id, ...adminTypeData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateCustomerAdminType:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete customer admin type
    deleteCustomerAdminType: async (req, res) => {
        try {
            const { ids } = req.body; // Accepting array of IDs

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'At least one Customer Admin Type ID is required'
                });
            }

            customerAdminTypeModel.deleteCustomerAdminType(ids, (error, deleted) => {
                if (error) {
                    errorlog.error('Error deleting customer admin types:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting customer admin types',
                        error: error.message
                    });
                }

                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'No customer admin types found for deletion'
                    });
                }

                successlog.info(`Customer admin types deleted: ${ids.join(', ')}`);
                return res.status(200).json({
                    success: true,
                    message: 'Customer admin types deleted successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteCustomerAdminType:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

}; 