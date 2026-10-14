import { describe, it, expect, vi } from "vitest";
import { ContactoDao } from "../ContactoDao";

describe("ContactoDao", () => {
  it("debe validar y manejar envío de mensaje de contacto", async () => {
    const res = await ContactoDao.enviarMensaje({
      nombres: "Carlos",
      apellidos: "Navarro",
      correo: "carlos.navarro@gmail.com",
      distrito: "Chimbote",
      mensaje: "Hola, quisiera consultar si tienen funciones matutinas los fines de semana.",
    });

    expect(res).toBeDefined();
    expect(res.ok).toBe(true);
    expect(res.id_mensaje).toBeDefined();
  });
});
