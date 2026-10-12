import AdminGeneralView from "@/src/components/admin_general/AdminGeneralView";
import UiRuntime from "@/src/components/UiRuntime";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Cine Náutica — Admin General" };

export default function Page() {
  return (
    <>
      <AdminGeneralView />
      <UiRuntime area="admin" />
      <MontarVista area="admin" />
    </>
  );
}
