// /app/api/friendships/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function DELETE(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const { userId } = await request.json();

        if (!currentUser?.id || !userId) {
            return NextResponse.json(
                { message: "Missing required data" },
                { status: 400 }
            );
        }

        // Find the existing friendship
        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { userId1: currentUser.id, userId2: userId },
                    { userId1: userId, userId2: currentUser.id },
                ],
            },
        });

        if (!existingFriendship) {
            return NextResponse.json(
                { message: "Friendship not found" },
                { status: 404 }
            );
        }

        // Delete the friendship
        await prisma.friendship.delete({
            where: { id: existingFriendship.id },
        });

        // Notify the friend about removal

        const userToNotify = await prisma.user.findUnique({
            where: { id: userId },
        });

        await pusherServer.trigger('user-list-channel', 'friend-removed', {
            user: userToNotify
        });

        await pusherServer.trigger('friend-list-channel', 'friend-removed', {
            user: userToNotify
        });

        return NextResponse.json(
            { message: "Friend removed successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error removing friend", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
