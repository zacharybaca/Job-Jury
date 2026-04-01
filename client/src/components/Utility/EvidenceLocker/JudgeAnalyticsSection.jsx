import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useFetcher } from '../../../hooks/useFetcher';
import EvidenceLocker from './EvidenceLocker';

const JudgeAnalyticsSection = ({ companyId }) => {
  const { user } = useAuth();
  const { fetcher } = useFetcher();
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  const isJudge = user?.subscriptionTier === 'judge' || user?.isAdmin;

  useEffect(() => {
    if (isJudge && companyId) {
      const getTrends = async () => {
        const response = await fetcher(`/api/companies/${companyId}/trends`);
        if (response.success) setTrends(response.data);
        setLoading(false);
      };
      getTrends();
    }
  }, [companyId, isJudge, fetcher]);

  if (!isJudge) {
    return (
      <div className="premium-lockout">
        <h4>Historical Trends Locked</h4>
        <p>Upgrade to the <strong>Judge Tier</strong> to view historical rating data.</p>
        <button onClick={() => window.location.href = '/subscribe'}>View Plans</button>
      </div>
    );
  }

  if (loading) return <p>Analyzing historical verdicts...</p>;

  return <EvidenceLocker trends={trends} />;
};

export default JudgeAnalyticsSection;
