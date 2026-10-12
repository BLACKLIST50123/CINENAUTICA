import Inicio from "@/src/components/cliente/vistas/Inicio";
import MontarVista from "@/src/components/MontarVista";

export default function Page() {
  return (
    <>
      <Inicio />
      <MontarVista area="cliente" />
    </>
  );
}
