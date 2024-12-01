'use client'

import { User } from "@prisma/client";
import Image from "next/image";

interface AvatarGroupProps {
    users ?: User[]
}

const AvatarGroup : React.FC<AvatarGroupProps> = ({users = []}) => {
    const slicedUser = users.slice(0,3)
    const postionMap = {
        0: 'top-0 left-[12px]',
        1: 'bottom-0',
        2: 'bottom-0 right-0'
    }
    return ( 
        <div className="relative size-11">
            {slicedUser.map((user, index) => (
                <div key={user.id}
                className={`
                absolute
                inline-block
                rounded-full
                overflow-hidden
                h-[21px]
                w-[21px]
                ${postionMap[index as keyof typeof postionMap]}`}>
                    <Image
                    alt="Avatar"
                    fill
                    src={user?.image || '/images/profile.jpg'}/>
                </div>
            ))}
        </div>
     );
}
 
export default AvatarGroup;