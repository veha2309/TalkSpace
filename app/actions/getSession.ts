import { getServerSession } from "next-auth";

import { authOptions } from "@/app/config/AuthOptions";

export default async function getSession() {
    return await getServerSession(authOptions);
}