import React from 'react';
import SubscriptionCard from '../../Utility/SubscriptionCard/SubscriptionCard';

// Detection logic for environment (Vite/import.meta)
const isProduction =
  typeof import.meta !== 'undefined' && import.meta.env?.PROD;

const STRIPE_PRICES = isProduction
  ? {
      free: 'price_1THBlGPPcImIkQHpnkTik0t8',
      juror: 'price_1THgmLPPcImIkQHpAM5ShM2P',
      judge: 'price_1THgnKPPcImIkQHpnjTRmea4',
      firm: 'price_1THgnwPPcImIkQHpjcvyqDB2',
    }
  : {
      free: 'price_1TTnPVAZa6QGV1FF5WBiRFDE',
      juror: 'price_1TTnRyAZa6QGV1FFMDgq5nl0',
      judge: 'price_1TTnTPAZa6QGV1FFPiqp160N',
      firm: 'price_1TTnUbAZa6QGV1FFmYkvUsMy',
    };

const SubscribePage = () => {
  return (
    <div className="subscription-container">
      <SubscriptionCard
        tierName="Free Tier"
        tierKey="free"
        priceLabel="$0/mo"
        priceId={STRIPE_PRICES.free}
      />
      <SubscriptionCard
        tierName="Juror Tier"
        tierKey="juror"
        priceLabel="$5.00/mo"
        priceId={STRIPE_PRICES.juror}
      />
      <SubscriptionCard
        tierName="Judge Tier"
        tierKey="judge"
        priceLabel="$10.00/mo"
        priceId={STRIPE_PRICES.judge}
      />
      <SubscriptionCard
        tierName="Firm Tier"
        tierKey="firm"
        priceLabel="$15.00/mo"
        priceId={STRIPE_PRICES.firm}
      />
    </div>
  );
};

export default SubscribePage;
