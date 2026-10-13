import Asientos from "@/src/components/cliente/vistas/Asientos";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Elige tus asientos" };

export default function Page() {
  return (
    <>
      <Asientos />
      <MontarVista area="cliente" />
    </>
  );
}
