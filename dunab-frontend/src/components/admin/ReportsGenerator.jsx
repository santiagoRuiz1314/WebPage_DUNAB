import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  generateTransactionReport,
  generateStudentReport,
  generateEventReport,
  getSystemStatistics,
  getStudentRanking,
  exportReportToCSV,
  exportReportToPDF,
} from '../../services/reportService';
import LoadingSpinner from '../shared/LoadingSpinner';
import './ReportsGenerator.css';

const ReportsGenerator = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState('transactions');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    categoryId: '',
  });

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      let data;

      switch (reportType) {
        case 'transactions':
          data = await generateTransactionReport(filters);
          break;
        case 'students':
          data = await generateStudentReport(filters);
          break;
        case 'events':
          data = await generateEventReport(filters);
          break;
        case 'statistics':
          data = await getSystemStatistics();
          break;
        case 'ranking':
          data = await getStudentRanking(20);
          break;
        default:
          data = null;
      }

      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
      alert(t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    if (!reportData) return;

    try {
      setLoading(true);
      let blob;

      if (format === 'csv') {
        blob = await exportReportToCSV(reportData, reportType);
      } else if (format === 'pdf') {
        blob = await exportReportToPDF(reportData, reportType);
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${reportType}-${new Date().toISOString()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert(t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-generator">
      <h2>{t('admin.reports')}</h2>

      <div className="report-controls">
        <div className="form-group">
          <label>{t('admin.reportType')}</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="report-select"
          >
            <option value="transactions">{t('admin.transactions')}</option>
            <option value="students">{t('admin.students')}</option>
            <option value="events">{t('admin.events')}</option>
            <option value="statistics">{t('admin.statistics')}</option>
            <option value="ranking">{t('dunab.ranking')}</option>
          </select>
        </div>

        {(reportType === 'transactions' || reportType === 'events') && (
          <div className="filters-row">
            <div className="form-group">
              <label>{t('transactions.from')}</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{t('transactions.to')}</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? t('common.loading') : t('admin.generateReport')}
          </button>
        </div>
      </div>

      {reportData && (
        <div className="report-results">
          <div className="report-header">
            <h3>{t('admin.reportResults')}</h3>
            <div className="export-buttons">
              <button className="btn btn-secondary" onClick={() => handleExport('csv')}>
                {t('common.export')} CSV
              </button>
              <button className="btn btn-secondary" onClick={() => handleExport('pdf')}>
                {t('common.export')} PDF
              </button>
            </div>
          </div>

          <div className="report-content">
            <pre>{JSON.stringify(reportData, null, 2)}</pre>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner />}
    </div>
  );
};

export default ReportsGenerator;
