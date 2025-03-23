import { NextRequest, NextResponse } from "next/server";

export const errorHandler = (handler: (req: NextRequest) => Promise<NextResponse>) => {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: any) {;
      return NextResponse.json(
        {
          sucess: false,
          statusCode: error.statusCode,
          message: error.message,
          errors: error.errors,
          data: error.data
        },
        { status: 500 }
      );
    }
  };
};
