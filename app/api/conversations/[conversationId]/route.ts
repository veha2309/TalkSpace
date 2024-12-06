import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/app/libs/pusher";

type Params = Promise<{ conversationId: string }>;

export async function DELETE(
    request: Request,
    props: { params: Params }
) {
    try {
        const params = await props.params;
        const conversationId = params.conversationId;
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID is required", { status: 400 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                participants: {
                    include: { user: true },
                },
            },
        });

        if (!existingConversation) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const isParticipant = existingConversation.participants.some(
            (participant) => participant.user.id === currentUser.id
        );

        if (!isParticipant) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const updatedConversation = await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                deletedBy: {
                    push: currentUser.id,
                },
            },
            include: {
                participants: {
                    include: { user: true },
                },
            },
        });

        const allDeleted = updatedConversation.participants.every((participant) =>
            updatedConversation.deletedBy.includes(participant.user.id)
        );


        if (!allDeleted) {
            // Notify only the user who deleted the conversation
            try {
                pusherServer.trigger(currentUser.email, "conversation:remove", updatedConversation);
            } catch (error) {
                console.error("Error notifying user about removal:", error);
            }
        
            return NextResponse.json(updatedConversation);
        }
        
        if (allDeleted) {
            await prisma.conversation.delete({
                where: { id: conversationId },
            });

            existingConversation.participants.forEach((participant) => {
                try {
                    pusherServer.trigger(participant.user.email, "conversation:remove", { conversationId });
                } catch (error) {
                    console.error("Error notifying participant:", error);
                }
            });

            return new NextResponse("Conversation permanently deleted", { status: 200 });
        }

        existingConversation.participants.forEach((participant) => {
            try {
                pusherServer.trigger(participant.user.email, "conversation:remove", updatedConversation);
            } catch (error) {
                console.error("Error notifying participant:", error);
            }
        });

        return NextResponse.json(updatedConversation);
    } catch (error: unknown) {
        console.error("ERROR_CONVERSATION_DELETE:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
