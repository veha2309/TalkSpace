
'use client'

import useRoutes from "@/app/hooks/useRoutes";
import { useState } from "react";
import DesktopIcon from "@/app/components/DesktopItem";
import { User } from "@prisma/client";
import Avatar from "@/app/components/Avatar"
import ProfileEdit from "@/app/components/ProfileEdit"

interface ProfileDrawerProps {
    currentUser: User
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
    currentUser
}) => {
    const routes = useRoutes();
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <ProfileEdit
                currentUser={currentUser}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)} />
            <div className="
        hidden
        lg:fixed
        lg:inset-y-0
        lg:left-0
        lg:z-40
        lg:w-20
        xl:px-6
        lg:overflow-y-auto
        lg:bg-white
        lg:border-r-[1px]
        lg:pb-4
        lg:flex
        lg:flex-col
        justify-between
        ">
                <nav className="
            mt-4
            flex
            flex-col
            jsutify-between
            ">
                    <ul
                        role="list"
                        className="
                flex
                flex-col
                items-center
                space-y-1
                "
                    >
                        {routes.map((item) => (
                            <DesktopIcon
                                key={item.label}
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                onClick={item.onClick}
                            />
                        ))}
                    </ul>
                </nav>
                <nav className="
                mt-4
                flex
                flex-col
                justify-between
                items-center
            ">
                    <div onClick={() => setIsOpen(true)}
                        className="
                        cursor-pointer
                        hover:opacity-70
                        transitiion
                        text-center
                    ">

                        <Avatar user={currentUser} />
                        <div className="text-xs font-light">
                            {currentUser?.name}
                        </div>

                    </div>
                </nav>
            </div>
        </>
    );
}

export default ProfileDrawer;