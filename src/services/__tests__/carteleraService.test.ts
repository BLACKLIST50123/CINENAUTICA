import { describe, it, expect } from "vitest";
import { CarteleraService } from "../carteleraService";
import type { PeliculaCarteleraDTO, FuncionResumenDTO } from "@/src/dtos/cartelera";

describe("CarteleraService - generarDiasCartelera", () => {
  it("debe generar exactamente 7 días a partir de una fecha dada", () => {
    const fechaBase = new Date(2026, 9, 13); // 13 de Octubre de 2026
    const dias = CarteleraService.generarDiasCartelera(7, fechaBase);

    expect(dias).toHaveLength(7);
    expect(dias[0].codigo).toBe("d0");
    expect(dias[0].fechaIso).toBe("2026-10-13");
    expect(dias[0].esHoy).toBe(true);
    expect(dias[0].labelCorto).toContain("Hoy");

    expect(dias[1].codigo).toBe("d1");
    expect(dias[1].fechaIso).toBe("2026-10-14");
    expect(dias[1].labelCorto).toContain("Mañana");

    expect(dias[6].codigo).toBe("d6");
    expect(dias[6].fechaIso).toBe("2026-10-19");
  });
});

describe("CarteleraService - filtrarPeliculas", () => {
  const peliculasPrueba: PeliculaCarteleraDTO[] = [
    {
      id_pelicula: "p1",
      titulo: "Spider-Man",
      sinopsis: "Test",
      duracion_min: 120,
      clasificacion: "APT",
      trailer_url: "url",
      url_poster: "poster",
      url_banner: "banner",
      tipo_lanzamiento: "Estreno",
      estado_cartelera: "Cartelera",
      generos: ["Acción"],
      formatos: ["2D"],
      sedes_disponibles: [1, 2],
      fechas_disponibles: ["2026-10-13"],
    },
    {
      id_pelicula: "p2",
      titulo: "Avengers",
      sinopsis: "Test",
      duracion_min: 180,
      clasificacion: "APT",
      trailer_url: "url",
      url_poster: "poster",
      url_banner: "banner",
      tipo_lanzamiento: "Re_Estreno",
      estado_cartelera: "Cartelera",
      generos: ["Acción"],
      formatos: ["2D", "IMAX"],
      sedes_disponibles: [1],
      fechas_disponibles: ["2026-10-14"],
    },
  ];

  const funcionesPrueba: FuncionResumenDTO[] = [
    {
      id_funcion: "f1",
      id_sede: 1,
      id_pelicula: "p1",
      fecha: "2026-10-13",
      hora_inicio: "16:00",
      hora_fin: "18:00",
      idioma_audio: "Doblada",
      estado: "Programada",
      formato: "2d",
      nombre_formato: "2D",
      nombre_sala: "Sala 1",
      numero_sala: 1,
    },
    {
      id_funcion: "f2",
      id_sede: 1,
      id_pelicula: "p2",
      fecha: "2026-10-14",
      hora_inicio: "19:00",
      hora_fin: "22:00",
      idioma_audio: "Subtitulada",
      estado: "Programada",
      formato: "imax",
      nombre_formato: "IMAX",
      nombre_sala: "Sala 2",
      numero_sala: 2,
    },
  ];

  it("filtra por sede específica", () => {
    const res = CarteleraService.filtrarPeliculas(peliculasPrueba, funcionesPrueba, {
      idSede: 2,
    });
    expect(res).toHaveLength(1);
    expect(res[0].id_pelicula).toBe("p1");
  });

  it("filtra por película específica", () => {
    const res = CarteleraService.filtrarPeliculas(peliculasPrueba, funcionesPrueba, {
      idPelicula: "p2",
    });
    expect(res).toHaveLength(1);
    expect(res[0].titulo).toBe("Avengers");
  });

  it("filtra por fecha", () => {
    const res = CarteleraService.filtrarPeliculas(peliculasPrueba, funcionesPrueba, {
      fechaIso: "2026-10-13",
    });
    expect(res).toHaveLength(1);
    expect(res[0].id_pelicula).toBe("p1");
  });
});

describe("CarteleraService - Integración con Supabase", () => {
  it("debe cargar sedes, películas y funciones desde Supabase", async () => {
    const datos = await CarteleraService.obtenerDatosInicio();

    expect(datos.sedes.length).toBeGreaterThan(0);
    expect(datos.ciudades.length).toBeGreaterThan(0);
    expect(datos.peliculasCartelera.length).toBeGreaterThan(0);
    expect(datos.dias).toHaveLength(7);

    // Verificar que las sedes tienen ciudad y región
    const primeraSede = datos.sedes[0];
    expect(primeraSede.nombre).toBeDefined();
    expect(primeraSede.ciudad.nombre).toBeDefined();
    expect(primeraSede.region.nombre).toBeDefined();

    // Verificar que las películas tienen títulos y posters
    const primeraPeli = datos.peliculasCartelera[0];
    expect(primeraPeli.titulo).toBeDefined();
    expect(primeraPeli.url_poster).toBeDefined();
  });
});

