-- 20261014_007_roles_counter.sql
-- Actualización y separación de roles para Counter: boletería, dulcería y mixto

-- 1. Actualizar el rol 'counter' preexistente a 'counter_mixto' si existía
UPDATE public.rol
SET codigo = 'counter_mixto',
    nombre_rol = 'Counter Mixto',
    descripcion = 'Punto de venta integral: entradas y dulcería'
WHERE codigo = 'counter' OR id_rol = '33333333-3333-3333-3333-333333333333';

-- 2. Insertar roles counter_boleteria, counter_dulceria y counter_mixto si no existen
INSERT INTO public.rol (id_rol, codigo, nombre_rol, descripcion, activo)
VALUES 
  ('33333333-1111-3333-3333-333333333333', 'counter_boleteria', 'Counter Boletería', 'Taquilla y venta de entradas de cine', true),
  ('33333333-2222-3333-3333-333333333333', 'counter_dulceria', 'Counter Dulcería', 'Caja y venta de dulcería y confitería', true),
  ('33333333-3333-3333-3333-333333333333', 'counter_mixto', 'Counter Mixto', 'Punto de venta integral: entradas y dulcería', true)
ON CONFLICT (id_rol) DO UPDATE 
SET codigo = EXCLUDED.codigo,
    nombre_rol = EXCLUDED.nombre_rol,
    descripcion = EXCLUDED.descripcion,
    activo = EXCLUDED.activo;
