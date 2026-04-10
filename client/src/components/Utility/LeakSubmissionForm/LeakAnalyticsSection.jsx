import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useFetcher } from '../../../hooks/useFetcher';
import { Card, Row, Col, Spinner, Button } from 'react-bootstrap';
import './leak-submission-form.css';

const LeakAnalyticsSection = ({ companyId }) => {
  const { user } = useAuth();
  const { fetcher } = useFetcher();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isJudge = user?.subscriptionTier === 'judge' || user?.isAdmin;

  useEffect(() => {
    const fetchLeakTrends = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetcher(`/api/interviews/company/${companyId}/analytics`);
        setAnalytics(response.success ? response : null);
      } catch (err) {
        setError(`Failed to load historical trends.`);
      } finally {
        setLoading(false);
      }
    };

    if (isJudge && companyId) {
      fetchLeakTrends();
    }
  }, [companyId, fetcher, isJudge]);

  if (!isJudge) {
    return (
      <Card className="premium-lockout-card border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <div className="lock-icon mb-3">🔒</div>
          <h4 className="fw-bold">Judge Tier Required</h4>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '300px' }}>
            Unlock interview difficulty trends and offer ratios for this firm.
          </p>
          <Button variant="success" className="btn-emerald px-4" onClick={() => (window.location.href = '/subscribe')}>
            Upgrade
          </Button>
        </Card.Body>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="section-leaks-container d-flex flex-column align-items-center justify-content-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3 text-muted">Analyzing the Repository...</p>
      </div>
    );
  }

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="section-leaks-container">
      <div className="leak-analytics-header mb-4">
        <div>
          <h4 className="fw-bold m-0">Leak Analytics</h4>
          <p className="text-muted smallest m-0 text-uppercase ls-wide">Intelligence Report</p>
        </div>
        <span className="badge bg-soft-emerald text-emerald">Judge Access</span>
      </div>

      <Card className="analytics-hero-card border-0 mb-4">
        <Card.Body className="d-flex align-items-center justify-content-between p-4">
          <div className="hero-label">
            <h6 className="text-muted text-uppercase small fw-bold mb-1">Avg. Difficulty</h6>
            <p className="smallest text-muted m-0">Scale: 1.0 (Easy) - 5.0 (Hard)</p>
          </div>
          <div className="hero-value">
            <span className="display-5 fw-bold text-emerald">{analytics?.avgDifficulty || '0.0'}</span>
          </div>
        </Card.Body>
      </Card>

      <div className="recent-activity-section">
        <h6 className="fw-bold mb-3 text-muted text-uppercase small">Recent Repository Activity</h6>
        {!analytics?.recentLeaks || analytics.recentLeaks.length === 0 ? (
          <div className="text-center py-3 bg-light rounded-3">
            <p className="text-muted small m-0">No data logged yet.</p>
          </div>
        ) : (
          <div className="activity-list">
            {analytics.recentLeaks.map((leak, index) => {
               const [role, outcome] = leak.split(' - ');
               return (
                <div key={index} className="activity-item d-flex justify-content-between align-items-center py-2 border-bottom">
                  <span className="small text-dark fw-medium">{role}</span>
                  <span className={`badge-pill-sm ${outcome === 'Offer' ? 'bg-offer' : 'bg-rejection'}`}>
                    {outcome}
                  </span>
                </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeakAnalyticsSection;
