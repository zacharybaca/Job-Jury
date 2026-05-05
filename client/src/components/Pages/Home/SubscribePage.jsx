import React from 'react';
import SubscriptionCard from './SubscriptionCard';

const SubscribePage = () => {
  return (
    <div className="subscription-container">
      <SubscriptionCard
        tierName="Free Tier"
        priceLabel="$0/mo"
        priceId="price_1THBlGPPcImIkQHpnkTik0t8" // Replace with actual Stripe Price ID for free tier if needed
      />
      <SubscriptionCard
        tierName="Juror Tier"
        priceLabel="$5.00/mo"
        priceId="price_1THgmLPPcImIkQHpAM5ShM2P" // Replace with actual Stripe Price ID
      />
      <SubscriptionCard
        tierName="Judge Tier"
        priceLabel="$10.00/mo"
        priceId="price_1THgnKPPcImIkQHpnjTRmea4" // Replace with actual Stripe Price ID
      />
      <SubscriptionCard
        tierName="Firm Tier"
        priceLabel="$15.00/mo"
        priceId="price_1THgnwPPcImIkQHpjcvyqDB2" // Replace with actual Stripe Price ID
      />
    </div>
  );
};

export default SubscribePage;
