import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";

const useOtherUser = (
    conversation: FullConversationType
) => {
    const { data: session } = useSession();

    const otherUser = useMemo(() => {
        const currentUserMail = session?.user?.email;


        // Filter out the current user from the conversation's users
        const filteredUsers = conversation.participants.filter(
            (user) => user.email !== currentUserMail
        );

        return filteredUsers[0]; // Return the first "other" user or undefined
    }, [session?.user?.email, conversation.participants]);

    return otherUser;
};

export default useOtherUser;
