import getConversationById from "@/app/actions/getConversationById"
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

interface Iparams {
    conversationId: string
}

const ConversationPage = async ({ params }: { params: Iparams }) => {
    try {
        const conversation = await getConversationById(params.conversationId);
        const messages = await getMessages(params.conversationId);

        if (!conversation) {
            return (
                <div className="lg:pl-80 h-full">
                    <div className="h-full flex flex-col">
                        <EmptyState />
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
    } catch (error : unknown) {
        console.log("CONVERSATION_LOADING_ERROR : " , error)
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState message="Failed to load conversation." />
                </div>
            </div>
        );
    }
}

export default ConversationPage;
