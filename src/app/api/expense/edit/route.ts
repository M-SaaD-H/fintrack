import { connectDB } from '@/lib/db';
import { Expense } from '@/models/expense.model';
import { User } from '@/models/user.model';
import { ApiError } from '@/utils/apiError';
import { ApiResponse } from '@/utils/apiResponse';
import { errorHandler } from '@/utils/errorHandler';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = errorHandler(async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if(!token) {
    throw new ApiError(401, 'Unauthorized request');
  }

  const userId = token._id;

  if(!userId) {
    throw new ApiError(401, 'Unauthorized request');
  }

  const user = await User.findById(userId);

  if(!user) {
    throw new ApiError(401, 'Unauthorized request');
  }

  const { searchParams } = new URL(req.url);
  const expenseId = searchParams.get('expenseId');

  if(!expenseId) {
    throw new ApiError(400, 'Expense ID is required');
  }

  const { amount, description, category, paymentMethod } = await req.json();

  if (!amount && !description && !category && !paymentMethod) {
    throw new ApiError(400, 'At least one field must be provided to update the expense');
  }

  if (amount !== undefined && amount <= 0) {
    throw new ApiError(400, 'Amount must be a positive number');
  }

  if (description !== undefined && description.length < 3) {
    throw new ApiError(400, 'Description must be at least 3 characters long');
  }

  await connectDB();

  const expense = await Expense.findById(expenseId);

  if(!expense) {
    throw new ApiError(404, 'Expense not found');
  }

  if(userId.toString() !== expense.userId.toString()) {
    throw new ApiError(403, 'Only the owner can update the expense');
  }

  if (user.activeSem > expense.sems) {
    throw new ApiError(401, 'Past Sem expenses are not allowed to update');
  }

  const amountDifference = amount !== undefined ? amount - expense.amount : 0;
  
  const updates: Record<string, string | number> = {};

  if (amount !== undefined) {
    updates.amount = amount;
  }

  if (description !== undefined) {
    updates.description = description;
  }

  if (category !== undefined) {
    updates.category = category;
  }

  if (paymentMethod !== undefined) {
    updates.paymentMethod = paymentMethod;
  }

  await expense.updateOne(updates);

  // Update the user's balance
  if(expense.paymentMethod === 'Cash') {
    user.balance.cash.amount += amountDifference;
  } else {
    user.balance.upi.amount += amountDifference;
  }

  await user.save();
  
  return NextResponse.json(
    new ApiResponse(200, expense, 'Expense updated successfully')
  );
})