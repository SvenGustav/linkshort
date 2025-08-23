import express from 'express';
import connect from './config/database';
import { setRoutes } from './routes/index';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
connect();

// Set up routes
setRoutes(app);

app.listen(PORT, () => {
    console.log('----------------------------------------');
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log(`  GET  /                    - Health check`);
    console.log(`  POST /api/url/shorten     - Create short URL`);
    console.log(`  GET  /api/url/stats/:id   - Get URL stats`);
    console.log(`  GET  /:id                 - Redirect to URL`);
    console.log('----------------------------------------');
});