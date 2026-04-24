import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useFetcher } from '../../../hooks/useFetcher';
import './newsfeed.css';

const Newsfeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      const response = await fetcher('/api/feed');
      if (response.success) {
        // Access the nested array and fallback to empty array to prevent map errors
        setFeedItems(response.data?.data || []);
      } else {
        console.error('Failed to load feed:', response.error);
      }
      setLoading(false);
    };

    fetchFeed();
  }, [fetcher]);

  if (loading) return <div className="feed-loading">Gathering the latest evidence...</div>;

  if (feedItems.length === 0) {
    return (
      <div className="feed-empty">
        <p>You have no saved companies or there are no recent updates.</p>
      </div>
    );
  }

  return (
    <div className="newsfeed-container">
      <h2 className="newsfeed-header">Jury Updates</h2>
      <div className="newsfeed-list">
        {feedItems.map((item) => (
          <Card key={item._id} className="feed-card shadow-sm mb-3">
            <Card.Header className="feed-card-header">
              <div className="feed-company">{item.company?.name}</div>
              <div className="feed-timestamp">
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
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
