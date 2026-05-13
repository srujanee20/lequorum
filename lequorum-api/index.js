import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';

import { init as initSocket } from './src/configs/socket.config.js';
import pinoHttp from 'pino-http';
import { logger } from "./src/configs/logger.config.js";
import { sequelize } from "./src/models/init.js";
import apiRoutes from './src/routes/api.routes.js';

const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);

app.use(pinoHttp({ logger }));

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.static('public'));
app.use(express.json());

app.use('/api', apiRoutes);

try {
    await sequelize.authenticate();
    logger.info(`Successfully connected to PostgreSQL host: ${sequelize.config.host}`);
    await sequelize.sync({ alter: true });
    logger.info('Models synchronized.');

    initSocket(server);

    server.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
} catch (err) {
    logger.fatal(`Failed to establish connection with database: ${err.message}`);
    process.exit(1);
}