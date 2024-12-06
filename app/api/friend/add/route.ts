// /app/api/friendships/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const { userId } = await request.json();

        if (!currentUser?.id || !userId) {
            return NextResponse.json(
                { message: "Missing required data" },
                { status: 400 }
            );
        }

        // Check if the user is already friends
        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { userId1: currentUser.id, userId2: userId },
                    { userId1: userId, userId2: currentUser.id },
                ],
            },
        });

        if (existingFriendship) {
            return NextResponse.json(
                { message: "Already friends" },
                { status: 409 }
            );
        }

        // Create a new friendship
        await prisma.friendship.create({
            data: {
                userId1: currentUser.id,
                userId2: userId,
            },
        });

        const userToNotify = await prisma.user.findUnique({
            where: { id: userId },
        });

        await pusherServer.trigger(`user-list-channel`, "new-friend", {
            user : userToNotify
        });
        await pusherServer.trigger(`friend-list-channel`, "friend-added", {
            user : userToNotify
        });

          

        return NextResponse.json(
            { message: "Friend added successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error adding friend", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
