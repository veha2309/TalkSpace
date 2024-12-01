import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();

        const { userId, isGroup, members, name } = body;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Validate group conversation data
        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse("Invalid data", { status: 400 });
        }

        // Handle group conversation creation
        if (isGroup) {
            // Create a new group conversation
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    participants: {
                        create: [
                            ...members.map((member: { value: string }) => ({
                                user: { connect: { id: member.value } },
                            })),
                            {
                                user: { connect: { id: currentUser.id } },
                            },
                        ],
                    },
                },
                include: {
                    participants: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            // Notify all participants of the new conversation
            newConversation.participants.forEach((participant) => {
                if (participant.user.email) {
                    pusherServer.trigger(
                        participant.user.email,
                        "conversation:new",
                        newConversation
                    );
                }
            });

            return NextResponse.json(newConversation);
        }

        // Handle one-on-one conversation creation
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                isGroup: false,
                participants: {
                    every: {
                        OR: [
                            { userId: currentUser.id },
                            { userId: userId },
                        ],
                    },
                },
            },
        });

        if (existingConversation) {
            return NextResponse.json(existingConversation);
        }

        const newConversation = await prisma.conversation.create({
            data: {
                isGroup: false,
                participants: {
                    create: [
                        { user: { connect: { id: currentUser.id } } },
                        { user: { connect: { id: userId } } },
                    ],
                },
            },
            include: {
                participants: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        // Notify participants
        newConversation.participants.forEach((participant) => {
            if (participant.user.email) {
                pusherServer.trigger(
                    participant.user.email,
                    "conversation:new",
                    newConversation
                );
            }
        });

        return NextResponse.json(newConversation);
    } catch (error: unknown) {
        console.error("CONVERSATION_CREATION_ERROR:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
