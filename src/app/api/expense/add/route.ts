import { connectDB } from '@/lib/db';
import { Expense } from '@/models/expense.model';
import { User } from '@/models/user.model';
import { ApiError } from '@/utils/apiError';
import { ApiResponse } from '@/utils/apiResponse';
import { errorHandler } from '@/utils/errorHandler';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const POST = errorHandler(async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if(!token) {
    throw new ApiError(401, 'Unauthorized request');
  }

  const userId = token._id;

  if(!userId) {
    throw new ApiError(401, 'Unauthorized request');
  }

  await connectDB();

  const user = await User.findById(userId);

  if(!user) {
    throw new ApiError(401, 'Unauthorized request');
  }

  const { amount, description, category, paymentMethod } = await req.json();

  if (!amount || !description || !category || !paymentMethod) {
    throw new ApiError(400, 'All fields are required');
  }

  if(description.length < 3) {
    throw new ApiError(400, 'Description must be at least 3 characters long');
  }

  if(amount <= 0) {
    throw new ApiError(400, 'Amount must be a positive number');
  }

  if(amount > user.balance[paymentMethod.toLowerCase()].amount) {
    throw new ApiError(400, 'Insufficient balance');
  }

  // Now create the expense
  const expense = await Expense.create({
    userId,
    amount,
    description,
    category,
    paymentMethod
  });

  if(!expense) {
    throw new ApiError(500, 'Failed to create expense');
  }

  // Update the user's balance
  if(paymentMethod === 'Cash') {
    user.balance.cash.amount -= amount;
  } else {
    user.balance.upi.amount -= amount;
  }

  await user.save();
  
  return NextResponse.json(
    new ApiResponse(201, expense, 'Expense added successfully'),
  )
});