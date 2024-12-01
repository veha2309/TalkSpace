import { Message, User } from "@prisma/client";

export type FullMessageType = Message & {
    sender: User;
};

export type FullConversationType = {
    id: string;
    name: string | null;
    isGroup: boolean;
    messages: FullMessageType[];
    users: User[]; // Extracted from `participants`
    createdAt: Date;
    updatedAt: Date;
    deletedBy: string[]; // User IDs of those who deleted the conversation
};
