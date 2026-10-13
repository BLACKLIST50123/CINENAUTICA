-- Migración: Seed inicial de datos de referencia
-- Fecha: 2026-10-12
-- Descripción: Inserta los niveles del programa de lealtad "Socio Náutica"
--              y verifica los roles existentes.
-- Reglas de negocio (AGENTS.md §4):
--   Bronce: 0-299 pts, multiplicador 1.0×
--   Plata:  300-799 pts, multiplicador 1.10×, fila preferencial
--   Oro:    800+ pts, multiplicador 1.25×, fila preferencial

INSERT INTO nivel_socio (id_nivel, codigo, nombre, min_puntos, multiplicador, fila_preferencial, color_hex)
VALUES
  (1, 'BRONCE', 'Bronce', 0,   1.00, false, '#CD7F32'),
  (2, 'PLATA',  'Plata',  300, 1.10, true,  '#C0C0C0'),
  (3, 'ORO',    'Oro',    800, 1.25, true,  '#FFD700')
ON CONFLICT (id_nivel) DO NOTHING;

-- Verificación: roles del sistema (ya existentes)
-- admin_general : 11111111-1111-1111-1111-111111111111
-- admin_sede    : 22222222-2222-2222-2222-222222222222
-- counter       : 33333333-3333-3333-3333-333333333333
-- cliente       : 44444444-4444-4444-4444-444444444444
