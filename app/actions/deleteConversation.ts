import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

const deleteConversation = async (conversationId: string) => {
    const currentUser = await getCurrentUser();
  
    if (!currentUser?.id) {
      throw new Error("User not authenticated");
    }
  
    // Add the user ID to the `deletedBy` array instead of deleting the conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        deletedBy: {
          push: currentUser?.id,
        },
      },
    });
  };
  
export default deleteConversation;