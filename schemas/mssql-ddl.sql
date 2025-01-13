------------------------------------------------------------------
-- 1) Create / Switch Database
------------------------------------------------------------------
IF DB_ID(N'dental_db') IS NOT NULL
    BEGIN
        ALTER DATABASE [dental_db] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
        DROP DATABASE [dental_db];
    END;
GO

CREATE DATABASE [dental_db];
GO

USE [dental_db];
GO

------------------------------------------------------------------
-- 2) Offices
------------------------------------------------------------------
IF OBJECT_ID('dbo.offices', 'U') IS NOT NULL
    DROP TABLE dbo.offices;
GO

CREATE TABLE dbo.offices
(
    office_id      INT           IDENTITY(1,1) NOT NULL PRIMARY KEY,
    office_name    VARCHAR(100)  NOT NULL,
    brand_name     VARCHAR(100)  NOT NULL,
    address_line_1 VARCHAR(255)  NOT NULL,
    address_line_2 VARCHAR(255)  NULL,
    city           VARCHAR(100)  NOT NULL,
    state          VARCHAR(2)    NOT NULL,  -- e.g. 'AZ', 'TX'
    zip_code       VARCHAR(10)   NOT NULL,
    phone_number   VARCHAR(20)   NOT NULL,
    created_at     DATETIME2(0)  NOT NULL CONSTRAINT DF_offices_created_at DEFAULT (GETDATE()),
    updated_at     DATETIME2(0)  NOT NULL CONSTRAINT DF_offices_updated_at DEFAULT (GETDATE())
);
GO

------------------------------------------------------------------
-- 3) Dentists
------------------------------------------------------------------
IF OBJECT_ID('dbo.dentists', 'U') IS NOT NULL
    DROP TABLE dbo.dentists;
GO

CREATE TABLE dbo.dentists
(
    dentist_id  INT           IDENTITY(1,1) NOT NULL PRIMARY KEY,
    office_id   INT           NOT NULL,
    first_name  VARCHAR(100)  NOT NULL,
    last_name   VARCHAR(100)  NOT NULL,
    specialty   VARCHAR(100)  NULL,
    email       VARCHAR(100)  NULL,
    phone       VARCHAR(20)   NULL,
    hired_date  DATE          NOT NULL,
    created_at  DATETIME2(0)  NOT NULL CONSTRAINT DF_dentists_created_at DEFAULT (GETDATE()),
    updated_at  DATETIME2(0)  NOT NULL CONSTRAINT DF_dentists_updated_at DEFAULT (GETDATE()),

    CONSTRAINT fk_dentist_office
        FOREIGN KEY (office_id)
            REFERENCES dbo.offices (office_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);
GO

------------------------------------------------------------------
-- 4) Guardians
------------------------------------------------------------------
IF OBJECT_ID('dbo.guardians', 'U') IS NOT NULL
    DROP TABLE dbo.guardians;
GO

CREATE TABLE dbo.guardians
(
    guardian_id     INT           IDENTITY(1,1) NOT NULL PRIMARY KEY,
    first_name      VARCHAR(100)  NOT NULL,
    last_name       VARCHAR(100)  NOT NULL,
    relationship    VARCHAR(50)   NOT NULL,  -- e.g. 'Mother', 'Father', etc.
    phone_primary   VARCHAR(20)   NOT NULL,
    phone_secondary VARCHAR(20)   NULL,
    email           VARCHAR(100)  NULL,
    address_line_1  VARCHAR(255)  NOT NULL,
    address_line_2  VARCHAR(255)  NULL,
    city            VARCHAR(100)  NOT NULL,
    state           VARCHAR(2)    NOT NULL,
    zip_code        VARCHAR(10)   NOT NULL,
    created_at      DATETIME2(0)  NOT NULL CONSTRAINT DF_guardians_created_at DEFAULT (GETDATE()),
    updated_at      DATETIME2(0)  NOT NULL CONSTRAINT DF_guardians_updated_at DEFAULT (GETDATE())
);
GO

------------------------------------------------------------------
-- 5) Patients
------------------------------------------------------------------
IF OBJECT_ID('dbo.patients', 'U') IS NOT NULL
    DROP TABLE dbo.patients;
GO

