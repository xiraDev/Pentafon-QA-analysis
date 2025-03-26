export const templateStatus = (opt) =>
  ({
    APPROVED: 'Aprobada',
    IN_APPEAL: 'En Apelación',
    PENDING: 'Pendiente',
    REJECTED: 'Rechazada',
    PENDING_DELETION: 'Eliminación Pendiente',
    DELETED: 'Eliminada',
    DISABLED: 'Deshabilitada',
    PAUSED: 'En Pausa',
    LIMIT_EXCEEDED: 'Límite Excedido',
  })[opt];
