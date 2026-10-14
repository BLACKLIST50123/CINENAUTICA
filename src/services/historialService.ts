// Servicio de Historial de Compras para el Cliente / Socio (Fase 9)
import { OrdenDao } from "@/src/daos/OrdenDao";
import type {
  OrdenCompletaDTO,
  OrdenDetalleEntradaDTO,
  OrdenDetalleProductoDTO,
} from "@/src/dtos/orden";

export interface EstadoOrdenVisual {
  label: string;
  badgeClase: string;
  icono: string;
}

export class HistorialService {
  /**
   * Consulta las órdenes históricas del socio o cliente por su ID o correo
   */
  static async obtenerHistorial(
    idUsuario?: string | null,
    correo?: string | null
  ): Promise<OrdenCompletaDTO[]> {
    return await OrdenDao.obtenerOrdenesPorUsuario(idUsuario, correo);
  }

  /**
   * Formatea la fecha ISO de la orden a formato amigable peruano
   * Ej: "Mié, 14 Oct 2026 • 19:45"
   */
  static formatearFecha(fechaIso: string): string {
    if (!fechaIso) return "-";
    try {
      const d = new Date(fechaIso);
      const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
      const meses = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Oct",
        "Nov",
        "Dic",
      ];
      const diaSemana = dias[d.getDay()];
      const dia = d.getDate();
      const mes = meses[d.getMonth()];
      const anio = d.getFullYear();
      const hora = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      return `${diaSemana}, ${dia} ${mes} ${anio} • ${hora}:${min}`;
    } catch {
      return fechaIso;
    }
  }

  /**
   * Retorna metadatos visuales del estado de la orden
   */
  static formatearEstado(estado: string): EstadoOrdenVisual {
    const normalizado = (estado || "").toLowerCase().trim();
    if (normalizado === "pagada" || normalizado === "completada") {
      return {
        label: "Pagada",
        badgeClase: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        icono: "fa-solid fa-circle-check",
      };
    }
    if (normalizado === "cancelada" || normalizado === "anulada") {
      return {
        label: "Cancelada",
        badgeClase: "bg-red-500/15 text-red-400 border border-red-500/30",
        icono: "fa-solid fa-circle-xmark",
      };
    }
    if (normalizado === "reembolsada") {
      return {
        label: "Reembolsada",
        badgeClase: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
        icono: "fa-solid fa-arrow-rotate-left",
      };
    }
    if (normalizado === "pendiente") {
      return {
        label: "Pendiente",
        badgeClase: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
        icono: "fa-solid fa-clock",
      };
    }
    return {
      label: estado || "Registrada",
      badgeClase: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
      icono: "fa-solid fa-receipt",
    };
  }

  /**
   * Resumen conciso de asientos: "D5, D6 (2 entradas)"
   */
  static obtenerResumenAsientos(entradas: OrdenDetalleEntradaDTO[]): string {
    if (!entradas || entradas.length === 0) return "Sin entradas de cine";
    const codigos = entradas
      .map((e) => e.codigo_asiento)
      .filter(Boolean)
      .join(", ");
    const cant = entradas.length;
    return `${codigos || "Asientos asignados"} (${cant} ${cant === 1 ? "entrada" : "entradas"})`;
  }

  /**
   * Resumen conciso de productos: "1x Combo Dúo, 2x Gaseosa Grande"
   */
  static obtenerResumenProductos(productos: OrdenDetalleProductoDTO[]): string {
    if (!productos || productos.length === 0) return "";
    return productos
      .map((p) => `${p.cantidad}x ${p.nombre_producto || "Producto"}`)
      .join(", ");
  }
}
