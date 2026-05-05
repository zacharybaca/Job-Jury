import React from 'react';
import { useFetcher } from '../../hooks/useFetcher';

const SubscriptionCard = ({ tierName, priceLabel, priceId }) => {
  const { fetcher } = useFetcher();

  const handleSubscribe = async () => {
    const res = await fetcher('/api/payments/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ priceId })
    });

    if (res.success && res.data.url) {
      window.location.href = res.data.url;
    } else {
      alert("Checkout failed to initialize.");
    }
  };

  return (
    <div className="subscription-card">
      <h3>{tierName}</h3>
      <p>{priceLabel}</p>
      <button onClick={handleSubscribe}>Subscribe</button>
    </div>
  );
};

export default SubscriptionCard;
