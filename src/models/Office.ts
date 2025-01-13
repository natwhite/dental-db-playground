// src/models/Office.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';
import { faker } from '@faker-js/faker';

// Define the shape of the attributes
interface OfficeAttributes {
	office_id: number;
	office_name: string;
	brand_name: string;
	address_line_1: string;
	address_line_2?: string;
	city: string;
	state: string;
	zip_code: string;
	phone_number: string;
	created_at?: Date;
	updated_at?: Date;
}

// To create new Office records, office_id, created_at, updated_at can be optional
interface OfficeCreationAttributes
	extends Optional<OfficeAttributes, 'office_id' | 'created_at' | 'updated_at'> {
}

// Create the model class
export class Office
	extends Model<OfficeAttributes, OfficeCreationAttributes>
	implements OfficeAttributes {
	declare public office_id: number;
	declare public office_name: string;
	declare public brand_name: string;
	declare public address_line_1: string;
	declare public address_line_2?: string;
	declare public city: string;
	declare public state: string;
	declare public zip_code: string;
	declare public phone_number: string;
	declare public created_at: Date;
	declare public updated_at: Date;

	public static async createRandom() {
		return await Office.create({
			office_name: faker.company.name(),
			brand_name: faker.company.buzzVerb(),
			address_line_1: faker.location.streetAddress(),
			city: faker.location.city(),
			state: faker.location.state({ abbreviated: true }),
			zip_code: faker.location.zipCode(),
			phone_number: faker.string.numeric('(###) ###-####')
		});
	}
}

Office.init({
	office_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	office_name: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	brand_name: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	address_line_1: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	address_line_2: {
		type: DataTypes.STRING(255),
		allowNull: true
	},
	city: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	state: {
		type: DataTypes.STRING(2),
		allowNull: false
	},
	zip_code: {
		type: DataTypes.STRING(10),
		allowNull: false
	},
	phone_number: {
		type: DataTypes.STRING(20),
		allowNull: false
	},
	created_at: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW
	},
	updated_at: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW
	}
}, {
	sequelize,
	tableName: 'offices',
	timestamps: false // We'll manage created_at / updated_at manually or via triggers
});
