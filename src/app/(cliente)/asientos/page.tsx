import { Suspense } from "react";
import Asientos from "@/src/components/cliente/vistas/Asientos";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Elige tus asientos" };

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900" />}>
      <Asientos />
      <MontarVista area="cliente" />
    </Suspense>
  );
}

