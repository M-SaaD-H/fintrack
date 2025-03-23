import { connectDB } from '@/lib/db';
import { User } from '@/models/user.model';
import { ApiError } from '@/utils/apiError';
import { ApiResponse } from '@/utils/apiResponse';
import { NextAuthOptions, Session, User as NextAuthUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: {
          label: 'Username or Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        }
      },

      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.identifier || !credentials?.password) {
          throw new ApiError(400, 'All fields are required');
        }

        await connectDB();

        try {
          const user = await User.findOne({
            $or: [
              { username: credentials.identifier },
              { email: credentials.identifier }
            ]
          });

          if (!user) {
            throw new ApiError(404, 'User not found');
          }

          const isPasswordValid = await user.comparePassword(credentials.password);
          
          if (!isPasswordValid) {
            throw new ApiError(400, 'Invalid credentials');
          }

          return user;
        } catch (error) {
          console.log('Error while authorizing user:', error);
          throw new ApiError(500, 'Error while authorizing user');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }){
      if(user) {
        token._id = user._id?.toString();
        token.fullName = user.fullName;
        token.username = user.username;
        token.email = user.email;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if(token) {
        session.user._id = token._id?.toString();
        session.user.fullName = token.fullName;
        session.user.username = token.username;
        session.user.email = token.email;
      }
      
      return session;
    }
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}