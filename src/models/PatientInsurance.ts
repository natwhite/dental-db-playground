// src/models/PatientInsurance.ts

import {DataTypes, Model} from 'sequelize';
import {sequelize} from '../db.js';
import {faker} from "@faker-js/faker";

/**
 * PatientInsurance represents the many-to-many relationship
 * between a Patient and an InsurancePlan.
 */
interface PatientInsuranceAttributes {
    patient_id: number;
    plan_id: number;
    is_primary: boolean;
    coverage_start_date: Date;
    coverage_end_date?: Date | null;
    created_at?: Date;
}

/**
 * We can make all fields *required* except created_at, because in your schema
 * patient_id + plan_id is the composite primary key, and
 * coverage_end_date can be null.
 *
 * If needed, you can define a separate interface to omit certain fields on creation,
 * but often for a link/junction table, we just treat all fields (except timestamps)
 * as mandatory.
 */
export class PatientInsurance
    extends Model<PatientInsuranceAttributes>
    implements PatientInsuranceAttributes {
    declare public patient_id: number;
    declare public plan_id: number;
    declare public is_primary: boolean;
    declare public coverage_start_date: Date;
    declare public coverage_end_date?: Date | null;
    declare public created_at: Date;

    public static async createRandom(patient_id: number, plan_id: number, is_primary: boolean): Promise<PatientInsuranceAttributes> {
        return await PatientInsurance.create({
            patient_id: patient_id,
            plan_id: plan_id,
            is_primary: is_primary,
            coverage_start_date: faker.date.past({years: 2}),
            coverage_end_date: faker.helpers.maybe(
                () => faker.date.future({years: 1}),
                {probability: 0.2}
            )
        });
    }
}

/**
 * Initialize the PatientInsurance model (table: "patient_insurance").
 *
 * You may want to define a composite primary key on (patient_id, plan_id).
 * In Sequelize, you can do that by marking both fields as primaryKey: true.
 */
PatientInsurance.init(
    {
        patient_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        plan_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        is_primary: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        coverage_start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        coverage_end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        tableName: 'patient_insurance',
        timestamps: false // no automatic updatedAt, etc.
    }
);
