
export enum TransactionType {
  ME_PAID_FOR_FAMILY = 'ME_PAID_FOR_FAMILY', // 私が家族分を立て替えた（家族が私に借金）
  FAMILY_PAID_FOR_ME = 'FAMILY_PAID_FOR_ME'  // 家族口座から自分のお金を出した（私が家族に借金）
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
}

export interface SettlementSummary {
  totalMePaid: number;
  totalFamilyPaid: number;
  balance: number; // Positive means Family owes Me, Negative means I owe Family
}

export const CATEGORIES = [
  '食費', '日用品', '外食', '光熱費', '住居', '交通', '娯楽', 'その他'
];
