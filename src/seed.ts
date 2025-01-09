// Enable source map support for clean error messages
import {install} from 'source-map-support';
install()

import {faker} from '@faker-js/faker';
import {
    sequelize,
    Office,
    Dentist,
    Guardian,
    Patient, Payment,
    InsuranceCompany,
    InsurancePlan,
    PatientInsurance,
    Appointment,
    Procedure,
    Invoice,
} from './models/index.js';

(async () => {
    try {
        // 1) Sync all models (create tables if not exist)
        //    WARNING: force: true will DROP TABLES, then re-create them!
        await sequelize.sync({force: true});
        console.log('All tables created (if they did not exist).');

        // 2) Seed OFFICES
        for (let i = 0; i < 5; i++) {
            await Office.createRandom();
        }
        console.log('Offices seeded.');

        // 3) Seed DENTISTS - For each Office, create between 2-5 dentists
        const offices: Office[] = await Office.findAll({raw: true});
        for (const office of offices) {
            const dentistCount = faker.number.int({min: 2, max: 5});
            for (let i = 0; i < dentistCount; i++) {
                await Dentist.createRandom(office.office_id)
            }
        }
        console.log('Dentists seeded.');

        // 4) Seed GUARDIANS
        for (let i = 0; i < 10; i++) {
            await Guardian.createRandom();
        }
        console.log('Guardians seeded.');

        // 5) Seed PATIENTS - For each Guardian, create between 1-3 children
        const guardians = await Guardian.findAll({raw: true});
        for (const guardian of guardians) {
            const childCount = faker.number.int({min: 1, max: 3});

            for (let i = 0; i < childCount; i++) {
                await Patient.createRandom(guardian.guardian_id, guardian.last_name)
            }
        }
        console.log('Patients seeded.');

        // 6) Seed INSURANCE COMPANIES
        for (let i = 0; i < 5; i++) {
            await InsuranceCompany.createRandom();
        }
        console.log('Insurance companies seeded.');

        // 7) Seed INSURANCE PLANS (each company gets 2-3 plans)
        const insuranceCompanies = await InsuranceCompany.findAll({raw: true});
        for (const company of insuranceCompanies) {
            const planCount = faker.number.int({min: 2, max: 3});

            for (let i = 0; i < planCount; i++) {
                await InsurancePlan.createRandom(company.insurance_id);
            }
        }
        console.log('Insurance plans seeded.');

        // 8) Link PATIENTS to random INSURANCE PLANS in PATIENT_INSURANCE
        const patients: Patient[] = await Patient.findAll({raw: true});
        const insurancePlans: InsurancePlan[] = await InsurancePlan.findAll({raw: true});
        for (const patient of patients) {
            // each patient may have 0-2 insurance plans
            const howManyPlans: number = faker.number.int({min: 0, max: 2});
            const shuffledPlans: InsurancePlan[] = faker.helpers.shuffle(insurancePlans);

            for (let i = 0; i < howManyPlans; i++) {
                await PatientInsurance.createRandom(
                    patient.patient_id,
                    shuffledPlans[i].plan_id,
                    i === 0
                )
            }
        }
        console.log('Patient insurance links seeded.');

        // 9) Seed APPOINTMENTS for each Patient
        const dentists = await Dentist.findAll({raw: true});
        for (const patient of patients) {
            // each patient may have 1-4 appointments
            const appointmentCount = faker.number.int({min: 1, max: 4});
            for (let i = 0; i < appointmentCount; i++) {
                // pick a random dentist
                const randomDentist = faker.helpers.arrayElement(dentists);

                await Appointment.createRandom(patient.patient_id, randomDentist.dentist_id)
            }
        }
        console.log('Appointments seeded.');

        // 10) Seed PROCEDURES for each Appointment
        const appointments: Appointment[] = await Appointment.findAll({raw: true});
        for (const appointment of appointments) {
            // each appointment can have 1-3 procedures
            const procedureCount: number = faker.number.int({min: 1, max: 3});
            for (let i = 0; i < procedureCount; i++) {
                await Procedure.createRandom(appointment.appointment_id)
            }
        }
        console.log('Procedures seeded.');

        // 11) Seed INVOICES (one invoice per appointment, for simplicity)
        for (const appointment of appointments) {
            // sum up the procedure costs
            const procedures = await Procedure.findAll({
                where: {appointment_id: appointment.appointment_id},
                raw: true
            });
            const total = procedures.reduce((sum, p) => sum + Number(p.standard_cost), 0);

            await Invoice.createRandom(appointment.appointment_id, total)
        }
        console.log('Invoices seeded.');

        // 12) Seed PAYMENTS for each Invoice
        const invoices = await Invoice.findAll({raw: true});
        for (const invoice of invoices) {
            // random logic: if status is 'PAID', create 1-2 random payments
            // if 'PENDING', maybe partial payment or none
            // if 'CANCELED', maybe no payments
            const paymentsCount = faker.number.int({min: 0, max: 2});
            let remainingTotal = invoice.total_amount
            for (let i = 0; i < paymentsCount; i++) {
                const payment = await Payment.createRandom(
                    invoice.invoice_id,
                    remainingTotal,
                    invoice.discount_amount,
                    invoice.invoice_date as Date,
                )
                remainingTotal -= payment.amount
            }
        }
        console.log('Payments seeded.');

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error in seeding process:', error);
        process.exit(1);
    }
})();
