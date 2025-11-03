import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useDunab } from '../../context/DunabContext';
import { formatCurrency } from '../../utils/formatters';
import './BalanceChart.css';

/**
 * Componente de gráficos para visualizar el balance DUNAB
 * Muestra evolución de ingresos, gastos y balance
 */
const BalanceChart = () => {
  const { transactions, loading } = useDunab();
  const [chartType, setChartType] = useState('area'); // 'line', 'area', 'bar'
  const [timeRange, setTimeRange] = useState('7d'); // '7d', '30d', 'all'

  /**
   * Procesar transacciones para crear datos del gráfico
   * Agrupa transacciones por fecha y calcula balance acumulado
   */
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Filtrar por rango de tiempo
    const now = new Date();
    const filtered = transactions.filter(tx => {
      const txDate = new Date(tx.fecha || tx.date);
      if (timeRange === '7d') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return txDate >= weekAgo;
      } else if (timeRange === '30d') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return txDate >= monthAgo;
      }
      return true;
    });

    // Agrupar por fecha
    const grouped = {};
    let runningBalance = 0;

    // Ordenar transacciones por fecha (más antiguas primero)
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.fecha || a.date);
      const dateB = new Date(b.fecha || b.date);
      return dateA - dateB;
    });

    sorted.forEach(tx => {
      const date = new Date(tx.fecha || tx.date);
      const dateKey = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short'
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          ingresos: 0,
          gastos: 0,
          balance: 0
        };
      }

      const amount = tx.monto || tx.amount || 0;
      const tipo = tx.tipo || tx.type;

      if (tipo === 'ingreso' || tipo === 'credito' || tipo === 'credit') {
        grouped[dateKey].ingresos += amount;
        runningBalance += amount;
      } else if (tipo === 'egreso' || tipo === 'debito' || tipo === 'debit') {
        grouped[dateKey].gastos += amount;
        runningBalance -= amount;
      }

      grouped[dateKey].balance = runningBalance;
    });

    return Object.values(grouped);
  }, [transactions, timeRange]);

  /**
   * Formatter personalizado para el tooltip
   */
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-date">{payload[0].payload.date}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              <span className="tooltip-label">{entry.name}:</span>
              <span className="tooltip-value">{formatCurrency(entry.value)} D</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  /**
   * Renderizar el gráfico según el tipo seleccionado
   */
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    const xAxisProps = {
      dataKey: 'date',
      stroke: 'var(--text-secondary)',
      style: { fontSize: '0.75rem' }
    };

    const yAxisProps = {
      stroke: 'var(--text-secondary)',
      style: { fontSize: '0.75rem' }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#10b981"
              name="Ingresos"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="gastos"
              stroke="#ef4444"
              name="Gastos"
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#4f46e5"
              name="Balance"
              strokeWidth={2}
              dot={{ fill: '#4f46e5', r: 4 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#10b981"
              fill="url(#colorIngresos)"
              name="Ingresos"
            />
            <Area
              type="monotone"
              dataKey="gastos"
              stroke="#ef4444"
              fill="url(#colorGastos)"
              name="Gastos"
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" />
            <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
          </BarChart>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="balance-chart">
        <div className="chart-header">
          <h3>📈 Balance DUNAB</h3>
        </div>
        <div className="chart-loading">
          <div className="spinner"></div>
          <p>Cargando gráfico...</p>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="balance-chart">
        <div className="chart-header">
          <h3>📈 Balance DUNAB</h3>
        </div>
        <div className="chart-empty">
          <p>No hay suficientes datos para mostrar el gráfico</p>
          <span>Realiza algunas transacciones para ver tu evolución</span>
        </div>
      </div>
    );
  }

  return (
    <div className="balance-chart">
      <div className="chart-header">
        <div>
          <h3>📈 Balance DUNAB</h3>
          <span className="chart-subtitle">Evolución de tus finanzas</span>
        </div>

        <div className="chart-controls">
          {/* Selector de tipo de gráfico */}
          <div className="chart-type-selector">
            <button
              className={chartType === 'area' ? 'active' : ''}
              onClick={() => setChartType('area')}
              title="Gráfico de área"
            >
              📊
            </button>
            <button
              className={chartType === 'line' ? 'active' : ''}
              onClick={() => setChartType('line')}
              title="Gráfico de líneas"
            >
              📈
            </button>
            <button
              className={chartType === 'bar' ? 'active' : ''}
              onClick={() => setChartType('bar')}
              title="Gráfico de barras"
            >
              📊
            </button>
          </div>

          {/* Selector de rango de tiempo */}
          <div className="time-range-selector">
            <button
              className={timeRange === '7d' ? 'active' : ''}
              onClick={() => setTimeRange('7d')}
            >
              7 días
            </button>
            <button
              className={timeRange === '30d' ? 'active' : ''}
              onClick={() => setTimeRange('30d')}
            >
              30 días
            </button>
            <button
              className={timeRange === 'all' ? 'active' : ''}
              onClick={() => setTimeRange('all')}
            >
              Todo
            </button>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceChart;
