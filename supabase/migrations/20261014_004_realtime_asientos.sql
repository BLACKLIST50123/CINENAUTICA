-- Habilitar Supabase Realtime para bloqueo_temporal y asiento_funcion
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'bloqueo_temporal'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE bloqueo_temporal;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'asiento_funcion'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE asiento_funcion;
  END IF;
END $$;
