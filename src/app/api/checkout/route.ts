import { NextResponse } from "next/server";
import { PagoService } from "@/src/services/pagoService";
import type { CrearOrdenInputDTO } from "@/src/dtos/orden";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CrearOrdenInputDTO;

    if (!body || !body.id_sede) {
      return NextResponse.json(
        { ok: false, error: "Datos de orden incompletos (sede requerida)." },
        { status: 400 }
      );
    }

    const resultado = await PagoService.procesarCheckout(body);
    return NextResponse.json(resultado, { status: 200 });
  } catch (error: any) {
    console.error("Error en Route Handler POST /api/checkout:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Ocurrió un error inesperado al procesar la compra.",
      },
      { status: 400 }
    );
  }
}
