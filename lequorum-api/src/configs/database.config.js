import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        pool: {
            max: 10,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        logging: process.env.NODE_ENV !== 'production'
    }
);

export default sequelize;
