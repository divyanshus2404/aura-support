import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { planId, successUrl, cancelUrl, userId } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(200).json({ url: "https://demo.stripe.com/test-checkout-session" }); // mock
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: planId, // This must be an actual Stripe Price ID (e.g., price_1Hh1...) in production
          quantity: 1,
        },
      ],
      mode: 'subscription',
      client_reference_id: userId,
      success_url: successUrl || 'https://ai-support-saas-six.vercel.app/dashboard?success=true',
      cancel_url: cancelUrl || 'https://ai-support-saas-six.vercel.app/#pricing',
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
}
