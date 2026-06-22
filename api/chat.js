import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, clientId, knowledgeBaseContext } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({ reply: "[Mock Backend] Gemini API Key is missing. Check Vercel Environment Variables." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // In a full production setup, you would use `clientId` to fetch the specific knowledge base from Supabase here.
    const prompt = `
      You are Aura, an AI sales and support agent for a business.
      Business Context: ${knowledgeBaseContext || 'Aura SaaS Platform'}
      Customer Message: ${message}
      Reply concisely and helpfully.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
}
