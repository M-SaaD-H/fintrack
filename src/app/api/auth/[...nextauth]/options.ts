import { connectDB } from '@/lib/db';
import { User } from '@/models/user.model';
import { ApiError } from '@/utils/apiError';
import { NextAuthOptions, Session, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
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
        const dbUser = await User.findById(token._id);
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
    },

    async signIn({ user, account}) {
      if(account?.provider !== 'google') return true;

      try {
        await connectDB();
      
        const existingUser = await User.findOne({ email: user.email });

        if(existingUser) {
          user._id = existingUser._id.toString();
          user.fullName = existingUser.fullName;
          user.username = existingUser.username;
          
          return true;
        }

        const username = user.name?.toLowerCase().replace(/\s+/g, "_");

        const newUser = await User.create({
          fullName: {
            firstName: user.name?.split(' ')[0] as string,
            lastName: user.name?.split(' ')[1] as string,
          },
          username,
          email: user.email,
        });

        user._id = newUser._id.toString();
        user.fullName = newUser.fullName;
        user.username = newUser.username;
      } catch (error) {
        console.log('Error while signing in:', error);
        throw error;
      }

      return true;
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