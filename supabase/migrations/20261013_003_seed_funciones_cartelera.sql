-- Migración: Actualizar y agregar funciones de prueba para la cartelera activa
-- Fecha: 2026-10-13
-- Descripción:
--   1. Desplaza las 9 funciones existentes de Sede 1 a la semana actual (2026-10-13 en adelante).
--   2. Agrega funciones para Sede 2 (Spider-Man en 2D y XD) y Sede 3 (La Noche del Demonio en 2D)
--      para permitir probar el filtrado multisede en la vista de cliente.

-- 1. Actualizar fechas de funciones existentes en Sede 1 a la semana actual
UPDATE funcion SET fecha = '2026-10-13' WHERE fecha = '2026-10-08';
UPDATE funcion SET fecha = '2026-10-14' WHERE fecha = '2026-10-09';
UPDATE funcion SET fecha = '2026-10-15' WHERE fecha = '2026-10-10';
UPDATE funcion SET fecha = '2026-10-16' WHERE fecha = '2026-10-11';

-- 2. Insertar funciones para Sede 2 (Nuevo Chimbote - Spider-Man)
INSERT INTO funcion (id_funcion, id_sede, id_pelicula, id_sala, id_formato, fecha, hora_inicio, hora_fin, idioma_audio, estado)
VALUES
  ('2b000000-0000-0000-0000-000000000001', 2, 'a0000000-0000-0000-0000-000000000002', '5a1a0000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '2026-10-13', '17:00:00', '19:30:00', 'Doblada', 'Programada'),
  ('2b000000-0000-0000-0000-000000000002', 2, 'a0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000004', '2026-10-13', '20:00:00', '22:30:00', 'Subtitulada', 'Programada'),
  ('2b000000-0000-0000-0000-000000000003', 2, 'a0000000-0000-0000-0000-000000000002', '5a1a0000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '2026-10-14', '17:00:00', '19:30:00', 'Doblada', 'Programada')
ON CONFLICT (id_funcion) DO NOTHING;

-- 3. Insertar funciones para Sede 3 (Lima - La Noche del Demonio)
INSERT INTO funcion (id_funcion, id_sede, id_pelicula, id_sala, id_formato, fecha, hora_inicio, hora_fin, idioma_audio, estado)
VALUES
  ('3b000000-0000-0000-0000-000000000001', 3, 'a0000000-0000-0000-0000-000000000003', '5a1a0000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '2026-10-13', '18:00:00', '20:00:00', 'Doblada', 'Programada'),
  ('3b000000-0000-0000-0000-000000000002', 3, 'a0000000-0000-0000-0000-000000000003', '5a1a0000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '2026-10-14', '20:30:00', '22:30:00', 'Subtitulada', 'Programada')
ON CONFLICT (id_funcion) DO NOTHING;
