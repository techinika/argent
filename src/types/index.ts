export type UserRole = "business" | "personal" | "admin";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  photoURL?: string;
}

export type BusinessTransactionType =
  | "income"
  | "expense"
  | "saving"
  | "investment"
  | "credit"
  | "debit";

export interface BusinessBudget {
  id: string;
  userId: string;
  type: "monthly" | "oneTimeExpense" | "oneTimeIncome";
  amount: number;
  category: string;
  description: string;
  month?: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessTransaction {
  id: string;
  userId: string;
  type: BusinessTransactionType;
  amount: number;
  category: string;
  description: string;
  date: Date;
  budgetId?: string;
  documentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessBudgetSummary {
  totalBudgeted: number;
  totalSpent: number;
  remaining: number;
  percentageUsed: number;
  status: "on_track" | "over_budget" | "under_budget";
}

export type PersonalTransactionCategory =
  | "necessities"
  | "debts"
  | "needs"
  | "emergencies"
  | "income"
  | "other";

export interface PersonalGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  priority: "high" | "medium" | "low";
  completed: boolean;
  linkedSavingsId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstallmentPlan {
  id: string;
  userId: string;
  linkedType: "goal" | "savings";
  linkedId: string;
  amount: number;
  frequency: "monthly" | "weekly" | "biweekly";
  nextDueDate: Date;
  lastPaidDate?: Date;
  active: boolean;
  linkedSavingsId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalBudgetItem {
  id: string;
  userId: string;
  name: string;
  estimatedCost: number;
  category: PersonalTransactionCategory;
  isEssential: boolean;
  month: number;
  year: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalTransaction {
  id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: PersonalTransactionCategory;
  description: string;
  date: Date;
  archived: boolean;
  relatedMinorTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MinorTransaction {
  id: string;
  userId: string;
  parentTransactionId: string;
  parentType: "personal" | "business";
  amount: number;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
}

export interface Debt {
  id: string;
  userId: string;
  type: "owed_to" | "owed_by";
  personName: string;
  amount: number;
  description: string;
  dueDate?: Date;
  cleared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalSavings {
  id: string;
  userId: string;
  name: string;
  amount: number;
  targetAmount?: number;
  linkedGoalId?: string;
  purpose: "emergency" | "goal" | "planned_expense" | "investment" | "general";
  createdAt: Date;
  updatedAt: Date;
}

export interface CurrentAccount {
  id: string;
  userId: string;
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalBorrowed: number;
  lastUpdated: Date;
}

export interface PersonalFinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  projectedSavings: number;
  savingsRate: number;
  debtTotal: number;
  receivablesTotal: number;
  emergencyFundStatus: "adequate" | "insufficient" | "none";
}
