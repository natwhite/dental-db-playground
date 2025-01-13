// src/models/Patient.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';
import { faker } from '@faker-js/faker';


/**
 * Patient table columns.
 */
interface PatientAttributes {
	patient_id: number;
	guardian_id: number;
	first_name: string;
	last_name: string;
	date_of_birth: Date;
	gender?: string;
	notes?: string;
	created_at?: Date;
	updated_at?: Date;
}

/**
 * Which fields can be omitted when creating a new Patient record.
 */
interface PatientCreationAttributes
	extends Optional<PatientAttributes, 'patient_id' | 'gender' | 'notes' | 'created_at' | 'updated_at'> {
}

/**
 * The Patient model class.
 */
export class Patient
	extends Model<PatientAttributes, PatientCreationAttributes>
	implements PatientAttributes {
	declare public patient_id: number;
	declare public guardian_id: number;
	declare public first_name: string;
	declare public last_name: string;
	declare public date_of_birth: Date;
	declare public gender?: string;
	declare public notes?: string;
	declare public created_at: Date;
	declare public updated_at: Date;

	public static async createRandom(guardian_id: number, last_name?: string) {
		return await Patient.create({
			guardian_id: guardian_id,
			first_name: faker.person.firstName(),
			last_name: last_name || faker.person.lastName(), // Generate a random birthdate between 2010 and 2020
			date_of_birth: faker.date.between({
				from: '2010-01-01T00:00:00.000Z',
				to: '2020-01-01T00:00:00.000Z'
			}),
			gender: faker.helpers.arrayElement([
				'Male',
				'Female',
				'Non-binary'
			]),
			notes: faker.lorem.sentence()
		});
	}
}

/**
 * Initialize the Patient model (table: "patients").
 */
Patient.init({
	patient_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	guardian_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false
	},
	first_name: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	last_name: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	date_of_birth: {
		type: DataTypes.DATEONLY,
		allowNull: false
	},
	gender: {
		type: DataTypes.STRING(10),
		allowNull: true
	},
	notes: {
		type: DataTypes.TEXT,
		allowNull: true
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
	tableName: 'patients',
	timestamps: false
});
