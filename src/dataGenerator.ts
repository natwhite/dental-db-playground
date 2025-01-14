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


export class DataGenerator {
	public static async generateOffice(): Promise<Office> {
		return await Office.create({
			office_name: faker.company.name(),
			brand_name: faker.company.buzzVerb(),
			address_line_1: faker.location.streetAddress(),
			city: faker.location.city(),
			state: faker.location.state({ abbreviated: true }),
			zip_code: faker.location.zipCode(),
			phone_number: faker.string.numeric('(###) ###-####')
		});
	}

	public static async generateDentist(office_id: number): Promise<Dentist> {
		return await Dentist.create({
			office_id: office_id,
			first_name: faker.person.firstName(),
			last_name: faker.person.lastName(),
			specialty: faker.helpers.arrayElement([
				'Pediatric Dentist',
				'Orthodontist',
				'Endodontist'
			]),
			email: faker.internet.email(),
			phone: faker.string.numeric('(###) ###-####'),
			hired_date: faker.date.past({ years: 5 })
		});
	}

	public static async generateGuardian(): Promise<Guardian> {
		return await Guardian.create({
			first_name: faker.person.firstName(),
			last_name: faker.person.lastName(),
			relationship: faker.helpers.arrayElement([
				'Mother',
				'Father',
				'Uncle',
				'Aunt',
				'Grandparent'
			]),
			phone_primary: faker.string.numeric('(###) ###-####'),
			phone_secondary: faker.string.numeric('(###) ###-####'),
			email: faker.internet.email(),
			address_line_1: faker.location.streetAddress(),
			city: faker.location.city(),
			state: faker.location.state({ abbreviated: true }),
			zip_code: faker.location.zipCode()
		});
	}

	public static async generatePatient(guardian_id: number, last_name?: string) {
		return await Patient.create({
			guardian_id: guardian_id,
			first_name: faker.person.firstName(),
			last_name: last_name || faker.person.lastName(), // Generate a random birthdate between 2010 and 2020
			date_of_birth: faker.date.between({
				from: '2010-01-01T00:00:00.000Z',
				to: '2020-01-01T00:00:00.000Z'
			}),
			gender: faker.helpers.arrayElement([
				'Male',
				'Female',
				'Non-binary'
			]),
			notes: faker.lorem.sentence()
		});
	}

	public static async generateInsuranceCompany() {
		return await InsuranceCompany.create({
			company_name: faker.company.name(),
			phone: faker.string.numeric('(###) ###-####'),
			address_line_1: faker.location.streetAddress(),
			address_line_2: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }),
			city: faker.location.city(),
			state: faker.location.state({ abbreviated: true }),
			zip_code: faker.location.zipCode()
		});
	}

	public static async generateInsurancePlan(insurance_id: number): Promise<InsurancePlan> {
		return await InsurancePlan.create({
			insurance_id: insurance_id,
			plan_name: faker.word.noun() + ' Plan',
			coverage_type: faker.helpers.arrayElement([
				'PPO',
				'HMO',
				'Dental Only'
			])
		});
	}

	public static async generatePatientInsurancePlan(
		patient_id: number,
		plan_id: number,
		is_primary: boolean
	): Promise<PatientInsurance> {
		return await PatientInsurance.create({
			patient_id: patient_id,
			plan_id: plan_id,
			is_primary: is_primary,
			coverage_start_date: faker.date.past({ years: 2 }),
			coverage_end_date: faker.helpers.maybe(() => faker.date.future({ years: 1 }), { probability: 0.2 })
		});
	}

	public static async generatePatientAppointment(patient_id: number, dentist_id: number): Promise<Appointment> {
		return await Appointment.create({
			patient_id: patient_id,
			dentist_id: dentist_id,
			appointment_datetime: faker.date.recent({ days: 300 }),
			reason_for_visit: faker.lorem.words(3),
			notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 })
		});
	}

	public static async generateAppointmentProcedure(appointment_id: number): Promise<Procedure> {
		return await Procedure.create({
			appointment_id: appointment_id,
			procedure_code: faker.string.alphanumeric(5).toUpperCase(),
			description: faker.lorem.words(3),
			standard_cost: Number(faker.finance.amount({
				min: 200,
				max: 10000,
				dec: 2
			}))
		});
	}


	public static async generateAppointmentInvoice(appointment_id: number, total: number): Promise<Invoice> {

		const discount = faker.number.float({
			min: 0,
			max: total * 0.2,
			multipleOf: 0.01
		});

		return await Invoice.create({
			appointment_id: appointment_id,
			total_amount: total,
			discount_amount: discount,
			due_date: faker.date.future({ years: 1 }),
			invoice_date: faker.date.recent({ days: 60 }),
			status: faker.helpers.arrayElement([
				'PENDING',
				'PAID',
				'CANCELED'
			])
		});
	}

	public static async generateInvoicePayment(
		invoice_id: number,
		total_amount: number,
		discount_amount: number,
		invoice_date: Date
	): Promise<Payment> {
		return await Payment.create({
			invoice_id: invoice_id,
			amount: Number(faker.finance.amount({
				// min: 10,
				max: Number(total_amount) - Number(discount_amount),
				dec: 2
			})),
			payment_date: faker.date.between({
				from: invoice_date,
				to: new Date()
			}),
			payment_method: faker.helpers.arrayElement([
				'CREDIT_CARD',
				'CHECK',
				'CASH'
			])
		});
	}

}