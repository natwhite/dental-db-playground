// src/models/index.ts
import { sequelize } from '../db.js';

import { Office } from './Office.js';
import { Dentist } from './Dentist.js';

import { Guardian } from './Guardian.js';
import { Patient } from './Patient.js';

import { InsuranceCompany } from './InsuranceCompany.js';
import { InsurancePlan } from './InsurancePlan.js';
import { PatientInsurance } from './PatientInsurance.js';

import { Appointment } from './Appointment.js';
import { Procedure } from './Procedure.js';
import { Invoice } from './Invoice.js';
import { Payment } from './Payment.js';

// ----- OFFICE <-> DENTIST -----
// One Office can have many Dentists
Office.hasMany(Dentist, { foreignKey: 'office_id' });
Dentist.belongsTo(Office, { foreignKey: 'office_id' });

// ----- GUARDIAN <-> PATIENT -----
// One Guardian can have many Patients
Guardian.hasMany(Patient, { foreignKey: 'guardian_id' });
Patient.belongsTo(Guardian, { foreignKey: 'guardian_id' });

// ----- PATIENT <-> APPOINTMENT -----
// One Patient can have many Appointments
Patient.hasMany(Appointment, { foreignKey: 'patient_id' });
Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });

// ----- DENTIST <-> APPOINTMENT -----
// One Dentist can have many Appointments
Dentist.hasMany(Appointment, { foreignKey: 'dentist_id' });
Appointment.belongsTo(Dentist, { foreignKey: 'dentist_id' });

// ----- APPOINTMENT <-> PROCEDURE -----
// One Appointment can have many Procedures
Appointment.hasMany(Procedure, { foreignKey: 'appointment_id' });
Procedure.belongsTo(Appointment, { foreignKey: 'appointment_id' });

// ----- APPOINTMENT <-> INVOICE -----
// One Appointment can have many Invoices
Appointment.hasMany(Invoice, { foreignKey: 'appointment_id' });
Invoice.belongsTo(Appointment, { foreignKey: 'appointment_id' });

// ----- INVOICE <-> PAYMENT -----
// One Invoice can have many Payments
Invoice.hasMany(Payment, { foreignKey: 'invoice_id' });
Payment.belongsTo(Invoice, { foreignKey: 'invoice_id' });

// ----- INSURANCE COMPANY <-> INSURANCE PLAN -----
// One InsuranceCompany can have many InsurancePlans
InsuranceCompany.hasMany(InsurancePlan, { foreignKey: 'insurance_id' });
InsurancePlan.belongsTo(InsuranceCompany, { foreignKey: 'insurance_id' });

// ----- PATIENT <-> INSURANCE PLAN (via PATIENT_INSURANCE) -----
// A Patient can be covered by many InsurancePlans, and an InsurancePlan can cover many Patients
Patient.belongsToMany(InsurancePlan, {
    through: PatientInsurance,
    foreignKey: 'patient_id',
    otherKey: 'plan_id'
});
InsurancePlan.belongsToMany(Patient, {
    through: PatientInsurance,
    foreignKey: 'plan_id',
    otherKey: 'patient_id'
});

// Export the sequelize instance and all models, if desired:
export {
    sequelize,
    Office,
    Dentist,
    Guardian,
    Patient,
    InsuranceCompany,
    InsurancePlan,
    PatientInsurance,
    Appointment,
    Procedure,
    Invoice,
    Payment
};