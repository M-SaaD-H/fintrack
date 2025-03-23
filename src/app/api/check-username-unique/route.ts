import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { usernameValidation } from "@/schemas/signup.schema";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { errorHandler } from "@/utils/errorHandler";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation
});

export const GET = errorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  const result = UsernameQuerySchema.safeParse({ username });

  if (!result.success) {
    const usernameErrors = result.error.format().username?._errors || [];

    throw new ApiError(400, 'Invalid username', usernameErrors);
  }

  // Now validate the username in the database
  await connectDB();

  const user = await User.findOne({ username });

  if(user) {
    throw new ApiError(400, 'Username already exists');
  }

  return NextResponse.json(
    new ApiResponse(200, {}, 'Username is unique'),
    { status: 200 }
  );
});
