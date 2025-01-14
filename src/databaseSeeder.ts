import {
	Appointment,
	Dentist,
	Guardian,
	InsuranceCompany,
	InsurancePlan,
	Invoice,
	Office,
	Patient,
	PatientInsurance,
	Payment,
	Procedure
} from './models/index.js';
import { faker } from '@faker-js/faker';
import { Decimal } from './lib/decimal.js';
import { DataGenerator } from './dataGenerator.js';


export class DatabaseSeeder {
	public static async createTables(): Promise<void> {
		// TODO : Sync doesn't recreate the generated columns correct, so we'll need to create the tables beforehand
		// 1) Sync all models (create tables if not exist)
		//    WARNING: force: true will DROP TABLES, then re-create them!
		// await sequelize.sync({ force: true });
		// console.log('All tables created (if they did not exist).');
	}

	public static async seedOffices(numOffices: number): Promise<void> {
		// 2) Seed OFFICES
		for (let i = 0; i < numOffices; i++) {
			await DataGenerator.generateOffice();
		}
		console.log('Offices seeded.');
	}

	public static async seedDentists(dentistsPerOffice: NumberRange): Promise<void> {
		// 3) Seed DENTISTS
		const offices: Office[] = await Office.findAll({ raw: true });
		for (const office of offices) {
			const dentistCount = faker.number.int(dentistsPerOffice);
			for (let i = 0; i < dentistCount; i++) {
				await DataGenerator.generateDentist(office.office_id);
			}
		}
		console.log('Dentists seeded.');
	}

	public static async seedGuardians(numGuardians: number): Promise<void> {
		// 4) Seed GUARDIANS
		for (let i = 0; i < numGuardians; i++) {
			await DataGenerator.generateGuardian();
		}
		console.log('Guardians seeded.');
	}

	public static async seedPatients(childrenPerGuardian: NumberRange): Promise<void> {
		// 5) Seed PATIENTS - For each Guardian, create between 1-3 children
		const guardians = await Guardian.findAll({ raw: true });
		for (const guardian of guardians) {
			const childCount = faker.number.int(childrenPerGuardian);

			for (let i = 0; i < childCount; i++) {
				await DataGenerator.generatePatient(guardian.guardian_id, guardian.last_name);
			}
		}
		console.log('Patients seeded.');
	}

	public static async seedInsuranceCompanies(numInsuranceCompanies: number): Promise<void> {
		// 6) Seed INSURANCE COMPANIES
		for (let i = 0; i < numInsuranceCompanies; i++) {
			await DataGenerator.generateInsuranceCompany();
		}
		console.log('Insurance companies seeded.');
	}

	public static async seedInsurancePlans(insurancePlansPerInsuranceCompany: NumberRange): Promise<void> {
		// 7) Seed INSURANCE PLANS (each company gets 1-4 plans)
		const insuranceCompanies: InsuranceCompany[] = await InsuranceCompany.findAll({ raw: true });
		for (const company of insuranceCompanies) {
			const planCount: number = faker.number.int(insurancePlansPerInsuranceCompany);

			for (let i = 0; i < planCount; i++) {
				await DataGenerator.generateInsurancePlan(company.insurance_id);
			}
		}
		console.log('Insurance plans seeded.');
	}

	public static async seedPatientInsurancePlans(insurancePlansPerPatient: NumberRange): Promise<void> {
		// 8) Link PATIENTS to random INSURANCE PLANS in PATIENT_INSURANCE
		const patients: Patient[] = await Patient.findAll({ raw: true });
		const insurancePlans: InsurancePlan[] = await InsurancePlan.findAll({ raw: true });
		for (const patient of patients) {
			const howManyPlans: number = faker.number.int(insurancePlansPerPatient);
			const shuffledPlans: InsurancePlan[] = faker.helpers.shuffle(insurancePlans);

			for (let i = 0; i < howManyPlans; i++) {
				await DataGenerator.generatePatientInsurancePlan(patient.patient_id, shuffledPlans[i].plan_id, i === 0);
			}
		}
		console.log('Patient insurance links seeded.');
	}

	public static async seedPatientAppointments(appointmentsPerPatient: NumberRange): Promise<void> {
		// 9) Seed APPOINTMENTS for each Patient
		const patients: Patient[] = await Patient.findAll({ raw: true });
		const dentists: Dentist[] = await Dentist.findAll({ raw: true });
		for (const patient of patients) {
			const appointmentCount: number = faker.number.int(appointmentsPerPatient);
			for (let i = 0; i < appointmentCount; i++) {
				// pick a random dentist
				const randomDentist = faker.helpers.arrayElement(dentists);

				await DataGenerator.generatePatientAppointment(patient.patient_id, randomDentist.dentist_id);
			}
		}
		console.log('Appointments seeded.');
	}

	public static async seedAppointmentProcedures(proceduresPerAppointment: NumberRange): Promise<void> {
		// 10) Seed PROCEDURES for each Appointment
		const appointments: Appointment[] = await Appointment.findAll({ raw: true });
		for (const appointment of appointments) {
			const procedureCount: number = faker.number.int(proceduresPerAppointment);
			for (let i = 0; i < procedureCount; i++) {
				await DataGenerator.generateAppointmentProcedure(appointment.appointment_id);
			}
		}
		console.log('Procedures seeded.');
	}

	public static async seedAppointmentInvoices(unpaidInvoiceLikelihood: number): Promise<void> {
		// 11) Seed INVOICES (one invoice per appointment, for simplicity)
		const appointments: Appointment[] = await Appointment.findAll({ raw: true });
		for (const appointment of appointments) {
			// sum up the procedure costs
			const procedures = await Procedure.findAll({
				where: { appointment_id: appointment.appointment_id },
				raw: true
			});

			// Skip creating an invoice if there are no scheduled procedures
			if (procedures.length <= 0) continue;

			if (Math.random() <= unpaidInvoiceLikelihood) continue;

			// Operating on floats in JS may result in results being slightly off (eg 4f/2f = 2.00000001, etc)
			// This is avoided by using a custom rounding function in the Decimal class
			const total = Decimal.round(procedures.reduce((sum, p) => sum + Number(p.standard_cost), 0), 2);

			await DataGenerator.generateAppointmentInvoice(appointment.appointment_id, total);
		}
		console.log('Invoices seeded.');
	}

	public static async seedInvoicePayments(paymentsPerInvoice: NumberRange): Promise<void> {
		// 12) Seed PAYMENTS for each Invoice
		const invoices = await Invoice.findAll({ raw: true });
		for (const invoice of invoices) {
			// TODO: add random logic - if status is 'PAID', create 1-2 random payments
			// if 'PENDING', maybe partial payment or none
			// if 'CANCELED', maybe no payments
			const paymentsCount = faker.number.int(paymentsPerInvoice);
			let remainingTotal = invoice.total_amount;
			for (let i = 0; i < paymentsCount; i++) {
				const payment = await DataGenerator.generateInvoicePayment(
					invoice.invoice_id,
					remainingTotal,
					invoice.discount_amount,
					invoice.invoice_date as Date,
				);
				// Using the Decimal class to prevent any math errors.
				remainingTotal = Decimal.round(remainingTotal - payment.amount, 2);
			}
		}
		console.log('Payments seeded.');
	}
}

export interface NumberRange {
	min: number;
	max: number;
}