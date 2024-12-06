'use client'

import Avatar from "./Avatar";
import ImageModal from "./ImageModal";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoadingModal from "./LoadingModal";
import { error } from "console";

type user = {
    id: string
    name: string;
    image: string | null;
    email: string;
}

interface ProfileWindowProps {
    user: user;
};

const ProfileWindow: React.FC<ProfileWindowProps> = ({
    user,
}) => {

    const router = useRouter();

    const image = user.image || "/image.png"
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFriend, setIsFriend] = useState<boolean | null>(null);

    const fetchIsFriend = async () => {
            await axios.get(`/api/friend/isfriend`, {
                params: { profileUserId: user.id },
            }).then((response)=>setIsFriend(response.data.isFriend))
            .catch((error) => {
                toast.error(error?.response?.data?.message|| "Something went wrong")
            })
            
    };

    useEffect(() => {
        fetchIsFriend();
    }, [fetchIsFriend]);



    const handleRemoveFriend = useCallback(() => {
        setIsLoading(true)
        axios.delete("/api/friend/remove", {
            data: {
                userId: user.id
            }, // Pass the friendId in the request body
        })
            .then((response) => toast.success(response.data.message))
            .catch((error) => {
                toast.error(error)
            })
            .finally(() => {
                setIsLoading(false);
                setIsFriend(false);
            });

    }, [user.id])

    const conversationCreate = useCallback(() => {
        setIsLoading(true);

        axios.post('/api/conversations', {
            userId: user.id
        })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`);

            })
            .finally(() => {
                setIsLoading(false);

            })

    }, [user, router]);

    const handleAddFriend = useCallback(() => {
        setIsLoading(true);

        // Call the API to create the friendship
        axios.post('/api/friend/add', {
            userId: user.id,
        })
            .then((response) => {
                toast.success(response.data.message)
                setIsFriend(true);  // Update the state to reflect the friendship
            })
            .catch((err) => {
                console.log('Error adding friend', err);
            })
            .finally(() => {
                setIsLoading(false);
                setIsFriend(true);
            });
    }, [user]);

    const openProfilePic = () => {
        setIsOpen(true);
    }


    return (
        <>
        {isLoading && <LoadingModal/>}
            <div className="flex flex-col h-screen bg-white w-full items-center py-40">
                <div className="flex flex-col items-center justify-between h-fit gap-20">
                    <ImageModal onClose={() => setIsOpen(false)} src={image} isOpen={isOpen} />
                    <div className="    ">
                        <Avatar user={user} onClick={openProfilePic} className="size-40" show />
                    </div>
                    <div>
                        <Button
                            variant="default"
                            onClick={isFriend ? handleRemoveFriend : handleAddFriend}
                            className="bg-blue-500"
                            disabled={isLoading}
                        >
                            {isFriend ? "Remove Friend" : "Add Friend"}
                        </Button>

                        {
                            isFriend && <Button variant="outline" onClick={conversationCreate}>
                                Message
                            </Button>
                        }
                    </div>
                </div>

            </div>
        </>
    );
}

export default ProfileWindow;