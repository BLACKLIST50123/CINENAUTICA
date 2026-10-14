import { Suspense } from "react";
import DetallePelicula from "@/src/components/cliente/vistas/DetallePelicula";

async function PeliculaContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DetallePelicula idPelicula={id} />;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900" />}>
      <PeliculaContent params={params} />
    </Suspense>
  );
}
