-- ============================================================================
-- MIGRACIÓN 20261018_009: FASE 1 - POLÍTICAS RLS (ROW LEVEL SECURITY)
-- Cine Náutica: Funciones helper de roles y blindaje progresivo
-- ============================================================================

-- 1. FUNCIONES HELPER DE ROLES EN POSTGRES
CREATE OR REPLACE FUNCTION public.obtener_rol_usuario()
RETURNS text AS $$
  SELECT COALESCE(r.codigo, 'anonimo')
  FROM public.usuario u
  JOIN public.rol r ON r.id_rol = u.id_rol
  WHERE u.id_usuario = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.es_admin_general()
RETURNS boolean AS $$
  SELECT (public.obtener_rol_usuario() = 'admin_general');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.es_supervisor()
RETURNS boolean AS $$
  SELECT (public.obtener_rol_usuario() IN ('admin_general', 'admin_sede'));
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.es_personal_counter()
RETURNS boolean AS $$
  SELECT (public.obtener_rol_usuario() IN ('admin_general', 'admin_sede', 'counter_boleteria', 'counter_dulceria', 'counter_mixto'));
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. TABLAS DE CATÁLOGO PÚBLICO (Lectura pública SELECT; mutaciones reservadas a supervisores)
ALTER TABLE public.region ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica region" ON public.region;
CREATE POLICY "Lectura publica region" ON public.region FOR SELECT USING (true);

ALTER TABLE public.ciudad ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica ciudad" ON public.ciudad;
CREATE POLICY "Lectura publica ciudad" ON public.ciudad FOR SELECT USING (true);

ALTER TABLE public.sede ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica sede" ON public.sede;
CREATE POLICY "Lectura publica sede" ON public.sede FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gestion admin sede" ON public.sede;
CREATE POLICY "Gestion admin sede" ON public.sede FOR ALL TO authenticated USING (public.es_supervisor()) WITH CHECK (public.es_supervisor());

ALTER TABLE public.sala ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica sala" ON public.sala;
CREATE POLICY "Lectura publica sala" ON public.sala FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gestion admin sala" ON public.sala;
CREATE POLICY "Gestion admin sala" ON public.sala FOR ALL TO authenticated USING (public.es_supervisor()) WITH CHECK (public.es_supervisor());

ALTER TABLE public.formato_proyeccion ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica formato_proyeccion" ON public.formato_proyeccion;
CREATE POLICY "Lectura publica formato_proyeccion" ON public.formato_proyeccion FOR SELECT USING (true);

ALTER TABLE public.sala_formato ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica sala_formato" ON public.sala_formato;
CREATE POLICY "Lectura publica sala_formato" ON public.sala_formato FOR SELECT USING (true);

ALTER TABLE public.asiento ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica asiento" ON public.asiento;
CREATE POLICY "Lectura publica asiento" ON public.asiento FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gestion admin asiento" ON public.asiento;
CREATE POLICY "Gestion admin asiento" ON public.asiento FOR ALL TO authenticated USING (public.es_supervisor()) WITH CHECK (public.es_supervisor());

ALTER TABLE public.genero ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica genero" ON public.genero;
CREATE POLICY "Lectura publica genero" ON public.genero FOR SELECT USING (true);

ALTER TABLE public.pelicula ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica pelicula" ON public.pelicula;
CREATE POLICY "Lectura publica pelicula" ON public.pelicula FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gestion admin pelicula" ON public.pelicula;
CREATE POLICY "Gestion admin pelicula" ON public.pelicula FOR ALL TO authenticated USING (public.es_supervisor()) WITH CHECK (public.es_supervisor());

ALTER TABLE public.genero_pelicula ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica genero_pelicula" ON public.genero_pelicula;
CREATE POLICY "Lectura publica genero_pelicula" ON public.genero_pelicula FOR SELECT USING (true);

ALTER TABLE public.pelicula_formato ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica pelicula_formato" ON public.pelicula_formato;
CREATE POLICY "Lectura publica pelicula_formato" ON public.pelicula_formato FOR SELECT USING (true);

