// src/models/Appointment.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';
import {faker} from "@faker-js/faker";

/**
 * Appointment table columns (from the schema).
 */
interface AppointmentAttributes {
    appointment_id: number;
    patient_id: number;
    dentist_id: number;
    appointment_datetime: Date;
    reason_for_visit?: string;
    notes?: string;
    created_at?: Date;
    updated_at?: Date;
}

/**
 * Fields you can omit when creating a new Appointment
 * (e.g., appointment_id autoincrement, reason_for_visit/notes optional).
 */
interface AppointmentCreationAttributes
    extends Optional<
        AppointmentAttributes,
        'appointment_id' | 'reason_for_visit' | 'notes' | 'created_at' | 'updated_at'
    > {}

/**
 * The Appointment model class.
 */
export class Appointment
    extends Model<AppointmentAttributes, AppointmentCreationAttributes>
    implements AppointmentAttributes
{
    declare public appointment_id: number;
    declare public patient_id: number;
    declare public dentist_id: number;
    declare public appointment_datetime: Date;
    declare public reason_for_visit?: string;
    declare public notes?: string;
    declare public created_at: Date;
    declare public updated_at: Date;


    public static async createRandom(patient_id: number, dentist_id: number): Promise<Appointment> {
        return await Appointment.create({
            patient_id: patient_id,
            dentist_id: dentist_id,
            appointment_datetime: faker.date.recent({days: 300}),
            reason_for_visit: faker.lorem.words(3),
            notes: faker.helpers.maybe(() => faker.lorem.sentence(), {probability: 0.3})
        })
    }
}

/**
 * Initialize the Appointment model (table: "appointments").
 */
Appointment.init(
    {
        appointment_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        patient_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        dentist_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        appointment_datetime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        reason_for_visit: {
            type: DataTypes.STRING(255),
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
    },
    {
        sequelize,
        tableName: 'appointments',
        timestamps: false
    }
);
