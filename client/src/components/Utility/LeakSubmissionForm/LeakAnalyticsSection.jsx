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
        const data = await fetcher(`/api/interviews/company/${companyId}/analytics`);
        setAnalytics(data);
      } catch (err) {
        setError(`Failed to load historical trends. ${err.message}`);
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
          <p className="text-muted">
            Gain access to historical rating trends, difficulty volatility, and role-specific outcome ratios.
          </p>
          <Button variant="success" className="btn-emerald px-4" onClick={() => (window.location.href = '/subscribe')}>
            Upgrade Now
          </Button>
        </Card.Body>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-muted">Analyzing leak data...</p>
      </div>
    );
  }

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <section className="section-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Leak Analytics</h2>
        <span className="badge bg-soft-emerald text-emerald">Judge Access</span>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="analytics-stat-card border-0 shadow-sm">
            <Card.Body>
              <h6 className="text-muted text-uppercase small fw-bold">Avg. Difficulty</h6>
              <h2 className="fw-bold m-0">{analytics?.avgDifficulty || 'N/A'}</h2>
            </Card.Body>
          </Card>
        </Col>
        {/* Additional Metric Cards */}
      </Row>

      <div className="leak-trends-container">
        <h5 className="fw-bold mb-3">Recent Activity Feed</h5>
        {analytics?.recentLeaks?.length === 0 ? (
          <p className="text-muted">No data available for this company.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {analytics?.recentLeaks.map((leak, index) => (
              <li key={index} className="list-group-item bg-transparent px-0 border-bottom">
                {leak}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default LeakAnalyticsSection;
