// src/models/Procedure.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';


/**
 * Procedure table columns.
 */
interface ProcedureAttributes {
	procedure_id: number;
	appointment_id: number;
	procedure_code: string;
	description: string;
	standard_cost: number;
	created_at?: Date;
	updated_at?: Date;
}

/**
 * Fields that can be omitted when creating a new Procedure record.
 */
interface ProcedureCreationAttributes
	extends Optional<ProcedureAttributes, 'procedure_id' | 'created_at' | 'updated_at'> {
}

/**
 * The Procedure model class.
 */
export class Procedure
	extends Model<ProcedureAttributes, ProcedureCreationAttributes>
	implements ProcedureAttributes {
	declare public procedure_id: number;
	declare public appointment_id: number;
	declare public procedure_code: string;
	declare public description: string;
	declare public standard_cost: number;
	declare public created_at: Date;
	declare public updated_at: Date;
}

/**
 * Initialize the Procedure model (table: "procedures").
 */
Procedure.init({
	procedure_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	appointment_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false
	},
	procedure_code: {
		type: DataTypes.STRING(50),
		allowNull: false
	},
	description: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	standard_cost: {
		type: DataTypes.DECIMAL(10, 2),
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
	tableName: 'procedures',
	timestamps: false
});
