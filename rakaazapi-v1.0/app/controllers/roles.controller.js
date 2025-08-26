const rolesModel = require('../models/roles.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all roles
    getAllRoles: async (req, res) => {
        try {
            rolesModel.getAllRoles((error, results) => {
                if (error) {
                    errorlog.error('Error fetching roles:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching roles',
                        error: error.message
                    });
                }
                successlog.info('Roles fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Roles fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllRoles:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get role by ID
    getRoleById: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Role ID is required'
                });
            }

            rolesModel.getRoleById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching role by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching role',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Role not found'
                    });
                }

                successlog.info(`Role fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Role fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getRoleById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get role by name
    getRoleByName: async (req, res) => {
        try {
            const { name } = req.params;
            
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Role name is required'
                });
            }

            rolesModel.getRoleByName(name, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching role by name:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching role',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Role not found'
                    });
                }

                successlog.info(`Role fetched with name: ${name}`);
                return res.status(200).json({
                    success: true,
                    message: 'Role fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getRoleByName:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new role
    createRole: async (req, res) => {
        try {
            const { name } = req.body;
            
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Role name is required'
                });
            }

            const roleData = { name };
            
            rolesModel.createRole(roleData, (error, insertId) => {
                if (error) {
                    errorlog.error('Error creating role:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error creating role',
                        error: error.message
                    });
                }
                successlog.info(`Role created with ID: ${insertId}`);
                return res.status(201).json({
                    success: true,
                    message: 'Role created successfully',
                    data: { id: insertId, ...roleData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in createRole:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update role
    updateRole: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Role ID is required'
                });
            }

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Role name is required'
                });
            }

            const roleData = { name };
            
            rolesModel.updateRole(id, roleData, (error, updated) => {
                if (error) {
                    errorlog.error('Error updating role:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating role',
                        error: error.message
                    });
                }
                
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'Role not found'
                    });
                }

                successlog.info(`Role updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Role updated successfully',
                    data: { id, ...roleData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateRole:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete role
    deleteRole: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Role ID is required'
                });
            }

            rolesModel.deleteRole(id, (error, deleted) => {
                if (error) {
                    errorlog.error('Error deleting role:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting role',
                        error: error.message
                    });
                }
                
                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'Role not found'
                    });
                }

                successlog.info(`Role deleted with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Role deleted successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteRole:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}; 