const app = require('./server');
const listEndpoints = (app) => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            routes.push(middleware.route.path);
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    routes.push(handler.route.path);
                }
            });
        }
    });
    return routes;
};

console.log('Registered Routes:');
console.log(listEndpoints(app));
process.exit(0);
