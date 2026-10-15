"use client";

/* ============================================================================
   UiRuntime — conecta la lógica de interfaz heredada (src/lib/ui/*) con Next.js
   - Registra el router de Next para que cambiarVista()/abrirDetallePelicula()… naveguen.
   - Activa los listeners globales (Esc cierra modales, clic en fondo, chips…).
   (El "onMount" de cada vista corre en <MontarVista />, DESPUÉS de hidratar la vista.)
   ============================================================================ */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setRouter, tieneCompraActiva } from "@/src/lib/ui/nav";
import { init as initCommon } from "@/src/lib/ui/common";
import { init as initCliente } from "@/src/lib/ui/cliente";
import { init as initAdmin } from "@/src/lib/ui/admin";
import { init as initCounter } from "@/src/lib/ui/counter";

export default function UiRuntime({ area }: { area: "cliente" | "admin" | "counter" }) {
    const router = useRouter();

    useEffect(() => { setRouter(router); }, [router]);

    useEffect(() => {
        function onBeforeUnload(e: BeforeUnloadEvent) {
            if (tieneCompraActiva()) {
                e.preventDefault();
                e.returnValue = "";
            }
        }
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, []);

    useEffect(() => {
        initCommon();
        if (area === "cliente") initCliente();
        if (area === "admin") initAdmin();
        if (area === "counter") initCounter();
    }, [area]);

    return null;
}
