import Contacto from "@/src/components/cliente/vistas/Contacto";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Contáctenos" };

export default function Page() {
  return (
    <>
      <Contacto />
      <MontarVista area="cliente" />
    </>
  );
}
