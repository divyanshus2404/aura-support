require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
// For Stripe webhook, we need raw body
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// --- 1. LLM (Google Gemini) Endpoint ---
app.post('/api/chat', async (req, res) => {
  try {
    const { message, knowledgeBaseContext } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      // Mock fallback if no key is provided
      return res.json({ reply: "[Mock Backend] Gemini API Key is missing. I'm running in offline mode." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are Aura, an AI sales and support agent for a business.
      Business Context: ${knowledgeBaseContext || 'Aura SaaS Platform'}
      Customer Message: ${message}
      Reply concisely and helpfully.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

// --- 2. Stripe Checkout Session ---
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { planId, successUrl, cancelUrl, userId } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.json({ url: "https://demo.stripe.com/test-checkout-session" }); // mock
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: planId, // In production, this should map to actual Stripe Price ID like price_1Hh1...
          quantity: 1,
        },
      ],
      mode: 'subscription',
      client_reference_id: userId, // Store the Supabase User ID to catch in webhook
      success_url: successUrl || 'http://localhost:5173/dashboard?success=true',
      cancel_url: cancelUrl || 'http://localhost:5173/#pricing',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- 3. Stripe Webhook ---
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = JSON.parse(req.body); // Fallback for local testing without signature
    }
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.client_reference_id;
      
      console.log('✅ Subscription successful for user:', userId);
      
      // Here you would use the @supabase/supabase-js library to update the user's tier
      // e.g. await supabase.from('business_profiles').update({ subscription_tier: 'pro' }).eq('id', userId);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
});

// --- 4. WhatsApp Webhook (Meta Graph API) ---
// Verification Endpoint (GET)
app.get('/api/whatsapp', (req, res) => {
  const verify_token = process.env.WHATSAPP_VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("✅ WhatsApp Webhook Verified!");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Message Receiver Endpoint (POST)
app.post('/api/whatsapp', async (req, res) => {
  try {
    const body = req.body;
    
    if (body.object) {
      if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
        const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body.entry[0].changes[0].value.messages[0].from; 
        const msg_body = body.entry[0].changes[0].value.messages[0].text.body;

        console.log(`Received WhatsApp message from ${from}: ${msg_body}`);

        // TODO: Send msg_body to Gemini LLM here
        // TODO: Send response back to user via Meta Graph API using process.env.WHATSAPP_API_TOKEN

      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`🚀 Aura Backend Server running on port ${port}`);
});
