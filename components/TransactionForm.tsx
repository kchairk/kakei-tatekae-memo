
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, CATEGORIES } from '../types';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdate: (transaction: Transaction) => void;
  editingTransaction: Transaction | null;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  onAdd, 
  onUpdate, 
  editingTransaction, 
  onCancel 
}) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[CATEGORIES.length - 1]);
  const [type, setType] = useState<TransactionType>(TransactionType.ME_PAID_FOR_FAMILY);
  const [showSuccess, setShowSuccess] = useState(false);

  // 編集モードの場合の初期値設定
  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount.toString());
      setDescription(editingTransaction.description);
      setCategory(editingTransaction.category);
      setType(editingTransaction.type);
    } else {
      setAmount('');
      setDescription('');
      setCategory(CATEGORIES[CATEGORIES.length - 1]);
      setType(TransactionType.ME_PAID_FOR_FAMILY);
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    if (editingTransaction) {
      onUpdate({
        ...editingTransaction,
        amount: Number(amount),
        description: description || '無題',
        category: category,
        type
      });
    } else {
      onAdd({
        date: new Date().toISOString(),
        amount: Number(amount),
        description: description || '無題',
        category: category,
        type
      });
      // 成功フィードバック
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      // リセット
      setAmount('');
      setDescription('');
      setCategory(CATEGORIES[CATEGORIES.length - 1]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* タイプ選択 */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setType(TransactionType.ME_PAID_FOR_FAMILY)}
              className={`flex-1 py-4 text-sm font-black rounded-xl transition-all ${
                type === TransactionType.ME_PAID_FOR_FAMILY
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-600'
              }`}
            >
              私が立て替え
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.FAMILY_PAID_FOR_ME)}
              className={`flex-1 py-4 text-sm font-black rounded-xl transition-all ${
                type === TransactionType.FAMILY_PAID_FOR_ME
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-600'
              }`}
            >
              家族金で私用
            </button>
          </div>

          {/* 金額入力 */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 text-center">
              金額
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 text-3xl font-black">¥</span>
              <input
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-12 pr-4 py-8 bg-slate-50 border-b-4 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-5xl font-black text-slate-900 placeholder-slate-200 text-center"
                required
              />
            </div>
          </div>

          {/* 内容入力 */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
              内容
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="何を買いましたか？"
              className="w-full px-5 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-900 text-xl"
            />
          </div>

          {/* カテゴリー選択 */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
              カテゴリー
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 text-[10px] font-black rounded-lg border-2 transition-all ${
                    category === cat
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ボタンエリア */}
          <div className="flex flex-col space-y-3 pt-2">
            <button
              type="submit"
              disabled={showSuccess}
              className={`w-full font-black py-6 px-4 rounded-2xl transition-all shadow-xl flex items-center justify-center space-x-3 text-xl ${
                showSuccess 
                  ? 'bg-emerald-500 text-white translate-y-1 shadow-inner' 
                  : (editingTransaction ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-black text-white')
              } hover:-translate-y-1 active:translate-y-0`}
            >
              {showSuccess ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>記録しました！</span>
                </>
              ) : (
                <>
                  <span>{editingTransaction ? '記録を更新する' : '記録を保存する'}</span>
                  {!editingTransaction && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  )}
                </>
              )}
            </button>

            {editingTransaction && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full font-black py-4 px-4 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all text-sm uppercase tracking-widest"
              >
                キャンセル
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
