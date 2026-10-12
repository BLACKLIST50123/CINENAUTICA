import CounterView from "@/src/components/counter/CounterView";
import UiRuntime from "@/src/components/UiRuntime";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Cine Náutica — Counter" };

export default function Page() {
  return (
    <>
      <CounterView />
      <UiRuntime area="counter" />
      <MontarVista area="counter" />
    </>
  );
}
