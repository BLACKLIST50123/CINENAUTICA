// Cliente Supabase para componentes del lado del navegador (browser).
// Patrón: Singleton exportado para reutilizar la misma instancia en todo el frontend.
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

// Instancia única del cliente — importar desde aquí en todos los componentes 'use client'
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
