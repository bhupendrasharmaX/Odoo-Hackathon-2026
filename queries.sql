-- =============================================
-- TransitOps - Database Test Queries
-- =============================================

------------------------------------------------
-- 1. ROLES
------------------------------------------------
SELECT * FROM roles;

------------------------------------------------
-- 2. USERS
------------------------------------------------
SELECT * FROM users;

SELECT full_name, email
FROM users
WHERE is_active = 1;

------------------------------------------------
-- 3. VEHICLES
------------------------------------------------
SELECT * FROM vehicles;

SELECT registration_number, name_model, status
FROM vehicles
WHERE status = 'Available';

SELECT registration_number, name_model
FROM vehicles
WHERE status = 'On Trip';

SELECT registration_number, odometer_km
FROM vehicles
ORDER BY odometer_km DESC;

------------------------------------------------
-- 4. DRIVERS
------------------------------------------------
SELECT * FROM drivers;

SELECT full_name, status
FROM drivers
WHERE status = 'Available';

SELECT full_name, safety_score
FROM drivers
ORDER BY safety_score DESC;

------------------------------------------------
-- 5. TRIPS
------------------------------------------------
SELECT * FROM trips;

SELECT trip_code, source, destination
FROM trips
WHERE status = 'Draft';

SELECT trip_code, source, destination
FROM trips
WHERE status = 'Dispatched';

SELECT trip_code, actual_distance_km
FROM trips
WHERE status = 'Completed';

------------------------------------------------
-- 6. MAINTENANCE
------------------------------------------------
SELECT * FROM maintenance_logs;

SELECT *
FROM maintenance_logs
WHERE status = 'In Shop';

------------------------------------------------
-- 7. FUEL LOGS
------------------------------------------------
SELECT * FROM fuel_logs;

SELECT vehicle_id,
       SUM(liters) AS total_liters,
       SUM(cost) AS total_cost
FROM fuel_logs
GROUP BY vehicle_id;

------------------------------------------------
-- 8. EXPENSES
------------------------------------------------
SELECT * FROM expenses;

SELECT expense_type,
       SUM(amount) AS total_amount
FROM expenses
GROUP BY expense_type;

------------------------------------------------
-- 9. TRIP REVENUE
------------------------------------------------
SELECT * FROM trip_revenue;

------------------------------------------------
-- 10. VEHICLE + DRIVER + TRIP DETAILS
------------------------------------------------
SELECT
    t.trip_code,
    v.registration_number,
    d.full_name AS driver_name,
    t.source,
    t.destination,
    t.status
FROM trips t
JOIN vehicles v
ON t.vehicle_id = v.vehicle_id
JOIN drivers d
ON t.driver_id = d.driver_id;

------------------------------------------------
-- 11. TOTAL EXPENSE PER VEHICLE
------------------------------------------------
SELECT
    v.registration_number,
    SUM(e.amount) AS total_expense
FROM vehicles v
LEFT JOIN expenses e
ON v.vehicle_id = e.vehicle_id
GROUP BY v.vehicle_id;

------------------------------------------------
-- 12. TOTAL FUEL COST PER VEHICLE
------------------------------------------------
SELECT
    v.registration_number,
    SUM(f.cost) AS fuel_cost
FROM vehicles v
LEFT JOIN fuel_logs f
ON v.vehicle_id = f.vehicle_id
GROUP BY v.vehicle_id;

------------------------------------------------
-- 13. TOTAL TRIPS PER DRIVER
------------------------------------------------
SELECT
    d.full_name,
    COUNT(t.trip_id) AS total_trips
FROM drivers d
LEFT JOIN trips t
ON d.driver_id = t.driver_id
GROUP BY d.driver_id;

------------------------------------------------
-- 14. DASHBOARD VIEWS
------------------------------------------------
SELECT * FROM vw_dashboard_kpis;

SELECT * FROM vw_vehicle_status_breakdown;

SELECT * FROM vw_operational_cost_per_vehicle;

SELECT * FROM vw_fuel_efficiency_per_vehicle;

SELECT * FROM vw_vehicle_roi;

SELECT * FROM vw_license_expiry_watch;