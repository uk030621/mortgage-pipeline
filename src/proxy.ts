import { withAuth } from "next-auth/middleware";

// Wrap NextAuth middleware so proxy.ts recognizes it
export default withAuth(
  function proxy(req) {
    // Optional: add custom logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)"],
};
