import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "./apiResponse";
import { ApiError } from "./apiError";

export const errorHandler = (handler: (req: NextRequest) => Promise<NextResponse>) => {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.log('E:', error);

      if(error instanceof ApiError) {
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
  };
};
