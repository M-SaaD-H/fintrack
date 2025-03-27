import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  category: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema: Schema<IExpense> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be a positive number'],
    },
    description: {
      type: String,
      required: true,
      minlength: [3, 'Description must be at least 3 characters long'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Food', 'Transportation', 'Stationary', 'Entertainment', 'Shopping', 'Other'],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash', 'UPI'],
    }
  }, { timestamps: true }
);

export const Expense = mongoose.models.Expense || mongoose.model<IExpense>('Expense', expenseSchema);