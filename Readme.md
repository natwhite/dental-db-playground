# Project Overview

This project demonstrates how to build a sample dental practice database using Node.js, TypeScript, [Sequelize](https://sequelize.org/), and [faker-js](https://github.com/faker-js/faker). It includes a realistic schema for a pediatric dental practice, with tables and relationships that model core entities (offices, dentists, guardians, patients, insurance plans, appointments, invoices, payments, etc.). You can use this demo to practice writing queries, explore Sequelize associations, and understand relational database design in a practical, real-world setting.

> **Note**: Although the code references a fictitious pediatric dental scenario, this repository was built as a **learning tool**. No actual company details are provided.

## Features

- **TypeScript + ESM**: Modern JavaScript imports and strict typing.
- **Sequelize ORM**: Easy model definitions and associations for MariaDB/MySQL.
- **Advanced Schema**:  
  - **Offices** linked to **Dentists**  
  - **Guardians** linked to **Patients**  
  - **Appointments**, **Procedures**, **Invoices**, **Payments**  
  - **Insurance** entities with many-to-many relationships for coverage
- **Faker Seed Script**:
  - Generates realistic random data (names, addresses, phone numbers, dates)  
  - Illustrates how to quickly fill a test database for demo or QA purposes

## Installation

1. **Clone or Download** this repository.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:  
   Create a `.env` file at the project root (or wherever suits your setup), with details like:
   ```ini
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=dental_db
   DB_DIALECT=mysql
   ```
4. **Initialize the Database**:  
   Make sure you have a running MariaDB or MySQL server. Create an empty database named `dental_db` (or the name you specified in `.env`).

5. **Run the Seeding Script**:
   ```bash
   npm run seed
   ```
   > This will create all tables (dropping existing ones, if `force: true` is set) and fill them with random test data.

## Usage

- **Viewing Data**: After running the seed script, you can inspect tables and data using any SQL client (e.g., MySQL CLI, phpMyAdmin, DBeaver).
- **Customizing**: Modify the `seed.ts` logic to change how many records are generated, add new columns, or alter seeding patterns.
- **Associations**: Each model in the `models/` folder is linked in `index.ts` for clear, illustrative relationships.

## Project Structure

```
├── package.json
├── tsconfig.json
├── .env.example
├── src
│   ├── db.ts             // Sequelize init
│   ├── models
│   │   ├── index.ts      // Model associations
│   │   ├── Office.ts
│   │   ├── Dentist.ts
│   │   ├── Guardian.ts
│   │   ├── Patient.ts
│   │   ├── InsuranceCompany.ts
│   │   ├── InsurancePlan.ts
│   │   ├── PatientInsurance.ts
│   │   ├── Appointment.ts
│   │   ├── Procedure.ts
│   │   ├── Invoice.ts
│   │   └── Payment.ts
│   └── seed.ts           // Main seeding script
└── ...
```

## Contributing

1. **Fork** this repository.
2. **Create** a new branch for your features or fixes.
3. **Commit** your changes, then push to your fork.
4. **Open a Pull Request**. We welcome suggestions for improving the schema or seed logic!

## License

This project is open-source. Feel free to clone, modify, and use the code in your own projects for educational or commercial purposes, subject to the terms of the included license (MIT or similar).

## Contact

If you have any questions, feel free to open an issue or submit a pull request.
