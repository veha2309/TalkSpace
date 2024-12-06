import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

const getProfileById = async (userId: string) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.email) return null;

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) return null;

        // Extract users from participants for easier handling in the frontend

        const {hashedPassword, createdAt, emailVerified,updatedAt , ...ProtectedUser} = user

        return ProtectedUser
    } catch (error) {
        console.error("Error in getProfileById:", error);
        return null;
    }
};

export default getProfileById;
