// src/models/Payment.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';


/**
 * Payment table columns.
 */
interface PaymentAttributes {
	payment_id: number;
	invoice_id: number;
	amount: number;
	payment_date?: Date;
	payment_method: string;
	created_at?: Date;
	updated_at?: Date;
}

/**
 * Fields that can be omitted when creating a new Payment.
 */
interface PaymentCreationAttributes
	extends Optional<PaymentAttributes, 'payment_id' | 'payment_date' | 'created_at' | 'updated_at'> {
}

/**
 * The Payment model class.
 */
export class Payment
	extends Model<PaymentAttributes, PaymentCreationAttributes>
	implements PaymentAttributes {
	declare public payment_id: number;
	declare public invoice_id: number;
	declare public amount: number;
	declare public payment_date?: Date;
	declare public payment_method: string;
	declare public created_at: Date;
	declare public updated_at: Date;
}

/**
 * Initialize the Payment model (table: "payments").
 */
Payment.init({
	payment_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	invoice_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false
	},
	amount: {
		type: DataTypes.DECIMAL(10, 2),
		allowNull: false
	},
	payment_date: {
		type: DataTypes.DATEONLY,
		allowNull: false,
		defaultValue: DataTypes.NOW
	},
	payment_method: {
		type: DataTypes.STRING(50),
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
	tableName: 'payments',
	timestamps: false
});
