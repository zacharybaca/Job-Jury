import React from 'react';
import SubscriptionCard from './SubscriptionCard';

const SubscribePage = () => {
  return (
    <div className="subscription-container">
      <SubscriptionCard
        tierName="Juror Tier"
        priceLabel="$9.99/mo"
        priceId="price_1P..." // From Stripe Dashboard
      />
      <SubscriptionCard
        tierName="Judge Tier"
        priceLabel="$19.99/mo"
        priceId="price_1Q..." // From Stripe Dashboard
      />
    </div>
  );
};

export default SubscribePage;