ALTER TABLE public.pelicula_sede ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica pelicula_sede" ON public.pelicula_sede;
CREATE POLICY "Lectura publica pelicula_sede" ON public.pelicula_sede FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gestion admin pelicula_sede" ON public.pelicula_sede;
CREATE POLICY "Gestion admin pelicula_sede" ON public.pelicula_sede FOR ALL TO authenticated USING (public.es_supervisor()) WITH CHECK (public.es_supervisor());

ALTER TABLE public.categoria_producto ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica categoria_producto" ON public.categoria_producto;
CREATE POLICY "Lectura publica categoria_producto" ON public.categoria_producto FOR SELECT USING (true);

ALTER TABLE public.producto ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica producto" ON public.producto;
CREATE POLICY "Lectura publica producto" ON public.producto FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gestion admin producto" ON public.producto;
CREATE POLICY "Gestion admin producto" ON public.producto FOR ALL TO authenticated USING (public.es_supervisor()) WITH CHECK (public.es_supervisor());

ALTER TABLE public.producto_sede ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica producto_sede" ON public.producto_sede;
CREATE POLICY "Lectura publica producto_sede" ON public.producto_sede FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gestion admin producto_sede" ON public.producto_sede;
CREATE POLICY "Gestion admin producto_sede" ON public.producto_sede FOR ALL TO authenticated USING (public.es_supervisor()) WITH CHECK (public.es_supervisor());

ALTER TABLE public.tarifa ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica tarifa" ON public.tarifa;
CREATE POLICY "Lectura publica tarifa" ON public.tarifa FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gestion admin tarifa" ON public.tarifa;
CREATE POLICY "Gestion admin tarifa" ON public.tarifa FOR ALL TO authenticated USING (public.es_supervisor()) WITH CHECK (public.es_supervisor());

ALTER TABLE public.tarifa_sede ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica tarifa_sede" ON public.tarifa_sede;
CREATE POLICY "Lectura publica tarifa_sede" ON public.tarifa_sede FOR SELECT USING (true);

ALTER TABLE public.tipo_entrada ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica tipo_entrada" ON public.tipo_entrada;
CREATE POLICY "Lectura publica tipo_entrada" ON public.tipo_entrada FOR SELECT USING (true);

ALTER TABLE public.tipo_entrada_sede ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica tipo_entrada_sede" ON public.tipo_entrada_sede;
CREATE POLICY "Lectura publica tipo_entrada_sede" ON public.tipo_entrada_sede FOR SELECT USING (true);

ALTER TABLE public.nivel_socio ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica nivel_socio" ON public.nivel_socio;
CREATE POLICY "Lectura publica nivel_socio" ON public.nivel_socio FOR SELECT USING (true);

ALTER TABLE public.feriado ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica feriado" ON public.feriado;
CREATE POLICY "Lectura publica feriado" ON public.feriado FOR SELECT USING (true);

-- 3. CARTELERA, CONCURRENCIA Y CUPONES
ALTER TABLE public.funcion ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica funcion" ON public.funcion;
CREATE POLICY "Lectura publica funcion" ON public.funcion FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gestion admin funcion" ON public.funcion;
CREATE POLICY "Gestion admin funcion" ON public.funcion FOR ALL TO authenticated USING (public.es_supervisor()) WITH CHECK (public.es_supervisor());

ALTER TABLE public.cupon ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura cupones" ON public.cupon;
CREATE POLICY "Lectura cupones" ON public.cupon FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gestion admin cupon" ON public.cupon;
CREATE POLICY "Gestion admin cupon" ON public.cupon FOR ALL TO authenticated USING (public.es_admin_general()) WITH CHECK (public.es_admin_general());

ALTER TABLE public.cupon_sede ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura cupon_sede" ON public.cupon_sede;
CREATE POLICY "Lectura cupon_sede" ON public.cupon_sede FOR SELECT USING (true);

