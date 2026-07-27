-- Seed stations (Lagos, Abuja, Port Harcourt)
INSERT INTO stations (name, address, latitude, longitude, brand) VALUES
('NNPC Plaza', 'Herbert Macaulay Way, Central Business District, Abuja', 9.0645, 7.4875, 'NNPC'),
('TotalEnergies - Victoria Island', 'Adetokunbo Ademola St, Victoria Island, Lagos', 6.4281, 3.4219, 'TotalEnergies'),
('Mobil - Lekki Phase 1', 'Lekki-Epe Expressway, Lekki, Lagos', 6.4369, 3.4612, 'Mobil'),
('Ardova PLC (AP) - Ikeja', 'Obafemi Awolowo Way, Ikeja, Lagos', 6.5967, 3.3421, 'AP'),
('Enyo Retail - Port Harcourt', 'Aba Road, Port Harcourt', 4.8156, 7.0124, 'Enyo'),
('Conoil - Wuse Zone 6', 'Herbert Macaulay Way, Wuse, Abuja', 9.0682, 7.4641, 'Conoil');

-- Seed initial reports for each station
-- Station 1: NNPC Plaza (Abuja) - Active PMS report, Short queue
INSERT INTO reports (station_id, fuel_type, price_per_litre, is_available, queue_length, upvotes, created_at) VALUES
(1, 'PMS', 650.00, 1, 'Short', 5, datetime('now', '-30 minutes'));

-- Station 2: TotalEnergies (VI, Lagos) - Active PMS report, Moderate queue, also AGO available
INSERT INTO reports (station_id, fuel_type, price_per_litre, is_available, queue_length, upvotes, created_at) VALUES
(2, 'PMS', 620.00, 1, 'Moderate', 12, datetime('now', '-1 hour')),
(2, 'AGO', 1100.00, 1, 'None', 3, datetime('now', '-1 hour'));

-- Station 3: Mobil (Lekki, Lagos) - Out of stock (PMS)
INSERT INTO reports (station_id, fuel_type, price_per_litre, is_available, queue_length, upvotes, created_at) VALUES
(3, 'PMS', 0.00, 0, 'None', 8, datetime('now', '-15 minutes'));

-- Station 4: AP (Ikeja, Lagos) - PMS available, Long queue
INSERT INTO reports (station_id, fuel_type, price_per_litre, is_available, queue_length, upvotes, created_at) VALUES
(4, 'PMS', 615.00, 1, 'Long', 20, datetime('now', '-45 minutes'));

-- Station 5: Enyo (Port Harcourt) - PMS available, None queue
INSERT INTO reports (station_id, fuel_type, price_per_litre, is_available, queue_length, upvotes, created_at) VALUES
(5, 'PMS', 670.00, 1, 'None', 2, datetime('now', '-3 hours'));

-- Station 6: Conoil (Wuse, Abuja) - Stale report (over 12 hours ago)
INSERT INTO reports (station_id, fuel_type, price_per_litre, is_available, queue_length, upvotes, created_at) VALUES
(6, 'PMS', 645.00, 1, 'Short', 1, datetime('now', '-14 hours'));
