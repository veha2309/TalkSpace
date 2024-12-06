import prisma from "@/lib/prismadb";

const getMessages = async (conversationId: string) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId,
            },
            include: {
                sender: true, // Include sender details
                seen : true,
            },
            orderBy: {
                createdAt: "asc", // Ensure chronological order
            },
        });

        // Fetch users for `seenBy` for each message and resolve the PrismaPromise
        const messagesWithSeenBy = await Promise.all(
            messages.map(async (message) => {
                const seenUsers = await prisma.user.findMany({
                    where: {
                        id: {
                            in: message.seenIds,
                        },
                    },
                });

                // Return message with resolved `seenBy` as a list of user ids
                return {
                    ...message,
                    seenBy: seenUsers.map(user => user.id), // Only include user ids in `seenBy`
                };
            })
        );

        return messagesWithSeenBy;
    } catch (error) {
        console.error("Error in getMessages:", error);
        return [];
    }
};

export default getMessages;
