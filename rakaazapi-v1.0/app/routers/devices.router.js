const devicesController = require("../controllers/devices.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Protected routes (authentication required)
    
    // GET routes
    app.post('/api/getAllDevices', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), devicesController.getAllDevices);
    app.get('/api/devices/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), devicesController.getDeviceById);
    app.get('/api/devices/deviceId/:deviceId', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), devicesController.getDeviceByDeviceId);
    app.get('/api/devices/sensortype/:sensortype', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), devicesController.getDevicesBySensorType);
    app.get('/api/devices/status/:status', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), devicesController.getDevicesByStatus);
    app.get('/api/devices/mapping-list/:customer_id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), devicesController.DeviceMappingListByCustomerId);
    
    // POST routes
    app.post('/api/devices', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), devicesController.createDevice);
    app.post('/api/devices/device-mappings', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), devicesController.DeviceMappingToCustomer);
    app.post('/api/devices/mapping-list', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), devicesController.DeviceMappingList);
    
    // PUT routes
    app.put('/api/devices/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), devicesController.updateDevice);
    
    // DELETE routes
    app.delete('/api/devices/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), devicesController.deleteDevice);
    
    // PATCH routes
    app.patch('/api/devices/:id/status', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), devicesController.updateDeviceStatus);
};
