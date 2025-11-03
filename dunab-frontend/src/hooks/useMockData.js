/**
 * Hook con datos mock para desarrollo sin backend
 */

export const useMockTransactions = () => {
  return [
    {
      id: 1,
      estudianteId: 'U12345678',
      tipo: 'ingreso',
      monto: 100,
      categoria: 'Académico',
      descripcion: 'Recompensa por completar Estructuras de Datos',
      referencia: 'REF-2024-001',
      fecha: '2024-11-01T10:30:00',
      estado: 'completada'
    },
    {
      id: 2,
      estudianteId: 'U12345678',
      tipo: 'egreso',
      monto: 50,
      categoria: 'Evento',
      descripcion: 'Inscripción a Conferencia de IA',
      referencia: 'REF-2024-002',
      fecha: '2024-11-02T14:15:00',
      estado: 'activa'
    },
    {
      id: 3,
      estudianteId: 'U12345678',
      tipo: 'ingreso',
      monto: 75,
      categoria: 'Evento',
      descripcion: 'Asistencia a Hackathon 2024',
      referencia: 'REF-2024-003',
      fecha: '2024-11-03T09:00:00',
      estado: 'completada'
    },
    {
      id: 4,
      estudianteId: 'U12345678',
      tipo: 'credito',
      monto: 200,
      categoria: 'Recompensa',
      descripcion: 'Bono por promedio académico excelente',
      referencia: 'REF-2024-004',
      fecha: '2024-10-28T16:45:00',
      estado: 'completada'
    },
    {
      id: 5,
      estudianteId: 'U12345678',
      tipo: 'debito',
      monto: 30,
      categoria: 'Servicio',
      descripcion: 'Uso de laboratorio de cómputo',
      referencia: 'REF-2024-005',
      fecha: '2024-10-30T11:20:00',
      estado: 'activa'
    },
    {
      id: 6,
      estudianteId: 'U12345678',
      tipo: 'ingreso',
      monto: 150,
      categoria: 'Académico',
      descripcion: 'Proyecto de investigación aprobado',
      referencia: 'REF-2024-006',
      fecha: '2024-10-25T13:30:00',
      estado: 'completada'
    },
    {
      id: 7,
      estudianteId: 'U12345678',
      tipo: 'egreso',
      monto: 80,
      categoria: 'Compra',
      descripcion: 'Material de estudio - Libros digitales',
      referencia: 'REF-2024-007',
      fecha: '2024-10-22T10:00:00',
      estado: 'pendiente'
    },
    {
      id: 8,
      estudianteId: 'U12345678',
      tipo: 'ingreso',
      monto: 50,
      categoria: 'Evento',
      descripcion: 'Participación en seminario',
      referencia: 'REF-2024-008',
      fecha: '2024-10-20T15:45:00',
      estado: 'completada'
    },
    {
      id: 9,
      estudianteId: 'U12345678',
      tipo: 'egreso',
      monto: 25,
      categoria: 'Servicio',
      descripcion: 'Impresiones y copias',
      referencia: 'REF-2024-009',
      fecha: '2024-10-18T09:30:00',
      estado: 'anulada'
    },
    {
      id: 10,
      estudianteId: 'U12345678',
      tipo: 'credito',
      monto: 120,
      categoria: 'Académico',
      descripcion: 'Completar curso de programación avanzada',
      referencia: 'REF-2024-010',
      fecha: '2024-10-15T12:00:00',
      estado: 'completada'
    }
  ];
};

export const useMockCategories = () => {
  return [
    { id: 1, nombre: 'Académico', tipo: 'ingreso' },
    { id: 2, nombre: 'Evento', tipo: 'ambos' },
    { id: 3, nombre: 'Servicio', tipo: 'egreso' },
    { id: 4, nombre: 'Recompensa', tipo: 'ingreso' },
    { id: 5, nombre: 'Compra', tipo: 'egreso' }
  ];
};

export const useMockBalance = () => {
  return {
    saldo: 470,
    totalIngresos: 695,
    totalEgresos: 185,
    transaccionesRecientes: 10
  };
};
