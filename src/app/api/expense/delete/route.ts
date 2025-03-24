import { connectDB } from '@/lib/db';
import { Expense } from '@/models/expense.model';
import { User } from '@/models/user.model';
import { ApiError } from '@/utils/apiError';
import { ApiResponse } from '@/utils/apiResponse';
import { errorHandler } from '@/utils/errorHandler';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = errorHandler(async (req: NextRequest) => {
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

  await connectDB();

  const expense = await Expense.findById(expenseId);

  if(!expense) {
    throw new ApiError(404, 'Expense not found');
  }
  
  if(userId.toString() !== expense.userId.toString()) {
    throw new ApiError(403, 'Only the owner can delete the expense');
  }

  await expense.deleteOne();

  // Update the user's balance
  if(expense.paymentMethod === 'Cash') {
    user.balance.cash += expense.amount;
  } else {
    user.balance.upi += expense.amount;
  }

  return NextResponse.json(
    new ApiResponse(200, {}, 'Expense deleted successfully')
  );
})