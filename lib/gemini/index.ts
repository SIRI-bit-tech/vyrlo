import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL, GEMINI_MAX_TOKENS } from "@/constants";
import { GeminiParseError, ReportDataPayload, EvalDataPayload } from "@/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function callGeminiJSON(prompt: string, creatorContext?: string) {
  const systemInstruction = creatorContext 
    ? `${creatorContext}\n\nYou are an expert creator growth strategist.`
    : "You are an expert creator growth strategist.";

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      maxOutputTokens: GEMINI_MAX_TOKENS,
      responseMimeType: "application/json",
    }
  });

  const text = response.text;
  if (!text) throw new GeminiParseError("Empty response from Gemini");
  
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new GeminiParseError("Failed to parse JSON response from Gemini");
  }
}

export async function generateContentIdeas(data: Record<string, unknown>, creatorContext?: string) {
  const prompt = `
Analyze this creator's recent performance data and generate 10 content ideas that build on what's working.
Data: ${JSON.stringify(data)}

Format response as JSON array of objects:
[{
  "title": "String",
  "description": "String",
  "format": "String (e.g. Carousel, Short-form Video)",
  "hook": "String (The opening line/angle)",
  "estimatedEngagement": "String (e.g. High, Medium)",
  "basedOnPostIds": ["String array of post IDs these ideas are derived from"]
}]
`;
  return callGeminiJSON(prompt, creatorContext);
}

export async function generateReportSummary(data: ReportDataPayload, creatorContext?: string) {
  const prompt = `
Write a structured performance report based on this data. Write like a professional growth strategist.
Data: ${JSON.stringify(data)}

Format response as JSON object:
{
  "overview": "String summary of overall performance",
  "platformBreakdowns": [{"platform": "String", "summary": "String"}],
  "topContent": [{"postId": "String", "whyItWorked": "String"}],
  "growthInsights": ["String", "String"],
  "recommendations": ["String", "String"]
}
`;
  return callGeminiJSON(prompt, creatorContext);
}

export async function generateTrendInsights(data: Record<string, unknown>[], creatorContext?: string) {
  const prompt = `
Analyze these top-performing competitor/trend posts in the creator's niche and generate trend insights.
Data: ${JSON.stringify(data)}

Format response as JSON array of objects:
[{
  "title": "String",
  "description": "String",
  "whyItWorks": "String",
  "contentAngle": "String (Suggested hook/angle for this creator)"
}]
`;
  return callGeminiJSON(prompt, creatorContext);
}

export async function evaluateContentIdea(data: EvalDataPayload, creatorContext?: string) {
  const prompt = `
Evaluate this content idea based on the creator's actual performance data and format fit.
Idea: ${JSON.stringify(data.contentIdea)}
Platform: ${data.platform}
Historical Data: ${JSON.stringify(data.historicalData)}

Score based on relevance, hook specificity, and format fit (0.0 to 1.0).

Format response as JSON object:
{
  "score": Number,
  "feedback": "String (Why it got this score)",
  "improvedSuggestion": "String (An improved version of the idea)"
}
`;
  return callGeminiJSON(prompt, creatorContext);
}
