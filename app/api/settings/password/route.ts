import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"
import bcrypt from "bcrypt"
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function POST(
    request: Request
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email || !currentUser.hashedPassword) {
            return new NextResponse("Unautharized", { status: 401 });
        }

        const body = await request.json();
        const {
            password
        } = body;

        if(!password) {
            return NextResponse.json({error : "Missing Info"} , {status : 400})
        }

        const isSame = await bcrypt.compare(password , currentUser?.hashedPassword)
        if(isSame){
            return NextResponse.json({error : "Both passwords are the same. Please provide a different password."} , {status : 422})
        }
        const newHashedPassword = await bcrypt.hash(password, 12);

        const updateUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                hashedPassword: newHashedPassword
            },
        })
        return NextResponse.json(updateUser)

    } catch (error: unknown) {
        console.log(error, "ERROR_SETTINGS")
        return NextResponse.json({ error: "Internal Error Occured" }, { status: 500 })
    }
}