import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, password } = body;

        if (!email || !password || !name) {
            return new NextResponse("Missing required fields", { status: 400 });
        }
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return new NextResponse("User already exists", { status: 409 });
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

        // Exclude sensitive fields from the response

        

        return NextResponse.json(newUser);

    } catch (error: unknown) {
        console.error("REGISTRATION_ERROR:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
