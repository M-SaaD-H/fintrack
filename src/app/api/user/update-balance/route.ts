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

  const user = await User.findById(userId);

  if(!user) {
    throw new ApiError(404, 'User not found');
  }

  if(upi) {
    user.balance.upi = upi;
  }

  if(cash) {
    user.balance.cash = cash;
  }

  await user.save();

  return NextResponse.json(
    new ApiResponse(200, {}, 'Balance updated successfully')
  );
})
