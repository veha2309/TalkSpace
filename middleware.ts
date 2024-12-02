import { withAuth } from 'next-auth/middleware'

export default withAuth({
    pages:{
        signIn: "/"
    }
});

export const config = {
    matcher: [
        "/home",
        "/home/:path*",
        "/conversations/:path*"
    ]
};