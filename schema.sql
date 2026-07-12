-- =====================================================================
-- TransitOps — Smart Transport Operations Platform
-- SQLite Database Schema  (ported from the MySQL version for local
-- use in VS Code — e.g. with the "SQLite" or "SQLite Viewer" extension,
-- or the sqlite3 CLI / DB Browser for SQLite)
-- =====================================================================
-- HOW TO RUN
--   1. In a VS Code terminal:  sqlite3 transitops.db < transitops_sqlite.sql
--      This creates a single file  transitops.db  containing everything.
--   2. Open transitops.db with a SQLite VS Code extension to browse/query,
--      or keep using: sqlite3 transitops.db  then run SQL interactively.
--   3. IMPORTANT: SQLite does not enforce foreign keys or full referential
--      behavior unless you run  PRAGMA foreign_keys = ON;  in EVERY new
--      connection/session (the .sql file below turns it on for the run
--      that creates the DB, but most GUI extensions open their own
--      connection and need you to run that pragma yourself first,
--      or set it in the extension's settings).
-- =====================================================================

PRAGMA foreign_keys = ON;

-- Clean slate if re-running against an existing file
DROP VIEW IF EXISTS vw_license_expiry_watch;
DROP VIEW IF EXISTS vw_vehicle_roi;
DROP VIEW IF EXISTS vw_fuel_efficiency_per_vehicle;
DROP VIEW IF EXISTS vw_operational_cost_per_vehicle;
DROP VIEW IF EXISTS vw_vehicle_status_breakdown;
DROP VIEW IF EXISTS vw_dashboard_kpis;

DROP TRIGGER IF EXISTS trg_maint_au_close;
DROP TRIGGER IF EXISTS trg_maint_ai_open;
DROP TRIGGER IF EXISTS trg_trip_au_cancel;
DROP TRIGGER IF EXISTS trg_trip_au_complete;
DROP TRIGGER IF EXISTS trg_trip_au_dispatch;
DROP TRIGGER IF EXISTS trg_trip_bu_validate;
DROP TRIGGER IF EXISTS trg_trip_biu_validate;

DROP TABLE IF EXISTS trip_revenue;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS fuel_logs;
DROP TABLE IF EXISTS maintenance_logs;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- =====================================================================
-- 1. ROLES  (Fleet Manager, Dispatcher, Safety Officer, Financial Analyst)
-- =====================================================================
CREATE TABLE roles (
    role_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name   TEXT NOT NULL UNIQUE
);

INSERT INTO roles (role_name) VALUES
    ('Fleet Manager'),
    ('Dispatcher'),
    ('Safety Officer'),
    ('Financial Analyst');

-- =====================================================================
-- 2. USERS  (Authentication)
-- =====================================================================
CREATE TABLE users (
    user_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name       TEXT NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    role_id         INTEGER NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT 1,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until    TEXT,
    last_login_at   TEXT,
    created_at      TEXT NOT NULL DEFAULT (DATETIME('now')),
    updated_at      TEXT NOT NULL DEFAULT (DATETIME('now')),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Role-permission matrix (from Settings & RBAC mockup: Fleet/Drivers/Trips/Fuel&Exp/Analytics)
CREATE TABLE role_permissions (
    role_id     INTEGER NOT NULL,
    module      TEXT NOT NULL CHECK (module IN ('Fleet','Drivers','Trips','Maintenance','Fuel_Expenses','Analytics','Settings')),
    can_view    BOOLEAN NOT NULL DEFAULT 0,
    can_edit    BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (role_id, module),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- =====================================================================
-- 3. VEHICLES  (Vehicle Registry)
-- =====================================================================
CREATE TABLE vehicles (
    vehicle_id            INTEGER PRIMARY KEY AUTOINCREMENT,
    registration_number   TEXT NOT NULL UNIQUE,
    name_model            TEXT NOT NULL,
    vehicle_type          TEXT NOT NULL CHECK (vehicle_type IN ('Van','Truck','Mini','Other')),
    max_load_capacity_kg  NUMERIC NOT NULL CHECK (max_load_capacity_kg > 0),
    odometer_km           NUMERIC NOT NULL DEFAULT 0,
    acquisition_cost       NUMERIC NOT NULL DEFAULT 0,
    region                  TEXT,
    status                   TEXT NOT NULL DEFAULT 'Available'
                              CHECK (status IN ('Available','On Trip','In Shop','Retired')),
    created_at                TEXT NOT NULL DEFAULT (DATETIME('now')),
    updated_at                TEXT NOT NULL DEFAULT (DATETIME('now'))
);

-- =====================================================================
-- 4. DRIVERS  (Drivers & Safety Profiles)
-- =====================================================================
CREATE TABLE drivers (
    driver_id            INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name            TEXT NOT NULL,
    license_number       TEXT NOT NULL UNIQUE,
    license_category     TEXT NOT NULL,
    license_expiry_date  TEXT NOT NULL,
    contact_number       TEXT NOT NULL,
    safety_score         NUMERIC NOT NULL DEFAULT 100.0,
    status                TEXT NOT NULL DEFAULT 'Available'
                           CHECK (status IN ('Available','On Trip','Off Duty','Suspended')),
    created_at             TEXT NOT NULL DEFAULT (DATETIME('now')),
    updated_at             TEXT NOT NULL DEFAULT (DATETIME('now'))
);

-- =====================================================================
-- 5. TRIPS  (Trip Dispatcher)
-- =====================================================================
CREATE TABLE trips (
    trip_id               INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_code             TEXT NOT NULL UNIQUE,
    source                TEXT NOT NULL,
    destination           TEXT NOT NULL,
    vehicle_id            INTEGER,
    driver_id             INTEGER,
    cargo_weight_kg       NUMERIC NOT NULL,
    planned_distance_km   NUMERIC NOT NULL,
    actual_distance_km    NUMERIC,
    fuel_consumed_liters  NUMERIC,
    status                 TEXT NOT NULL DEFAULT 'Draft'
                            CHECK (status IN ('Draft','Dispatched','Completed','Cancelled')),
    dispatched_at           TEXT,
    completed_at             TEXT,
    cancelled_at              TEXT,
    created_by                 INTEGER,
    created_at                   TEXT NOT NULL DEFAULT (DATETIME('now')),
    updated_at                     TEXT NOT NULL DEFAULT (DATETIME('now')),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
    FOREIGN KEY (driver_id)  REFERENCES drivers(driver_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- =====================================================================
-- 6. MAINTENANCE LOGS
-- =====================================================================
CREATE TABLE maintenance_logs (
    maintenance_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id        INTEGER NOT NULL,
    service_type      TEXT NOT NULL,
    cost               NUMERIC NOT NULL DEFAULT 0,
    service_date        TEXT NOT NULL,
    status                TEXT NOT NULL DEFAULT 'In Shop' CHECK (status IN ('In Shop','Completed')),
    notes                  TEXT,
    closed_at                TEXT,
    created_at                  TEXT NOT NULL DEFAULT (DATETIME('now')),
    updated_at                    TEXT NOT NULL DEFAULT (DATETIME('now')),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);

-- =====================================================================
-- 7. FUEL LOGS
-- =====================================================================
CREATE TABLE fuel_logs (
    fuel_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id   INTEGER NOT NULL,
    trip_id      INTEGER,
    log_date     TEXT NOT NULL,
    liters       NUMERIC NOT NULL CHECK (liters > 0),
    cost         NUMERIC NOT NULL CHECK (cost >= 0),
    created_at   TEXT NOT NULL DEFAULT (DATETIME('now')),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
    FOREIGN KEY (trip_id)    REFERENCES trips(trip_id)
);

-- =====================================================================
-- 8. EXPENSES  (tolls / misc, separate from fuel & maintenance)
-- =====================================================================
CREATE TABLE expenses (
    expense_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id     INTEGER NOT NULL,
    trip_id        INTEGER,
    expense_type   TEXT NOT NULL DEFAULT 'Toll' CHECK (expense_type IN ('Toll','Misc','Other')),
    amount         NUMERIC NOT NULL CHECK (amount >= 0),
    expense_date   TEXT NOT NULL,
    status         TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Rejected')),
    created_at     TEXT NOT NULL DEFAULT (DATETIME('now')),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
    FOREIGN KEY (trip_id)    REFERENCES trips(trip_id)
);

-- Optional: revenue per trip, needed for ROI calc in Reports & Analytics
CREATE TABLE trip_revenue (
    trip_id   INTEGER PRIMARY KEY,
    revenue   NUMERIC NOT NULL DEFAULT 0,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id)
);

-- =====================================================================
-- INDEXES
-- =====================================================================
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_type   ON vehicles(vehicle_type);
CREATE INDEX idx_drivers_status  ON drivers(status);
CREATE INDEX idx_trips_status    ON trips(status);
CREATE INDEX idx_trips_vehicle   ON trips(vehicle_id);
CREATE INDEX idx_trips_driver    ON trips(driver_id);
CREATE INDEX idx_maint_vehicle   ON maintenance_logs(vehicle_id);
CREATE INDEX idx_fuel_vehicle    ON fuel_logs(vehicle_id);
CREATE INDEX idx_exp_vehicle     ON expenses(vehicle_id);

-- =====================================================================
-- TRIGGERS — enforce mandatory business rules
-- (SQLite has no SIGNAL/DELIMITER; validation uses RAISE(ABORT, msg),
--  and status cascades run as separate AFTER triggers.)
-- =====================================================================

-- Rule: cargo weight <= capacity; vehicle must be Available to dispatch;
-- driver must be Available & license not expired to dispatch;
-- vehicle/driver can't be double-booked into two active trips.
CREATE TRIGGER trg_trip_biu_validate
BEFORE INSERT ON trips
BEGIN
    SELECT RAISE(ABORT, 'Cargo weight exceeds vehicle maximum load capacity')
    WHERE NEW.vehicle_id IS NOT NULL
      AND NEW.cargo_weight_kg > (SELECT max_load_capacity_kg FROM vehicles WHERE vehicle_id = NEW.vehicle_id);

    SELECT RAISE(ABORT, 'Vehicle is not Available for dispatch')
    WHERE NEW.status = 'Dispatched' AND NEW.vehicle_id IS NOT NULL
      AND (SELECT status FROM vehicles WHERE vehicle_id = NEW.vehicle_id) <> 'Available';

    SELECT RAISE(ABORT, 'Driver is unavailable, suspended, or license expired')
    WHERE NEW.status = 'Dispatched' AND NEW.driver_id IS NOT NULL
      AND (
            (SELECT status FROM drivers WHERE driver_id = NEW.driver_id) <> 'Available'
            OR (SELECT license_expiry_date FROM drivers WHERE driver_id = NEW.driver_id) < DATE('now')
          );

    SELECT RAISE(ABORT, 'Vehicle or driver is already assigned to an active trip')
    WHERE NEW.status = 'Dispatched' AND EXISTS (
        SELECT 1 FROM trips
        WHERE status = 'Dispatched'
          AND (vehicle_id = NEW.vehicle_id OR driver_id = NEW.driver_id)
    );
END;

-- Same validation, but for a Draft/Cancelled -> Dispatched transition via UPDATE
CREATE TRIGGER trg_trip_bu_validate
BEFORE UPDATE ON trips
WHEN NEW.status = 'Dispatched' AND OLD.status <> 'Dispatched'
BEGIN
    SELECT RAISE(ABORT, 'Cargo weight exceeds vehicle maximum load capacity')
    WHERE NEW.vehicle_id IS NOT NULL
      AND NEW.cargo_weight_kg > (SELECT max_load_capacity_kg FROM vehicles WHERE vehicle_id = NEW.vehicle_id);

    SELECT RAISE(ABORT, 'Vehicle is not Available for dispatch')
    WHERE (SELECT status FROM vehicles WHERE vehicle_id = NEW.vehicle_id) <> 'Available';

    SELECT RAISE(ABORT, 'Driver is unavailable, suspended, or license expired')
    WHERE (SELECT status FROM drivers WHERE driver_id = NEW.driver_id) <> 'Available'
       OR (SELECT license_expiry_date FROM drivers WHERE driver_id = NEW.driver_id) < DATE('now');
END;

-- Rule: Dispatching a trip -> vehicle & driver become 'On Trip'
CREATE TRIGGER trg_trip_au_dispatch
AFTER UPDATE ON trips
WHEN NEW.status = 'Dispatched' AND OLD.status <> 'Dispatched'
BEGIN
    UPDATE trips SET dispatched_at = DATETIME('now') WHERE trip_id = NEW.trip_id;
    UPDATE vehicles SET status = 'On Trip' WHERE vehicle_id = NEW.vehicle_id;
    UPDATE drivers  SET status = 'On Trip' WHERE driver_id  = NEW.driver_id;
END;

-- Rule: Completing a trip -> vehicle & driver become 'Available'; odometer updates
CREATE TRIGGER trg_trip_au_complete
AFTER UPDATE ON trips
WHEN NEW.status = 'Completed' AND OLD.status = 'Dispatched'
BEGIN
    UPDATE trips SET completed_at = DATETIME('now') WHERE trip_id = NEW.trip_id;
    UPDATE vehicles SET status = 'Available',
           odometer_km = odometer_km + IFNULL(NEW.actual_distance_km, 0)
           WHERE vehicle_id = NEW.vehicle_id;
    UPDATE drivers SET status = 'Available' WHERE driver_id = NEW.driver_id;
END;

-- Rule: Cancelling a dispatched trip -> vehicle & driver restored to 'Available'
CREATE TRIGGER trg_trip_au_cancel
AFTER UPDATE ON trips
WHEN NEW.status = 'Cancelled' AND OLD.status = 'Dispatched'
BEGIN
    UPDATE trips SET cancelled_at = DATETIME('now') WHERE trip_id = NEW.trip_id;
    UPDATE vehicles SET status = 'Available' WHERE vehicle_id = NEW.vehicle_id;
    UPDATE drivers  SET status = 'Available' WHERE driver_id  = NEW.driver_id;
END;

-- Rule: Creating an active maintenance record -> vehicle becomes 'In Shop'
CREATE TRIGGER trg_maint_ai_open
AFTER INSERT ON maintenance_logs
WHEN NEW.status = 'In Shop'
BEGIN
    UPDATE vehicles SET status = 'In Shop' WHERE vehicle_id = NEW.vehicle_id AND status <> 'Retired';
END;

-- Rule: Closing maintenance -> vehicle restored to 'Available' unless Retired
CREATE TRIGGER trg_maint_au_close
AFTER UPDATE ON maintenance_logs
WHEN NEW.status = 'Completed' AND OLD.status = 'In Shop'
BEGIN
    UPDATE maintenance_logs SET closed_at = DATETIME('now') WHERE maintenance_id = NEW.maintenance_id;
    UPDATE vehicles SET status = 'Available'
    WHERE vehicle_id = NEW.vehicle_id AND status <> 'Retired';
END;

-- =====================================================================
-- VIEWS — power the Dashboard KPIs and Reports & Analytics screens
-- =====================================================================

CREATE VIEW vw_dashboard_kpis AS
SELECT
    (SELECT COUNT(*) FROM vehicles WHERE status <> 'Retired')                         AS active_vehicles,
    (SELECT COUNT(*) FROM vehicles WHERE status = 'Available')                        AS available_vehicles,
    (SELECT COUNT(*) FROM vehicles WHERE status = 'In Shop')                          AS vehicles_in_maintenance,
    (SELECT COUNT(*) FROM trips WHERE status = 'Dispatched')                          AS active_trips,
    (SELECT COUNT(*) FROM trips WHERE status = 'Draft')                               AS pending_trips,
    (SELECT COUNT(*) FROM drivers WHERE status = 'On Trip')                           AS drivers_on_duty,
    ROUND(
        (SELECT COUNT(*) FROM vehicles WHERE status = 'On Trip') * 100.0 /
        NULLIF((SELECT COUNT(*) FROM vehicles WHERE status <> 'Retired'), 0), 1
    ) AS fleet_utilization_pct;

CREATE VIEW vw_vehicle_status_breakdown AS
SELECT status, COUNT(*) AS vehicle_count
FROM vehicles
GROUP BY status;

CREATE VIEW vw_operational_cost_per_vehicle AS
SELECT
    v.vehicle_id,
    v.registration_number,
    v.name_model,
    COALESCE(f.total_fuel_cost, 0)         AS total_fuel_cost,
    COALESCE(m.total_maintenance_cost, 0)  AS total_maintenance_cost,
    COALESCE(e.total_other_expenses, 0)    AS total_other_expenses,
    COALESCE(f.total_fuel_cost, 0) + COALESCE(m.total_maintenance_cost, 0) AS operational_cost
FROM vehicles v
LEFT JOIN (SELECT vehicle_id, SUM(cost) AS total_fuel_cost FROM fuel_logs GROUP BY vehicle_id) f
       ON f.vehicle_id = v.vehicle_id
LEFT JOIN (SELECT vehicle_id, SUM(cost) AS total_maintenance_cost FROM maintenance_logs GROUP BY vehicle_id) m
       ON m.vehicle_id = v.vehicle_id
LEFT JOIN (SELECT vehicle_id, SUM(amount) AS total_other_expenses FROM expenses GROUP BY vehicle_id) e
       ON e.vehicle_id = v.vehicle_id;

CREATE VIEW vw_fuel_efficiency_per_vehicle AS
SELECT
    v.vehicle_id,
    v.registration_number,
    ROUND(SUM(t.actual_distance_km) * 1.0 / NULLIF(SUM(t.fuel_consumed_liters), 0), 2) AS km_per_liter
FROM vehicles v
JOIN trips t ON t.vehicle_id = v.vehicle_id AND t.status = 'Completed'
GROUP BY v.vehicle_id, v.registration_number;

CREATE VIEW vw_vehicle_roi AS
SELECT
    v.vehicle_id,
    v.registration_number,
    v.acquisition_cost,
    COALESCE(SUM(tr.revenue), 0)              AS total_revenue,
    COALESCE(oc.operational_cost, 0)          AS total_operational_cost,
    ROUND(
        (COALESCE(SUM(tr.revenue), 0) - COALESCE(oc.operational_cost, 0)) * 1.0
        / NULLIF(v.acquisition_cost, 0), 4
    ) AS roi
FROM vehicles v
LEFT JOIN trips t ON t.vehicle_id = v.vehicle_id
LEFT JOIN trip_revenue tr ON tr.trip_id = t.trip_id
LEFT JOIN vw_operational_cost_per_vehicle oc ON oc.vehicle_id = v.vehicle_id
GROUP BY v.vehicle_id, v.registration_number, v.acquisition_cost, oc.operational_cost;

CREATE VIEW vw_license_expiry_watch AS
SELECT driver_id, full_name, license_number, license_expiry_date,
       CAST(julianday(license_expiry_date) - julianday('now') AS INTEGER) AS days_to_expiry,
       CASE WHEN license_expiry_date < DATE('now') THEN 'Expired'
            WHEN julianday(license_expiry_date) - julianday('now') <= 30 THEN 'Expiring Soon'
            ELSE 'Valid' END AS expiry_status
FROM drivers
ORDER BY license_expiry_date ASC;

-- =====================================================================
-- SAMPLE / SEED DATA  (mirrors the mockup screens)
-- =====================================================================

INSERT INTO users (full_name, email, password_hash, role_id) VALUES
    ('Ranjeet K.', 'ranjeet@transitops.io', 'REPLACE_WITH_REAL_HASH', 2), -- Dispatcher
    ('Meera S.',   'meera@transitops.io',   'REPLACE_WITH_REAL_HASH', 1), -- Fleet Manager
    ('Kabir D.',   'kabir@transitops.io',   'REPLACE_WITH_REAL_HASH', 3), -- Safety Officer
    ('Alia F.',    'alia@transitops.io',    'REPLACE_WITH_REAL_HASH', 4); -- Financial Analyst
-- NOTE: password_hash values above are placeholders. In the real app,
-- hash passwords with bcrypt/argon2 in your application layer before
-- inserting — never store or generate password hashes in raw SQL.

-- Vehicles start life as Available; On Trip / In Shop states below are
-- reached naturally further down via trip dispatch and maintenance inserts
-- (this exercises the business-rule triggers exactly as the app would).
INSERT INTO vehicles (registration_number, name_model, vehicle_type, max_load_capacity_kg, odometer_km, acquisition_cost, region, status) VALUES
    ('GTJ01AB1234', 'Van-05',   'Van',   500.00, 42000, 850000, 'Surat',    'Available'),
    ('GTJ01BE5678', 'Truck-11', 'Truck', 5000.00, 88000, 2200000, 'Ahmedabad', 'Available'),
    ('GTJ01AB9012', 'Mini-03',  'Mini',  1000.00, 15000, 450000, 'Surat',    'Available'),
    ('GTJ01BE0034', 'Van-09',   'Van',   500.00, 61000, 780000, 'Vadodara', 'Available');

INSERT INTO drivers (full_name, license_number, license_category, license_expiry_date, contact_number, safety_score, status) VALUES
    ('Alex',  'DL-89325', 'LMV', '2028-12-01', '9876500001', 96.0, 'Available'),
    ('John',  'DL-44520', 'HMV', '2026-05-20', '9876500002', 87.0, 'Suspended'),
    ('Priya', 'DL-77031', 'LMV', '2027-02-14', '9876500003', 99.0, 'Available'),
    ('Suresh','DL-40045', 'LMV', '2027-01-02', '9876500004', 88.0, 'Off Duty');

-- Trips are created as Draft, then dispatched via UPDATE so the triggers
-- flip vehicle/driver status to 'On Trip' automatically (mirrors real UI flow).
INSERT INTO trips (trip_code, source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, status, created_by) VALUES
    ('TR001', 'Gandhinagar Depot', 'Ahmedabad Hub',       1, 1, 450.00, 45,  'Draft', 1),
    ('TR004', 'Vatva Industrial Area', 'Sanand Warehouse', 2, 3, 3200.00, 30, 'Draft', 1),
    ('TR006', 'Morbi', 'Kalol Depot', NULL, NULL, 700.00, 38, 'Draft', 1);

UPDATE trips SET status = 'Dispatched' WHERE trip_code = 'TR001';
UPDATE trips SET status = 'Dispatched' WHERE trip_code = 'TR004';
-- TR006 stays in Draft (no vehicle/driver assigned yet, as in the mockup)

-- Creating this maintenance record automatically flips vehicle 4 to 'In Shop'
INSERT INTO maintenance_logs (vehicle_id, service_type, cost, service_date, status) VALUES
    (4, 'Oil Change', 2600, '2026-07-05', 'In Shop');

INSERT INTO fuel_logs (vehicle_id, log_date, liters, cost) VALUES
    (1, '2026-07-01', 42, 3960),
    (2, '2026-07-04', 80, 8400);

INSERT INTO expenses (vehicle_id, expense_type, amount, expense_date, status) VALUES
    (1, 'Toll', 120, '2026-07-01', 'Pending'),
    (2, 'Toll', 340, '2026-07-04', 'Approved');

-- =====================================================================
-- Example queries matching the Reports & Analytics screen
-- =====================================================================
-- SELECT * FROM vw_dashboard_kpis;
-- SELECT * FROM vw_operational_cost_per_vehicle;
-- SELECT * FROM vw_fuel_efficiency_per_vehicle;
-- SELECT * FROM vw_vehicle_roi;
-- SELECT * FROM vw_license_expiry_watch;