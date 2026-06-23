import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, clientId, customerIdentifier } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({ reply: "[Mock Backend] Gemini API Key is missing. Check Vercel Environment Variables." });
    }

    // 1. Initialize Backend Supabase Client
    const supabaseAdmin = createClient(
      process.env.VITE_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
    );

    let extractedKnowledge = "Aura SaaS Default Info.";

    // 2. Fetch the client's uploaded files from Supabase Storage
    if (clientId && process.env.VITE_SUPABASE_URL) {
      try {
        const { data: files } = await supabaseAdmin.storage
          .from('knowledge_base')
          .list(clientId + '/', { limit: 1 });

        if (files && files.length > 0) {
          const fileName = files[0].name;
          // Download the file data
          const { data: fileBlob } = await supabaseAdmin.storage
            .from('knowledge_base')
            .download(`${clientId}/${fileName}`);
            
          if (fileBlob) {
            extractedKnowledge = await fileBlob.text();
            extractedKnowledge = extractedKnowledge.substring(0, 15000); 
          }
        }
      } catch (storageError) {
        console.warn("Storage fetch failed:", storageError.message);
      }
    }

    // 3. Generate AI Response
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are Aura, an AI sales and support agent for a business.
      Business Context extracted from their files:
      ---
      ${extractedKnowledge}
      ---
      Customer Message: ${message}
      
      Reply concisely, helpfully, and base your answer entirely on the Business Context provided above if applicable.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Save Chat Log to Database
    if (clientId && process.env.VITE_SUPABASE_URL) {
      try {
        await supabaseAdmin.from('chat_logs').insert([{
          business_id: clientId,
          customer_identifier: customerIdentifier || 'Anonymous User',
          platform: 'Website Widget',
          message_history: [
            { role: 'user', content: message },
            { role: 'bot', content: text }
          ]
        }]);
      } catch (dbError) {
        console.error("Failed to save chat log:", dbError.message);
      }
    }

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
}
