-- Migración: Checkout Atómico, Correlativos Iniciales y Cupones Semilla
-- Fecha: 2026-10-14
-- Descripción: 
-- 1. Inicializa correlativos de comprobantes por sede para Boleta y Factura.
-- 2. Inserta cupones de descuento semilla con asignación por sede.
-- 3. Crea la función RPC procesar_checkout_compra para ejecutar la compra de forma atómica.

-- 1. Inicializar correlativos por sede (Chimbote=1, Nvo Chimbote=2, Lima=3)
INSERT INTO correlativo_comprobante (id_sede, tipo, serie, ultimo)
VALUES 
  (1, 'Boleta', 'B001', 0),
  (1, 'Factura', 'F001', 0),
  (2, 'Boleta', 'B002', 0),
  (2, 'Factura', 'F002', 0),
  (3, 'Boleta', 'B003', 0),
  (3, 'Factura', 'F003', 0)
ON CONFLICT (id_sede, tipo, serie) DO NOTHING;

-- 2. Insertar cupones de prueba activos
DO $$
DECLARE
  v_cupon_verano uuid := 'c0000000-0000-0000-0000-000000000001';
  v_cupon_cinelover uuid := 'c0000000-0000-0000-0000-000000000002';
  v_cupon_bienvenido uuid := 'c0000000-0000-0000-0000-000000000003';
BEGIN
  INSERT INTO cupon (id_cupon, codigo, descripcion, tipo_descuento, valor, fecha_inicio, fecha_fin, usos_maximos, usos_actuales, activo)
  VALUES 
    (v_cupon_verano, 'VERANO20', '20% de descuento en tu compra', 'Porcentaje', 20.00, '2026-01-01', '2026-12-31', 1000, 0, true),
    (v_cupon_cinelover, 'CINELOVER', 'Descuento fijo de S/ 10.00 en compras de cine', 'Fijo', 10.00, '2026-01-01', '2026-12-31', 500, 0, true),
    (v_cupon_bienvenido, 'BIENVENIDO10', '10% de bienvenida para nuevos clientes', 'Porcentaje', 10.00, '2026-01-01', '2026-12-31', 2000, 0, true)
  ON CONFLICT (codigo) DO UPDATE 
  SET activo = true, fecha_fin = '2026-12-31';

  -- Asignar a todas las sedes activas (1, 2 y 3)
  INSERT INTO cupon_sede (id_sede, id_cupon, habilitado, usos_maximos_sede, usos_sede)
  VALUES
    (1, v_cupon_verano, true, 500, 0),
    (2, v_cupon_verano, true, 500, 0),
    (3, v_cupon_verano, true, 500, 0),
    (1, v_cupon_cinelover, true, 200, 0),
    (2, v_cupon_cinelover, true, 200, 0),
    (3, v_cupon_cinelover, true, 200, 0),
    (1, v_cupon_bienvenido, true, 1000, 0),
    (2, v_cupon_bienvenido, true, 1000, 0),
    (3, v_cupon_bienvenido, true, 1000, 0)
  ON CONFLICT (id_sede, id_cupon) DO UPDATE
  SET habilitado = true;
END $$;

