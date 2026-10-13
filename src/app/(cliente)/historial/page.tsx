import Historial from "@/src/components/cliente/vistas/Historial";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Mis compras" };

export default function Page() {
  return (
    <>
      <Historial />
      <MontarVista area="cliente" />
    </>
  );
}