CREATE TABLE dbo.patients
(
    patient_id    INT          IDENTITY(1,1) NOT NULL PRIMARY KEY,
    guardian_id   INT          NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    date_of_birth DATE         NOT NULL,
    gender        VARCHAR(10)  NULL,  -- 'Male', 'Female', 'Non-binary', etc.
    notes         TEXT         NULL,
    created_at    DATETIME2(0) NOT NULL CONSTRAINT DF_patients_created_at DEFAULT (GETDATE()),
    updated_at    DATETIME2(0) NOT NULL CONSTRAINT DF_patients_updated_at DEFAULT (GETDATE()),

    CONSTRAINT fk_patient_guardian
        FOREIGN KEY (guardian_id)
            REFERENCES dbo.guardians (guardian_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);
GO

------------------------------------------------------------------
-- 6) Insurance Companies
------------------------------------------------------------------
IF OBJECT_ID('dbo.insurance_companies', 'U') IS NOT NULL
    DROP TABLE dbo.insurance_companies;
GO

CREATE TABLE dbo.insurance_companies
(
    insurance_id   INT           IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_name   VARCHAR(255)  NOT NULL,
    phone          VARCHAR(20)   NOT NULL,
    address_line_1 VARCHAR(255)  NOT NULL,
    address_line_2 VARCHAR(255)  NULL,
    city           VARCHAR(100)  NOT NULL,
    state          VARCHAR(2)    NOT NULL,
    zip_code       VARCHAR(10)   NOT NULL,
    created_at     DATETIME2(0)  NOT NULL CONSTRAINT DF_ins_comp_created DEFAULT (GETDATE()),
    updated_at     DATETIME2(0)  NOT NULL CONSTRAINT DF_ins_comp_updated DEFAULT (GETDATE())
);
GO

------------------------------------------------------------------
-- 6.2) Insurance Plans
------------------------------------------------------------------
IF OBJECT_ID('dbo.insurance_plans', 'U') IS NOT NULL
    DROP TABLE dbo.insurance_plans;
GO

CREATE TABLE dbo.insurance_plans
(
    plan_id       INT          IDENTITY(1,1) NOT NULL PRIMARY KEY,
    insurance_id  INT          NOT NULL,
    plan_name     VARCHAR(255) NOT NULL,
    coverage_type VARCHAR(100) NOT NULL,  -- 'PPO', 'HMO', 'Dental Only'
    created_at    DATETIME2(0) NOT NULL CONSTRAINT DF_ins_plans_created DEFAULT (GETDATE()),
    updated_at    DATETIME2(0) NOT NULL CONSTRAINT DF_ins_plans_updated DEFAULT (GETDATE()),

    CONSTRAINT fk_plan_insurance_company
        FOREIGN KEY (insurance_id)
            REFERENCES dbo.insurance_companies (insurance_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);
GO

------------------------------------------------------------------
-- 7) Patient Insurance (Junction Table)
------------------------------------------------------------------
IF OBJECT_ID('dbo.patient_insurance', 'U') IS NOT NULL
    DROP TABLE dbo.patient_insurance;
GO

