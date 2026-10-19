import { describe, it, expect } from 'vitest';
import { AdminSedeService } from '../adminSedeService';

describe('AdminSedeService - Reglas de Negocio de Sede', () => {
  it('debe convertir correctamente horas a minutos y viceversa', () => {
    expect(AdminSedeService.horaAMinutos('00:00')).toBe(0);
    expect(AdminSedeService.horaAMinutos('14:30')).toBe(870);
    expect(AdminSedeService.horaAMinutos('23:59')).toBe(1439);

    expect(AdminSedeService.minutosAHora(0)).toBe('00:00');
    expect(AdminSedeService.minutosAHora(870)).toBe('14:30');
    expect(AdminSedeService.minutosAHora(1439)).toBe('23:59');
  });

  it('debe calcular la hora de fin estimada sumando duración y margen de 30 minutos de limpieza', () => {
    // Película de 120 minutos empezando a las 14:00 -> 120 + 30 = 150 min (2h30m) -> 16:30
    const fin1 = AdminSedeService.calcularHoraFinEstimada(120, '14:00', 30);
    expect(fin1).toBe('16:30');

    // Película de 95 minutos empezando a las 18:15 -> 95 + 30 = 125 min (2h05m) -> 20:20
    const fin2 = AdminSedeService.calcularHoraFinEstimada(95, '18:15', 30);
    expect(fin2).toBe('20:20');
  });

  it('debe detectar solapamiento de horarios en la misma sala', () => {
    // Rango A: 14:00 a 16:30
    const rangoA = { horaInicio: '14:00', horaFin: '16:30' };

    // Rango B que se solapa (15:00 a 17:00)
    const rangoSolapado = { horaInicio: '15:00', horaFin: '17:00' };
    expect(AdminSedeService.seSolapan(rangoA, rangoSolapado)).toBe(true);

    // Rango C que NO se solapa (17:00 a 19:00)
    const rangoLibre = { horaInicio: '17:00', horaFin: '19:00' };
    expect(AdminSedeService.seSolapan(rangoA, rangoLibre)).toBe(false);

    // Rango D inmediatamente anterior que termina a las 14:00
    const rangoAnterior = { horaInicio: '11:30', horaFin: '14:00' };
    expect(AdminSedeService.seSolapan(rangoA, rangoAnterior)).toBe(false);
  });

  it('debe validar DNI de 8 dígitos, teléfono de 9 dígitos y correo para alta de personal', () => {
    const personalInvalidoDni = {
      id_sede: 1,
      nombre: 'Carlos',
      apellido: 'Perez',
      correo: 'carlos@cinenautica.pe',
      dni: '12345', // Inválido
      telefono: '987654321',
      rol_codigo: 'counter_boleteria' as const,
    };
    const resDni = AdminSedeService.validarDatosPersonal(personalInvalidoDni);
    expect(resDni.valido).toBe(false);
    expect(resDni.error).toContain('DNI');

    const personalInvalidoTel = {
      ...personalInvalidoDni,
      dni: '12345678',
      telefono: '987654', // Inválido
    };
    const resTel = AdminSedeService.validarDatosPersonal(personalInvalidoTel);
    expect(resTel.valido).toBe(false);
    expect(resTel.error).toContain('teléfono');

    const personalValido = {
      ...personalInvalidoDni,
      dni: '87654321',
      telefono: '912345678',
    };
    const resOk = AdminSedeService.validarDatosPersonal(personalValido);
    expect(resOk.valido).toBe(true);
  });
});
