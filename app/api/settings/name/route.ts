import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function POST(
    request: Request
) {
    try {
        const currentUser =  await getCurrentUser();
        const body = await request.json();
        const {
            name
        } = body;

        if (!currentUser?.id || !currentUser?.email) return new NextResponse("Unautharized", { status: 401 });

        if(name===currentUser.name) {
            return NextResponse.json({error : "Both passwords are the same. Please provide a different password."} , {status : 422})
        }

        const updateUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                name: name,
            },
        })
        return NextResponse.json(updateUser)

    } catch (error: unknown) {
        console.log(error, "ERROR_SETTINGS")
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}