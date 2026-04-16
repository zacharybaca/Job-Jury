import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import '../LeakSubmissionForm/leak-submission-form.css';

const EvidenceLocker = ({ trends = [] }) => {
  // Defensive check for data structure
  const dataArray = Array.isArray(trends) ? trends : trends?.data || [];

  // Map data with null-safety for numeric fields
  const chartData = dataArray.map((t) => ({
    date: t._id ? `${t._id.month}/${t._id.year}` : 'N/A',
    rating: t.avgRating ? parseFloat(t.avgRating.toFixed(2)) : 0,
  }));

  if (chartData.length === 0) {
    return (
      <div className="evidence-locker empty-state">
        <h3 className="chart-title">Historical Verdict Trends</h3>
        <p className="text-muted text-center py-5">
          Insufficient historical data to generate trends for this entity.
        </p>
      </div>
    );
  }

  return (
    <div className="evidence-locker">
      <h3 className="chart-title">Historical Verdict Trends</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              domain={[0, 5]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EvidenceLocker;
