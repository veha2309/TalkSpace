import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationId: string) => {
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
                        user: true, // Fetch user data linked to participants
                    },
                },
                messages: {
                    orderBy: {
                        createdAt: "asc", // Optional: Ensure consistent message order
                    },
                },
            },
        });

        if (!conversation) return null;

        // Extract users from participants for easier handling in the frontend
        const users = conversation.participants.map((participant) => participant.user);

        return {
            ...conversation,
            users, // Attach the extracted users array
        };
    } catch (error) {
        console.error("Error in getConversationById:", error);
        return null;
    }
};

export default getConversationById;
