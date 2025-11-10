-- DUNAB Database Initialization Script
-- This script creates the initial database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables will be handled by Hibernate
-- This file is for initial data seeding if needed

-- You can add initial data here, for example:
-- INSERT INTO categoria_transaccion (nombre, descripcion, tipo) VALUES
--   ('Alimentación', 'Gastos en comedor universitario', 'EGRESO'),
--   ('Transporte', 'Gastos en transporte', 'EGRESO'),
--   ('Eventos', 'Pago de eventos universitarios', 'EGRESO'),
--   ('Beca', 'Ingreso por beca', 'INGRESO');

SELECT 'Database initialized successfully' as status;
