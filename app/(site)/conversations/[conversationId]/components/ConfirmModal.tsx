'use client'

import Modal from "@/app/components/Modal";
import useConversation from "@/app/hooks/useConversation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi"

interface ConfrmModalProps {
    isOpen?: boolean;
    onClose: () => void
}

const ConfirmModal: React.FC<ConfrmModalProps> = ({
    isOpen,
    onClose
}) => {
    const router = useRouter();
    const { conversationId } = useConversation();
    const [isLoading, setIsLoading] = useState(false);

    

    const onDelete = useCallback(() => {
        setIsLoading(true);
        

        axios.delete(`/api/conversations/${conversationId}`)
            .then(() => {
                onClose();
                router.push('/conversations');
                router.refresh();
            })
            .catch((error) => {
                toast.error("Something went wrong!");
                console.log(error)
            })
            .finally(() => setIsLoading(false))
    }, [conversationId, router, onClose])
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}>
            <div className="sm:flex sm:items-start">
                <div className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-red-100
                    sm:mx-0
                    sm:h-10
                    sm:w-10">
                    <FiAlertTriangle
                        className="h-6 w-6 text-red-600" />
                </div>
                <div className="
                    mt-3
                    text-center
                    sm:ml-4
                    sm:mt-0
                    sm:text-left">
                    <Dialog.Title
                        as="h3"
                        className="text-base font-bold leading-6 text-gray-900">
                        Delete Conversation
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Are you sure you want to delete this conversation? This action cannot be undone.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex max-sm:flex max-sm:items-center max-sm:justify-center sm:flex-row-reverse">
                <Button
                    disabled={isLoading}
                    variant="destructive"
                    onClick={onDelete}>
                    Delete
                </Button>
                <Button
                    disabled={isLoading}
                    variant="secondary"
                    onClick={onClose}>
                    Cancel
                </Button>
            </div>
        </Modal>
    );
}

export default ConfirmModal;