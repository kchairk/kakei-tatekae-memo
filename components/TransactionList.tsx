
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, onEdit }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center">
        <p className="text-slate-500 font-bold">記録はまだありません。</p>
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-black text-slate-900 flex items-center">
        <span className="w-2 h-6 bg-slate-800 rounded-full mr-2"></span>
        履歴
      </h2>
      <div className="overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200">
        <ul className="divide-y divide-slate-100">
          {sortedTransactions.map((t) => (
            <li key={t.id} className="p-4 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    t.type === TransactionType.ME_PAID_FOR_FAMILY 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {t.type === TransactionType.ME_PAID_FOR_FAMILY ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900">{t.description}</h5>
                    <div className="flex items-center space-x-2 text-xs text-slate-600 font-bold">
                      <span>{new Date(t.date).toLocaleDateString('ja-JP')}</span>
                      <span>•</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">{t.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right mr-2">
                    <p className={`font-black text-xl ${
                      t.type === TransactionType.ME_PAID_FOR_FAMILY ? 'text-blue-700' : 'text-emerald-700'
                    }`}>
                      {t.type === TransactionType.ME_PAID_FOR_FAMILY ? '+' : '-'}¥{t.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">
                      {t.type === TransactionType.ME_PAID_FOR_FAMILY ? '立替分' : '借用分'}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(t)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      title="修正"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      title="削除"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransactionList;
