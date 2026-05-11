import 'dotenv/config';
import express from 'express';
import sequelize from "./src/configs/database.config.js";
import './src/models/init.js';

const PORT = process.env.PORT;

const app = express();

await sequelize.authenticate();
console.log('Connection has been established successfully.');

await sequelize.sync({ alter: true });
console.log('All models were synchronized successfully.');
