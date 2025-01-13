import { Sequelize } from 'sequelize';


const {
	MSSQL_CONNECTION_OBJECT,
	MYSQL_CONNECTION_OBJECT,
	DB_DIALECT
} = process.env;

const validSqlDialects: string[] = [
	'mysql',
	'mariadb',
	'postgres',
	'sqlite',
	'mssql'
];

if (!DB_DIALECT) throw new Error('Missing DB_DIALECT');
if (!validSqlDialects.includes(DB_DIALECT)) throw new Error('Missing DB_DIALECT');

interface DbConnectionObject {
	USER: string,
	PASSWORD: string,
	HOST: string,
	PORT: string,
	DATABASE: string,
}

let connectionObject: DbConnectionObject;
switch (DB_DIALECT) {
	case 'mysql':
		if (!MYSQL_CONNECTION_OBJECT) throw new Error('Missing MYSQL_CONNECTION_OBJECT');
		connectionObject = JSON.parse(MYSQL_CONNECTION_OBJECT);
		break;
	case 'mssql':
		if (!MSSQL_CONNECTION_OBJECT) throw new Error('Missing MSSQL_CONNECTION_OBJECT');
		connectionObject = JSON.parse(MSSQL_CONNECTION_OBJECT);
		break;
	// TODO : Add support for additional SQL dialects
	default:
		throw new Error('Failed to parse db connection object');
}
if (!connectionObject) throw new Error('Failed to parse connection object');

const {
	HOST,
	PORT,
	USER,
	PASSWORD,
	DATABASE,
} = connectionObject;

if (!HOST) throw new Error('Failed to parse DB Host');
if (!PORT) throw new Error('Failed to parse DB Port');
if (!USER) throw new Error('Failed to parse DB User');
if (!PASSWORD) throw new Error('Failed to parse DB Password');
if (!DATABASE) throw new Error('Failed to parse DB Database');

export const sequelize = new Sequelize(
	DATABASE, // database name
	USER,                   // username
	PASSWORD,                   // password
	{
		host: HOST,
		port: parseInt(PORT, 10),
		dialect: DB_DIALECT,
		logging: false
	}
);
