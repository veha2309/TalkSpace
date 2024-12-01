import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

interface Iparams {
    conversationId: string;
}

const ConversationPage = async ({ params }: { params: Iparams }) => {
    const { conversationId } = params; // Extract dynamic route parameter

    try {
        const conversation = await getConversationById(conversationId);
        const messages = await getMessages(conversationId);

        if (!conversation) {
            return (
                <div className="lg:pl-80 h-full">
                    <div className="h-full flex flex-col">
                        <EmptyState message="Conversation not found." />
                    </div>
                </div>
            );
        }

        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <Header conversation={conversation} />
                    <Body initialMessages={messages} />
                    <Form />
                </div>
            </div>
        );
    } catch (error) {
        console.error("CONVERSATION_LOADING_ERROR:", error);
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState message="Failed to load the conversation." />
                </div>
            </div>
        );
    }
};

export default ConversationPage;
