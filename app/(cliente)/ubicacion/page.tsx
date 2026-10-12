import Ubicacion from "@/src/components/cliente/vistas/Ubicacion";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Ubicación" };

export default function Page() {
  return (
    <>
      <Ubicacion />
      <MontarVista area="cliente" />
    </>
  );
}
