// @ts-nocheck
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
      roles: string;
    };
    roles: string;
  }
  interface User {
    name: string;
    email: string;
    roles: string;
  }
  interface CustomUser extends User {
    roles: string;
  }
}
