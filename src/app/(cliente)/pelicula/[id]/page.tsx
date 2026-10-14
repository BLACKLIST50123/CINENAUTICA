import { notFound } from "next/navigation";
import DetalleShell from "@/src/components/cliente/vistas/DetalleShell";
import { DETALLES } from "@/src/components/cliente/detalle";
import MontarVista from "@/src/components/MontarVista";

/* /pelicula/spiderman, /pelicula/doomsday, ... (el id es el mismo data-peli del proyecto nativo) */
export function generateStaticParams() {
  return Object.keys(DETALLES).map((id) => ({ id }));
}

const UUID_A_SLUG: Record<string, string> = {
  "a0000000-0000-0000-0000-000000000001": "endgame-bonus",
  "a0000000-0000-0000-0000-000000000002": "spiderman",
  "a0000000-0000-0000-0000-000000000003": "demonio",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slug = UUID_A_SLUG[id] || id;
  const Detalle = DETALLES[slug];
  if (!Detalle) notFound();
  return (
    <DetalleShell>
      <Detalle />
      <MontarVista area="cliente" />
    </DetalleShell>
  );
}
