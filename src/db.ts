import { Sequelize } from 'sequelize';


const {
	DB_USER,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_DATABASE,
	DB_DIALECT
} = process.env;

if (!DB_USER) throw new Error('Missing DB_USER');
if (!DB_HOST) throw new Error('Missing DB_HOST');
if (!DB_DATABASE) throw new Error('Missing DB_DATABASE');
if (!DB_DIALECT) throw new Error('Missing DB_DIALECT');
if (!DB_PASSWORD) throw new Error('Missing DB_PASSWORD');
if (!DB_PORT) throw new Error('Missing DB_PORT');

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
