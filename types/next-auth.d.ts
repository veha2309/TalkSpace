import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the `id` field
    } & DefaultSession["user"]; // Merge with default user fields
  }

  interface User extends DefaultUser {
    id: string; // Add the `id` field
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Add the `id` field
  }
}
