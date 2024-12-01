import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
    conversationId?: string;
}

export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const currentUser = await getCurrentUser();
        const { conversationId } = await params;

        if (!currentUser?.email || !currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID is required", { status: 400 });
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: true, // Fetch all messages in the conversation
                participants: true, // Include participants in the conversation
            },
        });

        if (!conversation) {
            return new NextResponse("Conversation not found", { status: 404 });
        }

        const lastMessage = conversation.messages[conversation.messages.length - 1];

        if (!lastMessage) {
            // No messages in the conversation
            return NextResponse.json(conversation);
        }

        // Check if the message has already been seen by the current user
        if (lastMessage.seenBy && lastMessage.seenBy.includes(currentUser.id)) {
            return NextResponse.json(conversation); // Avoid duplicate updates
        }

        // Update the message to mark it as seen
        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id,
            },
            data: {
                seenBy: {
                    push: currentUser.id, // Add current user to the seenBy array
                },
            },
            include: {
                sender: true, // Include sender details
            },
        });

        // Notify the current user about the updated conversation
        await pusherServer.trigger(currentUser.email, "conversation:update", {
            id: conversationId,
            messages: [updatedMessage],
        });

        // Notify other participants in the conversation about the message update
        await pusherServer.trigger(conversationId, "message:update", updatedMessage);

        return NextResponse.json(updatedMessage);
    } catch (error: unknown) {
        console.error("ERROR_MESSAGES_SEEN:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
