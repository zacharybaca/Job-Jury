import React from 'react';
import { useFetcher } from '../hooks/useFetcher';

const SubscriptionCard = ({ priceId, tierName, priceLabel }) => {
  const { fetcher } = useFetcher();

  const handleSubscribe = async () => {
    const response = await fetcher('/api/payments/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ priceId }),
    });

    if (response.success && response.url) {
      // Redirect to Stripe's secure checkout page
      window.location.href = response.url;
    } else {
      alert(response.error || 'Failed to initiate checkout.');
    }
  };

  return (
    <div className="tier-card">
      <h3>{tierName}</h3>
      <p className="price">{priceLabel}</p>
      <button onClick={handleSubscribe} className="subscribe-btn">
        Upgrade to {tierName}
      </button>
    </div>
  );
};

export default SubscriptionCard;
