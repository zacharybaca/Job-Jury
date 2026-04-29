import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../LeakSubmissionForm/leak-submission-form.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EvidenceLocker = ({ trends = [] }) => {
  const dataArray = Array.isArray(trends) ? trends : trends?.data || [];

  const rawChartData = dataArray.map((t) => ({
    date: t._id ? `${t._id.month}/${t._id.year}` : 'N/A',
    rating: t.avgRating ? parseFloat(t.avgRating.toFixed(2)) : 0,
  }));

  if (rawChartData.length === 0) {
    return (
      <div className="evidence-locker empty-state">
        <h3 className="chart-title">Historical Verdict Trends</h3>
        <p className="text-muted text-center py-5">
          Insufficient historical data to generate trends for this entity.
        </p>
      </div>
    );
  }

  const chartData = {
    labels: rawChartData.map((d) => d.date),
    datasets: [
      {
        label: 'Average Rating',
        data: rawChartData.map((d) => d.rating),
        borderColor: '#10b981',
        backgroundColor: '#10b981',
        borderWidth: 3,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#6b7280',
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: { size: 12 },
          padding: 10,
        },
        border: { display: false },
      },
      y: {
        min: 0,
        max: 5,
        grid: {
          color: '#e5e7eb',
          tickLength: 0,
        },
        border: {
          display: false,
          dash: [3, 3],
        },
        ticks: {
          color: '#6b7280',
          font: { size: 12 },
          padding: 10,
        },
      },
    },
  };

  return (
    <div className="evidence-locker">
      <h3 className="chart-title">Historical Verdict Trends</h3>
      <div
        className="chart-container"
        style={{ height: '300px', width: '100%' }}
      >
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default EvidenceLocker;
