-- Migración: Otorgar permisos en esquema public a roles anon y authenticated
-- Fecha: 2026-10-13
-- Descripción: Otorga permisos de uso de esquema y operaciones sobre tablas y secuencias
--              a los roles de Supabase (anon, authenticated, service_role) para permitir
--              operaciones de lectura/escritura mientras se implementan las políticas RLS.

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
