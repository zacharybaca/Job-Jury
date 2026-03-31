import Stripe from 'stripe';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { priceId } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.CLIENT_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.CLIENT_URL}/subscribe?payment=cancelled`,
    customer_email: req.user.email,
    client_reference_id: req.user._id.toString(),
  });

  res.status(200).json({ success: true, url: session.url });
});

export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const userId = session.client_reference_id;

  const amount = session.amount_total;
  let tier = 'free';
  if (amount === 999) tier = 'juror';
  if (amount === 1999) tier = 'judge';
  // Add firm tier if amount matches (e.g., $49.99)
  if (amount === 4999) tier = 'firm';

  await User.findByIdAndUpdate(userId, {
    isPremium: tier !== 'free',
    subscriptionTier: tier,
    stripeCustomerId: session.customer,
    stripeSubscriptionId: session.subscription, // Matches current User.js field name
  });
}

  res.json({ received: true });
});
