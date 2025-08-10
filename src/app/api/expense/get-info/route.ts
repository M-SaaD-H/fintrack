import { connectDB } from "@/lib/db";
import { Expense } from "@/models/expense.model";
import { User } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { errorHandler } from "@/utils/errorHandler";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = errorHandler(async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    throw new ApiError(401, 'Unauthorized request');
  }

  const userId = token._id;

  if(!userId) {
    throw new ApiError(401, 'Unauthorized request');
  }

  await connectDB();

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // All info about the user expenses

  const info = await Expense.aggregate([
    {
      $match: {
        userId: user._id,
        sem: user.activeSem
      }
    },
    {
      $group: {
        _id: '$paymentMethod',
        totalAmountSpent: { $sum: '$amount' },
        lastSpentDate: { $max: '$createdAt' },
      }
    },
    {
      $group: {
        _id: null, // groug all the documents together
        methods: {
          $push: {
            k: { $toLower: '$_id' },
            v: {
              totalAmountSpent: '$totalAmountSpent',
              lastSpentDate: '$lastSpentDate'
            }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        methods: {
          $arrayToObject: '$methods'
        }
      }
    }
  ]);

  return NextResponse.json(
    new ApiResponse(
      200,
      {
        currentInfo: {
          cash: {
            amount: user.balance.cash.amount,
            updatedAt: user.balance.cash.updatedAt,
          },
          upi: {
            amount: user.balance.upi.amount,
            updatedAt: user.balance.upi.updatedAt,
          },
        },
        spentInfo: info[0]?.methods
      },
      'Amount spent fetched successfully'
    )
  );
});