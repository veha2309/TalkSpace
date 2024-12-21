'use client'

import { FullConversationType } from "@/app/types";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import { pusherClient } from "@/app/libs/pusher";

interface ConversationBoxProps {
    data: FullConversationType,
    selected: boolean,
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {
    const otherUser = useOtherUser(data);
    const session = useSession();
    const router = useRouter();

    // Define memoized values and callbacks
    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`);
    }, [data.id, router]);



    const lastMessage = useMemo(() => {
        return data?.messages?.[data.messages.length - 1];
    }, [data?.messages]);

    const userEmail = useMemo(() => session.data?.user?.email, [session.data?.user?.email]);

    const hasSeen = useMemo(() => {
        if (!lastMessage) return false;
        const seenArray = lastMessage.seenIds || [];
        return seenArray.includes(userEmail || "");
    }, [userEmail, lastMessage]);

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return 'Sent an image';
        }

        if (lastMessage) {
            return lastMessage.content;
        }

        return "Started a Conversation!";
    }, [lastMessage]);

    console.log(lastMessageText)

    const formattedDate = useMemo(() => {
        if (lastMessage?.createdAt) {
            return format(new Date(lastMessage.createdAt), 'p');
        }
        return '';
    }, [lastMessage?.createdAt]);

    useEffect(() => {
        const channel = pusherClient.subscribe(data.id);

        const handleNewMessage = (newMessage: FullConversationType['messages'][number]) => {
            // Append the new message to the conversation
            data.messages = [...data.messages, newMessage];
        };

        channel.bind('messages:new', handleNewMessage);

        return () => {
            channel.unbind('messages:new', handleNewMessage);
            pusherClient.unsubscribe(data.id);
        };
    }, [data.id, data.messages]);

    if (!otherUser) return null; // Safeguard for undefined `otherUser`
    return (
        <div
            onClick={handleClick}
            className={clsx(`
            w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer`,
                selected ? 'bg-neutral-100' : 'bg-white'
            )}
        >
            {data.isGroup ? (
                <AvatarGroup users={data.participants} />
            ) : (
                <Avatar user={otherUser} />
            )}
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-base font-medium text-gray-900">
                            {data.name || otherUser.name || "Unknown"}
                        </p>
                        {lastMessage?.createdAt && (
                            <p className="text-xs text-gray-400 font-light">
                                {formattedDate}
                            </p>
                        )}
                    </div>
                    <p className={clsx(
                        `truncate text-sm`,
                        hasSeen ? `text-gray-500` : `text-black font-medium`
                    )}>
                        {lastMessageText}
                    </p>
                </div>
            </div>
        </div>
    );

}

export default ConversationBox;
