// /app/api/friendships/isFriend/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const { searchParams } = new URL(request.url);
        const profileUserId = searchParams.get("profileUserId");

        if (!currentUser?.id || !profileUserId) {
            return NextResponse.json(
                { message: "Missing required data", isFriend: false },
                { status: 400 }
            );
        }

        const friendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { userId1: currentUser.id, userId2: profileUserId },
                    { userId1: profileUserId, userId2: currentUser.id },
                ],
            },
        });
            

        return NextResponse.json({ isFriend: !!friendship }, { status: 200 });
    } catch (error) {
        console.error("Error checking friendship status", error);
        return NextResponse.json(
            { message: "Internal Server Error", isFriend: false },
            { status: 500 }
        );
    }
}
