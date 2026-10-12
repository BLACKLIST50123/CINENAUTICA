import Pago from "@/src/components/cliente/vistas/Pago";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Pago" };

export default function Page() {
  return (
    <>
      <Pago />
      <MontarVista area="cliente" />
    </>
  );
}
