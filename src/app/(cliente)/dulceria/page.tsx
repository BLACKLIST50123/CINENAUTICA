import { Suspense } from "react";
import Dulceria from "@/src/components/cliente/vistas/Dulceria";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Dulcería" };

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900" />}>
      <Dulceria />
      <MontarVista area="cliente" />
    </Suspense>
  );
}

