import React from 'react';

const DataTable = ({ columns, data, onPageChange }) => {
  // TODO: Implementar tabla de datos con paginación

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {/* TODO: Mapear columnas */}
          </tr>
        </thead>
        <tbody>
          {/* TODO: Mapear datos */}
        </tbody>
      </table>
      {/* TODO: Agregar paginación */}
    </div>
  );
};

export default DataTable;
