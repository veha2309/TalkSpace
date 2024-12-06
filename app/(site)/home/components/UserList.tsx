'use client'

import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { pusherClient } from "@/app/libs/pusher";
import UserBox from "./UserBox";
import toast from "react-hot-toast";

interface UserListProps {
    items: User[];
}

const UserList: React.FC<UserListProps> = ({ items }) => {
    const [users, setUsers] = useState(items || []);


    useEffect(() => {
        const channel = pusherClient.subscribe("user-list-channel");

        // Handle new friend added (this could be someone added to the user list)
        const handleNewFriend = (data: { user: User }) => {
            if (!data.user) {
                toast.error("Something went wrong");
                return;
            }

            setUsers((current) => {
                if (!current) {
                    return [data.user];
                }
                if (current.some((user) => user.id === data.user.id)) {
                    return current; // No duplicates
                } else {
                    return [...current, data.user]; // Add new user to the list
                }
            });
        };

        // Handle friend removed (this could be someone removed from the user list)
        const handleFriendRemoved = (data: { user: User }) => {
            if (!data.user) {
                toast.error("Something went wrong");
                return;
            }

            setUsers((current) => {
                return current.filter((user) => user.id !== data.user.id); // Remove the user from the list
            });
        };

        // Bind the events
        channel.bind("new-friend", handleNewFriend);
        channel.bind("friend-removed", handleFriendRemoved);

        // Clean up on component unmount
        return () => {
            channel.unbind("new-friend", handleNewFriend);
            channel.unbind("friend-removed", handleFriendRemoved);
            pusherClient.unsubscribe("user-list-channel");
        };
    }, []);




    return (
        <aside className="
            fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200
            block w-full left-0
        ">
            <div className="px-5">
                <div className="flex-col">
                    <div className="text-2xl font-bold text-neutral-800 py-4">People</div>
                </div>
                {users?.map((user) => (
                    <UserBox key={user.id} data={user} />
                ))}
            </div>
        </aside>
    );
};

export default UserList;
