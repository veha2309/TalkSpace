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
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Validate group conversation data
        if (isGroup && (!members || members.length < 2 || !name)) {
            return NextResponse.json(
                { message: "Invalid data" },
                { status: 400 }
            );
        }

        // Handle group conversation creation
        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    deletedBy  : [],
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

        // Ensure users are friends before creating a one-on-one conversation
        const areFriends = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { userId1: currentUser.id, userId2: userId },
                    { userId1: userId, userId2: currentUser.id },
                ],
            },
        });

        if (!areFriends) {
            return NextResponse.json(
                { message: "Users are not friends" },
                { status: 403 }
            );
        }

        // Check for an existing one-on-one conversation
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
            include: {
                participants: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (existingConversation) {
            // Restore the conversation if it was deleted by the current user
            if (existingConversation.deletedBy.includes(currentUser.id)) {
                await prisma.conversation.update({
                    where: { id: existingConversation.id },
                    data: {
                        deletedBy: {
                            set: existingConversation.deletedBy.filter(
                                (id) => id !== currentUser.id
                            ),
                        },
                    },
                });

                return NextResponse.json(existingConversation);
            }

            return NextResponse.json(existingConversation);
        }

        // Create a new one-on-one conversation
        const newConversation = await prisma.conversation.create({
            data: {
                isGroup: false,
                deletedBy : [],
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
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
