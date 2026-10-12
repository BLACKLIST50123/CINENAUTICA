import Dulceria from "@/src/components/cliente/vistas/Dulceria";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Dulcería" };

export default function Page() {
  return (
    <>
      <Dulceria />
      <MontarVista area="cliente" />
    </>
  );
}
