import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["SAVINGS", "CURRENT"], "Account type is required"),
  balance: z.string().min(1, "Initial Balance is required"),
  isDefault: z.boolean().optional(),
});

export const transactionSchema = z
  .object({
    transactionType: z.enum(["INCOME", "EXPENSE"]),
    amount: z.string().min(1, "Amount is required"),
    description: z.string().optional(),
    date: z.date({ required_error: "Date is required" }),
    accountId: z.string().min(1, "Account is required"),
    category: z.string().min(1, "Category is required"),
    isRecurring: z.boolean().default(false),
    recurringInterval: z
      .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring && !data.recurringInterval) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recurring interval is required for recurring transactions",
        path: ["recurringInterval"],
      });
    }
  });