CREATE TABLE dbo.patient_insurance
(
    patient_id          INT         NOT NULL,
    plan_id             INT         NOT NULL,
    is_primary          BIT         NOT NULL DEFAULT 0,
    coverage_start_date DATE        NOT NULL,
    coverage_end_date   DATE        NULL,
    created_at          DATETIME2(0) NOT NULL CONSTRAINT DF_pat_ins_created DEFAULT (GETDATE()),

    CONSTRAINT PK_patient_insurance PRIMARY KEY (patient_id, plan_id),

    CONSTRAINT fk_patient_insurance_patient
        FOREIGN KEY (patient_id)
            REFERENCES dbo.patients (patient_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,

    CONSTRAINT fk_patient_insurance_plan
        FOREIGN KEY (plan_id)
            REFERENCES dbo.insurance_plans (plan_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);
GO

------------------------------------------------------------------
-- 8) Appointments
------------------------------------------------------------------
IF OBJECT_ID('dbo.appointments', 'U') IS NOT NULL
    DROP TABLE dbo.appointments;
GO

CREATE TABLE dbo.appointments
(
    appointment_id       INT          IDENTITY(1,1) NOT NULL PRIMARY KEY,
    patient_id           INT          NOT NULL,
    dentist_id           INT          NOT NULL,
    appointment_datetime DATETIME2(0) NOT NULL,
    reason_for_visit     VARCHAR(255) NULL,
    notes                TEXT         NULL,
    created_at           DATETIME2(0) NOT NULL CONSTRAINT DF_appts_created_at DEFAULT (GETDATE()),
    updated_at           DATETIME2(0) NOT NULL CONSTRAINT DF_appts_updated_at DEFAULT (GETDATE()),

    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patient_id)
            REFERENCES dbo.patients (patient_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,

    CONSTRAINT fk_appointment_dentist
        FOREIGN KEY (dentist_id)
            REFERENCES dbo.dentists (dentist_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);
GO

------------------------------------------------------------------
-- 9) Procedures
------------------------------------------------------------------
IF OBJECT_ID('dbo.procedures', 'U') IS NOT NULL
    DROP TABLE dbo.procedures;
GO

CREATE TABLE dbo.procedures
(
    procedure_id   INT            IDENTITY(1,1) NOT NULL PRIMARY KEY,
    appointment_id INT            NOT NULL,
    procedure_code VARCHAR(50)    NOT NULL,
    description    VARCHAR(255)   NOT NULL,
    standard_cost  DECIMAL(10, 2) NOT NULL,
    created_at     DATETIME2(0)   NOT NULL CONSTRAINT DF_procs_created_at DEFAULT (GETDATE()),
    updated_at     DATETIME2(0)   NOT NULL CONSTRAINT DF_procs_updated_at DEFAULT (GETDATE()),

    CONSTRAINT fk_procedure_appointment
        FOREIGN KEY (appointment_id)
            REFERENCES dbo.appointments (appointment_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);
GO

------------------------------------------------------------------
-- 10) Invoices
------------------------------------------------------------------
IF OBJECT_ID('dbo.invoices', 'U') IS NOT NULL
    DROP TABLE dbo.invoices;
GO

CREATE TABLE dbo.invoices
(
    invoice_id      INT            IDENTITY(1,1) NOT NULL PRIMARY KEY,
    appointment_id  INT            NOT NULL,
    total_amount    DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL CONSTRAINT DF_invoices_disc DEFAULT (0.00),
    -- Computed column: final_amount = total_amount - discount_amount
    final_amount    AS (total_amount - discount_amount) PERSISTED,

    due_date        DATE           NOT NULL,
    invoice_date    DATE           NOT NULL CONSTRAINT DF_invoices_invoice_dt DEFAULT (GETDATE()),
    status          VARCHAR(50)    NOT NULL CONSTRAINT DF_invoices_status DEFAULT ('PENDING'),
    created_at      DATETIME2(0)   NOT NULL CONSTRAINT DF_invoices_created_at DEFAULT (GETDATE()),
    updated_at      DATETIME2(0)   NOT NULL CONSTRAINT DF_invoices_updated_at DEFAULT (GETDATE()),

    CONSTRAINT fk_invoice_appointment
        FOREIGN KEY (appointment_id)
            REFERENCES dbo.appointments (appointment_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);
GO

------------------------------------------------------------------
-- 11) Payments
------------------------------------------------------------------
IF OBJECT_ID('dbo.payments', 'U') IS NOT NULL
    DROP TABLE dbo.payments;
GO

CREATE TABLE dbo.payments
(
    payment_id     INT            IDENTITY(1,1) NOT NULL PRIMARY KEY,
    invoice_id     INT            NOT NULL,
    amount         DECIMAL(10, 2) NOT NULL,
    payment_date   DATE           NOT NULL CONSTRAINT DF_payments_pay_dt DEFAULT (GETDATE()),
    payment_method VARCHAR(50)    NOT NULL,  -- e.g., 'CREDIT_CARD', 'CHECK', 'CASH'
    created_at     DATETIME2(0)   NOT NULL CONSTRAINT DF_payments_created_at DEFAULT (GETDATE()),
    updated_at     DATETIME2(0)   NOT NULL CONSTRAINT DF_payments_updated_at DEFAULT (GETDATE()),

    CONSTRAINT fk_payment_invoice
        FOREIGN KEY (invoice_id)
            REFERENCES dbo.invoices (invoice_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);
GO
