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
    initialItems: FullConversationType[]; // List of conversations (initial state)
    users: User[]; // List of users (participants in the conversations)
}

const ConversationList: React.FC<ConversationListProps> = ({ initialItems, users }) => {
    console.log(initialItems)
    const session = useSession();
    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const { conversationId, isOpen } = useConversation();

    const pusherKey = useMemo(() => session.data?.user?.email, [session.data?.user?.email]);
    console.log(pusherKey)

    useEffect(() => {
        if (typeof window === 'undefined' || !pusherKey) {
            return;
        }

        pusherClient.subscribe(pusherKey);

        const newConversationHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                // Prevent duplicate conversations
                if (find(current, { id: conversation.id })) {
                    return current;
                }
                return [conversation, ...current]; // Add new conversation to the list
            });
        };

        const updateHandler = (conversation: FullConversationType) => {
            setItems((current) => current.map((currentConversation) => {
                if (currentConversation.id === conversation.id) {
                    return {
                        ...currentConversation,
                        messages: conversation.messages // Update messages in the conversation
                    };
                }
                return currentConversation;
            }));
        };

        const removeHandler = (conversation: FullConversationType) => {
            setItems((current) => current.filter((convo) => convo.id !== conversation.id));

            if (conversationId === conversation.id) {
                router.push('/conversations'); // Redirect if the conversation was removed
            }
        };

        // Bind to Pusher events
        pusherClient.bind('conversations:new', newConversationHandler);
        pusherClient.bind('conversations:update', updateHandler);
        pusherClient.bind('conversations:remove', removeHandler);

        return () => {
            // Cleanup Pusher bindings on component unmount
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind('conversation:new', newConversationHandler);
            pusherClient.unbind('conversation:update', updateHandler);
            pusherClient.unbind('conversation:remove', removeHandler);

        };
    }, [pusherKey, conversationId, router]);

    console.log(items)
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
                                data={item} // Display the conversation data
                                selected={conversationId === item.id} // Highlight the selected conversation
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
