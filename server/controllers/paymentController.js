import Stripe from "stripe";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Environment-aware Price ID mapping
const STRIPE_PRICES =
  process.env.NODE_ENV === "production"
    ? {
        free: "price_1THBlGPPcImIkQHpnkTik0t8",
        juror: "price_1THgmLPPcImIkQHpAM5ShM2P",
        judge: "price_1THgnKPPcImIkQHpnjTRmea4",
        firm: "price_1THgnwPPcImIkQHpjcvyqDB2",
      }
    : {
        free: "price_1TTnPVAZa6QGV1FF5WBiRFDE",
        juror: "price_1TTnRyAZa6QGV1FFMDgq5nl0",
        judge: "price_1TTnTPAZa6QGV1FFPiqp160N",
        firm: "price_1TTnUbAZa6QGV1FFmYkvUsMy",
      };

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { priceId } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.CLIENT_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.CLIENT_URL}/subscribe?payment=cancelled`,
    customer_email: req.user.email,
    client_reference_id: req.user._id.toString(),
  });

  res.status(200).json({ success: true, url: session.url });
});

export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0].price.id;

    let tier = "free";

    // Dynamic verification against environment-specific IDs
    if (priceId === STRIPE_PRICES.juror) tier = "juror";
    if (priceId === STRIPE_PRICES.judge) tier = "judge";
    if (priceId === STRIPE_PRICES.firm) tier = "firm";

    await User.findByIdAndUpdate(userId, {
      isPremium: tier !== "free",
      subscriptionTier: tier,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
    });
  }

  res.json({ received: true });
});
