const loginController = require("../controllers/login.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Public routes (no authentication required)
    app.post('/api/auth/login', loginController.userLogin);
    app.post('/api/auth/customer-login', loginController.customerLogin);
    app.post('/api/auth/refresh-token', loginController.refreshToken);
    
    // Protected routes (authentication required)
    app.post('/api/auth/logout', authenticateToken, loginController.logout);
    app.get('/api/auth/profile', authenticateToken, loginController.getProfile);
    app.post('/api/auth/change-password', authenticateToken, loginController.changePassword);
    
    // Admin-only routes
    app.get('/api/auth/admin/users', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), (req, res) => {
        res.json({
            success: true,
            message: 'Admin access granted',
            data: { user: req.user }
        });
    });
};