'use client'

import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface UserBoxProps {
    data: User;
}

const UserBox: React.FC<UserBoxProps> = ({
    data,
}) => {
    const router = useRouter();

    // Handle making a friend


    return (
        <>
            <div className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer" onClick={()=> router.push(`/home/${data.id}`)}>
                <Avatar user={data} />
                <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-gray-800">{data.name}</p>
                        </div>
                    </div>
                </div>
                {/* Add friend button */}

            </div>
        </>
    );
};

export default UserBox;
