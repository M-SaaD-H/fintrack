import { connectDB } from '@/lib/db';
import { Expense } from '@/models/expense.model';
import { User } from '@/models/user.model';
import { ApiError } from '@/utils/apiError';
import { ApiResponse } from '@/utils/apiResponse';
import { errorHandler } from '@/utils/errorHandler';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const GET = errorHandler(async (req: NextRequest): Promise<NextResponse> => {
  const token = await getToken({ req });
  
  if (!token) {
    throw new ApiError(401, 'Unauthorized request');
  }

  const userId = token._id;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized request');
  }

  await connectDB();
  
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  const expenses = await Expense.find(
    { userId: user._id },
    {
      createdAt: 1,
      description: 1,
      amount: 1,
      category: 1,
      paymentMethod: 1,
    },
    {
      sort: {
        createdAt: -1,
      },
    }
  );

  return NextResponse.json(
    new ApiResponse(
      200,
      {
        expenses: expenses || [],
      },
      "Expenses fetched successfully"
    )
  )
})