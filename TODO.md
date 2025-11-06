# TODO List for Fixing Server Startup Error

- [x] Edit `backend/server.js` to destructure the router from the auth module: Change `const authRoutes = require('./routes/auth');` to `const { router: authRoutes } = require('./routes/auth');`.
- [ ] Run `npm start` in the backend directory to verify the server starts without errors.
