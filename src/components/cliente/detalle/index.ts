import type { ComponentType } from "react";
import Detalle_endgame_bonus from "./Detalle_endgame_bonus";
import Detalle_re_noche_cero from "./Detalle_re_noche_cero";
import Detalle_spiderman from "./Detalle_spiderman";
import Detalle_coyote_acme from "./Detalle_coyote_acme";
import Detalle_sombra_exorcista from "./Detalle_sombra_exorcista";
import Detalle_demonio from "./Detalle_demonio";
import Detalle_doomsday from "./Detalle_doomsday";
import Detalle_godzilla_minus_one from "./Detalle_godzilla_minus_one";
import Detalle_street_fighter from "./Detalle_street_fighter";
import Detalle_juegos_hambre_cosecha from "./Detalle_juegos_hambre_cosecha";

/* id de película (el mismo de data-peli) -> bloque de detalle. Cuando conectes Supabase, esto se reemplaza por UNA sola plantilla que reciba los datos. */
export const DETALLES: Record<string, ComponentType> = {
  "endgame-bonus": Detalle_endgame_bonus,
  "re-noche-cero": Detalle_re_noche_cero,
  "spiderman": Detalle_spiderman,
  "coyote-acme": Detalle_coyote_acme,
  "sombra-exorcista": Detalle_sombra_exorcista,
  "demonio": Detalle_demonio,
  "doomsday": Detalle_doomsday,
  "godzilla-minus-one": Detalle_godzilla_minus_one,
  "street-fighter": Detalle_street_fighter,
  "juegos-hambre-cosecha": Detalle_juegos_hambre_cosecha,
};
