'use client'

import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface UserBoxProps {
    data: User;
}

const FriendBox: React.FC<UserBoxProps> = ({
    data,
}) => {
    const router = useRouter();



    return (
        <>
            <div className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer" onClick={()=>router.push(`/friends/${data.id}`)}>
                <Avatar user={data} />
                <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-gray-800">{data.name}</p>
                        </div>
                    </div>
                </div>
                <span className="text-green-500">Friend</span>
            </div>
        </>
    );
};

export default FriendBox;
