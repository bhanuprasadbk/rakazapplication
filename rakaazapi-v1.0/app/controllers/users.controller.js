const usersModel = require('../models/users.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all users
    getAllUsers: async (req, res) => {
        try {
            usersModel.getAllUsers((error, results) => {
                if (error) {
                    errorlog.error('Error fetching users:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching users',
                        error: error.message
                    });
                }
                successlog.info('Users fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Users fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllUsers:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get user by ID
    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            usersModel.getUserById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching user by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching user',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                successlog.info(`User fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'User fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getUserById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get user by email
    getUserByEmail: async (req, res) => {
        try {
            const { email } = req.params;
            
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'User email is required'
                });
            }

            usersModel.getUserByEmail(email, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching user by email:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching user',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                successlog.info(`User fetched with email: ${email}`);
                return res.status(200).json({
                    success: true,
                    message: 'User fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getUserByEmail:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get user by username
    getUserByUsername: async (req, res) => {
        try {
            const { username } = req.params;
            
            if (!username) {
                return res.status(400).json({
                    success: false,
                    message: 'Username is required'
                });
            }

            usersModel.getUserByUsername(username, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching user by username:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching user',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                successlog.info(`User fetched with username: ${username}`);
                return res.status(200).json({
                    success: true,
                    message: 'User fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getUserByUsername:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get users by role
    getUsersByRole: async (req, res) => {
        try {
            const { roleId } = req.params;
            
            if (!roleId) {
                return res.status(400).json({
                    success: false,
                    message: 'Role ID is required'
                });
            }

            usersModel.getUsersByRole(roleId, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching users by role:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching users by role',
                        error: error.message
                    });
                }
                successlog.info(`Users fetched for role: ${roleId}`);
                return res.status(200).json({
                    success: true,
                    message: 'Users fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getUsersByRole:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get users by customer
    getUsersByCustomer: async (req, res) => {
        try {
            const { customerId } = req.params;
            
            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer ID is required'
                });
            }

            usersModel.getUsersByCustomer(customerId, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching users by customer:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching users by customer',
                        error: error.message
                    });
                }
                successlog.info(`Users fetched for customer: ${customerId}`);
                return res.status(200).json({
                    success: true,
                    message: 'Users fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getUsersByCustomer:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new user
    createUser: async (req, res) => {
        try {
            const {
                name, email, username, password_hash, role_id, customer_id, is_active
            } = req.body;
            
            if (!name || !email || !username || !password_hash || !role_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Name, email, username, password_hash, and role_id are required'
                });
            }

            const userData = {
                name,
                email,
                username,
                password_hash,
                role_id,
                customer_id,
                is_active
            };
            
            usersModel.createUser(userData, (error, insertId) => {
                if (error) {
                    errorlog.error('Error creating user:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error creating user',
                        error: error.message
                    });
                }
                successlog.info(`User created with ID: ${insertId}`);
                return res.status(201).json({
                    success: true,
                    message: 'User created successfully',
                    data: { id: insertId, ...userData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in createUser:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update user
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                name, email, username, password_hash, role_id, customer_id, is_active
            } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            if (!name || !email || !username || !password_hash || !role_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Name, email, username, password_hash, and role_id are required'
                });
            }

            const userData = {
                name,
                email,
                username,
                password_hash,
                role_id,
                customer_id,
                is_active
            };
            
            usersModel.updateUser(id, userData, (error, updated) => {
                if (error) {
                    errorlog.error('Error updating user:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating user',
                        error: error.message
                    });
                }
                
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                successlog.info(`User updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'User updated successfully',
                    data: { id, ...userData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateUser:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete user
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            usersModel.deleteUser(id, (error, deleted) => {
                if (error) {
                    errorlog.error('Error deleting user:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting user',
                        error: error.message
                    });
                }
                
                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                successlog.info(`User deleted with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'User deleted successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteUser:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update user status
    updateUserStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { is_active } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            if (is_active === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'is_active status is required'
                });
            }

            usersModel.updateUserStatus(id, is_active, (error, updated) => {
                if (error) {
                    errorlog.error('Error updating user status:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating user status',
                        error: error.message
                    });
                }
                
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                successlog.info(`User status updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'User status updated successfully',
                    data: { id, is_active }
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateUserStatus:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}; 