ALTER TABLE public.asiento_funcion ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura publica asiento_funcion" ON public.asiento_funcion;
CREATE POLICY "Lectura publica asiento_funcion" ON public.asiento_funcion FOR SELECT USING (true);
DROP POLICY IF EXISTS "Modificacion asiento_funcion" ON public.asiento_funcion;
CREATE POLICY "Modificacion asiento_funcion" ON public.asiento_funcion FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.bloqueo_temporal ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Operacion bloqueo_temporal" ON public.bloqueo_temporal;
CREATE POLICY "Operacion bloqueo_temporal" ON public.bloqueo_temporal FOR ALL USING (true) WITH CHECK (true);

-- 4. VENTAS, ÓRDENES, PAGOS Y COMPROBANTES
ALTER TABLE public.orden ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura ordenes" ON public.orden;
CREATE POLICY "Lectura ordenes" ON public.orden FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insercion ordenes" ON public.orden;
CREATE POLICY "Insercion ordenes" ON public.orden FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Modificacion ordenes" ON public.orden;
CREATE POLICY "Modificacion ordenes" ON public.orden FOR UPDATE USING (true) WITH CHECK (true);

ALTER TABLE public.detalle_entrada ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura detalle_entrada" ON public.detalle_entrada;
CREATE POLICY "Lectura detalle_entrada" ON public.detalle_entrada FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insercion detalle_entrada" ON public.detalle_entrada;
CREATE POLICY "Insercion detalle_entrada" ON public.detalle_entrada FOR INSERT WITH CHECK (true);

ALTER TABLE public.detalle_producto ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura detalle_producto" ON public.detalle_producto;
CREATE POLICY "Lectura detalle_producto" ON public.detalle_producto FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insercion detalle_producto" ON public.detalle_producto;
CREATE POLICY "Insercion detalle_producto" ON public.detalle_producto FOR INSERT WITH CHECK (true);

ALTER TABLE public.pago ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura pagos" ON public.pago;
CREATE POLICY "Lectura pagos" ON public.pago FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insercion pagos" ON public.pago;
CREATE POLICY "Insercion pagos" ON public.pago FOR INSERT WITH CHECK (true);

ALTER TABLE public.comprobante ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura comprobante" ON public.comprobante;
CREATE POLICY "Lectura comprobante" ON public.comprobante FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insercion comprobante" ON public.comprobante;
CREATE POLICY "Insercion comprobante" ON public.comprobante FOR INSERT WITH CHECK (true);

-- 5. SOCIOS, USUARIOS Y PERSONAL
ALTER TABLE public.socio ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura socios" ON public.socio;
CREATE POLICY "Lectura socios" ON public.socio FOR SELECT USING (true);
DROP POLICY IF EXISTS "Modificacion socio" ON public.socio;
CREATE POLICY "Modificacion socio" ON public.socio FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.historial_puntos_socio ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura historial_puntos" ON public.historial_puntos_socio;
CREATE POLICY "Lectura historial_puntos" ON public.historial_puntos_socio FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insercion historial_puntos" ON public.historial_puntos_socio FOR INSERT WITH CHECK (true);

ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura usuario" ON public.usuario;
CREATE POLICY "Lectura usuario" ON public.usuario FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insercion usuario" ON public.usuario;
CREATE POLICY "Insercion usuario" ON public.usuario FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Modificacion usuario" ON public.usuario;
CREATE POLICY "Modificacion usuario" ON public.usuario FOR UPDATE USING (auth.uid() = id_usuario OR public.es_supervisor()) WITH CHECK (auth.uid() = id_usuario OR public.es_supervisor());

ALTER TABLE public.personal_sede ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura personal_sede" ON public.personal_sede;
CREATE POLICY "Lectura personal_sede" ON public.personal_sede FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gestion admin personal_sede" ON public.personal_sede;
CREATE POLICY "Gestion admin personal_sede" ON public.personal_sede FOR ALL TO authenticated USING (public.es_supervisor()) WITH CHECK (public.es_supervisor());

ALTER TABLE public.bitacora ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Insercion bitacora" ON public.bitacora;
CREATE POLICY "Insercion bitacora" ON public.bitacora FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Lectura bitacora admin" ON public.bitacora;
CREATE POLICY "Lectura bitacora admin" ON public.bitacora FOR SELECT TO authenticated USING (public.es_admin_general());
