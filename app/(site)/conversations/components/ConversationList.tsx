'use client'

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import { MdOutlineGroupAdd } from "react-icons/md";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({ initialItems, users }) => {
    const session = useSession();
    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const { conversationId, isOpen } = useConversation();

    const pusherKey = useMemo(() => session.data?.user?.email, [session.data?.user?.email]);

    useEffect(() => {
        if (typeof window === 'undefined' || !pusherKey) {
            return;
        }

        pusherClient.subscribe(pusherKey);

        const newConversationHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                if (find(current, { id: conversationId })) {
                    return current;
                }
                return [conversation, ...current];
            });
        };

        const updateHandler = (conversation: FullConversationType) => {
            setItems((current) => current.map((currentConversation) => {
                if (currentConversation.id === conversation.id) {
                    return {
                        ...currentConversation,
                        messages: conversation.messages
                    };
                }
                return currentConversation;
            }));
        };

        const removeHandler = (conversation: FullConversationType) => {
            setItems((current) => current.filter((convo) => convo.id !== conversation.id));

            if (conversationId === conversation.id) {
                router.push('/conversations');
            }
        };

        pusherClient.bind('conversation:new', newConversationHandler);
        pusherClient.bind('conversation:update', updateHandler);
        pusherClient.bind('conversation:remove', removeHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind('conversation:new', newConversationHandler);
            pusherClient.unbind('conversation:update', updateHandler);
            pusherClient.unbind('conversation:remove', removeHandler);
        };
    }, [pusherKey, conversationId, router]);

    return (
        <>
            <GroupChatModal
                users={users}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <aside className={clsx(
                `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`,
                isOpen ? 'hidden' : 'block w-full left-0'
            )}>
                <div className="px-5">
                    <div className="flex justify-between mb-4 pt-4">
                        <div className="text-2xl font-bold text-neutral-800">
                            Messages
                        </div>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="rounded-full p-2 bg-gray-100 text-gray-600 hover:opacity-75 transition cursor-pointer"
                        >
                            <MdOutlineGroupAdd size={20} />
                        </div>
                    </div>
                    {items.length > 0 ? (
                        items.map((item) => (
                            <ConversationBox
                                key={item.id}
                                data={item}
                                selected={conversationId === item.id}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No conversations yet</p>
                    )}
                </div>
            </aside>
        </>
    );
};

export default ConversationList;
