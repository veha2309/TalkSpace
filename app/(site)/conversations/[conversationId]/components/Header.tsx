'use client'

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";
import { FullConversationType } from "@/app/types";

interface HeaderProps {
    conversation: FullConversationType
}

const Header: React.FC<HeaderProps> = ({
    conversation
}) => {
    const otherUser = useOtherUser(conversation);
    const [drawerOpen, setDrawerOpen] = useState(false);


    const { members } = useActiveList();
    const isActive = otherUser?.email ? members.indexOf(otherUser.email) !== -1 : false;



    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.participants.length} members`
        }

        return isActive ? 'Active' : 'Offline'
    }, [conversation, isActive])

    return (<>
        <ProfileDrawer
            data={conversation}
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)} />
        <div className="
        bg-white
        w-full
        flex
        border-b-[1px]
        sm:px-4
        py-3
        px-4
        lg:px-6
        justify-between
        items-center
        shadows-sm
        ">
            <div className="flex gap-4 items-center">
                <Link href={"/conversations"}
                    className="
                lg:hidden
                block
                text-sky-500
                hover:text-sky-600
                transition
                cursor-pointer
                ">
                    <HiChevronLeft size={32} />
                </Link>
                {conversation.isGroup ? (
                    <AvatarGroup users={conversation.participants} />
                ) : (
                    <Avatar user={otherUser!} />
                )}
                <div className="flex flex-col">
                    <div>
                        {conversation.name || otherUser?.name}
                    </div>
                    <div className="
                    text-sm
                    font-light
                    text-neutral-500

                    ">
                        {statusText}
                    </div>
                </div>
            </div>
            <HiEllipsisHorizontal size={32} onClick={() => setDrawerOpen(true)}
                className="
                text-sky-500
                cursor-pointer
                hover:text-sky-600
                transition
                "/>
        </div></>
    );
}

export default Header; 