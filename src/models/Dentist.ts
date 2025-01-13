// src/models/Dentist.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';
import { faker } from '@faker-js/faker';


/**
 * Define the shape of the Dentist record in the database.
 */
interface DentistAttributes {
	dentist_id: number;
	office_id: number;
	first_name: string;
	last_name: string;
	specialty?: string;
	email?: string;
	phone?: string;
	hired_date: Date;
	created_at?: Date;
	updated_at?: Date;
}

/**
 * Fields that can be omitted when creating a new Dentist record.
 * For instance, `dentist_id` is auto-incremented,
 * and `created_at`, `updated_at` have default values.
 */
interface DentistCreationAttributes
	extends Optional<DentistAttributes, 'dentist_id' | 'created_at' | 'updated_at'> {
}

/**
 * The Dentist model class.
 */
export class Dentist
	extends Model<DentistAttributes, DentistCreationAttributes>
	implements DentistAttributes {
	declare public dentist_id: number;
	declare public office_id: number;
	declare public first_name: string;
	declare public last_name: string;
	declare public specialty?: string;
	declare public email?: string;
	declare public phone?: string;
	declare public hired_date: Date;
	declare public created_at: Date;
	declare public updated_at: Date;

	public static async createRandom(office_id: number): Promise<Dentist> {
		return await Dentist.create({
			office_id: office_id,
			first_name: faker.person.firstName(),
			last_name: faker.person.lastName(),
			specialty: faker.helpers.arrayElement([
				'Pediatric Dentist',
				'Orthodontist',
				'Endodontist'
			]),
			email: faker.internet.email(),
			phone: faker.string.numeric('(###) ###-####'),
			hired_date: faker.date.past({ years: 5 })
		});
	}
}

/**
 * Initialize the Dentist model (table: "dentists").
 */
Dentist.init({
	dentist_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	office_id: {
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
	specialty: {
		type: DataTypes.STRING(100),
		allowNull: true
	},
	email: {
		type: DataTypes.STRING(100),
		allowNull: true
	},
	phone: {
		type: DataTypes.STRING(20),
		allowNull: true
	},
	hired_date: {
		type: DataTypes.DATEONLY,
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
	tableName: 'dentists',
	timestamps: false // We'll control created_at & updated_at ourselves or via triggers
});
