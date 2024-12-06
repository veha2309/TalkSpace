import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { currentPassword } = body;

        const currentUser = await getCurrentUser();

        if (!currentPassword) {
            return NextResponse.json({ message: "Password is required" }, { status: 400 });
        }

        if (!currentUser?.email || !currentUser.hashedPassword) {
            return NextResponse.json({ message: "Missing Info" }, { status: 400 });
        }

        const isValid = await bcrypt.compare(currentPassword, currentUser.hashedPassword)
        return NextResponse.json(isValid);

    } catch (error: unknown) {
        console.log("VALIDATION_ERROR : ", error);
        return NextResponse.json({ message: "Internal Error Occured" }, { status: 500 });

    }
}