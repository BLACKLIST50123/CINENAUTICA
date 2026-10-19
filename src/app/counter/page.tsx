"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CounterHubView from "@/src/components/counter/comun/CounterHubView";
import { CounterService } from "@/src/services/counterService";
import { supabase } from "@/src/lib/supabase/cliente";

export default function CounterHubPage() {
  const router = useRouter();
  const [sedes, setSedes] = useState<{ id_sede: number; nombre: string; direccion?: string }[]>([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState<number>(1);
  const [cargando, setCargando] = useState(true);
  const [nombreUsuario, setNombreUsuario] = useState<string>("Rosa Medina");

  useEffect(() => {
    async function verificarSesionYRol() {
      try {
        // 1. Obtener sesión de Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        let rol = "";
        let nombre = "Rosa Medina";

        if (session?.user) {
          // Buscar perfil en usuario
          const { data: usuarioData } = await supabase
            .from("usuario")
            .select("id_usuario, nombre, apellido, correo, rol:id_rol (codigo)")
            .eq("id_usuario", session.user.id)
            .maybeSingle();

          if (usuarioData) {
            rol = (usuarioData.rol as any)?.codigo || "";
            if (usuarioData.nombre) {
              nombre = `${usuarioData.nombre} ${usuarioData.apellido || ""}`.trim();
            }
          }
        }

        // Fallback a localStorage si fuera necesario
        if (!rol) {
          try {
            rol = localStorage.getItem("cinenautica_rol_personal") || "";
          } catch {}
        }

        // 2. Control estricto de redirecciones:
        // Si no hay rol o es cliente, al portal de acceso o inicio
        if (!rol) {
          router.replace("/acceso");
          return;
        }

        if (rol === "cliente") {
          router.replace("/");
          return;
        }

        // Si es Admin General: redirigir a /admin_general (no usa este Hub)
        if (rol === "admin_general") {
          router.replace("/admin_general");
          return;
        }

        // Si es un cajero específico: redirigir a su caja
        if (rol === "counter_boleteria") {
          router.replace("/counter/boleteria");
          return;
        }

        if (rol === "counter_dulceria") {
          router.replace("/counter/dulceria");
          return;
        }

        if (rol === "counter_mixto") {
          router.replace("/counter/mixto");
          return;
        }

        // Si es admin_sede: permanece en este Hub
        setNombreUsuario(nombre);

        // 3. Cargar sedes reales para el admin_sede
        const sedesActivas = await CounterService.obtenerSedesActivas();
        if (sedesActivas && sedesActivas.length > 0) {
          setSedes(sedesActivas as any);
          
          // Leer sede preferida de localStorage si existe
          try {
            const sedeGuardada = localStorage.getItem("cinenautica_sede_personal");
            if (sedeGuardada) {
              const idParsed = Number(sedeGuardada);
              if (sedesActivas.some((s) => s.id_sede === idParsed)) {
                setSedeSeleccionada(idParsed);
              } else {
                setSedeSeleccionada(sedesActivas[0].id_sede);
              }
            } else {
              setSedeSeleccionada(sedesActivas[0].id_sede);
            }
          } catch {
            setSedeSeleccionada(sedesActivas[0].id_sede);
          }
        }
      } catch (err) {
        console.warn("Error verificando sesión en Hub:", err);
      } finally {
        setCargando(false);
      }
    }

    verificarSesionYRol();
  }, [router]);

  const handleCambiarSede = (id: number) => {
    setSedeSeleccionada(id);
    try {
      localStorage.setItem("cinenautica_sede_personal", String(id));
    } catch {}
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-brand-yellow mb-3"></i>
          <p className="text-slate-400 text-sm">Validando permisos del Hub de Sede...</p>
        </div>
      </div>
    );
  }

  return (
    <CounterHubView
      sedes={sedes}
      sedeSeleccionada={sedeSeleccionada}
      onCambiarSede={handleCambiarSede}
      rolUsuario="admin_sede"
      nombreUsuario={nombreUsuario}
    />
  );
}
