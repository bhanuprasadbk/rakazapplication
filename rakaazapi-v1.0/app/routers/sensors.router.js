const sensorsController = require("../controllers/sensors.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Protected routes (authentication required)
    
    // GET routes
    app.get('/api/sensors', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.getAllSensors);
    app.get('/api/sensors/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.getSensorById);
    app.get('/api/sensors/type/:sensortype', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.getSensorsByType);
    app.get('/api/sensors/status/:status', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.getSensorsByStatus);
    
    // POST routes
    app.post('/api/sensors', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.createSensor);
    
    // PUT routes
    app.put('/api/sensors/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.updateSensor);
    
    // DELETE routes
    app.delete('/api/sensors/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.deleteSensor);
    
    // PATCH routes
    app.patch('/api/sensors/:id/status', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), sensorsController.updateSensorStatus);
}; 