import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, password } = body;

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the user
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
            },
        });

        // Create a friendship relation for the new user (if applicable, e.g., default friendship)
        // You can choose to create a friendship automatically with a default user (e.g., admin)
        // or leave this step for the client-side to handle once the user is created.
        // Example: create a default friend with an admin user
        const defaultFriend = await prisma.user.findFirst({ where: { email: "admin@example.com" } });
        if (defaultFriend) {
            await prisma.friendship.create({
                data: {
                    userId1: newUser.id,
                    userId2: defaultFriend.id,
                },
            });
        }

        return NextResponse.json(newUser);
    } catch (error: unknown) {
        console.error("REGISTRATION_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
