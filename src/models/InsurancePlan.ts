// src/models/InsurancePlan.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';


/**
 * Define the shape of an InsurancePlan record in the DB.
 */
interface InsurancePlanAttributes {
	plan_id: number;
	insurance_id: number;
	plan_name: string;
	coverage_type: string;
	created_at?: Date;
	updated_at?: Date;
}

/**
 * Attributes that can be omitted when creating a new InsurancePlan record.
 */
interface InsurancePlanCreationAttributes
	extends Optional<InsurancePlanAttributes, 'plan_id' | 'created_at' | 'updated_at'> {
}

/**
 * The InsurancePlan model class.
 */
export class InsurancePlan
	extends Model<InsurancePlanAttributes, InsurancePlanCreationAttributes>
	implements InsurancePlanAttributes {
	declare public plan_id: number;
	declare public insurance_id: number;
	declare public plan_name: string;
	declare public coverage_type: string;
	declare public created_at: Date;
	declare public updated_at: Date;
}

/**
 * Initialize the InsurancePlan model (table: "insurance_plans").
 */
InsurancePlan.init({
	plan_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	insurance_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false
	},
	plan_name: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	coverage_type: {
		type: DataTypes.STRING(100),
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
	tableName: 'insurance_plans',
	timestamps: false
});
