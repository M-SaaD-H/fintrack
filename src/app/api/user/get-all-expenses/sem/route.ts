import { connectDB } from "@/lib/db";
import { Expense } from "@/models/expense.model";
import { User } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse<ApiResponse>> => {
  try {
    const token = await getToken({ req });

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const userId = token._id;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const { searchParams } = new URL(req.url);
    const sem = searchParams.get('sem') || 0;

    console.log("sem:", sem)

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    if (sem > user.activeSem) {
      throw new ApiError(400, "Requested sem is invalid");
    }

    const expenses = await Expense.find(
      {
        userId: user._id,
        sem: sem
      },
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
      new ApiResponse(200, { expenses }, "Expenses fetched successfully"),
      { status: 200 }
    )
  } catch (error) {
    console.log('E:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        new ApiResponse(
          error.statusCode,
          {
            errors: error.errors || [],
            data: error.data || null
          },
          error.message
        ),
        { status: error.statusCode }
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      new ApiResponse(
        500,
        {
          errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
          data: null
        },
        error instanceof Error ? error.message : 'Internal Server Error'
      ),
      { status: 500 }
    );
  }
}