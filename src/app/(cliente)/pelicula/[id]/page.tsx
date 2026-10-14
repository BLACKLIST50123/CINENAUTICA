import { Suspense } from "react";
import DetallePelicula from "@/src/components/cliente/vistas/DetallePelicula";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900" />}>
      <DetallePelicula idPelicula={id} />
    </Suspense>
  );
}
