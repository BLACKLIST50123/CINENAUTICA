import { Suspense } from "react";
import Socio from "@/src/components/cliente/vistas/Socio";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Socio Náutica" };

export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-dark-900" />}>
        <Socio />
      </Suspense>
      <MontarVista area="cliente" />
    </>
  );
}
