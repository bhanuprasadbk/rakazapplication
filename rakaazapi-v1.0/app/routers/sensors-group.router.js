const sensorsController = require("../controllers/sensors-group.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Protected routes (authentication required)
    
    // GET routes
    app.get('/api/sensors-group', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.getAllSensorGroups);
    app.get('/api/sensors-group/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.getSensorGroupById);
    app.get('/api/sensors-group/type/:sensortype', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.getSensorGroupsByType);
    app.get('/api/sensors-group/status/:status', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.getSensorGroupsByStatus);
    
    // POST routes
    app.post('/api/sensors-group', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.createSensorGroup);
    
    // PUT routes
    app.put('/api/sensors-group/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.updateSensorGroup);
    
    // DELETE routes
    app.delete('/api/sensors-group/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.deleteSensorGroup);
    
    // PATCH routes
    app.patch('/api/sensors-group/:id/status', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.updateSensorGroupStatus);
}; 