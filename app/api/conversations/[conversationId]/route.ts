import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/app/libs/pusher";

type Params = Promise<{ conversationId : string }>


export async function DELETE(
    request: Request,
     props : { params: Params },
) {
    try {
        const params = await props.params
        const  conversationId  = params.conversationId;
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID is required", { status: 400 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                participants: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!existingConversation) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        // Ensure the user is a participant in the conversation
        const isParticipant = existingConversation.participants.some(
            (participant) => participant.userId === currentUser.id
        );

        if (!isParticipant) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Soft delete: Add the user's ID to the `deletedBy` array
        const updatedConversation = await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                deletedBy: {
                    push: currentUser.id,
                },
            },
        });

        // Notify other participants about the removal
        existingConversation.participants.forEach((participant) => {
            if (participant.user.email) {
                pusherServer.trigger(
                    participant.user.email,
                    "conversation:remove",
                    updatedConversation
                );
            }
        });

        return NextResponse.json(updatedConversation);
    } catch (error: unknown) {
        console.error("ERROR_CONVERSATION_DELETE:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
