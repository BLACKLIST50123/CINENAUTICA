import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cnzkhskrhgarmexqbyzh.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuemtoc2tyaGdhcm1leHFieXpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQwMDI4OCwiZXhwIjoyMTA2OTc2Mjg4fQ.br2U1oNvCpxljFEP0xPmnhqnJFwxJK3Z4qiNHvoXBIs';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD_COMUN = 'Cinenautica2026!';

const STAFF_USERS = [
  {
    id_usuario: '11111111-1111-4444-1111-111111111111',
    correo: 'admin@cinenautica.pe',
    nombre: 'Roberto',
    apellido: 'General',
    dni: '10000000',
    id_rol: '11111111-1111-1111-1111-111111111111', // admin_general
    rol_codigo: 'admin_general',
  },
  {
    id_usuario: '22222222-2222-4444-2222-222222222222',
    correo: 'sede@cinenautica.pe',
    nombre: 'Rosa',
    apellido: 'Medina',
    dni: '10000004',
    id_rol: '22222222-2222-2222-2222-222222222222', // admin_sede
    rol_codigo: 'admin_sede',
  },
  {
    id_usuario: '33333333-1111-4444-1111-111111111111',
    correo: 'boleteria@cinenautica.pe',
    nombre: 'Ana',
    apellido: 'Boletería',
    dni: '10000001',
    id_rol: '33333333-1111-3333-3333-333333333333', // counter_boleteria
    rol_codigo: 'counter_boleteria',
  },
  {
    id_usuario: '33333333-2222-4444-2222-222222222222',
    correo: 'dulceria@cinenautica.pe',
    nombre: 'Carlos',
    apellido: 'Dulcería',
    dni: '10000002',
    id_rol: '33333333-2222-3333-3333-333333333333', // counter_dulceria
    rol_codigo: 'counter_dulceria',
  },
  {
    id_usuario: '33333333-3333-4444-3333-333333333333',
    correo: 'mixto@cinenautica.pe',
    nombre: 'Marcos',
    apellido: 'Caja Mixta',
    dni: '10000003',
    id_rol: '33333333-3333-3333-3333-333333333333', // counter_mixto
    rol_codigo: 'counter_mixto',
  },
];

async function seed() {
  console.log('Iniciando aprovisionamiento de personal en Supabase...');

  const { data: { users: authUsers }, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error('Error listando usuarios:', listErr);
    process.exit(1);
  }

  for (const staff of STAFF_USERS) {
    console.log(`\nProcesando: ${staff.correo} (${staff.rol_codigo})...`);

    const existingAuth = authUsers.find((u) => u.email?.toLowerCase() === staff.correo.toLowerCase());
    let finalAuthId = staff.id_usuario;

    if (existingAuth) {
      console.log(`  -> Usuario encontrado en auth.users (ID: ${existingAuth.id}). Actualizando contraseña...`);
      finalAuthId = existingAuth.id;
      const { error: updErr } = await supabase.auth.admin.updateUserById(existingAuth.id, {
        password: PASSWORD_COMUN,
        email_confirm: true,
        user_metadata: {
          nombre: staff.nombre,
          apellido: staff.apellido,
          rol: staff.rol_codigo,
        },
      });
      if (updErr) console.error('  Error actualizando auth:', updErr.message);
      else console.log('  -> Contraseña y confirmación actualizadas con éxito.');
    } else {
      console.log(`  -> Creando nuevo usuario en auth.users con ID: ${staff.id_usuario}...`);
      const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
        id: staff.id_usuario,
        email: staff.correo,
        password: PASSWORD_COMUN,
        email_confirm: true,
        user_metadata: {
          nombre: staff.nombre,
          apellido: staff.apellido,
          rol: staff.rol_codigo,
        },
      });

      if (createErr) {
        console.error('  Error creando auth user:', createErr.message);
      } else {
        console.log('  -> Creado en auth.users correctamente.');
        finalAuthId = newUser.user.id;
      }
    }

    console.log(`  -> Sincronizando con public.usuario (ID: ${finalAuthId})...`);
    const { error: usuarioErr } = await supabase.from('usuario').upsert(
      {
        id_usuario: finalAuthId,
        nombre: staff.nombre,
        apellido: staff.apellido,
        correo: staff.correo,
        dni: staff.dni,
        id_rol: staff.id_rol,
        activo: true,
      },
      { onConflict: 'id_usuario' }
    );

    if (usuarioErr) {
      console.error('  Error sincronizando public.usuario:', usuarioErr.message);
    } else {
      console.log('  -> public.usuario sincronizado con éxito.');
    }
  }

  console.log('\n¡Todos los usuarios corporativos fueron aprovisionados correctamente!');
}

seed().catch(console.error);
