import Promociones from "@/src/components/cliente/vistas/Promociones";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Promociones" };

export default function Page() {
  return (
    <>
      <Promociones />
      <MontarVista area="cliente" />
    </>
  );
}
