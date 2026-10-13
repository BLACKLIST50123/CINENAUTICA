import Ticket from "@/src/components/cliente/vistas/Ticket";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Tu ticket" };

export default function Page() {
  return (
    <>
      <Ticket />
      <MontarVista area="cliente" />
    </>
  );
}
