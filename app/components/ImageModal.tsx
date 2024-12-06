'use client'

import Modal from "./Modal"
import Image from "next/image"

interface ImageModalProps {
    isOpen?: boolean
    onClose: () => void
    src?: string | null
}

const ImageModal: React.FC<ImageModalProps> = ({
    isOpen,
    onClose,
    src
}) => {
    return ( 
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="size-80">
                <Image
                alt="Image"
                className="object-cover"
                fill
                src={src!}
                />
            </div>
        </Modal>
     );
}

export default ImageModal;