-- 3. Función RPC atómica para procesar checkout
CREATE OR REPLACE FUNCTION procesar_checkout_compra(p_datos jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id_sede integer;
  v_id_usuario uuid;
  v_correo_contacto varchar;
  v_nombre_contacto varchar;
  v_tipo_comprobante varchar;
  v_numero_documento varchar;
  v_metodo_pago varchar;
  v_codigo_cupon varchar;
  v_puntos_canjeados integer := 0;
  v_id_sesion varchar;
  
  v_subtotal_entradas numeric(10,2) := 0.00;
  v_subtotal_productos numeric(10,2) := 0.00;
  v_subtotal numeric(10,2) := 0.00;
  v_descuento_cupon numeric(10,2) := 0.00;
  v_descuento_puntos numeric(10,2) := 0.00;
  v_total numeric(10,2) := 0.00;
  
  v_id_orden uuid := gen_random_uuid();
  v_codigo_orden varchar;
  v_id_cupon uuid := NULL;
  
  v_entrada record;
  v_producto record;
  
  -- Comprobante
  v_serie varchar;
  v_correlativo integer;
  v_numero_comprobante varchar;
  v_subtotal_sin_igv numeric(10,2);
  v_igv numeric(10,2);
  
  -- Socio y Puntos
  v_es_socio boolean := false;
  v_puntos_socio integer := 0;
  v_multiplicador numeric(5,2) := 1.00;
  v_puntos_ganados integer := 0;
  v_nuevo_saldo_puntos integer := 0;
  
  v_asiento_id_asiento uuid;
  v_asiento_id_funcion uuid;
  v_asiento_estado varchar;
  
BEGIN
  -- Extraer campos básicos del payload
  v_id_sede := (p_datos->>'id_sede')::integer;
  v_correo_contacto := p_datos->>'correo_contacto';
  v_nombre_contacto := p_datos->>'nombre_contacto';
  v_tipo_comprobante := COALESCE(p_datos->>'tipo_comprobante', 'Boleta');
  v_numero_documento := p_datos->>'numero_documento';
  v_metodo_pago := COALESCE(p_datos->>'metodo_pago', 'Tarjeta');
  v_codigo_cupon := NULLIF(TRIM(p_datos->>'codigo_cupon'), '');
  v_puntos_canjeados := COALESCE((p_datos->>'puntos_canjeados')::integer, 0);
  v_id_sesion := p_datos->>'id_sesion';

  IF p_datos->>'id_usuario' IS NOT NULL AND p_datos->>'id_usuario' <> '' THEN
    v_id_usuario := (p_datos->>'id_usuario')::uuid;
  END IF;

  IF v_id_sede IS NULL THEN
    RAISE EXCEPTION 'La sede es obligatoria para procesar la orden.';
  END IF;

  -- 1. Calcular subtotales
  -- Subtotal de entradas
  IF p_datos->'entradas' IS NOT NULL AND jsonb_array_length(p_datos->'entradas') > 0 THEN
    SELECT COALESCE(SUM((elem->>'precio_unitario')::numeric), 0)
    INTO v_subtotal_entradas
    FROM jsonb_array_elements(p_datos->'entradas') AS elem;
  END IF;

  -- Subtotal de productos
  IF p_datos->'productos' IS NOT NULL AND jsonb_array_length(p_datos->'productos') > 0 THEN
    SELECT COALESCE(SUM(((elem->>'precio_unitario')::numeric) * ((elem->>'cantidad')::integer)), 0)
    INTO v_subtotal_productos
    FROM jsonb_array_elements(p_datos->'productos') AS elem;
  END IF;

  v_subtotal := v_subtotal_entradas + v_subtotal_productos;
  IF v_subtotal <= 0 THEN
    RAISE EXCEPTION 'La orden no contiene ningún item válido (entradas o productos).';
  END IF;

  -- 2. Validar disponibilidad de butacas (si hay entradas)
  IF p_datos->'entradas' IS NOT NULL AND jsonb_array_length(p_datos->'entradas') > 0 THEN
    FOR v_entrada IN 
      SELECT 
        (elem->>'id_asiento_funcion')::uuid AS id_asiento_funcion,
        (elem->>'id_tipo_entrada')::uuid AS id_tipo_entrada,
        (elem->>'precio_lista')::numeric AS precio_lista,
        (elem->>'descuento')::numeric AS descuento,
        (elem->>'precio_unitario')::numeric AS precio_unitario
      FROM jsonb_array_elements(p_datos->'entradas') elem
    LOOP
      -- Verificar si el asiento_funcion ya está ocupado
      SELECT estado INTO v_asiento_estado
      FROM asiento_funcion
      WHERE id_asiento_funcion = v_entrada.id_asiento_funcion
      FOR UPDATE;

      IF v_asiento_estado = 'Ocupado' THEN
        RAISE EXCEPTION 'Uno de los asientos seleccionados ya ha sido adquirido por otro usuario.';
      END IF;
    END LOOP;
  END IF;

  -- 3. Validar cupón de descuento
  IF v_codigo_cupon IS NOT NULL THEN
    SELECT c.id_cupon, c.tipo_descuento, c.valor
    INTO v_id_cupon, v_producto.tipo_descuento, v_producto.valor
    FROM cupon c
    JOIN cupon_sede cs ON c.id_cupon = cs.id_cupon
    WHERE UPPER(c.codigo) = UPPER(v_codigo_cupon)
      AND c.activo = true
      AND c.fecha_inicio <= CURRENT_DATE
      AND c.fecha_fin >= CURRENT_DATE
      AND c.usos_actuales < c.usos_maximos
      AND cs.id_sede = v_id_sede
      AND cs.habilitado = true
      AND (cs.usos_maximos_sede IS NULL OR cs.usos_sede < cs.usos_maximos_sede)
    FOR UPDATE OF c;

    IF v_id_cupon IS NOT NULL THEN
      IF v_producto.tipo_descuento = 'Porcentaje' THEN
        v_descuento_cupon := ROUND(v_subtotal * (v_producto.valor / 100.0), 2);
      ELSE
        v_descuento_cupon := LEAST(v_producto.valor, v_subtotal);
      END IF;

      -- Incrementar usos
      UPDATE cupon SET usos_actuales = usos_actuales + 1 WHERE id_cupon = v_id_cupon;
      UPDATE cupon_sede SET usos_sede = usos_sede + 1 WHERE id_cupon = v_id_cupon AND id_sede = v_id_sede;
    END IF;
  END IF;

  -- 4. Validar Socio y canje de puntos
  IF v_id_usuario IS NOT NULL THEN
    SELECT s.puntos, COALESCE(n.multiplicador, 1.00)
    INTO v_puntos_socio, v_multiplicador
    FROM socio s
    LEFT JOIN nivel_socio n ON s.id_nivel = n.id_nivel
    WHERE s.id_usuario = v_id_usuario
    FOR UPDATE OF s;

    IF FOUND THEN
      v_es_socio := true;

      -- Si solicitó canje de puntos
      IF v_puntos_canjeados > 0 THEN
        IF v_puntos_canjeados < 50 THEN
          RAISE EXCEPTION 'El canje mínimo es de 50 puntos.';
        END IF;

        IF v_puntos_canjeados > v_puntos_socio THEN
          RAISE EXCEPTION 'Saldo de puntos insuficiente (tienes % pts).', v_puntos_socio;
        END IF;

        -- 1 punto = S/ 0.10, máximo 50% del subtotal con cupón
        v_descuento_puntos := ROUND(v_puntos_canjeados * 0.10, 2);
        IF v_descuento_puntos > ((v_subtotal - v_descuento_cupon) * 0.50) THEN
          v_descuento_puntos := ROUND((v_subtotal - v_descuento_cupon) * 0.50, 2);
          v_puntos_canjeados := CEIL(v_descuento_puntos / 0.10);
        END IF;

        -- Descontar puntos de la cuenta
        UPDATE socio 
        SET puntos = puntos - v_puntos_canjeados
        WHERE id_usuario = v_id_usuario;

        v_nuevo_saldo_puntos := v_puntos_socio - v_puntos_canjeados;

        -- Registrar en historial de puntos
        INSERT INTO historial_puntos_socio (
          id_usuario, id_orden, id_sede, tipo, puntos, saldo_resultante, descripcion
        ) VALUES (
          v_id_usuario, v_id_orden, v_id_sede, 'Canje', -v_puntos_canjeados, v_nuevo_saldo_puntos, 'Canje de puntos en compra Web'
        );
      ELSE
        v_nuevo_saldo_puntos := v_puntos_socio;
      END IF;
    END IF;
  END IF;

  -- Total a pagar
  v_total := GREATEST(0.00, v_subtotal - v_descuento_cupon - v_descuento_puntos);

  -- 5. Puntos ganados por la compra (1 sol = 1 punto base * multiplicador)
  IF v_es_socio AND v_total > 0 THEN
    v_puntos_ganados := FLOOR(v_total * v_multiplicador);
    IF v_puntos_ganados > 0 THEN
      UPDATE socio 
      SET puntos = puntos + v_puntos_ganados
      WHERE id_usuario = v_id_usuario;

      v_nuevo_saldo_puntos := v_nuevo_saldo_puntos + v_puntos_ganados;

      INSERT INTO historial_puntos_socio (
        id_usuario, id_orden, id_sede, tipo, puntos, saldo_resultante, descripcion
      ) VALUES (
        v_id_usuario, v_id_orden, v_id_sede, 'Acumulacion', v_puntos_ganados, v_nuevo_saldo_puntos, 'Puntos ganados por compra Web'
      );
    END IF;
  END IF;

  -- 6. Crear Orden
  v_codigo_orden := 'ORD-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || UPPER(SUBSTR(md5(random()::text), 1, 6));

  INSERT INTO orden (
    id_orden, codigo_orden, id_sede, id_usuario, id_vendedor, canal, id_cupon,
    correo_contacto, nombre_contacto, fecha_creacion, estado,
    subtotal_entradas, subtotal_productos, descuento_cupon,
    puntos_canjeados, descuento_puntos, total
  ) VALUES (
    v_id_orden, v_codigo_orden, v_id_sede, v_id_usuario, NULL, 'Web'::canal_venta, v_id_cupon,
    v_correo_contacto, v_nombre_contacto, now(), 'Pagada'::estado_orden,
    v_subtotal_entradas, v_subtotal_productos, v_descuento_cupon,
    v_puntos_canjeados, v_descuento_puntos, v_total
  );

  -- 7. Registrar detalle_entrada y ocupar asientos
  IF p_datos->'entradas' IS NOT NULL AND jsonb_array_length(p_datos->'entradas') > 0 THEN
    FOR v_entrada IN 
      SELECT 
        (elem->>'id_asiento_funcion')::uuid AS id_asiento_funcion,
        (elem->>'id_tipo_entrada')::uuid AS id_tipo_entrada,
        (elem->>'precio_lista')::numeric AS precio_lista,
        (elem->>'descuento')::numeric AS descuento,
        (elem->>'precio_unitario')::numeric AS precio_unitario
      FROM jsonb_array_elements(p_datos->'entradas') elem
    LOOP
      INSERT INTO detalle_entrada (
        id_detalle_entrada, id_orden, id_asiento_funcion, id_tipo_entrada,
        estado, precio_lista, descuento, precio_unitario,
        codigo_validacion, validada
      ) VALUES (
        gen_random_uuid(), v_id_orden, v_entrada.id_asiento_funcion, v_entrada.id_tipo_entrada,
        'Vigente', v_entrada.precio_lista, v_entrada.descuento, v_entrada.precio_unitario,
        'TKT-' || UPPER(SUBSTR(md5(random()::text), 1, 8)), false
      );

      -- Marcar asiento como Ocupado
      UPDATE asiento_funcion
      SET estado = 'Ocupado'
      WHERE id_asiento_funcion = v_entrada.id_asiento_funcion;

      -- Liberar de bloqueo temporal
      DELETE FROM bloqueo_temporal
      WHERE id_asiento_funcion = v_entrada.id_asiento_funcion;
    END LOOP;
  END IF;

  -- 8. Registrar detalle_producto y descontar stock
  IF p_datos->'productos' IS NOT NULL AND jsonb_array_length(p_datos->'productos') > 0 THEN
    FOR v_producto IN 
      SELECT 
        (elem->>'id_producto')::uuid AS id_producto,
        (elem->>'cantidad')::integer AS cantidad,
        (elem->>'precio_unitario')::numeric AS precio_unitario
      FROM jsonb_array_elements(p_datos->'productos') elem
    LOOP
      INSERT INTO detalle_producto (
        id_detalle_producto, id_orden, id_producto, cantidad, precio_unitario
      ) VALUES (
        gen_random_uuid(), v_id_orden, v_producto.id_producto, v_producto.cantidad, v_producto.precio_unitario
      );

      -- Descontar stock local en producto_sede si existe
      UPDATE producto_sede
      SET stock = GREATEST(0, COALESCE(stock, 0) - v_producto.cantidad),
          actualizado_en = now()
      WHERE id_sede = v_id_sede AND id_producto = v_producto.id_producto;
    END LOOP;
  END IF;

  -- 9. Registrar Pago
  INSERT INTO pago (
    id_pago, id_orden, metodo_pago, monto, estado, fecha_pago,
    referencia_pasarela, clave_idempotencia
  ) VALUES (
    gen_random_uuid(), v_id_orden, v_metodo_pago, v_total, 'Completado', now(),
    'PASARELA-SIM-' || TO_CHAR(now(), 'YYYYMMDDHH24MISS') || '-' || UPPER(SUBSTR(md5(random()::text), 1, 4)),
    COALESCE(p_datos->>'clave_idempotencia', gen_random_uuid()::text)
  );

  -- 10. Generar Comprobante (Boleta o Factura)
  IF v_tipo_comprobante = 'Factura' THEN
    v_serie := 'F' || LPAD(v_id_sede::text, 3, '0');
  ELSE
    v_serie := 'B' || LPAD(v_id_sede::text, 3, '0');
  END IF;

  -- Incrementar correlativo
  INSERT INTO correlativo_comprobante (id_sede, tipo, serie, ultimo)
  VALUES (v_id_sede, v_tipo_comprobante, v_serie, 1)
  ON CONFLICT (id_sede, tipo, serie)
  DO UPDATE SET ultimo = correlativo_comprobante.ultimo + 1
  RETURNING ultimo INTO v_correlativo;

  v_numero_comprobante := v_serie || '-' || LPAD(v_correlativo::text, 8, '0');
  v_subtotal_sin_igv := ROUND(v_total / 1.18, 2);
  v_igv := v_total - v_subtotal_sin_igv;

  INSERT INTO comprobante (
    id_comprobante, id_orden, id_sede, tipo,
    numero_documento_cliente, nombre_cliente, serie, correlativo,
    numero_comprobante, subtotal_sin_igv, igv, total, fecha_emision
  ) VALUES (
    gen_random_uuid(), v_id_orden, v_id_sede, v_tipo_comprobante,
    COALESCE(v_numero_documento, '00000000'), COALESCE(v_nombre_contacto, 'Cliente Web'),
    v_serie, v_correlativo, v_numero_comprobante,
    v_subtotal_sin_igv, v_igv, v_total, now()
  );

  -- 11. Limpiar cualquier bloqueo residual de esta sesión
  IF v_id_sesion IS NOT NULL AND v_id_sesion <> '' THEN
    DELETE FROM bloqueo_temporal WHERE id_sesion = v_id_sesion;
  END IF;

  -- 12. Retornar resultado con datos completos de la orden
  RETURN jsonb_build_object(
    'ok', true,
    'id_orden', v_id_orden,
    'codigo_orden', v_codigo_orden,
    'numero_comprobante', v_numero_comprobante,
    'tipo_comprobante', v_tipo_comprobante,
    'total', v_total,
    'subtotal', v_subtotal,
    'descuento_cupon', v_descuento_cupon,
    'descuento_puntos', v_descuento_puntos,
    'puntos_ganados', v_puntos_ganados,
    'saldo_puntos', v_nuevo_saldo_puntos,
    'fecha_creacion', now()
  );
END;
$$;
