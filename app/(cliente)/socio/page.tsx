import Socio from "@/src/components/cliente/vistas/Socio";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Socio Náutica" };

export default function Page() {
  return (
    <>
      <Socio />
      <MontarVista area="cliente" />
    </>
  );
}
