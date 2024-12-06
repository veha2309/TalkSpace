import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";
import { FullConversationType } from "@/app/types/index";

const getConversationById = async (conversationId: string): Promise<FullConversationType | null> => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.email) return null;

        // Fetch the conversation by ID
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                participants: {
                    include: {
                        user: true, // Include user details for each participant
                    },
                },
                messages: {
                    include: {
                        sender: true, // Include sender details
                        seen: true,  // Include users who have seen the message
                    },
                    orderBy: {
                        createdAt: "asc", // Ensure consistent message order
                    },
                },
            },
        });

        if (!conversation) return null;

        // Transform conversation to match the `FullConversationType`
        const formattedConversation: FullConversationType = {
            id: conversation.id,
            name: conversation.name,
            isGroup: conversation.isGroup,
            messages: conversation.messages.map((message) => ({
                ...message,
                seen: message.seen,
                sender: message.sender,
            })),
            participants: conversation.participants.map((participant) => participant.user),
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            deletedBy: conversation.deletedBy,
        };

        return formattedConversation;
    } catch (error) {
        console.error("Error in getConversationById:", error);
        return null;
    }
};

export default getConversationById;
