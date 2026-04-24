import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useFetcher } from '../../../hooks/useFetcher';
import { useAuth } from '../../../hooks/useAuth';
import './newsfeed.css';

const Newsfeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedIds, setDismissedIds] = useState(() => {
    const saved = localStorage.getItem('dismissedJuryUpdates');
    return saved ? JSON.parse(saved) : [];
  });
  const { fetcher } = useFetcher();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      const response = await fetcher('/api/feed');
      if (response.success) {
        setFeedItems(response.data?.data || []);
      } else {
        console.error('Failed to load feed:', response.error);
      }
      setLoading(false);
    };

    fetchFeed();
  }, [fetcher, user]);

  const handleDismiss = (id) => {
    const updatedDismissed = [...dismissedIds, id];
    setDismissedIds(updatedDismissed);
    localStorage.setItem('dismissedJuryUpdates', JSON.stringify(updatedDismissed));
  };

  const visibleFeedItems = feedItems.filter((item) => !dismissedIds.includes(item._id));

  if (loading) return <div className="feed-loading">Gathering the latest evidence...</div>;

  if (visibleFeedItems.length === 0) {
    return (
      <div className="feed-empty">
        <p>No new updates available.</p>
      </div>
    );
  }

  return (
    <div className="newsfeed-container">
      <h2 className="newsfeed-header">{user && user.name ? `${user.name}'s Personalized Jury Newsfeed` : 'Newsfeed'}</h2>
      <div className="newsfeed-list">
        {visibleFeedItems.map((item) => (
          <Card key={item._id} className="feed-card shadow-sm mb-3">
            <Card.Header className="feed-card-header">
              <div className="feed-header-info">
                <div className="feed-company">{item.company?.name}</div>
                <div className="feed-timestamp">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button
                className="dismiss-btn"
                onClick={() => handleDismiss(item._id)}
                aria-label="Dismiss update"
              >
                &times;
              </button>
            </Card.Header>
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">
                New Update by {item.author?.username}
              </Card.Subtitle>
              <Card.Text as="div" className="feed-content">
                {item.rating && (
                  <div className="feed-rating">Rating: {item.rating}/5</div>
                )}
                <div className="feed-text">{item.content}</div>
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Newsfeed;
