
// ローカル使用のみのためAI機能は無効化されています
export const suggestCategory = async (description: string): Promise<string> => {
  return "その他";
};

export const analyzeSpending = async (transactions: any[]): Promise<string> => {
  return "AI機能はオフになっています。";
};
