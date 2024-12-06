import prisma from "@/lib/prismadb";
import getSession from "@/app/actions/getSession";

const getUsers = async () => {
    const session = await getSession();

    if (!session?.user?.email) {
        return [];
    }

    try {
        // Fetch the current user
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!currentUser) return [];

        const currentUserId = currentUser.id;

        // Fetch friend IDs from the Friendship model
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    { userId1: currentUserId },
                    { userId2: currentUserId },
                ],
            },
            select: {
                userId1: true,
                userId2: true,
            },
        });

        // Extract friend IDs (the other user in each friendship)
        const friendIds = friendships.map((friendship) =>
            friendship.userId1 === currentUserId ? friendship.userId2 : friendship.userId1
        );

        // Fetch all users except the current user and their friends
        const users = await prisma.user.findMany({
            where: {
                id: {
                    notIn:
                        [
                            currentUserId,
                            ...friendIds
                        ]
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return users;
    } catch (error: unknown) {
        console.error("GETTING_USERS_ERROR:", error);
        return [];
    }
};

export default getUsers;
