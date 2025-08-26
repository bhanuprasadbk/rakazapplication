const customerUnitsmodel = require('../models/units.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all Units
    getAllUnits: async (req, res) => {
        try {
            customerUnitsmodel.getAllUnits((error, results) => {
                if (error) {
                    errorlog.error('Error fetching units:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching units',
                        error: error.message
                    });
                }
                successlog.info('Units fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Units fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllUnits:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get unit by ID
    getUnitById: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Unit ID is required'
                });
            }

            customerUnitsmodel.getUnitById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching unit by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching unit',
                        error: error.message
                    });
                }

                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Unit not found'
                    });
                }

                successlog.info(`Unit fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Unit fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getUnitById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get unit by name
    getUnitByName: async (req, res) => {
        try {
            const { name } = req.params;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Unit name is required'
                });
            }

            customerUnitsmodel.getUnitByName(name, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching unit by name:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching unit',
                        error: error.message
                    });
                }

                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Unit not found'
                    });
                }

                successlog.info(`Unit fetched with name: ${name}`);
                return res.status(200).json({
                    success: true,
                    message: 'Unit fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getUnitByName:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new unit
    createUnit: async (req, res) => {
        try {
            const { unitname,created_by } = req.body;

            if (!unitname) {
                return res.status(400).json({
                    success: false,
                    message: 'Unit name is required'
                });
            }

            const UnitData = { unitname ,created_by };

            customerUnitsmodel.createUnit(UnitData, (error, insertId) => {
                if (error) {
                    errorlog.error('Error creating unit:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error unit',
                        error: error.message
                    });
                }
                successlog.info(`Unit created with ID: ${insertId}`);
                return res.status(201).json({
                    success: true,
                    message: 'Unit created successfully',
                    data: { id: insertId, ...UnitData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in createUnit:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update Unit
    updateUnit: async (req, res) => {
        try {
            const { id } = req.params;
            const { unitname } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Unit ID is required'
                });
            }

            if (!unitname) {
                return res.status(400).json({
                    success: false,
                    message: 'Unit name is required'
                });
            }

            const unitData = { unitname };

            customerUnitsmodel.updateUnit(id, unitData, (error, updated) => {
                if (error) {
                    errorlog.error('Error updating unit:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating unit',
                        error: error.message
                    });
                }

                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'unit not found'
                    });
                }

                successlog.info(`Unit updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Unit updated successfully',
                    data: { id, ...unitData }
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateUnit:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete Unit
    deleteUnit: async (req, res) => {
        try {
            const { ids } = req.body; // Expecting an array like [1, 2, 3]

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'At least one Unit ID is required',
                });
            }

            customerUnitsmodel.deleteUnit(ids, (error, deleted) => {
                if (error) {
                    errorlog.error('Error deleting units:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting units',
                        error: error.message,
                    });
                }

                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'No units found for deletion',
                    });
                }

                successlog.info(`Units deleted: ${ids.join(', ')}`);
                return res.status(200).json({
                    success: true,
                    message: 'Units deleted successfully',
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteUnit:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    }

}; 