const productRoutes = require("./product.route");
const dashboardRoutes = require("./dashboard.route");
const systemConfig = require("../../config/system");
const productsCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    
    app.use(
        PATH_ADMIN + "/dashboard",
        authMiddleware.requireAuth,
        dashboardRoutes
    );
    
    app.use(
        PATH_ADMIN + "/products",
        authMiddleware.requireAuth,
        productRoutes
    );

    app.use(
        PATH_ADMIN + "/product-category", 
        authMiddleware.requireAuth,
        productsCategoryRoutes 
    );

    app.use(
        PATH_ADMIN + "/roles", 
        authMiddleware.requireAuth,
        roleRoutes
    );

    app.use(
        PATH_ADMIN + "/account", 
        authMiddleware.requireAuth,
        accountRoutes
    );

    app.use(
        PATH_ADMIN + "/auth", 
        authRoutes
    );

};