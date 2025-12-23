import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const analyzeClaim = async (claimDescription: string): Promise<any> => {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY not found, returning mock data');
    return {
      summary: "Mock summary of the claim.",
      category: "MEDICAL",
      risk_score: 10,
      risk_reason: "No anomalies detected (Mock)."
    };
  }

  try {
    const prompt = `
      You are an expert insurance claims adjuster.
      Analyze the following claim description:
      "${claimDescription}"
      
      Output a JSON object with:
      - summary: (2 sentence summary)
      - category: (MEDICAL | DENTAL | VISION | OTHER)
      - risk_score: (0-100)
      - risk_reason: (Why is the risk high?)
    `;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const content = completion.data.choices[0].message?.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw error;
  }
};
