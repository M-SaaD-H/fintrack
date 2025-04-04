import { connectDB } from '@/lib/db';
import { ApiError } from '@/utils/apiError';
import { ApiResponse } from '@/utils/apiResponse';
import { errorHandler } from '@/utils/errorHandler';
import { User } from '@/models/user.model'
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

  const { upi, cash } = await req.json();

  if(!upi && !cash) {
    throw new ApiError(400, 'At least one field must be provided to update the balance');
  }
  
  await connectDB();

  // Create update object with only the fields that are present
  const incrementFieldsFields: Record<string, number> = {};
  const setFields: Record<string, Date> = {};

  if (upi) {
    incrementFieldsFields['balance.upi.amount'] = upi;
    setFields['balance.upi.updatedAt'] = new Date();
  }
  
  if (cash) {
    incrementFieldsFields['balance.cash.amount'] = cash;
    setFields['balance.cash.updatedAt'] = new Date();
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $inc: incrementFieldsFields,
      $set: setFields,
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return NextResponse.json(
    new ApiResponse(200, { updatedBalance: user.balance }, 'Balance updated successfully')
  );
})
