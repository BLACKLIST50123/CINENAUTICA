'use client';
// Patrón: Context + Observer
// - Context Pattern: provee el estado de sesión globalmente sin prop-drilling.
// - Observer Pattern: se suscribe a los cambios de auth de Supabase (onAuthStateChange).
//
// Reemplaza los objetos S y SEL de nav.ts para lo relacionado con sesión.
// Uso: importar useSesion() en cualquier componente cliente que necesite la sesión.

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase/cliente';
import { iniciarSesion, registrarCliente, cerrarSesion, type DatosRegistro, type ResultadoAuth } from '@/src/lib/supabase/auth';

// ---------- Tipos del contexto ----------

export interface DatosSocio {
  id_usuario: string;
  codigo_socio: string;
  puntos: number;
  id_nivel: number;
  nombre_nivel: string;  // 'Bronce' | 'Plata' | 'Oro'
  multiplicador: number;
  fecha_nacimiento: string | null;
  cumple_usado_en_anio: number | null;
}

export interface DatosUsuario {
  id_usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  id_rol: string;
  codigo_rol: string;  // 'cliente' | 'counter' | 'admin_sede' | 'admin_general'
}

interface SesionContextType {
  // Estado
  usuario: DatosUsuario | null;
  socio: DatosSocio | null;
  cargando: boolean;
  esSocio: boolean;       // true si tiene fila en tabla socio
  esPersonal: boolean;    // true si rol != cliente

  // Acciones
  login: (correo: string, contrasena: string) => Promise<ResultadoAuth>;
  registro: (datos: DatosRegistro) => Promise<ResultadoAuth>;
  logout: () => Promise<void>;
  recargarSocio: () => Promise<void>;
}

// ---------- Contexto ----------

const SesionContext = createContext<SesionContextType | null>(null);

// ---------- Hook de consumo ----------

export function useSesion(): SesionContextType {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error('useSesion debe usarse dentro de <SesionProvider>');
  return ctx;
}

// ---------- Provider ----------

export function SesionProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [usuario, setUsuario] = useState<DatosUsuario | null>(null);
  const [socio, setSocio] = useState<DatosSocio | null>(null);
  const [cargando, setCargando] = useState(true);

  // Carga el perfil de usuario y socio desde la BD
  const cargarPerfil = useCallback(async (user: User) => {
    // Obtener datos de usuario + rol
    const { data: usuarioData } = await supabase
      .from('usuario')
      .select('id_usuario, nombre, apellido, correo, id_rol, rol(codigo)')
      .eq('id_usuario', user.id)
      .single();

    if (!usuarioData) { setCargando(false); return; }

    const perfilUsuario: DatosUsuario = {
      id_usuario: usuarioData.id_usuario,
      nombre: usuarioData.nombre,
      apellido: usuarioData.apellido,
      correo: usuarioData.correo,
      id_rol: usuarioData.id_rol,
      codigo_rol: (usuarioData.rol as any)?.codigo ?? 'cliente',
    };
    setUsuario(perfilUsuario);

    // Si es cliente, cargar datos de socio + nivel
    if (perfilUsuario.codigo_rol === 'cliente') {
      const { data: socioData } = await supabase
        .from('socio')
        .select('id_usuario, codigo_socio, puntos, id_nivel, fecha_nacimiento, cumple_usado_en_anio, nivel_socio(nombre, multiplicador)')
        .eq('id_usuario', user.id)
        .single();

      if (socioData) {
        setSocio({
          id_usuario: socioData.id_usuario,
          codigo_socio: socioData.codigo_socio,
          puntos: socioData.puntos,
          id_nivel: socioData.id_nivel,
          nombre_nivel: (socioData.nivel_socio as any)?.nombre ?? 'Bronce',
          multiplicador: Number((socioData.nivel_socio as any)?.multiplicador ?? 1),
          fecha_nacimiento: socioData.fecha_nacimiento,
          cumple_usado_en_anio: socioData.cumple_usado_en_anio,
        });
      }
    }

    setCargando(false);
  }, []);

  // Suscripción a cambios de auth de Supabase (Observer Pattern)
  useEffect(() => {
    // Verificar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        cargarPerfil(session.user);
      } else {
        setCargando(false);
      }
    });

    // Escuchar cambios futuros (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        cargarPerfil(session.user);
      } else {
        setUsuario(null);
        setSocio(null);
        setCargando(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [cargarPerfil]);

  // Recargar datos del socio (ej. después de una compra que suma puntos)
  const recargarSocio = useCallback(async () => {
    if (!authUser) return;
    const { data: socioData } = await supabase
      .from('socio')
      .select('id_usuario, codigo_socio, puntos, id_nivel, fecha_nacimiento, cumple_usado_en_anio, nivel_socio(nombre, multiplicador)')
      .eq('id_usuario', authUser.id)
      .single();

    if (socioData) {
      setSocio({
        id_usuario: socioData.id_usuario,
        codigo_socio: socioData.codigo_socio,
        puntos: socioData.puntos,
        id_nivel: socioData.id_nivel,
        nombre_nivel: (socioData.nivel_socio as any)?.nombre ?? 'Bronce',
        multiplicador: Number((socioData.nivel_socio as any)?.multiplicador ?? 1),
        fecha_nacimiento: socioData.fecha_nacimiento,
        cumple_usado_en_anio: socioData.cumple_usado_en_anio,
      });
    }
  }, [authUser]);

  // Wrappers para acciones de auth
  const login = useCallback(async (correo: string, contrasena: string) => {
    setCargando(true);
    return iniciarSesion(correo, contrasena);
  }, []);

  const registro = useCallback(async (datos: DatosRegistro) => {
    setCargando(true);
    return registrarCliente(datos);
  }, []);

  const logout = useCallback(async () => {
    await cerrarSesion();
  }, []);

  const esSocio = !!socio;
  const esPersonal = !!usuario && usuario.codigo_rol !== 'cliente';

  return (
    <SesionContext.Provider value={{ usuario, socio, cargando, esSocio, esPersonal, login, registro, logout, recargarSocio }}>
      {children}
    </SesionContext.Provider>
  );
}
