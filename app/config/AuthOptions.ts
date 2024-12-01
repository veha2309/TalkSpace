import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        // Find the user in the database
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.hashedPassword) {
          throw new Error("Invalid email or password.");
        }

        // Verify the password
        const isValidPassword = await bcrypt.compare(credentials?.password, user.hashedPassword);
        if (!isValidPassword) {
          throw new Error("Invalid email or password.");
        }

        // Return user object if authentication is successful
        return user;
      },
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        // Add user info to JWT payload
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Ensure that user info is correctly passed to session
      if (token?.id) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },  
  },
  session: {
    strategy: "jwt", // Ensure you're using the correct strategy if sessions are stored in the database
  },
  secret: process.env.NEXTAUTH_SECRET,
};
