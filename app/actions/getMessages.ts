import prisma from "@/lib/prismadb";

const getMessages = async (conversationId: string) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId,
            },
            include: {
                sender: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        // Fetch user data for `seenBy` user IDs
        const messagesWithSeenBy = await Promise.all(
            messages.map(async (message) => {
                const seenUsers = await prisma.user.findMany({
                    where: {
                        id: {
                            in: message.seenBy,
                        },
                    },
                });

                return {
                    ...message,
                    seen: seenUsers, // Add the full User objects for seenBy
                };
            })
        );

        return messagesWithSeenBy;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export default getMessages;
