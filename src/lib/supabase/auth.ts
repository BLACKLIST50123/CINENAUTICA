// Funciones de autenticación con Supabase Auth.
// Patrón: Service — centraliza toda la lógica de auth; los componentes solo llaman estas funciones.
// Validaciones: doble capa (también se validan en el formulario del cliente).
import { supabase } from './cliente';

// ---------- Tipos ----------

export interface DatosRegistro {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  dni: string;
  celular: string;
  fecha_nacimiento: string; // ISO 'YYYY-MM-DD'
}

export interface ResultadoAuth {
  ok: boolean;
  error?: string;
}

// UUIDs de roles (fijos en BD, no cambian)
const ROL_CLIENTE = '44444444-4444-4444-4444-444444444444';
// Nivel Bronce es id_nivel = 1 (el inicial para todo socio nuevo)
const NIVEL_BRONCE = 1;

// ---------- Login ----------

export async function iniciarSesion(correo: string, contrasena: string): Promise<ResultadoAuth> {
  const { error } = await supabase.auth.signInWithPassword({ email: correo, password: contrasena });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ---------- Registro (Cliente → Socio) ----------

export async function registrarCliente(datos: DatosRegistro): Promise<ResultadoAuth> {
  // 1. Crear cuenta en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: datos.correo,
    password: datos.contrasena,
    options: {
      data: { nombre: datos.nombre, apellido: datos.apellido },
    },
  });

  if (authError) {
    // 429: límite de tasa de Supabase (máx. ~4 signups/hora en plan free)
    if (authError.status === 429 || authError.message.toLowerCase().includes('rate')) {
      return { ok: false, error: 'Demasiados intentos de registro. Espera unos minutos e intenta de nuevo.' };
    }
    if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
      return { ok: false, error: 'Este correo ya tiene una cuenta. Usa "Ingresar" en su lugar.' };
    }
    return { ok: false, error: 'Error al crear la cuenta: ' + authError.message };
  }
  if (!authData.user) return { ok: false, error: 'No se pudo crear el usuario.' };

  const idUsuario = authData.user.id;

  // 2. Insertar en tabla `usuario` (rol = cliente)
  const { error: usuarioError } = await supabase.from('usuario').insert({
    id_usuario: idUsuario,
    nombre: datos.nombre,
    apellido: datos.apellido,
    correo: datos.correo,
    dni: datos.dni,
    telefono: datos.celular,
    id_rol: ROL_CLIENTE,
    activo: true,
  });

  if (usuarioError) {
    return { ok: false, error: 'Error al registrar perfil: ' + usuarioError.message };
  }

  // 3. Generar código único CIN-XXXXXX
  const codigoSocio = `CIN-${Math.random().toString(36).toUpperCase().slice(2, 8)}`;

  // 4. Insertar en tabla `socio` con nivel Bronce inicial
  const { error: socioError } = await supabase.from('socio').insert({
    id_usuario: idUsuario,
    codigo_socio: codigoSocio,
    puntos: 0,
    id_nivel: NIVEL_BRONCE,
    fecha_nacimiento: datos.fecha_nacimiento ?? null,
    cumple_usado_en_anio: null,
  });

  if (socioError) {
    return { ok: false, error: 'Error al crear perfil socio: ' + socioError.message };
  }

  return { ok: true };
}

// ---------- Cierre de sesión ----------

export async function cerrarSesion(): Promise<void> {
  await supabase.auth.signOut();
}

// ---------- Obtener sesión actual ----------

export async function obtenerUsuarioActual() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
