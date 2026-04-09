import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useFetcher } from '../../../hooks/useFetcher';

const LeakAnalyticsSection = ({ companyId }) => {
  const { user } = useAuth();
  const { fetcher } = useFetcher();
  const [leakTrends, setLeakTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  const isJudge = user?.subscriptionTier === 'judge' || user?.isAdmin;
  
  useEffect(() => {
    if (isJudge && companyId) {
        const fetchLeakTrends = async () => {
      setLoading(true);
      try {
        const data = await fetcher(`/api/interviews/company/${companyId}`);
        setLeakTrends(data);
      } catch (error) {
        console.error('Error fetching leak trends:', error);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchLeakTrends();
    }
    }

  }, [companyId, fetcher, isJudge]);

  if (!isJudge) {
    return (
      <div className="premium-lockout">
        <h4>Historical Trends Locked</h4>
        <p>
          Upgrade to the <strong>Judge Tier</strong> to view historical rating
          data.
        </p>
        <button onClick={() => (window.location.href = '/subscribe')}>
          View Plans
        </button>
      </div>
    );
  }

  if (loading) {
    return <div>Loading leak analytics...</div>;
  }

  return (
    <div>
      <h3>Leak Trends</h3>
      <ul>
        {leakTrends.map((trend, index) => (
          <li key={index}>{trend}</li>
        ))}
      </ul>
    </div>
  );
};

export default LeakAnalyticsSection;
