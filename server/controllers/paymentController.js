import Stripe from 'stripe';
import asyncHandler from 'express-async-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { priceId } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    // Redirect URLs after payment
    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/canceled`,
    customer_email: req.user.email,
    client_reference_id: req.user._id.toString(),
  });

  res.status(200).json({
    success: true,
    url: session.url
  });
});
