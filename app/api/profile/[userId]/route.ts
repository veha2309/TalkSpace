import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
    request: Request,
    context: { params: { userId: string } }
) {
    try {
        // Use destructuring to await the params safely
        const { userId } = context.params;

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is missing" },
                { status: 400 }
            );
        }

        // Fetch the user from the database
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Send user data as JSON
        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}