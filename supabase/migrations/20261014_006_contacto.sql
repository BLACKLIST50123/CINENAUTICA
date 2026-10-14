-- ============================================================================
-- MIGRACIÓN 20261014_006: TABLA MENSAJE_CONTACTO
-- Permite almacenar mensajes de atención al cliente y contacto desde la web
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.mensaje_contacto (
  id_mensaje UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL,
  distrito VARCHAR(100),
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT false,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.mensaje_contacto ENABLE ROW LEVEL SECURITY;

-- Política de inserción pública (anon y authenticated)
DROP POLICY IF EXISTS "Permitir insercion publica de mensajes de contacto" ON public.mensaje_contacto;
CREATE POLICY "Permitir insercion publica de mensajes de contacto"
  ON public.mensaje_contacto
  FOR INSERT
  WITH CHECK (true);

-- Política de lectura para usuarios autenticados / administradores
DROP POLICY IF EXISTS "Permitir lectura de mensajes a administradores" ON public.mensaje_contacto;
CREATE POLICY "Permitir lectura de mensajes a administradores"
  ON public.mensaje_contacto
  FOR SELECT
  USING (true);
