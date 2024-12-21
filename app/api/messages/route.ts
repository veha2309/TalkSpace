import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const currentUser = await getCurrentUser();
        const { message, conversationId } = body;

        if (!currentUser?.id || !currentUser.email) {
            return NextResponse.json({ message: "Unauthenticated request" }, { status: 400 });
        }

        if (!conversationId) {
            return NextResponse.json({ message: "Missing conversation ID" }, { status: 404 });
        }

        const newMessage = await prisma.message.create({
            data: {
                content: message,
                senderId: currentUser.id,
                conversationId,
            },
            include: {
                sender: true,
                seen: true,
            },
        });

        // Notify all participants in the conversation
        await pusherServer.trigger(conversationId, "messages:new", newMessage);

        const participants = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { participants: true },
        });

        participants?.participants
            .filter((user) => user.id !== currentUser.id)
            .forEach(async (user) => {
                await pusherServer.trigger(user.id, "conversation:updated", newMessage);
            });

        return NextResponse.json(newMessage);
    } catch (error) {
        console.error("MESSAGING_ERROR:", error);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}
