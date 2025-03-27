import { connectDB } from '@/lib/db';
import { User } from '@/models/user.model';
import { ApiError } from '@/utils/apiError';
import { NextAuthOptions, Session, User as NextAuthUser } from 'next-auth';
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
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in
      if (user) {
        token._id = user._id?.toString();
        token.fullName = user.fullName;
        token.username = user.username;
        token.email = user.email;
        return token;
      }

      // Subsequent calls
      try {
        const dbUser = await User.findById(token.sub).select('+balance');
        if (dbUser) {
          token._id = dbUser._id?.toString();
          token.fullName = dbUser.fullName;
          token.username = dbUser.username;
          token.email = dbUser.email;
        }
      } catch (error) {
        console.error("Error fetching user in jwt callback:", error);
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