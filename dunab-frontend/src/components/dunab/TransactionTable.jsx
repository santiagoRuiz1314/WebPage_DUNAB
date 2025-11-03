import React from 'react';

const TransactionTable = ({ transactions }) => {
  // TODO: Implementar tabla de transacciones con paginación

  return (
    <div className="transaction-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Categoría</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {/* TODO: Mapear transacciones */}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
