'use client'

import { User } from "@prisma/client";
import Image from "next/image";


interface AvatarProps{
    user : User;
    onClick ?: () => void;
}


const Avatar : React.FC<AvatarProps> = ({
    user,
    onClick
}) => {
    const src = user.image || "/image.png";
    return ( 
        <div className="size-14 rounded-full cursor-pointer" onClick={onClick}>
            <Image src={src} height={200} width={200} alt="Avatar" className="rounded-full"/>
        </div>
     );
}
 
export default Avatar;