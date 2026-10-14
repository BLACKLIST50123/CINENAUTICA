import { describe, it, expect } from "vitest";
import { FuncionService } from "../funcionService";
import type { FuncionItemDTO, DetallePeliculaDTO } from "@/src/dtos/funcion";

describe("FuncionService - Lógica de Agrupación", () => {
  const dummyFunciones: FuncionItemDTO[] = [
    {
      id_funcion: "fn-1",
      id_pelicula: "peli-1",
      id_sede: 1,
      sede_nombre: "CineNáutica Chimbote",
      id_ciudad: 1,
      ciudad_nombre: "Chimbote",
      id_sala: "sala-1",
      numero_sala: 1,
      nombre_sala: "Sala 1",
      id_formato: "fmt-1",
      nombre_formato: "2D",
      codigo_formato: "2D",
      idioma_audio: "Doblada",
      formato_completo: "2D Doblada",
      fecha: "2026-10-14",
      hora_inicio: "18:00",
      hora_fin: "20:30",
      estado: "Programada",
    },
    {
      id_funcion: "fn-2",
      id_pelicula: "peli-1",
      id_sede: 1,
      sede_nombre: "CineNáutica Chimbote",
      id_ciudad: 1,
      ciudad_nombre: "Chimbote",
      id_sala: "sala-1",
      numero_sala: 1,
      nombre_sala: "Sala 1",
      id_formato: "fmt-1",
      nombre_formato: "2D",
      codigo_formato: "2D",
      idioma_audio: "Doblada",
      formato_completo: "2D Doblada",
      fecha: "2026-10-14",
      hora_inicio: "15:00",
      hora_fin: "17:30",
      estado: "Programada",
    },
    {
      id_funcion: "fn-3",
      id_pelicula: "peli-1",
      id_sede: 1,
      sede_nombre: "CineNáutica Chimbote",
      id_ciudad: 1,
      ciudad_nombre: "Chimbote",
      id_sala: "sala-2",
      numero_sala: 2,
      nombre_sala: "Sala 2",
      id_formato: "fmt-2",
      nombre_formato: "IMAX",
      codigo_formato: "IMAX",
      idioma_audio: "Subtitulada",
      formato_completo: "IMAX Subtitulada",
      fecha: "2026-10-14",
      hora_inicio: "19:00",
      hora_fin: "22:00",
      estado: "Programada",
    },
    {
      id_funcion: "fn-4",
      id_pelicula: "peli-1",
      id_sede: 2,
      sede_nombre: "CineNáutica Lima",
      id_ciudad: 3,
      ciudad_nombre: "Lima",
      id_sala: "sala-3",
      numero_sala: 1,
      nombre_sala: "Sala 1",
      id_formato: "fmt-1",
      nombre_formato: "2D",
      codigo_formato: "2D",
      idioma_audio: "Doblada",
      formato_completo: "2D Doblada",
      fecha: "2026-10-14",
      hora_inicio: "16:00",
      hora_fin: "18:30",
      estado: "Programada",
    },
    {
      id_funcion: "fn-5",
      id_pelicula: "peli-1",
      id_sede: 1,
      sede_nombre: "CineNáutica Chimbote",
      id_ciudad: 1,
      ciudad_nombre: "Chimbote",
      id_sala: "sala-1",
      numero_sala: 1,
      nombre_sala: "Sala 1",
      id_formato: "fmt-1",
      nombre_formato: "2D",
      codigo_formato: "2D",
      idioma_audio: "Doblada",
      formato_completo: "2D Doblada",
      fecha: "2026-10-15", // Fecha distinta
      hora_inicio: "16:00",
      hora_fin: "18:30",
      estado: "Programada",
    },
  ];

  it("debe filtrar funciones por fecha exacta y agrupar por sede", () => {
    const grupos = FuncionService.agruparPorSedeYFormato(dummyFunciones, {
      fechaIso: "2026-10-14",
    });

    expect(grupos.length).toBe(2); // Sede 1 y Sede 2
    const sede1 = grupos.find((g) => g.id_sede === 1);
    expect(sede1).toBeDefined();
    expect(sede1?.formatos.length).toBe(2); // "2D Doblada" y "IMAX Subtitulada"

    // Los horarios deben estar ordenados cronológicamente
    const formato2D = sede1?.formatos.find((f) => f.formato_completo === "2D Doblada");
    expect(formato2D?.horarios[0].hora_inicio).toBe("15:00");
    expect(formato2D?.horarios[1].hora_inicio).toBe("18:00");
  });

  it("debe filtrar por ciudad si se especifica", () => {
    const grupos = FuncionService.agruparPorSedeYFormato(dummyFunciones, {
      fechaIso: "2026-10-14",
      idCiudad: 3, // Lima
    });

    expect(grupos.length).toBe(1);
    expect(grupos[0].nombre_sede).toBe("CineNáutica Lima");
  });

  it("debe filtrar por sede específica", () => {
    const grupos = FuncionService.agruparPorSedeYFormato(dummyFunciones, {
      fechaIso: "2026-10-14",
      idSede: 1,
    });

    expect(grupos.length).toBe(1);
    expect(grupos[0].id_sede).toBe(1);
  });

  it("debe preparar correctamente la estructura de selección de compra", () => {
    const mockPeli: DetallePeliculaDTO = {
      id_pelicula: "peli-uuid",
      titulo: "Spider-Man",
      sinopsis: "Sinopsis",
      duracion_min: 120,
      clasificacion: "APT",
      trailer_url: null,
      url_poster: "poster.jpg",
      url_banner: null,
      tipo_lanzamiento: "Estreno",
      estado_cartelera: "Cartelera",
      generos: ["Acción"],
      formatos: ["2D"],
    };

    const sel = FuncionService.prepararSeleccionCompra(
      dummyFunciones[0],
      mockPeli,
      "Hoy · 14 Oct"
    );

    expect(sel.id_funcion).toBe("fn-1");
    expect(sel.titulo_pelicula).toBe("Spider-Man");
    expect(sel.nombre_sede).toBe("CineNáutica Chimbote");
    expect(sel.hora).toBe("18:00");
    expect(sel.formato).toBe("2D Doblada");
    expect(sel.fecha_formateada).toBe("Hoy · 14 Oct");
  });
});

describe("FuncionService - Integración con Supabase", () => {
  it("debe obtener el detalle de una película existente por slug o UUID", async () => {
    const res = await FuncionService.obtenerDetalleCompleto("spiderman");

    expect(res).not.toBeNull();
    if (res) {
      expect(res.pelicula.titulo).toContain("Spider-Man");
      expect(res.ciudades.length).toBeGreaterThan(0);
      expect(res.sedes.length).toBeGreaterThan(0);
      expect(res.dias.length).toBe(7);
      expect(res.funciones.length).toBeGreaterThan(0);
    }
  });
});
