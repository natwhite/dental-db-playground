-- Create the database (if needed)
CREATE DATABASE IF NOT EXISTS dental_db;

-- Switch to the newly created database
USE dental_db;

-- 2. Offices
-- A table to store information about different dental offices within Kids Dental Brands.

DROP TABLE IF EXISTS offices;
CREATE TABLE offices
(
    office_id      INT AUTO_INCREMENT PRIMARY KEY,
    office_name    VARCHAR(100) NOT NULL,
    brand_name     VARCHAR(100) NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city           VARCHAR(100) NOT NULL,
    state          VARCHAR(2)   NOT NULL, -- e.g., 'AZ', 'TX'
    zip_code       VARCHAR(10)  NOT NULL,
    phone_number   VARCHAR(20)  NOT NULL,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- 3. Dentists
-- A table to store the dental professionals. Each dentist is assigned to a specific office.

DROP TABLE IF EXISTS dentists;
CREATE TABLE dentists
(
    dentist_id INT AUTO_INCREMENT PRIMARY KEY,
    office_id  INT          NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    specialty  VARCHAR(100),
    email      VARCHAR(100),
    phone      VARCHAR(20),
    hired_date DATE         NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraints
    CONSTRAINT fk_dentist_office
        FOREIGN KEY (office_id)
            REFERENCES offices (office_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
) ENGINE = InnoDB;

-- 4. Guardians
-- A table to store the information of patients’ guardians (parents or legal representatives).

DROP TABLE IF EXISTS guardians;
CREATE TABLE guardians
(
    guardian_id     INT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    relationship    VARCHAR(50)  NOT NULL, -- e.g., 'Mother', 'Father', 'Uncle', etc.
    phone_primary   VARCHAR(20)  NOT NULL,
    phone_secondary VARCHAR(20),
    email           VARCHAR(100),
    address_line_1  VARCHAR(255) NOT NULL,
    address_line_2  VARCHAR(255),
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(2)   NOT NULL,
    zip_code        VARCHAR(10)  NOT NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- 5. Patients
-- A table to store child (or youth) patient information, referencing their primary guardian.

DROP TABLE IF EXISTS patients;
CREATE TABLE patients
(
    patient_id    INT AUTO_INCREMENT PRIMARY KEY,
    guardian_id   INT          NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    date_of_birth DATE         NOT NULL,
    gender        VARCHAR(10), -- e.g., 'Male', 'Female', 'Non-binary'
    notes         TEXT,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraints
    CONSTRAINT fk_patient_guardian
        FOREIGN KEY (guardian_id)
            REFERENCES guardians (guardian_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
) ENGINE = InnoDB;

-- 6. Insurance Companies & Plans
-- Two tables to store insurance company information and their plans. Often, patients have insurance coverage from different companies/plans.

-- 6.1. Insurance Companies
DROP TABLE IF EXISTS insurance_companies;
CREATE TABLE insurance_companies
(
    insurance_id   INT AUTO_INCREMENT PRIMARY KEY,
    company_name   VARCHAR(255) NOT NULL,
    phone          VARCHAR(20)  NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city           VARCHAR(100) NOT NULL,
    state          VARCHAR(2)   NOT NULL,
    zip_code       VARCHAR(10)  NOT NULL,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- 6.2. Insurance Plans
DROP TABLE IF EXISTS insurance_plans;
CREATE TABLE insurance_plans
(
    plan_id       INT AUTO_INCREMENT PRIMARY KEY,
    insurance_id  INT          NOT NULL,
    plan_name     VARCHAR(255) NOT NULL,
    coverage_type VARCHAR(100) NOT NULL, -- e.g., 'PPO', 'HMO', 'Dental Only'
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraints
    CONSTRAINT fk_plan_insurance_company
        FOREIGN KEY (insurance_id)
            REFERENCES insurance_companies (insurance_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
) ENGINE = InnoDB;

-- 7. Patient Insurance (Link Table)
-- A patient may have more than one insurance plan. This junction table ties patients to their insurance plans.
DROP TABLE IF EXISTS patient_insurance;
CREATE TABLE patient_insurance
(
    patient_id          INT        NOT NULL,
    plan_id             INT        NOT NULL,
    is_primary          TINYINT(1) NOT NULL DEFAULT 0,
    coverage_start_date DATE       NOT NULL,
    coverage_end_date   DATE,
    created_at          DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (patient_id, plan_id),

    CONSTRAINT fk_patient_insurance_patient
        FOREIGN KEY (patient_id)
            REFERENCES patients (patient_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,

    CONSTRAINT fk_patient_insurance_plan
        FOREIGN KEY (plan_id)
            REFERENCES insurance_plans (plan_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
) ENGINE = InnoDB;

-- 8. Appointments
-- This table captures appointment details linking patients to dentists.

DROP TABLE IF EXISTS appointments;
CREATE TABLE appointments
(
    appointment_id       INT AUTO_INCREMENT PRIMARY KEY,
    patient_id           INT      NOT NULL,
    dentist_id           INT      NOT NULL,
    appointment_datetime DATETIME NOT NULL,
    reason_for_visit     VARCHAR(255),
    notes                TEXT,
    created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraints
    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patient_id)
            REFERENCES patients (patient_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,

    CONSTRAINT fk_appointment_dentist
        FOREIGN KEY (dentist_id)
            REFERENCES dentists (dentist_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
) ENGINE = InnoDB;

-- 9. Procedures
-- A table for procedures performed during an appointment. An appointment can have multiple procedures.

DROP TABLE IF EXISTS procedures;
CREATE TABLE procedures
(
    procedure_id   INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT            NOT NULL,
    procedure_code VARCHAR(50)    NOT NULL, -- e.g., ADA procedure code
    description    VARCHAR(255)   NOT NULL,
    standard_cost  DECIMAL(10, 2) NOT NULL,
    created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraints
    CONSTRAINT fk_procedure_appointment
        FOREIGN KEY (appointment_id)
            REFERENCES appointments (appointment_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
) ENGINE = InnoDB;

-- 10. Invoices
-- A table to capture billing information for a given appointment.
-- Each appointment typically leads to a single invoice, but it’s possible that an appointment might have multiple invoices or partial invoices.

DROP TABLE IF EXISTS invoices;
CREATE TABLE invoices
(
    invoice_id      INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id  INT            NOT NULL,
    total_amount    DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    final_amount    DECIMAL(10, 2) GENERATED ALWAYS AS (total_amount - discount_amount) STORED,
    due_date        DATE           NOT NULL,
    invoice_date    DATE           NOT NULL DEFAULT (CURRENT_DATE),
    status          VARCHAR(50)    NOT NULL DEFAULT 'PENDING', -- e.g., 'PENDING', 'PAID', 'CANCELED'
    created_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraints
    CONSTRAINT fk_invoice_appointment
        FOREIGN KEY (appointment_id)
            REFERENCES appointments (appointment_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
) ENGINE = InnoDB;

-- 11. Payments
-- This table records each payment made against a particular invoice.
-- An invoice can have multiple payments if the patient (or insurance) pays in installments.

DROP TABLE IF EXISTS payments;
CREATE TABLE payments
(
    payment_id     INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id     INT            NOT NULL,
    amount         DECIMAL(10, 2) NOT NULL,
    payment_date   DATE           NOT NULL DEFAULT (CURRENT_DATE),
    payment_method VARCHAR(50)    NOT NULL, -- e.g., 'CREDIT_CARD', 'CHECK', 'CASH'
    created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraints
    CONSTRAINT fk_payment_invoice
        FOREIGN KEY (invoice_id)
            REFERENCES invoices (invoice_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
) ENGINE = InnoDB;
