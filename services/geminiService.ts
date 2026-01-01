
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

// Always use the process.env.API_KEY directly and use a named parameter for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// カテゴリーを推測する
export const suggestCategory = async (description: string): Promise<string> => {
  if (!description) return "その他";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `「${description}」という買い物の内容に最も適したカテゴリーを、以下のリストから一つだけ選んで返してください：食費, 日用品, 外食, 光熱費, 住居, 交通, 娯楽, その他`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    // The GenerateContentResponse object features a text property (not a method)
    const suggested = response.text?.trim() || "その他";
    return suggested;
  } catch (error) {
    console.error("Gemini suggestCategory error:", error);
    return "その他";
  }
};

/**
 * 家計の支出履歴を分析し、AIアドバイスを生成する
 */
export const analyzeSpending = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) return "データがありません。";

  const summary = transactions.slice(0, 20).map(t => 
    `- ${t.description}: ${t.amount}円 (${t.category})`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `以下の家計支出データに基づき、節約のコツや傾向を100文字程度で簡潔に日本語でアドバイスしてください。\n\n${summary}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    // Extract text directly from response property
    return response.text?.trim() || "分析結果を生成できませんでした。";
  } catch (error) {
    console.error("Gemini analyzeSpending error:", error);
    return "分析中にエラーが発生しました。時間を置いて再度お試しください。";
  }
};
