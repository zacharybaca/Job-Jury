import React, { useEffect, useState } from 'react';
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
        console.log('Fetched feed items:', response.data?.data || []);
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
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <div className="feed-loading">Typesetting the latest evidence...</div>;

  if (visibleFeedItems.length === 0) {
    return (
      <div className="feed-empty">
        <p>No new updates for the press at this time.</p>
      </div>
    );
  }

  return (
    <div className="newspaper-wrapper">
      <header className="newspaper-masthead">
        <h1 className="newspaper-title">THE JURY GAZETTE</h1>
        <div className="newspaper-meta">
          <span>{user && user.name ? `EDITION FOR: ${user.name.toUpperCase()}` : 'DAILY EDITION'}</span>
          <span>{currentDate}</span>
          <span>VOL. I</span>
        </div>
      </header>

      <main className="newspaper-content">
        {visibleFeedItems.map((item, index) => (
          <article key={item._id} className="newspaper-article">
            <div className="article-header">
              <h2 className="article-company">{item.company?.name}</h2>
              <button
                className="newspaper-dismiss"
                onClick={() => handleDismiss(item._id)}
                aria-label="Dismiss update"
              >
                &times;
              </button>
            </div>

            <h3 className="article-headline">Evidence Submitted by {item.author?.username}</h3>
            <img src={item.author?.avatar || 'assets/icons/anonymous_avatar.png'} alt={`${item.author?.username}'s avatar`} className="article-avatar" />

            <div className="article-submeta">
              <span className="article-date">{new Date(item.createdAt).toLocaleDateString()}</span>
              {item.rating && <span className="article-rating">Rating: {item.rating}/5</span>}
            </div>

            <p className="article-text">
              {index === 0 && item.body ? (
                <>
                  <span className="drop-cap">{item.body.charAt(0)}</span>
                  {item.body.slice(1)}
                </>
              ) : (
                item.body || "No additional text provided for this update."
              )}
            </p>
          </article>
        ))}
      </main>
    </div>
  );
};

export default Newsfeed;
