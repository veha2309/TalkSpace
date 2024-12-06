import prisma from "@/lib/prismadb";

export const getFriends = async (userId: string) => {
    try {
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    { userId1: userId },
                    { userId2: userId },
                ],
            },
            include: {
                user1: true,
                user2: true,
            },
        });

        // Extract the other user in the friendship
        const friends = friendships.map(friendship => 
            friendship.userId1 === userId ? friendship.user2 : friendship.user1
        );

        return friends;
    } catch (error) {
        console.error("GETTING_FRIENDS_ERROR:", error);
        throw error;
    }
};
