import { connectDB } from "@/lib/db";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { errorHandler } from "@/utils/errorHandler";
import { User } from "@/models/user.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = errorHandler(async (req: NextRequest): Promise<NextResponse> => {
  const token = await getToken({ req });
  
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const userId = token._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const { sem } = await req.json();

  if (!sem) {
    throw new ApiError(404, "New sem not found")
  }

  await connectDB();
  
  const user = await User.findByIdAndUpdate(
    userId,
    {
      activeSem: sem
    }
  );

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  return NextResponse.json(
    new ApiResponse(200, null, "Semester updated"),
    { status: 200 }
  )
});