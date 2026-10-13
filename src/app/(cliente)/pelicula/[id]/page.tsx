import { notFound } from "next/navigation";
import DetalleShell from "@/src/components/cliente/vistas/DetalleShell";
import { DETALLES } from "@/src/components/cliente/detalle";
import MontarVista from "@/src/components/MontarVista";

/* /pelicula/spiderman, /pelicula/doomsday, ... (el id es el mismo data-peli del proyecto nativo) */
export function generateStaticParams() {
  return Object.keys(DETALLES).map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const Detalle = DETALLES[id];
  if (!Detalle) notFound();
  return (
    <DetalleShell>
      <Detalle />
      <MontarVista area="cliente" />
    </DetalleShell>
  );
}
