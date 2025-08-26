const customerTypeModel = require('../models/customer-type.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all customer types
    getAllCustomerTypes: async (req, res) => {
        try {
            customerTypeModel.getAllCustomerTypes((error, results) => {
                if (error) {
                    errorlog.error('Error fetching customer types:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching customer types',
                        error: error.message
                    });
                }
                successlog.info('Customer types fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Customer types fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllCustomerTypes:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get customer type by ID
    getCustomerTypeById: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer type ID is required'
                });
            }

            customerTypeModel.getCustomerTypeById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching customer type by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching customer type',
                        error: error.message
                    });
                }

                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Customer type not found'
                    });
                }

                successlog.info(`Customer type fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Customer type fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getCustomerTypeById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get customer type by name
    getCustomerTypeByName: async (req, res) => {
        try {
            const { name } = req.params;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer type name is required'
                });
            }

            customerTypeModel.getCustomerTypeByName(name, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching customer type by name:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching customer type',
                        error: error.message
                    });
                }

                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Customer type not found'
                    });
                }

                successlog.info(`Customer type fetched with name: ${name}`);
                return res.status(200).json({
                    success: true,
                    message: 'Customer type fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getCustomerTypeByName:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new customer type
    createCustomerType: async (req, res) => {
        try {
            const { customer_type,created_by } = req.body;
            if (!customer_type) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer type name is required'
                });
            }

            const typeData = { customer_type,created_by };

            customerTypeModel.createCustomerType(typeData, (error, insertId) => {
                if (error) {
                    errorlog.error('Error creating customer type:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error creating customer type',
                        error: error.message
                    });
                }
                successlog.info(`Customer type created with ID: ${insertId}`);
                return res.status(201).json({
                    success: true,
                    message: 'Customer type created successfully',
                    data: { id: insertId, ...typeData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in createCustomerType:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update customer type
    updateCustomerType: async (req, res) => {
        try {
            const { id } = req.params;
            const { customer_type } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer type ID is required'
                });
            }

            if (!customer_type) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer type name is required'
                });
            }

            const typeData = { customer_type };

            customerTypeModel.updateCustomerType(id, typeData, (error, updated) => {
                if (error) {
                    errorlog.error('Error updating customer type:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating customer type',
                        error: error.message
                    });
                }

                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'Customer type not found'
                    });
                }

                successlog.info(`Customer type updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Customer type updated successfully',
                    data: { id, ...typeData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateCustomerType:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete customer type
    deleteCustomerType: async (req, res) => {
        try {
            const { ids } = req.body; // Accepting array of IDs

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'At least one Customer Type ID is required'
                });
            }

            customerTypeModel.deleteCustomerType(ids, (error, deleted) => {
                if (error) {
                    errorlog.error('Error deleting customer types:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting customer types',
                        error: error.message
                    });
                }

                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'No customer types found for deletion'
                    });
                }

                successlog.info(`Customer types deleted: ${ids.join(', ')}`);
                return res.status(200).json({
                    success: true,
                    message: 'Customer types deleted successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteCustomerType:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

}; 