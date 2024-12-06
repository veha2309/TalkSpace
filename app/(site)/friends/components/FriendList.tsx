'use client'

import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { pusherClient } from "@/app/libs/pusher";
import FriendBox from "./FriendBox";
import useProfile from "@/app/hooks/useProfile";
import clsx from "clsx";
import toast from "react-hot-toast";

interface FriendListProps {
    items: User[];
}

const FriendList: React.FC<FriendListProps> = ({ items }) => {
    const [friends, setFriendList] = useState<User[]>(items || []);
    const { isOpen } = useProfile();


    useEffect(() => {
        // Subscribe to the "friend-list-channel"
        const channel = pusherClient.subscribe("friend-list-channel");

        // Handle new friend added (this could be someone added to the friend list)
        const handleFriendAdded = (data: { user: User }) => {
            if (!data.user) {
                toast.error("Something went wrong");
                return;
            }

            setFriendList((current) => {
                if (!current) {
                    return [data.user];
                }
                if (current.some((user) => user.id === data.user.id)) {
                    return current; // No duplicates
                } else {
                    return [...current, data.user]; // Add new friend to the list
                }
            });
        };

        // Handle friend removed (this could be someone removed from the friend list)
        const handleFriendRemoved = (data: { user: User }) => {
            if (!data.user) {
                toast.error("Something went wrong");
                return;
            }

            setFriendList((current) => {
                return current.filter((user) => user.id !== data.user.id); // Remove the friend from the list
            });
        };

        // Bind the events
        channel.bind("friend-added", handleFriendAdded);
        channel.bind("friend-removed", handleFriendRemoved);

        // Clean up on component unmount
        return () => {
            channel.unbind("friend-added", handleFriendAdded);
            channel.unbind("friend-removed", handleFriendRemoved);
            pusherClient.unsubscribe("friend-list-channel");
        };
    }, []);


    return (
        <aside
            className={clsx(
                "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
                isOpen ? "hidden" : "block w-full left-0"
            )}
        >
            <div className="px-5">
                <div className="flex-col">
                    <div className="text-2xl font-bold text-neutral-800 py-4">Friends</div>
                </div>
                {friends?.map((friend) => (
                    <FriendBox key={friend.id} data={friend} />
                ))}
            </div>
        </aside>
    );
};

export default FriendList;
