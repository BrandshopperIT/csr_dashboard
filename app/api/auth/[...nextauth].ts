// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    jwt: async ({ token, account }: { token: any; account: any }) => {
      if (account?.id_token) {
        const [header, payload, sig] = account.id_token.split('.');
        const idToken = JSON.parse(
          Buffer.from(payload, 'base64').toString('utf8')
        );

        token.roles = [...idToken.roles];
      }

      return token;
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      session.roles = [...token.roles];

      return session;
    },
  },
};

export default NextAuth(authOptions);
