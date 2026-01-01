
import React, { useState, useEffect } from 'react';
import { analyzeSpending } from '../services/geminiService';
import { Transaction } from '../types';

interface InsightsProps {
  transactions: Transaction[];
}

const Insights: React.FC<InsightsProps> = ({ transactions }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    if (transactions.length < 3) {
      setInsight('データが少ないため、もう少し記録が貯まると詳しい分析ができます。');
      return;
    }
    setLoading(true);
    const result = await analyzeSpending(transactions);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsight();
  }, [transactions.length]);

  return (
    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 mb-8 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-black text-amber-900 flex items-center space-x-2">
          <span>✨ AI 家計アドバイス</span>
        </h3>
        <button 
          onClick={fetchInsight}
          disabled={loading}
          className="text-xs font-bold bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
        >
          {loading ? '分析中...' : '再分析'}
        </button>
      </div>
      
      <div className="relative z-10 min-h-[50px]">
        {loading ? (
          <div className="flex space-x-2 items-center text-amber-700/50 animate-pulse">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span className="text-sm font-bold ml-2">Geminiが分析中...</span>
          </div>
        ) : (
          <p className="text-amber-900 font-medium leading-relaxed">
            {insight || "分析の準備が整いました。"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Insights;
