// src/models/Guardian.ts

import {DataTypes, Model, Optional} from 'sequelize';
import {sequelize} from '../db.js';
import {faker} from "@faker-js/faker";

/**
 * Guardian table columns (from your schema).
 */
interface GuardianAttributes {
    guardian_id: number;
    first_name: string;
    last_name: string;
    relationship: string;
    phone_primary: string;
    phone_secondary?: string;
    email?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    zip_code: string;
    created_at?: Date;
    updated_at?: Date;
}

/**
 * Which attributes can be omitted when creating a new Guardian record.
 */
interface GuardianCreationAttributes extends Optional<
    GuardianAttributes,
    'guardian_id' | 'phone_secondary' | 'email' | 'address_line_2' | 'created_at' | 'updated_at'
> {
}

/**
 * The Guardian model class.
 */
export class Guardian
    extends Model<GuardianAttributes, GuardianCreationAttributes>
    implements GuardianAttributes {
    declare public guardian_id: number;
    declare public first_name: string;
    declare public last_name: string;
    declare public relationship: string;
    declare public phone_primary: string;
    declare public phone_secondary?: string;
    declare public email?: string;
    declare public address_line_1: string;
    declare public address_line_2?: string;
    declare public city: string;
    declare public state: string;
    declare public zip_code: string;
    declare public created_at: Date;
    declare public updated_at: Date;

    public static async createRandom() {
        return await Guardian.create({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            relationship: faker.helpers.arrayElement(['Mother', 'Father', 'Uncle', 'Aunt', 'Grandparent']),
            phone_primary: faker.string.numeric('(###) ###-####'),
            phone_secondary: faker.string.numeric('(###) ###-####'),
            email: faker.internet.email(),
            address_line_1: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state({abbreviated: true}),
            zip_code: faker.location.zipCode()
        })
    }
}

/**
 * Initialize the Guardian model (table: "guardians").
 */
Guardian.init(
    {
        guardian_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        relationship: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        phone_primary: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        phone_secondary: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true
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
    },
    {
        sequelize,
        tableName: 'guardians',
        timestamps: false
    }
);
