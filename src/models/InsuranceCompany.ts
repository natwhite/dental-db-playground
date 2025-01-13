// src/models/InsuranceCompany.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';
import { faker } from '@faker-js/faker';


/**
 * Define the shape of an InsuranceCompany record in the DB.
 */
interface InsuranceCompanyAttributes {
	insurance_id: number;
	company_name: string;
	phone: string;
	address_line_1: string;
	address_line_2?: string;
	city: string;
	state: string;
	zip_code: string;
	created_at?: Date;
	updated_at?: Date;
}

/**
 * Attributes that can be omitted when creating a new InsuranceCompany record.
 */
interface InsuranceCompanyCreationAttributes
	extends Optional<InsuranceCompanyAttributes, | 'insurance_id' | 'address_line_2' | 'created_at' | 'updated_at'> {
}

/**
 * The InsuranceCompany model class.
 */
export class InsuranceCompany
	extends Model<InsuranceCompanyAttributes, InsuranceCompanyCreationAttributes>
	implements InsuranceCompanyAttributes {
	declare public insurance_id: number;
	declare public company_name: string;
	declare public phone: string;
	declare public address_line_1: string;
	declare public address_line_2?: string;
	declare public city: string;
	declare public state: string;
	declare public zip_code: string;
	declare public created_at: Date;
	declare public updated_at: Date;

	public static async createRandom() {
		return await InsuranceCompany.create({
			company_name: faker.company.name(),
			phone: faker.string.numeric('(###) ###-####'),
			address_line_1: faker.location.streetAddress(),
			address_line_2: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }),
			city: faker.location.city(),
			state: faker.location.state({ abbreviated: true }),
			zip_code: faker.location.zipCode()
		});
	}
}

/**
 * Initialize the InsuranceCompany model (table: "insurance_companies").
 */
InsuranceCompany.init({
	insurance_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	company_name: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	phone: {
		type: DataTypes.STRING(20),
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
	tableName: 'insurance_companies',
	timestamps: false
});
