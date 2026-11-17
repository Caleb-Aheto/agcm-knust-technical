-- AGCM - KNUST Technical Department Portal
-- PostgreSQL Backend Blueprint for Java Spring Boot

CREATE TABLE venues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    length_meters NUMERIC(6, 2),
    width_meters NUMERIC(6, 2),
    dx2496_delay_ms NUMERIC(6, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_schedules (
    id SERIAL PRIMARY KEY,
    venue_id INTEGER REFERENCES venues(id),
    service_name VARCHAR(120) NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    ministry_tag VARCHAR(80)
);

CREATE TABLE hardware_faults (
    id SERIAL PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    port_or_fader VARCHAR(50) NOT NULL,
    fault_status VARCHAR(30) NOT NULL DEFAULT 'BYPASSED',
    notes TEXT
);

CREATE TABLE channel_patches (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES service_schedules(id),
    console_channel INTEGER NOT NULL CHECK (console_channel BETWEEN 1 AND 32),
    stagebox_port INTEGER NOT NULL CHECK (stagebox_port BETWEEN 1 AND 32),
    instrument_label VARCHAR(100) NOT NULL,
    phantom_48v BOOLEAN DEFAULT FALSE,
    hpf_hz INTEGER DEFAULT 80,
    gain_db NUMERIC(4, 1)
);

-- Seed known hardware faults bypassed by Smart Stagebox Auto-Patch Allocator
INSERT INTO hardware_faults (device_name, port_or_fader, fault_status, notes) VALUES
('AudioLink Stagebox', 'Port 2', 'DEAD', 'Bypassed by Auto-Patch Allocator'),
('AudioLink Stagebox', 'Port 5', 'DEAD', 'Bypassed by Auto-Patch Allocator'),
('AudioLink Stagebox', 'Port 19', 'DEAD', 'Bypassed by Auto-Patch Allocator'),
('AudioLink Stagebox', 'Port 20', 'DEAD', 'Bypassed by Auto-Patch Allocator'),
('AudioLink Stagebox', 'Port 21', 'DEAD', 'Bypassed by Auto-Patch Allocator'),
('AudioLink Stagebox', 'Port 30', 'DEAD', 'Bypassed by Auto-Patch Allocator'),
('AudioLink Stagebox', 'Port 32', 'DEAD', 'Bypassed by Auto-Patch Allocator'),
('PreSonus StudioLive 32SX', 'Fader 18', 'BROKEN', 'Bypassed in FOH channel layout');
