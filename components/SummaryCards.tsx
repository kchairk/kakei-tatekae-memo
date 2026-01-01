
import React from 'react';
import { SettlementSummary } from '../types';

interface SummaryCardsProps {
  summary: SettlementSummary;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const isFamilyOwesMe = summary.balance >= 0;
  const absBalance = Math.abs(summary.balance);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* メインの精算バランス */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${isFamilyOwesMe ? 'border-blue-500' : 'border-emerald-500'} flex flex-col justify-between min-h-[140px]`}>
        <div>
          <p className="text-slate-600 text-sm font-bold mb-1">現在の精算バランス</p>
          <h3 className={`text-4xl font-black tracking-tight ${isFamilyOwesMe ? 'text-blue-700' : 'text-emerald-700'}`}>
            ¥{absBalance.toLocaleString()}
          </h3>
        </div>
        <p className={`text-xs font-bold mt-2 px-3 py-1 rounded-full w-fit ${isFamilyOwesMe ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {isFamilyOwesMe ? '家族から受け取る予定' : '家族へ支払う予定'}
        </p>
      </div>

      {/* 私の立て替え合計 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <p className="text-slate-700 text-sm font-bold">私の立て替え合計</p>
          <div className="bg-blue-50 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h4 className="text-2xl font-black text-slate-900">¥{summary.totalMePaid.toLocaleString()}</h4>
      </div>

      {/* 家族金の私用合計 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <p className="text-slate-700 text-sm font-bold">家族金の私用合計</p>
          <div className="bg-emerald-50 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-3.707-7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7a1 1 0 10-2 0v3.586L7.293 10.707z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h4 className="text-2xl font-black text-slate-900">¥{summary.totalFamilyPaid.toLocaleString()}</h4>
      </div>
    </div>
  );
};

export default SummaryCards;
