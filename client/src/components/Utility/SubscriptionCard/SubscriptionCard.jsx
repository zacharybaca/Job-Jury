import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useFetcher } from '../../../hooks/useFetcher';

const SubscriptionCard = ({ tierName, priceLabel, priceId, tierKey }) => {
  const { user } = useAuth();
  const { fetcher } = useFetcher();
  const [loading, setLoading] = useState(false);

  const isCurrentTier = user?.subscriptionTier === tierKey;

  const handleSubscribe = async () => {
    if (isCurrentTier) return;

    setLoading(true);
    const res = await fetcher('/api/payments/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ priceId }),
    });

    if (res.success && res.data.url) {
      window.location.href = res.data.url;
    } else {
      setLoading(false);
      alert(res.error || 'Checkout failed to initialize.');
    }
  };

  return (
    <div className={`subscription-card ${isCurrentTier ? 'current-tier' : ''}`}>
      <h3>{tierName}</h3>
      <p className="price-label">{priceLabel}</p>
      {isCurrentTier ? (
        <button disabled className="btn-current">
          Current Plan
        </button>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="subscribe-btn"
        >
          {loading ? 'Processing...' : 'Subscribe'}
        </button>
      )}
    </div>
  );
};

export default SubscriptionCard;
