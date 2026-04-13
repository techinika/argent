import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    displayName: z.string().min(2, "Name must be at least 2 characters"),
    role: z.enum(["business", "personal"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const businessBudgetSchema = z.object({
  type: z.enum(["monthly", "oneTimeExpense", "oneTimeIncome"]),
  amount: z.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  month: z.number().min(1).max(12).optional(),
  year: z.number().min(2020),
});

export const businessTransactionSchema = z.object({
  type: z.enum([
    "income",
    "expense",
    "saving",
    "investment",
    "credit",
    "debit",
  ]),
  amount: z.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  date: z.date(),
  budgetId: z.string().optional(),
});

export const personalGoalSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  targetAmount: z.number().positive("Target amount must be positive"),
  priority: z.enum(["high", "medium", "low"]),
  deadline: z.date().optional(),
});

export const personalBudgetItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  estimatedCost: z.number().positive("Cost must be positive"),
  category: z.enum([
    "necessities",
    "debts",
    "needs",
    "emergencies",
    "income",
    "other",
  ]),
  isEssential: z.boolean(),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
});

export const personalTransactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Amount must be positive"),
  category: z.enum([
    "necessities",
    "debts",
    "needs",
    "emergencies",
    "income",
    "other",
  ]),
  description: z.string().optional(),
  date: z.date(),
});

export const debtSchema = z.object({
  type: z.enum(["owed_to", "owed_by"]),
  personName: z.string().min(1, "Person name is required"),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  dueDate: z.date().optional(),
});

export const savingsSchema = z.object({
  name: z.string().min(1, "Savings name is required"),
  amount: z.number().positive("Amount must be positive"),
  targetAmount: z.number().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type BusinessBudgetInput = z.infer<typeof businessBudgetSchema>;
export type BusinessTransactionInput = z.infer<
  typeof businessTransactionSchema
>;
export type PersonalGoalInput = z.infer<typeof personalGoalSchema>;
export type PersonalBudgetItemInput = z.infer<typeof personalBudgetItemSchema>;
export type PersonalTransactionInput = z.infer<
  typeof personalTransactionSchema
>;
export type DebtInput = z.infer<typeof debtSchema>;
export type SavingsInput = z.infer<typeof savingsSchema>;
