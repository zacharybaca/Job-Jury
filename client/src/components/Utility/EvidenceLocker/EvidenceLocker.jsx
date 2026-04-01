import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const EvidenceLocker = ({ trends = [] }) => {
  const chartData = trends.map((t) => ({
    date: `${t._id.month}/${t._id.year}`,
    rating: parseFloat(t.avgRating.toFixed(2)),
  }));

  return (
    <div className="evidence-locker">
      <h3>Historical Verdict Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#10b981"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvidenceLocker;
