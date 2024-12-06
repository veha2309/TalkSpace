import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";


export async function POST(
    request: Request
) {
    try {
        const body = await request.json();
        const currentUser = await getCurrentUser(); 
        const { message , conversationId } = body

        if (!currentUser?.id || !currentUser.email) {
            return NextResponse.json({ message: "Unauthenticated request" }, { status: 400 });
        }

        if(!conversationId) return NextResponse.json({message : "Missing Required Info"} , {status : 404});

        const senderId = currentUser.id


       


        const newMessage = await prisma.message.create({
            data: {
                content: message,
                senderId,
                conversationId

            }
        });

        return NextResponse.json(newMessage);
    } catch (errors: unknown) {
        console.log("MESSAGIN_ERROR : " , errors);
        return NextResponse.json({message : "Something Went Wrong!"}, {status : 500});
    }

}