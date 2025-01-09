import { Sequelize } from 'sequelize';

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_DIALECT
} = process.env;

export const sequelize = new Sequelize(
    DB_DATABASE || 'testing_db', // database name
    DB_USER || 'root',                   // username
    DB_PASSWORD || '',                   // password
    {
        host: DB_HOST || '127.0.0.1',
        port: DB_PORT ? parseInt(DB_PORT, 10) : 3306,
        dialect: (DB_DIALECT as 'mysql' | 'mariadb' | 'postgres' | 'sqlite' | 'mssql') || 'mysql',
        logging: false
    }
);
