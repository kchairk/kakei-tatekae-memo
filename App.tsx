
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, SettlementSummary, TransactionType } from './types';
import TransactionForm from './components/TransactionForm';
import SummaryCards from './components/SummaryCards';
import TransactionList from './components/TransactionList';
import { suggestCategory } from './services/geminiService';

type ViewMode = 'input' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('input');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('family_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // データの再読み込み（同期の擬似的な挙動）
  const handleRefresh = () => {
    setIsRefreshing(true);
    // localStorageから最新の状態を読み直す（他タブでの更新や擬似同期を想定）
    const saved = localStorage.getItem('family_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
    
    // URLパラメータのチェックも再度行う
    processUrlParams();

    // アニメーション用
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const processUrlParams = async () => {
    const params = new URLSearchParams(window.location.search);
    const amount = params.get('a');
    const desc = params.get('d');
    const type = params.get('t');

    if (amount && !isNaN(Number(amount))) {
      const txType = type === 'family' 
        ? TransactionType.FAMILY_PAID_FOR_ME 
        : TransactionType.ME_PAID_FOR_FAMILY;
      
      const description = desc || 'ショートカット入力';
      const category = await suggestCategory(description);

      const newTx: Transaction = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        amount: Number(amount),
        description,
        category,
        type: txType
      };

      setTransactions(prev => {
        const updated = [newTx, ...prev];
        localStorage.setItem('family_transactions', JSON.stringify(updated));
        return updated;
      });
      
      window.history.replaceState({}, document.title, window.location.pathname);
      setView('dashboard');
    }
  };

  useEffect(() => {
    processUrlParams();
  }, []);

  useEffect(() => {
    localStorage.setItem('family_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const summary = useMemo<SettlementSummary>(() => {
    const totalMePaid = transactions
      .filter(t => t.type === TransactionType.ME_PAID_FOR_FAMILY)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalFamilyPaid = transactions
      .filter(t => t.type === TransactionType.FAMILY_PAID_FOR_ME)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalMePaid,
      totalFamilyPaid,
      balance: totalMePaid - totalFamilyPaid
    };
  }, [transactions]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const handleUpdateTransaction = (updatedTx: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
    setEditingTransaction(null);
    setView('dashboard');
  };

  const handleEditRequest = (tx: Transaction) => {
    setEditingTransaction(tx);
    setView('input');
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('この記録を削除しますか？')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const clearHistory = () => {
    if (window.confirm('すべての履歴を削除し、精算をリセットしますか？')) {
      setTransactions([]);
    }
  };

  return (
    <div className="min-h-screen pb-32 max-w-2xl mx-auto px-4 pt-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-[900] text-slate-900 tracking-tight flex items-center">
            家計の立替メモ
            {view === 'dashboard' && (
              <button 
                onClick={handleRefresh}
                className={`ml-3 p-1.5 text-slate-400 hover:text-blue-600 transition-all ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}
                title="同期・更新"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            {view === 'input' 
              ? (editingTransaction ? '記録を修正中' : '今の買い物を記録') 
              : '立替状況の確認'}
          </p>
        </div>
        {view === 'dashboard' && (
          <button 
            onClick={clearHistory}
            className="bg-white p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 shadow-sm transition-colors"
            title="リセット"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </header>

      {/* Main Content Areas */}
      <main className="transition-all duration-300">
        {view === 'input' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <TransactionForm 
              onAdd={handleAddTransaction} 
              onUpdate={handleUpdateTransaction}
              editingTransaction={editingTransaction}
              onCancel={() => {
                setEditingTransaction(null);
                setView('dashboard');
              }}
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
            <SummaryCards summary={summary} />
            
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
              <h3 className="text-lg font-black mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                爆速入力の設定
              </h3>
              <p className="text-slate-400 text-xs font-bold leading-relaxed mb-4">
                iPhoneの「ショートカット」アプリでURLを開くアクションを作り、以下の形式に設定すると一瞬で保存できます：
              </p>
              <code className="block bg-slate-800 p-3 rounded-xl text-[10px] text-blue-300 font-mono break-all mb-4">
                {window.location.origin}/?a=金額&d=内容&t=me
              </code>
              <ul className="text-[10px] text-slate-300 space-y-1 font-bold">
                <li>• a=金額, d=内容, t=種別(me/family)</li>
                <li>• 背面タップやウィジェットに配置がおすすめ</li>
              </ul>
            </div>

            <TransactionList 
              transactions={transactions} 
              onDelete={handleDeleteTransaction}
              onEdit={handleEditRequest}
            />
          </div>
        )}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-2xl z-50 flex items-center justify-between">
        <button
          onClick={() => {
            setEditingTransaction(null);
            setView('input');
          }}
          className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${
            view === 'input' && !editingTransaction ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">入力する</span>
        </button>

        <div className="w-px h-8 bg-slate-800 mx-2"></div>

        <button
          onClick={() => setView('dashboard')}
          className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${
            view === 'dashboard' || editingTransaction ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {summary.balance !== 0 && (
              <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${summary.balance > 0 ? 'bg-blue-400' : 'bg-emerald-400'}`}></span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">確認する</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
