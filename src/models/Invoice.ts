// src/models/Invoice.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';


/**
 * Invoice table columns.
 */
interface InvoiceAttributes {
	invoice_id: number;
	appointment_id: number;
	total_amount: number;
	discount_amount: number;
	final_amount?: number; // This might be a virtual or calculated column
	due_date: Date;
	invoice_date?: Date;
	status?: 'PENDING' | 'PAID' | 'CANCELED';
	created_at?: Date;
	updated_at?: Date;
}

/**
 * Fields that can be omitted when creating a new Invoice record.
 * e.g. invoice_id is auto-increment, invoice_date/status might have defaults.
 */
interface InvoiceCreationAttributes
	extends Optional<InvoiceAttributes, | 'invoice_id' | 'invoice_date' | 'status' | 'final_amount' | 'created_at' | 'updated_at'> {
}

/**
 * The Invoice model class.
 */
export class Invoice
	extends Model<InvoiceAttributes, InvoiceCreationAttributes>
	implements InvoiceAttributes {
	declare public invoice_id: number;
	declare public appointment_id: number;
	declare public total_amount: number;
	declare public discount_amount: number;
	declare public final_amount?: number;
	declare public due_date: Date;
	declare public invoice_date?: Date;
	declare public status?: 'PENDING' | 'PAID' | 'CANCELED';
	declare public created_at: Date;
	declare public updated_at: Date;
}

/**
 * Initialize the Invoice model (table: "invoices").
 *
 * Note: If you'd like `final_amount` to be a computed field (via the DB),
 * you might consider making it a virtual column in Sequelize, or storing it
 * as a persisted generated column (depending on your DB setup).
 */
Invoice.init({
	invoice_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	appointment_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false
	},
	total_amount: {
		type: DataTypes.DECIMAL(10, 2),
		allowNull: false
	},
	discount_amount: {
		type: DataTypes.DECIMAL(10, 2),
		allowNull: false,
		defaultValue: 0.0
	},
	/**
	 * If your MariaDB table defines final_amount as
	 * a generated/stored column (like `final_amount
	 * GENERATED ALWAYS AS (total_amount - discount_amount) STORED`),
	 * you can represent this as a read-only column in Sequelize.
	 *
	 * For example:
	 *
	 * final_amount: {
	 *   type: DataTypes.VIRTUAL(DataTypes.DECIMAL(10,2), ['total_amount', 'discount_amount']),
	 *   get() {
	 *     const total = this.getDataValue('total_amount');
	 *     const discount = this.getDataValue('discount_amount');
	 *     return total - discount;
	 *   }
	 * }
	 *
	 * Or if it's truly stored, you might do something else.
	 */
	final_amount: {
		type: DataTypes.DECIMAL(10, 2),
		get() {
			return this.getDataValue('final_amount');
		},
		allowNull: true
	},
	due_date: {
		type: DataTypes.DATEONLY,
		allowNull: false
	},
	invoice_date: {
		type: DataTypes.DATEONLY,
		allowNull: false,
		defaultValue: DataTypes.NOW
	},
	status: {
		type: DataTypes.ENUM('PENDING', 'PAID', 'CANCELED'),
		allowNull: false,
		defaultValue: 'PENDING'
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
	tableName: 'invoices',
	timestamps: false
});
