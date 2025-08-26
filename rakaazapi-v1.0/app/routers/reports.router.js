const reportsController = require("../controllers/reports.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    /**Super Admin Reports*/
    app.post('/api/reports/device-report', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), reportsController.getDeviceReport);
    app.post('/api/reports/customer-admin-report', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), reportsController.getCustomerAdminReport);
};
