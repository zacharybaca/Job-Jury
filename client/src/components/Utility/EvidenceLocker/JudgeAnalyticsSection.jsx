import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useFetcher } from '../../../hooks/useFetcher';
import EvidenceLocker from './EvidenceLocker';

const JudgeAnalyticsSection = ({ companyId }) => {
  const { user } = useAuth();
  const { fetcher } = useFetcher();
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  const isJudge = user?.subscriptionTier === 'judge' || user?.isAdmin;

  // Memoize the getTrends function to prevent unnecessary effect triggers
  const getTrends = useCallback(async () => {
    try {
      // Ensure useFetcher prepends VITE_API_URL and includes credentials: 'include'
      const response = await fetcher(`/api/companies/${companyId}/trends`);
      if (response.success) {
        setTrends(response.data);
      }
    } catch (err) {
      console.error('Production Analytics Fetch Failure:', err);
    } finally {
      setLoading(false);
    }
  }, [companyId, fetcher]);

  useEffect(() => {
    if (isJudge && companyId) {
      getTrends();
    } else {
      setLoading(false);
    }
  }, [companyId, isJudge, getTrends]);

  if (!isJudge) {
    return (
      <div className="premium-lockout">
        <h4>Historical Trends Locked</h4>
        <p>
          Upgrade to the <strong>Judge Tier</strong> to view historical rating data.
        </p>
        <button onClick={() => (window.location.href = '/subscribe')}>
          View Plans
        </button>
      </div>
    );
  }

  if (loading) return <p className="loading-text">Analyzing historical verdicts...</p>;

  return <EvidenceLocker trends={trends} />;
};

export default JudgeAnalyticsSection;
