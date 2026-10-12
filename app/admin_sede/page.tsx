import AdminSedeView from "@/src/components/admin_sede/AdminSedeView";
import UiRuntime from "@/src/components/UiRuntime";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Cine Náutica — Admin de Sede" };

export default function Page() {
  return (
    <>
      <AdminSedeView />
      <UiRuntime area="admin" />
      <MontarVista area="admin" />
    </>
  );
}
