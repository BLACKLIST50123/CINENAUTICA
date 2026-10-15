"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CounterHubView from "@/src/components/counter/comun/CounterHubView";
import { CounterService } from "@/src/services/counterService";
import type { SedeDTO } from "@/src/dtos/cartelera";

export default function CounterHubPage() {
  const router = useRouter();
  const [sedes, setSedes] = useState<{ id_sede: number; nombre: string }[]>([
    { id_sede: 1, nombre: "CineNáutica Chimbote" },
    { id_sede: 2, nombre: "CineNáutica Costa Azul" },
    { id_sede: 3, nombre: "CineNáutica Nuevo Chimbote" },
    { id_sede: 6, nombre: "CineNáutica Lima Norte" },
  ]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState<number>(1);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // 1. Verificar si hay un rol específico en localStorage o sesión para redirección automática
    try {
      const rolGuardado = localStorage.getItem("cinenautica_rol_personal");
      if (rolGuardado === "counter_boleteria") {
        router.replace("/counter/boleteria");
        return;
      }
      if (rolGuardado === "counter_dulceria") {
        router.replace("/counter/dulceria");
        return;
      }
      if (rolGuardado === "counter_mixto") {
        router.replace("/counter/mixto");
        return;
      }
    } catch {}

    // 2. Cargar sedes reales para el admin_sede
    CounterService.obtenerSedesActivas()
      .then((res) => {
        if (res && res.length > 0) setSedes(res as any);
      })
      .catch((e) => console.warn("Error cargando sedes:", e))
      .finally(() => setCargando(false));
  }, [router]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-brand-yellow mb-3"></i>
          <p className="text-slate-400 text-sm">Cargando Hub de Cajas POS...</p>
        </div>
      </div>
    );
  }

  return (
    <CounterHubView
      sedes={sedes}
      sedeSeleccionada={sedeSeleccionada}
      onCambiarSede={(id) => setSedeSeleccionada(id)}
      rolUsuario="admin_sede"
    />
  );
}
