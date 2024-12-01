import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

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
                },
                orderBy: {
                    createdAt: "desc", // Order messages by creation time
                },
            },
        },
    });

    // Transform the data into the expected `FullConversationType`
    const formattedConversations = conversations.map((conversation) => ({
        ...conversation,
        users: conversation.participants.map((participant) => participant.user), // Extract users from participants
    }));

    return formattedConversations;
};

export default getConversations;
