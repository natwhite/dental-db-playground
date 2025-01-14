// Enable source map support for clean error messages
import { install } from 'source-map-support';
import { DatabaseSeeder } from './databaseSeeder.js';


install();


(async () => {
	try {
		await DatabaseSeeder.seedOffices(5);
		await DatabaseSeeder.seedDentists({
			min: 2,
			max: 15,
		});
		await DatabaseSeeder.seedGuardians(20);
		await DatabaseSeeder.seedPatients({
			min: 1,
			max: 3,
		});
		await DatabaseSeeder.seedInsuranceCompanies(10);
		await DatabaseSeeder.seedInsurancePlans({
			min: 1,
			max: 4,
		});
		await DatabaseSeeder.seedPatientInsurancePlans({
			min: 0,
			max: 2
		});
		await DatabaseSeeder.seedPatientAppointments({
			min: 0,
			max: 4
		});
		await DatabaseSeeder.seedAppointmentProcedures({
			min: 0,
			max: 3
		});
		await DatabaseSeeder.seedAppointmentInvoices(0.1);
		await DatabaseSeeder.seedInvoicePayments({
			min: 0,
			max: 2
		});

		console.log('Seeding completed successfully!');
		process.exit(0);
	} catch (error) {
		console.error('Error in seeding process:', error);
		process.exit(1);
	}
})();
