import NextAuth from "next-auth"
import Auth0 from "next-auth/providers/auth0"
import type { NextAuthConfig } from "next-auth"

export const config: NextAuthConfig = {
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER_BASE_URL!,
      authorization: {
        params: {
          scope: "openid email profile"
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from Auth0
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string
      }
      if (token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile?.sub) {
        token.sub = profile.sub
      }
      return token
    },
    async authorized({ request, auth }) {
      // Handle route protection logic
      const { pathname } = request.nextUrl
      
      // Allow access to public routes
      if (pathname === "/" || pathname === "/login") {
        return true
      }
      
      // Require authentication for dashboard and other protected routes
      if (pathname.startsWith("/dashboard")) {
        return !!auth?.user
      }
      
      return true
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)