// Servicio de Lógica de Negocio para Pagos, Cupones, Puntos y Checkout (Fase 6)
import { CuponDao } from "@/src/daos/CuponDao";
import { OrdenDao } from "@/src/daos/OrdenDao";
import type {
  CrearOrdenInputDTO,
  CheckoutResultadoDTO,
  ValidacionCuponResultado,
  TipoComprobante,
} from "@/src/dtos/orden";

export class PagoService {
  /**
   * Valida un número de documento según el tipo de comprobante
   */
  static validarDocumento(tipo: TipoComprobante, numero: string): { valido: boolean; mensaje?: string } {
    const doc = numero.trim();
    if (!doc) {
      return { valido: false, mensaje: "El número de documento es obligatorio." };
    }

    if (tipo === "Boleta") {
      const regexDni = /^\d{8}$/;
      if (!regexDni.test(doc)) {
        return { valido: false, mensaje: "El DNI para Boleta debe tener exactamente 8 dígitos numéricos." };
      }
    } else if (tipo === "Factura") {
      const regexRuc = /^(10|20)\d{9}$/;
      if (!regexRuc.test(doc)) {
        return {
          valido: false,
          mensaje: "El RUC para Factura debe tener 11 dígitos y empezar con 10 o 20.",
        };
      }
    }

    return { valido: true };
  }

  /**
   * Valida correo electrónico con formato estándar
   */
  static validarCorreo(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo.trim());
  }

  /**
   * Valida nombre del cliente
   */
  static validarNombre(nombre: string): boolean {
    return nombre.trim().length >= 3;
  }

  /**
   * Valida un cupón de descuento y calcula el monto a descontar
   */
  static async validarYAplicarCupon(
    codigo: string,
    idSede: number,
    subtotal: number
  ): Promise<ValidacionCuponResultado> {
    if (!codigo || !codigo.trim()) {
      return { valido: false, mensaje: "Ingresa un código de cupón." };
    }

    const cupon = await CuponDao.buscarCuponPorCodigo(codigo, idSede);
    if (!cupon) {
      return {
        valido: false,
        mensaje: "Cupón no válido, expirado o no disponible en esta sede.",
      };
    }

    let montoDescuento = 0;
    if (cupon.tipo_descuento === "Porcentaje") {
      montoDescuento = Number(((subtotal * cupon.valor) / 100).toFixed(2));
    } else {
      montoDescuento = Math.min(cupon.valor, subtotal);
    }

    return {
      valido: true,
      cupon,
      montoDescuento,
    };
  }

  /**
   * Calcula el descuento por canje de puntos de Socio Náutica
   * Regla de negocio:
   * - Mínimo 50 puntos
   * - 1 punto = S/ 0.10
   * - Descuento máximo = 50% del subtotal aplicable
   */
  static calcularDescuentoPuntos(
    puntosDeseados: number,
    puntosDisponibles: number,
    subtotal: number
  ): { puntosValidados: number; descuentoSoles: number; error?: string } {
    if (puntosDeseados <= 0) {
      return { puntosValidados: 0, descuentoSoles: 0 };
    }

    if (puntosDeseados < 50) {
      return {
        puntosValidados: 0,
        descuentoSoles: 0,
        error: "El canje mínimo de Socio es de 50 puntos.",
      };
    }

    if (puntosDeseados > puntosDisponibles) {
      return {
        puntosValidados: 0,
        descuentoSoles: 0,
        error: `Saldo insuficiente. Tienes ${puntosDisponibles} puntos disponibles.`,
      };
    }

    const maxDescuentoPermitido = Number((subtotal * 0.5).toFixed(2));
    let descuentoSoles = Number((puntosDeseados * 0.1).toFixed(2));
    let puntosValidados = puntosDeseados;

    if (descuentoSoles > maxDescuentoPermitido) {
      descuentoSoles = maxDescuentoPermitido;
      puntosValidados = Math.ceil(descuentoSoles / 0.1);
    }

    return { puntosValidados, descuentoSoles };
  }

  /**
   * Verifica si el socio cumple años en el mes en curso y si aún no usó su beneficio
   */
  static verificarBeneficioCumpleanos(
    fechaNacimiento?: string | null,
    cumpleUsadoAnio?: number | null
  ): boolean {
    if (!fechaNacimiento) return false;

    const fechaNac = new Date(fechaNacimiento);
    if (isNaN(fechaNac.getTime())) return false;

    const mesNac = fechaNac.getUTCMonth();
    const hoy = new Date();
    const mesActual = hoy.getUTCMonth();
    const anioActual = hoy.getUTCFullYear();

    if (mesNac !== mesActual) return false;
    if (cumpleUsadoAnio === anioActual) return false;

    return true;
  }

  /**
   * Ejecuta la orden y el checkout verificando todas las precondiciones
   */
  static async procesarCheckout(input: CrearOrdenInputDTO): Promise<CheckoutResultadoDTO> {
    // 1. Validaciones de comprobante
    const valDoc = this.validarDocumento(input.tipo_comprobante, input.numero_documento);
    if (!valDoc.valido) {
      throw new Error(valDoc.mensaje);
    }

    // 2. Validación de datos de contacto
    if (!this.validarNombre(input.nombre_contacto)) {
      throw new Error("El nombre de contacto debe tener al menos 3 caracteres.");
    }

    if (!this.validarCorreo(input.correo_contacto)) {
      throw new Error("El correo electrónico ingresado no es válido.");
    }

    // 3. Validación de items
    const tieneEntradas = Array.isArray(input.entradas) && input.entradas.length > 0;
    const tieneProductos = Array.isArray(input.productos) && input.productos.length > 0;

    if (!tieneEntradas && !tieneProductos) {
      throw new Error("Debes incluir al menos una entrada o un producto de dulcería.");
    }

    // 4. Delegar al DAO
    return await OrdenDao.procesarCheckout(input);
  }
}
