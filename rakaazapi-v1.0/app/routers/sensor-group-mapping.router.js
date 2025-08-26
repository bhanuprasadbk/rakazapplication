const sensorGroupMappingController = require("../controllers/sensor-group-mapping.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Protected routes (authentication required)
    
    // GET routes
    app.get('/api/sensor-group-mappings', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorGroupMappingController.getAllSensorGroupMappings);
    app.get('/api/sensor-group-mappings/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorGroupMappingController.getSensorGroupMappingById);
    app.get('/api/sensor-group-mappings/customer/:customerId', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorGroupMappingController.getSensorGroupMappingsByCustomer);
    app.get('/api/sensor-group-mappings/device/:deviceId', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorGroupMappingController.getSensorGroupMappingsByDevice);
    app.get('/api/sensor-group-mappings/sensor-group/:sensorGroupId', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorGroupMappingController.getSensorGroupMappingsBySensorGroup);
    app.get('/api/sensor-group-mappings/status/:status', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorGroupMappingController.getSensorGroupMappingsByStatus);
    app.get('/api/sensor-group-mappings/check-availability/:sensorGroupId/:customerId', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorGroupMappingController.checkSensorGroupAvailability);
    
    // POST routes
    app.post('/api/sensor-group-mappings', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorGroupMappingController.createSensorGroupMapping);
    
    // PUT routes
    app.put('/api/sensor-group-mappings/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorGroupMappingController.updateSensorGroupMapping);
    
    // DELETE routes
    app.delete('/api/sensor-group-mappings/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorGroupMappingController.deleteSensorGroupMapping);
    
    // PATCH routes
    app.patch('/api/sensor-group-mappings/:id/status', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorGroupMappingController.updateSensorGroupMappingStatus);
};
