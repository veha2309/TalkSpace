'use client'

import { User } from "@prisma/client";
import Image from "next/image";
import useActiveList from "../hooks/useActiveList";
import clsx from "clsx";



type user = {
    name: string;
    image: string | null;
    email: string;
}

interface AvatarProps {
    user: User | user;
    onClick?: () => void;
    show?: boolean
    className?: string
}


const Avatar: React.FC<AvatarProps> = ({
    user,
    onClick,
    show,
    className
}) => {
    const { members } = useActiveList();
    const isActive = user ? (user.email ? members.indexOf(user.email) !== -1 : false) : false;
    const src = user?.image || "/image.png";
    return (
        <div className="relative space-y-4">
            <div className={clsx(
                `size-14 rounded-full cursor-pointer`,
                className
            )} onClick={onClick}>
                <Image src={src} height={200} width={200} alt="Avatar" className="rounded-full" />

            </div>
            <div className="text-center font-bold text-xl">
                {show && user.name}
            </div>

            {isActive && (
                <span className="
                    absolute
                    block
                    rounded-full
                    bg-green-500
                    ring-2
                    ring-white
                    top-0
                    right-0
                    h-2
                    w-2
                    md:h-3
                    md:w-3
                    "/>
            )}
        </div>

    );
}

export default Avatar;