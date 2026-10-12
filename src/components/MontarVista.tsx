"use client";

/* ============================================================================
   MontarVista — se coloca DESPUÉS de cada vista (dentro de page.tsx).
   Ejecuta la lógica de interfaz heredada que "prepara" la vista al entrar
   (antes lo hacía cambiarVista()). Va aquí y no en el layout para que corra
   cuando la vista ya está hidratada (si no, React avisa de "hydration mismatch").
   ============================================================================ */
import { useEffect } from "react";
import { onMount as mountCliente } from "@/src/lib/ui/cliente";
import { onMount as mountAdmin } from "@/src/lib/ui/admin";
import { onMount as mountCounter } from "@/src/lib/ui/counter";

export default function MontarVista({ area }: { area: "cliente" | "admin" | "counter" }) {
    useEffect(() => {
        if (area === "cliente") mountCliente();
        if (area === "admin") mountAdmin();
        if (area === "counter") mountCounter();
    }, [area]);
    return null;
}
