import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { errorHandler } from "@/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

// Add OTP verification
export const POST = errorHandler(async (req: NextRequest) => {
  await connectDB();

  const { fullName, username, email, password } = await req.json();
  const { firstName, lastName } = fullName;

  if (
    [firstName, lastName, username, email, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  if (!email.includes("@")) {
    throw new ApiError(400, "Invalid email");
  }

  if(password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  const existingUser = await User.findOne({
    $or: [
      { username },
      { email }
    ]
  });

  if (existingUser) {
    throw new ApiError(400, 'User already exists');
  }

  // Create user
  const user = await User.create({
    fullName,
    username,
    email,
    password
  });

  if (!user) {
    throw new ApiError(500, 'Error while creating user');
  }

  return NextResponse.json(
    new ApiResponse(200, user, 'User created successfully'),
    { status: 200 }
  );
});