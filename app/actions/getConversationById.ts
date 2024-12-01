import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (
    conversationId: string
) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.email) return null;

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                participants: {
                    include: {
                        user: true,  // Include the user data
                    },
                },
                messages: true,  // Optional: You can include messages if needed
            },
        });

        if (!conversation) return null;

        // Now, map participants to extract user data
        const users = conversation.participants.map(participant => participant.user);

        return {
            ...conversation,
            users,  // Attach the users array to the conversation
        };
    } catch (error: unknown) {
        console.error(error);  // Optional: Log the error for debugging
        return null;
    }
};

export default getConversationById;
