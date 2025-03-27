import 'next-auth';
import { DefaultSession } from 'next-auth';

// We are overriding the type from the next auth package
// We can directy define the types by creating interfaces in our code but we have to override the types of the next auth package so we have to use this declare block
declare module 'next-auth' {
  interface User {
    _id?: string,
    fullName: {
      firstName?: string,
      lastName?: string
    },
    username?: string,
    email?: string,
    password?: string,
    balance?: {
      upi?: number,
      cash?: number,
      updatedAt?: Date
    },
    createdAt?: Date,
    updatedAt?: Date
  }
  
  interface Session {
    user: {
      _id?: string,
    fullName: {
      firstName?: string,
      lastName?: string
    },
    username?: string,
    email?: string,
    balance?: {
      upi?: number,
      cash?: number,
      updatedAt?: Date
    },
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string,
    fullName: {
      firstName?: string,
      lastName?: string
    },
    username?: string,
    email?: string,
    balance?: {
      upi?: number,
      cash?: number,
      updatedAt?: Date
    },
  }
}