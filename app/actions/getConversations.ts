import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";
import { FullConversationType } from "../types";
import { Prisma } from "@prisma/client";

const getConversations = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
        return []; // Return an empty array if no user is authenticated
    }

    // Fetch conversations where the user is a participant
    const conversations = await prisma.conversation.findMany({
        where: {
            participants: {
                some: { userId: currentUser.id }, // Check if the current user is a participant
            },
            NOT: {
                deletedBy: {
                    has: currentUser.id,
                },
            },
        },
        include: {
            participants: {
                include: {
                    user: true, // Include user details for each participant
                },
            },
            messages: {
                include: {
                    sender: true, // Include sender details for each message
                    seen: true,
                },
                orderBy: {
                    createdAt: "desc", // Order messages by creation time
                },
            },
        },
    });

    // Transform the data into the expected `FullConversationType`
    const formattedConversations: FullConversationType[] = conversations.map(
        (conversation: Prisma.ConversationGetPayload<{
            include: {
                participants: {
                    include: { user: true };
                };
                messages: {
                    include: { sender: true; seen: true };
                };
            };
        }>) => ({
            id: conversation.id,
            name: conversation.name,
            isGroup: conversation.isGroup,
            messages: conversation.messages,
            participants: conversation.participants.map(
                (participant) => participant.user
            ), // Map participants to User[]
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            deletedBy: conversation.deletedBy,
        })
    );

    return formattedConversations;
};

export default getConversations;
